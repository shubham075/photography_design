"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // e.g. -0.2 (slower) or 0.3 (faster) or offset in px
  direction?: "vertical" | "horizontal";
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.2,
  direction = "vertical",
  className = "",
}) => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layerRef.current) return;
    const el = layerRef.current;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const distance = 150 * speed;

    const tween = gsap.fromTo(
      el,
      direction === "vertical" ? { y: -distance } : { x: -distance },
      {
        y: direction === "vertical" ? distance : 0,
        x: direction === "horizontal" ? distance : 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    return () => {
      tween.kill();
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, [speed, direction]);

  return (
    <div ref={layerRef} className={`gpu-layer will-change-transform ${className}`}>
      {children}
    </div>
  );
};
