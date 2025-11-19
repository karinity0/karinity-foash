"use client";
import React, { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Matter from "matter-js";

gsap.registerPlugin(ScrollTrigger);

interface BodyElement {
  body: Matter.Body;
  element: HTMLElement;
  width: number;
  height: number;
}

const WebTech = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const bodiesRef = useRef<BodyElement[]>([]);
  const topWallRef = useRef<Matter.Body | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isMobileRef = useRef<boolean>(false);

  const config = {
    gravity: { x: 0, y: 1, scale: 0.001 },
    restitution: 0.5,
    friction: 0.15,
    frictionAir: 0.02,
    density: 0.002,
    wallThickness: 200,
    mouseStiffness: 0.6,
  };

  function clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  // Device orientation handler for mobile gravity
  // Based on Matter.js Context7 docs - adjusts gravity dynamically with device tilt
  const updateGravity = React.useCallback((event: DeviceOrientationEvent) => {
    if (!engineRef.current || !isMobileRef.current) return;

    const orientation = window.orientation || 0;
    const gravity = engineRef.current.world.gravity;
    const beta = event.beta || 0; // Front-to-back tilt (-180 to 180)
    const gamma = event.gamma || 0; // Left-to-right tilt (-90 to 90)

    // Apply gravity based on device orientation
    if (orientation === 0) {
      // Portrait mode
      gravity.x = clamp(gamma, -90, 90) / 90;
      gravity.y = clamp(beta, -90, 90) / 90;
    } else if (orientation === 180) {
      gravity.x = clamp(gamma, -90, 90) / 90;
      gravity.y = clamp(-beta, -90, 90) / 90;
    } else if (orientation === 90) {
      // Landscape right
      gravity.x = clamp(beta, -90, 90) / 90;
      gravity.y = clamp(-gamma, -90, 90) / 90;
    } else if (orientation === -90) {
      // Landscape left
      gravity.x = clamp(-beta, -90, 90) / 90;
      gravity.y = clamp(gamma, -90, 90) / 90;
    }

    // Wake up sleeping bodies when gravity changes significantly
    // This ensures bodies respond to device orientation changes
    if (Math.abs(gamma) > 30 || Math.abs(beta) > 30) {
      bodiesRef.current.forEach(({ body }) => {
        if (body.isSleeping) {
          Matter.Sleeping.set(body, false);
        }
      });
    }
  }, []);

  const initPhysics = React.useCallback(
    (container: HTMLElement, isMobile: boolean) => {
      if (engineRef.current) return; // Already initialized

      isMobileRef.current = isMobile;

      /* ==========================================
       * MOBILE OPTIMIZATIONS (Context7-Informed)
       * ==========================================
       * Based on Matter.js documentation from Context7, the following
       * optimizations are applied for mobile devices:
       *
       * 1. enableSleeping: Bodies go dormant when stationary (saves CPU)
       * 2. Reduced solver iterations: 4/8/6 vs 10/20/16 (faster calculations)
       * 3. Lower sleepThreshold: 30ms vs 60ms (bodies sleep faster)
       * 4. Larger slop value: 0.1 vs 0.05 (less precise but faster collisions)
       * 5. Runner delta: 30fps vs 60fps physics updates
       * 6. Throttled render: 30fps vs 60fps visual updates
       * 7. Fewer objects: 12 vs 20 items on mobile
       * 8. Device orientation gravity control with sleeping body wake-up
       * 9. Touch event optimization with passive listeners
       * 10. GPU acceleration with will-change CSS property
       * ========================================== */

      // Wait for next frame to ensure all DOM elements are rendered and laid out
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!containerRef.current) return;

          const engine = Matter.Engine.create({
            enableSleeping: isMobile, // Enable sleeping on mobile to save CPU
          });
          engine.gravity = config.gravity;

          // Mobile optimizations - reduce solver iterations for better performance
          if (isMobile) {
            engine.constraintIterations = 4; // Reduced from 10
            engine.positionIterations = 8; // Reduced from 20
            engine.velocityIterations = 6; // Reduced from 16
          } else {
            engine.constraintIterations = 10;
            engine.positionIterations = 20;
            engine.velocityIterations = 16;
          }

          engine.timing.timeScale = 1;
          engineRef.current = engine;

          const containerRect = container.getBoundingClientRect();
          const wallThickness = config.wallThickness;

          // Create walls
          const walls = [
            Matter.Bodies.rectangle(
              containerRect.width / 2,
              containerRect.height + wallThickness / 2,
              containerRect.width + wallThickness * 2,
              wallThickness,
              { isStatic: true }
            ),
            Matter.Bodies.rectangle(
              -wallThickness / 2,
              containerRect.height / 2,
              wallThickness,
              containerRect.height + wallThickness * 2,
              { isStatic: true }
            ),
            Matter.Bodies.rectangle(
              containerRect.width + wallThickness / 2,
              containerRect.height / 2,
              wallThickness,
              containerRect.height + wallThickness * 2,
              { isStatic: true }
            ),
          ];
          Matter.World.add(engine.world, walls);

          // Create physics bodies for objects - ensure we get all of them
          const objects = container.querySelectorAll<HTMLElement>(".object");
          console.log(`Total objects found: ${objects.length}`);

          // Clear previous bodies
          bodiesRef.current = [];

          // First, ensure all elements are visible and have dimensions
          // Set them to display block and position them off-screen (but keep hidden initially)
          objects.forEach((obj, index) => {
            obj.style.display = "block";
            obj.style.visibility = "hidden"; // Keep hidden initially
            obj.style.opacity = "0"; // Keep opacity 0 initially
            obj.style.left = `${-1000}px`;
            obj.style.top = `${-500 - index * 100}px`;
            obj.style.zIndex = "0"; // Low z-index initially
          });

          // Force multiple reflows to ensure all elements are laid out
          void container.offsetHeight;
          void container.offsetWidth;

          // Wait a bit more for layout
          setTimeout(() => {
            // Now get all objects with their actual dimensions
            const validObjects: HTMLElement[] = [];

            objects.forEach((obj, index) => {
              const rect = obj.getBoundingClientRect();
              console.log(
                `Object ${index} (${obj.textContent}): width=${rect.width}, height=${rect.height}`
              );

              if (rect.width > 0 && rect.height > 0) {
                validObjects.push(obj);
              } else {
                // Try to force layout by reading computed styles
                const computedStyle = window.getComputedStyle(obj);
                console.warn(
                  `Object ${index} has zero dimensions. Display: ${computedStyle.display}, Visibility: ${computedStyle.visibility}`
                );
              }
            });

            console.log(
              `Valid objects: ${validObjects.length} out of ${objects.length}`
            );

            validObjects.forEach((obj, index) => {
              const objRect = obj.getBoundingClientRect();

              const startX =
                Math.random() * (containerRect.width - objRect.width) +
                objRect.width / 2;
              // Start all objects much closer together - tighter spacing
              const startY = -100 - index * 50; // Start at -100px (just above top) with 50px spacing
              const startRotation = (Math.random() - 0.5) * Math.PI;

              console.log(
                `Creating body ${index} (${obj.textContent?.trim()}): startY=${startY}, startX=${startX.toFixed(
                  1
                )}`
              );

              const body = Matter.Bodies.rectangle(
                startX,
                startY,
                objRect.width,
                objRect.height,
                {
                  restitution: config.restitution,
                  friction: config.friction,
                  frictionAir: config.frictionAir,
                  density: config.density,
                  // Mobile optimizations based on Context7 Matter.js docs
                  sleepThreshold: isMobile ? 30 : 60, // Bodies sleep faster on mobile (30ms vs 60ms)
                  slop: isMobile ? 0.1 : 0.05, // Slightly larger slop on mobile for better performance
                  render: {
                    visible: false, // We handle rendering manually, so disable internal render
                  },
                }
              );

              Matter.Body.setAngle(body, startRotation);

              bodiesRef.current.push({
                body: body,
                element: obj,
                width: objRect.width,
                height: objRect.height,
              });

              Matter.World.add(engine.world, body);
            });

            console.log(
              `Initialized ${bodiesRef.current.length} physics bodies`
            );

            // Add top wall after delay - give more time for all objects to fall
            setTimeout(() => {
              if (!engineRef.current) return;
              topWallRef.current = Matter.Bodies.rectangle(
                containerRect.width / 2,
                -wallThickness / 2,
                containerRect.width + wallThickness * 2,
                wallThickness,
                { isStatic: true }
              );
              Matter.World.add(engineRef.current.world, topWallRef.current);
              console.log("Top wall added");
            }, 5000); // Increased from 3000 to 5000 to give more time

            // Mouse/Touch interaction
            const mouse = Matter.Mouse.create(container);
            // Remove default mouse wheel handlers if they exist
            if ((mouse as any).mousewheel) {
              mouse.element.removeEventListener(
                "mousewheel",
                (mouse as any).mousewheel
              );
              mouse.element.removeEventListener(
                "DOMMouseScroll",
                (mouse as any).mousewheel
              );
            }

            // Add touch support for mobile with passive listeners for better scroll performance
            if (isMobile) {
              const handleTouchStart = (e: Event) => {
                const touch = (e as TouchEvent).touches[0];
                if (touch) {
                  mouse.position.x = touch.clientX;
                  mouse.position.y = touch.clientY;
                }
              };

              const handleTouchMove = (e: Event) => {
                const touch = (e as TouchEvent).touches[0];
                if (touch) {
                  mouse.position.x = touch.clientX;
                  mouse.position.y = touch.clientY;
                }
              };

              const handleTouchEnd = () => {
                mouse.button = -1; // Release
              };

              // Use passive: false for touchmove to allow preventDefault if needed
              mouse.element.addEventListener("touchstart", handleTouchStart, {
                passive: true,
              });
              mouse.element.addEventListener("touchmove", handleTouchMove, {
                passive: false,
              });
              mouse.element.addEventListener("touchend", handleTouchEnd, {
                passive: true,
              });
            }

            mouseConstraintRef.current = Matter.MouseConstraint.create(engine, {
              mouse: mouse,
              constraint: {
                stiffness: isMobile ? 0.6 : 0.8, // Slightly lower stiffness on mobile
                render: { visible: false },
              },
            });

            mouseConstraintRef.current.mouse.element.oncontextmenu = () =>
              false;

            let dragging: Matter.Body | null = null;
            let originalInertia: number | null = null;

            Matter.Events.on(
              mouseConstraintRef.current,
              "startdrag",
              function (event: any) {
                dragging = event.body;
                if (dragging) {
                  originalInertia = dragging.inertia;
                  // Use a very high inertia instead of Infinity for smoother dragging
                  Matter.Body.setInertia(dragging, 1000000);
                  // Don't zero velocity immediately - let it follow mouse naturally
                  Matter.Body.setAngularVelocity(dragging, 0);
                }
              }
            );

            Matter.Events.on(
              mouseConstraintRef.current,
              "enddrag",
              function () {
                if (dragging) {
                  // Restore original inertia
                  Matter.Body.setInertia(dragging, originalInertia || 1);

                  // Give it a small velocity based on mouse movement for more natural drop
                  // The mouse constraint already handles this, but we can ensure it's not zero
                  if (dragging.velocity.x === 0 && dragging.velocity.y === 0) {
                    // If somehow velocity is zero, give it a tiny random velocity
                    Matter.Body.setVelocity(dragging, {
                      x: (Math.random() - 0.5) * 2,
                      y: (Math.random() - 0.5) * 2,
                    });
                  }

                  dragging = null;
                  originalInertia = null;
                }
              }
            );

            Matter.Events.on(engine, "beforeUpdate", function () {
              // Only clamp when NOT dragging - let mouse constraint handle dragging
              // This allows smooth mouse following without interference
              if (!dragging) {
                // Optional: Add boundary checks for non-dragged bodies if needed
                // The walls already handle boundaries, so this is not necessary
              }
            });

            container.addEventListener("mouseleave", () => {
              if (mouseConstraintRef.current) {
                (mouseConstraintRef.current.constraint as any).bodyB = null;
                (mouseConstraintRef.current.constraint as any).pointB = null;
              }
            });

            const handleMouseUp = () => {
              if (mouseConstraintRef.current) {
                (mouseConstraintRef.current.constraint as any).bodyB = null;
                (mouseConstraintRef.current.constraint as any).pointB = null;
              }
            };
            document.addEventListener("mouseup", handleMouseUp);

            Matter.World.add(engine.world, mouseConstraintRef.current);

            // Start physics runner with mobile optimizations
            const runner = Matter.Runner.create({
              // Use larger delta on mobile for fewer physics updates (30fps vs 60fps)
              delta: isMobile ? 1000 / 30 : 1000 / 60,
            });
            Matter.Runner.run(runner, engine);
            runnerRef.current = runner;

            // Update positions
            let frameCount = 0;
            let lastUpdateTime = 0;
            const updateInterval = isMobile ? 33 : 16; // ~30fps on mobile, ~60fps on desktop

            function updatePositions(currentTime: number = 0) {
              if (!engineRef.current) return;

              // Throttle updates on mobile for better performance
              if (isMobile && currentTime - lastUpdateTime < updateInterval) {
                animationFrameRef.current =
                  requestAnimationFrame(updatePositions);
                return;
              }

              lastUpdateTime = currentTime;
              frameCount++;

              if (frameCount % 60 === 0) {
                console.log(`Updating ${bodiesRef.current.length} bodies`);
              }

              bodiesRef.current.forEach(
                ({ body, element, width, height }, index) => {
                  const x = clamp(
                    body.position.x - width / 2,
                    0,
                    containerRect.width - width
                  );
                  // Allow elements to be visible even if above viewport
                  const y = clamp(
                    body.position.y - height / 2,
                    -height * 10, // Increased from 3 to 10 to allow visibility above viewport
                    containerRect.height - height
                  );

                  element.style.left = x + "px";
                  element.style.top = y + "px";
                  element.style.transform = `rotate(${body.angle}rad)`;
                  element.style.display = "block";

                  // Add will-change for better mobile GPU acceleration
                  if (isMobile && frameCount < 10) {
                    element.style.willChange = "transform, top, left";
                  } else if (isMobile && frameCount === 300) {
                    // Remove will-change after initial animation to free GPU memory
                    element.style.willChange = "auto";
                  }

                  // Only make visible when they're falling (y position is reasonable)
                  // Show when body is above or near the viewport
                  // Show when body is within or near the section bounds
                  if (
                    body.position.y > -200 &&
                    body.position.y < containerRect.height + 200
                  ) {
                    element.style.visibility = "visible";
                    element.style.opacity = "1";
                    element.style.zIndex = "2";
                  } else {
                    element.style.visibility = "hidden";
                    element.style.opacity = "0";
                    element.style.zIndex = "0";
                  }

                  // Debug bodies that might be stuck (bodies 12+)
                  if (frameCount < 10 && index >= 12) {
                    console.log(
                      `Body ${index} (${element.textContent?.trim()}): x=${x.toFixed(
                        1
                      )}, y=${y.toFixed(1)}, body.y=${body.position.y.toFixed(
                        1
                      )}`
                    );
                  }
                }
              );

              animationFrameRef.current =
                requestAnimationFrame(updatePositions);
            }
            updatePositions();
          }, 50); // Small delay to ensure layout
        });
      });
    },
    []
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1000px)", () => {
        if (!sectionRef.current || !containerRef.current) return;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          once: true,
          onEnter: () => {
            const container = containerRef.current;
            if (container && !engineRef.current) {
              initPhysics(container, false);
            }
          },
        });
      });
      mm.add("(max-width: 999px)", () => {
        if (!sectionRef.current || !containerRef.current) return;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          once: true,
          onEnter: () => {
            const container = containerRef.current;
            if (container && !engineRef.current) {
              initPhysics(container, true);
            }
          },
        });
      });
      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  // Setup device orientation for mobile and cleanup on unmount
  useEffect(() => {
    // Request device orientation permission on iOS 13+
    const requestOrientationPermission = async () => {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        try {
          const permission = await (
            DeviceOrientationEvent as any
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", updateGravity, true);
          }
        } catch (error) {
          console.log("Device orientation permission denied:", error);
        }
      } else {
        // Non-iOS devices or older iOS versions
        window.addEventListener("deviceorientation", updateGravity, true);
      }
    };

    // Only request on mobile devices
    if (isMobileRef.current) {
      requestOrientationPermission();
    }

    return () => {
      window.removeEventListener("deviceorientation", updateGravity, true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [updateGravity]);

  const technologies = [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Flutter",
    "React Native",
    "Dart",
    "TypeScript",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Linux",
    "Windows",
    "MacOS",
    "iOS",
  ];

  // Optimize for mobile by reducing number of objects
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 1000);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use fewer technologies on mobile for better performance
  const displayTechnologies = isMobileDevice
    ? technologies.slice(0, 12) // Show only 12 items on mobile
    : technologies;

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-[100vw] h-screen bg-black text-white relative overflow-hidden p-8 z-20! select-none cursor-grab"
    >
      <div
        ref={containerRef}
        className="object-container absolute top-0 left-0 w-full h-full overflow-hidden"
      >
        {displayTechnologies.map((tech, index) => (
          <div
            key={index}
            className="object absolute w-max text-2xl md:text-3xl font-medium bg-[#e46235] text-black px-8! py-4! rounded-[50px] shadow-lg shadow-white/10 cursor-grab select-none pointer-events-auto active:cursor-grabbing"
            style={{
              opacity: 0,
              visibility: "hidden",
              zIndex: 0,
            }}
          >
            <p>{tech}</p>
          </div>
        ))}
      </div>

      <div className="footer-content absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none p-8">
        <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight select-none pointer-events-auto text-center w-[45%] md:w-full max-w-4xl">
          Stack it. Drag it. Build it.
        </h1>
      </div>
    </section>
  );
};

export default WebTech;
