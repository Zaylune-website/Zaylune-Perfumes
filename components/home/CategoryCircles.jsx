"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";

function CategoryCircle({ cat, index }) {
  return (
    <Link
      href={`/shop?category=${cat.id}`}
      className="group relative flex w-full flex-col items-center gap-3 sm:w-40 sm:shrink-0 sm:gap-5 lg:w-48 transition-all duration-300"
    >
      {/* Circle Container with Luxury Portal Framing */}
      <div className="relative aspect-square w-full max-w-[6rem] sm:h-36 sm:w-36 sm:max-w-none lg:h-44 lg:w-44">
        {/* Luminous Pulsing Glow Aura behind circle */}
        <div className="pointer-events-none absolute -inset-3 rounded-full bg-[#c04a1c]/10 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-110" />

        {/* Slow-rotating Conic Gold Aura */}
        <div
          className="absolute -inset-2 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
          style={{
            animationDuration: "9s",
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(192,74,28,0.6) 20%, transparent 40%, rgba(242,144,90,0.7) 65%, transparent 80%)",
          }}
        />

        {/* Outer Fine Gold Wire Ring */}
        <div className="absolute -inset-1.5 rounded-full border border-[#a8451a]/25 transition-all duration-500 group-hover:border-[#a8451a]/60 group-hover:scale-105" />

        {/* Inner Main Circle Frame */}
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#a8451a]/30 bg-gradient-to-br from-[#fff7ef] to-[#fde5ce] shadow-[0_8px_25px_rgba(43,29,18,0.1)] transition-all duration-500 group-hover:scale-105 group-hover:border-[#a8451a] group-hover:shadow-[0_12px_35px_rgba(168,69,26,0.3)]">
          {cat.image_url ? (
            <Image
              src={cat.image_url}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 110px, (max-width: 1024px) 160px, 190px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-115"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#fff6ed] to-[#fddbbd]">
              <BottleGlyph className="h-1/2 w-auto text-[#a8451a]/80 transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}

          {/* Vignette Shadow for high-end depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 transition-opacity duration-300 group-hover:from-black/55" />

          {/* Inner Golden Ring */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30" />
        </div>

        {/* Floating Mini Sparkle Badge on Hover */}
        <div className="absolute -bottom-1 right-2 sm:bottom-0 sm:right-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/60 bg-accent-gradient text-white shadow-md opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-105">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-200" />
        </div>
      </div>

      {/* Typography & Sub-caption */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-[#2b1d12] transition-colors duration-300 group-hover:text-[#a8451a] leading-snug">
          {cat.name}
        </p>

        {/* Dynamic sliding accent bar */}
        <div className="relative mt-0.5 h-0.5 w-6 overflow-hidden rounded-full bg-[#a8451a]/25 transition-all duration-300 group-hover:w-12 group-hover:bg-[#a8451a]">
          <div className="absolute inset-0 -translate-x-full bg-white/60 transition-transform duration-500 group-hover:translate-x-full" />
        </div>
      </div>
    </Link>
  );
}

export default function CategoryCircles({ categories }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categories?.length]);

  const scrollByAmount = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  };

  if (!categories || categories.length === 0) return null;

  const isOverflowing = canScrollLeft || canScrollRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fff5eb] to-[#fde3cf] py-16 sm:py-24">
      {/* Ambient glowing orbs in background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[15%] top-1/4 h-[380px] w-[420px] rounded-full bg-[#c04a1c]/[0.06] blur-[120px]" />
        <div className="absolute right-[12%] bottom-1/4 h-[400px] w-[450px] rounded-full bg-[#a8451a]/[0.07] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <Reveal className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
              Explore Our Range
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#1c1109] mt-4">
            Shop by{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              Category
            </span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-2xl text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
            Curated artisan extraits and pure perfume oils crafted for every personality and occasion.
          </p>
        </Reveal>

        {/* Mobile: Smooth touch horizontal rail */}
        <div className="sm:hidden -mx-5">
          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-3 pb-6 px-6"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x pinch-zoom" }}
          >
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className="w-[32vw] min-w-[120px] shrink-0 snap-center"
                style={{ touchAction: "pan-x" }}
              >
                <CategoryCircle cat={cat} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet: Single elegant rail with jewel buttons */}
        <div className="relative hidden sm:block">
          <div
            ref={trackRef}
            className={`flex flex-nowrap gap-10 md:gap-14 overflow-x-auto scroll-smooth px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isOverflowing ? "justify-start" : "justify-center"
            }`}
          >
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 70}>
                <CategoryCircle cat={cat} index={i} />
              </Reveal>
            ))}
          </div>

          {/* Luxury Jeweled Swiper Navigation Buttons */}
          {isOverflowing && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#a8451a]/25 bg-white/80 text-[#a8451a] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#a8451a] hover:bg-[#a8451a] hover:text-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#a8451a]/25 bg-white/80 text-[#a8451a] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#a8451a] hover:bg-[#a8451a] hover:text-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Editorial Link to Full Catalog */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#c04a1c]/40 bg-white/70 px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a8451a] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#c04a1c] hover:bg-accent-gradient hover:text-white hover:shadow-md hover:scale-105"
          >
            <span>View All Fragrances</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
