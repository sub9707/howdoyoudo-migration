"use client";

import React, { useState, useEffect } from 'react';
import LoginForm from './_components/LoginForm';
import Navigation from './_components/Navigation';
import Overview from './_components/Overview';
import PostManagement from './_components/PostManagement';
import Analytics from './_components/Analytics';
import { User, LoginFormData, MenuType, VisitData, MonthlyData } from '@/types/dashboard';
import { authApi, dashboardApi } from '../utils/api';

interface DashboardStats {
    statCards: Array<{ title: string; value: string; change: number }>;
    visitData: VisitData[];
    monthlyData: MonthlyData[];
    trafficSources: Array<{ source: string; percentage: number }>;
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
    pagePerformance: Array<{ page: string; views: number }>;
    deviceInfo: Array<{ device: string; percentage: number }>;
    regionInfo: Array<{ region: string; percentage: number }>;
}

const Dashboard: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<MenuType>('overview');
    const [loginForm, setLoginForm] = useState<LoginFormData>({ username: '', password: '' });
    const [loginError, setLoginError] = useState<string>('');
    const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // 대시보드 데이터 로드
    useEffect(() => {
        if (isLoggedIn) {
            loadDashboardData();
        }
    }, [isLoggedIn]);

    const loadDashboardData = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await dashboardApi.getStats();

            if (response.success && response) {
                setDashboardData(response.data ?? response);
            } else {
                console.error('통계 데이터 로드 실패:', response.error);
            }
        } catch (error) {
            console.error('통계 데이터 로드 중 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (): Promise<void> => {
        if (!loginForm.username.trim() || !loginForm.password.trim()) {
            setLoginError('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        setLoginError('');

        try {
            const response = await authApi.login({
                username: loginForm.username,
                password: loginForm.password
            });

            // response.data에서 user 사용
            if (response.success && response && response.user) {
                const user: User = {
                    ...response.user,
                    username: response.user.username ?? '',
                    password: ''
                };
                setCurrentUser(user);
                setIsLoggedIn(true);
                setLoginError('');
            } else {
                setLoginError(response.error || '로그인에 실패했습니다.');
            }
        } catch (error) {
            setLoginError('로그인 처리 중 오류가 발생했습니다.');
            console.error('로그인 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = (): void => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setLoginForm({ username: '', password: '' });
        setLoginError('');
        setSelectedMenu('overview');
        setDashboardData(null);
    };

    // 메인 콘텐츠 렌더링
    const renderMainContent = (): React.ReactElement => {
        if (loading && !dashboardData) {
            return (
                <div className="p-6 flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        </div>
                        <p className="text-gray-600">데이터를 불러오는 중...</p>
                    </div>
                </div>
            );
        }

        switch (selectedMenu) {
            case 'overview':
                return (
                    <Overview
                        visitData={dashboardData?.visitData || []}
                        monthlyData={dashboardData?.monthlyData || []}
                        statCards={dashboardData?.statCards || []}
                        recentActivities={dashboardData?.recentActivities || []}
                        popularContent={dashboardData?.popularContent || []}
                        serverStatus={dashboardData?.serverStatus || []}
                    />
                );
            case 'posts':
                return <PostManagement currentUser={currentUser} />;
            case 'analytics':
                return (
                    <Analytics
                        trafficSources={dashboardData?.trafficSources || []}
                        userAnalytics={dashboardData?.userAnalytics}
                    />
                );
            default:
                return (
                    <Overview
                        visitData={dashboardData?.visitData || []}
                        monthlyData={dashboardData?.monthlyData || []}
                        statCards={dashboardData?.statCards || []}
                        recentActivities={dashboardData?.recentActivities || []}
                        popularContent={dashboardData?.popularContent || []}
                        serverStatus={dashboardData?.serverStatus || []}
                    />
                );
        }
    };

    // 로그인되지 않은 경우 로그인 폼 표시
    if (!isLoggedIn) {
        return (
            <LoginForm
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                loginError={loginError}
                onLogin={handleLogin}
                loading={loading}
            />
        );
    }

    // 대시보드 메인 화면
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                currentUser={currentUser}
                onLogout={handleLogout}
            />
            <div className="flex-1 overflow-auto">
                {renderMainContent()}
            </div>
        </div>
    );
};

export default Dashboard;