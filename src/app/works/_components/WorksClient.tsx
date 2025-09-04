'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkItem, WorksResponse } from '@/types/works';
import WorksFilter from './WorksFilter';
import WorksGrid from './WorksGrid';

interface WorksClientProps {
  initialData: WorksResponse;
}

export default function WorksClient({ initialData }: WorksClientProps) {
  const [works, setWorks] = useState<WorkItem[]>(initialData.works);
  const [categories] = useState<string[]>(initialData.categories);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [currentPage, setCurrentPage] = useState(1);

  // Load more works
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/works?page=${currentPage + 1}&limit=21&category=${selectedCategory}`
      );
      
      if (response.ok) {
        const data: WorksResponse = await response.json();
        setWorks(prev => [...prev, ...data.works]);
        setHasMore(data.hasMore);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more works:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, loading, hasMore]);

  // Handle category filter
  const handleCategoryChange = async (category: string) => {
    if (category === selectedCategory) return;
    
    setSelectedCategory(category);
    setLoading(true);
    setCurrentPage(1);
    
    try {
      const response = await fetch(`/api/works?page=1&limit=21&category=${category}`);
      
      if (response.ok) {
        const data: WorksResponse = await response.json();
        setWorks(data.works);
        setHasMore(data.hasMore);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error filtering works:', error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <>
      {/* Filter Section */}
      <WorksFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Works Grid */}
      <WorksGrid
        works={works}
        loading={loading}
        hasMore={hasMore}
      />
    </>
  );
}