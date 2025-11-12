"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export const LogoKarinity = () => {
  const timelineRef = useRef(null);
  const karinityRef = useRef(null);
  const mouthAnimationRef = useRef(null);

  useGSAP(
    () => {
      if (!karinityRef.current) return;

      // Get the main group
      const mainGroup = karinityRef.current.querySelector("g");

      // Get all letter paths (KARINITY - 8 letters) from first inner group
      const lettersGroup = mainGroup?.querySelector("g:first-of-type");
      const letters = gsap.utils.toArray(
        lettersGroup?.querySelectorAll("path, polygon")
      );

      // Get pac-man group (second inner group) and the final path
      const pacmanGroup = mainGroup?.querySelector("g:nth-of-type(2)");

      if (!letters.length || !pacmanGroup) return;

      // Programming crumbs symbols
      const crumbSymbols = [
        "</>",
        "{}",
        "()",
        "[]",
        ";",
        "//",
        "/*",
        "*/",
        "=>",
        "!=",
        "==",
        "&&",
        "||",
        "<",
        ">",
        "#",
        "$",
        "fn",
        "var",
        "0x",
        "++",
        "--",
      ];

      // Function to create and animate crumbs
      const createCrumbs = (letterElement, letterBounds) => {
        const numCrumbs = gsap.utils.random(2, 5, 1); // 5-10 crumbs per letter
        const crumbs = [];

        for (let i = 0; i < numCrumbs; i++) {
          const crumb = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          const symbol =
            crumbSymbols[Math.floor(Math.random() * crumbSymbols.length)];

          crumb.textContent = symbol;
          crumb.setAttribute("x", letterBounds.centerX);
          crumb.setAttribute("y", letterBounds.centerY);
          crumb.setAttribute("font-size", gsap.utils.random(40, 50));
          crumb.setAttribute("fill", "#333");
          crumb.setAttribute("opacity", 0.5);
          crumb.setAttribute("font-family", "monospace");
          crumb.setAttribute("font-weight", "bold");
          crumb.style.pointerEvents = "none";

          mainGroup.appendChild(crumb);
          crumbs.push(crumb);

          // Animate crumb falling
          gsap.to(crumb, {
            y: `+=${gsap.utils.random(500, 750)}`,
            x: `+=${gsap.utils.random(-40, 40)}`,
            opacity: 0,
            rotation: gsap.utils.random(-180, 180),
            duration: gsap.utils.random(0.6, 1.2),
            ease: "power2.in",
            onComplete: () => {
              crumb.remove();
            },
          });
        }

        return crumbs;
      };

      // Calculate positions for Pac-Man movement
      const svgBounds = karinityRef.current.getBBox();
      const pacmanBounds = pacmanGroup.getBBox();
      const pacmanCenterX = pacmanBounds.x + pacmanBounds.width / 2;
      const pacmanCenterY = pacmanBounds.y + pacmanBounds.height / 2;

      // Get letter positions (centers)
      const letterPositions = letters.map((letter) => {
        const bounds = letter.getBBox();
        return {
          element: letter,
          centerX: bounds.x + bounds.width / 2,
          centerY: bounds.y + bounds.height / 2,
        };
      });

      // Calculate starting position (left of first letter)
      const firstLetterX = letterPositions[0].centerX;
      const startX = firstLetterX - 200; // Start well to the left
      const originalX = startX - svgBounds.x - 20; // Store original position

      gsap.set(pacmanGroup, {
        x: originalX,
        transformOrigin: "center center",
        opacity: 1,
      });

      // Animate pac-man mouth opening/closing continuously
      // The mouth is the main body path (second path with class st0 in the pac-man group)
      // There are multiple .st0 elements, so we need to find the one with our specific coordinates
      const allSt0Paths = pacmanGroup.querySelectorAll("path.st0");
      const mouthPath = Array.from(allSt0Paths).find((path) => {
        const d = path.getAttribute("d");
        return d && d.includes("l-2.61,5.62") && d.includes("l-75.37-35.15");
      });

      // Store the original path string (outside if block so it's accessible in timeline onComplete)
      const originalMouthPath = mouthPath?.getAttribute("d");
      let mouthAnimation = null;

      if (mouthPath && originalMouthPath) {
        // Use the original path for replacements
        const basePath = originalMouthPath;

        // Original path coordinates
        const closedMouth = {
          upperJawY: 5.62, // Top jaw line (original: l-2.61,5.62)
          lowerJawY: -35.15, // Bottom jaw line (original: l-75.37-35.15)
        };

        // Open mouth coordinates (wider angle for chomping effect)
        const openMouth = {
          upperJawY: 10, // Moves up more (wider top jaw)
          lowerJawY: -40, // Moves down more (wider bottom jaw)
        };

        // Create the animation object to interpolate
        const mouthState = { ...closedMouth };

        mouthAnimation = gsap.to(mouthState, {
          upperJawY: openMouth.upperJawY,
          lowerJawY: openMouth.lowerJawY,
          duration: 0.15,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          onUpdate: () => {
            // Build new path by replacing coordinates in the base path
            let newPath = basePath;

            // Replace the upper jaw coordinate (l-2.61,5.62 -> new values)
            newPath = newPath.replace(
              /l-2\.61,5\.62/,
              `l-2.61,${mouthState.upperJawY.toFixed(2)}`
            );

            // Replace the lower jaw coordinate (l-75.37-35.15 -> new values)
            // Note: negative numbers don't have space, so format carefully
            newPath = newPath.replace(
              /l-75\.37-35\.15/,
              `l-75.37${mouthState.lowerJawY.toFixed(2)}`
            );

            mouthPath.setAttribute("d", newPath);
          },
        });
      }

      // Set initial state for letters
      gsap.set(letters, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "center center",
      });

      // Animation timeline - matching foash duration (3.7s total)
      const tl = gsap.timeline({
        repeat: 0,
        onComplete: () => {
          // Stop the mouth animation when letters finish
          if (mouthAnimation && mouthPath && originalMouthPath) {
            mouthAnimation.kill();
            // Reset mouth path to original state
            mouthPath.setAttribute("d", originalMouthPath);
          }
        },
      });

      // Move Pac-Man across letters and eat them
      const moveDuration = 3.7; // Total duration matching foash
      const timePerLetter = moveDuration / letters.length;

      letterPositions.forEach((letterPos, index) => {
        const targetX = letterPos.centerX - svgBounds.x;
        const travelTime = timePerLetter;
        const startTime = index * timePerLetter;

        // Move Pac-Man to letter position
        tl.to(
          pacmanGroup,
          {
            x: targetX - 200,
            duration: travelTime,
            ease: "power2.out",
          },
          startTime
        );

        // Eat letter when Pac-Man reaches it (trigger slightly before center for snappy feel)
        const eatTime = startTime + travelTime * 0.7;
        tl.to(
          letterPos.element,
          {
            scale: 0,
            opacity: 0,
            duration: 0.18,
            ease: "back.in(1.2)",
            onStart: () => {
              // Create programming crumbs when letter starts being eaten
              createCrumbs(letterPos.element, letterPos);
            },
          },
          eatTime - 0.06
        );
      });

      // Exit: move Pac-Man off screen to the right
      tl.to(
        pacmanGroup,
        {
          xPercent: -100,
          duration: 0.4,
          ease: "power2.in",
        },
        moveDuration - 0.4
      );

      // Return Pac-Man to original position
      tl.to(
        pacmanGroup,
        {
          xPercent: 0,
          x: originalX,
          duration: 0.4,
          ease: "power2.out",
        },
        moveDuration
      );

      // After Pac-Man Returns to original position, reset the letters out of the Pac-Man
      tl.to(
        letters,
        {
          scale: 1,
          opacity: 1,
        },
        moveDuration
      );

      timelineRef.current = tl;
    },
    {
      scope: karinityRef,
    }
  );

  const handleMouseEnter = () => {
    if (timelineRef.current && !timelineRef.current.isActive()) {
      // Only restart if the animation is not currently playing
      timelineRef.current.restart();
    }
  };

  return (
    <svg
      version="1.1"
      id="karinity-logo"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="100 430 920 310"
      ref={karinityRef}
      xmlSpace="preserve"
      className="cursor-pointer"
      onMouseEnter={handleMouseEnter}
    >
      <g>
        <g>
          <path
            d="M332.65,530.71h-13.71l-5.66,5.66l-2.98-2.98l9.94-9.99v-19.57H301.7v28.12l8,8.05l-8,8v28.17h18.53v-26.88h12.42
          l26.73,26.88h14.36v-11.92l-24.14-24.24l24.14-24.29v-11.88h-14.36C341.54,521.71,350.48,512.77,332.65,530.71z"
          />
          <path
            d="M459.8,576.15v-28.17l-8-8l8-8.05V515.7l-11.82-11.88h-35.72l-24.49,24.59v47.74h18.53v-26.88h34.98v26.88L459.8,576.15
          L459.8,576.15z M411.71,530.71c5.46-5.57,2.73-2.78,8.25-8.3h20.32l10.93,10.98l-2.98,2.98l-5.66-5.66H411.71z"
          />
          <path
            d="M545.88,564.23c-11.08-11.08-5.51-5.51-16.59-16.64l16.59-16.69v-27.08h-60.16l-11.87,11.88v16.24l8,8.05l-8,8v28.17
        h18.53V555.7l6.36-6.41h6.06l26.73,26.88h14.36L545.88,564.23L545.88,564.23z M519.94,530.71h-28.86l-5.66,5.66l-2.98-2.98
        c7.25-7.3,3.63-3.68,10.93-10.98h34.83L519.94,530.71z"
          />
          <polygon
            points="631.95,557.53 605.17,557.53 605.17,522.41 631.95,522.41 631.95,503.83 605.17,503.83 597.92,511.12 
          590.61,503.83 559.91,503.83 559.91,522.41 580.68,522.41 591.31,511.73 594.29,514.71 586.69,522.41 586.69,557.53 
          559.91,557.53 559.91,576.15 631.95,576.15 		"
          />
          <polygon
            points="699.49,530.85 709.42,540.84 706.44,543.86 666.6,503.83 645.98,503.83 645.98,576.15 664.51,576.15 
          664.51,528.02 699.49,563.2 699.49,576.15 718.02,576.15 718.02,555.45 710.02,547.45 718.02,539.45 718.02,503.83 699.49,503.83 
            "
          />
          <polygon
            points="804.09,557.53 777.31,557.53 777.31,522.41 804.09,522.41 804.09,503.83 777.31,503.83 770.06,511.12 
          762.76,503.83 732.05,503.83 732.05,522.41 752.82,522.41 763.45,511.73 766.43,514.71 758.83,522.41 758.83,557.53 
          732.05,557.53 732.05,576.15 804.09,576.15 		"
          />
          <polygon
            points="890.16,503.83 863.38,503.83 856.13,511.12 848.83,503.83 818.12,503.83 818.12,522.41 838.89,522.41 
        849.52,511.73 852.5,514.71 844.9,522.41 844.9,576.15 863.38,576.15 863.38,528.82 869.79,522.41 890.16,522.41 		"
          />
          <polygon
            points="957.7,503.83 957.7,524.24 951.29,530.71 921.44,530.71 915.77,536.36 912.79,533.39 922.73,523.4 922.73,503.83 
        904.19,503.83 904.19,531.95 921.44,549.28 930.97,549.28 930.97,576.15 949.45,576.15 949.45,549.28 958.99,549.28 
        976.23,531.95 976.23,503.83 		"
          />
        </g>
        <g>
          <g>
            <path d="M175.97,443.22h-49.59v33.28c13.15-13.24,30.36-22.43,49.59-25.5V443.22z" />
            <polygon
              className="st0"
              points="175.68,636.66 175.96,636.76 175.96,636.78 175.68,636.7 		"
            />
            <path
              className="st0"
              d="M204.93,539.99l66.4,30.96l-2.61,5.62c-14.18,30.35-44.95,49.95-78.43,49.95c-3.73,0-7.41-0.23-11.01-0.7
          v-12.49c3.59,0.54,7.26,0.83,11.01,0.83c26.4,0,51.24-14.54,64.36-37.33l-75.37-35.15l-3.31-1.54v-0.29l3.31-1.54l75.37-35.17
          c-13.12-22.78-37.96-37.32-64.36-37.32c-3.64,0-7.22,0.27-10.72,0.77c-1.2,0.18-2.41,0.38-3.6,0.61
          c-21.1,4.14-39.01,17.26-49.59,35.19c-0.79,1.33-1.55,2.7-2.23,4.09c-0.36,0.68-0.71,1.39-1.03,2.07
          c-4.49,9.55-6.99,20.19-6.99,31.42c0,10.92,2.38,21.32,6.65,30.65v23.41c-11.89-14.82-19.01-33.62-19.01-54.05
          c0-20.45,7.12-39.26,19.01-54.07c1.15-1.44,2.36-2.85,3.6-4.2c12.78-14.02,30.09-23.82,49.59-27.08c1.17-0.19,2.36-0.37,3.57-0.5
          c3.52-0.45,7.12-0.68,10.76-0.68c33.47,0,64.25,19.62,78.43,49.96l2.61,5.6L204.93,539.99z"
              fill="#d10000"
            />
            <path
              className="st0"
              d="M211.51,504.14c5.49,0,10.33-3.7,11.78-8.99l0.47-1.73l-1.62-0.76l-19.67-9.17l-5.18-2.41l-1.79,3.84
          l4.75,2.22c-0.64,1.5-0.97,3.12-0.97,4.78C199.28,498.65,204.77,504.14,211.51,504.14z M204.1,488.92l14.45,6.74
          c-1.36,2.56-4.06,4.23-7.04,4.23c-4.4,0-7.99-3.58-7.99-7.99C203.52,490.88,203.72,489.86,204.1,488.92z"
              fill="#d10000"
            />
          </g>
          <path
            d="M153.09,480.05c-0.59,0.36-1.17,0.73-1.74,1.12c-3.96,2.63-7.64,5.65-10.98,9.01c-5.74,5.75-10.48,12.47-13.98,19.89v8.37
        l21.42,21.54l-0.02,0.01l-7.12,7.12l-14.28,14.28v75.36h49.29v-0.06h0.01v-0.03l0.28,0.09V470.9
        C167.73,472.6,160.01,475.74,153.09,480.05z"
          />
        </g>
      </g>
    </svg>
  );
};
