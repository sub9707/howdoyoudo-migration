"use client"
import React, { useEffect, useState } from 'react';

const AboutHeroTitle: React.FC = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 200);
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 1000);
    const descTimer = setTimeout(() => setShowDescription(true), 1800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(descTimer);
    };
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-12">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-gray-900 rounded-full opacity-30" />
      <div className="absolute top-32 right-16 w-1.5 h-1.5 bg-gray-700 rounded-full opacity-40" />
      <div className="absolute bottom-24 left-1/4 w-1 h-1 bg-gray-800 rounded-full opacity-20" />

      <div className="text-center space-y-12">
        {/* Main Title - CREATIVE */}
        <div className="relative">
          <h1
            className={`text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none
              bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent
              transition-all duration-1000 ease-out
              ${showTitle
                ? 'opacity-100 translate-y-0 blur-0'
                : 'opacity-0 translate-y-10 blur-md'
              }`}
          >
            CREATIVE
          </h1>
        </div>

        {/* Subtitle - ONE-STOP SERVICE */}
        <h2
          className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-800
            transition-all duration-1000 ease-out
            ${showSubtitle
              ? 'opacity-100 translate-y-0 blur-0'
              : 'opacity-0 translate-y-10 blur-md'
            }`}
        >
          ONE-STOP SERVICE
        </h2>
        {/* Accent Line */}
        <div
          className={`mx-auto mt-6 h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent
              transition-all duration-1000 ease-out
              ${showSubtitle
              ? 'w-64 opacity-100'
              : 'w-0 opacity-0'
            }`}
        />
        {/* Description */}
        <div
          className={`max-w-3xl mx-auto space-y-4
            transition-all duration-1000 ease-out
            ${showDescription
              ? 'opacity-100 translate-y-0 blur-0'
              : 'opacity-0 translate-y-10 blur-md'
            }`}
        >
          <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed">
            HOWDOYOUDO
          </p>
          <p className="text-lg md:text-xl text-gray-600">
            기업을 위한 효율적이고 창의적인 전략을 제공합니다
          </p>
        </div>

        {/* Bottom Decorative Element */}
        <div
          className={`flex items-center justify-center gap-3 pt-8
            transition-all duration-1000 ease-out
            ${showDescription
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-400" />
          <div className="w-2 h-2 bg-gray-900 rounded-full" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default AboutHeroTitle;