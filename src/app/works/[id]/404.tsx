import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function WorkNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <FileQuestion className="w-20 h-20 mx-auto text-gray-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          게시물을 찾을 수 없습니다
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          요청하신 게시물이 존재하지 않거나 삭제되었습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/works"
            data-no-transition="true"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            목록으로
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-full hover:border-gray-900 transition-colors font-medium"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}