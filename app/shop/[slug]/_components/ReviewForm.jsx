"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/actions/reviews";
import { useToast } from "@/context/ToastContext";
import StarRating from "@/components/StarRating";

export default function ReviewForm({ productId, existingReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast("Please choose a star rating.", "error");
      return;
    }
    startTransition(async () => {
      const result = await submitReview(productId, rating, text);
      if (!result.success) {
        if (result.requiresLogin) {
          showToast("Please log in to leave a review.", "error");
        } else {
          showToast(result.error || "Something went wrong.", "error");
        }
        return;
      }
      setDone(true);
      showToast("Thanks — your review is pending approval.");
    });
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-500/25 bg-emerald-50/70 p-6 text-sm sm:text-base font-medium text-emerald-900 shadow-2xs">
        Thank you for your review — it will appear here once approved by our team.
      </div>
    );
  }

  // Already reviewed this product — show their review back instead of a
  // blank form, since only one review per product is allowed per user.
  if (existingReview) {
    return (
      <div className="rounded-3xl border border-[#a8451a]/20 bg-white/85 space-y-3 p-6 sm:p-7 shadow-sm backdrop-blur-md">
        <p className="font-display text-xl font-bold text-[#1c1109]">Your Review</p>
        <StarRating rating={existingReview.rating} size={18} />
        {existingReview.review_text && (
          <p className="text-base sm:text-lg text-[#2b1d12]/90 font-medium leading-relaxed">&ldquo;{existingReview.review_text}&rdquo;</p>
        )}
        {!existingReview.is_approved && (
          <p className="text-sm text-[#a8451a] font-semibold">Pending approval — it will appear publicly once our team reviews it.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-[#a8451a]/20 bg-white/85 space-y-4 p-6 sm:p-7 shadow-sm backdrop-blur-md">
      <p className="font-display text-xl font-bold text-[#1c1109]">Write a Review</p>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`Rate ${n} stars`}
            className="p-1 transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                n <= (hoverRating || rating) ? "fill-[#c04a1c] text-[#c04a1c]" : "fill-none text-[#a8451a]/30"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={800}
        placeholder="How did this fragrance wear for you?"
        className="w-full rounded-2xl border border-[#a8451a]/20 bg-white px-4 py-3.5 text-base sm:text-lg text-[#1c1109] placeholder:text-[#2b1d12]/40 focus:border-[#a8451a] focus:ring-2 focus:ring-[#a8451a]/15 focus:outline-none shadow-2xs transition-all"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] px-8 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
