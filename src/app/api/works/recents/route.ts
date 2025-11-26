import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { WorkItemDB, WorkItem } from '@/types/works';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    // 최신 작업 조회
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
        w.view_count
       FROM works w
       JOIN work_categories c ON w.category_id = c.id
       WHERE w.is_active = 1
       ORDER BY w.event_date DESC, w.created_at DESC
       LIMIT ?`,
      [limit]
    );

    // 데이터 변환
    const transformedWorks: WorkItem[] = works.map(work => {
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

      return {
        id: work.id,
        title: work.title,
        categoryId: work.category_id,
        categoryDisplayName: work.category_display_name,
        description: work.description,
        eventDate: work.event_date,
        eventYear: new Date(work.event_date).getFullYear().toString(),
        thumbnailImage: work.thumbnail_image,
        contentImages,
        viewCount: work.view_count,
      };
    });

    return NextResponse.json({
      works: transformedWorks,
      totalCount: transformedWorks.length,
    });
  } catch (error) {
    console.error("Error reading recent works data:", error);
    return NextResponse.json(
      { error: "Failed to load recent works data" },
      { status: 500 }
    );
  }
}