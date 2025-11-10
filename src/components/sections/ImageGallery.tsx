'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface WorkItem {
  category: string
  title: string
  caption: string
  url: string
  image: string
  alt: string
}

interface RecentsResponse {
  works: WorkItem[]
  totalCount: number
}

// Category mapping for display
const categoryMap: Record<string, string> = {
  'csr-campaign': 'CSR Campaign',
  'show-case': 'Launching Showcase', 
  'star-marketing': 'Star Marketing',
  'outing': 'Outing',
  'store-promotion': 'Store Promotion',
  'season-promotion': 'Season Promotion',
  'road-promotion': 'Road Promotion',
  'artist': 'Entertainment',
  '': 'Entertainment'
}

export default function ImageGallery() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [works, setWorks] = useState<WorkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentWorks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/works/recents')
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent works')
        }
        
        const data: RecentsResponse = await response.json()
        setWorks(data.works)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load works')
        console.error('Error fetching recent works:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentWorks()
  }, [])

  useEffect(() => {
    if (works.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-80px',
      threshold: 0.2,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          const delay = parseInt(element.dataset.delay || '0')
          
          setTimeout(() => {
            element.classList.remove('opacity-0', 'translate-y-12')
            element.classList.add('opacity-100', 'translate-y-0')
          }, delay)
        }
      })
    }, observerOptions)

    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll('.gallery-item')
      items.forEach((item, index) => {
        const element = item as HTMLElement
        element.dataset.delay = (index * 150).toString()
        observer.observe(element)
      })
    }

    return () => observer.disconnect()
  }, [works])

  if (loading) {
    return (
      <section className="pb-20 bg-white">
        <div className="w-full px-16 sm:px-20 lg:px-32 xl:px-40">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              OUR WORKS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Creative studio crafting digital experiences and visual stories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 aspect-[4/5] rounded-2xl mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="pb-20 bg-white">
        <div className="w-full px-16 sm:px-20 lg:px-32 xl:px-40">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              OUR WORKS
            </h2>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading works: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pb-20 bg-white">
      <div className="w-full px-16 sm:px-20 lg:px-32 xl:px-40">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            OUR WORKS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            HOWDOYOUDO가 걸어온 발자취를 소개합니다.
          </p>
        </div>

        <div 
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {works.map((item, index) => {
            const displayCategory = categoryMap[item.category] || 'Entertainment'
            
            return (
              <div
                key={`${item.url}-${index}`}
                className="gallery-item group cursor-pointer opacity-0 translate-y-12 transition-all duration-700 ease-out"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-500">
                  {/* Actual Image */}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.alt || item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-700 ease-out" />
                  )}
                  
                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <span className="inline-block px-3 py-1 bg-white/95 text-gray-900 text-xs font-semibold rounded-full mb-3 tracking-wide">
                        {displayCategory}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {item.caption}
                      </p>
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl group-hover:ring-white/30 transition-all duration-500" />
                </div>

                {/* Text content below image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-20">
          <button className="group inline-flex items-center px-10 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-900 hover:text-gray-900 hover:shadow-lg transition-all duration-300 tracking-wide">
            <span>VIEW ALL WORKS</span>
            <svg 
              className="ml-3 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}