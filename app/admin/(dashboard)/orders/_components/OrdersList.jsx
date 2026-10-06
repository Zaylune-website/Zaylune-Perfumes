"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search, Table, List } from "lucide-react";
import FilterSelect from "@/components/admin/FilterSelect";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-500/25",
  processing: "bg-amber-100/80 text-amber-900 border-amber-500/35",
  shipped: "bg-blue-50 text-blue-900 border-blue-500/30",
  delivered: "bg-emerald-50 text-emerald-900 border-emerald-500/30",
  cancelled: "bg-rose-50 text-rose-900 border-rose-500/30",
};

const PAYMENT_STYLES = {
  paid: "bg-emerald-50 text-emerald-800 border-emerald-500/30",
  pending: "bg-amber-50 text-amber-800 border-amber-500/30",
  failed: "bg-rose-50 text-rose-800 border-rose-500/30",
};

function PaymentBadges({ method, status }) {
  const key = String(status || "pending").toLowerCase();
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="rounded-full border border-[#1c1109]/15 bg-[#1c1109]/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#2b1d12]/80">
        {method === "COD" ? "COD" : "Online"}
      </span>
      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${PAYMENT_STYLES[key] || PAYMENT_STYLES.pending}`}>
        {key}
      </span>
    </span>
  );
}

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
  const [view, setView] = useState("table");

  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setView("list");
  }, []);

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
                  ? "border-[#a8451a]/30 bg-[#a8451a]/10 text-[#a8451a]"
                  : "border-[#a8451a]/10 text-[#2b1d12]/70 hover:text-[#1c1109]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8451a]/70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, name, email..."
              className="w-full rounded-full border border-[#a8451a]/25 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/40 shadow-2xs focus:border-[#a8451a] focus:outline-none sm:w-72"
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

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-[#2b1d12]/70">
          Showing {filtered.length} of {orders.length} order{orders.length === 1 ? "" : "s"}.
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
      <div className="overflow-x-auto thin-x-scroll rounded-3xl border border-[#a8451a]/10 bg-white/90 p-4 backdrop-blur-md shadow-sm sm:p-6 md:p-8">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#2b1d12]/70">No orders match these filters.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#a8451a]/10 text-xs uppercase tracking-widest text-[#2b1d12]/70 font-semibold">
                <th className="pb-4 font-medium pl-2">Order</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Payment</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a8451a]/5">
              {filtered.map((o) => (
                <tr key={o.id} className="group/row transition-colors duration-300 hover:bg-[#1c1109]/[0.01]">
                  <td className="py-4 pr-4 pl-2">
                    <Link href={`/admin/orders/${o.id}`} className="text-sm font-medium text-[#1c1109] group-hover/row:text-[#a8451a] transition-colors">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-sm text-[#2b1d12]/75">{o.profiles?.full_name || o.profiles?.email || "—"}</td>
                  <td className="py-4 pr-4 text-sm text-[#2b1d12]/71">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-4 pr-4 text-sm capitalize text-[#2b1d12]/75">
                    <PaymentBadges method={o.payment_method} status={o.payment_status} />
                  </td>
                  <td className="py-4 pr-4 text-sm font-semibold text-[#1c1109]">₹{Number(o.total_amount).toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs transition-all duration-300 hover:border-[#a8451a] hover:bg-[#fff5ee]"
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
      )}

      {view === "list" && (
      <div className="rounded-3xl border border-[#a8451a]/10 bg-white/90 p-4 backdrop-blur-md shadow-sm sm:p-5">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#2b1d12]/70">No orders match these filters.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="block rounded-2xl border border-[#a8451a]/10 bg-[#1c1109]/[0.02] p-4 transition-colors hover:bg-[#a8451a]/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[#1c1109]">{o.order_number}</span>
                    <span className="text-sm font-semibold text-[#1c1109]">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-[#2b1d12]/72">{o.profiles?.full_name || o.profiles?.email || "—"}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                    <span className="rounded-full border border-[#1c1109]/10 bg-[#1c1109]/5 px-2.5 py-1 text-xs font-semibold capitalize text-[#2b1d12]/72">
                      <PaymentBadges method={o.payment_method} status={o.payment_status} />
                    </span>
                    <span className="ml-auto text-sm text-[#2b1d12]/67">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#a8451a]">
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      )}
    </div>
  );
}
