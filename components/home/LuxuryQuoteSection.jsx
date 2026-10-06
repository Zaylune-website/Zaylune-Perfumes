import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Sparkles } from "lucide-react";

export default function LuxuryQuoteSection({
  line1 = "Crafted With Care",
  line2 = "Poured With Intention",
  line3 = "Lasts All Day",
  label1 = "Top Notes",
  label2 = "Heart Notes",
  label3 = "Base Notes",
  image = "/luxury_ad_banner.png",
  showImage = true,
}) {
  return (
    <section className="relative w-full overflow-hidden border-y border-[#a8451a]/20 bg-[#fde3cf]">
      <div className="grid min-h-[580px] grid-cols-1 items-stretch lg:min-h-[660px] lg:grid-cols-12">
        {/* Left: Full-bleed Image with Cinematic Glow */}
        {showImage && (
          <div className="relative min-h-[340px] sm:min-h-[420px] lg:col-span-7 lg:min-h-0 overflow-hidden group">
            <Image
              src={image}
              alt="Zaylune Muse"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="scale-100 object-cover object-center transition-transform duration-[1800ms] ease-out group-hover:scale-108"
            />
            {/* Seamless Soft Edge Fade into Right Panel */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fde3cf]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />

            {/* Floating Luxury Stamp on Image */}
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 hidden sm:inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1.5 shadow-lg backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
                Haute Parfumerie
              </span>
            </div>
          </div>
        )}

        {/* Right: Text Content with Architectural Luxury Aesthetics */}
        <div
          className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-[#fde3cf] via-[#fff7ef] to-[#fde3cf] px-6 py-14 text-center sm:px-10 sm:py-18 lg:px-14 lg:py-20 ${
            showImage ? "lg:col-span-5" : "lg:col-span-12"
          }`}
        >
          {/* Ambient radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,74,28,0.08),transparent_70%)]" />

          {/* Centered ornamental halo behind the notes */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="absolute aspect-square w-[min(92vw,460px)] rounded-full bg-[radial-gradient(circle,rgba(207,161,75,0.22),transparent_68%)] blur-md" />
            <div className="absolute aspect-square w-[min(88vw,420px)] rounded-full border border-[#a8451a]/15" />
            <div
              className="absolute aspect-square w-[min(72vw,330px)] rounded-full border border-dashed border-[#cfa14b]/45 animate-spin"
              style={{ animationDuration: "60s" }}
            >
              <span className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#c04a1c] shadow-[0_0_8px_rgba(192,74,28,0.6)]" />
              <span className="absolute -bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#cfa14b]" />
            </div>
            <div className="absolute aspect-square w-[min(56vw,250px)] rounded-full border border-[#a8451a]/20 bg-white/30 backdrop-blur-[2px]" />
          </div>

          <Reveal className="relative z-10 mx-auto flex max-w-lg flex-col items-center">
            {/* Eyebrow Pill Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#a8451a]">
                The Fragrance Journey
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
            </div>

            {/* 3 Stacked Note Quotes with Diamond Dividers */}
            <div className="mt-8 space-y-5 font-display sm:mt-12 sm:space-y-7 w-full">
              {/* Top Notes */}
              <div className="group/quote transition-all duration-300">
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-[#1c1109] transition-transform duration-300 group-hover/quote:scale-105">
                  &ldquo;{line1}&rdquo;
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/20 bg-white/70 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.26em] text-[#a8451a] shadow-xs">
                  {label1}
                </span>
              </div>

              {/* Diamond Jewel Divider 1 */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[#a8451a] shadow-[0_0_6px_rgba(168,69,26,0.5)]" />
                <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />
              </div>

              {/* Heart Notes */}
              <div className="group/quote transition-all duration-300">
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] drop-shadow-[0_2px_12px_rgba(192,74,28,0.15)] transition-transform duration-300 group-hover/quote:scale-105">
                  &ldquo;{line2}&rdquo;
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/25 bg-white/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.26em] text-[#a8451a] shadow-xs">
                  {label2}
                </span>
              </div>

              {/* Diamond Jewel Divider 2 */}
              <div className="flex items-center justify-center gap-3 py-1">
                <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[#a8451a] shadow-[0_0_6px_rgba(168,69,26,0.5)]" />
                <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />
              </div>

              {/* Base Notes */}
              <div className="group/quote transition-all duration-300">
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#d4651f] to-[#e59b58] drop-shadow-[0_2px_15px_rgba(192,74,28,0.25)] transition-transform duration-300 group-hover/quote:scale-105">
                  &ldquo;{line3}&rdquo;
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-accent-gradient px-4 py-1 text-[11px] font-bold uppercase tracking-[0.26em] text-white shadow-xs">
                  {label3}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
