import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

interface HistoryItem {
  id: number;
  year: string;
  date: string;
  description: string;
}

interface YearData {
  year: string;
  events: Array<{
    date: string;
    description: string;
  }>;
}

export async function GET() {
  try {
    // 모든 항목 조회 (year를 숫자로 변환해서 정렬)
    const rows = await query<HistoryItem>(
      'SELECT * FROM history ORDER BY CAST(year AS UNSIGNED) DESC, date DESC'
    );

    // year별로 그룹화
    const groupedByYear = rows.reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = [];
      }
      acc[item.year].push({
        date: item.date,
        description: item.description,
      });
      return acc;
    }, {} as Record<string, Array<{ date: string; description: string }>>);

    // 배열로 변환 후 최신순 정렬
    const companyHistory: YearData[] = Object.entries(groupedByYear)
      .map(([year, events]) => ({
        year,
        events,
      }))
      .sort((a, b) => {
        const yearA = parseInt(a.year);
        const yearB = parseInt(b.year);
        return yearB - yearA; // 큰 숫자(최신) 먼저
      });

    return NextResponse.json({ companyHistory });
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}