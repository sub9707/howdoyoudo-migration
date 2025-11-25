import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query, queryOne } from '@/utils/db';
import { generateToken } from '@/lib/jwt';
import { Admin, AdminLoginRequest } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const body: AdminLoginRequest = await request.json();
    const { username, password } = body;

    // 입력값 검증
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // IP 주소 추출
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // User-Agent 추출
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 관리자 조회
    const admin = await queryOne<Admin>(
      'SELECT * FROM admins WHERE username = ? AND is_active = 1',
      [username]
    );

    if (!admin) {
      // 실패 로그 기록
      await query(
        'INSERT INTO admin_login_logs (admin_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)',
        [0, ip, userAgent, 'failed']
      );
      
      return NextResponse.json(
        { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      // 실패 로그 기록
      await query(
        'INSERT INTO admin_login_logs (admin_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)',
        [admin.id, ip, userAgent, 'failed']
      );

      return NextResponse.json(
        { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 로그인 정보 업데이트
    await query(
      `UPDATE admins 
       SET ip_address = ?, last_login = NOW(), login_count = login_count + 1 
       WHERE id = ?`,
      [ip, admin.id]
    );

    // 성공 로그 기록
    await query(
      'INSERT INTO admin_login_logs (admin_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)',
      [admin.id, ip, userAgent, 'success']
    );

    // JWT 토큰 생성
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      name: admin.name,
    });

    // 응답 생성 및 쿠키 설정
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
      token,
    });

    // HTTP-only 쿠키로 토큰 저장
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}