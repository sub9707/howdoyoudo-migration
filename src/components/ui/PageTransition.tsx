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

    const coverPage = (url: string) => {
        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => router.push(url)
        });

        tl.to(blocksRef.current, {
            scaleX: 1,
            stagger: 0.02,
            duration: 0.4,
            ease: "power2.inOut",
            transformOrigin: "left",
        });

        if (logoOverlayRef.current) {
            tl.set(logoOverlayRef.current, { opacity: 1 }, "-=0.2");
        }

        if (logoRef.current) {
            const paths = logoRef.current.querySelectorAll("path");

            paths.forEach((p) => {
                const length = (p as SVGPathElement).getTotalLength();

                tl.set(
                    p,
                    {
                        strokeDashoffset: length,
                        fill: "transparent",
                    },
                    "-=0.25"
                );

                tl.to(
                    p,
                    {
                        strokeDashoffset: 0,
                        duration: 2,
                        ease: "power2.inOut",
                    },
                    "-=0.5"
                );

                tl.to(
                    p,
                    {
                        fill: "#e3e4d8",
                        duration: 1,
                        ease: "power2.inOut",
                    },
                    "-=0.5"
                );
            });
        }

        tl.to({}, { duration: 0.5 });

        if (logoOverlayRef.current) {
            tl.to(logoOverlayRef.current, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
            });
        }
    };

    const revealPage = () => {
        gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });

        gsap.to(blocksRef.current, {
            scaleX: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.inOut",
            transformOrigin: "right",
            onComplete: () => {
                isTransitioning.current = false;
                document.body.style.overflow = "";
            },
        });
    };

    useEffect(() => {
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

        createBlocks();
        gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

        if (logoRef.current) {
            const paths = logoRef.current.querySelectorAll("path");
            paths.forEach((p) => {
                const length = (p as SVGPathElement).getTotalLength();
                gsap.set(p, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    fill: "transparent",
                });
            });
        }

        revealPage();

        const handleRouteChange = (url: string) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;
            coverPage(url);
        };

        const resetAnyAnimationsAndState = () => {
            // 현재 진행중인 tweens 즉시 중지하고 상태를 기본으로 되돌림
            try {
                if (blocksRef.current.length) {
                    gsap.killTweensOf(blocksRef.current);
                    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });
                }

                if (logoRef.current) {
                    const paths = Array.from(logoRef.current.querySelectorAll("path"));
                    if (paths.length) {
                        gsap.killTweensOf(paths);
                        paths.forEach((p) => {
                            gsap.set(p, { strokeDashoffset: 0, fill: "transparent" });
                        });
                    }
                }

                if (logoOverlayRef.current) {
                    gsap.killTweensOf(logoOverlayRef.current);
                    gsap.set(logoOverlayRef.current, { opacity: 0 });
                }
            } catch (err) {
                // 안전하게 실패 무시
                // console.warn("resetAnyAnimationsAndState failed", err);
            }
            isTransitioning.current = false;
            document.body.style.overflow = "";
        };

        const handleClick = (e: Event) => {
            // 이 핸들러는 각 링크에 직접 바인딩됨 (querySelectorAll 사용)
            e.preventDefault();

            const target = e.currentTarget as HTMLAnchorElement | null;
            if (!target) return;

            const href = target.href;
            const url = new URL(href).pathname;

            // 같은 경로면 무시
            if (url === pathname) return;

            // **여기서 핵심: data-no-transition 검사**
            const noTransitionAttr = target.getAttribute("data-no-transition");
            const noTransitionDataset = (target.dataset && target.dataset.noTransition) || null;
            const shouldSkip = noTransitionAttr === "true" || noTransitionDataset === "true";

            if (shouldSkip) {
                // 진행중인 애니메이션 정리 -> 화면에 transition 끝부분만 보이는 문제 방지
                resetAnyAnimationsAndState();

                // 즉시 라우팅 (transition 없이)
                router.push(url);
                return;
            }

            // 기본 동작: 트랜지션 실행
            if (isTransitioning.current) return;
            isTransitioning.current = true;
            coverPage(url);
        };

        const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
        links.forEach((link) => link.addEventListener("click", handleClick));

        return () => {
            links.forEach((link) => link.removeEventListener("click", handleClick));
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
            {/* transform 속성 제거 */}
            <div style={{ minHeight: '100vh' }}>
                {children}
            </div>
        </>
    );
}

export default PageTransition;
