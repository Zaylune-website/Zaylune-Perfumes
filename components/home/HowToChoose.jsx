"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";
import { Sun, Moon, Sparkles, ChevronDown, Check, Compass, ShieldCheck } from "lucide-react";

const DEFAULT_SUBTITLE =
  "Every scent tells a story. Let us help you find the one that is truly yours.";

export default function HowToChoose({
  subtitle = DEFAULT_SUBTITLE,
  image = "/find_perfect.png",
  showImage = true,
  option1Title = "For Every Day",
  option1Desc = "Light and fresh scents that you can wear from morning to evening. Very easy to wear and love.",
  option2Title = "For Special Occasions",
  option2Desc = "Rich and strong scents that make you stand out. A perfume that people will remember even after you leave.",
  option3Title = "Universal",
  option3Desc = "Balanced scents that smell great in any season, any mood, and suit almost everyone.",
  unsureTitle = "Not Sure Yet?",
  unsureText = "Order a sample set, try it on your skin, and discover your signature scent with Zaylune.",
  unsureButton = "Order Now",
}) {
  const [activeIndex, setActiveIndex] = useState(1);

  const OPTIONS = [
    {
      title: option1Title,
      description: option1Desc,
      icon: Sun,
    },
    {
      title: option2Title,
      description: option2Desc,
      icon: Moon,
    },
    {
      title: option3Title,
      description: option3Desc,
      icon: Sparkles,
    },
  ];

  return (
    <section
      id="how-to-choose"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fff7ef] to-[#fde3cf] py-16 sm:py-24"
    >
      {/* Ambient luminous luxury orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-1/4 h-[420px] w-[450px] rounded-full bg-[#c04a1c]/[0.06] blur-[140px]" />
        <div className="absolute right-[8%] bottom-1/4 h-[450px] w-[480px] rounded-full bg-[#a8451a]/[0.07] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <Reveal className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/75 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
              Scent Concierge Guide
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
          </div>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
            Find the{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              Perfect Scent
            </span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-xl text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
            {subtitle || DEFAULT_SUBTITLE}
          </p>
        </Reveal>

        {/* 3-Column Interactive Luxury Layout */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:items-center lg:gap-8 xl:gap-10">
          {/* Left Column: Cathedral Arch Portal */}
          {showImage && (
            <div className="lg:col-span-4 flex justify-center">
              <Reveal className="group relative aspect-[3/4] w-full max-w-[270px] sm:max-w-[310px] overflow-hidden rounded-t-[140px] rounded-b-3xl border-2 border-[#a8451a]/30 bg-gradient-to-br from-[#fff7ef] to-[#fde5ce] shadow-[0_20px_50px_rgba(43,29,18,0.14)] transition-all duration-500 hover:border-[#a8451a]/60 hover:shadow-[0_25px_65px_rgba(168,69,26,0.25)]">
                {/* Slow radiating glow behind portal */}
                <div className="pointer-events-none absolute -inset-2 rounded-t-[140px] rounded-b-3xl bg-[#c04a1c]/10 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {image ? (
                  <Image
                    src={image}
                    alt="Zaylune Fragrance"
                    fill
                    sizes="(max-width: 1024px) 80vw, 30vw"
                    className="object-cover scale-100 transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#fff7ef] to-[#fde2cb]">
                    <BottleGlyph className="h-24 w-auto text-[#a8451a]/40 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                )}

                {/* Inner Wire Cathedral Outline */}
                <div className="pointer-events-none absolute inset-3 z-20 rounded-t-[130px] rounded-b-2xl border border-white/40" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                {/* Floating Bottom Seal */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-4 py-1.5 shadow-md backdrop-blur-md">
                  <Compass className="h-3.5 w-3.5 text-[#c04a1c]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#a8451a]">
                    Artisan Craft
                  </span>
                </div>
              </Reveal>
            </div>
          )}

          {/* Center Column: Interactive Scent Profiles */}
          <div className={showImage ? "lg:col-span-5" : "lg:col-span-8"}>
            <Reveal className="space-y-3.5">
              {OPTIONS.map((option, i) => {
                const isActive = activeIndex === i;
                const Icon = option.icon;
                return (
                  <div
                    key={option.title}
                    onClick={() => setActiveIndex(i)}
                    className={`group/opt relative block w-full cursor-pointer rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 ${
                      isActive
                        ? "border-2 border-[#a8451a] bg-gradient-to-br from-white via-[#fffaf4] to-[#fde9d7] shadow-[0_16px_40px_-12px_rgba(168,69,26,0.22)] scale-[1.015]"
                        : "border-[#a8451a]/20 bg-white/70 hover:border-[#a8451a]/40 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      {/* Icon Pill */}
                      <span
                        className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "bg-accent-gradient text-white shadow-md scale-105"
                            : "border border-[#a8451a]/20 bg-[#fff5eb] text-[#a8451a] group-hover/opt:bg-[#a8451a] group-hover/opt:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`font-display text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 ${
                              isActive ? "text-[#1c1109]" : "text-[#2b1d12]/80 group-hover/opt:text-[#a8451a]"
                            }`}
                          >
                            {option.title}
                          </h3>

                          {/* Active Checkmark Pill */}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#a8451a] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs animate-fadeIn">
                              <Check className="h-2.5 w-2.5" />
                              Selected
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {isActive && (
                          <p className="mt-3 text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed font-normal animate-fadeIn">
                            {option.description}
                          </p>
                        )}
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                          isActive ? "rotate-180 text-[#a8451a]" : "text-[#a8451a]/40"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </Reveal>
          </div>

          {/* Right Column: Architectural Concierge Card */}
          <div className={`flex justify-center lg:justify-end ${showImage ? "lg:col-span-3" : "lg:col-span-4"}`}>
            <Reveal delay={120} className="w-full max-w-[340px] sm:max-w-[320px]">
              <div className="relative overflow-hidden rounded-t-[80px] sm:rounded-t-[120px] rounded-b-3xl border-2 border-[#a8451a]/25 bg-gradient-to-b from-[#fffaf4] via-[#fef3e7] to-[#fde5cd] px-6 py-7 sm:px-7 sm:py-9 text-center shadow-[0_20px_50px_rgba(43,29,18,0.12)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#a8451a]/40 hover:shadow-[0_25px_60px_rgba(168,69,26,0.2)]">
                {/* Decorative Halo Arch Wires */}
                <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full border border-[#a8451a]/20" />
                <div className="pointer-events-none absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full bg-[#c04a1c]/10 blur-xl" />

                <span className="relative mx-auto flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 aspect-square items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-md">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>

                <h4 className="relative mt-4 font-display text-xl sm:text-2xl font-bold text-[#1c1109]">
                  {unsureTitle}
                </h4>

                <p className="relative mt-3 text-sm sm:text-base leading-relaxed text-[#2b1d12]/85 font-normal">
                  {unsureText}
                </p>

                <div className="relative mt-3.5 sm:mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#a8451a] uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>100% Risk-Free Trial</span>
                </div>

                <Link
                  href="/shop"
                  className="btn-gold relative mt-5 block w-full px-5 py-3.5 text-xs font-bold uppercase tracking-[0.2em] shadow-md transition-transform duration-300 hover:scale-[1.03]"
                >
                  {unsureButton}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
