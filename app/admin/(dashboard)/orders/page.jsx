import { ShoppingCart, Clock, Truck, XCircle } from "lucide-react";
import { getAllOrdersAdmin } from "@/actions/admin/orders";
import OrdersList from "./_components/OrdersList";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();

  const pendingCount = orders.filter((o) => o.order_status === "pending").length;
  const shippedCount = orders.filter((o) => o.order_status === "shipped").length;
  const cancelledCount = orders.filter((o) => o.order_status === "cancelled").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart },
    { label: "Pending", value: pendingCount, icon: Clock },
    { label: "Shipped", value: shippedCount, icon: Truck },
    { label: "Cancelled", value: cancelledCount, icon: XCircle },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ivory">
          Order <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Management</span>
        </h1>
        <p className="text-sm text-ivory/50 font-light mt-1">
          {orders.length} order{orders.length === 1 ? "" : "s"} placed so far.
        </p>
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

      <OrdersList orders={orders} />
    </div>
  );
}
