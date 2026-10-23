"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface PinnedSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  pinDuration?: string | number; // e.g. "150%" or "+=2000"
  onProgress?: (progress: number) => void;
}

export const PinnedSection: React.FC<PinnedSectionProps> = ({
  children,
  id,
  className = "",
  pinDuration = "150%",
  onProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinRef.current) return;
    const container = containerRef.current;
    const pinEl = pinRef.current;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const st = ScrollTrigger.create({
      trigger: container,
      pin: pinEl,
      start: "top top",
      end: typeof pinDuration === "number" ? `+=${pinDuration}` : pinDuration,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (onProgress) onProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [pinDuration, onProgress]);

  return (
    <div ref={containerRef} id={id} className={`relative ${className}`}>
      <div ref={pinRef} className="h-screen w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};
