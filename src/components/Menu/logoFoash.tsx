"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export const LogoFoash = () => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const allShapes = gsap.utils.toArray<SVGPathElement>(
        svgRef.current?.querySelectorAll("g path") || []
      );

      // The O letter is the second path (index 1)
      const oLetter = allShapes[1];

      // All other letters (F, A, S, H, T, M)
      const otherLetters = allShapes.filter((_, index) => index !== 1);
      console.log(oLetter, otherLetters);

      // Initial state - O visible
      gsap.set(oLetter, {
        opacity: 1,
        scale: 1,
        transformOrigin: "center center",
      });

      gsap.set(otherLetters, {
        opacity: 0,
        scale: 0.3,
        x: (index: number) => (index < 1 ? -200 : 200),
        transformOrigin: "center center",
      });

      // Animation timeline
      const tl = gsap.timeline({
        repeat: 0,
        onStart: () => {
          // Hide nav-toggle when animation starts (use document to bypass scope)
          if (window.innerWidth < 1000) {
            const navToggle = document.querySelector(".nav-toggle");
            if (navToggle) {
              gsap.to(navToggle, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          }
        },
        onComplete: () => {
          if (svgRef.current) {
            svgRef.current.setAttribute("viewBox", "156.8 473.57 705.65 173.01");
          }
          if (containerRef.current) {
            containerRef.current.style.width = "190px";
          }

          // Show nav-toggle when animation completes (use document to bypass scope)
          if (window.innerWidth < 1000) {
            const navToggle = document.querySelector(".nav-toggle");
            if (navToggle) {
              gsap.to(navToggle, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.in",
              });
            }
          }
        },
      });

      // Store timeline in ref for handleMouseEnter
      timelineRef.current = tl;

      // Phase 2: O scales up and becomes the focus
      tl.to(
        oLetter,
        {
          scale: 1.3,
          fill: "white",
          duration: 1,
          ease: "back.out(1.5)",
        },
        "-=0.5"
      )
        // Hold the O for a moment
        .to(oLetter, {
          rotation: 360,
          duration: 1.5,
          ease: "power1.inOut",
        })
        // Phase 3: Bring everything back
        .to(oLetter, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          fill: "white",
          duration: 0.8,
          ease: "back.in(1.5)",
        })
        .to(
          otherLetters,
          {
            opacity: 1,
            scale: 1,
            fill: "white",
            x: 0,
            duration: 1,
            ease: "back.out(1.2)",
            stagger: 0.08,
          },
          "-=0.6"
        )
        // Final phase: Hide other letters and show only O in white
        .to(
          otherLetters,
          {
            opacity: 0,
            scale: 0.3,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.02,
          },
          "-=0.2"
        )
        .to(
          oLetter,
          {
            fill: "white",
            duration: 0.2,
            ease: "power2.out",
          },
          "-=0.2"
        );

      tl.to(
        oLetter,
        {
          xPercent: -70,
          duration: 0.4,
          ease: "power2.in",
        },
        "-=0.4"
      );
    },
    {
      scope: svgRef,
    }
  );

  const handleMouseEnter = () => {
    if (timelineRef.current && !timelineRef.current.isActive()) {
      // Reset viewBox and container to initial state
      if (svgRef.current && containerRef.current) {
        svgRef.current.setAttribute("viewBox", "151.69 469.88 759.77 176.7");
        containerRef.current.style.width = "";
      }

      // Restart the timeline
      timelineRef.current.restart();
    }
  };

  return (
    <div
      className="h-auto w-32 md:w-40 flex items-center justify-center justify-self-start self-center"
      ref={containerRef}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        viewBox="151.69 469.88 759.77 176.7"
        style={{
          overflow: "visible",
          width: "100%",
          height: "100%",
        }}
        ref={svgRef}
        onMouseEnter={handleMouseEnter}
      >
        <g>
          {/* F */}
          <path d="M151.69,637.14 191.86,637.14 191.86,579.82 247.31,579.82 247.31,541.99 191.86,541.99 191.86,510.75  		      254.12,510.75 254.12,472.69 151.69,472.69 	"></path>
          {/* O */}
          <path d="M429.31,502.88c0,0.01-4.47,28.87-33.13,28.87c0,0,0,0,0,0.01c6.96,7.81,11.1,18.19,10.78,29.54             c-0.64,22.64-19.25,40.99-41.89,41.33c-23.81,0.36-43.22-18.83-43.22-42.56c0-23.51,19.06-42.56,42.56-42.56h0.04             c1.83,0,3.48-1.07,4.23-2.74c3.48-7.83,12.9-29.04,12.9-29.04c2.23-5.02-0.99-10.83-6.44-11.5c-3.86-0.48-7.8-0.7-11.8-0.65             c-46.91,0.57-85.12,39-85.43,85.91c-0.32,48.33,39,87.56,87.37,87.09c45.84-0.45,84.88-39.22,85.63-85.06             C451.27,539.02,443.05,518.46,429.31,502.88z"></path>
          {/* A */}
          <path d="M508.31,472.69l-59.21,164.46h42.29l9.63-30.54h62.26l9.63,30.54h42.05l-59.21-164.46H508.31z M510.43,576.06l21.61-68.37 		      l21.62,68.37H510.43z"></path>
          {/* S */}
          <path d="M700.72,539.41c-12.69-3.52-32.19-6.58-32.19-19.5c0-9.4,7.75-15.74,19.5-15.74c14.33,0,21.14,7.99,23.26,15.98l37.12-9.16           c-6.34-26.08-30.31-41.11-58.5-41.11c-34.3,0-60.38,18.79-60.38,50.28c0,27.49,14.8,42.76,47.69,50.75           c18.56,4.7,34.77,6.58,34.77,18.8c0,10.81-10.34,16.21-24.2,16.21c-17.86,0-26.55-10.1-28.66-19.5l-37.12,11.51           c7.28,30.54,35.95,42.29,66.25,42.29c41.12,0,64.37-24.43,64.37-51.22C752.65,563.37,740.9,550.69,700.72,539.41z"></path>
          {/* H */}
          <path d="M871.29,535.18 811.61,535.18 811.61,472.69 771.44,472.69 771.44,637.14 811.61,637.14 811.61,573.24  		    871.29,573.24 871.29,637.14 911.46,637.14 911.46,472.69 871.29,472.69 	"></path>
        </g>
      </svg>
    </div>
  );
};

