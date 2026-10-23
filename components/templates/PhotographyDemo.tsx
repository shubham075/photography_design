"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, X, Aperture, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PhotoLab } from "@/components/templates/PhotoLab";
import {
  DemoDock,
  ScrollProgress,
  Headline,
  ScrubWords,
  HScroll,
  Reveal,
  Img,
  u,
  useGsap,
  prefersReduced,
} from "@/components/motion/fx";

const W = "#ffffff";

type Shot = { id: string; src: string; cat: "Portrait" | "Landscape" | "Editorial"; title: string; exif: string; tall?: boolean };

const SHOTS: Shot[] = [
  { id: "a", src: u("1509281373149-e957c6296406", 1200), cat: "Landscape", title: "Salt Flats, Dawn", exif: "f/8 · 1/250 · ISO 100 · 35mm", tall: true },
  { id: "b", src: u("1494790108377-be9c29b29330", 1000), cat: "Portrait", title: "Ines, Studio 4", exif: "f/1.8 · 1/160 · ISO 200 · 85mm" },
  { id: "c", src: u("1518709268805-4e9042af9f23", 1200), cat: "Landscape", title: "Fjord Light", exif: "f/11 · 1/60 · ISO 64 · 24mm" },
  { id: "d", src: u("1534447677768-be436bb09401", 1200), cat: "Editorial", title: "Night Run", exif: "f/2 · 1/30 · ISO 3200 · 50mm", tall: true },
  { id: "e", src: u("1500648767791-00dcc994a43e", 1000), cat: "Portrait", title: "Marcus", exif: "f/2.8 · 1/200 · ISO 400 · 105mm", tall: true },
  { id: "f", src: u("1506744038136-46273834b3fb", 1200), cat: "Landscape", title: "Still Water", exif: "f/16 · 2s · ISO 50 · 16mm" },
  { id: "g", src: u("1531746020798-e6953c6e8e04", 1000), cat: "Editorial", title: "Blue Hour", exif: "f/1.4 · 1/125 · ISO 800 · 50mm" },
  { id: "h", src: u("1470071459604-3b5ec3a7fe05", 1200), cat: "Landscape", title: "Mist Valley", exif: "f/5.6 · 1/500 · ISO 100 · 70mm", tall: true },
  { id: "i", src: u("1507003211169-0a1dd7228f2d", 1000), cat: "Portrait", title: "The Architect", exif: "f/2 · 1/250 · ISO 100 · 85mm" },
];

/* --------------- Hero: aperture blades open on scroll --------------- */
const PIVOT = "1100 -300";
const OPEN_ANGLE = -32;

