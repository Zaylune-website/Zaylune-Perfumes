import Link from "next/link";
import { Plus, Package, CheckCircle2, PackageX, AlertTriangle, Sparkles } from "lucide-react";
import { getAllProductsAdmin } from "@/actions/admin/products";
import ProductsList from "./_components/ProductsList";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  const activeCount = products.filter((p) => p.is_active).length;
  const outOfStockCount = products.filter((p) => p.totalStock === 0).length;
  const lowStockCount = products.filter((p) => p.totalStock > 0 && p.totalStock <= 5).length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, tone: "text-[#c04a1c] bg-[#fde3cf]" },
    { label: "Active", value: activeCount, icon: CheckCircle2, tone: "text-emerald-800 bg-emerald-100" },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle, tone: "text-amber-800 bg-amber-100" },
    { label: "Out of Stock", value: outOfStockCount, icon: PackageX, tone: "text-rose-800 bg-rose-100" },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              Catalog
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
              Manage{" "}
              <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="mt-1.5 text-base font-medium text-[#2b1d12]/75">
              {products.length} product{products.length === 1 ? "" : "s"} in your catalogue.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 sm:w-auto"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> New Product
          </Link>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group flex items-center gap-2.5 rounded-2xl border border-[#a8451a]/20 bg-white/90 px-3 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:gap-3.5 sm:px-4 sm:py-4"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${s.tone}`}>
              <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-extrabold leading-none text-[#1c1109] sm:text-2xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#a8451a] sm:text-[11px] sm:tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <ProductsList products={products} />
    </div>
  );
}
