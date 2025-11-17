import React from 'react';
import AboutBanner from '@/components/banner/AboutBanner';
import AboutSection from './_components/AboutSection';
import AboutHeroTitle from './_components/AboutHeroTitle';

export default function AboutPage() {
  return (
    <div className="min-h-screen text-gray-900">

      {/* Hero Section */}
      <section className="py-40">
        <AboutHeroTitle />
      </section>

      {/* Banner */}
      <section className="py-28">
        <AboutBanner height="750px" />
      </section>

      {/* About Philosophy */}
      <AboutSection />
    </div>
  );
}
