'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryManager from './CategoryManager';
import ImageUploader from './ImageUploader';
import { Save, X } from 'lucide-react';

interface WorkFormData {
  title: string;
  categoryId: number | null;
  description: string;
  eventDate: string;
  images: string[];
  isActive: boolean;
}

interface WorkFormProps {
  initialData?: WorkFormData;
  workId?: number;
  mode: 'create' | 'edit';
}

export default function WorkForm({ initialData, workId, mode }: WorkFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<WorkFormData>({
    title: '',
    categoryId: null,
    description: '',
    eventDate: new Date().toISOString().split('T')[0],
    images: [],
    isActive: true,
    ...initialData,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!formData.categoryId) {
      setError('카테고리를 선택해주세요.');
      return;
    }
    if (formData.images.length === 0) {
      setError('최소 1개의 이미지를 업로드해주세요.');
      return;
    }
    if (!formData.eventDate) {
      setError('행사 일자를 선택해주세요.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = mode === 'create' 
        ? '/api/admin/works'
        : `/api/admin/works/${workId}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          categoryId: formData.categoryId,
          description: formData.description.trim(),
          eventDate: formData.eventDate,
          thumbnailImage: formData.images[0],
          contentImages: formData.images,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          mode === 'create'
            ? '게시글이 성공적으로 작성되었습니다.'
            : '게시글이 성공적으로 수정되었습니다.'
        );
        router.push('/admin/works');
      } else {
        setError(data.error || '저장에 실패했습니다.');
      }
    } catch (err) {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          제목 *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="게시글 제목을 입력하세요"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={saving}
        />
      </div>

      {/* Category */}
      <CategoryManager
        selectedCategoryId={formData.categoryId}
        onCategoryChange={(categoryId) =>
          setFormData({ ...formData, categoryId })
        }
      />

      {/* Event Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          행사 일자 *
        </label>
        <input
          type="date"
          value={formData.eventDate}
          onChange={(e) =>
            setFormData({ ...formData, eventDate: e.target.value })
          }
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={saving}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="게시글 설명을 입력하세요"
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          disabled={saving}
        />
      </div>

      {/* Images */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          이미지 * (최소 1개)
        </label>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
          <ImageUploader
            images={formData.images}
            onImagesChange={(images) =>
              setFormData({ ...formData, images })
            }
            maxImages={20}
          />
        </div>
      </div>

      {/* Is Active */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          disabled={saving}
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          게시글 활성화
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 pt-6 border-t-2 border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{mode === 'create' ? '작성하기' : '수정하기'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm('작성을 취소하시겠습니까?')) {
              router.push('/admin/works');
            }
          }}
          disabled={saving}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}