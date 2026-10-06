"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Sparkles } from "lucide-react";
import BottleGlyph from "./BottleGlyph";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { flyToCart } from "@/lib/flyToCart";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variantId || !product.inStock) return;
    flyToCart(e.currentTarget, product.image);
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantName: product.variantName,
      price: product.price,
      image: product.image,
    });
    showToast(`${product.name} added to your bag.`);
  };

  const labelText = product.gender
    ? product.gender.toLowerCase().startsWith("for")
      ? product.gender
      : product.gender === "Unisex"
        ? "Unisex"
        : `For ${product.gender}`
    : product.categoryName || "";

  const label = labelText ? (
    <p className="min-w-0 truncate text-[10px] sm:text-sm font-bold uppercase tracking-wide sm:tracking-wider text-[#a8451a]">
      {labelText}
    </p>
  ) : (
    <span />
  );

  const ratingBadge =
    product.reviewCount > 0 && product.rating > 0 ? (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#fde3cf]/80 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-sm font-bold text-[#a8451a] border border-[#a8451a]/20 shadow-2xs">
        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-[#c04a1c] text-[#c04a1c]" />
        <span>{product.rating.toFixed(1)}</span>
      </span>
    ) : (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#fde3cf]/50 px-2 sm:px-2.5 py-0.5 text-xs font-semibold text-[#2b1d12]/70">
        <Star className="h-3 w-3 text-[#a8451a]/60" />
        <span>New</span>
      </span>
    );

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-[2rem] border border-[#a8451a]/20 bg-white/70 shadow-[0_4px_20px_rgba(43,29,18,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#a8451a]/50 hover:bg-white hover:shadow-[0_20px_45px_-10px_rgba(168,69,26,0.22)] backdrop-blur-sm"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[5/4] sm:aspect-square shrink-0 overflow-hidden bg-gradient-to-b from-[#fffaf4] to-[#fdebd9]">
        {/* Soft radial glow behind bottle */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,144,90,0.15),transparent_70%)]" />

        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-b from-[#fff6ed] to-[#fddbbd]">
            <BottleGlyph className="h-16 w-auto text-[#a8451a]/40 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}

        {/* Diagonal Light Sweep On Hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100" />

        {/* Badge (e.g. Bestseller, New, Limited) — high contrast & visible */}
        {product.badge && (
          <span className="absolute left-2 top-2 sm:left-3.5 sm:top-3.5 z-10 inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#d4651f] px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide sm:tracking-wider text-white shadow-lg border-2 border-white ring-1 ring-black/25">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-200 shrink-0" />
            <span>{product.badge}</span>
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Desktop: label + rating above the title */}
        <div className="hidden items-center justify-between gap-1.5 min-h-[1.25rem] sm:flex">
          {label}
          {ratingBadge}
        </div>

        {/* Product Title */}
        <h3 className="mt-1 sm:mt-1.5 font-display text-[13px] sm:text-base lg:text-lg font-bold text-[#1c1109] transition-colors duration-300 group-hover:text-[#a8451a] truncate sm:line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Mobile: label + rating below the title */}
        <div className="mt-1 flex items-center justify-between gap-1.5 pb-2 sm:hidden">
          {label}
          {ratingBadge}
        </div>

        {/* Bottom Action Bar: Price on Left, Compact Pill Button on Right (No full width!) */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:pt-3.5 border-t border-[#a8451a]/10">
          <div className="shrink-0 flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-extrabold text-[#1c1109] text-[15px] sm:text-base lg:text-lg whitespace-nowrap">
              {product.price != null ? `₹${product.price.toLocaleString("en-IN")}` : "—"}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[10px] sm:text-sm text-[#2b1d12]/50 line-through whitespace-nowrap">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="shrink-0">
            {product.variantId && product.inStock ? (
              <button
                type="button"
                onClick={handleQuickAdd}
                aria-label={`Add ${product.name} to bag`}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold tracking-wide text-white shadow-2xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add to Cart</span>
              </button>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full border border-[#a8451a]/20 bg-white/70 px-3 py-1 text-xs sm:text-sm font-semibold text-[#2b1d12]/60">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
