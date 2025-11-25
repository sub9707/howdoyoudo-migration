'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Admin 페이지임을 표시 (개발 환경에서 유용)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Admin Page:', pathname);
    }

    // Admin 페이지에서는 body에 특별한 클래스 추가
    document.body.classList.add('admin-mode');

    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, [pathname]);

  return (
    <div className="admin-wrapper">
      {children}
    </div>
  );
}