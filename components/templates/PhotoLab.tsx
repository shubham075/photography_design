"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, FlipHorizontal, Sun, Moon, Sunrise } from "lucide-react";
import { Headline, Reveal, Img, u } from "@/components/motion/fx";

/* Extra interactive sections for photography lovers. Same visual language as PhotographyDemo. */

const pill = (on: boolean) =>
  `rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${on ? "bg-white text-black border-white" : "border-white/15 text-zinc-400 hover:text-white"}`;

/* ------------- Darkroom: RAW vs film-stock before/after ------------- */
const STOCKS = [
  { id: "portra", name: "Portra 400", note: "Warm skin, soft pastels", filter: "contrast(1.05) saturate(1.15) sepia(.18) hue-rotate(-6deg) brightness(1.05)" },
  { id: "trix", name: "Tri-X 400", note: "Punchy black & white", filter: "grayscale(1) contrast(1.35) brightness(.95)" },
  { id: "cinestill", name: "CineStill 800T", note: "Tungsten teal, red halation", filter: "contrast(1.1) saturate(1.2) hue-rotate(-14deg) brightness(.95)" },
  { id: "velvia", name: "Velvia 50", note: "Saturated landscape slide", filter: "contrast(1.2) saturate(1.65) brightness(.98)" },
  { id: "ektar", name: "Ektar 100", note: "Vivid, fine grain", filter: "contrast(1.12) saturate(1.35) sepia(.08)" },
];
const RAW = "contrast(.78) saturate(.6) brightness(1.08)";

function Darkroom() {
  const [stock, setStock] = useState(STOCKS[0]);
  const [split, setSplit] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const src = u("1506744038136-46273834b3fb", 1800);

  const drag = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setSplit(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <Headline lines={["Inside the", "darkroom"]} className="font-serif text-5xl sm:text-7xl leading-[0.95]" />
          <p className="max-w-sm text-sm text-zinc-400">Drag the divider to compare the flat RAW negative against our hand-tuned film emulations.</p>
        </div>
        <div
          ref={box}
          className="relative mt-12 aspect-[16/9] cursor-ew-resize select-none overflow-hidden rounded-2xl touch-none"
          onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); drag(e.clientX); }}
          onPointerMove={(e) => e.buttons && drag(e.clientX)}
          data-cursor="action"
          data-cursor-text="Drag"
        >
          <Img src={src} alt="Lake at dusk, graded" draggable={false} className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-500" style={{ filter: stock.filter }} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
            <Img src={src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ filter: RAW }} />
          </div>
          {stock.id === "cinestill" && <div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: "radial-gradient(circle at 70% 35%, rgba(255,60,40,.25), transparent 40%)", clipPath: `inset(0 0 0 ${split}%)` }} />}
          <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${split}%` }}>
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-black/60 font-mono text-[10px]">⇆</span>
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px]">RAW · ARW 14-bit</span>
          <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px]">{stock.name}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {STOCKS.map((s) => (
            <button key={s.id} onClick={() => setStock(s)} className={pill(stock.id === s.id)}>{s.name}</button>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-zinc-500">{stock.note}</p>
      </div>
    </section>
  );
}

/* ----------------- Composition guides overlay -------------------- */
type Guide = "thirds" | "phi" | "spiral" | "diagonal";
const GUIDES: { id: Guide; label: string; tip: string }[] = [
  { id: "thirds", label: "Rule of thirds", tip: "Place the horizon on a line, the subject on an intersection." },
  { id: "phi", label: "Phi grid", tip: "The golden ratio (1 : 0.618) pulls lines closer to the centre for calmer balance." },
  { id: "spiral", label: "Golden spiral", tip: "Let the eye travel along the curve and rest where it tightens." },
  { id: "diagonal", label: "Diagonals", tip: "Baroque diagonals add energy; align leading lines with them." },
];
// Fibonacci spiral inside a 1000×618 golden rectangle
const SPIRAL =
  "M0 618 A618 618 0 0 1 618 0 A382 382 0 0 1 1000 382 A236 236 0 0 1 764 618 A146 146 0 0 1 618 472 A90 90 0 0 1 708 382 A56 56 0 0 1 764 438";
const SPIRAL_BOXES = "M618 0 V618 M618 382 H1000 M764 382 V618 M618 472 H764 M708 382 V472 M708 438 H764";

function CompositionGuides() {
  const [guide, setGuide] = useState<Guide>("spiral");
  const [flip, setFlip] = useState(false);
  const active = GUIDES.find((g) => g.id === guide)!;
  const line = { stroke: "rgba(255,255,255,.85)", strokeWidth: 2, fill: "none", vectorEffect: "non-scaling-stroke" as const };

  return (
    <section className="bg-[#0d0d10] px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Composition school</div>
          <h3 className="mt-4 font-serif text-4xl sm:text-5xl">Why it <span className="italic">feels</span> right.</h3>
          <p className="mt-4 text-sm text-zinc-400">Overlay the grids we compose with in-camera. Toggle each one to see how the frame was built.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {GUIDES.map((g) => (
              <button key={g.id} onClick={() => setGuide(g.id)} className={pill(guide === g.id)}>{g.label}</button>
            ))}
            {guide === "spiral" && (
              <button onClick={() => setFlip((f) => !f)} aria-label="Flip spiral" className="rounded-full border border-white/15 p-2 text-zinc-400 hover:text-white"><FlipHorizontal className="h-4 w-4" /></button>
            )}
          </div>
          <p className="mt-6 border-l border-white/20 pl-4 text-sm text-zinc-300">{active.tip}</p>
        </div>
        <div className="relative aspect-[1000/618] overflow-hidden rounded-2xl">
          <Img src={u("1470071459604-3b5ec3a7fe05", 1800)} alt="Misty valley" className="absolute inset-0 h-full w-full object-cover" />
          <svg viewBox="0 0 1000 618" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
            {guide === "thirds" && <path d="M333 0V618M667 0V618M0 206H1000M0 412H1000" {...line} />}
            {guide === "phi" && <path d="M382 0V618M618 0V618M0 236H1000M0 382H1000" {...line} />}
            {guide === "spiral" && (
              <>
                <path d={SPIRAL_BOXES} {...line} stroke="rgba(255,255,255,.3)" />
                <path d={SPIRAL} {...line} strokeWidth={2.5} />
              </>
            )}
            {guide === "diagonal" && <path d="M0 0L1000 618M1000 0L0 618M0 0L618 618M1000 0L382 618M0 618L618 0M1000 618L382 0" {...line} />}
          </svg>
          <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px]">{active.label}</span>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Golden hour planner ---------------------- */
const SUNRISE = 6 * 60 + 30;
const SUNSET = 19 * 60 + 30;
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function phaseAt(t: number) {
  if (t < SUNRISE - 40 || t > SUNSET + 40)
    return { name: "Night", icon: Moon, tint: "rgba(10,20,60,.65)", filter: "brightness(.45) saturate(.6)", settings: "f/2.8 · 20s · ISO 3200", tip: "Tripod, wide lens, and the Milky Way core." };
  if (t < SUNRISE || t > SUNSET)
    return { name: "Blue hour", icon: Moon, tint: "rgba(40,80,200,.35)", filter: "brightness(.75) saturate(1.1)", settings: "f/8 · 4s · ISO 100", tip: "Even, cool light — perfect for cityscapes and lit windows." };
  if (t < SUNRISE + 60 || t > SUNSET - 60)
    return { name: "Golden hour", icon: Sunrise, tint: "rgba(255,150,40,.35)", filter: "brightness(1.05) saturate(1.3)", settings: "f/4 · 1/250 · ISO 100", tip: "Long shadows and warm rim light. Shoot into the sun for flare." };
  if (t > 11 * 60 && t < 15 * 60)
    return { name: "Harsh midday", icon: Sun, tint: "rgba(255,255,255,.12)", filter: "brightness(1.2) contrast(1.15) saturate(.9)", settings: "f/11 · 1/1000 · ISO 100", tip: "Seek open shade, or go black & white and embrace hard shadows." };
  return { name: "Daylight", icon: Sun, tint: "rgba(255,230,190,.12)", filter: "brightness(1.08)", settings: "f/8 · 1/500 · ISO 100", tip: "Side light from a low sun adds texture — use a polariser for skies." };
}

function GoldenHourPlanner() {
  const [t, setT] = useState(SUNSET - 30);
  const p = phaseAt(t);
  const Icon = p.icon;
  const prog = (t - SUNRISE) / (SUNSET - SUNRISE);
  const up = prog >= 0 && prog <= 1;
  const sx = 40 + Math.max(0, Math.min(1, prog)) * 920;
  const sy = 190 - Math.sin(Math.PI * Math.max(0, Math.min(1, prog))) * 160;

  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <Headline lines={["Chase the", "light"]} className="font-serif text-5xl sm:text-7xl leading-[0.95]" />
          <p className="max-w-sm text-sm text-zinc-400">Scrub through a day on location. We plan every shoot around the sun — here&apos;s what each hour gives you.</p>
        </div>
        <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-2xl">
          <Img src={u("1472214103451-9374bd1c798e", 1800)} alt="Open landscape" className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-500" style={{ filter: p.filter }} />
          <div className="absolute inset-0 mix-blend-soft-light transition-colors duration-500" style={{ background: p.tint }} />
          <div className="absolute inset-0 transition-colors duration-500" style={{ background: `linear-gradient(to top, transparent 40%, ${p.tint})` }} />
          <svg viewBox="0 0 1000 220" className="absolute inset-x-0 top-6 w-full">
            <path d="M40 190 Q500 -130 960 190" fill="none" stroke="rgba(255,255,255,.3)" strokeDasharray="4 8" />
            {up && <circle cx={sx} cy={sy} r="14" fill="#ffd27a" style={{ filter: "drop-shadow(0 0 18px #ffb347)" }} />}
          </svg>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px]"><Icon className="h-3.5 w-3.5" />{p.name} · {fmt(t)}</div>
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px]">{p.settings}</div>
        </div>
        <input type="range" min={4 * 60} max={22 * 60} step={5} value={t} onChange={(e) => setT(+e.target.value)} className="mt-6 w-full accent-white" aria-label="Time of day" />
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase text-zinc-500">
          <span>04:00</span><span>Sunrise {fmt(SUNRISE)}</span><span>Noon</span><span>Sunset {fmt(SUNSET)}</span><span>22:00</span>
        </div>
        <p className="mt-6 border-l border-white/20 pl-4 text-sm text-zinc-300">{p.tip}</p>
      </div>
    </section>
  );
}

/* ------------------ Palette moodboard (Pinterest-style) ------------------ */
const BOARD = [
  { id: "1519681393784-d120267933ba", h: "aspect-[3/4]", title: "Starfall" },
  { id: "1500530855697-b586d89ba3ee", h: "aspect-[4/3]", title: "Green Valley" },
  { id: "1534447677768-be436bb09401", h: "aspect-[3/4]", title: "Night Run" },
  { id: "1531746020798-e6953c6e8e04", h: "aspect-square", title: "Blue Hour" },
  { id: "1518709268805-4e9042af9f23", h: "aspect-[4/3]", title: "Fjord Light" },
  { id: "1441974231531-c6227db76b6e", h: "aspect-[3/4]", title: "Forest Floor" },
];
const hex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

// Coarse colour quantisation: bucket pixels, average each bucket, keep the most common distinct colours.
function extractPalette(src: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 64, 64);
      const d = ctx.getImageData(0, 0, 64, 64).data;
      const buckets = new Map<number, [number, number, number, number]>();
      for (let i = 0; i < d.length; i += 4) {
        const k = ((d[i] >> 5) << 6) | ((d[i + 1] >> 5) << 3) | (d[i + 2] >> 5);
        const b = buckets.get(k) ?? [0, 0, 0, 0];
        b[0] += d[i]; b[1] += d[i + 1]; b[2] += d[i + 2]; b[3]++;
        buckets.set(k, b);
      }
      const sorted = [...buckets.values()].sort((a, b) => b[3] - a[3]).map(([r, g, b, n]) => [r / n, g / n, b / n] as const);
      const picked: (readonly [number, number, number])[] = [];
      for (const col of sorted) {
        if (picked.every((p) => Math.hypot(p[0] - col[0], p[1] - col[1], p[2] - col[2]) > 48)) picked.push(col);
        if (picked.length === 5) break;
      }
      resolve(picked.map(([r, g, b]) => hex(Math.round(r), Math.round(g), Math.round(b))));
    };
    img.onerror = reject;
    img.src = src;
  });
}

function PaletteBoard() {
  const [sel, setSel] = useState(BOARD[0]);
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setPalette([]);
    extractPalette(u(sel.id, 400)).then((p) => live && setPalette(p)).catch(() => live && setPalette([]));
    return () => { live = false; };
  }, [sel]);

  const copy = async (c: string) => {
    try { await navigator.clipboard.writeText(c); } catch { /* clipboard blocked */ }
    setCopied(c);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <section className="bg-[#0d0d10] px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <Headline lines={["Steal the", "palette"]} className="font-serif text-5xl sm:text-7xl leading-[0.95]" />
          <p className="max-w-sm text-sm text-zinc-400">Pin a frame from the moodboard — we pull its colour story live, ready for your grade, brand or set design.</p>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
            {BOARD.map((b) => (
              <button key={b.id} onClick={() => setSel(b)} className={`group relative block w-full overflow-hidden rounded-xl break-inside-avoid ring-2 transition-all ${sel.id === b.id ? "ring-white" : "ring-transparent opacity-70 hover:opacity-100"}`} data-cursor="action" data-cursor-text="Pin">
                <Img src={u(b.id, 700)} alt={b.title} className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${b.h}`} />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px]">{b.title}</span>
              </button>
            ))}
          </div>
          <Reveal className="self-start rounded-2xl border border-white/10 bg-[#111114] p-6 lg:sticky lg:top-24">
            <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Colour story — {sel.title}</div>
            <div className="mt-4 overflow-hidden rounded-xl"><Img src={u(sel.id, 900)} alt={sel.title} className="aspect-[4/3] w-full object-cover" /></div>
            <div className="mt-4 flex h-20 overflow-hidden rounded-xl">
              {(palette.length ? palette : Array(5).fill("#1a1a1f")).map((c, i) => (
                <button key={i} onClick={() => palette.length && copy(c)} className="group relative flex-1 transition-[flex] duration-300 hover:flex-[1.6]" style={{ background: c }} aria-label={`Copy ${c}`}>
                  {palette.length > 0 && (
                    <span className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-1 font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "#fff", textShadow: "0 1px 3px #000" }}>
                      {copied === c ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{c}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 font-mono text-[10px] text-zinc-500">{palette.length ? palette.join("  ") : "Developing palette…"}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export const PhotoLab: React.FC = () => (
  <>
    <Darkroom />
    <CompositionGuides />
    <GoldenHourPlanner />
    <PaletteBoard />
  </>
);
