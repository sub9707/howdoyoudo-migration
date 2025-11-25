import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: '로그아웃되었습니다.',
    });

    // 쿠키 삭제
    response.cookies.delete('admin_token');

    return response;

  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}