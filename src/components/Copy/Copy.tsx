"use client";
import "./Copy.css";
import React, { useRef, ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CopyProps {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
}: CopyProps) {
  const containerRef = useRef<HTMLElement | HTMLDivElement>(null);
  const elementRefs = useRef<Element[]>([]);
  const splitRefs = useRef<SplitText[]>([]);
  const lines = useRef<HTMLElement[]>([]);

  const waitForFonts = async (): Promise<boolean> => {
    try {
      await document.fonts.ready;

      const customFonts = [
        "Geist Mono",
        "PP Neue Montreal",
        "PP Pangram Sans",
        "Big Shoulders Display",
      ];
      const fontCheckPromises = customFonts.map((fontFamily) => {
        return document.fonts.check(`16px ${fontFamily}`);
      });

      await Promise.all(fontCheckPromises);
      await new Promise((resolve) => setTimeout(resolve, 100));

      return true;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return true;
    }
  };

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const initializeSplitText = async () => {
        await waitForFonts();

        splitRefs.current = [];
        lines.current = [];
        elementRefs.current = [];

        let elements: Element[] = [];
        if (container.hasAttribute("data-copy-wrapper")) {
          elements = Array.from(container.children);
        } else {
          elements = [container];
        }

        elements.forEach((element) => {
          elementRefs.current.push(element);

          const split = SplitText.create(element as HTMLElement, {
            type: "lines",
            mask: "lines",
            linesClass: "line++",
            lineThreshold: 0.1,
          });

          splitRefs.current.push(split);

          const computedStyle = window.getComputedStyle(element);
          const textIndent = computedStyle.textIndent;

          if (textIndent && textIndent !== "0px") {
            if (split.lines.length > 0) {
              (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
            }
            (element as HTMLElement).style.textIndent = "0";
          }

          lines.current.push(...(split.lines as HTMLElement[]));
        });

        gsap.set(lines.current, { y: "100%" });

        const animationProps = {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out" as const,
          delay: delay,
        };

        if (animateOnScroll) {
          gsap.to(lines.current, {
            ...animationProps,
            scrollTrigger: {
              trigger: container,
              start: "top 90%",
              once: true,
            },
          });
        } else {
          gsap.to(lines.current, animationProps);
        }
      };

      initializeSplitText();

      return () => {
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] }
  );

  if (React.Children.count(children) === 1) {
    const child = children as React.ReactElement;
    return React.cloneElement(child, {
      ref: (node: HTMLElement | null) => {
        // Set our own ref
        if (containerRef && "current" in containerRef) {
          (containerRef as React.MutableRefObject<HTMLElement | null>).current =
            node;
        }
      },
    } as React.Attributes);
  }

  return (
    <div
      ref={containerRef as React.Ref<HTMLDivElement>}
      data-copy-wrapper="true"
    >
      {children}
    </div>
  );
}
