"use client";

import Link from "next/link";
import StarRating from "@/components/StarRating";

const PREVIEW_COUNT = 3;

function ReviewCard({ r }) {
  // Name stored as "Name: review text" — extract just the name part if present
  const rawText = r.review_text || "";
  const colonIdx = rawText.indexOf(": ");
  const name = colonIdx > 0 ? rawText.slice(0, colonIdx) : (r.profiles?.full_name || "Verified Customer");
  const text = colonIdx > 0 ? rawText.slice(colonIdx + 2) : rawText;

  return (
    <li className="rounded-2xl border border-[#a8451a]/20 bg-white/85 p-5 sm:p-6 flex flex-col justify-between hover:border-[#a8451a]/40 hover:bg-white hover:shadow-md transition-all duration-300 shadow-2xs">
      <div>
        <StarRating rating={r.rating} size={16} />
        {text && <p className="mt-3 text-base sm:text-lg text-[#2b1d12]/90 font-medium leading-relaxed">&ldquo;{text}&rdquo;</p>}
      </div>
      <p className="mt-4 text-sm uppercase tracking-wider text-[#a8451a] font-bold">{name}</p>
    </li>
  );
}

export default function ReviewsList({ reviews, slug, hasOwnReview = false }) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-base sm:text-lg text-[#2b1d12]/80 font-normal">
        {hasOwnReview ? "No other reviews yet." : "No reviews yet — be the first to share yours."}
      </p>
    );
  }

  const preview = reviews.slice(0, PREVIEW_COUNT);
  const remaining = reviews.length - PREVIEW_COUNT;

  return (
    <div className="space-y-4">
      <ul className="space-y-3.5">
        {preview.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </ul>

      {remaining > 0 && slug && (
        <Link
          href={`/shop/${slug}/reviews`}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#a8451a]/30 bg-white/90 px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs transition-all duration-300 hover:border-[#a8451a] hover:bg-white hover:shadow-md"
        >
          See All Reviews ({reviews.length})
        </Link>
      )}
    </div>
  );
}
