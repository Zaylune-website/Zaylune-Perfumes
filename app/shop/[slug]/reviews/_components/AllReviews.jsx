"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

const BATCH = 12;

function ReviewCard({ r }) {
  const rawText = r.review_text || "";
  const colonIdx = rawText.indexOf(": ");
  const name = colonIdx > 0 ? rawText.slice(0, colonIdx) : (r.profiles?.full_name || "Zaylune Customer");
  const text = colonIdx > 0 ? rawText.slice(colonIdx + 2) : rawText;
  const date = new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="rounded-2xl border border-ink-line bg-ink-soft/40 p-5 sm:p-6 hover:border-gold-400/25 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(212,163,89,0.06)] transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <StarRating rating={r.rating} size={13} />
        <span className="text-[11px] text-ivory/30 font-medium shrink-0">{date}</span>
      </div>
      {text && <p className="text-sm sm:text-base text-ivory/70 font-light leading-relaxed">&ldquo;{text}&rdquo;</p>}
      <p className="mt-4 text-xs uppercase tracking-wider text-ivory/40 font-semibold">{name}</p>
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
          className="mt-8 w-full rounded-full border border-gold-400/25 bg-ink-soft/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-gold-300 transition-all duration-300 hover:border-gold-300/50 hover:bg-gold-400/5 hover:scale-[1.01]"
        >
          Load More ({remaining} remaining)
        </button>
      )}
    </div>
  );
}
