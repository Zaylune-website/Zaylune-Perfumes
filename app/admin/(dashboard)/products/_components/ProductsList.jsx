"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FilterSelect from "@/components/admin/FilterSelect";
import ProductRow from "./ProductRow";
import ProductCard from "./ProductCard";

function stockTier(product) {
  if (product.totalStock === 0) return "out";
  if (product.totalStock <= 5) return "low";
  return "in";
}

export default function ProductsList({ products }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");

  const categories = useMemo(() => {
    const names = new Set(products.map((p) => p.categoryName).filter(Boolean));
    return [...names].sort();
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (term && !p.name.toLowerCase().includes(term)) return false;
      if (category !== "all" && p.categoryName !== category) return false;
      if (status !== "all" && (status === "active") !== p.is_active) return false;
      if (stock !== "all" && stockTier(p) !== stock) return false;
      return true;
    });
  }, [products, search, category, status, stock]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ivory/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-gold-400/10 bg-ink-soft/40 py-2 pl-9 pr-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400/30 focus:outline-none"
          />
        </div>
        <FilterSelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:w-44"
          options={[{ value: "all", label: "All Categories" }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
        <FilterSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:w-36"
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "hidden", label: "Hidden" },
          ]}
        />
        <FilterSelect
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="sm:w-40"
          options={[
            { value: "all", label: "All Stock" },
            { value: "in", label: "In Stock" },
            { value: "low", label: "Low Stock" },
            { value: "out", label: "Out of Stock" },
          ]}
        />
      </div>

      <p className="mb-3 text-xs text-ivory/40">
        Showing {filtered.length} of {products.length} product{products.length === 1 ? "" : "s"}.
      </p>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ivory/40">No products match these filters.</p>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/10 text-sm uppercase tracking-widest text-ivory/40 font-semibold">
                <th className="pb-4 font-medium pl-2">Name</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">From</th>
                <th className="pb-4 font-medium">Stock</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {filtered.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ivory/40">No products match these filters.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
