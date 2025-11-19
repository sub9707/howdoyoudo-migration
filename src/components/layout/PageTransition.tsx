// src/components/layout/PageTransition.tsx
'use client';

import { motion } from 'framer-motion';
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
        className="fixed inset-0 z-50 flex pointer-events-none"
        style={{ 
          perspective: '2000px',
          height: '100vh',
          width: '100vw',
        }}
      >
        {bars.map((_, index) => {
          const delay = index * 0.08;

          return (
            <div
              key={index}
              className="relative flex-1 h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className="absolute inset-0 h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                }}
                animate={{
                  rotateY: getRotation(index),
                }}
                transition={{
                  duration: getDuration(),
                  ease: [0.65, 0, 0.35, 1],
                  delay: stage === 'loading' ? 0 : delay,
                }}
              >
                {/* 앞면 - 투명 */}
                <div
                  className="absolute inset-0 h-full"
                  style={{
                    backfaceVisibility: 'hidden',
                    opacity: 0,
                  }}
                />

                {/* 뒷면 - 어두운 커튼 */}
                <div
                  className="absolute inset-0 h-full"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* 어두운 그라데이션 */}
                  <div className="absolute inset-0 h-full bg-gradient-to-b from-[#0d1117] via-[#161b22] to-[#0d1117]" />

                  {/* 미세한 빛 효과 */}
                  <motion.div
                    className="absolute inset-0 h-full bg-gradient-to-b from-white/5 via-transparent to-transparent"
                    animate={{
                      opacity: stage === 'closing' || stage === 'opening' ? [0, 0.3, 0] : 0,
                    }}
                    transition={{
                      duration: 1.0,
                      delay: delay + 0.3,
                    }}
                  />

                  {/* 가장자리 라인 */}
                  <div className="absolute left-0 top-0 h-full w-[1px] bg-white/5" />
                  <div className="absolute right-0 top-0 h-full w-[1px] bg-white/5" />

                  {/* 내부 그림자 */}
                  <div className="absolute inset-0 h-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

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