function ApertureHero() {
  const ref = useGsap((root) => {
    const blades = root.querySelectorAll<SVGPathElement>(".blade");
    // Each blade pivots around its own outer corner, sweeping away from the centre – the iris opens.
    const iris = { a: 0 };
    const apply = () => blades.forEach((b) => b.setAttribute("transform", `rotate(${iris.a} ${PIVOT})`));
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "+=130%", scrub: 0.7, pin: true } });
    tl.fromTo(iris, { a: 0 }, { a: OPEN_ANGLE, ease: "power2.inOut", onUpdate: apply }, 0)
      .fromTo(root.querySelector(".lens-img"), { scale: 1.5, filter: "blur(12px)" }, { scale: 1, filter: "blur(0px)", ease: "power2.out" }, 0)
      .to(root.querySelector(".iris"), { scale: 2.5, opacity: 0, ease: "power2.in" }, 0.6)
      .fromTo(root.querySelector(".hero-title"), { opacity: 0, y: 60 }, { opacity: 1, y: 0 }, 0.7);
    // Intro: the iris flickers open a crack on load
    gsap.fromTo(iris, { a: 0 }, { a: 8, duration: 1.6, ease: "expo.out", delay: 0.3, onUpdate: apply });
  }, []);

  const N = 8;
  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#070709]">
      <div className="lens-img absolute inset-0">
        <Img src={u("1519681393784-d120267933ba", 2200)} alt="Mountain under stars" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/25" />
      </div>
      <svg className="iris pointer-events-none absolute left-1/2 top-1/2 h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1000 1000">
        {Array.from({ length: N }).map((_, i) => (
          <g key={i} transform={`rotate(${(360 / N) * i} 500 500)`}>
            <path className="blade" d="M480 520 L1100 380 L1100 -300 L380 -300 Z" fill={i % 2 ? "#0c0c0f" : "#141418"} stroke="#2a2a30" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div className="hero-title absolute inset-x-0 bottom-12 z-10 px-6 sm:px-12 lg:px-20">
        <div className="text-[11px] uppercase tracking-[0.35em] text-zinc-300">Monolith Studio · Fine-art &amp; editorial</div>
        <h1 className="mt-4 font-serif text-[12vw] sm:text-[8vw] leading-[0.9]">
          Capturing the <span className="italic">ineffable.</span>
        </h1>
      </div>
      <div className="absolute left-1/2 top-24 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">Scroll to open the aperture</div>
    </section>
  );
}

/* --------- Viewfinder: crosshair follows cursor, click = shutter ---- */
function Viewfinder({ onShoot }: { onShoot: (s: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const src = u("1472214103451-9374bd1c798e", 2000);

  useEffect(() => {
    if (!frame.current) return;
    const xTo = gsap.quickTo(frame.current, "left", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(frame.current, "top", { duration: 0.5, ease: "power3" });
    const el = box.current;
    const move = (e: MouseEvent) => {
      const r = el!.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      setPos({ x, y });
    };
    el?.addEventListener("mousemove", move);
    return () => el?.removeEventListener("mousemove", move);
  }, []);

  const shoot = () => {
    if (flash.current && !prefersReduced()) gsap.fromTo(flash.current, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: "power2.out" });
    onShoot(`${src}#${pos.x.toFixed(0)}-${pos.y.toFixed(0)}`);
  };

  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <Headline lines={["Look through", "our lens"]} className="font-serif text-5xl sm:text-7xl leading-[0.95]" />
          <p className="max-w-sm text-sm text-zinc-400">Move to frame, click to take the shot. Your frames develop on the contact sheet below.</p>
        </div>
        <div ref={box} onClick={shoot} className="relative mt-12 aspect-[16/9] cursor-none overflow-hidden rounded-2xl" data-cursor="hide">
          <Img src={src} alt="Landscape scene" className="absolute inset-0 h-full w-full scale-105 object-cover blur-[6px] brightness-50" />
          {/* Sharp, focused area inside the frame */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `circle(150px at ${pos.x}% ${pos.y}%)`, WebkitClipPath: `circle(150px at ${pos.x}% ${pos.y}%)` }}
          >
            <Img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div ref={frame} className="pointer-events-none absolute h-[220px] w-[320px] -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
            {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-l-2 border-b-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
              <span key={c} className={`absolute h-6 w-6 border-white ${c}`} />
            ))}
            <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-white/80" />
            <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-white/80" />
            <span className="absolute -bottom-7 left-0 font-mono text-[10px] text-white/80">f/2.8 · 1/500 · ISO 100</span>
            <span className="absolute -top-6 right-0 flex items-center gap-1 font-mono text-[10px] text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />AF-C</span>
          </div>
          <div ref={flash} className="pointer-events-none absolute inset-0 bg-white opacity-0" />
        </div>
      </div>
    </section>
  );
}

