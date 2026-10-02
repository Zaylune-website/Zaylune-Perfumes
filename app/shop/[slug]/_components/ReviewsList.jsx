"use client";

import Link from "next/link";
import StarRating from "@/components/StarRating";

const PREVIEW_COUNT = 3;

function ReviewCard({ r }) {
  // Name stored as "Name: review text" — extract just the name part if present
  const rawText = r.review_text || "";
  const colonIdx = rawText.indexOf(": ");
  const name = colonIdx > 0 ? rawText.slice(0, colonIdx) : (r.profiles?.full_name || "Zaylune Customer");
  const text = colonIdx > 0 ? rawText.slice(colonIdx + 2) : rawText;

  return (
    <li className="rounded-2xl border border-ink-line bg-ink-soft/40 p-5 flex flex-col justify-between hover:border-gold-400/25 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(212,163,89,0.06)] transition-all duration-300">
      <div>
        <StarRating rating={r.rating} size={12} />
        {text && <p className="mt-3 text-sm sm:text-base text-ivory/70 font-light leading-relaxed">&ldquo;{text}&rdquo;</p>}
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-ivory/40 font-semibold">{name}</p>
    </li>
  );
}

export default function ReviewsList({ reviews, slug, hasOwnReview = false }) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-sm sm:text-base text-ivory/40 font-light">
        {hasOwnReview ? "No other reviews yet." : "No reviews yet — be the first to share yours."}
      </p>
    );
  }

  const preview = reviews.slice(0, PREVIEW_COUNT);
  const remaining = reviews.length - PREVIEW_COUNT;

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {preview.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </ul>

      {remaining > 0 && slug && (
        <Link
          href={`/shop/${slug}/reviews`}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gold-400/25 bg-ink-soft/40 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-gold-300 transition-all duration-300 hover:border-gold-300/50 hover:bg-gold-400/5 hover:scale-[1.01]"
        >
          See All Reviews ({reviews.length})
        </Link>
      )}
    </div>
  );
}
