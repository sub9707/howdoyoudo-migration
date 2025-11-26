'use client';

import Link from 'next/link';
import WorkForm from '../_components/WorkForm';

export default function NewWorkPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">새 게시글 작성</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <WorkForm mode="create" />
        </div>
      </main>
    </div>
  );
}