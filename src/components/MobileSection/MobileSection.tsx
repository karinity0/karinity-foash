"use client";
import React, { useRef } from "react";
import "./MobileSection.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <span className={className}>
      {children.split(" ").map((word, i) => (
        <span
          key={i}
          className="word"
          style={{ display: "inline-block", marginRight: "0.25em", opacity: 0 }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

const MobileSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%", // Pin for 3 screen heights
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Initial state
        gsap.set(".app-screen-img", { y: "100%", opacity: 0 });
        gsap.set(".app-screen-img.home", { y: "0%", opacity: 1 });
        gsap.set(".text-block", { opacity: 0, y: 20, visibility: "hidden" });
        gsap.set(".text-block.native", {
          opacity: 1,
          y: 0,
          visibility: "visible",
        });
        gsap.set(ctaRef.current, { opacity: 0, y: 20 });

        // Reset words opacity just in case
        gsap.set(".text-block.native .word", { opacity: 0 });
        gsap.set(".text-block.scalable .word", { opacity: 0 });

        // --- Phase 1: Native Performance (Home Screen) ---
        // Animate words in for the first block
        tl.to(".text-block.native .word", {
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
        });

        // --- Phase 2: Transition to Scalable Architecture (Profile Screen) ---
        tl.to(".app-screen-img.home", {
          y: "-100%",
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        });
        tl.to(
          ".app-screen-img.profile",
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
          },
          "<"
        );

        // Text Transition 1 -> 3
        tl.to(
          ".text-block.native",
          {
            opacity: 0,
            y: -20,
            duration: 0.5,
          },
          "<"
        );

        tl.set(".text-block.scalable", {
          visibility: "visible",
          opacity: 1,
          y: 0,
        });
        tl.to(
          ".text-block.scalable .word",
          {
            opacity: 1,
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.out",
          },
          "<0.3"
        );

        // --- Phase 4: CTA Reveal ---
        tl.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      });

      // Mobile Animation (Simplified)
      mm.add("(max-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 1,
          },
        });

        // Initial state
        gsap.set(".app-screen-img", { opacity: 0, display: "none" });
        gsap.set(".app-screen-img.home", { opacity: 1, display: "block" });
        gsap.set(".text-block", { display: "none", opacity: 0 });
        gsap.set(".text-block.native", { display: "block", opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 0, y: 20 });

        // Ensure words are visible on mobile (no stagger for simplicity, or simple fade)
        gsap.set(".word", { opacity: 1 });

        // 1. Home -> Profile
        tl.to(".app-screen-img.home", { opacity: 0, duration: 0.5 });
        tl.set(".app-screen-img.home", { display: "none" });
        tl.set(".app-screen-img.profile", { display: "block" });
        tl.to(".app-screen-img.profile", { opacity: 1, duration: 0.5 });

        // Text 1 -> 3
        tl.to(".text-block.native", { opacity: 0, duration: 0.3 }, "<");
        tl.set(".text-block.native", { display: "none" });
        tl.set(".text-block.scalable", { display: "block" });
        tl.to(".text-block.scalable", { opacity: 1, duration: 0.3 });

        // CTA
        tl.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mobile-section">
      <div className="mobile-container">
        {/* Left Column: Phone */}
        <div className="mobile-col-left">
          <div ref={phoneRef} className="phone-frame">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="app-interface-images">
                <img
                  src="/mobile-assets/sayenly_profile.png"
                  alt="Sayenly Home"
                  className="app-screen-img home"
                />
                {/* <img
                  src="/mobile-assets/sayenly_booking.png"
                  alt="Sayenly Booking"
                  className="app-screen-img booking"
                /> */}
                <img
                  src="/mobile-assets/sayenly_menu.png"
                  alt="Sayenly Profile"
                  className="app-screen-img profile"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Text Content */}
        <div className="mobile-col-right">
          <div className="text-content-wrapper">
            <div className="text-block native active">
              <h2 className="feature-title">Native Performance</h2>
              <p className="feature-desc">
                <SplitText>
                  We engineer mobile experiences that feel instantaneous. By
                  leveraging native capabilities and optimizing every frame, we
                  ensure your app runs at a silky-smooth 60fps, providing users
                  with the responsiveness they expect from top-tier
                  applications.
                </SplitText>
              </p>
            </div>

            {/* <div className="text-block intuitive">
              <h2 className="feature-title">Intuitive Design</h2>
              <p className="feature-desc">
                <SplitText>
                  Great code needs great design. We craft user-centric
                  interfaces that feel natural from the very first touch. Our
                  designs guide users effortlessly through complex flows,
                  turning casual visitors into loyal customers through sheer
                  ease of use.
                </SplitText>
              </p>
            </div> */}

            <div className="text-block scalable">
              <h2 className="feature-title">Scalable Architecture</h2>
              <p className="feature-desc">
                <SplitText>
                  We don't just build for today; we build for your future. Our
                  robust, modular architecture ensures your app can grow with
                  your business, handling millions of users without compromising
                  stability or speed. This is engineering done right.
                </SplitText>
              </p>
            </div>
          </div>

          <a
            ref={ctaRef}
            href="https://masteruiux.webflow.io/works/sayenly"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-cta-btn"
          >
            See More Projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default MobileSection;
