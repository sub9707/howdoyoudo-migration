"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/dashboard';
import { postsApi } from '@/utils/api';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content?: string;
  status: 'published' | 'draft' | 'archived';
}

interface PostManagementProps {
  currentUser: User | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

const PostManagement: React.FC<PostManagementProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  const [filters, setFilters] = useState({
    status: '' as 'published' | 'draft' | 'archived' | '',
    author: ''
  });

  const loadPosts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.author && { author: filters.author }),
      };

      const response = await postsApi.getPosts(params);

      if (response.success && response.data) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || '게시글을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('게시글 로드 중 오류가 발생했습니다.');
      console.error('게시글 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters]);

  const handleEdit = async (postId: number): Promise<void> => {

    // 예시: 제목 수정
    const newTitle = prompt('새 제목을 입력하세요:');
    if (newTitle) {
      try {
        const response = await postsApi.updatePost({
          id: postId,
          title: newTitle
        });

        if (response.success) {
          await loadPosts(); // 목록 새로고침
        } else {
          alert(response.error || '게시글 수정에 실패했습니다.');
        }
      } catch (err) {
        console.error('게시글 수정 오류:', err);
        alert('게시글 수정 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async (postId: number): Promise<void> => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await postsApi.deletePost(postId);

      if (response.success) {
        await loadPosts(); // 목록 새로고침
      } else {
        alert(response.error || '게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 삭제 오류:', err);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCreatePost = async (): Promise<void> => {
    const title = prompt('게시글 제목을 입력하세요:');
    if (!title) return;

    const content = prompt('게시글 내용을 입력하세요:');
    if (!content) return;

    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await postsApi.createPost({
        title,
        content,
        author: currentUser.username
      });

      if (response.success) {
        await loadPosts(); // 목록 새로고침
      } else {
        alert(response.error || '게시글 작성에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 작성 오류:', err);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (newPage: number): void => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const getStatusBadge = (status: Post['status']): React.ReactElement => {
    const statusConfig = {
      published: { text: '발행됨', color: 'bg-green-100 text-green-800' },
      draft: { text: '초안', color: 'bg-yellow-100 text-yellow-800' },
      archived: { text: '보관됨', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs rounded ${config.color}`}>
        {config.text}
      </span>
    );
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black mb-6">게시글 관리</h2>

      <div className="bg-white border-2 border-black p-6">
        {/* 헤더 및 필터 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                status: e.target.value as typeof filters.status
              }))}
              className="px-3 py-2 border-2 border-gray-300 bg-white text-black focus:border-black focus:outline-none"
            >
              <option value="">모든 상태</option>
              <option value="published">발행됨</option>
              <option value="draft">초안</option>
              <option value="archived">보관됨</option>
            </select>

            <input
              type="text"
              placeholder="작성자 검색"
              value={filters.author}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                author: e.target.value
              }))}
              className="px-3 py-2 border-2 border-gray-300 bg-white text-black focus:border-black focus:outline-none"
            />
          </div>

          <button
            onClick={handleCreatePost}
            className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
            disabled={loading}
          >
            새 게시글
          </button>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-200 p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            </div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 게시글 목록 */}
            <div className="space-y-4 mb-6">
              {posts.length > 0 ? (
                posts.map((post: Post) => (
                  <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-black">{post.title}</h4>
                          {getStatusBadge(post.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          작성자: {post.author} • {post.date}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(post.id)}
                          className="text-sm text-gray-600 hover:text-black transition-colors"
                          disabled={loading}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          disabled={loading}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  게시글이 없습니다.
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    const isActive = pageNumber === pagination.currentPage;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={loading}
                        className={`px-3 py-1 ${isActive
                          ? 'bg-black text-white'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages || loading}
                    className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {/* 통계 정보 */}
            <div className="mt-4 text-sm text-gray-600 text-center">
              총 {pagination.totalItems}개의 게시글 중 {posts.length}개 표시
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostManagement;