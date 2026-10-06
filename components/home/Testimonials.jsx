"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import StarRating from "@/components/StarRating";
import { ChevronLeft, ChevronRight, Sparkles, Quote } from "lucide-react";

const DEFAULT_TESTIMONIALS = [
  {
    customer_name: "Ayesha K.",
    location: "Lucknow",
    review_text: "The Oudh Mustaqeem attar lasted through a full wedding function without a single reapplication. Deep, warm, not overpowering.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Rohit Malhotra",
    location: "Delhi",
    review_text: "The first attar I've tried that doesn't fade to an alcohol smell within an hour. Genuinely extrait-grade.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Sana Sheikh",
    location: "Hyderabad",
    review_text: "Ordered the 6ml rose attar to try, ended up gifting the 12ml to my mother the same week.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Devendra S.",
    location: "Jaipur",
    review_text: "Truly alcohol-free. It stays mild on the skin and lasts all day. Zaylune has the best collection.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Priya Patel",
    location: "Ahmedabad",
    review_text: "The packaging is so premium, and the smell of Rose & Oud is extremely rich. Got so many compliments.",
    rating: 5,
    image_url: null,
  },
  {
    customer_name: "Kabir Verma",
    location: "Mumbai",
    review_text: "Extrait-grade oils are the real deal. You only need a tiny drop and it stays fresh for hours.",
    rating: 5,
    image_url: null,
  },
];

function getInitials(name) {
  if (!name) return "Z";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Testimonials({
  testimonials = [],
  subtitle = "Real experiences from real customers, in their own words.",
}) {
  const items = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollByCard = (direction) => {
    const container = containerRef.current;
    if (!container) return;
    const card = container.firstElementChild;
    const cardWidth = card ? card.clientWidth + 24 : 380;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (direction === "next") {
      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const interval = setInterval(() => scrollByCard("next"), 4500);
    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  return (
    <section className="relative overflow-hidden border-y border-[#a8451a]/20 bg-gradient-to-b from-[#fde3cf] via-[#fff5eb] to-[#fde3cf] py-16 sm:py-24 lg:py-28">
      {/* Ambient luminous luxury orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[6%] top-1/4 h-[460px] w-[480px] rounded-full bg-[#c04a1c]/[0.07] blur-[150px]" />
        <div className="absolute right-[6%] bottom-1/4 h-[480px] w-[500px] rounded-full bg-[#cfa14b]/[0.08] blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-white/[0.25] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
        {/* Section Header */}
        <Reveal className="mx-auto mb-12 sm:mb-16 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/75 px-4 py-1.5 shadow-sm backdrop-blur-sm mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
              Customer Voices
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#1c1109] leading-tight">
            What Our{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              Customers Say
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
            {subtitle}
          </p>
        </Reveal>

        {/* Horizontal Swiper Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={containerRef}
            className="no-scrollbar relative z-0 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pt-2 pb-6 px-1"
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="w-[85vw] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
              >
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-[#a8451a]/20 bg-white/80 backdrop-blur-md p-6 sm:p-8 lg:p-8 shadow-[0_12px_32px_rgba(43,29,18,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#a8451a]/45 hover:bg-white/95 hover:shadow-[0_22px_45px_rgba(168,69,26,0.18)]">
                  {/* Top hairline shimmer sweep on hover */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#c04a1c] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Subtle radial glow on hover */}
                  <div className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(192,74,28,0.1),transparent_70%)]" />

                  {/* Top Section: Rating & Quote Glyph */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={item.rating} size={15} />
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#cfa14b]/15 to-[#a8451a]/15 text-[#a8451a] transition-transform duration-500 group-hover:scale-110">
                        <Quote className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Review Copy */}
                    <p className="font-normal italic leading-relaxed text-[#2b1d12]/90 text-sm sm:text-base lg:text-[1.05rem]">
                      &ldquo;{item.review_text}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Section: Customer Monogram / Avatar & Location */}
                  <div className="relative mt-6 flex items-center gap-3.5 border-t border-[#a8451a]/15 pt-5 sm:mt-8">
                    <div className="relative h-12 w-12 shrink-0">
                      {/* Rotating gold halo ring on hover */}
                      <div
                        className="absolute -inset-1 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
                        style={{
                          animationDuration: "8s",
                          background:
                            "conic-gradient(from 0deg, transparent 0%, rgba(192,74,28,0.45) 25%, transparent 50%)",
                        }}
                      />
                      <div className="relative h-full w-full overflow-hidden rounded-full border border-[#a8451a]/25 shadow-xs transition-all duration-300 group-hover:border-[#a8451a]">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.customer_name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#fff7ef] via-white to-[#fde5ce] font-display text-xs sm:text-sm font-bold tracking-wider text-[#a8451a]">
                            {getInitials(item.customer_name)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-left min-w-0">
                      <p className="truncate font-display text-base font-semibold text-[#1c1109] transition-colors duration-300 group-hover:text-[#8e3510]">
                        {item.customer_name}
                      </p>
                      {item.location && (
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#a8451a]">
                          {item.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          {items.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => scrollByCard("prev")}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#a8451a]/25 bg-white/80 text-[#2b1d12] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#a8451a] hover:bg-gradient-to-r hover:from-[#8e3510] hover:to-[#a8451a] hover:text-white hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollByCard("next")}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#a8451a]/25 bg-white/80 text-[#2b1d12] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#a8451a] hover:bg-gradient-to-r hover:from-[#8e3510] hover:to-[#a8451a] hover:text-white hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
