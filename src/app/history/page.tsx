// app/history/page.tsx
import { Metadata } from 'next'
import tempData from './tempData.json'
import Divider from '@/components/ui/Divider';
import PageHeader from '@/components/sections/PageHeader';

export const metadata: Metadata = {
  title: 'History',
  description: 'HOWDOYOUDO의 연혁과 주요 프로젝트 기록'
}

export default function HistoryPage() {
  const { companyHistory } = tempData;

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <PageHeader 
      title='HISTORY' 
      description={`2005년부터 현재까지,
        HOWDOYOUDO가 걸어온 발자취와 함께한 브랜드들의 특별한 순간들을 기록합니다.`}
      />

      {/* Divider */}
      <Divider />

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>

            {companyHistory.map((yearData, yearIndex) => (
              <div id={yearData.year} key={yearData.year} className="relative mb-12">
                {/* Year marker */}
                <div className="flex items-center mb-8">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-black text-white font-bold text-xl">
                    {yearData.year}
                  </div>
                  <div className="ml-6 flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Events for this year */}
                <div className="ml-20 space-y-3">
                  {yearData.events.map((event, eventIndex) => (
                    <div
                      key={`${yearData.year}-${eventIndex}`}
                      className="group relative pl-6 py-2 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {/* Event bullet point */}
                      <div className="absolute left-0 top-4 w-2 h-2 bg-black group-hover:bg-gray-600 transition-colors duration-200"></div>

                      {/* Event content */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <time className="text-sm font-medium text-gray-900 min-w-20">
                          {event.date}
                        </time>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}