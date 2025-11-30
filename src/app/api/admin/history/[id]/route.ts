import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/utils/db';

// PUT - history 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { year, date, description } = body;

    const result = await query(
      'UPDATE history SET year = ?, date = ?, description = ? WHERE id = ?',
      [year, date, description, id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'History not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'History updated' });
  } catch (error) {
    console.error('Failed to update history:', error);
    return NextResponse.json(
      { error: 'Failed to update history' },
      { status: 500 }
    );
  }
}

// DELETE - history 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const result = await query('DELETE FROM history WHERE id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'History not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'History deleted' });
  } catch (error) {
    console.error('Failed to delete history:', error);
    return NextResponse.json(
      { error: 'Failed to delete history' },
      { status: 500 }
    );
  }
}