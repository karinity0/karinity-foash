import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function DesignProjects() {
  const stickyHeaderRef = useRef<HTMLHeadingElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const isGapAnimationCompletedRef = useRef<boolean>(false);
  const isFlipAnimationCompletedRef = useRef<boolean>(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 999px)", () => {
      if (!cardContainerRef.current || !stickyHeaderRef.current) return;

      ScrollTrigger.create({
        trigger: ".sticky-section",
        start: "top top",
        end: `+=${window.innerHeight * 1}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Header animation (10% - 25%)
          if (progress >= 0.1 && progress <= 0.25) {
            const headerProgress = gsap.utils.mapRange(
              0.1,
              0.25,
              0,
              1,
              progress
            );
            const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
            const opacityValue = gsap.utils.mapRange(
              0,
              1,
              0,
              1,
              headerProgress
            );

            if (stickyHeaderRef.current) {
              gsap.set(stickyHeaderRef.current, {
                y: yValue,
                opacity: opacityValue,
              });
            }
          } else if (progress < 0.1) {
            if (stickyHeaderRef.current) {
              gsap.set(stickyHeaderRef.current, {
                y: 40,
                opacity: 0,
              });
            }
          } else if (progress > 0.25) {
            if (stickyHeaderRef.current) {
              gsap.set(stickyHeaderRef.current, {
                y: 0,
                opacity: 1,
              });
            }
          }

          // Height animation (0% - 25%) for mobile
          if (progress <= 0.25) {
            const heightPercentage = gsap.utils.mapRange(
              0,
              0.25,
              85,
              70,
              progress
            );
            if (cardContainerRef.current) {
              gsap.set(cardContainerRef.current, {
                height: `${heightPercentage}%`,
              });
            }
          } else {
            if (cardContainerRef.current) {
              gsap.set(cardContainerRef.current, { height: "70%" });
            }
          }

          // Gap and border radius animation (35%) - vertical layout
          if (progress >= 0.35 && !isGapAnimationCompletedRef.current) {
            if (cardContainerRef.current) {
              gsap.to(cardContainerRef.current, {
                gap: "20px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            const cards = [
              card1Ref.current,
              card2Ref.current,
              card3Ref.current,
            ];
            gsap.to(cards, {
              borderRadius: "20px",
              duration: 0.5,
              ease: "power3.out",
            });

            isGapAnimationCompletedRef.current = true;
          } else if (progress < 0.35 && isGapAnimationCompletedRef.current) {
            if (cardContainerRef.current) {
              gsap.to(cardContainerRef.current, {
                gap: "0px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            if (card1Ref.current) {
              gsap.to(card1Ref.current, {
                borderRadius: "20px 20px 0 0",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            if (card2Ref.current) {
              gsap.to(card2Ref.current, {
                borderRadius: "0px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            if (card3Ref.current) {
              gsap.to(card3Ref.current, {
                borderRadius: "0 0 20px 20px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            isGapAnimationCompletedRef.current = false;
          }

          // Flip animation (70%)
          if (progress >= 0.7 && !isFlipAnimationCompletedRef.current) {
            const cards = [
              card1Ref.current,
              card2Ref.current,
              card3Ref.current,
            ];
            gsap.to(cards, {
              rotationY: 180,
              duration: 0.75,
              ease: "power3.inOut",
              stagger: 0.1,
            });

            const sideCards = [card1Ref.current, card3Ref.current];
            gsap.to(sideCards, {
              x: (i: number) => [-15, 15][i],
              rotationZ: (i: number) => [-5, 5][i],
              duration: 0.75,
              ease: "power3.inOut",
            });

            isFlipAnimationCompletedRef.current = true;
          } else if (progress < 0.7 && isFlipAnimationCompletedRef.current) {
            const cards = [
              card1Ref.current,
              card2Ref.current,
              card3Ref.current,
            ];
            gsap.to(cards, {
              rotationY: 0,
              duration: 0.75,
              ease: "power3.inOut",
              stagger: -0.1,
            });

            const sideCards = [card1Ref.current, card3Ref.current];
            gsap.to(sideCards, {
              x: 0,
              rotationZ: 0,
              duration: 0.75,
              ease: "power3.inOut",
            });

            isFlipAnimationCompletedRef.current = false;
          }
        },
      });

      return () => {};
    });

    mm.add("(min-width: 1000px)", () => {
      if (!cardContainerRef.current || !stickyHeaderRef.current) return;

      ScrollTrigger.create({
        trigger: ".sticky-section",
        start: "top top",
        end: `+=${window.innerHeight * 2}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Header animation (10% - 25%)
          if (progress >= 0.1 && progress <= 0.25) {
            const headerProgress = gsap.utils.mapRange(
              0.1,
              0.25,
              0,
              1,
              progress
            );
            const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
            const opacityValue = gsap.utils.mapRange(
              0,
              1,
              0,
              1,
              headerProgress
            );

            if (stickyHeaderRef.current) {
              gsap.set(stickyHeaderRef.current, {
                y: yValue,
                opacity: opacityValue,
              });
            }
          } else if (progress < 0.1) {
            if (stickyHeaderRef.current) {
              gsap.set(stickyHeaderRef.current, {
                y: 40,
                opacity: 0,
              });
            }
          } else if (progress > 0.25) {
            if (stickyHeaderRef.current) {
              gsap.set(stickyHeaderRef.current, {
                y: 0,
                opacity: 1,
              });
            }
          }

          // Width animation (0% - 25%)
          if (progress <= 0.25) {
            const widthPercentage = gsap.utils.mapRange(
              0,
              0.25,
              75,
              60,
              progress
            );
            if (cardContainerRef.current) {
              gsap.set(cardContainerRef.current, {
                width: `${widthPercentage}%`,
              });
            }
          } else {
            if (cardContainerRef.current) {
              gsap.set(cardContainerRef.current, { width: "60%" });
            }
          }

          // Gap and border radius animation (35%)
          if (progress >= 0.35 && !isGapAnimationCompletedRef.current) {
            if (cardContainerRef.current) {
              gsap.to(cardContainerRef.current, {
                gap: "20px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            const cards = [
              card1Ref.current,
              card2Ref.current,
              card3Ref.current,
            ];
            gsap.to(cards, {
              borderRadius: "20px",
              duration: 0.5,
              ease: "power3.out",
            });

            isGapAnimationCompletedRef.current = true;
          } else if (progress < 0.35 && isGapAnimationCompletedRef.current) {
            if (cardContainerRef.current) {
              gsap.to(cardContainerRef.current, {
                gap: "0px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            if (card1Ref.current) {
              gsap.to(card1Ref.current, {
                borderRadius: "20px 0 0 20px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            if (card2Ref.current) {
              gsap.to(card2Ref.current, {
                borderRadius: "0px",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            if (card3Ref.current) {
              gsap.to(card3Ref.current, {
                borderRadius: "0 20px 20px 0",
                duration: 0.5,
                ease: "power3.out",
              });
            }

            isGapAnimationCompletedRef.current = false;
          }

          // Flip animation (70%)
          if (progress >= 0.7 && !isFlipAnimationCompletedRef.current) {
            const cards = [
              card1Ref.current,
              card2Ref.current,
              card3Ref.current,
            ];
            gsap.to(cards, {
              rotationY: 180,
              duration: 0.75,
              ease: "power3.inOut",
              stagger: 0.1,
            });

            const sideCards = [card1Ref.current, card3Ref.current];
            gsap.to(sideCards, {
              y: 30,
              rotationZ: (i: number) => [-15, 15][i],
              duration: 0.75,
              ease: "power3.inOut",
            });

            isFlipAnimationCompletedRef.current = true;
          } else if (progress < 0.7 && isFlipAnimationCompletedRef.current) {
            const cards = [
              card1Ref.current,
              card2Ref.current,
              card3Ref.current,
            ];
            gsap.to(cards, {
              rotationY: 0,
              duration: 0.75,
              ease: "power3.inOut",
              stagger: -0.1,
            });

            const sideCards = [card1Ref.current, card3Ref.current];
            gsap.to(sideCards, {
              y: 0,
              rotationZ: 0,
              duration: 0.75,
              ease: "power3.inOut",
            });

            isFlipAnimationCompletedRef.current = false;
          }
        },
      });

      return () => {};
    });
  }, []);

  return (
    <section className="sticky-section bg-black/90 relative w-full h-svh p-4 md:p-8 flex justify-center items-center">
      <div className="absolute top-[15%] md:top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 w-full">
        <h3
          ref={stickyHeaderRef}
          className="text-center will-change-[transform,opacity] translate-y-10 opacity-0 text-[#fdc135] text-3xl! lg:text-6xl!"
        >
          Where bold ideas become stunning reality
        </h3>
      </div>

      <div
        ref={cardContainerRef}
        className="relative w-[90%] md:w-[75%] h-[85%] md:h-auto flex flex-col md:flex-row perspective-[1000px] translate-y-10 will-change-[width,height]"
        style={{ perspective: "1000px" }}
      >
        {/* Card 1 */}
        <div
          ref={card1Ref}
          className="card relative flex-1 aspect-video md:aspect-5/7 rounded-t-[20px] md:rounded-l-[20px] md:rounded-t-none"
          style={{ transformStyle: "preserve-3d", transformOrigin: "top" }}
        >
          <div
            className="card-front absolute w-full h-full rounded-[inherit] overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={isMobile ? "/design-cards/00.jpg" : "/design-cards/1.png"}
              alt="Interactive Web Experiences"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div
            className="card-back absolute w-full h-full rounded-[inherit] overflow-hidden flex justify-center items-center text-center p-4 sm:p-6 md:p-8 bg-[#8c7e77] text-black"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 opacity-40 text-xs sm:text-sm">
              ( 01 )
            </span>
            <p className="text-3xl!">We imagine boldly.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          ref={card2Ref}
          className="card relative flex-1 aspect-video md:aspect-5/7"
          style={{ transformStyle: "preserve-3d", transformOrigin: "top" }}
        >
          <div
            className="card-front absolute w-full h-full rounded-[inherit] overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={isMobile ? "/design-cards/01.jpg" : "/design-cards/2.png"}
              alt="Thoughtful Design Language"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div
            className="card-back absolute w-full h-full rounded-[inherit] overflow-hidden flex justify-center items-center text-center p-4 sm:p-6 md:p-8 bg-[#ff6e14] text-black"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 opacity-40 text-xs sm:text-sm">
              ( 02 )
            </span>
            <p className="text-3xl!">We design with intent.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          ref={card3Ref}
          className="card relative flex-1 aspect-video md:aspect-5/7 rounded-b-[20px] md:rounded-r-[20px] md:rounded-b-none"
          style={{ transformStyle: "preserve-3d", transformOrigin: "top" }}
        >
          <div
            className="card-front absolute w-full h-full rounded-[inherit] overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={isMobile ? "/design-cards/02.jpg" : "/design-cards/3.png"}
              alt="Visual Design Systems"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div
            className="card-back absolute w-full h-full rounded-[inherit] overflow-hidden flex justify-center items-center text-center p-4 sm:p-6 md:p-8 bg-[#2f2f2f] text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 opacity-40 text-xs sm:text-sm">
              ( 03 )
            </span>
            <p className="text-3xl!">We deliver brilliance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
