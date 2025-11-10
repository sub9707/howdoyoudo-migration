import React from 'react';

interface TrafficSource {
  source: string;
  percentage: number;
}

interface UserAnalytics {
  label: string;
  value: string;
  type: 'increase' | 'decrease' | 'neutral';
}

interface AnalyticsProps {
  userAnalytics?: {
    newUsers: number;
    returningUsers: number;
    avgSessionTime: string;
    bounceRate: string;
  };
  trafficSources?: Array<{ source: string; percentage: number }>;
}

interface PagePerformance {
  page: string;
  views: number;
}

const actualPagePerformance: PagePerformance[] = [
  { page: '홈페이지', views: 3200 },
  { page: '블로그', views: 2100 },
  { page: '문의하기', views: 850 }
];

interface DeviceInfo {
  device: string;
  percentage: number;
}

const actualDeviceInfo: DeviceInfo[] = [
  { device: '데스크탑', percentage: 60.5 },
  { device: '모바일', percentage: 35.2 },
  { device: '태블릿', percentage: 4.3 }
];

interface RegionInfo {
  region: string;
  percentage: number;
}

const actualRegionInfo: RegionInfo[] = [
  { region: '서울', percentage: 48.1 },
  { region: '경기', percentage: 27.6 },
  { region: '부산', percentage: 12.3 },
  { region: '기타', percentage: 12.0 }
];

const Analytics: React.FC<AnalyticsProps> = () => {
  const trafficSources: TrafficSource[] = [
    { source: '직접 접속', percentage: 45.2 },
    { source: '검색 엔진', percentage: 32.1 },
    { source: '소셜 미디어', percentage: 22.7 }
  ];

  const userAnalytics: UserAnalytics[] = [
    { label: '신규 사용자', value: '+234', type: 'increase' },
    { label: '재방문 사용자', value: '1,856', type: 'neutral' },
    { label: '평균 세션 시간', value: '4분 32초', type: 'neutral' },
    { label: '이탈률', value: '23.4%', type: 'decrease' }
  ];

  const getValueColor = (type: UserAnalytics['type']): string => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-black';
    }
  };

  const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
    <div className="w-full bg-gray-200 h-2">
      <div 
        className="bg-black h-2 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black mb-6">통계 상세</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 트래픽 분석 */}
        <div className="bg-white border-2 border-black p-6">
          <h3 className="text-lg font-semibold text-black mb-4">트래픽 분석</h3>
          <div className="space-y-4">
            {trafficSources.map((source: TrafficSource, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{source.source}</span>
                  <span className="font-medium">{source.percentage}%</span>
                </div>
                <ProgressBar percentage={source.percentage} />
              </div>
            ))}
          </div>
        </div>

        {/* 사용자 분석 */}
        <div className="bg-white border-2 border-black p-6">
          <h3 className="text-lg font-semibold text-black mb-4">사용자 분석</h3>
          <div className="space-y-4">
            {userAnalytics.map((analytics, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{analytics.label}</span>
                <span className={`font-medium ${getValueColor(analytics.type)}`}>
                  {analytics.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 추가 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-lg font-semibold text-black mb-3">페이지 성과</h4>
          <div className="space-y-3">
            {actualPagePerformance.map((page: PagePerformance, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{page.page}</span>
                <span className="text-sm font-medium">{page.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-lg font-semibold text-black mb-3">기기 정보</h4>
          <div className="space-y-3">
            {actualDeviceInfo.map((device: DeviceInfo, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{device.device}</span>
                <span className="text-sm font-medium">{device.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-lg font-semibold text-black mb-3">지역별 접속</h4>
          <div className="space-y-3">
            {actualRegionInfo.map((region: RegionInfo, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{region.region}</span>
                <span className="text-sm font-medium">{region.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;