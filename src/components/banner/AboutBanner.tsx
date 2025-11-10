'use client';

import React from 'react';
import ParticleBackground from './ParticleBackground';
import ProcessCube from './ProcessCube';

interface AboutBannerProps {
  height?: string;
  className?: string;
}

const AboutBanner: React.FC<AboutBannerProps> = ({ 
  height = "100vh",
  className = ""
}) => {
  return (
    <div 
      className={`relative w-full overflow-hidden bg-gradient-to-r from-[#05060c] via-[#0a142e] to-[#05060e] ${className}`}
      style={{ height }}
    >
      {/* Background Particles */}
      <ParticleBackground />

      {/* Corner Decorations - L shapes */}
      {/* Top Left - ㄱ */}
      <div className="absolute top-4 left-4 md:top-[30px] md:left-[30px] w-10 h-10 md:w-[60px] md:h-[60px] z-[3]">
        <div className="absolute top-0 left-0 w-full h-[2px] md:h-[3px] bg-white/30" />
        <div className="absolute top-0 left-0 w-[2px] md:w-[3px] h-full bg-white/30" />
      </div>

      {/* Top Right - ㄴ */}
      <div className="absolute top-4 right-4 md:top-[30px] md:right-[30px] w-10 h-10 md:w-[60px] md:h-[60px] z-[3]">
        <div className="absolute top-0 right-0 w-full h-[2px] md:h-[3px] bg-white/30" />
        <div className="absolute top-0 right-0 w-[2px] md:w-[3px] h-full bg-white/30" />
      </div>

      {/* Bottom Left - ㄴ (inverted) */}
      <div className="absolute bottom-4 left-4 md:bottom-[30px] md:left-[30px] w-10 h-10 md:w-[60px] md:h-[60px] z-[3]">
        <div className="absolute bottom-0 left-0 w-full h-[2px] md:h-[3px] bg-white/30" />
        <div className="absolute bottom-0 left-0 w-[2px] md:w-[3px] h-full bg-white/30" />
      </div>

      {/* Bottom Right - ㄱ (inverted) */}
      <div className="absolute bottom-4 right-4 md:bottom-[30px] md:right-[30px] w-10 h-10 md:w-[60px] md:h-[60px] z-[3]">
        <div className="absolute bottom-0 right-0 w-full h-[2px] md:h-[3px] bg-white/30" />
        <div className="absolute bottom-0 right-0 w-[2px] md:w-[3px] h-full bg-white/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-[2] w-full h-full flex flex-col justify-center items-center text-white text-center px-4 md:px-5 py-12 md:py-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-wider mb-6 md:mb-10 opacity-0 -translate-y-[30px] animate-[fadeInDown_1s_ease_0.3s_forwards] [text-shadow:0_0_30px_rgba(100,200,255,0.5)] leading-tight">
          HOWDOYOUDO CO.,LTD
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-2 md:mb-4 opacity-0 -translate-y-[20px] animate-[fadeInDown_1s_ease_0.6s_forwards] text-white/90 px-4">
          주식회사 하우두유두는 고객이 목표하는 마케팅 성과를 위해
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-12 lg:mb-[60px] opacity-0 -translate-y-[20px] animate-[fadeInDown_1s_ease_0.9s_forwards] text-white/90 px-4">
          BTL영역의 통합적인 Marketing 전략으로 One-Stop Service를 제공합니다.
        </p>

        {/* Process Boxes - No arrows */}
        <div className="flex flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center justify-center w-full max-w-[1000px] px-4">
          <div className="flex-shrink-0 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[200px] opacity-0 scale-75 animate-[fadeInScale_0.8s_ease_1.2s_forwards]">
            <ProcessCube text="기획" />
          </div>

          <div className="flex-shrink-0 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[200px] opacity-0 scale-75 animate-[fadeInScale_0.8s_ease_1.6s_forwards]">
            <ProcessCube text="준비" />
          </div>

          <div className="flex-shrink-0 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[200px] opacity-0 scale-75 animate-[fadeInScale_0.8s_ease_2s_forwards]">
            <ProcessCube text="운영" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AboutBanner;