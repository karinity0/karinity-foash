"use client";
import { useRef } from "react";
import gsap from "gsap";
import "./ExpanderLayout.css";
import { Web } from "./web";
import { useGSAP } from "@gsap/react";

// FIXME: Remove this when we go to production
const STUCK_CARD_INDEX = null;

const ExpanderLayout = () => {
  const gridRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const activeIndexRef = useRef(null);
  const animationsRef = useRef([]);
  const hoverTimeoutRef = useRef(null);
  const pendingHoverRef = useRef(null);
  const component1Ref = useRef(null);
  const component2Ref = useRef(null);
  const component3Ref = useRef(null);

  useGSAP(() => {
    const grid = gridRef.current;
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
    const components = [
      component1Ref.current,
      component2Ref.current,
      component3Ref.current,
    ];
    if (!grid || !cards.every((card) => card)) return;

    // Store original background colors before any animations
    const originalColors = cards.map((card) => {
      if (!card) return null;
      const computedStyle = window.getComputedStyle(card);
      return computedStyle.backgroundColor;
    });

    // Kill all existing animations
    const killAllAnimations = () => {
      animationsRef.current.forEach((anim) => {
        if (anim && anim.kill) anim.kill();
      });
      animationsRef.current = [];
    };

    const handleCardHover = (hoveredIndex) => {
      // Don't re-animate if already on this card
      if (activeIndexRef.current === hoveredIndex) return;

      killAllAnimations();
      activeIndexRef.current = hoveredIndex;

      cards.forEach((card, index) => {
        const title = card.querySelector("h4");
        const component = components[index];

        if (index === hoveredIndex) {
          // Expand the hovered card to ~98% width
          const cardAnim = gsap.to(card, {
            width: "98%",
            flexBasis: "98%",
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });

          // Hide title with smooth fade
          if (title) {
            const titleAnim = gsap.to(title, {
              opacity: 0,
              duration: 0.1,
              ease: "power2.out",
              delay: 0.2,
            });
            animationsRef.current.push(titleAnim);
          }

          // Change background color to black
          const colorAnim = gsap.to(card, {
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
          });
          animationsRef.current.push(colorAnim);

          // Show component
          if (component) {
            const componentAnim = gsap.to(component, {
              opacity: 1,
              visibility: "visible",
              duration: 1,
              ease: "power2.out",
              delay: 0.2,
            });
            animationsRef.current.push(componentAnim);
          }

          animationsRef.current.push(cardAnim);
        } else {
          // Collapse other cards to 50px width
          const cardAnim = gsap.to(card, {
            width: "50px",
            flexBasis: "50px",
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });

          // Hide the title of collapsed cards
          if (title) {
            const titleAnim = gsap.to(title, {
              opacity: 0,
              duration: 0.3,
              ease: "power2.out",
            });
            animationsRef.current.push(titleAnim);
          }

          // Hide component for non-hovered cards
          if (component) {
            const componentAnim = gsap.to(component, {
              opacity: 0,
              visibility: "hidden",
              duration: 0.3,
              ease: "power2.out",
            });
            animationsRef.current.push(componentAnim);
          }

          animationsRef.current.push(cardAnim);
        }
      });
    };

    const handleMouseLeave = () => {
      // If a card is stuck, don't reset FIXME: Remove this when we go to production
      if (STUCK_CARD_INDEX !== null && STUCK_CARD_INDEX !== undefined) {
        return;
      }

      // Don't reset if already reset
      if (activeIndexRef.current === null) return;

      killAllAnimations();
      activeIndexRef.current = null;

      // Reset all cards to equal width (33.33%)
      cards.forEach((card, index) => {
        const cardAnim = gsap.to(card, {
          width: "33.33%",
          flexBasis: "33.33%",
          duration: 0.8,
          ease: "power3.out",
          overwrite: true,
        });

        // Show the title again when resetting
        const title = card.querySelector("h4");
        if (title) {
          const titleAnim = gsap.to(title, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.2,
          });
          animationsRef.current.push(titleAnim);
        }

        // Restore original background color
        if (originalColors[index]) {
          const colorAnim = gsap.to(card, {
            backgroundColor: originalColors[index],
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
          });
          animationsRef.current.push(colorAnim);
        }

        // Hide component
        const component = components[index];
        if (component) {
          const componentAnim = gsap.to(component, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.4,
            ease: "power2.out",
            delay: 0.2,
          });
          animationsRef.current.push(componentAnim);
        }

        animationsRef.current.push(cardAnim);
      });
    };

    // Debounced hover handler to prevent accidental hovers
    const handleCardHoverDebounced = (hoveredIndex) => {
      // If a card is stuck, ignore hover events FIXME: Remove this when we go to production
      if (STUCK_CARD_INDEX !== null && STUCK_CARD_INDEX !== undefined) {
        return;
      }

      // Clear any pending hover
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Store the pending hover index
      pendingHoverRef.current = hoveredIndex;

      // Set a small delay before actually triggering the hover
      // This prevents accidental hovers when moving quickly between cards
      hoverTimeoutRef.current = setTimeout(() => {
        // Only trigger if this is still the pending hover (mouse hasn't moved away)
        if (pendingHoverRef.current === hoveredIndex) {
          handleCardHover(hoveredIndex);
        }
      }, 150); // 150ms delay - adjust as needed
    };

    // Handle mouse leave from individual cards to cancel pending hovers
    const handleCardMouseLeave = (cardIndex) => {
      // If a card is stuck, ignore mouse leave FIXME: Remove this when we go to production
      if (STUCK_CARD_INDEX !== null && STUCK_CARD_INDEX !== undefined) {
        return;
      }
      // If mouse leaves before the timeout, cancel the pending hover
      if (pendingHoverRef.current === cardIndex) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        pendingHoverRef.current = null;
      }
    };

    // If a card is stuck, apply the stuck state immediately
    // FIXME: Remove this when we go to production
    if (
      STUCK_CARD_INDEX !== null &&
      STUCK_CARD_INDEX !== undefined &&
      STUCK_CARD_INDEX >= 0 &&
      STUCK_CARD_INDEX < cards.length
    ) {
      handleCardHover(STUCK_CARD_INDEX);
    }

    // Create hover handlers for each card
    const hoverHandlers = cards.map((card, index) => {
      const enterHandler = () => handleCardHoverDebounced(index);
      const leaveHandler = () => handleCardMouseLeave(index);
      card.addEventListener("mouseenter", enterHandler);
      card.addEventListener("mouseleave", leaveHandler);
      return { card, enterHandler, leaveHandler };
    });

    // Add mouse leave listener to the grid container
    grid.addEventListener("mouseleave", handleMouseLeave);

    // Initialize components as hidden
    components.forEach((component) => {
      if (component) {
        gsap.set(component, { opacity: 0, visibility: "hidden" });
      }
    });

    return () => {
      // Clear any pending timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      killAllAnimations();
      // Clean up hover event listeners
      hoverHandlers.forEach(({ card, enterHandler, leaveHandler }) => {
        card.removeEventListener("mouseenter", enterHandler);
        card.removeEventListener("mouseleave", leaveHandler);
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
        <h4 className="text-center">WEB DEVELOPMENT</h4>
        <div ref={component1Ref}>
          <Web />
        </div>
      </div>
      <div
        className="expander-card bg-blue-200 flex items-center justify-center"
        ref={card2Ref}
      >
        <h4 className="text-center">DESIGN</h4>
        <div ref={component2Ref}>{/* Component to be added later */}</div>
      </div>
      <div
        className="expander-card bg-green-200 flex items-center justify-center"
        ref={card3Ref}
      >
        <h4 className="text-center">PRINTING</h4>
        <div ref={component3Ref}>{/* Component to be added later */}</div>
      </div>
    </div>
  );
};

export default ExpanderLayout;
