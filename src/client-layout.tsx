"use client";
import { useEffect, useState, useRef, ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import Menu from "./components/Menu/Menu";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pageRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollSettings = isMobile
    ? {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical" as const,
        gestureDirection: "vertical" as const,
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 1,
        infinite: false,
        lerp: 0.05,
        wheelMultiplier: 0.6,
        orientation: "vertical" as const,
        smoothWheel: true,
        syncTouch: true,
      }
    : {
        duration: 2.0, // Increased from 1.2
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical" as const,
        gestureDirection: "vertical" as const,
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 1.2, // Decreased from 2
        infinite: false,
        lerp: 0.05, // Decreased from 0.1
        wheelMultiplier: 0.6, // Decreased from 1
        orientation: "vertical" as const,
        smoothWheel: true,
        syncTouch: true,
      };

  return (
    <ReactLenis root options={scrollSettings}>
      <Menu pageRef={pageRef} />

      <div className="overflow-x-hidden w-full" ref={pageRef}>
        {children}
      </div>
    </ReactLenis>
  );
}
