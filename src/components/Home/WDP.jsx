"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const WDP = () => {
  const containerRef = useRef(null);
  const wExplosionRef = useRef(null);
  const dExplosionRef = useRef(null);
  const pExplosionRef = useRef(null);
  const mExplosionRef = useRef(null);
  const wTextRef = useRef(null);
  const mTextRef = useRef(null);
  const dTextRef = useRef(null);
  const pTextRef = useRef(null);
  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 150,
    horizontalForce: 15,
    verticalForce: 12,
    rotationSpeed: 8,
  };

  // Full words for each letter
  const fullWords = {
    w: "eb",
    m: "obile",
    d: "esign",
    p: "rint",
  };

  // Different images for each letter
  const explosionImages = {
    w: [
      "/objects/obj-11.png",
      "/objects/obj-11.png",
      "/objects/obj-11.png",
      "/objects/obj-11.png",
      "/objects/obj-11.png",
      "/objects/obj-11.png",
      "/objects/obj-11.png",
    ],
    m: [
      "/objects/obj-14.png",
      "/objects/obj-14.png",
      "/objects/obj-14.png",
      "/objects/obj-14.png",
      "/objects/obj-14.png",
    ],
    d: [
      "/objects/obj-12.png",
      "/objects/obj-12.png",
      "/objects/obj-12.png",
      "/objects/obj-12.png",
      "/objects/obj-12.png",
      "/objects/obj-12.png",
      "/objects/obj-12.png",
      "/objects/obj-12.png",
    ],
    p: [
      "/objects/obj-13.png",
      "/objects/obj-13.png",
      "/objects/obj-13.png",
      "/objects/obj-13.png",
      "/objects/obj-13.png",
      "/objects/obj-13.png",
      "/objects/obj-13.png",
      "/objects/obj-13.png",
    ],
  };

  class Particle {
    constructor(element) {
      this.element = element;
      this.x = 0;
      this.y = 0;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 8;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
  }

  useGSAP(
    () => {
      let activeAnimations = {
        w: null,
        d: null,
        p: null,
        m: null,
      };

      let clickTimeouts = {
        w: null,
        d: null,
        p: null,
        m: null,
      };

      // Detect if touch device
      const isTouchDevice = () => {
        return (
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        );
      };

      // Preload images
      Object.values(explosionImages).forEach((paths) => {
        paths.forEach((path) => {
          const img = new Image();
          img.src = path;
        });
      });

      const getComputedImageSize = () => {
        const viewportWidth =
          typeof window !== "undefined" ? window.innerWidth : 1200;
        return Math.max(80, Math.min(config.imageSize, viewportWidth * 0.01));
      };

      const createParticles = (explosionRef, imagePaths) => {
        if (!explosionRef.current) return;
        explosionRef.current.innerHTML = "";

        const particleSize = getComputedImageSize();
        explosionRef.current.style.setProperty(
          "--particle-size",
          `${particleSize}px`
        );

        imagePaths.forEach((path) => {
          const particle = document.createElement("img");
          particle.src = path;
          particle.className =
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none";
          particle.style.width = `var(--particle-size, 40px)`;
          particle.style.height = `var(--particle-size, 40px)`;
          particle.style.objectFit = "contain";
          particle.style.willChange = "transform";
          explosionRef.current.appendChild(particle);
        });
      };

      const explode = (explosionRef, imagePaths, letter) => {
        // Cancel any existing animation for this letter
        if (activeAnimations[letter]) {
          cancelAnimationFrame(activeAnimations[letter]);
          activeAnimations[letter] = null;
        }

        if (!explosionRef.current) return;

        createParticles(explosionRef, imagePaths);

        const particleElements = explosionRef.current.querySelectorAll("img");
        const particles = Array.from(particleElements).map(
          (element) => new Particle(element)
        );

        let animationFrames = 0;
        const maxFrames = 200; // Run for about 3-4 seconds at 60fps

        const animate = () => {
          particles.forEach((particle) => particle.update());
          animationFrames++;

          if (animationFrames < maxFrames) {
            activeAnimations[letter] = requestAnimationFrame(animate);
          } else {
            // Fade out and cleanup
            gsap.to(particleElements, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                if (explosionRef.current) {
                  explosionRef.current.innerHTML = "";
                }
              },
            });
          }
        };

        animate();
      };

      const animateTextIn = (textRef, word) => {
        if (!textRef.current) return;
        // First, make the parent visible
        gsap.set(textRef.current, { display: "inline" });
        const letters = textRef.current.querySelectorAll(".letter");
        gsap.killTweensOf(letters);

        gsap.fromTo(
          letters,
          {
            opacity: 0,
            display: "inline-block",
            x: -10,
            scale: 0.8,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: "back.out(1.7)",
          }
        );
      };

      const animateTextOut = (textRef) => {
        if (!textRef.current) return;

        const letters = textRef.current.querySelectorAll(".letter");
        gsap.killTweensOf(letters);

        gsap.to(letters, {
          opacity: 0,
          x: 10,
          scale: 0.8,
          duration: 0.2,
          stagger: 0.03,
          ease: "power2.in",
          onComplete: () => {
            // Hide parent after animation completes
            if (textRef.current) {
              gsap.set(textRef.current, { display: "none" });
            }
          },
        });
      };

      const handleMouseEnter = (
        letter,
        explosionRef,
        imagePaths,
        textRef,
        element
      ) => {
        explode(explosionRef, imagePaths, letter);
        animateTextIn(textRef, fullWords[letter]);

        // Change color on hover
        const colors = {
          w: "#e46235",
          m: "#357eb1",
          d: "#fdc135",
          p: "#9c93cb",
        };
        element.style.color = colors[letter];
      };

      const handleMouseLeave = (textRef, element) => {
        animateTextOut(textRef);
        element.style.color = "";
      };

      // Handle click for mobile (acts like hover for 1 second)
      const handleClick = (
        letter,
        explosionRef,
        imagePaths,
        textRef,
        element
      ) => {
        // Clear any existing timeout for this letter
        if (clickTimeouts[letter]) {
          clearTimeout(clickTimeouts[letter]);
          clickTimeouts[letter] = null;
        }

        // Trigger the hover effect
        explode(explosionRef, imagePaths, letter);
        animateTextIn(textRef, fullWords[letter]);

        // Change color
        const colors = {
          w: "#e46235",
          m: "#357eb1",
          d: "#fdc135",
          p: "#9c93cb",
        };
        element.style.color = colors[letter];

        // Auto-hide after 1 second
        clickTimeouts[letter] = setTimeout(() => {
          animateTextOut(textRef);
          element.style.color = "";
        }, 1000);
      };

      // Set up hover and click listeners
      const wLetter = containerRef.current?.querySelector('[data-letter="w"]');
      const dLetter = containerRef.current?.querySelector('[data-letter="d"]');
      const pLetter = containerRef.current?.querySelector('[data-letter="p"]');
      const mLetter = containerRef.current?.querySelector('[data-letter="m"]');

      const setupListeners = (
        letter,
        element,
        explosionRef,
        images,
        textRef
      ) => {
        if (!element) return;

        // For desktop: use hover
        if (!isTouchDevice()) {
          element.addEventListener("mouseenter", () =>
            handleMouseEnter(letter, explosionRef, images, textRef, element)
          );
          element.addEventListener("mouseleave", () =>
            handleMouseLeave(textRef, element)
          );
        }

        // For mobile/touch: use click
        element.addEventListener("click", (e) => {
          e.preventDefault();
          handleClick(letter, explosionRef, images, textRef, element);
        });
      };

      setupListeners("w", wLetter, wExplosionRef, explosionImages.w, wTextRef);
      setupListeners("m", mLetter, mExplosionRef, explosionImages.m, mTextRef);
      setupListeners("d", dLetter, dExplosionRef, explosionImages.d, dTextRef);
      setupListeners("p", pLetter, pExplosionRef, explosionImages.p, pTextRef);

      return () => {
        // Cleanup
        Object.values(activeAnimations).forEach((id) => {
          if (id) cancelAnimationFrame(id);
        });
        Object.values(clickTimeouts).forEach((id) => {
          if (id) clearTimeout(id);
        });
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full px-2 sm:px-4 z-10"
    >
      <div className="flex flex-wrap items-center justify-center relative z-10 text-center gap-10 xs:gap-20 sm:gap-20 md:gap-28 lg:gap-32 xl:gap-52">
        {/* W - Web Components */}
        <div className="relative inline-flex items-center justify-start min-w-fit">
          <div className="flex items-baseline gap-0">
            <h4
              data-letter="w"
              className="cursor-pointer transition-all duration-300 relative z-20 hover:scale-110 text-4xl! md:text-5xl! lg:text-6xl! xl:text-7xl! 2xl:text-8xl! font-light opacity-80"
              style={{
                color: "inherit",
              }}
              aria-label="W - Web"
              title="Web"
            >
              W
            </h4>
            <span
              ref={wTextRef}
              className="absolute bottom-1 md:bottom-0 z-20 font-light opacity-80 hidden"
              style={{
                color: "inherit",
                fontSize: "clamp(0.625rem, 2vw, 1.5rem)",
                left: "100%", // Position right after the letter
                marginLeft: "2px",
                whiteSpace: "nowrap", // Prevent wrapping
              }}
            >
              {fullWords.w.split("").map((letter, index) => (
                <span key={index} className="letter inline-block opacity-0">
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-visible"
            style={{
              width: "clamp(150px, 30vw, 400px)",
              height: "clamp(150px, 30vw, 400px)",
            }}
            ref={wExplosionRef}
            aria-hidden="true"
          ></div>
        </div>

        {/* M - Mobile Components */}
        <div className="relative inline-flex items-center justify-start min-w-fit">
          <div className="flex items-baseline gap-0">
            <h4
              data-letter="m"
              className="cursor-pointer transition-all duration-300 relative z-20 hover:scale-110 text-4xl! md:text-5xl! lg:text-6xl! xl:text-7xl! 2xl:text-8xl! font-light opacity-80"
              style={{
                color: "inherit",
              }}
              aria-label="M - Mobile"
              title="Mobile"
            >
              M
            </h4>
            <span
              ref={mTextRef}
              className="absolute bottom-1 md:bottom-0 z-20 font-light opacity-80 hidden"
              style={{
                color: "inherit",
                fontSize: "clamp(0.625rem, 2vw, 1.5rem)",
                left: "100%", // Position right after the letter
                marginLeft: "2px",
                whiteSpace: "nowrap", // Prevent wrapping
              }}
            >
              {fullWords.m.split("").map((letter, index) => (
                <span key={index} className="letter inline-block opacity-0">
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-visible"
            style={{
              width: "clamp(150px, 30vw, 400px)",
              height: "clamp(150px, 30vw, 400px)",
            }}
            ref={mExplosionRef}
            aria-hidden="true"
          ></div>
        </div>

        {/* D - Pen Tools */}
        <div className="relative inline-flex items-center justify-start min-w-fit">
          <div className="flex items-baseline gap-0">
            <h4
              data-letter="d"
              className="cursor-pointer transition-all duration-300 relative z-20 hover:scale-110 text-4xl! md:text-5xl! lg:text-6xl! xl:text-7xl! 2xl:text-8xl! font-light opacity-80"
              style={{
                color: "inherit",
              }}
              aria-label="D - Design"
              title="Design"
            >
              D
            </h4>
            <span
              ref={dTextRef}
              className="absolute bottom-1 md:bottom-0 z-20 font-light opacity-80 hidden"
              style={{
                color: "inherit",
                fontSize: "clamp(0.625rem, 2vw, 1.5rem)",
                left: "100%", // Position right after the letter
                marginLeft: "2px",
                whiteSpace: "nowrap", // Prevent wrapping
              }}
            >
              {fullWords.d.split("").map((letter, index) => (
                <span key={index} className="letter inline-block opacity-0">
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-visible"
            style={{
              width: "clamp(150px, 30vw, 400px)",
              height: "clamp(150px, 30vw, 400px)",
            }}
            ref={dExplosionRef}
            aria-hidden="true"
          ></div>
        </div>

        {/* P - Printers */}
        <div className="relative inline-flex items-center justify-start min-w-fit">
          <div className="flex items-baseline gap-0">
            <h4
              data-letter="p"
              className="cursor-pointer transition-all duration-300 relative z-20 hover:scale-110 text-4xl! md:text-5xl! lg:text-6xl! xl:text-7xl! 2xl:text-8xl! font-light opacity-80"
              style={{
                color: "inherit",
              }}
              aria-label="P - Print"
              title="Print"
            >
              P
            </h4>
            <span
              ref={pTextRef}
              className="absolute bottom-1 md:bottom-0 z-20 font-light opacity-80 hidden"
              style={{
                color: "inherit",
                fontSize: "clamp(0.625rem, 2vw, 1.5rem)",
                left: "100%", // Position right after the letter
                marginLeft: "2px",
                whiteSpace: "nowrap", // Prevent wrapping
              }}
            >
              {fullWords.p.split("").map((letter, index) => (
                <span key={index} className="letter inline-block opacity-0">
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-visible"
            style={{
              width: "clamp(150px, 30vw, 400px)",
              height: "clamp(150px, 30vw, 400px)",
            }}
            ref={pExplosionRef}
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  );
};
