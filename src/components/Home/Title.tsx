"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

export const Title = () => {
  const creativeRef = useRef<HTMLSpanElement>(null);
  const helloRef = useRef<HTMLHeadingElement>(null);
  const wereRef = useRef<HTMLHeadingElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Text to animate
  const text1 = "CREATIVE";

  // Generate object assignments for each letter
  const getObjectForIndex = (index: number): string => {
    // We have 14 objects (obj-1 to obj-14)
    const objectNumber = (index % 14) + 7;
    return `/objects/obj-${objectNumber}.png`;
  };

  // Initial load animation for HELLO and WE'RE
  useGSAP(() => {
    if (helloRef.current && wereRef.current && !isLoaded) {
      const helloText = new SplitType(helloRef.current, { types: "chars" });
      const wereText = new SplitType(wereRef.current, { types: "chars" });

      const helloChars = helloText.chars as HTMLElement[];
      const wereChars = wereText.chars as HTMLElement[];

      // Set initial state
      gsap.set([helloChars, wereChars], {
        opacity: 0,
        y: 100,
        rotationX: -90,
        transformOrigin: "center bottom",
      });

      // Create staggered animation
      const tl = gsap.timeline({
        onComplete: () => setIsLoaded(true),
      });

      // Animate HELLO
      tl.to(helloChars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)",
      });

      // Animate WE'RE slightly overlapping
      tl.to(
        wereChars,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );
    }
  }, [isLoaded]);

  // Hover effect for HELLO and WE'RE - both animate together
  const handleHelloHover = (isEntering: boolean) => {
    if (!helloRef.current || !wereRef.current) return;

    const helloChars = helloRef.current.querySelectorAll(
      ".char"
    ) as NodeListOf<HTMLElement>;
    const wereChars = wereRef.current.querySelectorAll(
      ".char"
    ) as NodeListOf<HTMLElement>;
    const allChars = [...Array.from(helloChars), ...Array.from(wereChars)];

    gsap.to(allChars, {
      y: isEntering ? -15 : 0,
      rotationY: isEntering ? 360 : 0,
      color: isEntering ? "#d10000" : "#8c7e77",
      duration: 0.6,
      stagger: {
        each: 0.03,
        from: "start",
      },
      ease: "elastic.out(1, 0.5)",
    });
  };

  // Hover animation with GSAP
  useGSAP(() => {
    if (creativeRef.current) {
      const container = creativeRef.current;
      const chars = container.querySelectorAll(
        ".letter-container"
      ) as NodeListOf<HTMLElement>;

      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Kill all existing animations on these elements
      chars.forEach((charContainer) => {
        const char = charContainer.querySelector(".char") as HTMLElement;
        const img = charContainer.querySelector("img") as HTMLImageElement;
        gsap.killTweensOf([char, img]);
      });

      // Create a new timeline
      timelineRef.current = gsap.timeline();

      if (isHovered) {
        chars.forEach((charContainer, index) => {
          const char = charContainer.querySelector(".char") as HTMLElement;
          const img = charContainer.querySelector("img") as HTMLImageElement;
          const delay = index * 0.08;

          // Letter goes DOWN and fades out
          timelineRef.current!.to(
            char,
            {
              opacity: 0,
              y: -50,
              duration: 0.4,
              ease: "power2.in",
              force3D: true,
            },
            delay
          );

          // Object comes FROM ABOVE
          timelineRef.current!.fromTo(
            img,
            {
              opacity: 0,
              y: 50,
              scale: 0.5,
              rotation: index % 2 === 0 ? -180 : 180,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1.2,
              rotation: index % 2 === 0 ? 0 : 0,
              duration: 0.5,
              ease: "back.out(1.7)",
              force3D: true,
            },
            delay + 0.15
          );
        });
      } else {
        chars.forEach((charContainer, index) => {
          const char = charContainer.querySelector(".char") as HTMLElement;
          const img = charContainer.querySelector("img") as HTMLImageElement;
          const delay = index * 0.06;

          // Letter comes FROM ABOVE
          timelineRef.current!.fromTo(
            char,
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "back.out(1.7)",
              force3D: true,
            },
            delay
          );

          // Object goes DOWN
          timelineRef.current!.to(
            img,
            {
              opacity: 0,
              y: -50,
              scale: 0,
              duration: 0.4,
              ease: "power2.in",
              force3D: true,
            },
            delay
          );
        });
      }
    }

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isHovered]);

  const renderAnimatedText = (text: string, startIndex = 0) => {
    return text.split("").map((char, index) => {
      const globalIndex = startIndex + index;

      return (
        <span
          key={globalIndex}
          className="letter-container relative inline-flex items-center justify-center"
          style={{
            width: "clamp(1rem, 4vw, 2rem)", // Fixed width for consistent object sizing
            height: "clamp(1rem, 4vw, 2rem)", // Fixed height to maintain aspect ratio
            willChange: "transform, opacity",
          }}
        >
          <span
            className="char inline-block"
            style={{
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
          >
            {char}
          </span>
          <img
            src={getObjectForIndex(globalIndex)}
            alt=""
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: "clamp(1rem, 4vw, 2rem)", // Match container width
              height: "clamp(1rem, 4vw, 2rem)", // Match container height
              objectFit: "contain",
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0.5)",
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
          />
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 lg:gap-8 xl:gap-10 flex-1 w-full px-2 sm:px-4">
      <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 text-center w-full">
        <h2
          ref={helloRef}
          className="text-6xl! lg:text-7xl! xl:text-8xl! inline-flex m-0 tracking-tight xs:tracking-normal cursor-pointer perspective-1000"
          onMouseEnter={() => handleHelloHover(true)}
          onMouseLeave={() => handleHelloHover(false)}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          HELLO,
        </h2>
        <h2
          ref={wereRef}
          className="text-6xl! lg:text-7xl! xl:text-8xl! inline-flex m-0 tracking-tight xs:tracking-normal cursor-pointer perspective-1000"
          onMouseEnter={() => handleHelloHover(true)}
          onMouseLeave={() => handleHelloHover(false)}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          WE'RE
        </h2>
      </div>

      <div className="relative mt-2 xs:mt-3 sm:mt-4 md:mt-0 w-full max-w-full overflow-hidden flex items-center justify-center">
        <p className="w-[80%] xs:w-fit md:w-fit text-xl! xl:text-2xl! font-medium tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] cursor-pointer grid lg:flex grid-rows-3 gap-2 sm:gap-3 md:gap-5 sm:whitespace-nowrap text-center">
          <span className="inline-block justify-self-start">YOUR</span>
          <span
            ref={creativeRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-flex justify-self-center"
          >
            {renderAnimatedText(text1, 0)}
          </span>
          <span className="inline-block justify-self-end">PARTNER</span>
        </p>
      </div>
    </div>
  );
};
