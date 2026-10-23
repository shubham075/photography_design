"use client";

/**
 * Shared motion kit for the vertical demo sites.
 * Everything honours prefers-reduced-motion and cleans up its GSAP context.
 */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Run a GSAP setup function inside a scoped context. Skipped under reduced motion. */
export function useGsap(setup: (root: HTMLElement) => void | (() => void), deps: React.DependencyList = []) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || prefersReduced()) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup(ref.current as HTMLElement);
    }, ref.current);
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(t);
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ------------------------------------------------------------------ */
/* Dock: fixed top bar present on every demo                           */
/* ------------------------------------------------------------------ */
export const DemoDock: React.FC<{
  label: string;
  accent: string;
  right?: React.ReactNode;
  tone?: "dark" | "light";
}> = ({ label, accent, right, tone = "dark" }) => (
  <div className="fixed top-5 left-5 right-5 z-50 flex items-center justify-between pointer-events-none">
    <MagneticButton strength={0.3} className="pointer-events-auto">
      <Link
        href="/#work"
        className={`flex items-center space-x-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xl border shadow-2xl transition-all ${
          tone === "dark"
            ? "bg-black/50 text-zinc-200 border-white/15 hover:text-white"
            : "bg-white/70 text-zinc-800 border-black/10 hover:text-black"
        }`}
      >
        <ArrowLeft className="h-4 w-4" style={{ color: accent }} />
        <span>Portfolio</span>
      </Link>
    </MagneticButton>
    <div className="pointer-events-auto flex items-center gap-3">
      <div
        className="hidden sm:flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold backdrop-blur-xl border"
        style={{ color: accent, borderColor: `${accent}55`, background: "rgba(0,0,0,0.35)" }}
      >
        {label}
      </div>
      {right}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scroll progress bar (top of page)                                   */
/* ------------------------------------------------------------------ */
export const ScrollProgress: React.FC<{ color: string }> = ({ color }) => {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
      <div ref={bar} className="h-full w-full origin-left scale-x-0" style={{ background: color }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Reveal: fade/slide up when entering the viewport                    */
/* ------------------------------------------------------------------ */
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
  delay?: number;
  stagger?: number;
  /** animate direct children one after another */
  each?: boolean;
}> = ({ children, className = "", y = 50, x = 0, delay = 0, stagger = 0.12, each = false }) => {
  const ref = useGsap((root) => {
    const targets = each ? Array.from(root.children) : root;
    gsap.fromTo(
      targets,
      { y, x, opacity: 0 },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration: 1.1,
        delay,
        stagger: each ? stagger : 0,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      }
    );
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ClipImage: curtain/clip-path reveal with inner parallax             */
/* ------------------------------------------------------------------ */
export const ClipImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  from?: "bottom" | "left" | "right" | "top" | "circle";
  parallax?: number;
  scrub?: boolean;
  children?: React.ReactNode;
}> = ({ src, alt, className = "", imgClassName = "", from = "bottom", parallax = 12, scrub = false, children }) => {
  const ref = useGsap((root) => {
    const img = root.querySelector("img");
    const starts: Record<string, string> = {
      bottom: "inset(100% 0% 0% 0%)",
      top: "inset(0% 0% 100% 0%)",
      left: "inset(0% 100% 0% 0%)",
      right: "inset(0% 0% 0% 100%)",
      circle: "circle(0% at 50% 50%)",
    };
    const end = from === "circle" ? "circle(75% at 50% 50%)" : "inset(0% 0% 0% 0%)";
    gsap.fromTo(
      root,
      { clipPath: starts[from] },
      {
        clipPath: end,
        duration: 1.5,
        ease: "expo.inOut",
        scrollTrigger: scrub
          ? { trigger: root, start: "top 90%", end: "top 30%", scrub: 0.6 }
          : { trigger: root, start: "top 88%", once: true },
      }
    );
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.35, yPercent: -parallax },
        {
          scale: 1.1,
          yPercent: parallax,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }
  }, []);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <Img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`} />
      {children}
    </div>
  );
};

/** Unsplash image with a graceful gradient fallback if the photo fails to load. */
export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }> = ({
  src,
  alt,
  className = "",
  style,
  ...rest
}) => {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{ ...style, background: "linear-gradient(135deg,#27272a,#09090b 60%,#3f3f46)" }}
      />
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={className} style={style} onError={() => setFailed(true)} {...rest} />
  );
};

/** Unsplash URL helper */
export const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ------------------------------------------------------------------ */
/* ScrubWords: words light up as you scroll                            */
/* ------------------------------------------------------------------ */
export const ScrubWords: React.FC<{ text: string; className?: string; dim?: number }> = ({
  text,
  className = "",
  dim = 0.14,
}) => {
  const ref = useGsap((root) => {
    gsap.fromTo(
      root.querySelectorAll(".sw"),
      { opacity: dim },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 45%", scrub: true },
      }
    );
  }, []);
  return (
    <div ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="sw inline-block mr-[0.28em]" style={{ opacity: dim }}>
          {w}
        </span>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Headline: mask-up line reveal (split by "|")                        */
/* ------------------------------------------------------------------ */
export const Headline: React.FC<{
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  onLoad?: boolean;
}> = ({ lines, className = "", lineClassName = "", delay = 0, onLoad = false }) => {
  const ref = useGsap((root) => {
    gsap.fromTo(
      root.querySelectorAll(".hl"),
      { yPercent: 115, rotate: 4 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.3,
        delay,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: onLoad ? undefined : { trigger: root, start: "top 85%", once: true },
      }
    );
  }, []);
  return (
    <h2 ref={ref as unknown as React.RefObject<HTMLHeadingElement>} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span className={`hl block origin-left ${lineClassName}`}>{l}</span>
        </span>
      ))}
    </h2>
  );
};

/* ------------------------------------------------------------------ */
/* Marquee: infinite ticker, accelerates with scroll velocity          */
/* ------------------------------------------------------------------ */
export const Marquee: React.FC<{
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  reverse?: boolean;
  speed?: number;
}> = ({ items, className = "", itemClassName = "", reverse = false, speed = 60 }) => {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!track.current || prefersReduced()) return;
    const el = track.current;
    let x = 0;
    let boost = 0;
    const dir = reverse ? 1 : -1;
    const tick = (_: number, dt: number) => {
      const half = el.scrollWidth / 2;
      x += dir * (speed + boost) * (dt / 1000);
      boost *= 0.92;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    const onScroll = (() => {
      let last = window.scrollY;
      return () => {
        boost = Math.min(900, boost + Math.abs(window.scrollY - last) * 6);
        last = window.scrollY;
      };
    })();
    window.addEventListener("scroll", onScroll, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, [reverse, speed]);
  const row = items.map((it, i) => (
    <span key={i} className={`shrink-0 ${itemClassName}`}>
      {it}
    </span>
  ));
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {row}
        {row}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* HScroll: vertical scroll drives a pinned horizontal track           */
/* ------------------------------------------------------------------ */
export const HScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  onProgress?: (p: number) => void;
}> = ({ children, className = "", trackClassName = "", onProgress }) => {
  const ref = useGsap((root) => {
    const track = root.querySelector<HTMLElement>(".hs-track");
    if (!track) return;
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: root,
        pin: true,
        scrub: 0.7,
        start: "top top",
        end: () => `+=${dist()}`,
        invalidateOnRefresh: true,
        onUpdate: (s) => onProgress?.(s.progress),
      },
    });
  }, []);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div className={`hs-track flex h-full w-max items-center will-change-transform ${trackClassName}`}>{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Tilt: 3D mouse-follow card with moving glare                        */
/* ------------------------------------------------------------------ */
export const Tilt: React.FC<{
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}> = ({ children, className = "", max = 10, glare = true }) => {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * max * 2}deg) rotateX(${(0.5 - py) * max * 2}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.16), transparent 55%)" }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CountUp: number ticks up when scrolled into view                    */
/* ------------------------------------------------------------------ */
export const CountUp: React.FC<{
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}> = ({ to, prefix = "", suffix = "", decimals = 0, className = "" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(prefersReduced() ? to : 0);
  useEffect(() => {
    if (!ref.current || prefersReduced()) {
      setVal(to);
      return;
    }
    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, { v: to, duration: 2, ease: "power3.out", onUpdate: () => setVal(obj.v) }),
    });
    return () => st.kill();
  }, [to]);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Spotlight: radial light that follows the cursor inside a section    */
/* ------------------------------------------------------------------ */
export const Spotlight: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({
  children,
  className = "",
  color = "rgba(255,255,255,0.08)",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r || !ref.current) return;
        ref.current.style.setProperty("--sx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: `radial-gradient(500px circle at var(--sx,50%) var(--sy,30%), ${color}, transparent 60%)` }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section header helper                                               */
/* ------------------------------------------------------------------ */
export const Eyebrow: React.FC<{ n?: string; children: React.ReactNode; color: string }> = ({ n, children, color }) => (
  <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color }}>
    {n && <span className="font-mono opacity-60">{n}</span>}
    <span className="h-px w-8" style={{ background: color }} />
    <span>{children}</span>
  </div>
);
