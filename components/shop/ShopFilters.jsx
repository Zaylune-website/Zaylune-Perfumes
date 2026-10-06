"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Check, SlidersHorizontal, Sparkles } from "lucide-react";
import { GENDERS } from "@/lib/constants";
import SortSelect from "./SortSelect";

function PriceRange({ globalMin, globalMax, currentMin, currentMax, onApply }) {
  const [min, setMin] = useState(currentMin ?? globalMin);
  const [max, setMax] = useState(currentMax ?? globalMax);

  useEffect(() => {
    setMin(currentMin ?? globalMin);
    setMax(currentMax ?? globalMax);
  }, [currentMin, currentMax, globalMin, globalMax]);

  const range = globalMax - globalMin || 1;
  const minPct = ((min - globalMin) / range) * 100;
  const maxPct = ((max - globalMin) / range) * 100;

  const handleMin = (e) => setMin(Math.min(Number(e.target.value), max - 50));
  const handleMax = (e) => setMax(Math.max(Number(e.target.value), min + 50));
  const apply = () => onApply(min, max);

  const thumbClass =
    "absolute inset-0 w-full cursor-pointer appearance-none bg-transparent pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#8e3510] [&::-webkit-slider-thumb]:bg-white " +
    "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform " +
    "[&::-webkit-slider-thumb]:hover:scale-110 " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-[22px] [&::-moz-range-thumb]:w-[22px] " +
    "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#8e3510] " +
    "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer";

  return (
    <div className="space-y-3.5">
      {/* Dual price preview badge pills */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[#a8451a]/20 bg-white/95 px-3 py-2 shadow-2xs">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a8451a]">Min</span>
          <span className="font-display text-sm font-bold text-[#1c1109]">₹{min.toLocaleString("en-IN")}</span>
        </div>
        <div className="rounded-xl border border-[#a8451a]/20 bg-white/95 px-3 py-2 shadow-2xs">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a8451a]">Max</span>
          <span className="font-display text-sm font-bold text-[#1c1109]">₹{max.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Interactive slider track */}
      <div className="relative h-6 flex items-center px-1">
        {/* Base track */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-[#a8451a]/15 shadow-inner" />
        {/* Active range fill */}
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#d4651f] shadow-xs"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={globalMin}
          max={globalMax}
          step={50}
          value={min}
          onChange={handleMin}
          onMouseUp={apply}
          onTouchEnd={apply}
          className={thumbClass}
          style={{ zIndex: min > globalMax - range * 0.1 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={globalMin}
          max={globalMax}
          step={50}
          value={max}
          onChange={handleMax}
          onMouseUp={apply}
          onTouchEnd={apply}
          className={thumbClass}
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-semibold text-[#2b1d12]/55 px-0.5">
        <span>₹{globalMin.toLocaleString("en-IN")}</span>
        <span>₹{globalMax.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

export default function ShopFilters({ categories, globalMin = 0, globalMax = 10000 }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const activeGender = searchParams.get("gender") || "";
  const activeMinPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice"), 10) : null;
  const activeMaxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice"), 10) : null;
  const hasPriceFilter =
    (activeMinPrice != null && activeMinPrice > globalMin) ||
    (activeMaxPrice != null && activeMaxPrice < globalMax);

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const applyPrice = (min, max) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (min > globalMin) params.set("minPrice", String(min));
    else params.delete("minPrice");
    if (max < globalMax) params.set("maxPrice", String(max));
    else params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = [activeCategory, activeGender, hasPriceFilter ? "price" : ""].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  const filterGroups = (
    <div className="space-y-6">
      {/* Price Range */}
      {globalMax > globalMin && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c04a1c]" />
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">Price Range</p>
            </div>
            {hasPriceFilter && (
              <button
                onClick={() => applyPrice(globalMin, globalMax)}
                className="text-xs font-bold text-[#2b1d12]/70 hover:text-rose-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          <PriceRange
            globalMin={globalMin}
            globalMax={globalMax}
            currentMin={activeMinPrice}
            currentMax={activeMaxPrice}
            onApply={applyPrice}
          />
        </div>
      )}

      {/* Category selection */}
      <div className="border-t border-[#a8451a]/15 pt-5">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c04a1c]" />
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">Category</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setParam("category", "")}
            className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm transition-all ${
              !activeCategory
                ? "bg-white font-bold text-[#8e3510] border border-[#a8451a]/35 shadow-xs ring-2 ring-[#a8451a]/15"
                : "text-[#2b1d12]/80 hover:bg-white hover:text-[#1c1109] border border-transparent"
            }`}
          >
            <span>All Fragrances</span>
            {!activeCategory ? (
              <Check className="h-4 w-4 text-[#a8451a]" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-[#a8451a]/20 group-hover:bg-[#a8451a]" />
            )}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParam("category", cat.id)}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm transition-all ${
                activeCategory === cat.id
                  ? "bg-white font-bold text-[#8e3510] border border-[#a8451a]/35 shadow-xs ring-2 ring-[#a8451a]/15"
                  : "text-[#2b1d12]/80 hover:bg-white hover:text-[#1c1109] border border-transparent"
              }`}
            >
              <span>{cat.name}</span>
              {activeCategory === cat.id ? (
                <Check className="h-4 w-4 text-[#a8451a]" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-[#a8451a]/20 group-hover:bg-[#a8451a]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gender selection */}
      <div className="border-t border-[#a8451a]/15 pt-5">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c04a1c]" />
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">For</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setParam("gender", activeGender === g ? "" : g)}
              className={`flex items-center justify-center rounded-xl py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeGender === g
                  ? "border border-[#a8451a] bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] text-white shadow-xs font-bold"
                  : "border border-[#a8451a]/20 bg-white/80 text-[#2b1d12]/80 hover:border-[#a8451a] hover:bg-white hover:text-[#1c1109]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger — opens the filter drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#a8451a]/20 bg-white/90 px-5 py-3.5 shadow-sm backdrop-blur-md md:hidden hover:bg-white hover:border-[#a8451a]/40 transition-all"
      >
        <span className="flex items-center gap-2.5 font-display text-sm sm:text-base font-bold text-[#1c1109]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-xs">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
          </span>
          Filters
          {hasFilters && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#a8451a] px-2 text-[11px] font-extrabold text-white shadow-2xs">
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-[#a8451a]">Open</span>
      </button>

      {/* Desktop sidebar — always visible */}
      <div className="hidden rounded-3xl border border-[#a8451a]/25 bg-white/90 p-6 shadow-md backdrop-blur-xl ring-1 ring-white/70 md:block">
        <div className="mb-6 flex items-center justify-between border-b border-[#a8451a]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-md shadow-[#a8451a]/25 ring-2 ring-[#a8451a]/20">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#1c1109]">Filters</h3>
              {hasFilters && (
                <p className="text-[11px] font-bold text-[#a8451a]">
                  {activeCount} {activeCount === 1 ? "filter applied" : "filters applied"}
                </p>
              )}
            </div>
          </div>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
        {filterGroups}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col border-r border-[#a8451a]/20 bg-gradient-to-b from-[#fffbf8] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] shadow-2xl transition-transform duration-500 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#a8451a]/15 bg-white/90 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-2.5 font-display text-lg font-bold text-[#1c1109]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-xs">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
            </div>
            <span>Filters</span>
            {hasFilters && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#a8451a] px-2 text-xs font-extrabold text-white shadow-2xs">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="group rounded-full border border-[#a8451a]/20 bg-white p-2 text-[#2b1d12] shadow-2xs transition-all duration-300 hover:bg-[#a8451a] hover:text-white"
          >
            <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#a8451a]/20">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#a8451a] mb-2.5">Sort by</p>
            <SortSelect />
          </div>
          {filterGroups}
        </div>

        <div className="space-y-3 border-t border-[#a8451a]/15 bg-white/95 px-6 py-5 backdrop-blur-xl">
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-[#2b1d12]/70 transition-colors hover:text-rose-600"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            className="block w-full rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] py-3.5 text-center font-display text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:shadow-xl transition-all"
          >
            Show Results
          </button>
        </div>
      </aside>
    </>
  );
}
