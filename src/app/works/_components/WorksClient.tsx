'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkItem, WorksResponse, CategoryInfo } from '@/types/works';
import WorksFilter from './WorksFilter';
import WorksGrid from './WorksGrid';

interface WorksClientProps {
  initialData: WorksResponse;
}

export default function WorksClient({ initialData }: WorksClientProps) {
  const [works, setWorks] = useState<WorkItem[]>(initialData.works);
  const [categories] = useState<CategoryInfo[]>(initialData.categories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<'recent' | 'previous' | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [currentPage, setCurrentPage] = useState(1);

  // Load more works
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (currentPage + 1).toString(),
        limit: '21',
      });

      if (selectedCategoryId !== null) {
        params.append('categoryId', selectedCategoryId.toString());
      }

      if (selectedYear) {
        params.append('year', selectedYear);
      }

      const response = await fetch(`/api/works?${params.toString()}`);
      
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
  }, [currentPage, selectedCategoryId, selectedYear, loading, hasMore]);

  // Handle category filter
  const handleCategoryChange = async (categoryId: number | null) => {
    if (categoryId === selectedCategoryId) return;
    
    setSelectedCategoryId(categoryId);
    setLoading(true);
    setCurrentPage(1);
    
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '21',
      });

      if (categoryId !== null) {
        params.append('categoryId', categoryId.toString());
      }

      if (selectedYear) {
        params.append('year', selectedYear);
      }

      const response = await fetch(`/api/works?${params.toString()}`);
      
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

  // Handle year filter
  const handleYearChange = async (year: 'recent' | 'previous' | null) => {
    if (year === selectedYear) return;
    
    setSelectedYear(year);
    setLoading(true);
    setCurrentPage(1);
    
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '21',
      });

      if (selectedCategoryId !== null) {
        params.append('categoryId', selectedCategoryId.toString());
      }

      if (year) {
        params.append('year', year);
      }

      const response = await fetch(`/api/works?${params.toString()}`);
      
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
        selectedCategoryId={selectedCategoryId}
        selectedYear={selectedYear}
        onCategoryChange={handleCategoryChange}
        onYearChange={handleYearChange}
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