'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

interface AdminInfo {
  username: string;
  name: string;
}

function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

    useEffect(() => {
        // Admin 페이지임을 표시 (개발 환경에서 유용)
        if (process.env.NODE_ENV === 'development') {
            console.log('🔐 Admin Page:', pathname);
        }

        // Admin 페이지에서는 body에 특별한 클래스 추가
        document.body.classList.add('admin-mode');

        // 관리자 정보 가져오기
        fetchAdminInfo();

        return () => {
            document.body.classList.remove('admin-mode');
        };
    }, [pathname]);

    const fetchAdminInfo = async () => {
        try {
            const response = await fetch('/api/admin/auth/session');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.admin) {
                    setAdminInfo(data.admin);
                }
            }
        } catch (error) {
            console.error('Failed to fetch admin info:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // 로그인 페이지에서는 헤더 숨김
    if (pathname === '/admin/login') {
        return null;
    }

    // 페이지 타이틀 결정
    const getPageTitle = () => {
        if (pathname === '/admin/dashboard') return '관리자 대시보드';
        if (pathname.startsWith('/admin/works')) return 'Works 관리';
        if (pathname.startsWith('/admin/analytics')) return '통계';
        if (pathname.startsWith('/admin/history')) return '연혁 관리';
        return '관리자';
    };

    const getPageSubtitle = () => {
        if (pathname === '/admin/dashboard') return 'HOWDOYOUDO Admin Portal';
        if (pathname.startsWith('/admin/works')) return 'Works Management';
        if (pathname.startsWith('/admin/analytics')) return 'HOWDOYOUDO Analytics';
        if (pathname.startsWith('/admin/history')) return 'History Management';
        return 'Admin';
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Page Title */}
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Shield className="w-6 h-6 text-gray-900" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {getPageTitle()}
                            </h1>
                            <p className="text-sm text-gray-600">{getPageSubtitle()}</p>
                        </div>
                    </div>

                    {/* Right: User Info & Logout */}
                    <div className="flex items-center space-x-4">
                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                href="/admin/dashboard"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin/dashboard'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                대시보드
                            </Link>
                            <Link
                                href="/admin/works"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/admin/works')
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Works 관리
                            </Link>
                            <Link
                                href="/admin/analytics"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/admin/analytics')
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                통계
                            </Link>
                            <Link
                                href="/admin/history"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/admin/history')
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                연혁 관리
                            </Link>
                        </nav>

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
    )
}

export default Header