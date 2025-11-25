'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  User, 
  Activity, 
  Shield, 
  Clock,
  Monitor
} from 'lucide-react';

interface AdminInfo {
  id: number;
  username: string;
  name: string;
  ip_address: string | null;
  last_login: string | null;
  login_count: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const response = await fetch('/api/admin/auth/session');
      const data = await response.json();

      if (data.success) {
        setAdminInfo(data.admin);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('세션 정보 로드 오류:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-gray-900" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  관리자 대시보드
                </h1>
                <p className="text-sm text-gray-600">HOWDOYOUDO Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {adminInfo?.name}
                </p>
                <p className="text-xs text-gray-500">@{adminInfo?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            환영합니다, {adminInfo?.name}님!
          </h2>
          <p className="text-gray-300">
            HOWDOYOUDO 관리자 페이지에 오신 것을 환영합니다.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">빠른 작업</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-1">
                홈페이지로 이동
              </h4>
              <p className="text-sm text-gray-600">
                메인 사이트 확인하기
              </p>
            </button>

            <button
              onClick={() => router.push('/works')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-1">
                작업 관리
              </h4>
              <p className="text-sm text-gray-600">
                포트폴리오 관리하기
              </p>
            </button>

            <button
              onClick={() => router.push('/contact')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-1">
                문의 확인
              </h4>
              <p className="text-sm text-gray-600">
                고객 문의 관리하기
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}