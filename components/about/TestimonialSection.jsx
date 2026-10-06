"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import Image from "next/image";

const VISIBLE_COUNT = 3;

function getVisible(startIndex, items) {
  return Array.from(
    { length: Math.min(VISIBLE_COUNT, items.length) },
    (_, i) => items[(startIndex + i) % items.length]
  );
}

export default function TestimonialSection({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  const items = testimonials;
  const [startIndex, setStartIndex] = useState(0);

  const goTo = (target) => setStartIndex(target);
  const handleNext = () => goTo((startIndex + 1) % items.length);
  const handlePrev = () => goTo((startIndex - 1 + items.length) % items.length);

  useEffect(() => {
    if (items.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [startIndex, items.length]);

  const visible = getVisible(startIndex, items);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-wrap px-5 sm:px-8 md:px-12 relative z-10">
        
        {/* Section Header */}
        <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs mb-3.5">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
              Customer Reviews
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
            What Our{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              Customers Say
            </span>
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-[#2b1d12]/80 leading-relaxed font-normal">
            Real feedback from people across India who wear our perfumes every day.
          </p>
        </Reveal>

        {/* Testimonials Grid */}
        <Reveal delay={100}>
          <div key={startIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInRight">
            {visible.map((t, i) => {
              const name = t.customer_name || t.name || "Customer";
              const text = t.review_text || t.text || "";
              const title = t.title || "Verified Buyer";
              return (
                <div
                  key={`${name}-${i}`}
                  className={`group flex h-full flex-col rounded-[2rem] sm:rounded-[2.25rem] border border-[#a8451a]/20 bg-white/90 p-7 sm:p-8 shadow-xs backdrop-blur-md transition-all duration-500 hover:border-[#a8451a]/40 hover:bg-white hover:shadow-lg hover:-translate-y-1 ${
                    i === 0 ? "" : "hidden md:flex"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={`w-4 h-4 ${
                            si < t.rating
                              ? "fill-amber-500 text-amber-500"
                              : "fill-none text-zinc-300"
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-[#a8451a]/30 group-hover:text-[#a8451a]/60 transition-colors" strokeWidth={1.5} />
                  </div>

                  <p className="mt-5 flex-1 text-base sm:text-[17px] leading-relaxed text-[#2b1d12]/85 font-normal italic">
                    &ldquo;{text}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3.5 border-t border-[#a8451a]/15 pt-5">
                    {t.image_url ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#a8451a]/25 bg-white shadow-xs">
                        <Image src={t.image_url} alt={name} fill sizes="48px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#a8451a] font-display text-base font-semibold text-white shadow-xs">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-base text-[#1c1109] font-bold truncate">{name}</p>
                      <p className="text-xs sm:text-sm text-[#2b1d12]/70 truncate">
                        {title} {t.location ? `· ${t.location}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length > VISIBLE_COUNT && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-11 h-11 rounded-full border border-[#a8451a]/25 bg-white/90 text-[#a8451a] hover:bg-[#a8451a] hover:text-white flex items-center justify-center transition-all shadow-xs hover:-translate-x-0.5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2 items-center">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === startIndex
                        ? "w-8 bg-gradient-to-r from-[#8e3510] to-[#a8451a]"
                        : "w-2.5 bg-[#a8451a]/25 hover:bg-[#a8451a]/50"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-11 h-11 rounded-full border border-[#a8451a]/25 bg-white/90 text-[#a8451a] hover:bg-[#a8451a] hover:text-white flex items-center justify-center transition-all shadow-xs hover:translate-x-0.5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
