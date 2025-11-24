import { NextRequest, NextResponse } from 'next/server';

export interface User {
  username: string;
  password: string;
  name: string;
  recentLogin: string;
}

interface UserData {
  users: User[];
}

interface LoginRequest {
  username: string;
  password: string;
}

// tempSecret.json을 import로 불러오기
import userDataJson from './tempSecret.json';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // 입력값 검증
    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 데이터 가져오기
    let users: User[] = [];
    try {
      const userData: UserData = userDataJson as UserData;
      users = userData.users || [];
    } catch (error) {
      console.error('tempSecret.json 파일을 찾을 수 없어 기본 사용자 데이터를 사용합니다.', error);
      users = [
        {
          username: 'admin',
          password: 'admin123',
          name: '관리자',
          recentLogin: '2024-09-04T10:30:00Z'
        }
      ];
    }

    // 사용자 인증
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 제거 후 반환
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: '로그인 성공'
    });

  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}