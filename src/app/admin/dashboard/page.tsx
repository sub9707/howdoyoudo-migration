'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LogOut, 
  Shield,
  FileText,
  Plus,
  Eye,
  Calendar,
} from 'lucide-react';

interface AdminInfo {
  id: number;
  username: string;
  name: string;
  ip_address: string | null;
  last_login: string | null;
  login_count: number;
}

interface WorksStats {
  totalWorks: number;
  activeWorks: number;
  totalViews: number;
  recentWorks: {
    id: number;
    title: string;
    category_display_name: string;
    event_date: string;
    view_count: number;
    is_active: boolean;
  }[];
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
              <div className="text-right hidden sm:block">
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
                <span className="hidden sm:inline">로그아웃</span>
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
            HOWDOYOUDO Works 관리 시스템
          </p>
        </div>


        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Works 관리 카드 */}
          <Link
            href="/admin/works"
            className="group bg-white rounded-xl border-2 border-gray-200 p-8 hover:border-gray-900 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-900 transition-colors">
                <FileText className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Works 관리
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                works 게시글을 관리합니다
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}