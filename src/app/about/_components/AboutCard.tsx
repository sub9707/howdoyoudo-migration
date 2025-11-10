'use client';

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AboutCardProps {
  title: string;
  subtitle: string;
  headline: ReactNode;
  description: string[];
  reverse?: boolean;
}

export default function AboutCard({
  title,
  subtitle,
  headline,
  description,
  reverse = false,
}: AboutCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className={`flex flex-col md:flex-row items-start md:items-center gap-16 ${
        reverse ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Left Card */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="w-72 h-72 border-2 border-black bg-white flex flex-col justify-center items-center text-center shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#000] transition-shadow duration-300"
      >
        <h3 className="text-4xl font-extrabold tracking-tighter uppercase text-black">
          {title}
        </h3>
        <h4 className="text-3xl font-black text-black mt-3 leading-tight">
          {subtitle}
        </h4>
      </motion.div>

      {/* Right Text */}
      <div className="flex-1">
        <div className="space-y-8 max-w-2xl">
          <p className="text-2xl font-medium leading-relaxed text-gray-900">
            {headline}
          </p>
          <div className="w-20 h-[3px] bg-black"></div>
          {description.map((line, idx) => (
            <p key={idx} className="text-xl leading-relaxed text-neutral-700">
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
