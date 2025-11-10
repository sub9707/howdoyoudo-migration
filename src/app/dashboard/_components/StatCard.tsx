"use client";
import React from 'react';
import { StatCardProps } from '@/types/dashboard';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change }) => {
  const getChangeColor = (change?: number): string => {
    if (!change) return '';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatChange = (change?: number): string => {
    if (!change) return '';
    return `${change > 0 ? '+' : ''}${change}%`;
  };

  return (
    <div className="bg-white border-2 border-black/40 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-black mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${getChangeColor(change)}`}>
              {formatChange(change)}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <Icon className="w-8 h-8 text-black" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;