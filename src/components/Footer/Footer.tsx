"use client";
import "./Footer.css";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "../Button/Button";
import { IoMail } from "react-icons/io5";
import Copy from "../Copy/Copy";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const explosionContainerRef = useRef<HTMLDivElement>(null);
  const profileImagesContainerRef = useRef<HTMLDivElement>(null);
  const profileImagesRef = useRef<HTMLDivElement[]>([]);
  const nameElementsRef = useRef<HTMLDivElement[]>([]);
  const nameHeadingsRef = useRef<HTMLHeadingElement[]>([]);
  const defaultLettersRef = useRef<Element[]>([]);
  const [egyptTime, setEgyptTime] = useState("");

  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 300,
    horizontalForce: 20,
    verticalForce: 15,
    rotationSpeed: 10,
    resetDelay: 500,
  };

  const imageParticleCount = 7;
  const imagePaths = Array.from(
    { length: imageParticleCount },
    (_, i) => `/objects/obj-${i + 8}.png`
  );

  useEffect(() => {
    const updateEgyptTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Cairo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const egyptTimeString = formatter.format(new Date());
      setEgyptTime(egyptTimeString);
    };

    updateEgyptTime();
    const timeInterval = setInterval(updateEgyptTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  class Particle {
    element: HTMLImageElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;

    constructor(element: HTMLImageElement) {
      this.element = element;
      this.x = 0;
      this.y = 0;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
  }

  useGSAP(
    () => {
      let hasExploded = false;
      let animationId: number | undefined;
      let checkTimeout: NodeJS.Timeout | undefined;

      imagePaths.forEach((path) => {
        const img = new Image();
        img.src = path;
      });

      const getComputedImageSize = (): number => {
        const viewportWidth =
          typeof window !== "undefined" ? window.innerWidth : 1200;
        const viewportHeight =
          typeof window !== "undefined" ? window.innerHeight : 800;
        const baseOnWidth = Math.floor(viewportWidth * 0.18);
        const baseOnHeight = Math.floor(viewportHeight * 0.22);
        return Math.max(
          300,
          Math.min(config.imageSize, baseOnWidth, baseOnHeight)
        );
      };

      const createParticles = () => {
        if (!explosionContainerRef.current) return;
        explosionContainerRef.current.innerHTML = "";

        const particleSize = getComputedImageSize();
        explosionContainerRef.current.style.setProperty(
          "--particle-size",
          `${particleSize}px`
        );

        imagePaths.forEach((path) => {
          const particle = document.createElement("img");
          particle.src = path;
          particle.classList.add("explosion-particle-img");
          explosionContainerRef.current!.appendChild(particle);
        });
      };

      const explode = () => {
        if (hasExploded || !explosionContainerRef.current) return;

        hasExploded = true;
        createParticles();

        const particleElements = explosionContainerRef.current.querySelectorAll(
          ".explosion-particle-img"
        ) as NodeListOf<HTMLImageElement>;
        const particles = Array.from(particleElements).map(
          (element) => new Particle(element)
        );

        const animate = () => {
          particles.forEach((particle) => particle.update());
          animationId = requestAnimationFrame(animate);

          if (
            explosionContainerRef.current &&
            particles.every(
              (particle) =>
                particle.y > explosionContainerRef.current!.offsetHeight / 2
            )
          ) {
            if (animationId) cancelAnimationFrame(animationId);
          }
        };

        animate();
      };

      const checkFooterPosition = () => {
        if (!footerRef.current) return;

        const footerRect = footerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (footerRect.top > viewportHeight + 100) {
          hasExploded = false;
        }

        if (!hasExploded && footerRect.top <= viewportHeight + 250) {
          explode();
        }
      };

      createParticles();
      setTimeout(checkFooterPosition, 500);

      const scrollHandler = () => {
        if (checkTimeout) clearTimeout(checkTimeout);
        checkTimeout = setTimeout(checkFooterPosition, 5);
      };

      const resizeHandler = () => {
        const newSize = getComputedImageSize();
        if (explosionContainerRef.current) {
          explosionContainerRef.current.style.setProperty(
            "--particle-size",
            `${newSize}px`
          );
        }
        hasExploded = false;
      };

      window.addEventListener("scroll", scrollHandler);
      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("scroll", scrollHandler);
        window.removeEventListener("resize", resizeHandler);
        if (checkTimeout) clearTimeout(checkTimeout);
        if (animationId) cancelAnimationFrame(animationId);
        if (explosionContainerRef.current) {
          explosionContainerRef.current.innerHTML = "";
        }
      };
    },
    { scope: footerRef }
  );

  useGSAP(() => {
    const profileImagesContainer =
      profileImagesContainerRef.current as HTMLDivElement;
    if (!profileImagesContainer) return;

    const profileImages = Array.from(
      profileImagesContainer.querySelectorAll<HTMLDivElement>(".img")
    );
    const nameElements = Array.from(
      document.querySelectorAll<HTMLDivElement>(".profile-names .name")
    );
    const nameHeadings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(".profile-names .name h1")
    );

    // Store refs
    profileImagesRef.current = profileImages;
    nameElementsRef.current = nameElements;
    nameHeadingsRef.current = nameHeadings;

    // Split text into characters
    nameHeadings.forEach((heading) => {
      const split = new SplitText(heading, { type: "chars" });
      split.chars.forEach((char) => {
        char.classList.add("letter");
      });
    });

    const defaultLetters =
      nameElements[0]?.querySelectorAll<HTMLElement>(".letter") || [];
    defaultLettersRef.current = Array.from(defaultLetters);
    gsap.set(defaultLettersRef.current as gsap.TweenTarget, { y: "100%" });

    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setupDesktopInteractions();
      }
    };

    const setupDesktopInteractions = () => {
      profileImages.forEach((img, index) => {
        const correspondingName = nameElements[index + 1];
        if (!correspondingName) return;

        const letters =
          correspondingName.querySelectorAll<HTMLElement>(".letter");

        const handleMouseEnter = () => {
          gsap.to(img as gsap.TweenTarget, {
            width: 150,
            height: 150,
            duration: 0.5,
            ease: "power4.out",
          });

          gsap.to(Array.from(letters) as gsap.TweenTarget, {
            y: "-100%",
            ease: "power4.out",
            duration: 0.75,
            stagger: {
              each: 0.025,
              from: "center",
            },
          });
        };

        const handleMouseLeave = () => {
          gsap.to(img as gsap.TweenTarget, {
            width: 70,
            height: 70,
            duration: 0.5,
            ease: "power4.out",
          });

          gsap.to(Array.from(letters) as gsap.TweenTarget, {
            y: "0%",
            ease: "power4.out",
            duration: 0.75,
            stagger: {
              each: 0.025,
              from: "center",
            },
          });
        };

        img.addEventListener("mouseenter", handleMouseEnter);
        img.addEventListener("mouseleave", handleMouseLeave);

        // Store cleanup function
        (img as any)._cleanup = () => {
          img.removeEventListener("mouseenter", handleMouseEnter);
          img.removeEventListener("mouseleave", handleMouseLeave);
        };
      });

      const handleContainerMouseEnter = () => {
        gsap.to(defaultLettersRef.current as gsap.TweenTarget, {
          y: "-20%",
          ease: "power4.out",
          duration: 0.75,
          stagger: {
            each: 0.025,
            from: "center",
          },
        });
      };

      const handleContainerMouseLeave = () => {
        gsap.to(defaultLettersRef.current as gsap.TweenTarget, {
          y: "100%",
          ease: "power4.out",
          duration: 0.75,
          stagger: {
            each: 0.025,
            from: "center",
          },
        });
      };

      profileImagesContainer.addEventListener(
        "mouseenter",
        handleContainerMouseEnter
      );
      profileImagesContainer.addEventListener(
        "mouseleave",
        handleContainerMouseLeave
      );

      // Store cleanup function
      (profileImagesContainer as any)._cleanup = () => {
        profileImagesContainer.removeEventListener(
          "mouseenter",
          handleContainerMouseEnter
        );
        profileImagesContainer.removeEventListener(
          "mouseleave",
          handleContainerMouseLeave
        );
      };
    };

    // Setup interactions if window is wide enough
    if (window.innerWidth >= 900) {
      setupDesktopInteractions();
    }

    window.addEventListener("resize", handleResize);
  });

  return (
    <footer ref={footerRef}>
      <div className="container">
        <div className="footer-header-content relative">
          <div className="footer-header">
            <Copy animateOnScroll={true} delay={0.2}>
              <h2>Let's build something that feels alive</h2>
            </Copy>
          </div>
          <div className="footer-link">
            <Button
              animateOnScroll={true}
              delay={0.5}
              variant="light"
              icon={IoMail}
              href="/contact"
            >
              Say Hello
            </Button>
          </div>

          <section className="team">
            <div className="profile-images" ref={profileImagesContainerRef}>
              <div className="img">
                <img src="/team-cards/team-member-2.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/team-cards/team-member-4.jpg" alt="" />
              </div>
            </div>

            <div className="profile-names">
              <div className="name default">
                <h1>The Squad</h1>
              </div>
              <div className="name">
                <h1>Karim</h1>
              </div>
              <div className="name">
                <h1>Foash</h1>
              </div>
            </div>
          </section>
        </div>

        <div className="footer-byline">
          <div className="footer-time">
            <p className="gap-x-2! text-sm!">
              Egypt, El Mahalla El Kubra <span>{egyptTime}</span>
            </p>
          </div>

          <div className="footer-author">
            <p>Developed by Karinity &copy;</p>
          </div>

          <div className="footer-copyright">
            <p>KARINITY & FOASH</p>
          </div>
        </div>
      </div>
      <div className="explosion-container" ref={explosionContainerRef}></div>
    </footer>
  );
};

export default Footer;
