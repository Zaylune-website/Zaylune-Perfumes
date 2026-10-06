import ProductCard from "./ProductCard";
import BottleGlyph from "./BottleGlyph";
import { whatsappLink } from "@/lib/constants";
import { MessageCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2.25rem] border border-[#a8451a]/25 bg-white/85 p-8 sm:p-12 text-center shadow-lg backdrop-blur-md max-w-xl mx-auto my-6">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,144,90,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#a8451a]/25 bg-gradient-to-br from-white to-[#fde3cf] shadow-md ring-4 ring-[#a8451a]/10">
            <BottleGlyph className="h-10 w-auto text-[#c04a1c] animate-floatSlow" />
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-light text-[#1c1109] tracking-wide">
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              No Fragrances Found
            </span>
          </h3>
          <div className="w-12 h-[2px] bg-[#a8451a]/30 mx-auto mt-4 mb-4 rounded-full" />

          <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#2b1d12]/80 font-normal">
            We couldn't find any fragrances matching your current selection. Try resetting your filters, or chat with our fragrance master for a personalized recommendation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 rounded-full border border-[#a8451a]/30 bg-white/90 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a8451a] shadow-xs hover:border-[#a8451a] hover:bg-white transition-all w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4 text-[#c04a1c]" />
              Reset Filters
            </Link>
            <a
              href={whatsappLink("Hi Zaylune, I would love a fragrance recommendation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
