// src/app/api/works/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { WorkItemDB, WorkItem } from '@/types/works';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workId = parseInt(id);

    if (isNaN(workId)) {
      return NextResponse.json(
        { error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    // 작업 상세 정보 조회
    const works = await query<WorkItemDB>(
      `SELECT 
        w.id,
        w.title,
        w.category_id,
        c.display_name as category_display_name,
        w.description,
        w.event_date,
        w.thumbnail_image,
        w.content_images,
        w.view_count,
        w.created_at,
        w.updated_at
       FROM works w
       JOIN work_categories c ON w.category_id = c.id
       WHERE w.id = ? AND w.is_active = 1`,
      [workId]
    );

    if (works.length === 0) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    const work = works[0];

    // 조회수 증가
    await query(
      'UPDATE works SET view_count = view_count + 1 WHERE id = ?',
      [workId]
    );

    // 이전/다음 작업 조회
    const prevWork = await query<{ id: number; title: string }>(
      `SELECT id, title 
       FROM works 
       WHERE id < ? AND is_active = 1 
       ORDER BY id DESC 
       LIMIT 1`,
      [workId]
    );

    const nextWork = await query<{ id: number; title: string }>(
      `SELECT id, title 
       FROM works 
       WHERE id > ? AND is_active = 1 
       ORDER BY id ASC 
       LIMIT 1`,
      [workId]
    );

    // 데이터 변환
    let contentImages: string[] = [];
    if (typeof work.content_images === 'string') {
      try {
        contentImages = JSON.parse(work.content_images);
      } catch (e) {
        contentImages = [];
      }
    } else {
      contentImages = work.content_images || [];
    }

    const transformedWork: WorkItem = {
      id: work.id,
      title: work.title,
      categoryId: work.category_id,
      categoryDisplayName: work.category_display_name,
      description: work.description,
      eventDate: work.event_date,
      eventYear: new Date(work.event_date).getFullYear().toString(),
      thumbnailImage: work.thumbnail_image,
      contentImages,
      viewCount: work.view_count + 1, // 증가된 조회수
    };

    return NextResponse.json({
      work: transformedWork,
      navigation: {
        prev: prevWork[0] || null,
        next: nextWork[0] || null,
      },
    });
  } catch (error) {
    console.error('Error reading work detail:', error);
    return NextResponse.json(
      { error: 'Failed to load work detail' },
      { status: 500 }
    );
  }
}