"use client";
import "./Menu.css";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { useViewTransition } from "@/hooks/useViewTransition";
import { LogoFoash } from "./logoFoash";
import { LogoKarinity } from "./logoKarinity";

gsap.registerPlugin(useGSAP, SplitText);

const Menu = ({ pageRef }) => {
  const navToggleRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuImageRef = useRef(null);
  const menuLinksWrapperRef = useRef(null);
  const linkHighlighterRef = useRef(null);
  const menuLinksRef = useRef([]);
  const menuLinkContainersRef = useRef([]);
  const openLabelRef = useRef(null);
  const closeLabelRef = useRef(null);
  const menuColsRef = useRef([]);

  const splitTextInstances = useRef([]);
  const menuColSplitTextInstances = useRef([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  const lenis = useLenis();

  const { navigateWithTransition } = useViewTransition();

  const menuItems = [
    { label: "Home", route: "/" },
    { label: "Work", route: "/work" },
    { label: "Studio", route: "/studio" },
    { label: "Stories", route: "/stories" },
    { label: "Contact", route: "/contact" },
  ];

  const currentX = useRef(0);
  const targetX = useRef(0);
  const lerpFactor = 0.05;

  const currentHighlighterX = useRef(0);
  const targetHighlighterX = useRef(0);
  const currentHighlighterWidth = useRef(0);
  const targetHighlighterWidth = useRef(0);

  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isMenuOpen) return;

    const menuCols = menuColsRef.current;
    if (!menuCols || menuCols.length === 0) return;

    menuColSplitTextInstances.current.forEach((split) => split.revert());
    menuColSplitTextInstances.current = [];

    menuCols.forEach((col) => {
      if (!col) return;

      const elements = col.querySelectorAll("p, a");

      elements.forEach((el) => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });

        menuColSplitTextInstances.current.push(split);

        gsap.set(split.lines, { y: "100%" });
      });
    });
  }, [isMenuOpen]);

  useGSAP(
    () => {
      const menuLinks = menuLinksRef.current;
      const menuOverlay = menuOverlayRef.current;
      const menuLinksWrapper = menuLinksWrapperRef.current;
      const linkHighlighter = linkHighlighterRef.current;
      const menuImage = menuImageRef.current;
      const container = pageRef.current;
      const menuLinkContainers = menuLinkContainersRef.current;

      splitTextInstances.current.forEach((split) => split.revert());
      splitTextInstances.current = [];

      menuLinks.forEach((link) => {
        if (!link) return;

        const chars = link.querySelectorAll("span");
        chars.forEach((char, charIndex) => {
          const split = new SplitText(char, { type: "chars" });
          splitTextInstances.current.push(split);
          split.chars.forEach((char) => {
            char.classList.add("char");
          });
          if (charIndex === 1) {
            gsap.set(split.chars, { y: "110%" });
          }
        });
      });

      gsap.set(menuImage, { y: 0, scale: 0.5, opacity: 0.25 });
      gsap.set(menuLinks, { y: "150%" });
      gsap.set(linkHighlighter, { y: "150%" });

      const defaultLinkText = menuLinksWrapper.querySelector(
        ".menu-link:first-child a span"
      );
      if (defaultLinkText) {
        const linkWidth = defaultLinkText.offsetWidth;
        linkHighlighter.style.width = linkWidth + "px";
        currentHighlighterWidth.current = linkWidth;
        targetHighlighterWidth.current = linkWidth;

        const defaultLinkTextElement = menuLinksWrapper.querySelector(
          ".menu-link:first-child"
        );
        const linkRect = defaultLinkTextElement.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
        const initialX = linkRect.left - menuWrapperRect.left;
        currentHighlighterX.current = initialX;
        targetHighlighterX.current = initialX;
      }

      const handleMouseMove = (e) => {
        if (window.innerWidth < 1000) return;

        const mouseX = e.clientX;
        const viewportWidth = window.innerWidth;
        const menuLinksWrapperWidth = menuLinksWrapper.offsetWidth;

        const maxMoveLeft = 0;
        const maxMoveRight = viewportWidth - menuLinksWrapperWidth;

        const sensitivityRange = viewportWidth * 0.5;
        const startX = (viewportWidth - sensitivityRange) / 2;
        const endX = startX + sensitivityRange;

        let mousePercentage;
        if (mouseX <= startX) {
          mousePercentage = 0;
        } else if (mouseX >= endX) {
          mousePercentage = 1;
        } else {
          mousePercentage = (mouseX - startX) / sensitivityRange;
        }

        targetX.current =
          maxMoveLeft + mousePercentage * (maxMoveRight - maxMoveLeft);
      };

      menuLinkContainers.forEach((link) => {
        if (!link) return;

        const handleMouseEnter = () => {
          if (window.innerWidth < 1000) return;

          const linkCopy = link.querySelectorAll("a span");
          if (!linkCopy || linkCopy.length < 2) return;

          const visibleCopy = linkCopy[0];
          const animatedCopy = linkCopy[1];

          const visibleChars = visibleCopy.querySelectorAll(".char");
          gsap.to(visibleChars, {
            y: "-110%",
            stagger: 0.05,
            duration: 0.5,
            ease: "expo.inOut",
          });

          const animatedChars = animatedCopy.querySelectorAll(".char");
          gsap.to(animatedChars, {
            y: "0%",
            stagger: 0.05,
            duration: 0.5,
            ease: "expo.inOut",
          });

          const linkRect = link.getBoundingClientRect();
          const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

          targetHighlighterX.current = linkRect.left - menuWrapperRect.left;

          const linkCopyElement = link.querySelector("a span");
          targetHighlighterWidth.current = linkCopyElement
            ? linkCopyElement.offsetWidth
            : link.offsetWidth;
        };

        const handleMouseLeave = () => {
          if (window.innerWidth < 1000) return;

          const linkCopy = link.querySelectorAll("a span");
          if (!linkCopy || linkCopy.length < 2) return;

          const visibleCopy = linkCopy[0];
          const animatedCopy = linkCopy[1];

          const animatedChars = animatedCopy.querySelectorAll(".char");
          gsap.to(animatedChars, {
            y: "110%",
            stagger: 0.05,
            duration: 0.5,
            ease: "expo.inOut",
          });

          const visibleChars = visibleCopy.querySelectorAll(".char");
          gsap.to(visibleChars, {
            y: "0%",
            stagger: 0.05,
            duration: 0.5,
            ease: "expo.inOut",
          });
        };

        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);

        link._mouseEnterHandler = handleMouseEnter;
        link._mouseLeaveHandler = handleMouseLeave;
      });

      const handleMenuLinksWrapperMouseLeave = () => {
        const defaultLinkText = menuLinksWrapper.querySelector(
          ".menu-link:first-child"
        );
        if (!defaultLinkText) return;

        const defaultLinkTextSpan = defaultLinkText.querySelector("a span");
        if (!defaultLinkTextSpan) return;

        const linkRect = defaultLinkText.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

        targetHighlighterX.current = linkRect.left - menuWrapperRect.left;
        targetHighlighterWidth.current = defaultLinkTextSpan.offsetWidth;
      };

      menuOverlay.addEventListener("mousemove", handleMouseMove);
      menuLinksWrapper.addEventListener(
        "mouseleave",
        handleMenuLinksWrapperMouseLeave
      );

      const animate = () => {
        currentX.current += (targetX.current - currentX.current) * lerpFactor;
        currentHighlighterX.current +=
          (targetHighlighterX.current - currentHighlighterX.current) *
          lerpFactor;
        currentHighlighterWidth.current +=
          (targetHighlighterWidth.current - currentHighlighterWidth.current) *
          lerpFactor;

        gsap.to(menuLinksWrapper, {
          x: currentX.current,
          duration: 0.3,
          ease: "power4.out",
        });

        gsap.to(linkHighlighter, {
          x: currentHighlighterX.current,
          width: currentHighlighterWidth.current,
          duration: 0.3,
          ease: "power4.out",
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        menuOverlay.removeEventListener("mousemove", handleMouseMove);
        menuLinksWrapper.removeEventListener(
          "mouseleave",
          handleMenuLinksWrapperMouseLeave
        );

        menuLinkContainers.forEach((link) => {
          if (!link) return;
          const mouseEnterHandler = link._mouseEnterHandler;
          const mouseLeaveHandler = link._mouseLeaveHandler;
          if (mouseEnterHandler)
            link.removeEventListener("mouseenter", mouseEnterHandler);
          if (mouseLeaveHandler)
            link.removeEventListener("mouseleave", mouseLeaveHandler);
        });

        splitTextInstances.current.forEach((split) => {
          if (split && split.revert) split.revert();
        });
        splitTextInstances.current = [];
      };
    },
    { scope: menuOverlayRef }
  );

  useEffect(() => {
    if (!lenis) return;
    if (isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuAnimating) return;
    setIsMenuAnimating(true);

    const container = pageRef.current;
    const menuOverlay = menuOverlayRef.current;
    const menuImage = menuImageRef.current;
    const menuLinks = menuLinksRef.current;
    const linkHighlighter = linkHighlighterRef.current;
    const menuLinksWrapper = menuLinksWrapperRef.current;
    const openLabel = openLabelRef.current;
    const closeLabel = closeLabelRef.current;
    const menuCols = menuColsRef.current;

    if (!isMenuOpen) {
      gsap.to(openLabel, {
        y: "-100%",
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(closeLabel, {
        y: "-100%",
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(".menu-link", { overflow: "visible" });

          setIsMenuOpen(true);
          setIsMenuAnimating(false);
        },
      });

      gsap.to(menuImage, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });

      gsap.to(menuLinks, {
        y: "0%",
        duration: 1.25,
        stagger: 0.1,
        delay: 0.25,
        ease: "expo.out",
      });

      gsap.to(linkHighlighter, {
        y: "0%",
        duration: 1,
        delay: 1,
        ease: "expo.out",
      });

      menuCols.forEach((col) => {
        if (!col) return;

        const splitLines = col.querySelectorAll(".split-line");

        gsap.to(splitLines, {
          y: "0%",
          duration: 1,
          stagger: 0.05,
          delay: 0.5,
          ease: "expo.out",
        });
      });
    } else {
      gsap.to(openLabel, {
        y: "0%",
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(closeLabel, {
        y: "0%",
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(menuImage, {
        y: "-25svh",
        opacity: 0.5,
        duration: 1.25,
        ease: "expo.out",
      });

      menuCols.forEach((col) => {
        if (!col) return;

        const splitLines = col.querySelectorAll(".split-line");

        gsap.to(splitLines, {
          y: "-100%",
          duration: 1,
          stagger: 0,
          ease: "expo.out",
        });
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(menuOverlay, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          gsap.set(menuLinks, { y: "150%" });
          gsap.set(linkHighlighter, { y: "150%" });
          gsap.set(menuImage, { y: "0", scale: 0.5, opacity: 0.25 });
          gsap.set(".menu-link", { overflow: "hidden" });

          menuCols.forEach((col) => {
            if (!col) return;
            const splitLines = col.querySelectorAll(".split-line");
            gsap.set(splitLines, { y: "100%" });
          });

          gsap.set(menuLinksWrapper, { x: 0 });
          currentX.current = 0;
          targetX.current = 0;

          setIsMenuOpen(false);
          setIsMenuAnimating(false);
        },
      });
    }
  };

  return (
    <>
      <nav className="grid grid-cols-3 items-center w-full">
        <div className="relative w-32 h-auto justify-self-start">
          <LogoFoash />
        </div>

        {/* Both Logos */}
        <div className="flex items-center gap-1 justify-self-center">
          {/* KARINITY SVG */}
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="100 430 200 310"
            xmlSpace="preserve"
            className="h-14 w-auto"
          >
            <g>
              <g>
                <path d="M175.97,443.22h-49.59v33.28c13.15-13.24,30.36-22.43,49.59-25.5V443.22z" />
                <polygon points="175.68,636.66 175.96,636.76 175.96,636.78 175.68,636.7 		" />
                <path
                  d="M204.93,539.99l66.4,30.96l-2.61,5.62c-14.18,30.35-44.95,49.95-78.43,49.95c-3.73,0-7.41-0.23-11.01-0.7
                    v-12.49c3.59,0.54,7.26,0.83,11.01,0.83c26.4,0,51.24-14.54,64.36-37.33l-75.37-35.15l-3.31-1.54v-0.29l3.31-1.54l75.37-35.17
                    c-13.12-22.78-37.96-37.32-64.36-37.32c-3.64,0-7.22,0.27-10.72,0.77c-1.2,0.18-2.41,0.38-3.6,0.61
                    c-21.1,4.14-39.01,17.26-49.59,35.19c-0.79,1.33-1.55,2.7-2.23,4.09c-0.36,0.68-0.71,1.39-1.03,2.07
                    c-4.49,9.55-6.99,20.19-6.99,31.42c0,10.92,2.38,21.32,6.65,30.65v23.41c-11.89-14.82-19.01-33.62-19.01-54.05
                    c0-20.45,7.12-39.26,19.01-54.07c1.15-1.44,2.36-2.85,3.6-4.2c12.78-14.02,30.09-23.82,49.59-27.08c1.17-0.19,2.36-0.37,3.57-0.5
                    c3.52-0.45,7.12-0.68,10.76-0.68c33.47,0,64.25,19.62,78.43,49.96l2.61,5.6L204.93,539.99z"
                  fill="black"
                />
                <path
                  d="M211.51,504.14c5.49,0,10.33-3.7,11.78-8.99l0.47-1.73l-1.62-0.76l-19.67-9.17l-5.18-2.41l-1.79,3.84
                    l4.75,2.22c-0.64,1.5-0.97,3.12-0.97,4.78C199.28,498.65,204.77,504.14,211.51,504.14z M204.1,488.92l14.45,6.74
                    c-1.36,2.56-4.06,4.23-7.04,4.23c-4.4,0-7.99-3.58-7.99-7.99C203.52,490.88,203.72,489.86,204.1,488.92z"
                  fill="black"
                />
              </g>
              <path
                d="M153.09,480.05c-0.59,0.36-1.17,0.73-1.74,1.12c-3.96,2.63-7.64,5.65-10.98,9.01c-5.74,5.75-10.48,12.47-13.98,19.89v8.37
                  l21.42,21.54l-0.02,0.01l-7.12,7.12l-14.28,14.28v75.36h49.29v-0.06h0.01v-0.03l0.28,0.09V470.9
                  C167.73,472.6,160.01,475.74,153.09,480.05z"
              />
            </g>
          </svg>

          {/* Separator */}
          <div
            className="bg-black w-px h-8 self-center"
            style={{ marginBottom: "10px" }}
          />

          {/* FOASH SVG */}
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="250 440 200 310"
            xmlSpace="preserve"
            className="h-14 w-auto"
          >
            <g className="fill-black">
              <path
                d="M429.31,502.88c0,0.01-4.47,28.87-33.13,28.87c0,0,0,0,0,0.01c6.96,7.81,11.1,18.19,10.78,29.54
                  c-0.64,22.64-19.25,40.99-41.89,41.33c-23.81,0.36-43.22-18.83-43.22-42.56c0-23.51,19.06-42.56,42.56-42.56h0.04
                  c1.83,0,3.48-1.07,4.23-2.74c3.48-7.83,12.9-29.04,12.9-29.04c2.23-5.02-0.99-10.83-6.44-11.5c-3.86-0.48-7.8-0.7-11.8-0.65
                  c-46.91,0.57-85.12,39-85.43,85.91c-0.32,48.33,39,87.56,87.37,87.09c45.84-0.45,84.88-39.22,85.63-85.06
                  C451.27,539.02,443.05,518.46,429.31,502.88z"
              />
            </g>
          </svg>
        </div>

        <div className="relative w-36 h-auto justify-self-end">
          <LogoKarinity />
        </div>
        {/* <div
          className="nav-toggle col-span-3"
          ref={navToggleRef}
          onClick={toggleMenu}
        >
          <div className="nav-toggle-wrapper">
            <p ref={openLabelRef} className="open-label">
              Menu
            </p>

            <p ref={closeLabelRef} className="close-label">
              Close
            </p>
          </div>
        </div> */}
      </nav>

      <div className="menu-overlay" ref={menuOverlayRef}>
        <div className="menu-content">
          <div
            className="menu-col"
            ref={(el) => {
              menuColsRef.current[0] = el;
            }}
          >
            <div className="menu-content-group">
              <p>&copy; FOASH & KARINITY</p>
              <p>El Mahalla El Kubra</p>
              <p>Egypt</p>
            </div>

            <div className="menu-content-group">
              <p>Edition</p>
              <p>Late Vol. 01</p>
            </div>

            <div className="menu-content-group">
              <p>Say Hello</p>
              <p>hi@foash.com</p>
            </div>

            <div className="menu-content-group">
              <p>Hotline</p>
              <p>+20 1222222222</p>
            </div>
          </div>
          <div
            className="menu-col"
            ref={(el) => {
              menuColsRef.current[1] = el;
            }}
          >
            <div className="menu-content-group">
              <p>Field Log</p>

              <a href="https://www.instagram.com/codegridweb/" target="_blank">
                Instagram
              </a>

              <a href="https://www.youtube.com/@codegrid" target="_blank">
                Facebook
              </a>
            </div>

            <div className="menu-content-group">
              <p>Language</p>
              <p>Human</p>
            </div>

            <div className="menu-content-group">
              <p>Credits</p>
              <p>Made by Karinity</p>
              <p>NOV. 2025</p>
            </div>
          </div>
        </div>

        <div className="menu-img">
          <img ref={menuImageRef} src="/menu/menu_img.jpg" alt="" />
        </div>

        <div className="menu-links-wrapper" ref={menuLinksWrapperRef}>
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="menu-link"
              ref={(el) => {
                menuLinkContainersRef.current[index] = el;
              }}
              onClick={(e) => {
                e.preventDefault();
                const currentPath = window.location.pathname;
                if (currentPath === item.route) {
                  if (isMenuOpen) {
                    toggleMenu();
                  }
                  return;
                }
                // navigateWithTransition(
                //   item.route,
                //   isMenuOpen ? toggleMenu : null
                // );
              }}
            >
              <a
                href={item.route}
                ref={(el) => {
                  menuLinksRef.current[index] = el;
                }}
              >
                <span>{item.label}</span>
                <span>{item.label}</span>
              </a>
            </div>
          ))}

          <div className="link-highlighter" ref={linkHighlighterRef}></div>
        </div>
      </div>
    </>
  );
};

export default Menu;
