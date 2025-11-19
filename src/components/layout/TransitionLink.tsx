'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from '@/context/TransitionContext';
import { MouseEvent, ReactNode } from 'react';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const router = useRouter();
  const { startTransition } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // 같은 페이지면 무시
    if (window.location.pathname === href) return;
    
    // 클릭 콜백 실행
    if (onClick) onClick();
    
    // 트랜지션 시작
    startTransition();
    
    // 커튼 닫히는 동안 대기 후 라우팅
    setTimeout(() => {
      router.push(href);
    }, 1400); // 커튼이 완전히 닫힐 시간
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}