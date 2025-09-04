export interface WorkItem {
  category: string;
  title: string;
  caption: string;
  url: string;
  image: string;
  alt: string;
}

export interface WorksResponse {
  works: WorkItem[];
  totalCount: number;
  categories: string[];
  hasMore: boolean;
  currentPage: number;
}