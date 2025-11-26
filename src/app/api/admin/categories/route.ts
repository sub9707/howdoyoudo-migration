import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { verifyToken } from '@/lib/jwt';

// GET - 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const categories = await query(
      `SELECT id, display_name, is_active, created_at
       FROM work_categories
       ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '카테고리 목록을 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST - 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName } = body;

    if (!displayName || !displayName.trim()) {
      return NextResponse.json(
        { success: false, error: '카테고리 이름을 입력해주세요.' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO work_categories (display_name, is_active) VALUES (?, 1)',
      [displayName.trim()]
    );

    return NextResponse.json({
      success: true,
      message: '카테고리가 성공적으로 생성되었습니다.',
      data: { id: (result as any).insertId },
    });
  } catch (error) {
    console.error('카테고리 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '카테고리 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - 카테고리 삭제
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: '카테고리 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 해당 카테고리를 사용하는 게시글이 있는지 확인
    const worksCount = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM works WHERE category_id = ?',
      [parseInt(categoryId)]
    );

    if (worksCount[0].count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: '이 카테고리를 사용하는 게시글이 있어 삭제할 수 없습니다.',
        },
        { status: 400 }
      );
    }

    await query('DELETE FROM work_categories WHERE id = ?', [
      parseInt(categoryId),
    ]);

    return NextResponse.json({
      success: true,
      message: '카테고리가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('카테고리 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '카테고리 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}