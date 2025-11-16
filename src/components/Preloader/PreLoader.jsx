"use client";
import "./Preloader.css";
import { useRef, useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";

export let isInitialLoad = true;

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export default function PreLoader() {
  const preloaderRef = useRef(null);
  const karinityRef = useRef(null);
  const foashRef = useRef(null);
  const separatorRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(isInitialLoad);
  const [foashComplete, setFoashComplete] = useState(false);
  const [karinityComplete, setKarinityComplete] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useEffect(() => {
    if (lenis) {
      if (loaderAnimating) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, loaderAnimating]);

  // Karinity Animation - Pac-man eating letters
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
          crumb.setAttribute("opacity", 0.3);
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
            ease: "power2.inOut",
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

      gsap.set(pacmanGroup, {
        x: startX - svgBounds.x,
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
          setKarinityComplete(true);
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
          xPercent: 40,
          duration: 0.4,
          ease: "power2.in",
        },
        moveDuration - 0.4
      );
    },
    {
      scope: karinityRef,
    }
  );

  // Separator Animation - grows from middle to complete vertically, synced with karinity and foash
  useGSAP(
    () => {
      if (!separatorRef.current) return;

      const tl = gsap.timeline({ repeat: 0 });

      // Set initial state - scaled to 0 from center
      gsap.set(separatorRef.current, {
        scaleY: 0,
        opacity: 1,
      });

      // Animate from middle (scaleY: 0) to complete (scaleY: 1) vertically
      tl.to(separatorRef.current, {
        scaleY: 1,
        duration: 3.7,
        ease: "power2.out",
      });
    },
    {
      scope: separatorRef,
    }
  );

  // Foash Animation
  useGSAP(
    () => {
      const allShapes = gsap.utils.toArray(
        foashRef.current?.querySelectorAll("g path")
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
        x: (index) => (index < 1 ? -200 : 200),
        transformOrigin: "center center",
      });

      // Animation timeline
      const tl = gsap.timeline({
        repeat: 0,
        onComplete: () => {
          setFoashComplete(true);
        },
      });

      // Phase 2: O scales up and becomes the focus
      tl.to(
        oLetter,
        {
          scale: 1.3,
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
          opacity: 1,
          rotation: 0,
          fill: "black",
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
            ease: "back.out(1.2)",
            stagger: 0.08,
          },
          "-=0.6"
        )
        // Final phase: Hide other letters and show only O in #d10000
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
            fill: "#d10000",
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
      scope: foashRef,
    }
  );

  // Preloader closing animation (after SVG completes)
  useGSAP(
    () => {
      if (
        !showPreloader ||
        !foashComplete ||
        !karinityComplete ||
        !preloaderRef.current
      )
        return;

      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(preloaderRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.75,
        ease: "hop",
        onStart: () => {
          gsap.set(preloaderRef.current, { pointerEvents: "none" });
        },
        onComplete: () => {
          setTimeout(() => {
            setLoaderAnimating(false);
            setShowPreloader(false);
          }, 100);
        },
      });
    },
    {
      scope: preloaderRef,
      dependencies: [showPreloader, foashComplete, karinityComplete],
    }
  );

  if (!showPreloader) {
    return null;
  }

  return (
    <div
      className="preloader grid grid-cols-[1fr_auto_1fr] gap-4"
      ref={preloaderRef}
    >
      {/* KARINITY - Right Side */}
      <div className="h-auto w-32 md:w-60 lg:w-80 flex items-center justify-center justify-self-end self-center">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlSpace="preserve"
          viewBox="103.77 443.22 872.46 193.56"
          style={{ overflow: "visible" }}
          ref={karinityRef}
        >
          <g>
            <g>
              <path d="M332.65,530.71h-13.71l-5.66,5.66l-2.98-2.98l9.94-9.99v-19.57H301.7v28.12l8,8.05l-8,8v28.17h18.53v-26.88h12.42 			        l26.73,26.88h14.36v-11.92l-24.14-24.24l24.14-24.29v-11.88h-14.36C341.54,521.71,350.48,512.77,332.65,530.71z"></path>
              <path d="M459.8,576.15v-28.17l-8-8l8-8.05V515.7l-11.82-11.88h-35.72l-24.49,24.59v47.74h18.53v-26.88h34.98v26.88L459.8,576.15 			        L459.8,576.15z M411.71,530.71c5.46-5.57,2.73-2.78,8.25-8.3h20.32l10.93,10.98l-2.98,2.98l-5.66-5.66H411.71z"></path>
              <path d="M545.88,564.23c-11.08-11.08-5.51-5.51-16.59-16.64l16.59-16.69v-27.08h-60.16l-11.87,11.88v16.24l8,8.05l-8,8v28.17             h18.53V555.7l6.36-6.41h6.06l26.73,26.88h14.36L545.88,564.23L545.88,564.23z M519.94,530.71h-28.86l-5.66,5.66l-2.98-2.98             c7.25-7.3,3.63-3.68,10.93-10.98h34.83L519.94,530.71z"></path>
              <polygon points="631.95,557.53 605.17,557.53 605.17,522.41 631.95,522.41 631.95,503.83 605.17,503.83 597.92,511.12                590.61,503.83 559.91,503.83 559.91,522.41 580.68,522.41 591.31,511.73 594.29,514.71 586.69,522.41 586.69,557.53                559.91,557.53 559.91,576.15 631.95,576.15 		"></polygon>
              <polygon points="699.49,530.85 709.42,540.84 706.44,543.86 666.6,503.83 645.98,503.83 645.98,576.15 664.51,576.15  			        664.51,528.02 699.49,563.2 699.49,576.15 718.02,576.15 718.02,555.45 710.02,547.45 718.02,539.45 718.02,503.83 699.49,503.83  				      	"></polygon>
              <polygon points="804.09,557.53 777.31,557.53 777.31,522.41 804.09,522.41 804.09,503.83 777.31,503.83 770.06,511.12                762.76,503.83 732.05,503.83 732.05,522.41 752.82,522.41 763.45,511.73 766.43,514.71 758.83,522.41 758.83,557.53                732.05,557.53 732.05,576.15 804.09,576.15 		"></polygon>
              <polygon points="890.16,503.83 863.38,503.83 856.13,511.12 848.83,503.83 818.12,503.83 818.12,522.41 838.89,522.41  			      849.52,511.73 852.5,514.71 844.9,522.41 844.9,576.15 863.38,576.15 863.38,528.82 869.79,522.41 890.16,522.41 		"></polygon>
              <polygon points="957.7,503.83 957.7,524.24 951.29,530.71 921.44,530.71 915.77,536.36 912.79,533.39 922.73,523.4 922.73,503.83              904.19,503.83 904.19,531.95 921.44,549.28 930.97,549.28 930.97,576.15 949.45,576.15 949.45,549.28 958.99,549.28              976.23,531.95 976.23,503.83 		"></polygon>
            </g>
            <g>
              <g>
                <path d="M175.97,443.22h-49.59v33.28c13.15-13.24,30.36-22.43,49.59-25.5V443.22z"></path>
                <polygon
                  className="st0"
                  points="175.68,636.66 175.96,636.76 175.96,636.78 175.68,636.7 		"
                ></polygon>
                <path
                  className="st0"
                  d="M204.93,539.99l66.4,30.96l-2.61,5.62c-14.18,30.35-44.95,49.95-78.43,49.95c-3.73,0-7.41-0.23-11.01-0.7               v-12.49c3.59,0.54,7.26,0.83,11.01,0.83c26.4,0,51.24-14.54,64.36-37.33l-75.37-35.15l-3.31-1.54v-0.29l3.31-1.54l75.37-35.17               c-13.12-22.78-37.96-37.32-64.36-37.32c-3.64,0-7.22,0.27-10.72,0.77c-1.2,0.18-2.41,0.38-3.6,0.61               c-21.1,4.14-39.01,17.26-49.59,35.19c-0.79,1.33-1.55,2.7-2.23,4.09c-0.36,0.68-0.71,1.39-1.03,2.07               c-4.49,9.55-6.99,20.19-6.99,31.42c0,10.92,2.38,21.32,6.65,30.65v23.41c-11.89-14.82-19.01-33.62-19.01-54.05               c0-20.45,7.12-39.26,19.01-54.07c1.15-1.44,2.36-2.85,3.6-4.2c12.78-14.02,30.09-23.82,49.59-27.08c1.17-0.19,2.36-0.37,3.57-0.5               c3.52-0.45,7.12-0.68,10.76-0.68c33.47,0,64.25,19.62,78.43,49.96l2.61,5.6L204.93,539.99z"
                  fill="#d10000"
                ></path>
                <path
                  className="st0"
                  d="M211.51,504.14c5.49,0,10.33-3.7,11.78-8.99l0.47-1.73l-1.62-0.76l-19.67-9.17l-5.18-2.41l-1.79,3.84               l4.75,2.22c-0.64,1.5-0.97,3.12-0.97,4.78C199.28,498.65,204.77,504.14,211.51,504.14z M204.1,488.92l14.45,6.74               c-1.36,2.56-4.06,4.23-7.04,4.23c-4.4,0-7.99-3.58-7.99-7.99C203.52,490.88,203.72,489.86,204.1,488.92z"
                  fill="#d10000"
                ></path>
              </g>
              <path d="M153.09,480.05c-0.59,0.36-1.17,0.73-1.74,1.12c-3.96,2.63-7.64,5.65-10.98,9.01c-5.74,5.75-10.48,12.47-13.98,19.89v8.37             l21.42,21.54l-0.02,0.01l-7.12,7.12l-14.28,14.28v75.36h49.29v-0.06h0.01v-0.03l0.28,0.09V470.9             C167.73,472.6,160.01,475.74,153.09,480.05z"></path>
            </g>
          </g>
        </svg>
      </div>
      <div
        className="bg-black w-0.5 h-14 md:h-20 lg:h-28 justify-self-center self-center"
        ref={separatorRef}
      />
      {/* FOASH - Left Side */}
      <div className="h-auto w-32 md:w-60 lg:w-80 flex items-center justify-center justify-self-start self-center">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlSpace="preserve"
          viewBox="151.69 469.88 759.77 176.7"
          style={{ overflow: "visible" }}
          ref={foashRef}
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
    </div>
  );
}
