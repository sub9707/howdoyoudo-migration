import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin 경로 보호
  if (pathname.startsWith('/admin')) {
    // 로그인 페이지는 제외
    if (pathname === '/admin/login') {
      // 이미 로그인된 경우 대시보드로 리다이렉트
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        const session = await verifyToken(token);
        if (session) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }
      return NextResponse.next();
    }

    // 토큰 확인
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 토큰 검증
    const session = await verifyToken(token);
    if (!session) {
      // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    // 토큰이 유효하면 계속 진행
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};