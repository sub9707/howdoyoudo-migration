'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WorkForm from '../../_components/WorkForm';

interface WorkFormData {
  title: string;
  categoryId: number;
  description: string;
  eventDate: string;
  images: string[];
  isActive: boolean;
}

interface ApiWorkResponse {
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

export default function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [work, setWork] = useState<WorkFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workId, setWorkId] = useState<number | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      const id = parseInt(resolvedParams.id);
      setWorkId(id);
      loadWork(id);
    });
  }, [params]);

  const loadWork = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/works/${id}`);
      const data = await response.json();

      if (data.success) {
        const workData: ApiWorkResponse = data.data;
        
        // content_images가 문자열이면 파싱
        let contentImages: string[] = [];
        if (typeof workData.content_images === 'string') {
          try {
            contentImages = JSON.parse(workData.content_images);
          } catch (e) {
            console.error('이미지 파싱 오류:', e);
            contentImages = [];
          }
        } else if (Array.isArray(workData.content_images)) {
          contentImages = workData.content_images;
        }

        // event_date를 input[type="date"] 형식으로 변환 (YYYY-MM-DD)
        const eventDate = workData.event_date.split('T')[0];

        // API 응답을 WorkFormData 형식으로 변환
        const formData: WorkFormData = {
          title: workData.title,
          categoryId: workData.category_id,
          description: workData.description || '',
          eventDate: eventDate,
          images: contentImages,
          isActive: Boolean(workData.is_active),
        };

        setWork(formData);
      } else {
        setError(data.error || '게시글을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('게시글 로드 오류:', error);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/admin/works"
              className="text-gray-600 hover:text-gray-900"
            >
              ← 목록으로
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-600 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
          <Link
            href="/admin/works"
            className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/works"
              className="text-gray-600 hover:text-gray-900"
            >
              ← 목록으로
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">게시글 수정</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <WorkForm 
            mode="edit" 
            initialData={work}
            workId={workId!}
          />
        </div>
      </main>
    </div>
  );
}