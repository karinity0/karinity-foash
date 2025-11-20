"use client";
import "./ShowDesign.css";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ShowDesign = () => {
  const showreelSecRef = useRef<HTMLElement>(null);
  const webTextRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const totalFrames = 7;
  const frameInterval = 1500;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1000px)", () => {
        const scrollTriggerInstances: ScrollTrigger[] = [];

        const frameTimeline = gsap.timeline({ repeat: -1 });

        for (let i = 1; i <= totalFrames; i++) {
          frameTimeline.add(() => {
            setCurrentFrame(i);
          }, (i - 1) * (frameInterval / 1000));
        }

        const scrollTrigger = ScrollTrigger.create({
          trigger: showreelSecRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}px`,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;

            const scaleValue = gsap.utils.mapRange(0, 1, 0.75, 1, progress);
            const borderRadiusValue =
              progress <= 0.5 ? gsap.utils.mapRange(0, 0.5, 2, 0, progress) : 0;

            gsap.set(".showreel-container", {
              scale: scaleValue,
              borderRadius: `${borderRadiusValue}rem`,
            });
          },
        });

        gsap.to(webTextRef.current, {
          innerHTML: "Want to see more?",
          fontSize: "4rem",
          backgroundColor: "#fdc135",
          color: "#000",
          padding: "1rem 3rem",
          width: "fit-content",
          margin: "0 auto",
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          cursor: "pointer",
          mixBlendMode: "normal",
          duration: 0.1,
          scrollTrigger: {
            trigger: showreelSecRef.current,
            start: "5% top",
            end: "5% top",
            scrub: true,
          },
        });

        if (scrollTrigger) {
          scrollTriggerInstances.push(scrollTrigger);
        }

        const refreshHandler = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("orientationchange", refreshHandler);
        window.addEventListener("resize", refreshHandler);

        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad, { passive: true });

        return () => {
          frameTimeline.kill();

          scrollTriggerInstances.forEach((trigger) => trigger.kill());

          window.removeEventListener("orientationchange", refreshHandler);
          window.removeEventListener("resize", refreshHandler);
          window.removeEventListener("load", onLoad);
        };
      });

      mm.add("(max-width: 999px)", () => {
        const scrollTriggerInstances: ScrollTrigger[] = [];

        const frameTimeline = gsap.timeline({ repeat: -1 });

        for (let i = 1; i <= totalFrames; i++) {
          frameTimeline.add(() => {
            setCurrentFrame(i);
          }, (i - 1) * (frameInterval / 1000));
        }

        const scrollTrigger = ScrollTrigger.create({
          trigger: showreelSecRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.5}px`,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;

            const scaleValue = gsap.utils.mapRange(0, 1, 0.75, 1, progress);
            const borderRadiusValue =
              progress <= 0.5 ? gsap.utils.mapRange(0, 0.5, 2, 0, progress) : 0;

            gsap.set(".showreel-container", {
              scale: scaleValue,
              borderRadius: `${borderRadiusValue}rem`,
            });
          },
        });

        gsap.to(webTextRef.current, {
          innerHTML: "Want to see more?",
          fontSize: "4rem",
          backgroundColor: "#fdc135",
          textAlign: "center",
          color: "#000",
          padding: "1rem 6rem",
          width: "fit-content",
          margin: "0 auto",
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          cursor: "pointer",
          mixBlendMode: "normal",
          duration: 0.1,
          scrollTrigger: {
            trigger: showreelSecRef.current,
            start: "5% top",
            end: "5% top",
            scrub: true,
          },
        });

        if (scrollTrigger) {
          scrollTriggerInstances.push(scrollTrigger);
        }

        const refreshHandler = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("orientationchange", refreshHandler);
        window.addEventListener("resize", refreshHandler);

        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad, { passive: true });

        return () => {
          frameTimeline.kill();

          scrollTriggerInstances.forEach((trigger) => trigger.kill());

          window.removeEventListener("orientationchange", refreshHandler);
          window.removeEventListener("resize", refreshHandler);
          window.removeEventListener("load", onLoad);
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: showreelSecRef }
  );

  return (
    <section className="showreel z-20!" ref={showreelSecRef}>
      <div className="showreel-container">
        <img
          src={`/showreel/showreel-frame-${currentFrame}.jpg`}
          alt="Showreel frame"
        />
        <div
          ref={webTextRef}
          className="web-text"
          onClick={() => {
            console.log("Button clicked");
            // Add navigation or other logic here
          }}
        >
          DESIGN
        </div>
      </div>
    </section>
  );
};

export default ShowDesign;
