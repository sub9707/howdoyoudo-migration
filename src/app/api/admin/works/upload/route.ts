import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: '파일 크기는 50MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '지원하지 않는 파일 형식입니다.' },
        { status: 400 }
      );
    }

    // 파일 이름 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${ext}`;

    // 외부 서버 업로드 URL
    const uploadServerUrl = process.env.UPLOAD_SERVER_URL || 'http://subdevpi.duckdns.org:3000';
    const uploadPath = 'howdoyoudo/works'; // 업로드할 경로
    
    // FormData 생성 (외부 서버로 전송)
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('filename', filename);

    // 외부 서버로 업로드
    const uploadResponse = await fetch(`${uploadServerUrl}/upload/${uploadPath}`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('외부 서버 업로드 실패:', errorText);
      return NextResponse.json(
        { success: false, error: '외부 서버로의 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    const uploadResult = await uploadResponse.json();
    
    // 업로드 성공 시 파일 URL 생성
    // 외부 서버의 응답 형식: { success: true, message: '...', file: { ... } }
    const fileUrl = `${uploadServerUrl}/file/${uploadPath}/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename: filename,
        uploadResult: uploadResult, // 디버깅용
      },
    });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { success: false, error: '파일 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}