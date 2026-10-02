"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";

const PER_PAGE = 3;

function CategoryCircle({ cat }) {
  return (
    <Link href={`/shop?category=${cat.id}`} className="group flex w-full flex-col items-center gap-2 sm:w-36 sm:shrink-0 sm:gap-4 lg:w-44">
      <div className="relative aspect-square w-full max-w-[5.5rem] sm:h-32 sm:w-32 sm:max-w-none lg:h-40 lg:w-40">
        {/* Slow-rotating gold ring */}
        <div
          className="absolute -inset-1.5 rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
          style={{
            animationDuration: "6s",
            background: "conic-gradient(from 0deg, transparent 0%, rgba(212,163,89,0.7) 15%, transparent 30%)",
          }}
        />
        {/* Static outer ring */}
        <div className="absolute -inset-1.5 rounded-full border border-gold-400/15" />

        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-gold-400/20 bg-ink-soft shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:border-gold-300/50 group-hover:shadow-[0_0_35px_rgba(212,163,89,0.3)]">
          {cat.image_url ? (
            <Image
              src={cat.image_url}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ink-gradient">
              <BottleGlyph className="h-1/2 w-auto text-gold-300/30" />
            </div>
          )}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-gold-400/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-center text-[10px] font-semibold uppercase tracking-normal text-ivory/80 transition-colors group-hover:text-gold-200 sm:text-sm sm:tracking-widest leading-tight">
          {cat.name}
        </p>
        <span className="h-px w-0 bg-gold-400/60 transition-all duration-300 group-hover:w-8" />
      </div>
    </Link>
  );
}

export default function CategoryCircles({ categories }) {
  const [page, setPage] = useState(0);
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
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
    trackRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  if (!categories || categories.length === 0) return null;

  const isOverflowing = canScrollLeft || canScrollRight;
  const totalPages = Math.ceil(categories.length / PER_PAGE);
  const visible = categories.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="relative bg-[#0b0a0a] py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-[10%] top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-[5%] top-1/3 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
        <div className="absolute left-1/3 bottom-0 h-[350px] w-[400px] rounded-full bg-gold-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mb-12 sm:mb-16 text-center">
          <p className="eyebrow justify-center">
            <span className="gold-line" /> Explore Our Range <span className="gold-line" />
          </p>
          <h2 className="section-heading mt-4">
            Shop by{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              Category
            </span>
          </h2>
        </Reveal>

        {/* Mobile: horizontally swipeable scroll — spacer divs ensure equal L/R gap */}
        <div className="sm:hidden -mx-6">
          <div
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-3 pb-5"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x pinch-zoom" }}
          >
            <div className="w-6 shrink-0" aria-hidden />
            {categories.map((cat) => (
              <div key={cat.id} className="w-[30vw] min-w-[100px] shrink-0 snap-start" style={{ touchAction: "pan-x" }}>
                <CategoryCircle cat={cat} />
              </div>
            ))}
            <div className="w-6 shrink-0" aria-hidden />
          </div>
        </div>

        {/* Desktop/tablet: single row, horizontally scrollable when it overflows */}
        <div className="relative hidden sm:block">
          <div
            ref={trackRef}
            className={`flex flex-nowrap gap-10 overflow-x-auto scroll-smooth px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isOverflowing ? "justify-start" : "justify-center"
            }`}
          >
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 80}>
                <CategoryCircle cat={cat} />
              </Reveal>
            ))}
          </div>

          {/* Swiper buttons — only visible when content overflows */}
          {isOverflowing && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft/40 text-ivory/50 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-300 hover:shadow-[0_0_15px_rgba(212,163,89,0.15)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft/40 text-ivory/50 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-300 hover:shadow-[0_0_15px_rgba(212,163,89,0.15)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
