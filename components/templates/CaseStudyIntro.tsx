import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ExternalLink } from "lucide-react";
import type { VerticalTemplate } from "@/lib/data";

interface CaseStudyIntroProps {
  template: VerticalTemplate;
}

export function CaseStudyIntro({ template }: CaseStudyIntroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0B] px-6 py-24 text-white sm:px-10 lg:px-16">
      <Image
        src={template.heroImage}
        alt={`${template.name} concept preview`}
        fill
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0A0A0B]/90 to-[#0A0A0B]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-12rem)] max-w-7xl flex-col justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-300 backdrop-blur transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Work
          </Link>
          <span className="rounded-full border border-accent-gold/30 bg-accent-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-gold">
            {template.status} / {template.projectType}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-gold">
              {template.number} / {template.vertical}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {template.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-zinc-300">
              {template.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {template.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-zinc-300"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-3 border-b border-white/10 pb-5">
              {template.metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="font-display text-sm font-bold text-white">{metric.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {[
                ["Problem", template.caseStudy.problem],
                ["Solution", template.caseStudy.solution],
                ["Direction", template.caseStudy.designDirection],
                ["Next", template.caseStudy.nextStep],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">
                    {label}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-300">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
              {template.techStack.map((tech) => (
                <span key={tech} className="rounded bg-white/10 px-2 py-1 text-[10px] text-zinc-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-zinc-400">
          <span>This is a concept project. Replace copy, assets, metrics, and integrations when client work becomes real.</span>
          <a href="#live-demo" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-accent-gold">
            Preview Demo
            {template.liveUrl ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          </a>
        </div>
      </div>
    </section>
  );
}
