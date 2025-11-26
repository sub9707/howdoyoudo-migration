'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  display_name: string;
  is_active: boolean;
}

interface CategoryManagerProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number) => void;
}

export default function CategoryManager({
  selectedCategoryId,
  onCategoryChange,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        setError('카테고리를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('카테고리 로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('카테고리 이름을 입력해주세요.');
      return;
    }

    setAdding(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
        setNewCategoryName('');
        setShowAddForm(false);
      } else {
        setError(data.error || '카테고리 추가에 실패했습니다.');
      }
    } catch (err) {
      setError('카테고리 추가 중 오류가 발생했습니다.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('이 카테고리를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
        if (selectedCategoryId === categoryId) {
          const firstCategory = categories.find(c => c.id !== categoryId);
          if (firstCategory) {
            onCategoryChange(firstCategory.id);
          }
        }
      } else {
        alert(data.error || '카테고리 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('카테고리 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          카테고리 *
        </label>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          카테고리 *
        </label>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>카테고리 추가</span>
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="새 카테고리 이름"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={adding}
          />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={adding}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {adding ? '추가 중...' : '추가'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName('');
                setError('');
              }}
              disabled={adding}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              취소
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}

      {/* Category List */}
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`relative flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedCategoryId === category.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="font-medium text-sm">{category.display_name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          카테고리가 없습니다. 카테고리를 추가해주세요.
        </p>
      )}
    </div>
  );
}