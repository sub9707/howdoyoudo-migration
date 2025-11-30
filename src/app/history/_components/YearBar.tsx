'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import tempData from '../tempData.json'

export default function YearBar() {
    const years: string[] = tempData.companyHistory.map((item) => item.year)
    const [activeYear, setActiveYear] = useState<string | null>(null)

    // 현재 보이는 연도 감지
    useEffect(() => {
        const handleScroll = () => {
            for (const year of years) {
                const section = document.getElementById(year)
                if (section) {
                    const rect = section.getBoundingClientRect()
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        setActiveYear(year)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [years])

    // 클릭 → 조금 위로 보정된 스크롤
    const handleClick = (year: string) => {
        const section = document.getElementById(year)
        if (section) {
            const offset = 100 // 헤더 높이만큼 보정
            const top = section.getBoundingClientRect().top + window.scrollY - offset
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }

    // 텍스트 크기/투명도 계산 (모래시계 느낌)
    const getStyle = (index: number) => {
        const activeIndex = years.indexOf(activeYear ?? '')
        const distance = Math.abs(index - activeIndex)
        const scale = Math.max(0.7, 1.2 - distance * 0.15) // 가운데 클수록 크게
        const opacity = Math.max(0.4, 1 - distance * 0.2) // 멀어질수록 흐리게
        return { scale, opacity }
    }

    return (
        <div
            className="hidden md:flex fixed pr-4 right-32 top-1/2 -translate-y-4/9 flex-col items-center z-40">
            {/* 세로 라인 */}
            <div className="absolute w-px bg-gray-300 top-0 bottom-0 right-0"></div>

            {years.map((year, idx) => {
                const { scale, opacity } = getStyle(idx)
                const isActive = year === activeYear

                return (
                    <motion.button
                        key={year}
                        onClick={() => handleClick(year)}
                        animate={{ scale, opacity }}
                        transition={{ duration: 0.3 }}
                        className="relative mb-3 flex items-center gap-2 cursor-pointer select-none"
                    >
                        {/* 연도 */}
                        <span className={`font-medium ${isActive ? 'text-black font-bold' : 'text-gray-500'}`} >
                            {year}
                        </span>
                    </motion.button>
                )
            })}
        </div>
    )
}
