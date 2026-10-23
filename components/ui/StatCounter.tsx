"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface StatCounterProps {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  suffix = "",
  prefix = "",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseFloat(numericMatch[0]);
    const isFloat = numericMatch[0].includes(".");
    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: targetNumber,
            duration: 1.8,
            ease: "power3.out",
            onUpdate: () => {
              setDisplayValue(isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toString());
            },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value]);

  return (
    <div ref={containerRef} className={`flex flex-col ${className}`}>
      <div className="flex items-baseline font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
        {prefix && <span className="text-accent-gold mr-1">{prefix}</span>}
        <span>{displayValue}</span>
        {suffix && <span className="text-accent-gold ml-1 text-2xl sm:text-3xl lg:text-4xl">{suffix}</span>}
      </div>
      <div className="mt-2 text-xs sm:text-sm uppercase tracking-widest text-zinc-400 font-medium">
        {label}
      </div>
    </div>
  );
};
