import { ShoppingCart, Clock, Truck, XCircle, Sparkles } from "lucide-react";
import { getAllOrdersAdmin } from "@/actions/admin/orders";
import OrdersList from "./_components/OrdersList";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();

  const pendingCount = orders.filter((o) => o.order_status === "pending").length;
  const shippedCount = orders.filter((o) => o.order_status === "shipped").length;
  const cancelledCount = orders.filter((o) => o.order_status === "cancelled").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, tone: "text-[#c04a1c] bg-[#fde3cf]" },
    { label: "Pending", value: pendingCount, icon: Clock, tone: "text-amber-800 bg-amber-100" },
    { label: "Shipped", value: shippedCount, icon: Truck, tone: "text-blue-800 bg-blue-100" },
    { label: "Cancelled", value: cancelledCount, icon: XCircle, tone: "text-rose-800 bg-rose-100" },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            Sales
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
            Order{" "}
            <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="mt-1.5 text-base font-medium text-[#2b1d12]/75">
            {orders.length} order{orders.length === 1 ? "" : "s"} placed so far.
          </p>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group flex items-center gap-2.5 rounded-2xl border border-[#a8451a]/20 bg-white/90 px-3 py-3 shadow-sm sm:gap-3.5 sm:px-4 sm:py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-extrabold leading-none text-[#1c1109] sm:text-2xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#a8451a] sm:text-[11px] sm:tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <OrdersList orders={orders} />
    </div>
  );
}
