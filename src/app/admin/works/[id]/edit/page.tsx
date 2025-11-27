'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, Tag, Save, X, Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Work {
  id: number;
  title: string;
  category_id: number;
  category_display_name: string;
  description: string;
  event_date: string;
  thumbnail_image: string;
  content_images: string | string[];
  is_active: boolean | number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  display_name: string;
  is_active: boolean;
}

export default function EditWorkPage() {
  const router = useRouter();
  const params = useParams();
  const workId = params.id as string;

  const [work, setWork] = useState<Work | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: 0,
    eventDate: '',
  });

  useEffect(() => {
    loadWork();
    loadCategories();
  }, [workId]);

  const loadWork = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/works/${workId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load work');
      }

      const data = await response.json();

      if (data.success && data.work) {
        setWork(data.work);
        setFormData({
          title: data.work.title,
          description: data.work.description,
          categoryId: data.work.category_id,
          eventDate: data.work.event_date.split('T')[0], // YYYY-MM-DD 형식으로
        });
      }
    } catch (error) {
      console.error('작업 로드 오류:', error);
      alert('작업을 불러올 수 없습니다.');
      router.push('/admin/works');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/works?page=1&limit=1');
      const data = await response.json();

      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('카테고리 로드 오류:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('제목과 설명을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/admin/works/${workId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          eventDate: formData.eventDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('작업이 성공적으로 수정되었습니다.');
        router.push('/admin/works');
      } else {
        alert(data.error || '작업 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('작업 수정 오류:', error);
      alert('작업 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
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

  if (!work) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">작업을 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push('/admin/works')}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">작업 수정</h1>
              <p className="text-sm text-gray-600 mt-1">
                작업 정보를 수정합니다
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/works')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>취소</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="작업 제목을 입력하세요"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="작업 설명을 입력하세요"
                  required
                />
              </div>

              {/* Category & Event Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    카테고리 *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    이벤트 날짜 *
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, eventDate: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">썸네일 이미지</h3>
            <div className="relative w-full max-w-md aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={work.thumbnail_image}
                alt={work.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * 썸네일 이미지는 현재 수정할 수 없습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/works')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>저장</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}