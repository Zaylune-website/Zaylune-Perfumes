import Link from "next/link";
import { Plus, FolderTree, CheckCircle2, EyeOff, PackageX, Sparkles } from "lucide-react";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import CategoryRow from "./_components/CategoryRow";
import CategoryCard from "./_components/CategoryCard";

export const metadata = { title: "Categories" };

const cardClass = "rounded-3xl border border-[#a8451a]/20 bg-white/90 backdrop-blur-xl shadow-sm";

const STAT_TONES = {
  copper: "bg-[#fde3cf]/60 text-[#c04a1c] border-[#a8451a]/20",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-500/25",
  rose: "bg-rose-50 text-rose-700 border-rose-500/25",
  violet: "bg-violet-50 text-violet-700 border-violet-500/25",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  const activeCount = categories.filter((c) => c.is_active).length;
  const emptyCount = categories.filter((c) => c.product_count === 0).length;

  const stats = [
    { label: "Total Categories", value: categories.length, icon: FolderTree, tone: "copper" },
    { label: "Active", value: activeCount, icon: CheckCircle2, tone: "emerald" },
    { label: "Hidden", value: categories.length - activeCount, icon: EyeOff, tone: "rose" },
    { label: "Empty", value: emptyCount, icon: PackageX, tone: "violet" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              Catalog
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
              Store{" "}
              <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">
                Categories
              </span>
            </h1>
            <p className="mt-1.5 text-base font-medium text-[#2b1d12]/75">Organize fragrances by concentration or collection.</p>
          </div>
          <Link
            href="/admin/categories/new"
            className="btn-gold group flex w-full items-center justify-center gap-1.5 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> New Category
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`group relative overflow-hidden ${cardClass} flex items-center gap-3.5 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-2xs transition-transform duration-300 group-hover:scale-105 ${STAT_TONES[s.tone]}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-2xl font-extrabold leading-none text-[#1c1109]">{s.value}</p>
              <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-widest text-[#a8451a] sm:text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table (sm and up) */}
      <div className={`hidden overflow-x-auto thin-x-scroll ${cardClass} p-6 md:p-8 sm:block`}>
        {categories.length === 0 ? (
          <p className="py-12 text-center text-sm font-medium text-[#2b1d12]/70">No categories yet — create your first one.</p>
        ) : (
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#a8451a]/15 text-xs font-bold uppercase tracking-widest text-[#a8451a]">
                <th className="pb-4 pl-2 font-bold">Name</th>
                <th className="pb-4 font-bold">Slug</th>
                <th className="pb-4 font-bold">Products</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 pr-2 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a8451a]/10">
              {categories.map((cat) => (
                <CategoryRow key={cat.id} category={cat} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cards (mobile) */}
      <div className={`${cardClass} p-4 sm:hidden`}>
        {categories.length === 0 ? (
          <p className="py-12 text-center text-sm font-medium text-[#2b1d12]/70">No categories yet — create your first one.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
