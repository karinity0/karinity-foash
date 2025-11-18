import { useViewTransition } from "@/hooks/useViewTransition";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { useRef } from "react";
import Button from "../Button/Button";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = {};

const WebProject = (props: Props) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const wantMoreRef = useRef<HTMLDivElement>(null);
  const wantMoreTextRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = useViewTransition();

  useGSAP(
    () => {
      if (!wrapperRef.current) return;

      const cards = [
        { id: "#card-1", endTranslateX: -2000, rotate: 45 },
        { id: "#card-2", endTranslateX: -1000, rotate: -30 },
        { id: "#card-3", endTranslateX: -2000, rotate: 45 },
        { id: "#card-4", endTranslateX: -1500, rotate: -30 },
      ];

      // Main horizontal scroll trigger
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=900vh",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          gsap.to(wrapperRef.current, {
            x: `${-325 * self.progress}vw`,
            duration: 0.5,
            ease: "power3.out",
          });
        },
      });

      // Card animations - trigger on the wrapper, not individual cards
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=1200vh",
          scrub: 1,
          onUpdate: (self) => {
            gsap.to(card.id, {
              x: `${card.endTranslateX * self.progress}px`,
              rotate: `${card.rotate * self.progress * 2}`,
              duration: 0.5,
              ease: "power3.out",
            });
          },
        });
      });

      // Animate "Want more Projects?" text
      if (wantMoreTextRef.current) {
        const split = SplitText.create(wantMoreTextRef.current, {
          type: "chars",
          charsClass: "char++",
        });

        gsap.set(split.chars, {
          opacity: 0,
          y: 50,
          rotationX: -90,
        });

        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=200vh",
          scrub: 1,
          onUpdate: (self) => {
            const progress = Math.min(self.progress * 2, 1);
            gsap.to(split.chars, {
              opacity: progress,
              y: 50 * (1 - progress),
              rotationX: -90 * (1 - progress),
              duration: 0.5,
              stagger: 0.02,
              ease: "power3.out",
            });
          },
        });
      }

      // Change background to black when reaching wantMoreRef
      // Trigger based on wrapper scroll progress - "Want more Projects?" appears later in the scroll
      if (containerRef.current && wrapperRef.current) {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=900vh",
          scrub: 1,
          onUpdate: (self) => {
            if (!containerRef.current) return;

            // Start transitioning to black when progress reaches 0.6
            // Adjust this value to match when "Want more Projects?" becomes visible
            const threshold = 0.6;
            const bgProgress = Math.max(
              0,
              Math.min(1, (self.progress - threshold) / (1 - threshold))
            );

            // Smoothly interpolate from #e46235 to #e3e3db
            const r = Math.round(228 + (227 - 228) * bgProgress);
            const g = Math.round(98 + (227 - 98) * bgProgress);
            const b = Math.round(53 + (219 - 53) * bgProgress);

            containerRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          },
        });
      }
    },
    { scope: wrapperRef }
  );

  return (
    <div
      className="w-full h-[170vh] relative bg-[#e46235] z-10!"
      ref={containerRef}
    >
      <section
        className="absolute top-0 w-[400vw] h-screen will-change-transform select-none"
        ref={wrapperRef}
      >
        <div className="flex items-center justify-center relative gap-5">
          <h1 className="w-full! text-[48vw]! text-center! m-0! text-[#e3e3db]">
            Web Projects{" "}
          </h1>
          <div
            ref={wantMoreRef}
            className="flex flex-col items-end gap-6 z-10 w-[20%]"
          >
            <h2
              ref={wantMoreTextRef}
              className="text-[8vw]! text-[#e46235] uppercase leading-[0.9]! tracking-[-0.125rem]! cursor-pointer group m-0"
              style={{ fontFamily: '"Big Shoulders Display", sans-serif' }}
              onClick={(e) => {
                e.preventDefault();
                navigateWithTransition("/work");
              }}
              onMouseEnter={() => {
                if (wantMoreTextRef.current) {
                  gsap.to(wantMoreTextRef.current, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              }}
              onMouseLeave={() => {
                if (wantMoreTextRef.current) {
                  gsap.to(wantMoreTextRef.current, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              }}
            >
              More Projects?
            </h2>
            <div className="flex items-center gap-3 group-hover:gap-5 transition-all duration-300">
              <div className="w-[60px] h-[2px] bg-[#e46235] group-hover:w-[80px] transition-all duration-300"></div>
              <div className="w-3 h-3 border-2 border-[#e46235] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-1.5 h-1.5 bg-[#e46235] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute w-[300px] h-[300px] bg-gray-500 rounded-[20px] overflow-hidden top-1/2 left-[20%]"
          id="card-1"
        >
          <Link
            href="/sample-project"
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition("/sample-project");
            }}
          >
            <img src="/project/sample-project-1.jpg" alt="" />
          </Link>
        </div>
        <div
          className="absolute w-[300px] h-[300px] bg-gray-500 rounded-[20px] overflow-hidden top-[25%] left-[40%]"
          id="card-2"
        >
          <Link
            href="/sample-project"
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition("/sample-project");
            }}
          >
            <img src="/project/sample-project-2.jpg" alt="" />
          </Link>
        </div>
        <div
          className="absolute w-[300px] h-[300px] bg-gray-500 rounded-[20px] overflow-hidden top-[45%] left-[60%]"
          id="card-3"
        >
          <Link
            href="/sample-project"
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition("/sample-project");
            }}
          >
            <img src="/project/sample-project-3.jpg" alt="" />
          </Link>
        </div>
        <div
          className="absolute w-[300px] h-[300px] bg-gray-500 rounded-[20px] overflow-hidden top-[15%] left-[80%]"
          id="card-4"
        >
          <Link
            href="/sample-project"
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition("/sample-project");
            }}
          >
            <img src="/project/sample-project-4.jpg" alt="" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WebProject;
