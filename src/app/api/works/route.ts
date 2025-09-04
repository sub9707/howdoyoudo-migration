import { NextRequest, NextResponse } from 'next/server';
import projects from "./projects.json"; 

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

// Category mapping from internal categories to display categories
const categoryMap: Record<string, string> = {
  'csr-campaign': 'CSR campaign',
  'show-case': 'Launching Showcase', 
  'star-marketing': 'Star marketing',
  'outing': 'Outing',
  'store-promotion': 'Store promotion',
  'season-promotion': 'Season Promotion',
  'road-promotion': 'Road Promotion',
  'artist': 'Entertainment',
  '': 'Entertainment' // Empty categories default to Entertainment
};


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "All";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "21");

    // JSON 데이터 바로 사용
    let works: WorkItem[] = projects;

    // Filter out items without images
    works = works.filter(work => work.image && work.image.trim() !== "");

    // Filter by category
    if (category !== "All") {
      works = works.filter(work => {
        const displayCategory = categoryMap[work.category] || "Entertainment";
        return displayCategory === category;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedWorks = works.slice(startIndex, endIndex);

    // Get all unique display categories for filter in specific order
    const categoryOrder = [
      "CSR campaign",
      "Entertainment",
      "Launching Showcase",
      "Outing",
      "Road Promotion",
      "Season Promotion",
      "Star marketing",
      "Store promotion",
    ];

    const allWorks: WorkItem[] = projects;
    const existingCategories = new Set(
      allWorks.map(work => categoryMap[work.category] || "Entertainment")
    );
    const orderedCategories = categoryOrder.filter(cat =>
      existingCategories.has(cat)
    );
    const categories = ["All", ...orderedCategories];

    return NextResponse.json({
      works: paginatedWorks,
      totalCount: works.length,
      categories: categories,
      hasMore: endIndex < works.length,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error reading works data:", error);
    return NextResponse.json(
      { error: "Failed to load works data" },
      { status: 500 }
    );
  }
}