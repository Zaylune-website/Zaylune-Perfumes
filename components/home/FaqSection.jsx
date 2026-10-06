"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ChevronDown, Sparkles } from "lucide-react";

const DEFAULT_IMAGE =
  "https://ik.imagekit.io/nc3h4sguy/zaylune/home-sections/Zaylune_Oud_Royale_Perfume_Composition_9eAaqlkUk.png";

export default function FaqSection({
  subtitle = "Everything you need to know before you order from Zaylune.",
  image = DEFAULT_IMAGE,
  showImage = true,
  q1 = "What makes Zaylune different from other perfume brands?",
  a1 = "Zaylune crafts small-batch, extrait-grade attars using pure oils — no alcohol, no dilution. Every bottle is filled by hand in KGF, Karnataka. You get a luxury experience at an honest price.",
  q2 = "How long does one bottle of Zaylune attar last?",
  a2 = "A 10ml bottle typically lasts 2 to 3 months with daily use. Since our attars are concentrated, you only need 2 to 3 drops per application for a full-day scent.",
  q3 = "Do you ship across India?",
  a3 = "Yes! We ship to all cities and towns across India. Orders are packed within 24 hours and delivered in 2 to 5 business days. Free shipping is available on orders above a set amount.",
  q4 = "Are Zaylune attars safe for sensitive skin?",
  a4 = "Absolutely. All our attars are 100% alcohol-free and made with skin-safe pure oils. They are gentle, non-irritating, and suitable for daily use even on sensitive skin.",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  const displayImage = image || DEFAULT_IMAGE;

  const FAQS = [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
    { q: q4, a: a4 },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative overflow-hidden border-y border-[#a8451a]/20 bg-gradient-to-b from-[#fde3cf] via-[#fff5eb] to-[#fde3cf] py-16 sm:py-24 lg:py-28">
      {/* Ambient luminous luxury orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-1/4 h-[460px] w-[480px] rounded-full bg-[#c04a1c]/[0.07] blur-[150px]" />
        <div className="absolute right-[8%] bottom-1/4 h-[480px] w-[500px] rounded-full bg-[#cfa14b]/[0.08] blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-white/[0.25] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <Reveal className="mb-12 sm:mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/75 px-4 py-1.5 shadow-sm backdrop-blur-sm mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
              Good to Know
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#1c1109] leading-tight">
            Questions{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              You Might Have
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
            {subtitle}
          </p>
        </Reveal>

        {/* 2-Column Split: Fragrance Composition on Left, Accordions on Right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Visual Showcase */}
          {showImage && (
            <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-28">
              <div className="group relative aspect-square w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center">
                {/* Luminous Halo Rings */}
                <div className="pointer-events-none absolute inset-4 rounded-full border border-[#a8451a]/15 transition-transform duration-1000 group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-10 rounded-full border border-[#cfa14b]/20 transition-transform duration-1000 group-hover:scale-110" />

                {/* Ambient Warm Backlight */}
                <div className="pointer-events-none absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(207,161,75,0.22)_0%,rgba(168,69,26,0.08)_50%,transparent_72%)] blur-[35px]" />

                {/* Ground Reflection Glow */}
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-[100%] bg-gradient-to-r from-transparent via-[#2b1d12]/20 to-transparent blur-md" />

                {/* Composition Image */}
                <div className="relative z-10 aspect-square w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <Image
                    src={displayImage}
                    alt="Zaylune Perfume Composition"
                    fill
                    sizes="(max-width: 1024px) 85vw, 40vw"
                    className="object-contain drop-shadow-[0_20px_35px_rgba(43,29,18,0.22)]"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Interactive Luxury Accordions */}
          <div className={`${showImage ? "lg:col-span-7" : "lg:col-span-12"} space-y-3.5 sm:space-y-4`}>
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <Reveal key={i} delay={i * 70}>
                  <div
                    className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-400 backdrop-blur-md ${
                      isOpen
                        ? "border-[#a8451a]/45 bg-white/95 shadow-[0_12px_32px_rgba(168,69,26,0.12)]"
                        : "border-[#a8451a]/15 bg-white/75 hover:border-[#a8451a]/35 hover:bg-white/90 shadow-xs"
                    }`}
                  >
                    {/* Active Left Vertical Accent Bar */}
                    <span
                      className={`pointer-events-none absolute left-0 top-0 bottom-0 w-1 transition-all duration-400 ${
                        isOpen
                          ? "bg-gradient-to-b from-[#8e3510] via-[#a8451a] to-[#cfa14b] opacity-100"
                          : "opacity-0"
                      }`}
                    />

                    <button
                      onClick={() => toggleFaq(i)}
                      type="button"
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 sm:p-6 text-left"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`font-display text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-full transition-colors duration-300 ${
                            isOpen
                              ? "bg-[#a8451a] text-white"
                              : "bg-[#a8451a]/10 text-[#a8451a] group-hover:bg-[#a8451a]/20"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        <span
                          className={`font-display text-base sm:text-lg font-medium transition-colors duration-300 ${
                            isOpen ? "text-[#8e3510]" : "text-[#1c1109] group-hover:text-[#8e3510]"
                          }`}
                        >
                          {item.q}
                        </span>
                      </div>

                      <div
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-400 ${
                          isOpen
                            ? "rotate-180 border-transparent bg-gradient-to-r from-[#8e3510] to-[#a8451a] text-white shadow-sm"
                            : "border-[#a8451a]/25 bg-white/80 text-[#a8451a] group-hover:border-[#a8451a]/50 group-hover:bg-[#a8451a]/10"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>

                    {/* Smooth Accordion Body (CSS Grid 0fr -> 1fr) */}
                    <div
                      className={`grid transition-all duration-400 ease-in-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1">
                          <div className="border-t border-[#a8451a]/10 pt-3.5 pl-9 sm:pl-10">
                            <p className="text-sm sm:text-base font-normal leading-relaxed text-[#2b1d12]/80">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
