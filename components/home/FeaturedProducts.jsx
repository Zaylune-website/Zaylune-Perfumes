import Link from "next/link";
import { Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProducts({ products }) {
  const items = (products || []).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fff8f0] to-[#fde3cf] py-16 sm:py-24">
      {/* Ambient glowing orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[8%] top-0 h-[450px] w-[480px] rounded-full bg-[#c04a1c]/[0.06] blur-[140px]" />
        <div className="absolute left-[5%] top-1/2 h-[420px] w-[450px] rounded-full bg-[#a8451a]/[0.07] blur-[130px]" />
        <div className="absolute right-1/4 bottom-0 h-[380px] w-[400px] rounded-full bg-[#c04a1c]/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
        {/* Header Section */}
        <Reveal className="mb-12 sm:mb-16 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/75 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
                Handpicked For You
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
            </div>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
              Featured{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                Products
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed max-w-xl font-normal">
              Hand-poured extrait fragrances and concentrated attars, formulated in small batches for lasting sillage.
            </p>
          </div>

          <Link
            href="/shop"
            className="group mt-6 sm:mt-0 inline-flex shrink-0 items-center justify-center rounded-full border-2 border-[#c04a1c]/35 bg-white/70 px-7 sm:px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a8451a] shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#c04a1c] hover:bg-accent-gradient hover:text-white hover:shadow-md hover:scale-105"
          >
            <span>Explore All</span>
          </Link>
        </Reveal>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {items.map((product) => (
            <div key={product.id} className="group/slot relative h-full">
              {/* Luminous Glow that blooms behind card on hover */}
              <div className="pointer-events-none absolute -inset-2.5 rounded-[2.5rem] bg-[#c04a1c]/0 blur-2xl transition-all duration-500 group-hover/slot:bg-[#c04a1c]/12" />
              <div className="relative h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
