"use client";
import "./contact.css";
import { useEffect, useRef } from "react";
import Button from "@/components/Button/Button";
import Copy from "@/components/Copy/Copy";

const Page = () => {
  return (
    <section className="contact screensaver-container">
      <div className="contact-copy">
        <div className="contact-col">
          <Copy delay={0.8}>
            <h2>Got a wild idea brewing?</h2>
          </Copy>
          <Copy delay={1}>
            <p style={{ marginTop: "2rem", opacity: 0.8 }}>
              We love turning ambitious visions into reality.
            </p>
          </Copy>
        </div>

        <div className="contact-col">
          <div className="contact-group">
            <Copy delay={0.8}>
              <p className="sm">We specialize in</p>
              <p>Web & Mobile Development</p>
              <p>Graphic Design & Branding</p>
              <p>Printing</p>
            </Copy>
          </div>

          <div className="contact-group">
            <Copy delay={1.2}>
              <p className="sm">Base</p>
              <p>El Mahalla El Kubra, Egypt</p>
            </Copy>
          </div>

          <div className="contact-mail">
            <Button delay={1.3} href="/">
              studio@karinity.com
            </Button>
          </div>

          <div className="contact-group">
            <Copy delay={1.4}>
              <p className="sm">Credits</p>
              <p>Created by &copy; KARINITY</p>
              <p>Edition 2026</p>
            </Copy>
          </div>
        </div>
      </div>

      <div className="contact-footer">
        <div className="container">
          <Copy delay={1.6} animateOnScroll={false}>
            <p className="sm">Made in Egypt</p>
          </Copy>

          <div className="contact-socials">
            <Copy delay={1.7} animateOnScroll={false}>
              <a
                className="sm"
                href="https://www.instagram.com/karinity_foash/"
                target="_blank"
              >
                Instagram
              </a>
            </Copy>

            <Copy delay={1.8} animateOnScroll={false}>
              <a
                className="sm"
                href="https://www.youtube.com/@codegrid"
                target="_blank"
              >
                YouTube
              </a>
            </Copy>

            <Copy delay={1.9} animateOnScroll={false}>
              <a
                className="sm"
                href="https://x.com/codegridweb"
                target="_blank"
              >
                Twitter
              </a>
            </Copy>
          </div>
          <Copy delay={2} animateOnScroll={false}>
            <p className="sm">&copy; KARINITY</p>
          </Copy>
        </div>
      </div>
    </section>
  );
};

export default Page;
