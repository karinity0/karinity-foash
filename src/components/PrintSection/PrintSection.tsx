"use client";
import React, { useRef } from "react";
import "./PrintSection.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PrintSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const structureRef = useRef<HTMLDivElement>(null); // The whole billboard structure
  const billboardRef = useRef<HTMLDivElement>(null); // The board itself
  const sheenRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Entrance Animation (ScrollTrigger)
      // The pole rises up from the bottom
      gsap.fromTo(
        structureRef.current,
        {
          y: 200,
          opacity: 0,
          rotateX: 10,
        },
        {
          y: 30,
          opacity: 1,
          rotateX: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );

      // 2. Mouse Interaction (3D Tilt)
      const section = sectionRef.current;
      if (!section || !billboardRef.current) return;

      // We tilt the wrapper or the structure?
      // Let's tilt the wrapper (board) slightly more than the pole for a flex effect,
      // or tilt the whole structure. Tilting the wrapper looks like the board is loose/dynamic.
      const xTo = gsap.quickTo(billboardRef.current, "rotationY", {
        duration: 0.5,
        ease: "power3",
      });
      const yTo = gsap.quickTo(billboardRef.current, "rotationX", {
        duration: 0.5,
        ease: "power3",
      });

      const sheenXTo = gsap.quickTo(sheenRef.current, "x", {
        duration: 0.5,
        ease: "power3",
      });

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const { clientX, clientY } = e;

        const xPos = (clientX / innerWidth - 0.5) * 2; // -1 to 1
        const yPos = (clientY / innerHeight - 0.5) * 2; // -1 to 1

        // Tilt range
        const tiltX = yPos * -10;
        const tiltY = xPos * 10;

        xTo(tiltY);
        yTo(tiltX);

        // Sheen moves across
        sheenXTo(xPos * 100);

        // Parallax text
        gsap.to(".billboard-main-text", {
          x: xPos * 15,
          y: yPos * 15,
          duration: 0.5,
          ease: "power1.out",
        });

        // Parallax clouds (subtle)
        gsap.to(".cloud", {
          x: xPos * -30,
          duration: 1,
          ease: "power1.out",
        });
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="print-section">
      {/* Sky Environment */}
      <div className="sky-clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>

      <div className="print-container">
        <div ref={structureRef} className="billboard-structure">
          <div ref={billboardRef} className="billboard-wrapper">
            {/* Lamps */}
            <div className="billboard-lamps">
              <div className="lamp"></div>
              <div className="lamp"></div>
              <div className="lamp"></div>
            </div>

            <div className="billboard-content">
              <div className="billboard-bg-text">AD HERE </div>
              <div className="billboard-sheen" ref={sheenRef}></div>

              {/* Floating 3D Elements */}
              <div className="float-element float-1"></div>
              <div className="float-element float-2"></div>

              <div className="billboard-main-text">
                <h2 className="print-title">
                  Tangible
                  <br />
                  Impact
                </h2>
                <p className="print-subtitle">
                  Design that you can feel. Branding that leaves a mark. We
                  bring digital precision to the physical world.
                </p>
                <a href="#" className="print-cta">
                  View Print Work
                </a>
              </div>
            </div>
          </div>

          {/* Pole Support */}
          <div className="billboard-pole"></div>
          <div className="billboard-base"></div>
        </div>
      </div>
    </section>
  );
};

export default PrintSection;
