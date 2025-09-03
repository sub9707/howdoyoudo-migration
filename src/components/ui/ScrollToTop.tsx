'use client'

import { useState, useEffect } from 'react'

interface ScrollButtonProps {
  showAfter?: number
  className?: string
}

export default function ScrollButtons({ 
  showAfter = 300,
  className = ""
}: ScrollButtonProps) {
  const [showTop, setShowTop] = useState(false)
  const [showBottom, setShowBottom] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight

      setShowTop(scrolled > showAfter)
      setShowBottom(scrolled < maxScroll - 50) // 거의 맨 아래면 버튼 숨김
    }

    window.addEventListener('scroll', toggleVisibility)
    toggleVisibility() // 초기 실행

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [showAfter])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
      {/* 맨 위로 버튼 */}
      <button
        onClick={scrollToTop}
        className={`
          w-12 h-12
          bg-black hover:bg-gray-800
          text-white
          cursor-pointer
          shadow-lg hover:shadow-xl
          transition-opacity duration-500 ease-in-out
          ${showTop ? "opacity-100" : "opacity-0 pointer-events-none"}
          ${className}
        `}
        aria-label="맨 위로 이동"
        title="맨 위로 이동"
      >
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* 맨 아래로 버튼 */}
      <button
        onClick={scrollToBottom}
        className={`
          w-12 h-12
          bg-black hover:bg-gray-800
          text-white
          cursor-pointer
          shadow-lg hover:shadow-xl
          transition-opacity duration-500 ease-in-out
          ${showBottom ? "opacity-100" : "opacity-0 pointer-events-none"}
          ${className}
        `}
        aria-label="맨 아래로 이동"
        title="맨 아래로 이동"
      >
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
