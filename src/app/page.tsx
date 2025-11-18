"use client";
import "./home.css";
import Button from "@/components/Button/Button";
import ShowWeb from "@/components/ShowWeb/ShowWeb";
import FeaturedWork from "@/components/FeaturedWork/FeaturedWork";
import ClientReviews from "@/components/ClientReviews/ClientReviews";
import Spotlight from "@/components/Spotlight/Spotlight";
import CTACard from "@/components/CTACard/CTACard";
import Footer from "@/components/Footer/Footer";
import Copy from "@/components/Copy/Copy";
import PreLoader, { isInitialLoad } from "@/components/Preloader/PreLoader";
import ExpanderLayout from "@/components/ExpanderLayout/ExpanderLayout";
import React, { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { WDP } from "@/components/Home/WDP";
import { Title } from "@/components/Home/Title";
import WebWork from "@/components/Home/WebWork";

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    const onLoad = () => ScrollTrigger.refresh(true);
    window.addEventListener("load", onLoad, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <>
      {/* <PreLoader /> */}

      <section className="hero">
        <div className="container">
          <div className="hero-content-main">
            <div className="w-full h-full flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center relative w-full max-w-7xl h-auto min-h-[60vh] sm:min-h-[70vh] md:h-[80%] py-8 sm:py-12 md:py-0 select-none ">
                {/* Main heading group */}
                <Title />

                {/* Letters */}
                <WDP />
              </div>
            </div>
            <div className="hero-footer-outer hidden lg:block">
              <Copy animateOnScroll={false} delay={isInitialLoad ? 6.35 : 1.65}>
                <p className="sm">&copy; FOASH & KARINITY</p>
                <p className="sm">( UNLIMITED WORKSPACE )</p>
              </Copy>
            </div>

            <div className="hero-footer">
              <Button delay={isInitialLoad ? 6.35 : 1.55}>
                Choose Your Path
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="featured-work">
        <div className="container">
          <div className="featured-work-header-content">
            <div className="featured-work-header">
              <Copy animateOnScroll={true} delay={0.25}>
                <h1>Featured Work</h1>
              </Copy>
            </div>

            <div className="arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                viewBox="0 0 32 32"
                fill="none"
                className="icon"
              >
                <path
                  d="M16 26.6665L16 5.33317"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M22.6667 19.9999L16 26.6665L9.33337 19.9998"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>

            <div className="featured-work-header-copy">
              <Copy animateOnScroll={true} delay={0.25}>
                <p className="lg">
                  From motion to concept, pieces born from quiet sketches, late
                  nights, and just the right amount of chaos.
                </p>
              </Copy>
            </div>
          </div>

          <FeaturedWork />
        </div>
      </section> */}

      <Spotlight />

      <ShowWeb />

      <WebWork />

      {/* <CTACard /> */}

      <section className="client-reviews-header-container">
        <div className="container">
          <div className="client-reviews-header-content">
            <div className="client-reviews-header">
              <Copy animateOnScroll={true} delay={0.25}>
                <h2 className="w-full text-center flex items-center justify-center text-8xl!">
                  People Approved
                </h2>
              </Copy>
            </div>

            <div className="arrow">
              <svg
                version="1.2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="954.21 659.94 292.34 748.09"
              >
                <g fill="black">
                  <path d="m982.57 850.08c14.14 14.78 32.82 27.27 54.02 36.1 20.11 8.38 41.34 13.84 61.87 19.11 18.58 4.78 37.79 9.72 55.7 16.75 42.93 16.88 71.54 46.32 76.55 78.77 2.64 17.11 0.82 52.22-41.04 95.16-6.03 6.18-12.01 12.12-17.8 17.86-19.88 19.73-38.66 38.36-55.66 63.27-26.2 38.38-40.2 84.79-42.58 141.44l-37.31-15.85 44.44 105.34 44.43-105.34-36.53 15.52c2.39-53.34 15.51-96.87 39.94-132.65 16.19-23.73 34.48-41.88 53.84-61.09 5.83-5.78 11.85-11.76 17.97-18.03 19.92-20.43 52.27-61.62 45.13-107.91-5.83-37.79-37.94-71.6-85.89-90.45-18.77-7.37-38.43-12.43-57.45-17.31-20.02-5.15-40.72-10.47-59.84-18.44-32.86-13.69-69.26-42.23-72.87-81.27-3.4-36.75 24.02-69.91 52.71-86.47 15.26-8.82 32.57-18.81 107.96-29.73 4.09-0.59 6.94-4.4 6.34-8.5-0.59-4.1-4.4-6.93-8.49-6.34-36.68 5.31-78.25 11.33-113.31 31.57-18.06 10.43-33.9 25.39-44.62 42.13-11.98 18.71-17.35 39.02-15.52 58.73 1.89 20.53 11.58 40.45 28.01 57.63z"></path>
                </g>
              </svg>
            </div>

            <div className="client-reviews-header-copy">
              <Copy animateOnScroll={true} delay={0.25}>
                <p className="lg">
                  Unfiltered thoughts from the people who survived our creative
                  process. Or at least that's what they told us.
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>

      <ClientReviews />

      <Footer />
    </>
  );
};

export default Page;
