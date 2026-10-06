"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2, Search } from "lucide-react";
import StarRating from "@/components/StarRating";
import FilterSelect from "@/components/admin/FilterSelect";
import { approveReview, deleteReview } from "@/actions/admin/reviews";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
];

export default function ReviewList({ reviews }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, label }

  const handleApprove = (id) => {
    startTransition(async () => {
      await approveReview(id);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteReview(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    });
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (tab === "pending" && r.is_approved) return false;
      if (tab === "approved" && !r.is_approved) return false;
      if (rating !== "all" && r.rating !== Number(rating)) return false;
      if (term) {
        const haystack = [r.profiles?.full_name, r.profiles?.email, r.products?.name, r.review_text]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [reviews, tab, rating, search]);

  return (
    <div>
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        pending={pending}
        label={deleteTarget?.label || "this review"}
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-300 ${
                tab === t.key
                  ? "border-[#a8451a]/30 bg-[#a8451a]/10 text-[#a8451a]"
                  : "border-[#a8451a]/10 text-[#2b1d12]/70 hover:text-[#1c1109]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2b1d12]/67" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, product, review..."
              className="w-full rounded-xl border border-[#a8451a]/10 bg-[#fde3cf]/40 py-2 pl-9 pr-3 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/67 focus:border-[#a8451a]/30 focus:outline-none sm:w-64"
            />
          </div>
          <FilterSelect
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="sm:w-32"
            options={[
              { value: "all", label: "All Ratings" },
              { value: "5", label: "5 Stars" },
              { value: "4", label: "4 Stars" },
              { value: "3", label: "3 Stars" },
              { value: "2", label: "2 Stars" },
              { value: "1", label: "1 Star" },
            ]}
          />
        </div>
      </div>

      <p className="mb-3 text-xs text-[#2b1d12]/70">
        Showing {filtered.length} of {reviews.length} review{reviews.length === 1 ? "" : "s"}.
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-3xl border border-[#a8451a]/20 bg-white/90 py-12 text-center text-sm text-[#2b1d12]/70 backdrop-blur-md">
          No reviews here.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating rating={r.rating} size={13} />
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        r.is_approved
                          ? "bg-green-400/15 text-green-800 border-green-400/20"
                          : "bg-[#a8451a]/10 text-[#a8451a] border-[#a8451a]/20"
                      }`}
                    >
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#2b1d12]/78">{r.review_text || <em className="text-[#2b1d12]/67">No comment</em>}</p>
                  <p className="mt-2 text-sm text-[#2b1d12]/70">
                    {r.profiles?.full_name || r.profiles?.email} on <span className="text-[#2b1d12]/75">{r.products?.name}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!r.is_approved && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={pending}
                      className="flex items-center gap-1 rounded-xl bg-green-400/15 px-3 py-1.5 text-xs font-medium text-green-800 transition-colors hover:bg-green-400/25"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget({ id: r.id, label: `review by ${r.profiles?.full_name || r.profiles?.email || "customer"}` })}
                    disabled={pending}
                    className="rounded-xl p-2 text-[#2b1d12]/70 transition-colors hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
