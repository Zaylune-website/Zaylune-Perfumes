import { PackagePlus, Package, CheckCircle2, PackageX, Radio, Sparkles } from "lucide-react";
import { getBundleSettingsAdmin, getBundleItemsAdmin } from "@/actions/admin/bundle";
import BundleSettingsForm from "./_components/BundleSettingsForm";
import BundleItemsManager from "./_components/BundleItemsManager";

export const metadata = { title: "Gift Set Builder" };

const cardClass = "rounded-3xl border border-[#a8451a]/20 bg-white/90 backdrop-blur-xl shadow-sm";

const STAT_TONES = {
  copper: "bg-[#fde3cf]/60 text-[#c04a1c] border-[#a8451a]/20",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-500/25",
  rose: "bg-rose-50 text-rose-700 border-rose-500/25",
  violet: "bg-violet-50 text-violet-700 border-violet-500/25",
};

export default async function AdminBundlePage() {
  const [settings, items] = await Promise.all([getBundleSettingsAdmin(), getBundleItemsAdmin()]);

  const inStockCount = items.filter((i) => (i.stock ?? 0) > 0).length;
  const outOfStockCount = items.length - inStockCount;

  const stats = [
    { label: "Total Products", value: items.length, icon: Package, tone: "copper" },
    { label: "In Stock", value: inStockCount, icon: CheckCircle2, tone: "emerald" },
    { label: "Out of Stock", value: outOfStockCount, icon: PackageX, tone: "rose" },
    { label: "Gift Set Page", value: settings.enabled ? "Live" : "Hidden", icon: Radio, tone: "violet" },
  ];

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              Gift Sets
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
              Gift Set{" "}
              <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">
                Builder
              </span>
            </h1>
            <p className="mt-1.5 text-sm sm:text-base font-medium text-[#2b1d12]/75">
              Let customers pick any N bottles and build their own gift set at <span className="font-mono text-[#a8451a]">/bundle</span>.
            </p>
          </div>
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-white text-[#c04a1c] shadow-sm sm:flex">
            <PackagePlus className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`group relative overflow-hidden ${cardClass} flex items-center gap-3 p-3.5 sm:gap-3.5 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border shadow-2xs transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10 ${STAT_TONES[s.tone]}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl sm:text-2xl font-extrabold leading-none text-[#1c1109]">{s.value}</p>
              <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase leading-tight tracking-wide text-[#a8451a]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <BundleSettingsForm settings={settings} />
        <BundleItemsManager items={items} />
      </div>
    </div>
  );
}
