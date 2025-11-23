// src/components/layout/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useTransition } from '@/context/TransitionContext';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { isTransitioning } = useTransition();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [stage, setStage] = useState<'idle' | 'closing' | 'loading' | 'opening'>('idle');

  useEffect(() => {
    if (isTransitioning) {
      // 1단계: 커튼 닫기
      setStage('closing');

      // 2단계: 로딩 상태 (어두운 화면)
      const timer1 = setTimeout(() => {
        setStage('loading');
      }, 1400);

      return () => clearTimeout(timer1);
    }
  }, [isTransitioning]);

  useEffect(() => {
    // pathname이 실제로 변경되면 (페이지 로드 완료)
    if (stage === 'loading') {
      setDisplayChildren(children);
      
      // 약간의 딜레이 후 커튼 열기
      const timer = setTimeout(() => {
        setStage('opening');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, stage, children]);

  useEffect(() => {
    // 커튼 열기 완료
    if (stage === 'opening') {
      const timer = setTimeout(() => {
        setStage('idle');
      }, 1900);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  const numBars = 8;
  const bars = Array.from({ length: numBars });

  // 회전 각도 계산
  const getRotation = (index: number) => {
    if (stage === 'idle') return 0;
    if (stage === 'closing') return 180;
    if (stage === 'loading') return 180;
    if (stage === 'opening') return 360;
    return 0;
  };

  // 애니메이션 지속 시간
  const getDuration = () => {
    if (stage === 'loading') return 0;
    if (stage === 'closing') return 1.4;
    if (stage === 'opening') return 1.8;
    return 0;
  };

  return (
    <div className="relative">
      {/* Curtain Overlay */}
      <div
        className="fixed z-50 flex pointer-events-none"
        style={{ 
          perspective: '2000px',
          top: '-10vh',
          left: 0,
          right: 0,
          height: '120vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        {bars.map((_, index) => {
          const delay = index * 0.08;
          const barWidth = `calc(${100 / numBars}% + 2px)`;
          // 각 바의 이미지 위치 계산 (전체 이미지를 8등분)
          const imagePositionX = (index / (numBars - 1)) * 100;

          return (
            <div
              key={index}
              className="relative"
              style={{ 
                width: barWidth,
                height: '100%',
                marginLeft: index === 0 ? 0 : '-2px',
                transformStyle: 'preserve-3d',
                zIndex: stage === 'closing' ? numBars - index : index,
              }}
            >
              <motion.div
                className="absolute inset-0 w-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  height: '100%',
                }}
                animate={{
                  rotateY: getRotation(index),
                  scaleY: stage === 'closing' || stage === 'loading' ? 1.05 : 1,
                }}
                transition={{
                  duration: getDuration(),
                  ease: [0.65, 0, 0.35, 1],
                  delay: stage === 'loading' ? 0 : delay,
                }}
              >
                {/* 앞면 - 투명 */}
                <div
                  className="absolute inset-0 w-full"
                  style={{
                    backfaceVisibility: 'hidden',
                    opacity: 0,
                    height: '100%',
                  }}
                />

                {/* 뒷면 - 이미지 조각 + 어두운 오버레이 */}
                <div
                  className="absolute inset-0 w-full"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  {/* 배경 이미지 조각 - 전체 이미지의 일부분만 표시 */}
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage: 'url(/images/loading.webp)',
                      backgroundSize: `${numBars * 100}% 100%`, // 전체 너비를 8배로 확대
                      backgroundPosition: `${imagePositionX}% center`, // 각 바의 위치
                      backgroundRepeat: 'no-repeat',
                      filter: 'grayscale(100%)',
                    }}
                  />

                  {/* 어두운 그라데이션 오버레이 */}
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(13,17,23,0.85) 0%, rgba(22,27,34,0.9) 50%, rgba(13,17,23,0.85) 100%)',
                    }}
                  />

                  {/* 미세한 빛 효과 */}
                  <motion.div
                    className="absolute inset-0 w-full bg-gradient-to-b from-white/5 via-transparent to-transparent"
                    style={{ height: '100%' }}
                    animate={{
                      opacity: stage === 'closing' || stage === 'opening' ? [0, 0.3, 0] : 0,
                    }}
                    transition={{
                      duration: 1.0,
                      delay: delay + 0.3,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Loading 텍스트 & 비네팅 - z-index를 더 높게 설정 */}
      <AnimatePresence>
        {stage === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{
              zIndex: 9999, // 매우 높은 z-index
            }}
          >
            {/* 비네팅 효과 - 더 강하게 */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, transparent 20%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.95) 100%)',
              }}
            />

            {/* Loading 텍스트 */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* 텍스트 글로우 효과 추가 */}
                <h2 
                  className="text-5xl md:text-7xl font-black tracking-[0.3em] text-white mb-6"
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
                  }}
                >
                  LOADING
                </h2>
                
                {/* 로딩 바 */}
                <div className="w-64 h-1 bg-white/30 mx-auto overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    style={{
                      boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                {/* 점 애니메이션 */}
                <div className="flex justify-center gap-2 mt-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 브랜드 텍스트 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="absolute bottom-12 text-white text-base tracking-[0.3em] font-medium"
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.3)',
              }}
            >
              HOWDOYOUDO
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.div
        key={pathname}
        animate={{
          opacity: stage === 'idle' || stage === 'opening' ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          delay: stage === 'opening' ? 1.0 : 0,
          ease: 'easeOut',
        }}
      >
        {displayChildren}
      </motion.div>
    </div>
  );
}