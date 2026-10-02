"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import FilterSelect from "@/components/admin/FilterSelect";

const STATUS_STYLES = {
  pending: "bg-ivory/10 text-ivory/70 border-ivory/15",
  processing: "bg-gold-400/15 text-gold-200 border-gold-400/20",
  shipped: "bg-blue-400/15 text-blue-300 border-blue-400/20",
  delivered: "bg-green-400/15 text-green-300 border-green-400/20",
  cancelled: "bg-red-400/15 text-red-300 border-red-400/20",
};

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrdersList({ orders }) {
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "all" && o.order_status !== status) return false;
      if (payment !== "all" && (o.payment_method === "COD" ? "cod" : "online") !== payment) return false;
      if (term) {
        const haystack = [o.order_number, o.profiles?.full_name, o.profiles?.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [orders, status, payment, search]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors duration-300 ${
                status === t.key
                  ? "border-gold-400/30 bg-gold-400/10 text-gold-200"
                  : "border-gold-400/10 text-ivory/40 hover:text-ivory"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ivory/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, name, email..."
              className="w-full rounded-xl border border-gold-400/10 bg-ink-soft/40 py-2 pl-9 pr-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400/30 focus:outline-none sm:w-64"
            />
          </div>
          <FilterSelect
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="sm:w-40"
            options={[
              { value: "all", label: "All Payments" },
              { value: "cod", label: "COD" },
              { value: "online", label: "Online" },
            ]}
          />
        </div>
      </div>

      <p className="mb-3 text-xs text-ivory/40">
        Showing {filtered.length} of {orders.length} order{orders.length === 1 ? "" : "s"}.
      </p>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ivory/40">No orders match these filters.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/10 text-xs uppercase tracking-widest text-ivory/40 font-semibold">
                <th className="pb-4 font-medium pl-2">Order</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Payment</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {filtered.map((o) => (
                <tr key={o.id} className="group/row transition-colors duration-300 hover:bg-white/[0.01]">
                  <td className="py-4 pr-4 pl-2">
                    <Link href={`/admin/orders/${o.id}`} className="text-sm font-medium text-ivory group-hover/row:text-gold-200 transition-colors">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivory/60">{o.profiles?.full_name || o.profiles?.email || "—"}</td>
                  <td className="py-4 pr-4 text-sm text-ivory/45">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-4 pr-4 text-sm capitalize text-ivory/60">
                    {o.payment_method === "COD" ? "COD" : "Online"} · {o.payment_status}
                  </td>
                  <td className="py-4 pr-4 text-sm font-semibold text-ivory">₹{Number(o.total_amount).toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gold-400/15 bg-gold-400/5 px-3 py-2 text-xs font-semibold text-gold-200 transition-all duration-300 hover:border-gold-300/40 hover:bg-gold-400/10"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ivory/40">No orders match these filters.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="block rounded-2xl border border-gold-400/10 bg-white/[0.02] p-4 transition-colors hover:bg-gold-400/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-ivory">{o.order_number}</span>
                    <span className="text-sm font-semibold text-ivory">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-ivory/50">{o.profiles?.full_name || o.profiles?.email || "—"}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                    <span className="rounded-full border border-ivory/10 bg-ivory/5 px-2.5 py-1 text-xs font-semibold capitalize text-ivory/50">
                      {o.payment_method === "COD" ? "COD" : "Online"} · {o.payment_status}
                    </span>
                    <span className="ml-auto text-sm text-ivory/30">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
