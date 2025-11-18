"use client";
import "./ClientReviews.css";
import { clientReviewsData } from "./clientReviewsData";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ClientReviews = () => {
  const clientReviewsContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1000px)", () => {
        const reviewCards = document.querySelectorAll(
          ".review-card"
        ) as NodeListOf<HTMLElement>;
        const cardContainers = document.querySelectorAll(
          ".review-card-container"
        ) as NodeListOf<HTMLElement>;

        cardContainers.forEach((cardContainer, index) => {
          const rotation = index % 2 === 0 ? 3 : -3;
          gsap.set(cardContainer, { rotation: rotation });

          const computedStyle = window.getComputedStyle(cardContainer);
        });

        const scrollTriggerInstances: ScrollTrigger[] = [];

        gsap.delayedCall(0.1, () => {
          reviewCards.forEach((card, index) => {
            if (index < reviewCards.length - 1) {
              const trigger = ScrollTrigger.create({
                trigger: card,
                start: "top top",
                endTrigger: reviewCards[reviewCards.length - 1],
                end: "top top",
                pin: true,
                pinSpacing: false,
                scrub: 1,
              });
              scrollTriggerInstances.push(trigger);
            }

            if (index < reviewCards.length - 1) {
              const trigger = ScrollTrigger.create({
                trigger: reviewCards[index + 1],
                start: "top bottom",
                end: "top top",
              });
              scrollTriggerInstances.push(trigger);
            }
          });
        });

        const refreshHandler = () => {
          ScrollTrigger.refresh();
        };
        window.addEventListener("orientationchange", refreshHandler);
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad, { passive: true });

        return () => {
          scrollTriggerInstances.forEach((trigger) => trigger.kill());
          window.removeEventListener("orientationchange", refreshHandler);
          window.removeEventListener("load", onLoad);
        };
      });

      mm.add("(max-width: 999px)", () => {
        const reviewCards = document.querySelectorAll(
          ".review-card"
        ) as NodeListOf<HTMLElement>;
        const cardContainers = document.querySelectorAll(
          ".review-card-container"
        ) as NodeListOf<HTMLElement>;

        reviewCards.forEach((card) => {
          if (card) gsap.set(card, { clearProps: "all" });
        });
        cardContainers.forEach((cardContainer) => {
          if (cardContainer) gsap.set(cardContainer, { clearProps: "all" });
        });

        ScrollTrigger.refresh();

        const refreshHandler = () => {
          ScrollTrigger.refresh();
        };
        window.addEventListener("orientationchange", refreshHandler);
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad, { passive: true });

        return () => {
          window.removeEventListener("orientationchange", refreshHandler);
          window.removeEventListener("load", onLoad);
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: clientReviewsContainerRef }
  );

  const reviewsToShow = isMobile
    ? clientReviewsData.slice(0, 2)
    : clientReviewsData;

  return (
    <div className="client-reviews" ref={clientReviewsContainerRef}>
      {reviewsToShow.map((item, index) => (
        <div className="review-card" key={index}>
          <div
            className="review-card-container"
            id={`review-card-${index + 1}`}
          >
            <div className="review-card-content">
              <div className="review-card-content-wrapper">
                <h3 className="review-card-text lg">{item.review}</h3>
                <div className="review-card-client-info">
                  <p className="review-card-client cap">{item.clientName}</p>
                  <p className="review-card-client-company sm">
                    {item.clientCompany}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientReviews;
