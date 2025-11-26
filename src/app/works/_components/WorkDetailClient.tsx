'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Calendar, Eye, Tag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { WorkItem } from '@/types/works';

interface WorkDetailClientProps {
  initialData: {
    work: WorkItem;
    navigation: {
      prev: { id: number; title: string } | null;
      next: { id: number; title: string } | null;
    };
  };
}

export default function WorkDetailClient({ initialData }: WorkDetailClientProps) {
  const { work, navigation } = initialData;
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: work.title,
          text: work.description,
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Copy Toast */}
      {showCopyToast && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-400" />
            <span className="font-medium">링크가 복사되었습니다</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8 pb-6">
          <Link
            href="/works"
            data-no-transition="true"
            className="flex items-center space-x-2 transition-colors"
          >
            <span className="font-medium">목록으로</span>
          </Link>

          <div className="flex items-center gap-2">
            {navigation.prev && (
              <Link
                href={`/works/${navigation.prev.id}`}
                data-no-transition="true"
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
                title={navigation.prev.title}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">이전</span>
              </Link>
            )}
            
            {navigation.next && (
              <Link
                href={`/works/${navigation.next.id}`}
                data-no-transition="true"
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
                title={navigation.next.title}
              >
                <span className="hidden sm:inline font-medium">다음</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {work.title}
          </h1>

          {/* Meta Information & Share Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span className="font-medium">{work.categoryDisplayName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(work.eventDate)}</span>
              </div>
            </div>
            
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full transition-colors w-fit"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">공유하기</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="mb-12 md:mb-16">
          <div className="relative aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
            <Image
              src={work.thumbnailImage}
              alt={work.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-12 md:mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {work.description}
            </p>
          </div>
        </div>

        {/* Content Images */}
        {work.contentImages.length > 0 && (
          <div className="space-y-8 md:space-y-12 mb-12 md:mb-16">
            {work.contentImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative w-full rounded-xl overflow-hidden bg-gray-100 shadow-lg"
              >
                <div className="relative w-full" style={{ minHeight: '400px' }}>
                  <Image
                    src={imageUrl}
                    alt={`${work.title} - Image ${index + 1}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="border-t border-gray-200 pt-8 md:pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Work */}
            {navigation.prev ? (
              <Link
                href={`/works/${navigation.prev.id}`}
                data-no-transition="true"
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-gray-900 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                    이전
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {navigation.prev.title}
                </h3>
              </Link>
            ) : null}

            {/* Next Work */}
            {navigation.next ? (
              <Link
                href={`/works/${navigation.next.id}`}
                data-no-transition="true"
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-gray-900 transition-all duration-300"
              >
                <div className="flex items-center justify-end space-x-3 mb-2">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                    다음
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 text-right group-hover:text-gray-700 transition-colors">
                  {navigation.next.title}
                </h3>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Back to List Button */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/works"
            data-no-transition="true"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <span className="font-medium">목록으로</span>
          </Link>
        </div>
      </main>
    </div>
  );
}