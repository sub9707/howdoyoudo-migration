import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Google Analytics Data API 클라이언트 초기화
// 서비스 계정 JSON 키가 필요합니다
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const propertyId = process.env.GA_PROPERTY_ID;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateRange = searchParams.get('dateRange') || '7daysAgo';

    if (!propertyId) {
      return NextResponse.json(
        { error: 'GA Property ID가 설정되지 않았습니다' },
        { status: 500 }
      );
    }

    // Google Analytics 데이터 요청
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: dateRange,
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: 10,
    });

    // 데이터 파싱
    const topPages = response.rows?.map((row) => ({
      path: row.dimensionValues?.[0]?.value || '',
      title: row.dimensionValues?.[1]?.value || '',
      views: row.metricValues?.[0]?.value || '0',
      users: row.metricValues?.[1]?.value || '0',
    })) || [];

    // 전체 통계 요청
    const [overallResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: dateRange,
          endDate: 'today',
        },
        {
          startDate: getPreviousDateRange(dateRange),
          endDate: dateRange === '7daysAgo' ? '8daysAgo' : getPreviousEndDate(dateRange),
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    });

    const currentMetrics = overallResponse.rows?.[0]?.metricValues || [];
    const previousMetrics = overallResponse.rows?.[1]?.metricValues || [];

    const calculateChange = (current: string, previous: string) => {
      const curr = parseFloat(current);
      const prev = parseFloat(previous);
      if (prev === 0) return 0;
      return ((curr - prev) / prev) * 100;
    };

    const metrics = {
      activeUsers: {
        value: currentMetrics[0]?.value || '0',
        change: calculateChange(
          currentMetrics[0]?.value || '0',
          previousMetrics[0]?.value || '0'
        ),
      },
      pageViews: {
        value: currentMetrics[1]?.value || '0',
        change: calculateChange(
          currentMetrics[1]?.value || '0',
          previousMetrics[1]?.value || '0'
        ),
      },
      avgSessionDuration: {
        value: currentMetrics[2]?.value || '0',
        change: calculateChange(
          currentMetrics[2]?.value || '0',
          previousMetrics[2]?.value || '0'
        ),
      },
      bounceRate: {
        value: currentMetrics[3]?.value || '0',
        change: calculateChange(
          currentMetrics[3]?.value || '0',
          previousMetrics[3]?.value || '0'
        ),
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        topPages,
      },
    });
  } catch (error) {
    console.error('GA Data API Error:', error);
    return NextResponse.json(
      { error: 'Analytics 데이터를 가져오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

function getPreviousDateRange(dateRange: string): string {
  if (dateRange === '7daysAgo') return '14daysAgo';
  if (dateRange === '30daysAgo') return '60daysAgo';
  if (dateRange === '90daysAgo') return '180daysAgo';
  return '14daysAgo';
}

function getPreviousEndDate(dateRange: string): string {
  if (dateRange === '30daysAgo') return '31daysAgo';
  if (dateRange === '90daysAgo') return '91daysAgo';
  return '8daysAgo';
}