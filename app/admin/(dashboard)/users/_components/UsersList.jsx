"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Table, List } from "lucide-react";
import FilterSelect from "@/components/admin/FilterSelect";

const ROLE_STYLES = {
  admin: "border-[#a8451a]/25 bg-[#a8451a]/10 text-[#a8451a]",
  customer: "border-[#1c1109]/15 bg-[#1c1109]/5 text-[#2b1d12]/75",
};

const SORTERS = {
  newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  spend: (a, b) => b.totalSpend - a.totalSpend,
  orders: (a, b) => b.orderCount - a.orderCount,
};

export default function UsersList({ users }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("table");

  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setView("list");
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((u) => {
        if (role !== "all" && u.role !== role) return false;
        if (term) {
          const haystack = [u.full_name, u.email, u.phone].filter(Boolean).join(" ").toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        return true;
      })
      .sort(SORTERS[sort]);
  }, [users, search, role, sort]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2b1d12]/67" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full rounded-xl border border-[#a8451a]/10 bg-[#fde3cf]/40 py-2 pl-9 pr-3 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/67 focus:border-[#a8451a]/30 focus:outline-none"
          />
        </div>
        <FilterSelect
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="sm:w-36"
          options={[
            { value: "all", label: "All Roles" },
            { value: "customer", label: "Customer" },
            { value: "admin", label: "Admin" },
          ]}
        />
        <FilterSelect
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sm:w-44"
          options={[
            { value: "newest", label: "Sort: Newest" },
            { value: "spend", label: "Sort: Highest Spend" },
            { value: "orders", label: "Sort: Most Orders" },
          ]}
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-xs text-[#2b1d12]/70">
        Showing {filtered.length} of {users.length} user{users.length === 1 ? "" : "s"}.
      </p>
      <div className="inline-flex rounded-full border border-[#a8451a]/25 bg-white p-1 shadow-2xs">
        {[{ key: "table", label: "Table", Icon: Table }, { key: "list", label: "List", Icon: List }].map(({ key, label, Icon }) => (
          <button key={key} type="button" onClick={() => setView(key)} aria-pressed={view === key} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${view === key ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#c04a1c] text-white shadow-sm" : "text-[#a8451a] hover:bg-[#fde3cf]/60"}`}>
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
      </div>

      {view === "table" && (
      /* Table (sm and up) */
      <div className="overflow-x-auto thin-x-scroll rounded-3xl border border-[#a8451a]/10 bg-white/90 p-4 backdrop-blur-md shadow-sm sm:p-6 md:p-8">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#2b1d12]/70">No users match these filters.</p>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#a8451a]/10 text-sm uppercase tracking-widest text-[#2b1d12]/70 font-semibold">
                <th className="pb-4 font-medium pl-2">Name</th>
                <th className="pb-4 font-medium">Role</th>
                <th className="pb-4 font-medium">Contact</th>
                <th className="pb-4 font-medium">Orders</th>
                <th className="pb-4 font-medium">Total Spend</th>
                <th className="pb-4 font-medium pr-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a8451a]/5">
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors duration-300 hover:bg-[#1c1109]/[0.01]">
                  <td className="py-4 pr-4 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-[#1c1109]">{u.full_name || "—"}</span>
                      {u.orderCount > 1 && (
                        <span className="rounded-full border border-[#a8451a]/20 bg-[#a8451a]/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#a8451a]">
                          VIP
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-sm font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-base text-[#2b1d12]/75">
                    <p>{u.email}</p>
                    {u.phone && <p className="text-[#2b1d12]/68">{u.phone}</p>}
                  </td>
                  <td className="py-4 pr-4 text-base text-[#2b1d12]/78">{u.orderCount}</td>
                  <td className="py-4 pr-4 text-base font-medium text-[#1c1109]">₹{u.totalSpend.toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-2 text-base text-[#2b1d12]/71">
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
          <p className="py-12 text-center text-sm text-[#2b1d12]/70">No users match these filters.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((u) => (
              <li key={u.id} className="rounded-2xl border border-[#a8451a]/10 bg-[#1c1109]/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-medium text-[#1c1109]">{u.full_name || "—"}</span>
                    {u.orderCount > 1 && (
                      <span className="shrink-0 rounded-full border border-[#a8451a]/20 bg-[#a8451a]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#a8451a]">
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#1c1109]">₹{u.totalSpend.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                    {u.role}
                  </span>
                  <p className="truncate text-sm text-[#2b1d12]/72">{u.email}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-[#2b1d12]/70">
                  <span>{u.orderCount} order{u.orderCount === 1 ? "" : "s"}</span>
                  <span>Joined {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      )}
    </div>
  );
}
