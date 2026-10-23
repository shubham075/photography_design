"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
  scrub?: boolean | number;
  mode?: "words" | "chars";
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export const SplitTextReveal: React.FC<SplitTextRevealProps> = ({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.04,
  triggerOnScroll = true,
  scrub = false,
  mode = "words",
  as: Component = "div",
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const elements = el.querySelectorAll(".split-token");

    if (elements.length === 0) return;

    // Check prefers-reduced-motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(elements, {
        y: "115%",
        opacity: 0,
        rotateX: -15,
        willChange: "transform, opacity",
      });

      const animConfig: gsap.TweenVars = {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: stagger,
        delay: delay,
        onComplete: () => {
          gsap.set(elements, { clearProps: "willChange" });
        },
      };

      if (triggerOnScroll) {
        animConfig.scrollTrigger = {
          trigger: el,
          start: "top 85%",
          scrub: scrub,
          toggleActions: "play none none reverse",
        };
      }

      gsap.to(elements, animConfig);
    }, el);

    return () => ctx.revert();
  }, [text, delay, stagger, triggerOnScroll, scrub, mode]);

  if (mode === "chars") {
    const words = text.split(" ");
    return (
      // @ts-ignore
      <Component ref={containerRef} className={`perspective-1000 ${className}`}>
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split("").map((char, cIdx) => (
              <span key={cIdx} className="inline-block overflow-hidden pb-[0.1em]">
                <span className={`split-token inline-block ${wordClassName}`}>{char}</span>
              </span>
            ))}
          </span>
        ))}
      </Component>
    );
  }

  const words = text.split(" ");
  return (
    // @ts-ignore
    <Component ref={containerRef} className={`perspective-1000 ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden pb-[0.15em] mr-[0.28em] align-top">
          <span className={`split-token inline-block ${wordClassName}`}>{word}</span>
        </span>
      ))}
    </Component>
  );
};
