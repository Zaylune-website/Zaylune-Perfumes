import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Droplet, Leaf, Clock, HeartHandshake, Sparkles } from "lucide-react";

const POINTS = [
  {
    icon: Droplet,
    title: "Long-Lasting Scent",
    short: "Our extrait-grade oils stay with you from morning to night — no reapplication needed.",
  },
  {
    icon: Leaf,
    title: "100% Alcohol-Free",
    short: "Pure attar oil, safe for all skin types including sensitive skin. No harsh chemicals.",
  },
  {
    icon: Clock,
    title: "Small-Batch Craft",
    short: "Every bottle is filled and checked by hand. Quality over quantity, always.",
  },
  {
    icon: HeartHandshake,
    title: "Clean & Ethical",
    short: "Never tested on animals. Made from clean, skin-safe ingredients you can trust.",
  },
];

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden border-y border-[#a8451a]/20 bg-gradient-to-b from-[#fde3cf] via-[#fff5ec] to-[#fde3cf] py-16 sm:py-24 lg:py-28">
      {/* Ambient luminous luxury orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-8%] top-[10%] h-[480px] w-[500px] rounded-full bg-[#c04a1c]/[0.07] blur-[150px]" />
        <div className="absolute left-[-6%] bottom-0 h-[460px] w-[480px] rounded-full bg-[#cfa14b]/[0.08] blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-white/[0.3] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <Reveal className="mx-auto mb-12 sm:mb-16 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/75 px-4 py-1.5 shadow-sm backdrop-blur-sm mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
              The Zaylune Difference
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#1c1109] leading-tight">
            Why{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              Choose Us
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
            Rooted in artisanal perfumery traditions, formulated with pure extrait concentration for lasting sillage and skin-safe luxury.
          </p>
        </Reveal>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 100}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] border border-[#a8451a]/20 bg-white/75 backdrop-blur-md p-7 sm:p-8 text-center shadow-[0_12px_32px_rgba(43,29,18,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#a8451a]/45 hover:bg-white/95 hover:shadow-[0_22px_45px_rgba(168,69,26,0.18)]">
                {/* Top shimmer sweep hairline on hover */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#c04a1c] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Subtle radial glow on hover */}
                <div className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(192,74,28,0.12),transparent_70%)]" />

                {/* Index Watermark */}
                <span className="absolute top-4 right-4 select-none font-display text-xs font-bold tracking-widest text-[#a8451a]/40 uppercase transition-colors duration-300 group-hover:text-[#a8451a]">
                  0{i + 1}
                </span>

                {/* Icon Medallion */}
                <div className="relative mx-auto mb-6 flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center">
                  {/* Subtle rotating glow on hover */}
                  <div
                    className="absolute -inset-2 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
                    style={{
                      animationDuration: "8s",
                      background: "conic-gradient(from 0deg, transparent 0%, rgba(192,74,28,0.4) 25%, transparent 50%)",
                    }}
                  />
                  <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-gradient-to-br from-[#fff7ef] via-white to-[#fde5ce] text-[#a8451a] shadow-[0_8px_20px_rgba(168,69,26,0.14)] transition-all duration-500 group-hover:scale-110 group-hover:border-[#a8451a] group-hover:shadow-[0_12px_30px_rgba(168,69,26,0.28)]">
                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/30 to-white/70" />
                    <point.icon className="relative z-10 h-7 w-7 text-[#a8451a] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.75} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="relative mb-2.5 font-display text-xl sm:text-2xl font-medium text-[#1c1109] transition-colors duration-300 group-hover:text-[#8e3510]">
                  {point.title}
                </h3>

                {/* Jewel Divider */}
                <div className="relative mx-auto mb-3.5 flex items-center justify-center gap-2">
                  <span className="h-px w-6 bg-[#a8451a]/25" />
                  <span className="h-1.5 w-1.5 rotate-45 bg-[#cfa14b]" />
                  <span className="h-px w-6 bg-[#a8451a]/25" />
                </div>

                {/* Description */}
                <p className="relative text-sm sm:text-base font-normal leading-relaxed text-[#2b1d12]/80">
                  {point.short}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA with Flourish */}
        <Reveal delay={200} className="mt-12 sm:mt-16 flex items-center justify-center gap-4 sm:gap-6">
          <span className="hidden items-center gap-3 sm:flex">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#a8451a]/40 lg:w-20" />
            <span className="h-1.5 w-1.5 rotate-45 border border-[#a8451a]/60" />
          </span>
          <Link
            href="/shop"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-9 py-4 font-display text-sm font-semibold tracking-wide text-white shadow-xl shadow-[#a8451a]/25 transition-all duration-300 hover:shadow-2xl hover:shadow-[#a8451a]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="relative z-10">Shop the Collection</span>
          </Link>
          <span className="hidden items-center gap-3 sm:flex">
            <span className="h-1.5 w-1.5 rotate-45 border border-[#a8451a]/60" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#a8451a]/40 lg:w-20" />
          </span>
        </Reveal>
      </div>
    </section>
  );
}
