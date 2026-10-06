"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Tag } from "lucide-react";
import { toggleCoupon, deleteCoupon } from "@/actions/admin/coupons";

export default function CouponsList({ coupons }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleCoupon(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteCoupon(id);
      router.refresh();
    });
  };

  if (coupons.length === 0) {
    return (
      <div className="rounded-3xl border border-[#a8451a]/20 bg-white/90 py-12 text-center shadow-sm backdrop-blur-xl">
        <p className="text-sm text-[#2b1d12]/70">No coupons yet — create your first one.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-4 shadow-sm backdrop-blur-xl sm:p-6">
      <ul className="space-y-3">
        {coupons.map((c) => {
          const expired = c.expires_at && new Date(c.expires_at) < new Date();
          return (
            <li
              key={c.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#a8451a]/15 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
                <Tag className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-bold tracking-wide text-[#1c1109]">{c.code}</p>
                  {expired && (
                    <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                      Expired
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#2b1d12]/70">
                  {c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}
                  {c.min_purchase > 0 ? ` · min ₹${c.min_purchase}` : ""}
                  {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleDateString("en-IN")}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#a8451a]/10 pt-3 sm:justify-start sm:border-t-0 sm:pt-0">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2b1d12]/75">
                  <input type="checkbox" checked={c.is_active} disabled={pending} onChange={(e) => handleToggle(c.id, e.target.checked)} />
                  Active
                </label>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={pending}
                  className="rounded-xl p-2 text-[#2b1d12]/70 transition-colors hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
