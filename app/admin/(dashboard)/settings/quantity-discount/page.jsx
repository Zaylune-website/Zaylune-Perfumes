import { Sparkles } from "lucide-react";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import QuantityDiscountForm from "./_components/QuantityDiscountForm";

export const metadata = { title: "Quantity Discount Settings" };

export default async function AdminQuantityDiscountPage() {
  const settings = await getQuantityDiscountSettings();

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            Automatic
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
            Quantity{" "}
            <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">Discount</span>
          </h1>
          <p className="mt-1.5 text-sm sm:text-base font-medium text-[#2b1d12]/75">
            Automatic discount based on total cart quantity — applies store-wide, no coupon code required.
          </p>
        </div>
      </div>
      <QuantityDiscountForm settings={settings} />
    </div>
  );
}
