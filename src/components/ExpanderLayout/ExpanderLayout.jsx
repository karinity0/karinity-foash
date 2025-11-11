"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./ExpanderLayout.css";

const ExpanderLayout = () => {
  const gridRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
    if (!grid || !cards.every((card) => card)) return;

    const handleCardHover = (hoveredIndex) => {
      cards.forEach((card, index) => {
        const title = card.querySelector("h2");
        if (index === hoveredIndex) {
          // Expand the hovered card to ~98% width
          gsap.to(card, {
            width: "98%",
            duration: 0.6,
            ease: "power2.out",
          });
        } else {
          // Collapse other cards to 1px width
          gsap.to(card, {
            width: "10px",
            duration: 0.6,
            ease: "power2.out",
          });
          // Hide the title of collapsed cards
          if (title) {
            gsap.to(title, {
              opacity: 0,
              duration: 0.2,
              ease: "power2.out",
            });
          }
        }
      });
    };

    const handleMouseLeave = () => {
      // Reset all cards to equal width (33.33%)
      cards.forEach((card) => {
        gsap.to(card, {
          width: "33.33%",
          duration: 0.6,
          ease: "power2.out",
        });
        // Show the title again when resetting
        const title = card.querySelector("h2");
        if (title) {
          gsap.to(title, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        }
      });
    };

    // Create hover handlers for each card
    const hoverHandlers = cards.map((card, index) => {
      const handler = () => handleCardHover(index);
      card.addEventListener("mouseenter", handler);
      return { card, handler };
    });

    // Add mouse leave listener to the grid container
    grid.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Clean up hover event listeners
      hoverHandlers.forEach(({ card, handler }) => {
        card.removeEventListener("mouseenter", handler);
      });
      grid.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="expander-grid" ref={gridRef}>
      <div
        className="expander-card bg-red-200 flex items-center justify-center"
        ref={card1Ref}
      >
        <h2 className="text-center">WEB DEVELOPMENT</h2>
      </div>
      <div
        className="expander-card bg-blue-200 flex items-center justify-center"
        ref={card2Ref}
      >
        <h2 className="text-center">DESIGN</h2>
      </div>
      <div
        className="expander-card bg-green-200 flex items-center justify-center"
        ref={card3Ref}
      >
        <h2 className="text-center">PRINTING</h2>
      </div>
    </div>
  );
};

export default ExpanderLayout;
