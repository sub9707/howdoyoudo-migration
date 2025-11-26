'use client';

import { CategoryInfo } from '@/types/works';

interface WorksFilterProps {
  categories: CategoryInfo[];
  selectedCategoryId: number | null;
  selectedYear: 'recent' | 'previous' | null;
  onCategoryChange: (categoryId: number | null) => void;
  onYearChange: (year: 'recent' | 'previous' | null) => void;
}

export default function WorksFilter({ 
  categories, 
  selectedCategoryId,
  selectedYear,
  onCategoryChange,
  onYearChange
}: WorksFilterProps) {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* 연도 필터 (왼쪽) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onYearChange(null)}
              className={`
                px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                ${selectedYear === null
                  ? 'text-red-600 bg-red-50 border border-red-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              `}
            >
              전체
            </button>
            <button
              onClick={() => onYearChange('recent')}
              className={`
                px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                ${selectedYear === 'recent'
                  ? 'text-red-600 bg-red-50 border border-red-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              `}
            >
              최근
            </button>
            <button
              onClick={() => onYearChange('previous')}
              className={`
                px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                ${selectedYear === 'previous'
                  ? 'text-red-600 bg-red-50 border border-red-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              `}
            >
              이전
            </button>
          </div>

          {/* 카테고리 필터 (오른쪽) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onCategoryChange(null)}
              className={`
                relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                ${selectedCategoryId === null
                  ? 'text-red-600 bg-red-50 border border-red-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              `}
            >
              전체
              {selectedCategoryId === null && (
                <div className="absolute inset-0 rounded-full bg-red-600 opacity-5" />
              )}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                  ${selectedCategoryId === category.id
                    ? 'text-red-600 bg-red-50 border border-red-200 shadow-sm'
                    : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                `}
              >
                {category.displayName}
                {selectedCategoryId === category.id && (
                  <div className="absolute inset-0 rounded-full bg-red-600 opacity-5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}