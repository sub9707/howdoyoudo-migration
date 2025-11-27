import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { WorkItemDB } from '@/types/works';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, categoryId, eventDate, isActive } = body;

    // 부분 업데이트를 위한 동적 쿼리 생성
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (categoryId !== undefined) {
      // 카테고리 ID 유효성 검증
      const categoryExists = await query(
        'SELECT id FROM work_categories WHERE id = ?',
        [categoryId]
      );

      if (categoryExists.length === 0) {
        return NextResponse.json(
          { success: false, error: '유효하지 않은 카테고리입니다.' },
          { status: 400 }
        );
      }

      updates.push('category_id = ?');
      values.push(categoryId);
    }

    if (eventDate !== undefined) {
      updates.push('event_date = ?');
      values.push(eventDate);
    }

    if (isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 내용이 없습니다.' },
        { status: 400 }
      );
    }

    // updated_at 자동 추가
    updates.push('updated_at = NOW()');
    values.push(workId);

    // 작업 업데이트
    await query(
      `UPDATE works SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // 업데이트된 작업 정보 조회
    const updatedWork = await query<WorkItemDB>(
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

    if (updatedWork.length === 0) {
      return NextResponse.json(
        { success: false, error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '작업이 성공적으로 수정되었습니다.',
      work: updatedWork[0],
    });
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json(
      { success: false, error: '작업 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    // 작업 삭제 (실제 삭제 대신 is_active를 0으로 설정)
    await query(
      'UPDATE works SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [workId]
    );

    return NextResponse.json({
      success: true,
      message: '작업이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json(
      { success: false, error: '작업 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}