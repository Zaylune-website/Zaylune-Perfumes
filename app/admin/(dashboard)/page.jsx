import Link from "next/link";
import { headers } from "next/headers";
import {
  ShoppingCart,
  Package,
  Users,
  IndianRupee,
  ArrowUpRight,
  ChevronRight,
  PlusCircle,
  Tag,
  Settings,
  Star,
  MessageSquare,
  LayoutTemplate,
  Sparkles,
  Clock,
} from "lucide-react";
import { getDashboardStats } from "@/actions/admin/dashboard";
import RevenueTrendChart from "@/components/admin/RevenueTrendChart";

const QUICK_ACTIONS = [
  { label: "Add Product", href: "/admin/products/new", icon: PlusCircle, tone: "from-[#c04a1c] to-[#d4651f]" },
  { label: "View Orders", href: "/admin/orders", icon: ShoppingCart, tone: "from-sky-600 to-sky-500" },
  { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate, tone: "from-violet-600 to-violet-500" },
  { label: "Coupons", href: "/admin/settings/coupons", icon: Tag, tone: "from-emerald-600 to-emerald-500" },
  { label: "Site Settings", href: "/admin/settings", icon: Settings, tone: "from-[#2b1d12] to-[#4a3220]" },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-500/25",
  processing: "bg-amber-100/80 text-amber-900 border-amber-500/35",
  shipped: "bg-blue-50 text-blue-900 border-blue-500/30",
  delivered: "bg-emerald-50 text-emerald-900 border-emerald-500/30",
  cancelled: "bg-rose-50 text-rose-900 border-rose-500/30",
};

const cardClass =
  "rounded-3xl border border-[#a8451a]/20 bg-white/90 backdrop-blur-xl shadow-sm";

// Gemstone-inspired accent per stat — keeps the luxury feel while giving
// each number its own identity at a glance instead of four identical cards.
const STAT_TONES = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-700 border-emerald-500/25",
    glow: "bg-emerald-500/10",
    value: "from-emerald-700 via-emerald-600 to-emerald-500",
  },
  copper: {
    icon: "bg-[#fde3cf]/60 text-[#c04a1c] border-[#a8451a]/20",
    glow: "bg-[#c04a1c]/10",
    value: "from-[#7a2812] via-[#c04a1c] to-[#d4651f]",
  },
  violet: {
    icon: "bg-violet-50 text-violet-700 border-violet-500/25",
    glow: "bg-violet-500/10",
    value: "from-violet-800 via-violet-700 to-violet-500",
  },
  rose: {
    icon: "bg-rose-50 text-rose-700 border-rose-500/25",
    glow: "bg-rose-500/10",
    value: "from-rose-800 via-rose-700 to-rose-500",
  },
};

function formatRelativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const ORDER_STATUS_ORDER = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_BAR_COLORS = {
  pending: "bg-amber-500",
  processing: "bg-amber-600",
  shipped: "bg-blue-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  const [stats, headerList] = await Promise.all([getDashboardStats(), headers()]);
  const encodedName = headerList.get("x-admin-name");
  const adminName = encodedName ? decodeURIComponent(encodedName).split(" ")[0] : "Admin";

  const cards = [
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, tone: "emerald" },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingCart, sub: `${stats.pendingOrders} pending`, tone: "copper" },
    { label: "Products", value: stats.productCount, icon: Package, tone: "violet" },
    { label: "Users", value: stats.customerCount, icon: Users, tone: "rose" },
  ];

  const attentionItems = [
    {
      href: "/admin/reviews",
      label: "Reviews to approve",
      count: stats.pendingReviewCount,
      icon: Star,
      tone: "bg-amber-100 text-amber-800",
      badge: "border-amber-500/30 bg-amber-50 text-amber-900",
    },
    {
      href: "/admin/inquiries",
      label: "Unresolved inquiries",
      count: stats.unresolvedInquiryCount,
      icon: MessageSquare,
      tone: "bg-blue-100 text-blue-800",
      badge: "border-blue-500/30 bg-blue-50 text-blue-900",
    },
    {
      href: "/admin/orders",
      label: "Orders pending",
      count: stats.pendingOrders,
      icon: ShoppingCart,
      tone: "bg-rose-100 text-rose-800",
      badge: "border-rose-500/30 bg-rose-50 text-rose-900",
    },
  ];

  const periodRevenue = stats.revenueTrend.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#d4a359]/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              Store Overview
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
              {getGreeting()},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                {adminName}
              </span>
            </h1>
            <p className="mt-1.5 text-base font-medium text-[#2b1d12]/75">Here&apos;s how the store is doing today.</p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-2xl border border-[#a8451a]/15 bg-white/70 px-4 py-2.5 text-xs font-semibold text-[#2b1d12]/70 md:self-auto">
            <Clock className="h-3.5 w-3.5 text-[#a8451a]" />
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {cards.map((c) => {
          const tone = STAT_TONES[c.tone];
          return (
            <div
              key={c.label}
              className={`group relative overflow-hidden ${cardClass} p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#a8451a]/40 hover:shadow-md`}
            >
              <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${tone.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />

              <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border shadow-2xs transition-transform duration-300 group-hover:scale-105 ${tone.icon}`}>
                <c.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <p className="mt-3 sm:mt-5 truncate text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#a8451a]">{c.label}</p>
              <p className={`mt-1 sm:mt-1.5 truncate font-display text-xl sm:text-3xl font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r ${tone.value}`}>
                {c.value}
              </p>
              {c.sub && (
                <p className="mt-2 sm:mt-3 flex w-fit items-center gap-1.5 truncate rounded-full border border-emerald-500/30 bg-emerald-50 px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold text-emerald-800">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {c.sub}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Needs Attention */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className={`${cardClass} p-4 sm:p-6`}>
          <h2 className="mb-4 font-display text-lg sm:text-xl font-extrabold text-[#1c1109]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#a8451a]/15 bg-[#fffaf5] px-2 py-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a8451a]/40 hover:bg-[#fde3cf]/40 hover:shadow-sm sm:px-3 sm:py-5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${a.tone}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-[#2b1d12]/80 group-hover:text-[#a8451a] sm:text-sm">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={`${cardClass} p-4 sm:p-6`}>
          <h2 className="mb-4 font-display text-lg sm:text-xl font-extrabold text-[#1c1109]">Needs Attention</h2>
          <div className="space-y-3">
            {attentionItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#a8451a]/15 bg-[#fffaf5] px-3.5 py-3.5 transition-all hover:border-[#a8451a]/40 hover:bg-[#fde3cf]/40 sm:px-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-semibold text-[#2b1d12]/80 group-hover:text-[#1c1109]">{item.label}</span>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${item.badge}`}>{item.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trend + Order Status */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RevenueTrendChart revenueTrend={stats.revenueTrend} periodRevenue={periodRevenue} />

        <div className={`${cardClass} p-4 sm:p-6`}>
          <h2 className="mb-5 font-display text-lg sm:text-xl font-extrabold text-[#1c1109]">Order Status</h2>
          <div className="space-y-4">
            {ORDER_STATUS_ORDER.map((status) => {
              const count = stats.orderStatusCounts[status] || 0;
              const pct = stats.orderCount > 0 ? (count / stats.orderCount) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                    <span className="capitalize text-[#2b1d12]/75">{status}</span>
                    <span className="text-[#1c1109]">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#fde3cf]/60">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${STATUS_BAR_COLORS[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <div className={`${cardClass} p-4 sm:p-6 md:p-8`}>
          <div className="mb-3 flex items-center justify-between sm:mb-6">
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1c1109]">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a8451a] transition-colors hover:text-[#782c0c]"
            >
              View all <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="py-12 text-center text-sm font-medium text-[#2b1d12]/70">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-[#a8451a]/10">
              {stats.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="group -mx-2 flex items-center justify-between gap-3 rounded-2xl px-2 py-3 text-sm transition-all duration-300 hover:bg-[#fde3cf]/40 sm:-mx-3 sm:px-3 sm:py-4"
                  >
                    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#a8451a]/20 bg-[#fde3cf]/50 text-[#c04a1c] shadow-2xs transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10 sm:rounded-2xl">
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-bold text-[#1c1109] transition-colors group-hover:text-[#a8451a] sm:text-base">{o.order_number}</span>
                        <span className="block text-[11px] font-medium text-[#2b1d12]/55 sm:text-xs">{formatRelativeTime(o.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-sm font-bold text-[#1c1109] sm:text-base">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize sm:px-3 sm:py-1 sm:text-xs ${
                          STATUS_STYLES[o.order_status] || "border-[#a8451a]/20 bg-white text-[#2b1d12]/75"
                        }`}
                      >
                        {o.order_status}
                      </span>
                      <ChevronRight className="hidden h-4 w-4 text-[#a8451a]/60 transition-transform group-hover:translate-x-1 group-hover:text-[#a8451a] sm:block" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
