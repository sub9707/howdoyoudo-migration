import { NextRequest, NextResponse } from 'next/server';
import projects from "../projects.json";

export interface WorkItem {
  category: string;
  title: string;
  caption: string;
  url: string;
  image: string;
  alt: string;
}

export interface RecentsResponse {
  works: WorkItem[];
  totalCount: number;
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
    const limit = parseInt(searchParams.get("limit") || "6");

    // JSON 데이터 바로 사용
    let works: WorkItem[] = projects;

    // Filter out items without images
    works = works.filter(work => work.image && work.image.trim() !== "");

    const recentWorks = works.slice(0, limit);

    return NextResponse.json({
      works: recentWorks,
      totalCount: recentWorks.length,
    });
  } catch (error) {
    console.error("Error reading recent works data:", error);
    return NextResponse.json(
      { error: "Failed to load recent works data" },
      { status: 500 }
    );
  }
}