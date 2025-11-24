'use client';

import { motion } from 'framer-motion';
import React, { ReactNode, useState, useRef } from 'react';
import Image from 'next/image';

interface AboutCardProps {
  title: string;
  subtitle: string;
  headline: ReactNode;
  description: string[];
  reverse?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  backgroundImage?: string;
}

export default function AboutCard({
  title,
  subtitle,
  headline,
  description,
  reverse = false,
  gradientFrom = '#0F172A',
  gradientTo = '#1E293B',
  backgroundImage,
}: AboutCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className={`flex flex-col lg:flex-row items-stretch gap-8 ${
        reverse ? 'lg:flex-row-reverse' : ''
      }`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ 
          scale: 1.03,
          rotateY: reverse ? -2 : 2,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full lg:w-[480px] h-[500px] overflow-hidden cursor-pointer"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Background Image with Grayscale Filter */}
        {backgroundImage && (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover"
              style={{
                filter: 'grayscale(100%)',
              }}
              sizes="480px"
              priority
            />
          </div>
        )}

        {/* Navy Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: backgroundImage 
              ? `linear-gradient(135deg, ${gradientFrom}cc 0%, ${gradientTo}e6 100%)`
              : `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          }}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Mouse-Following Glossy Effect */}
        <div
          className="absolute inset-0 z-[15] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 250px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)`,
          }}
        />

        {/* Floating Decoration */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-8 right-8 w-32 h-32 opacity-10 z-[25]"
        >
          <div className="w-full h-full border-4 border-white transform rotate-45" />
        </motion.div>

        {/* Content Overlay */}
        <div className="relative z-[25] h-full flex flex-col justify-between p-12 pointer-events-none">
          {/* Top Section - Title */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: reverse ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-block"
            >
              <h3 className="text-8xl font-black tracking-tighter text-white leading-none mb-4"
                  style={{ 
                    textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                  }}>
                {title}
              </h3>
            </motion.div>
          </div>

          {/* Bottom Section - Subtitle with Accent */}
          <div>
            <div className="h-1 w-24 bg-white mb-6" />
            <h4 className="text-4xl font-bold text-white/90">
              {subtitle}
            </h4>
          </div>
        </div>

        {/* 3D Shadow Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-[30]"
          style={{
            boxShadow: reverse 
              ? 'inset -8px 0 24px rgba(0,0,0,0.3)' 
              : 'inset 8px 0 24px rgba(0,0,0,0.3)',
          }}
        />
      </motion.div>

      {/* Text Content Section */}
      <div className={`flex-1 flex items-center ${reverse ? "mr-12" : "ml-12"}`}>
        <motion.div
          initial={{ opacity: 0, x: reverse ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-8 max-w-2xl"
        >
          {/* Headline with accent */}
          <div>
            <div className="inline-block">
              <div className="text-3xl font-semibold leading-relaxed text-gray-900">
                {headline}
              </div>
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="h-1 bg-gradient-to-r from-gray-900 to-gray-500 mt-4"
                style={{ transformOrigin: reverse ? 'right' : 'left' }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-5">
            {description.map((line, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                className="text-xl leading-relaxed text-gray-700"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}