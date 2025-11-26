'use client';

import { WorkItem } from '@/types/works';
import Image from 'next/image';

interface WorksGridProps {
    works: WorkItem[];
    loading: boolean;
    hasMore: boolean;
}

function WorkCard({ work }: { work: WorkItem }) {
    return (
        <div className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                {/* 썸네일 이미지 */}
                <Image
                    src={work.thumbnailImage}
                    alt={work.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* 카테고리 뱃지 (왼쪽 위) */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="text-xs px-3 py-1.5 bg-black bg-opacity-70 text-white rounded-full font-medium">
                        {work.categoryDisplayName}
                    </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center px-4">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-3 break-keep">
                            {work.title}
                        </h3>
                        <p className="text-sm text-gray-700 font-medium">
                            {`${work.eventDate.slice(0,4)}.${work.eventDate.slice(5,7)}.${work.eventDate.slice(8,10)}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-200 rounded-lg animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function WorksGrid({ works, loading, hasMore }: WorksGridProps) {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Works Grid */}
                {works.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {works.map((work) => (
                            <WorkCard key={work.id} work={work} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">선택한 조건에 해당하는 작업이 없습니다.</p>
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && <LoadingSkeleton />}

                {/* Load More Indicator */}
                {!loading && hasMore && works.length > 0 && (
                    <div className="text-center pt-8">
                        <div className="inline-flex items-center space-x-2 text-gray-400">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                            <span className="text-sm">스크롤하여 더 보기</span>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                        </div>
                    </div>
                )}

                {/* End Message */}
                {!hasMore && works.length > 0 && (
                    <div className="text-center pt-8">
                        <div className="inline-flex items-center space-x-2 text-gray-400">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                            <span className="text-sm">더 표시할 게시글이 없습니다</span>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}