/* ------------------- Exposure triangle playground ------------------- */
function ExposureLab() {
  const [ap, setAp] = useState(4); // index into stops
  const [sh, setSh] = useState(4);
  const [iso, setIso] = useState(1);
  const APS = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16"];
  const SHS = ["1/2000", "1/1000", "1/500", "1/250", "1/125", "1/60", "1/30", "1/8"];
  const ISOS = ["100", "200", "400", "800", "1600", "3200", "6400"];
  // Brighter with wider aperture (lower index), slower shutter (higher index), higher ISO
  const ev = (4 - ap) + (sh - 4) + iso;
  const brightness = Math.max(0.25, Math.min(2.2, 1 + ev * 0.18));
  const bgBlur = Math.max(0, (7 - ap) * 1.2); // shallow DoF blurs the background
  const motion = Math.max(0, sh - 4) * 3;
  const grain = iso / 6;
  return (
    <section className="bg-[#0d0d10] px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Img src={u("1441974231531-c6227db76b6e", 1600)} alt="Forest" className="absolute inset-0 h-full w-full object-cover transition-all duration-300" style={{ filter: `brightness(${brightness}) blur(${bgBlur}px)`, transform: `translateX(${motion / 3}px)` }} />
          <div className="absolute inset-[22%] overflow-hidden rounded-xl ring-1 ring-white/20">
            <Img src={u("1441974231531-c6227db76b6e", 1600)} alt="" className="absolute inset-[-28%] h-[156%] w-[156%] max-w-none object-cover transition-all duration-300" style={{ filter: `brightness(${brightness}) blur(${motion / 6}px)` }} />
          </div>
          <div className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity" style={{ opacity: grain, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px]">{APS[ap]} · {SHS[sh]} · ISO {ISOS[iso]}</div>
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px]">EV {ev > 0 ? "+" : ""}{ev}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">The exposure triangle</div>
          <h3 className="mt-4 font-serif text-4xl sm:text-5xl">Learn how we <span className="italic">see.</span></h3>
          <p className="mt-4 text-sm text-zinc-400">Drag each control. Aperture shapes depth, shutter freezes or blurs time, ISO trades light for grain.</p>
          {[
            { l: "Aperture", v: ap, set: setAp, arr: APS },
            { l: "Shutter", v: sh, set: setSh, arr: SHS },
            { l: "ISO", v: iso, set: setIso, arr: ISOS },
          ].map((c) => (
            <label key={c.l} className="mt-8 block">
              <div className="flex justify-between font-mono text-xs uppercase text-zinc-400"><span>{c.l}</span><span className="text-white">{c.arr[c.v]}</span></div>
              <input type="range" min={0} max={c.arr.length - 1} value={c.v} onChange={(e) => c.set(+e.target.value)} className="mt-3 w-full accent-white" />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------- Film strip horizontal ----------------------- */
function FilmStrip() {
  const frames = SHOTS.slice(0, 7);
  const sprockets = (
    <div className="flex gap-4 px-3 py-2">
      {Array.from({ length: 60 }).map((_, i) => (
        <span key={i} className="h-3 w-5 shrink-0 rounded-[3px] bg-[#070709]" />
      ))}
    </div>
  );
  return (
    <HScroll className="h-screen bg-[#070709]" trackClassName="pl-[8vw] pr-[8vw]">
      <div className="mr-16 w-[70vw] sm:w-[32vw] shrink-0">
        <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Roll 027 — Kodak Portra 400</div>
        <h3 className="mt-4 font-serif text-5xl sm:text-7xl leading-[0.95]">Shot on <span className="italic">film.</span></h3>
        <p className="mt-6 max-w-sm text-sm text-zinc-400">Every commission includes a hand-developed medium-format roll. Scroll to advance the strip.</p>
      </div>
      <div className="shrink-0 -rotate-2 bg-[#1b1408] shadow-2xl">
        <div className="overflow-hidden">{sprockets}</div>
        <div className="flex gap-3 px-3">
          {frames.map((f, i) => (
            <div key={f.id} className="relative h-[46vh] w-[62vh] shrink-0 overflow-hidden">
              <Img src={f.src} alt={f.title} className="h-full w-full object-cover sepia-[.35] saturate-[1.2] contrast-[1.05]" />
              <span className="absolute bottom-1 right-2 font-mono text-[10px] text-orange-300/80">{String(i + 1).padStart(2, "0")}A ▸</span>
            </div>
          ))}
        </div>
        <div className="overflow-hidden">{sprockets}</div>
      </div>
    </HScroll>
  );
}

/* ============================ Page ================================ */
export const PhotographyDemo: React.FC = () => {
  const [filter, setFilter] = useState<"All" | Shot["cat"]>("All");
  const [light, setLight] = useState<Shot | null>(null);
  const [sheet, setSheet] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const shots = SHOTS.filter((s) => filter === "All" || s.cat === filter);

  useEffect(() => {
    if (!gridRef.current || prefersReduced()) return;
    gsap.fromTo(gridRef.current.children, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.7, ease: "power3.out" });
  }, [filter]);

  // Focus-pull: images sharpen as they reach the centre of the viewport
  const focusRef = useGsap((root) => {
    gsap.utils.toArray<HTMLElement>(".focus-pull", root).forEach((el) => {
      gsap.fromTo(el, { filter: "blur(14px) grayscale(1)", scale: 1.08 }, {
        filter: "blur(0px) grayscale(0)", scale: 1, ease: "none",
        scrollTrigger: { trigger: el, start: "top 95%", end: "center 55%", scrub: true },
      });
    });
  }, []);

  return (
    <div className="relative w-full bg-[#070709] text-white selection:bg-white selection:text-black">
      <ScrollProgress color={W} />
      <DemoDock
        label="Monolith Studio"
        accent={W}
        right={
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
            <Camera className="h-3.5 w-3.5" /> {sheet.length} frames
          </span>
        }
      />
      <ApertureHero />

      <section className="px-6 py-32 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <ScrubWords
            className="font-serif text-3xl sm:text-5xl leading-[1.25]"
            text="We wait for the light most people walk past. Twelve years, forty countries, and one rule: never shoot what we cannot feel first."
          />
        </div>
      </section>

      {/* Focus-pull diptych */}
      <section ref={focusRef} className="px-6 pb-28 sm:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="focus-pull aspect-[4/5] md:aspect-auto md:h-[85vh] overflow-hidden rounded-2xl"><Img src={u("1500530855697-b586d89ba3ee", 1600)} alt="Valley" className="h-full w-full object-cover" /></div>
          <div className="flex flex-col gap-6">
            <div className="focus-pull aspect-square overflow-hidden rounded-2xl"><Img src={u("1494790108377-be9c29b29330", 1000)} alt="Portrait" className="h-full w-full object-cover" /></div>
            <div className="rounded-2xl border border-white/10 p-6">
              <Aperture className="h-6 w-6" />
              <div className="mt-4 font-serif text-2xl">Focus pull</div>
              <p className="mt-2 text-sm text-zinc-400">Images rack into focus as they reach the centre of your screen — like a lens finding its subject.</p>
            </div>
          </div>
        </div>
      </section>

      <Viewfinder onShoot={(s) => setSheet((x) => [s, ...x].slice(0, 12))} />

      {/* Contact sheet */}
      <section className="px-6 pb-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#111114] p-6">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            <span>Contact sheet — your frames</span>
            {sheet.length > 0 && <button onClick={() => setSheet([])} className="hover:text-white">Clear</button>}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => {
              const s = sheet[i];
              const [src, xy] = s ? s.split("#") : [];
              const [x, y] = xy ? xy.split("-") : ["50", "50"];
              return (
                <div key={i} className="relative aspect-[3/2] overflow-hidden rounded border border-white/10 bg-black">
                  {s ? (
                    <div className="h-full w-full animate-[develop_1.6s_ease-out]" style={{ backgroundImage: `url(${src})`, backgroundSize: "500%", backgroundPosition: `${x}% ${y}%` }} />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-zinc-700">{String(i + 1).padStart(2, "0")}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <style>{`@keyframes develop{0%{filter:brightness(3) sepia(1);opacity:0}60%{filter:brightness(1.4) sepia(.6);opacity:1}100%{filter:none}}`}</style>
      </section>

      <FilmStrip />

      {/* Portfolio grid with filters + lightbox */}
      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <Headline lines={["Selected", "works"]} className="font-serif text-5xl sm:text-7xl leading-[0.95]" />
            <div className="flex flex-wrap gap-2">
              {(["All", "Portrait", "Landscape", "Editorial"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${filter === f ? "bg-white text-black border-white" : "border-white/15 text-zinc-400 hover:text-white"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div ref={gridRef} className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {shots.map((s) => (
              <button key={s.id} onClick={() => setLight(s)} className="group relative block w-full overflow-hidden rounded-xl break-inside-avoid" data-cursor="action" data-cursor-text="View">
                <Img src={s.src} alt={s.title} className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${s.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`} />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 text-left opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="font-serif text-xl">{s.title}</div>
                  <div className="font-mono text-[10px] text-zinc-400">{s.exif}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <PhotoLab />

      {/* Commission CTA */}
      <section className="relative overflow-hidden border-t border-white/10 px-6 py-32 sm:px-12 lg:px-20">
        <Reveal className="mx-auto max-w-4xl text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Now booking Spring 2027</div>
          <h3 className="mt-6 font-serif text-5xl sm:text-8xl leading-[0.95]">Let&apos;s make <span className="italic">something still.</span></h3>
          <MagneticButton strength={0.4} className="mt-12">
            <a href="mailto:studio@example.com" className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-black">
              Start a commission <ArrowRight className="h-4 w-4" />
            </a>
          </MagneticButton>
        </Reveal>
      </section>

      {/* Lightbox */}
      <div className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-6 transition-opacity duration-500 ${light ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setLight(null)}>
        {light && (
          <div className="relative max-h-full w-full max-w-5xl animate-[zoomIn_.5s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <Img src={light.src.replace("w=1200", "w=2000").replace("w=1000", "w=2000")} alt={light.title} className="max-h-[80vh] w-full rounded-lg object-contain" />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-serif text-2xl">{light.title}</div>
                <div className="font-mono text-xs text-zinc-500">{light.exif}</div>
              </div>
              <button onClick={() => setLight(null)} aria-label="Close" className="rounded-full border border-white/20 p-2"><X className="h-4 w-4" /></button>
            </div>
          </div>
        )}
        <style>{`@keyframes zoomIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}`}</style>
      </div>
    </div>
  );
};
