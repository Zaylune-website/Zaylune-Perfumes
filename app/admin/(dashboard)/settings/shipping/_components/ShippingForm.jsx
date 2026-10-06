"use client";

import { useActionState } from "react";
import { Truck, Check, AlertCircle } from "lucide-react";
import { updateShippingSettings } from "@/actions/admin/shipping";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] transition-colors duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/35";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/70";

export default function ShippingForm({ shipping }) {
  const [state, formAction, pending] = useActionState(updateShippingSettings, {});

  return (
    <form
      action={formAction}
      className="max-w-md space-y-5 rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:p-6 md:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
          <Truck className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base font-bold text-[#1c1109]">Delivery Rates</h2>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-sm text-green-800">
          <Check className="h-4 w-4 shrink-0" /> Shipping settings saved.
        </div>
      )}

      <div>
        <label className={labelClass}>Flat Shipping Rate (₹)</label>
        <input type="number" name="flat_rate" defaultValue={shipping.flat_rate} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Free Shipping Above (₹)</label>
        <input type="number" name="free_threshold" defaultValue={shipping.free_threshold} className={inputClass} />
        <p className="mt-1.5 text-sm text-[#2b1d12]/67">Orders above this amount ship for free.</p>
      </div>
      <div>
        <label className={labelClass}>Cash on Delivery Fee (₹)</label>
        <input type="number" name="cod_charge" defaultValue={shipping.cod_charge} className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="btn-gold w-full py-3 disabled:opacity-60">
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
