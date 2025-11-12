"use client";
import "./home.css";
import Button from "@/components/Button/Button";
import Showreel from "@/components/Showreel/Showreel";
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
          <ExpanderLayout />
          <div className="hero-content-main">
            <div></div>
            <div className="hero-footer-outer">
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

      {/* <Showreel />

      <section className="featured-work">
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
      </section>

      <section className="client-reviews-header-container">
        <div className="container">
          <div className="client-reviews-header-content">
            <div className="client-reviews-header">
              <Copy animateOnScroll={true} delay={0.25}>
                <h1>People Approved</h1>
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

            <div className="client-reviews-header-copy">
              <Copy animateOnScroll={true} delay={0.25}>
                <p className="lg">
                  Unfiltered thoughts from the people who survived our creative
                  process. Or at least that’s what they told us.
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>

      <ClientReviews />

      <Spotlight />

      <CTACard />

      <Footer /> */}
    </>
  );
};

export default Page;
