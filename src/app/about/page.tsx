import React from 'react';
import AboutBanner from '@/components/banner/AboutBanner';
import AboutSection from './_components/AboutSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen text-gray-900">

      {/* Hero Section */}
      <section className="py-40 border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none text-gray-900">
            CREATIVE
          </h1>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mt-6 text-gray-800">
            ONE-STOP SERVICE
          </h2>
        </div>
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
