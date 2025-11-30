import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = '@howdoyoudo2025';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'videos'; // 'videos' or 'shorts'
  const pageToken = searchParams.get('pageToken') || '';


  try {
    // 채널 핸들로 채널 정보 가져오기
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`;
    
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();
    
    
    if (!channelData.items || channelData.items.length === 0) {
      console.error('Channel not found:', channelData);
      return NextResponse.json({ 
        error: 'Channel not found',
        details: channelData 
      }, { status: 404 });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 더 많은 결과를 가져와서 필터링
    const maxResults = 50;
    
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`;
    
    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ 
        videos: [], 
        nextPageToken: undefined, 
        totalResults: 0 
      });
    }

    // 동영상 상세 정보 가져오기
    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');
    
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();


    if (!videosData.items) {
      console.error('No video items:', videosData);
      return NextResponse.json({ 
        videos: [], 
        nextPageToken: undefined, 
        totalResults: 0 
      });
    }

    // 쇼츠 필터링
    const allVideos = videosData.items.map((video: any) => {
      const duration = parseDuration(video.contentDetails.duration);
      // 60초 이하면 쇼츠로 판단
      const isShort = duration <= 60;
      
      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        isShort,
      };
    });


    // 타입별 필터링
    const filteredVideos = allVideos.filter((video: any) => {
      if (type === 'shorts') return video.isShort;
      return !video.isShort;
    });

    // 12개씩 잘라서 반환
    const videos = filteredVideos.slice(0, 12);

    return NextResponse.json({
      videos,
      nextPageToken: filteredVideos.length > 12 ? playlistData.nextPageToken : undefined,
      totalResults: filteredVideos.length,
    });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch YouTube videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ISO 8601 duration을 초로 변환
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = match?.[1] ? parseInt(match[1]) : 0;
  const minutes = match?.[2] ? parseInt(match[2]) : 0;
  const seconds = match?.[3] ? parseInt(match[3]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}