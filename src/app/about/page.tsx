import React from 'react';
import AboutBanner from '@/components/banner/AboutBanner';
import AboutSection from './_components/AboutSection';
import AboutHeroTitle from './_components/AboutHeroTitle';

export default function AboutPage() {
  return (
    <div className="min-h-screen text-gray-900">

      {/* Hero Section - 모바일 패딩 조정 */}
      <section className="py-20 sm:py-32 lg:py-40">
        <AboutHeroTitle />
      </section>

      {/* Banner - 모바일 높이 조정 */}
      <section className="pb-16 sm:pb-20 lg:pb-28">
        <AboutBanner height="750px" mobileHeight="450px" />
      </section>

      {/* About Philosophy */}
      <AboutSection />
    </div>
  );
}