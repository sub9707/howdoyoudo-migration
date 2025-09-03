'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface GalleryItem {
  id: number
  title: string
  category: string
  image: string
  description: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Portrait Series",
    category: "Photography",
    image: "/images/portrait.jpg",
    description: "Contemporary portrait photography with artistic vision"
  },
  {
    id: 2,
    title: "Fashion Campaign",
    category: "Fashion",
    image: "/images/fashion.jpg", 
    description: "Modern fashion photography for luxury brands"
  },
  {
    id: 3,
    title: "Event Coverage",
    category: "Events",
    image: "/images/event.jpg",
    description: "Dynamic event photography capturing key moments"
  },
  {
    id: 4,
    title: "Brand Identity",
    category: "Branding",
    image: "/images/branding.jpg",
    description: "Comprehensive brand identity and visual design"
  },
  {
    id: 5,
    title: "Product Photography",
    category: "Commercial",
    image: "/images/product.jpg",
    description: "High-end product photography for e-commerce"
  },
  {
    id: 6,
    title: "Architecture",
    category: "Architecture",
    image: "/images/architecture.jpg",
    description: "Architectural photography showcasing modern design"
  }
]

export default function ImageGallery() {
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [])

  return (
    <section className="pb-20 bg-white">
      <div className="w-full px-16 sm:px-20 lg:px-32 xl:px-40">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            OUR WORKS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creative studio crafting digital experiences and visual stories
          </p>
        </div>

        <div 
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="gallery-item group cursor-pointer opacity-0 translate-y-12 transition-all duration-700 ease-out"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-500">
                {/* Placeholder for actual images */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-700 ease-out" />
                
                {/* Image overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <span className="inline-block px-3 py-1 bg-white/95 text-gray-900 text-xs font-semibold rounded-full mb-3 tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {item.description}
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
                  <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-20">
          <button className="group inline-flex items-center px-10 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-900 hover:text-gray-900 hover:shadow-lg transition-all duration-300 tracking-wide">
            <span>VIEW ALL PROJECTS</span>
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