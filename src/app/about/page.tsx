import Divider from '@/components/ui/Divider';
import AboutBanner from '@/components/banner/AboutBanner';
import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4">
            <h1 className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">
              CREATIVE
            </h1>
            <h2 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight">
              ONE-STOP SERVICE
            </h2>
          </div>
        </div>
      </section>

      {/* Image Container Section */}
      <section className="py-24">
        <AboutBanner height="700px"/>
      </section>

      {/* Company Philosophy */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-20">
            
            {/* No.1 Card */}
            <div className="flex items-start gap-12 group">
              {/* Left Box */}
              <div className="flex-shrink-0">
                <div className="w-72 h-72 border-4 border-black bg-white flex flex-col justify-center items-center text-center p-8 group-hover:bg-gray-50 transition-colors duration-300">
                  <h3 className="text-4xl font-black text-black mb-2 tracking-tight">No.1</h3>
                  <h4 className="text-3xl font-black text-black tracking-tight leading-tight">하우두유두</h4>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 pt-8">
                <div className="space-y-8 text-gray-800 max-w-2xl">
                  <p className="text-2xl leading-relaxed font-medium">
                    <span className="text-4xl font-black text-black">12년</span> 동안 축적된 경험과 노하우를 바탕으로<br />
                    기업 이미지와 경쟁력 강화를 위한 순간 밖이 되고자 합니다.
                  </p>
                  <div className="w-16 h-px bg-black"></div>
                  <p className="text-xl leading-relaxed">
                    어디서부터 어떻게 시작해야 할지 모르셔도 괜찮습니다.<br />
                    하우두유두의 인재들이 기업 이미지와 브랜드 확장에<br />
                    도움을 드릴 것 입니다.
                  </p>
                </div>
              </div>
            </div>

            <Divider/>

            {/* Best Card */}
            <div className="flex items-start gap-12 group">
              {/* Left Box */}
              <div className="flex-shrink-0">
                <div className="w-72 h-72 border-4 border-black bg-white flex flex-col justify-center items-center text-center p-8 group-hover:bg-gray-50 transition-colors duration-300">
                  <h3 className="text-4xl font-black text-black mb-2 tracking-tight">Best</h3>
                  <h4 className="text-3xl font-black text-black tracking-tight leading-tight">하우두유두</h4>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 pt-8">
                <div className="space-y-8 text-gray-800 max-w-2xl">
                  <p className="text-2xl leading-relaxed font-medium">
                    <span className="text-2xl font-bold text-black">하</span>우두유두를 지탱하는 프로 집단의 Best 전신입니다.
                  </p>
                  <div className="w-16 h-px bg-black"></div>
                  <p className="text-xl leading-relaxed">
                    적은 광고비로도 목표를 정확히 적중시키는<br />
                    통쾌한 쌍방향 커뮤니케이션으로
                  </p>
                  <p className="text-xl leading-relaxed">
                    귀사의 든든한 동반자가 되어 책임있는 사명감을<br />
                    성실히 수행하겠습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal decorative section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-8"></div>
            <p className="text-sm text-gray-500 tracking-widest uppercase font-medium">
              Creative Studio • Marketing Strategy • Brand Experience
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mt-8"></div>
          </div>
        </div>
      </section>
    </div>
  );
}