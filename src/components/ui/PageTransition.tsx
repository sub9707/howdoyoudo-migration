"use client";

import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function PageTransition({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const overlayRef = useRef<HTMLDivElement | null>(null);
    const logoOverlayRef = useRef<HTMLDivElement | null>(null);
    const logoRef = useRef<SVGSVGElement | null>(null);
    const blocksRef = useRef<HTMLDivElement[]>([]);
    const isTransitioning = useRef(false);

    // -------------------------------
    // Cover Page (Exit Animation) - 시간 단축
    // -------------------------------
    const coverPage = (url: string) => {
        // 스크롤 막기
        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => router.push(url)
        });

        // 블록 애니메이션 - 0.4s -> 0.3s
        tl.to(blocksRef.current, {
            scaleX: 1,
            stagger: 0.015, // 0.02 -> 0.015
            duration: 0.3, // 0.4 -> 0.3
            ease: "power2.inOut",
            transformOrigin: "left",
        });

        // 로고 오버레이 표시
        if (logoOverlayRef.current) {
            tl.set(logoOverlayRef.current, { opacity: 1 }, "-=0.15"); // -=0.2 -> -=0.15
        }

        // 로고 path 애니메이션 - 2s -> 1s, 1s -> 0.5s
        if (logoRef.current) {
            const paths = logoRef.current.querySelectorAll("path");

            paths.forEach((p) => {
                const length = p.getTotalLength();

                tl.set(
                    p,
                    {
                        strokeDashoffset: length,
                        fill: "transparent",
                    },
                    "-=0.2" // -=0.25 -> -=0.2
                );

                tl.to(
                    p,
                    {
                        strokeDashoffset: 0,
                        duration: 1, // 2 -> 1
                        ease: "power2.inOut",
                    },
                    "-=0.4" // -=0.5 -> -=0.4
                );

                tl.to(
                    p,
                    {
                        fill: "#e3e4d8",
                        duration: 0.5, // 1 -> 0.5
                        ease: "power2.inOut",
                    },
                    "-=0.3" // -=0.5 -> -=0.3
                );
            });
        }

        // 로고가 완성된 후 대기 시간 - 0.5s -> 0.3s
        tl.to({}, { duration: 0.3 }); // 0.5 -> 0.3

        // 로고 오버레이 사라짐 - 1.2s -> 0.6s
        if (logoOverlayRef.current) {
            tl.to(logoOverlayRef.current, {
                opacity: 0,
                duration: 0.6, // 1.2 -> 0.6
                ease: "power2.inOut",
            });
        }
    };

    // -------------------------------
    // Reveal Page (Enter Animation) - 시간 단축
    // -------------------------------
    const revealPage = () => {
        gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });

        gsap.to(blocksRef.current, {
            scaleX: 0,
            duration: 0.3, // 0.4 -> 0.3
            stagger: 0.015, // 0.02 -> 0.015
            ease: "power2.inOut",
            transformOrigin: "right",
            onComplete: () => {
                isTransitioning.current = false;
                // 스크롤 복원
                document.body.style.overflow = "";
            },
        });
    };

    // -------------------------------
    // useEffect – 이벤트 등록
    // -------------------------------
    useEffect(() => {
        // 블록 DOM 생성
        const createBlocks = () => {
            if (!overlayRef.current) return;
            overlayRef.current.innerHTML = "";
            blocksRef.current = [];

            for (let i = 0; i < 20; i++) {
                const block = document.createElement("div");
                block.className = "blocker";
                overlayRef.current.appendChild(block);
                blocksRef.current.push(block);
            }
        };

        // 초기 블록 생성
        createBlocks();

        // 초기 블록 상태 설정
        gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

        // 로고 path 초기 세팅
        if (logoRef.current) {
            const paths = logoRef.current.querySelectorAll("path");
            paths.forEach((p) => {
                const length = p.getTotalLength();
                gsap.set(p, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    fill: "transparent",
                });
            });
        }

        // 첫 페이지 들어올 때 애니메이션 실행
        revealPage();

        // ---------------------------
        // Route Change Handler
        // ---------------------------
        const handleRouteChange = (url: string) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;
            coverPage(url);
        };

        // ---------------------------
        // Click Event Handler (공유)
        // ---------------------------
        const handleClick = (e: Event) => {
            e.preventDefault();

            const target = e.currentTarget as HTMLAnchorElement | null;
            if (!target) return;

            const href = target.href;
            const url = new URL(href).pathname;

            if (url !== pathname) {
                handleRouteChange(url);
            }
        };

        // ---------------------------
        // 이벤트 등록
        // ---------------------------
        const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
        links.forEach((link) => link.addEventListener("click", handleClick));

        // cleanup: 이벤트 해제
        return () => {
            links.forEach((link) => link.removeEventListener("click", handleClick));
            // 컴포넌트 언마운트 시 스크롤 복원
            document.body.style.overflow = "";
        };
    }, [pathname, router]);

    return (
        <>
            <div ref={overlayRef} className="transition-overlay"></div>
            <div ref={logoOverlayRef} className="logo-overlay">
                <div className="logo-container">
                    <Logo ref={logoRef} />
                </div>
            </div>
            {children}
        </>
    );
}

export default PageTransition;