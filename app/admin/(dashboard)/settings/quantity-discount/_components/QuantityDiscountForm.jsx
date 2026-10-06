"use client";

import { useActionState, useState } from "react";
import { Layers, Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import { updateQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] transition-colors duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/35";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/70";

export default function QuantityDiscountForm({ settings }) {
  const [state, formAction, pending] = useActionState(updateQuantityDiscountSettings, {});
  const [enabled, setEnabled] = useState(settings.enabled);
  const [tiers, setTiers] = useState(settings.tiers.map((t) => ({ ...t })));

  const updateTier = (idx, key, value) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [key]: value } : t)));
  };

  const addTier = () => {
    const lastQty = tiers.length > 0 ? Math.max(...tiers.map((t) => Number(t.min_quantity) || 0)) : 0;
    setTiers((prev) => [...prev, { min_quantity: lastQty + 1, discount: 0 }]);
  };

  const removeTier = (idx) => setTiers((prev) => prev.filter((_, i) => i !== idx));

  return (
    <form
      action={formAction}
      className="max-w-xl space-y-5 rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:p-6 md:p-8"
    >
      <input type="hidden" name="tiers" value={JSON.stringify(tiers)} />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
          <Layers className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base font-bold text-[#1c1109]">Cart Quantity Discount</h2>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-sm text-green-800">
          <Check className="h-4 w-4 shrink-0" /> Quantity discount rules saved.
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#a8451a]/20 bg-[#fffaf5] px-4 py-3">
        <input
          type="checkbox"
          name="enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 accent-[#d4651f]"
        />
        <span className="text-sm text-[#1c1109]">Enable automatic quantity discount at checkout</span>
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className={labelClass}>Discount Tiers</label>
          <p className="text-sm text-[#2b1d12]/67">Based on total items in cart (any size/variant)</p>
        </div>

        <div className="space-y-2.5">
          {tiers.map((tier, i) => (
            <div key={i} className="flex items-end gap-2.5 rounded-2xl border border-[#a8451a]/15 bg-white p-3 shadow-sm">
              <div className="flex-1">
                <label className="mb-1 block text-xs uppercase tracking-wide text-[#2b1d12]/67">Min. Items</label>
                <input
                  type="number"
                  min={1}
                  value={tier.min_quantity}
                  onChange={(e) => updateTier(i, "min_quantity", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs uppercase tracking-wide text-[#2b1d12]/67">Discount (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={tier.discount}
                  onChange={(e) => updateTier(i, "discount", e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => removeTier(i)}
                className="mb-0.5 shrink-0 rounded-lg p-2 text-[#2b1d12]/70 transition-colors hover:bg-red-500/10 hover:text-red-600"
                aria-label="Remove tier"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addTier}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/25 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#a8451a] shadow-2xs transition-colors hover:bg-[#fff5ee]"
        >
          <Plus className="h-4 w-4" /> Add Tier
        </button>
      </div>

      <p className="text-sm text-[#2b1d12]/67">
        The highest tier the cart's total item count qualifies for is applied automatically — no coupon code needed. For example, a tier of "5" applies to 5 or more items.
      </p>

      <button type="submit" disabled={pending} className="btn-gold w-full py-3 disabled:opacity-60">
        {pending ? "Saving…" : "Save Rules"}
      </button>
    </form>
  );
}
