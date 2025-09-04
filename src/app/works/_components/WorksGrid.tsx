'use client';

import { WorkItem } from '@/types/works';
import Image from 'next/image';
import Link from 'next/link';

interface WorksGridProps {
    works: WorkItem[];
    loading: boolean;
    hasMore: boolean;
}

function WorkCard({ work }: { work: WorkItem }) {
    const imageUrl = work.image || '/placeholder.jpg';
    console.log(imageUrl);

    return (
        <Link href={work.url} className="group block" target="_blank" rel="noopener noreferrer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <Image
                    src={imageUrl}
                    alt={work.alt || work.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center px-4">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-3 break-keep">
                            {work.title}
                        </h3>
                        {work.caption && (
                            <p className="text-sm text-red-600 font-medium uppercase tracking-wider mb-2">
                                {work.caption}
                            </p>
                        )}
                    </div>
                </div>

                {/* Category badge on image */}
                {work.category && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="text-xs px-2 py-1 bg-black bg-opacity-70 text-white rounded">
                            {work.category}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-[4/5] bg-gray-200 rounded-lg animate-pulse" />
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
                        {works.map((work, index) => (
                            <WorkCard key={`${work.url}-${index}`} work={work} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">선택한 카테고리에 해당하는 작업이 없습니다.</p>
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