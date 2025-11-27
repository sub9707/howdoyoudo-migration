import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { verifyToken } from '@/lib/jwt';
import { WorkItemDB } from '@/types/works';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    // WHERE 조건 구성
    let whereConditions = ['1=1'];
    const queryParams: any[] = [];

    if (categoryId && categoryId !== 'all') {
      whereConditions.push('w.category_id = ?');
      queryParams.push(parseInt(categoryId));
    }

    if (search) {
      whereConditions.push('(w.title LIKE ? OR w.description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // 전체 개수 조회
    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count 
       FROM works w
       WHERE ${whereClause}`,
      queryParams
    );
    const totalCount = countResult[0]?.count || 0;

    // 데이터 조회
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
        w.is_active,
        w.view_count,
        w.created_at,
        w.updated_at
       FROM works w
       JOIN work_categories c ON w.category_id = c.id
       WHERE ${whereClause}
       ORDER BY w.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: {
        works,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching works:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load works data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, categoryId, description, eventDate, thumbnailImage, contentImages, isActive } = body;

    // 유효성 검사
    if (!title || !categoryId || !eventDate || !thumbnailImage || !contentImages || contentImages.length === 0) {
      return NextResponse.json(
        { success: false, error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 데이터 삽입
    const result = await query(
      `INSERT INTO works 
       (title, category_id, description, event_date, thumbnail_image, content_images, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        categoryId,
        description?.trim() || '',
        eventDate,
        thumbnailImage,
        JSON.stringify(contentImages),
        isActive ? 1 : 0,
      ]
    );

    return NextResponse.json({
      success: true,
      message: '게시글이 성공적으로 생성되었습니다.',
      data: { id: (result as any).insertId },
    });
  } catch (error) {
    console.error("Error creating work:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create work" },
      { status: 500 }
    );
  }
}