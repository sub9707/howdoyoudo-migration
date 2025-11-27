'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface Work {
  id: number;
  title: string;
  category_id: number;
  category_display_name: string;
  description: string;
  event_date: string;
  thumbnail_image: string;
  content_images: string | string[];
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  display_name: string;
  is_active: boolean;
}

export default function AdminWorksPage() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number>(0);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // 검색 시 첫 페이지로
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadWorks();
  }, [currentPage, selectedCategory, debouncedSearch]);

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editingWorkId !== null) {
        const target = e.target as HTMLElement;
        if (!target.closest('.category-popup') && !target.closest('.category-badge')) {
          setEditingWorkId(null);
          setPopupPosition(null);
        }
      }
    };

    const handleScroll = () => {
      if (editingWorkId !== null) {
        setEditingWorkId(null);
        setPopupPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [editingWorkId]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('카테고리 로드 오류:', error);
    }
  };

  const loadWorks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });

      if (selectedCategory !== 'all') {
        params.append('categoryId', selectedCategory);
      }

      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      const response = await fetch(`/api/admin/works?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setWorks(data.data.works);
        setTotalPages(data.data.totalPages);
        setTotalCount(data.data.totalCount);
      }
    } catch (error) {
      console.error('작업 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/works/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('게시글이 삭제되었습니다.');
        loadWorks();
      } else {
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCategoryClick = (workId: number, categoryId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
    setEditingWorkId(workId);
    setEditingCategory(categoryId);
  };

  const handleCategoryChange = async (workId: number, newCategoryId: number) => {
    try {
      const response = await fetch(`/api/admin/works/${workId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_id: newCategoryId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditingWorkId(null);
        setPopupPosition(null);
        loadWorks();
      } else {
        alert(data.error || '카테고리 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('카테고리 변경 오류:', error);
      alert('카테고리 변경 중 오류가 발생했습니다.');
    }
  };

  const handleCloseCategoryPopup = () => {
    setEditingWorkId(null);
    setPopupPosition(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← 대시보드
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Works 관리</h1>
            </div>

            <Link
              href="/admin/works/new"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>새 게시글</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="제목 또는 설명 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {search && search !== debouncedSearch && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {search && (
                <p className="mt-1 text-xs text-gray-500">
                  {search === debouncedSearch 
                    ? `"${search}" 검색 중...` 
                    : '검색어 입력 대기 중...'}
                </p>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">전체 카테고리</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Works Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">게시글이 없습니다.</p>
            <Link
              href="/admin/works/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>첫 게시글 작성하기</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-4 text-sm text-gray-600">
              전체 <span className="font-semibold text-gray-900">{totalCount}</span>개의 게시글
              {debouncedSearch && ` (검색: "${debouncedSearch}")`}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        썸네일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-md">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                        카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        행사 일자
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        상태
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        조회수
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {works.map((work) => (
                      <tr key={work.id} className="hover:bg-gray-50 transition-colors">
                        {/* Thumbnail */}
                        <td className="px-6 py-4">
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={work.thumbnail_image}
                              alt={work.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <Link
                              href={`/admin/works/${work.id}/edit`}
                              className="font-medium text-gray-900 hover:text-gray-600 block truncate"
                              title={work.title}
                            >
                              {work.title}
                            </Link>
                            {work.description && (
                              <p className="text-sm text-gray-500 truncate mt-1" title={work.description}>
                                {work.description}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => handleCategoryClick(work.id, work.category_id, e)}
                            className="category-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                            title="클릭하여 카테고리 변경"
                          >
                            {work.category_display_name}
                          </button>
                        </td>

                        {/* Event Date */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(work.event_date)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          {work.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              활성
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              비활성
                            </span>
                          )}
                        </td>

                        {/* View Count */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{work.view_count.toLocaleString()}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Link
                              href={`/admin/works/${work.id}/edit`}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                              title="수정"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(work.id, work.title)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  페이지 <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* First Page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    title="첫 페이지"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    title="이전 페이지"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    title="다음 페이지"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    title="마지막 페이지"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {editingWorkId !== null && popupPosition && (
        <div
          className="category-popup fixed z-50 bg-white border-1 border-gray-700 rounded-lg shadow-xl p-3 min-w-[200px]"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-700">카테고리 변경</span>
            <button
              onClick={handleCloseCategoryPopup}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {categories.map((category) => {
              const currentWork = works.find(w => w.id === editingWorkId);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(editingWorkId, category.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    category.id === currentWork?.category_id
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {category.display_name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}