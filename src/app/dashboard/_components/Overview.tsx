"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Eye, Users, FileText, Activity } from 'lucide-react';
import StatCard from './StatCard';
import { VisitData, MonthlyData } from '@/types/dashboard';

interface StatCardData {
  title: string;
  value: string;
  change: number;
}

interface RecentActivity {
  label: string;
  value: string;
}

interface PopularContent {
  title: string;
  views: string;
}

interface ServerStatus {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'danger';
}

interface OverviewProps {
  visitData: VisitData[];
  monthlyData: MonthlyData[];
  statCards: StatCardData[];
  recentActivities: RecentActivity[];
  popularContent: PopularContent[];
  serverStatus: ServerStatus[];
}

const Overview: React.FC<OverviewProps> = ({ 
  visitData, 
  monthlyData, 
  statCards,
  recentActivities,
  popularContent,
  serverStatus
}) => {
  const iconMap = {
    '총 방문자': Eye,
    '활성 사용자': Users,
    '게시글 수': FileText,
    '활동 지수': Activity
  };

  const getStatusColor = (status: 'good' | 'warning' | 'danger'): string => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const chartTooltipStyle = {
    backgroundColor: '#fff',
    border: '2px solid #000',
    borderRadius: '0'
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-black mb-6">통계 개요</h2>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card: StatCardData, index: number) => {
          const IconComponent = iconMap[card.title as keyof typeof iconMap] || Activity;
          return (
            <StatCard 
              key={index}
              title={card.title} 
              value={card.value} 
              icon={IconComponent} 
              change={card.change} 
            />
          );
        })}
      </div>
      
      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-black/40 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">주간 방문자 추이</h3>
          {visitData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  labelStyle={{ color: '#000' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#000000" 
                  strokeWidth={3} 
                  name="방문자"
                  dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#666666" 
                  strokeWidth={2} 
                  name="사용자"
                  dot={{ fill: '#666666', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#666666', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              데이터를 불러오는 중...
            </div>
          )}
        </div>
        
        <div className="bg-white border-2 border-black/40 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">월별 작성 Works</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  labelStyle={{ color: '#000' }}
                />
                <Bar 
                  dataKey="posts" 
                  fill="#000000" 
                  name="게시글"
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              데이터를 불러오는 중...
            </div>
          )}
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black/40 p-6">
          <h4 className="text-lg font-semibold text-black mb-3">최근 활동</h4>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: RecentActivity, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{activity.label}</span>
                  <span className="text-sm font-medium">{activity.value}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">데이터가 없습니다.</p>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-black/40 p-6">
          <h4 className="text-lg font-semibold text-black mb-3">인기 콘텐츠</h4>
          <div className="space-y-3">
            {popularContent.length > 0 ? (
              popularContent.map((content: PopularContent, index: number) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-black">{content.title}</p>
                  <p className="text-gray-600">{content.views}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">데이터가 없습니다.</p>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-black/40 p-6">
          <h4 className="text-lg font-semibold text-black mb-3">서버 상태</h4>
          <div className="space-y-3">
            {serverStatus.length > 0 ? (
              serverStatus.map((status: ServerStatus, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{status.label}</span>
                  <span className={`text-sm font-medium ${getStatusColor(status.status)}`}>
                    {status.value}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;