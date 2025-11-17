"use client"
import React, { useEffect, useState } from 'react';

const AboutHeroTitle: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    setIsVisible(true);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 text-center">
      {/* Main Title - CREATIVE */}
      <h1 className={`text-8xl md:text-9xl font-black tracking-tighter leading-none text-gray-900 ${isVisible ? 'about-hero-title' : ''}`}>
        CREATIVE
      </h1>
      
      {/* Subtitle - ONE-STOP SERVICE */}
      <h2 className={`text-5xl md:text-7xl font-black tracking-tight mt-6 text-gray-800 ${isVisible ? 'about-hero-subtitle' : ''}`}>
        ONE-STOP SERVICE
      </h2>
    </div>
  );
};

export default AboutHeroTitle;