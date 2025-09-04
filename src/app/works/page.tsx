import { Metadata } from 'next';
import { WorksResponse } from '@/types/works';
import WorksClient from './_components/WorksClient';
import PageHeader from '@/components/sections/PageHeader';

export const metadata: Metadata = {
  title: 'Works',
  description: 'HOWDOYOUDO 작업 포트폴리오',
};

// Server component that fetches initial data
async function getInitialData(): Promise<WorksResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/works?page=1&limit=21`, {
      cache: 'no-store', // Disable caching for development
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch works');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      works: [],
      totalCount: 0,
      categories: ['All'],
      hasMore: false,
      currentPage: 1
    };
  }
}

export default async function WorksPage() {
  const initialData = await getInitialData();
  
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title='CREATIVE BUSINESS' />
      
      <WorksClient initialData={initialData} />
    </div>
  );
}