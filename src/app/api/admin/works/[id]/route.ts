import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/utils/db';
import { verifyToken } from '@/lib/jwt';
import { WorkItemDB } from '@/types/works';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    const work = await queryOne<WorkItemDB>(
      `SELECT 
        w.id,
        w.title,
        w.category_id,
        c.display_name as category_display_name,
        w.description,
        w.event_date,
        w.thumbnail_image,
        w.content_images,
        w.is_active,
        w.view_count,
        w.created_at,
        w.updated_at
       FROM works w
       JOIN work_categories c ON w.category_id = c.id
       WHERE w.id = ?`,
      [workId]
    );

    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: work,
    });
  } catch (error) {
    console.error('Error fetching work detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load work detail' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, categoryId, description, eventDate, thumbnailImage, contentImages, isActive } = body;

    // 유효성 검사
    if (!title || !categoryId || !eventDate || !thumbnailImage || !contentImages || contentImages.length === 0) {
      return NextResponse.json(
        { success: false, error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 게시글 존재 확인
    const existing = await queryOne('SELECT id FROM works WHERE id = ?', [workId]);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      );
    }

    // 데이터 업데이트
    await query(
      `UPDATE works 
       SET title = ?, 
           category_id = ?, 
           description = ?, 
           event_date = ?, 
           thumbnail_image = ?, 
           content_images = ?, 
           is_active = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        title.trim(),
        categoryId,
        description?.trim() || '',
        eventDate,
        thumbnailImage,
        JSON.stringify(contentImages),
        isActive ? 1 : 0,
        workId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: '게시글이 성공적으로 수정되었습니다.',
    });
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update work' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    // 게시글 존재 확인
    const existing = await queryOne('SELECT id FROM works WHERE id = ?', [workId]);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      );
    }

    // 소프트 삭제 (is_active = 0)
    await query('UPDATE works SET is_active = 0, updated_at = NOW() WHERE id = ?', [workId]);

    return NextResponse.json({
      success: true,
      message: '게시글이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete work' },
      { status: 500 }
    );
  }
}