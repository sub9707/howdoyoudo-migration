export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  isShort: boolean;
}

export interface YouTubeResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}