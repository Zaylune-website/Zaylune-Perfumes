"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Table, List } from "lucide-react";
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
  const [view, setView] = useState("table");

  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setView("list");
  }, []);

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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8451a]/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-[#a8451a]/25 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/40 shadow-2xs focus:border-[#a8451a] focus:outline-none"
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

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[#2b1d12]/70">
          Showing {filtered.length} of {products.length} product{products.length === 1 ? "" : "s"}.
        </p>
        <div className="inline-flex rounded-full border border-[#a8451a]/25 bg-white p-1 shadow-2xs">
          {[
            { key: "table", label: "Table", Icon: Table },
            { key: "list", label: "List", Icon: List },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                view === key
                  ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#c04a1c] text-white shadow-sm"
                  : "text-[#a8451a] hover:bg-[#fde3cf]/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "table" && (
      <div className="overflow-x-auto thin-x-scroll rounded-3xl border border-[#a8451a]/20 bg-white/90 p-4 shadow-sm backdrop-blur-xl sm:p-6 md:p-8">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#2b1d12]/70">No products match these filters.</p>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#a8451a]/15 text-xs font-bold uppercase tracking-widest text-[#a8451a]">
                <th className="pb-4 font-bold pl-2">Name</th>
                <th className="pb-4 font-bold">Category</th>
                <th className="pb-4 font-bold">From</th>
                <th className="pb-4 font-bold">Stock</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a8451a]/10">
              {filtered.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        )}
      </div>
      )}

      {view === "list" && (
      <div className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-4 shadow-sm backdrop-blur-xl sm:p-5">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm font-medium text-[#2b1d12]/70">No products match these filters.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        )}
      </div>
      )}
    </div>
  );
}
