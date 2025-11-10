import { NextRequest, NextResponse } from 'next/server';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content?: string;
  status: 'published' | 'draft' | 'archived';
}

interface CreatePostRequest {
  title: string;
  content: string;
  author: string;
}

interface UpdatePostRequest {
  id: number;
  title?: string;
  content?: string;
  status?: 'published' | 'draft' | 'archived';
}

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let posts: Post[] = [
  { 
    id: 1, 
    title: '웹 개발 트렌드 2024', 
    author: 'admin', 
    date: '2024-09-01',
    content: '2024년 웹 개발의 최신 트렌드에 대해...',
    status: 'published'
  },
  { 
    id: 2, 
    title: 'React 18의 새로운 기능들', 
    author: 'user1', 
    date: '2024-09-02',
    content: 'React 18에서 추가된 동시성 기능들...',
    status: 'published'
  },
  { 
    id: 3, 
    title: 'TypeScript 고급 활용법', 
    author: 'user2', 
    date: '2024-09-03',
    content: 'TypeScript를 더욱 효과적으로 사용하는 방법...',
    status: 'published'
  },
  { 
    id: 4, 
    title: 'Next.js 15 업데이트 내용', 
    author: 'admin', 
    date: '2024-09-04',
    content: 'Next.js 15에서 변경된 주요 기능들...',
    status: 'draft'
  },
  { 
    id: 5, 
    title: 'CSS Grid vs Flexbox 비교', 
    author: 'user3', 
    date: '2024-09-05',
    content: 'CSS Grid와 Flexbox의 차이점과 사용 시나리오...',
    status: 'published'
  }
];

let nextId = 6;

// GET - 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status') as 'published' | 'draft' | 'archived' | null;
    const author = url.searchParams.get('author');

    // 필터링
    let filteredPosts = [...posts];
    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }
    if (author) {
      filteredPosts = filteredPosts.filter(post => post.author === author);
    }

    // 정렬 (최신순)
    filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredPosts.length / limit),
          totalItems: filteredPosts.length,
          limit
        }
      }
    });

  } catch (error) {
    console.error('게시글 목록 조회 중 오류:', error);
    return NextResponse.json(
      { error: '게시글 목록을 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST - 새 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const body: CreatePostRequest = await request.json();
    const { title, content, author } = body;

    // 입력값 검증
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: '제목, 내용, 작성자는 필수입니다.' },
        { status: 400 }
      );
    }

    // 새 게시글 생성
    const newPost: Post = {
      id: nextId++,
      title,
      content,
      author,
      date: new Date().toISOString().split('T')[0],
      status: 'published'
    };

    posts.unshift(newPost); // 맨 앞에 추가

    return NextResponse.json({
      success: true,
      data: newPost,
      message: '게시글이 성공적으로 작성되었습니다.'
    });

  } catch (error) {
    console.error('게시글 작성 중 오류:', error);
    return NextResponse.json(
      { error: '게시글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT - 게시글 수정
export async function PUT(request: NextRequest) {
  try {
    const body: UpdatePostRequest = await request.json();
    const { id, title, content, status } = body;

    // 게시글 찾기
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 게시글 수정
    if (title !== undefined) posts[postIndex].title = title;
    if (content !== undefined) posts[postIndex].content = content;
    if (status !== undefined) posts[postIndex].status = status;

    return NextResponse.json({
      success: true,
      data: posts[postIndex],
      message: '게시글이 성공적으로 수정되었습니다.'
    });

  } catch (error) {
    console.error('게시글 수정 중 오류:', error);
    return NextResponse.json(
      { error: '게시글 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - 게시글 삭제
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json(
        { error: '게시글 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 게시글 찾기 및 삭제
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedPost,
      message: '게시글이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('게시글 삭제 중 오류:', error);
    return NextResponse.json(
      { error: '게시글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}