"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function RevenueTrendChart({ revenueTrend, periodRevenue }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const maxMonthRevenue = Math.max(...revenueTrend.map((m) => m.revenue), 1);
  const lastIndex = revenueTrend.length - 1;
  const active = activeIndex ?? lastIndex;
  const activeMonth = revenueTrend[active];

  return (
    <div className="rounded-3xl border border-[#a8451a]/20 bg-white/90 backdrop-blur-xl shadow-sm p-4 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1c1109]">Revenue — Last 6 Months</h2>
          <p className="mt-1 text-xs font-semibold text-[#2b1d12]/55">
            ₹{periodRevenue.toLocaleString("en-IN")} earned in this period
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-50 text-emerald-700">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>

      {/* Readout for whichever month is active (hovered, focused, or tapped) */}
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-2xl border border-[#a8451a]/15 bg-[#fffaf5] px-3 py-2.5 transition-colors duration-200 sm:px-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#a8451a]">
          {activeMonth.month === revenueTrend[lastIndex].month
            ? "This Month"
            : new Date(`${activeMonth.month}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })}
        </span>
        <span className="text-sm font-extrabold text-[#1c1109]">
          ₹{activeMonth.revenue.toLocaleString("en-IN")}
          <span className="ml-2 text-xs font-semibold text-[#2b1d12]/50">
            {activeMonth.orders} order{activeMonth.orders === 1 ? "" : "s"}
          </span>
        </span>
      </div>

      <div className="flex h-32 sm:h-40 items-end justify-between gap-1.5 sm:gap-3">
        {revenueTrend.map((m, i) => {
          const isCurrentMonth = i === lastIndex;
          const isActive = i === active;
          const heightPct = Math.max((m.revenue / maxMonthRevenue) * 100, m.revenue > 0 ? 6 : 3);
          return (
            <button
              key={m.month}
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              onClick={() => setActiveIndex((cur) => (cur === i ? null : i))}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#a8451a]/50"
            >
              <div className="flex h-full w-full items-end">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg transition-all duration-300 ease-out ${
                    isActive
                      ? "bg-gradient-to-t from-[#a8451a] to-[#d4651f] scale-x-110 shadow-[0_0_16px_-2px_rgba(192,74,28,0.5)]"
                      : isCurrentMonth
                        ? "bg-gradient-to-t from-[#a8451a]/70 to-[#d4651f]/70"
                        : "bg-gradient-to-t from-[#c04a1c]/25 to-[#d4a359]/25"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-bold uppercase transition-colors duration-200 ${
                  isActive ? "text-[#a8451a]" : "text-[#2b1d12]/45"
                }`}
              >
                {isCurrentMonth ? "This Month" : new Date(`${m.month}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
