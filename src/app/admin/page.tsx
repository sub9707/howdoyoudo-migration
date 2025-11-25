'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 세션 확인 API 호출
        const response = await fetch('/api/admin/auth/session');
        
        if (response.ok) {
          // 로그인되어 있으면 대시보드로
          router.replace('/admin/dashboard');
        } else {
          // 로그인되어 있지 않으면 로그인 페이지로
          router.replace('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // 에러 발생 시 로그인 페이지로
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  // 로딩 중 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          
          {/* Shield Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white/60" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
          </div>
        </div>
        
        <p className="mt-6 text-white/60 text-sm font-medium tracking-wide">
          인증 확인 중...
        </p>
      </div>
    </div>
  );
}