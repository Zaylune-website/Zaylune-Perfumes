import Link from "next/link";
import { Plus, Package, CheckCircle2, PackageX, AlertTriangle } from "lucide-react";
import { getAllProductsAdmin } from "@/actions/admin/products";
import ProductsList from "./_components/ProductsList";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  const activeCount = products.filter((p) => p.is_active).length;
  const outOfStockCount = products.filter((p) => p.totalStock === 0).length;
  const lowStockCount = products.filter((p) => p.totalStock > 0 && p.totalStock <= 5).length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package },
    { label: "Active", value: activeCount, icon: CheckCircle2 },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle },
    { label: "Out of Stock", value: outOfStockCount, icon: PackageX },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-400/10 pb-6">
        <div>
          <h1 className="font-display text-3xl font-light text-ivory">
            Manage <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Products</span>
          </h1>
          <p className="text-sm text-ivory/50 font-light mt-1">
            {products.length} product{products.length === 1 ? "" : "s"} in your catalogue.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-gold group flex w-full items-center justify-center gap-1.5 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase shadow-[0_4px_15px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_20px_rgba(212,163,89,0.25)] hover:-translate-y-0.5 transition-all duration-300 sm:w-auto"
        >
          <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> New Product
        </Link>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 px-4 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none text-ivory">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ivory/40">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <ProductsList products={products} />
    </div>
  );
}
