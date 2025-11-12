"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export const LogoFoash = () => {
  const timelineRef = useRef(null);

  useGSAP(() => {
    const allShapes = gsap.utils.toArray("#logo polygon, #logo path");

    // The O letter is the second path (index 1)
    const oLetter = allShapes[1];

    // All other letters (F, A, S, H, T, M)
    const otherLetters = allShapes.filter((_, index) => index !== 1);

    // Initial state - all visible
    gsap.set(oLetter, {
      opacity: 1,
      scale: 1,
      fill: "#d10000",
      transformOrigin: "center center",
    });

    gsap.set(otherLetters, {
      opacity: 0,
      scale: 0.3,
      x: (index) => (index < 1 ? -200 : 200),
      transformOrigin: "center center",
    });

    // Animation timeline
    const tl = gsap
      .timeline({
        repeat: 0,
      })
      // Phase 2: O scales up and becomes the focus
      .to(
        oLetter,
        {
          scale: 1.5,
          fill: "#d10000",
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
        rotation: 0,

        fill: "#d10000",
        duration: 0.8,
        ease: "back.in(1.5)",
      })
      .to(
        otherLetters,
        {
          opacity: 1,
          scale: 1,

          fill: "black",
          x: 0,
          duration: 1,
          se: "back.out(1.2)",
          stagger: 0.08,
        },
        "-=0.6"
      );

    // Store timeline in ref for hover access
    timelineRef.current = tl;
  });

  const handleMouseEnter = () => {
    if (timelineRef.current && !timelineRef.current.isActive()) {
      // Only restart if the animation is not currently playing
      timelineRef.current.restart();
    }
  };
  return (
    <svg
      version="1.1"
      id="logo"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="100 430 920 310"
      className=" cursor-pointer"
      xmlSpace="preserve"
      onMouseEnter={handleMouseEnter}
    >
      <g>
        {/* F */}
        <polygon
          points="151.69,637.14 191.86,637.14 191.86,579.82 247.31,579.82 247.31,541.99 191.86,541.99 191.86,510.75 
		      254.12,510.75 254.12,472.69 151.69,472.69 	"
        />
        {/* O */}
        <path
          d="M429.31,502.88c0,0.01-4.47,28.87-33.13,28.87c0,0,0,0,0,0.01c6.96,7.81,11.1,18.19,10.78,29.54
            c-0.64,22.64-19.25,40.99-41.89,41.33c-23.81,0.36-43.22-18.83-43.22-42.56c0-23.51,19.06-42.56,42.56-42.56h0.04
            c1.83,0,3.48-1.07,4.23-2.74c3.48-7.83,12.9-29.04,12.9-29.04c2.23-5.02-0.99-10.83-6.44-11.5c-3.86-0.48-7.8-0.7-11.8-0.65
            c-46.91,0.57-85.12,39-85.43,85.91c-0.32,48.33,39,87.56,87.37,87.09c45.84-0.45,84.88-39.22,85.63-85.06
            C451.27,539.02,443.05,518.46,429.31,502.88z"
          className="fill-[#d10000]"
        />
        {/* A */}
        <path
          d="M508.31,472.69l-59.21,164.46h42.29l9.63-30.54h62.26l9.63,30.54h42.05l-59.21-164.46H508.31z M510.43,576.06l21.61-68.37
		      l21.62,68.37H510.43z"
        />
        {/* S */}
        <path
          d="M700.72,539.41c-12.69-3.52-32.19-6.58-32.19-19.5c0-9.4,7.75-15.74,19.5-15.74c14.33,0,21.14,7.99,23.26,15.98l37.12-9.16
          c-6.34-26.08-30.31-41.11-58.5-41.11c-34.3,0-60.38,18.79-60.38,50.28c0,27.49,14.8,42.76,47.69,50.75
          c18.56,4.7,34.77,6.58,34.77,18.8c0,10.81-10.34,16.21-24.2,16.21c-17.86,0-26.55-10.1-28.66-19.5l-37.12,11.51
          c7.28,30.54,35.95,42.29,66.25,42.29c41.12,0,64.37-24.43,64.37-51.22C752.65,563.37,740.9,550.69,700.72,539.41z"
        />
        {/* H */}
        <polygon
          points="871.29,535.18 811.61,535.18 811.61,472.69 771.44,472.69 771.44,637.14 811.61,637.14 811.61,573.24 
		    871.29,573.24 871.29,637.14 911.46,637.14 911.46,472.69 871.29,472.69 	"
        />
        {/* T */}
        <polygon
          points="911.46,436.75 921.36,436.75 921.36,464.7 924.61,464.7 924.61,436.75 933.81,436.75 933.81,433.43 911.46,433.43 
		      	"
        />
        {/* M */}
        <polygon
          points="964.25,433.43 953.6,459.75 953.24,459.75 942.71,433.43 938.34,433.43 938.34,464.7 941.54,464.7 941.54,439.37 
	      	941.9,439.31 951.91,464.7 954.87,464.7 964.71,440.12 965.07,440.18 965.07,464.7 968.26,464.7 968.26,433.43 	"
        />
      </g>
    </svg>
  );
};
