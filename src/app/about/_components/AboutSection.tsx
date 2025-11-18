'use client';

import React from 'react';
import AboutCard from './AboutCard';
import Divider from '@/components/ui/Divider';

export default function AboutSection() {
  const getCurrentYear = () => {
    return new Date().getFullYear() - 2005;
  }
  return (
    <section className="py-40">
      <div className="max-w-7xl mx-auto px-6 space-y-32">

        <AboutCard
          title="No.1"
          subtitle="하우두유두"
          headline={
            <>
              <span className="text-5xl font-black text-black">{getCurrentYear()}년</span> 동안 축적된 경험과 노하우를 바탕으로<br />
              기업 이미지와 경쟁력 강화를 위한<br /> 손과 발이 되고자 합니다.
            </>
          }
          description={[
            '어디서부터 어떻게 시작해야 할지 모르셔도 괜찮습니다.',
            '하우두유두의 인재들이 기업 이미지와 브랜드 확장에 도움을 드릴 것입니다.',
          ]}
          gradientFrom="#0F172A"
          gradientTo="#334155"
        />

        <Divider />

        <AboutCard
          title="Best"
          subtitle="하우두유두"
          headline={
            <>
              하우두유두를 지탱하는 프로 집단의{' '}
              <span className="font-extrabold text-black">Best 정신</span>입니다.
            </>
          }
          description={[
            '적은 광고비로도 목표를 정확히 적중시키는 통쾌한 쌍방향 커뮤니케이션으로,',
            '귀사의 든든한 동반자가 되어 책임 있는 사명감을 성실히 수행하겠습니다.',
          ]}
          gradientFrom="#1E293B"
          gradientTo="#475569"
          reverse
        />

      </div>
    </section>
  );
}