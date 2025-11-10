"use client";
import React from 'react';
import { User, BarChart3, FileText, TrendingUp } from 'lucide-react';
import { NavigationProps, MenuItem, MenuType } from '@/types/dashboard';
import Link from 'next/link';

const Navigation: React.FC<NavigationProps> = ({ 
  selectedMenu, 
  setSelectedMenu, 
  currentUser, 
  onLogout 
}) => {
  const menuItems: MenuItem[] = [
    { id: 'overview', label: '통계 개요', icon: BarChart3 },
    { id: 'posts', label: '게시글 관리', icon: FileText },
    { id: 'analytics', label: '통계 상세', icon: TrendingUp }
  ];

  const handleMenuClick = (menuId: string): void => {
    setSelectedMenu(menuId as MenuType);
  };

  return (
    <div className="w-64 bg-white border-r-2 border-black h-screen flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b-2 border-black">
        <Link href={'/'} className="text-xl font-bold text-black">HOWDOYOUDO</Link>
      </div>
      
      {/* 메뉴 항목 */}
      <div className="flex-1 py-4">
        {menuItems.map((item: MenuItem) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                selectedMenu === item.id ? 'bg-black text-white' : 'text-black'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </div>
      
      {/* 유저 정보 */}
      <div className="border-t-2 border-black p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-300 border-2 border-gray-400 flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-black">{currentUser?.name}</p>
            <p className="text-sm text-gray-600">@{currentUser?.username}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full bg-gray-200 text-black py-2 px-4 hover:bg-gray-300 transition-colors border border-gray-400"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Navigation;