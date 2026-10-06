"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

const BATCH = 12;

function ReviewCard({ r }) {
  const rawText = r.review_text || "";
  const colonIdx = rawText.indexOf(": ");
  const name = colonIdx > 0 ? rawText.slice(0, colonIdx) : (r.profiles?.full_name || "Verified Customer");
  const text = colonIdx > 0 ? rawText.slice(colonIdx + 2) : rawText;
  const date = new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="rounded-3xl border border-[#a8451a]/20 bg-white/85 p-5 sm:p-6 hover:border-[#a8451a]/40 hover:bg-white hover:shadow-md transition-all duration-300 shadow-2xs">
      <div className="flex items-start justify-between gap-3 mb-3">
        <StarRating rating={r.rating} size={16} />
        <span className="text-sm text-[#2b1d12]/70 font-semibold shrink-0">{date}</span>
      </div>
      {text && <p className="text-base sm:text-lg text-[#2b1d12]/90 font-medium leading-relaxed">&ldquo;{text}&rdquo;</p>}
      <p className="mt-4 text-sm uppercase tracking-wider text-[#a8451a] font-bold">{name}</p>
    </div>
  );
}

export default function AllReviews({ reviews }) {
  const [visible, setVisible] = useState(BATCH);
  const shown = reviews.slice(0, visible);
  const remaining = reviews.length - visible;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {shown.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </div>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + BATCH)}
          className="mt-8 w-full rounded-full border border-[#a8451a]/30 bg-white/90 px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs transition-all duration-300 hover:border-[#a8451a] hover:bg-white hover:shadow-md active:scale-95"
        >
          Load More ({remaining} remaining)
        </button>
      )}
    </div>
  );
}
