"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

const OPTIONS = [
  { value: "", label: "Sort: Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function SortSelect({ className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "";

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const selectValue = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const activeLabel = OPTIONS.find((o) => o.value === activeSort)?.label || OPTIONS[0].label;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 shadow-2xs ${
          open
            ? "border-[#a8451a] bg-white text-[#1c1109] ring-2 ring-[#a8451a]/20"
            : "border-[#a8451a]/25 bg-white/90 text-[#1c1109] hover:border-[#a8451a]/50 hover:bg-white"
        }`}
      >
        <span>{activeLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#c04a1c] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-full min-w-[220px] overflow-hidden rounded-2xl border border-[#a8451a]/20 bg-white/95 py-1.5 shadow-xl backdrop-blur-xl animate-fadeUp">
          {OPTIONS.map((option) => {
            const isActive = option.value === activeSort;
            return (
              <button
                key={option.value || "default"}
                type="button"
                onClick={() => selectValue(option.value)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#a8451a]/10 font-bold text-[#8e3510]"
                    : "text-[#2b1d12]/80 hover:bg-[#fde3cf]/40 hover:text-[#1c1109]"
                }`}
              >
                <span>{option.label}</span>
                {isActive && <Check className="h-4 w-4 shrink-0 text-[#a8451a]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
