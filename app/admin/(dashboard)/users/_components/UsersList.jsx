"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FilterSelect from "@/components/admin/FilterSelect";

const ROLE_STYLES = {
  admin: "border-gold-400/25 bg-gold-400/10 text-gold-300",
  customer: "border-ivory/15 bg-ivory/5 text-ivory/60",
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
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ivory/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full rounded-xl border border-gold-400/10 bg-ink-soft/40 py-2 pl-9 pr-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400/30 focus:outline-none"
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

      <p className="mb-3 text-xs text-ivory/40">
        Showing {filtered.length} of {users.length} user{users.length === 1 ? "" : "s"}.
      </p>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ivory/40">No users match these filters.</p>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/10 text-xs uppercase tracking-widest text-ivory/40 font-semibold">
                <th className="pb-4 font-medium pl-2">Name</th>
                <th className="pb-4 font-medium">Role</th>
                <th className="pb-4 font-medium">Contact</th>
                <th className="pb-4 font-medium">Orders</th>
                <th className="pb-4 font-medium">Total Spend</th>
                <th className="pb-4 font-medium pr-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors duration-300 hover:bg-white/[0.01]">
                  <td className="py-4 pr-4 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ivory">{u.full_name || "—"}</span>
                      {u.orderCount > 1 && (
                        <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-300">
                          VIP
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivory/60">
                    <p>{u.email}</p>
                    {u.phone && <p className="text-ivory/35">{u.phone}</p>}
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivory/70">{u.orderCount}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-ivory">₹{u.totalSpend.toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-2 text-sm text-ivory/45">
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
          <p className="py-12 text-center text-sm text-ivory/40">No users match these filters.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((u) => (
              <li key={u.id} className="rounded-2xl border border-gold-400/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-medium text-ivory">{u.full_name || "—"}</span>
                    {u.orderCount > 1 && (
                      <span className="shrink-0 rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-300">
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ivory">₹{u.totalSpend.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                    {u.role}
                  </span>
                  <p className="truncate text-sm text-ivory/50">{u.email}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-ivory/40">
                  <span>{u.orderCount} order{u.orderCount === 1 ? "" : "s"}</span>
                  <span>Joined {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
