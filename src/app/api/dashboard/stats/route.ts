// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface VisitData {
  name: string;
  visits: number;
  users: number;
}

interface MonthlyData {
  month: string;
  posts: number;
}

interface StatCard {
  title: string;
  value: string;
  change: number;
}

interface TrafficSource {
  source: string;
  percentage: number;
}

interface PagePerformance {
  page: string;
  views: number;
}

interface DeviceInfo {
  device: string;
  percentage: number;
}

interface RegionInfo {
  region: string;
  percentage: number;
}

interface DashboardStats {
  statCards: StatCard[];
  visitData: VisitData[];
  monthlyData: MonthlyData[];
  trafficSources: TrafficSource[];
  userAnalytics: {
    newUsers: number;
    returningUsers: number;
    avgSessionTime: string;
    bounceRate: string;
  };
  recentActivities: Array<{ label: string; value: string }>;
  popularContent: Array<{ title: string; views: string }>;
  serverStatus: Array<{ 
    label: string; 
    value: string; 
    status: 'good' | 'warning' | 'danger' 
  }>;
  pagePerformance: PagePerformance[];
  deviceInfo: DeviceInfo[];
  regionInfo: RegionInfo[];
}

export async function GET(request: NextRequest) {
  try {
    // 실제 환경에서는 데이터베이스에서 조회
    // 현재는 더미 데이터 반환
    const stats: DashboardStats = {
      statCards: [
        { title: '총 방문자', value: '24,571', change: 12 },
        { title: '활성 사용자', value: '1,284', change: 8 },
        { title: '게시글 수', value: '342', change: -3 },
        { title: '활동 지수', value: '89%', change: 5 }
      ],
      visitData: [
        { name: '월', visits: 1200, users: 800 },
        { name: '화', visits: 1900, users: 1200 },
        { name: '수', visits: 800, users: 600 },
        { name: '목', visits: 2200, users: 1400 },
        { name: '금', visits: 2800, users: 1800 },
        { name: '토', visits: 3200, users: 2000 },
        { name: '일', visits: 2400, users: 1600 }
      ],
      monthlyData: [
        { month: '1월', posts: 45 },
        { month: '2월', posts: 52 },
        { month: '3월', posts: 38 },
        { month: '4월', posts: 61 },
        { month: '5월', posts: 73 },
        { month: '6월', posts: 84 }
      ],
      trafficSources: [
        { source: '직접 접속', percentage: 45.2 },
        { source: '검색 엔진', percentage: 32.1 },
        { source: '소셜 미디어', percentage: 22.7 }
      ],
      userAnalytics: {
        newUsers: 234,
        returningUsers: 1856,
        avgSessionTime: '4분 32초',
        bounceRate: '23.4%'
      },
      recentActivities: [
        { label: '새 게시글', value: '23개' },
        { label: '댓글', value: '156개' },
        { label: '신규 사용자', value: '42명' }
      ],
      popularContent: [
        { title: '웹 개발 트렌드 2024', views: '조회수 2,341' },
        { title: 'React 최신 기능', views: '조회수 1,987' },
        { title: '디자인 시스템 구축', views: '조회수 1,756' }
      ],
      serverStatus: [
        { label: 'CPU 사용률', value: '23%', status: 'good' },
        { label: '메모리', value: '67%', status: 'good' },
        { label: '응답 시간', value: '142ms', status: 'good' }
      ],
      pagePerformance: [
        { page: '홈페이지', views: 12543 },
        { page: '블로그', views: 8234 },
        { page: '제품 페이지', views: 5678 },
        { page: '문의하기', views: 2345 }
      ],
      deviceInfo: [
        { device: '데스크탑', percentage: 58.3 },
        { device: '모바일', percentage: 35.2 },
        { device: '태블릿', percentage: 6.5 }
      ],
      regionInfo: [
        { region: '서울', percentage: 42.1 },
        { region: '경기도', percentage: 23.4 },
        { region: '부산', percentage: 12.8 },
        { region: '기타', percentage: 21.7 }
      ]
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('통계 데이터 조회 중 오류:', error);
    return NextResponse.json(
      { error: '통계 데이터를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}