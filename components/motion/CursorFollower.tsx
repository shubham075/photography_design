"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CursorFollower: React.FC = () => {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "action">("default");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Global listener for interactive data attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      if (target) {
        const text = target.getAttribute("data-cursor-text") || "";
        const variant = (target.getAttribute("data-cursor") as any) || "hover";
        setCursorText(text);
        setCursorVariant(variant);
      } else {
        setCursorText("");
        setCursorVariant("default");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center rounded-full"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: cursorVariant === "action" ? 96 : cursorVariant === "hover" ? 48 : 14,
        height: cursorVariant === "action" ? 96 : cursorVariant === "hover" ? 48 : 14,
        backgroundColor:
          cursorVariant === "action"
            ? "rgba(212, 175, 55, 0.9)"
            : cursorVariant === "hover"
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(212, 175, 55, 0.8)",
        backdropFilter: cursorVariant === "hover" ? "blur(4px)" : "none",
        borderColor: cursorVariant === "action" ? "#d4af37" : "rgba(255, 255, 255, 0.3)",
        borderWidth: cursorVariant === "action" ? 0 : 1,
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {cursorText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center font-display text-xs font-bold uppercase tracking-wider text-black px-2 select-none"
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
};
