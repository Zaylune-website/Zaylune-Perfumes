"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin/orders";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const STATUS_STYLES = {
  pending: "text-[#2b1d12]/78",
  processing: "text-[#a8451a]",
  shipped: "text-blue-700",
  delivered: "text-green-800",
  cancelled: "text-red-700",
  paid: "text-green-800",
  failed: "text-red-700",
  refunded: "text-blue-700",
};

const selectClass =
  "w-full rounded-xl border border-[#a8451a]/10 bg-white/40 px-4 py-2.5 text-base capitalize text-[#1c1109] transition-colors duration-300 focus:border-[#a8451a]/40 focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/20 disabled:opacity-50";
const labelClass = "mb-1.5 block text-base font-semibold uppercase tracking-wide text-[#2b1d12]/70";

export default function OrderStatusManager({ order }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleOrderStatus = (e) => {
    startTransition(async () => {
      await updateOrderStatus(order.id, e.target.value);
      router.refresh();
    });
  };

  const handlePaymentStatus = (e) => {
    startTransition(async () => {
      await updatePaymentStatus(order.id, e.target.value);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Order Status</label>
        <select
          defaultValue={order.order_status}
          onChange={handleOrderStatus}
          disabled={pending}
          className={`${selectClass} ${STATUS_STYLES[order.order_status] || ""}`}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-white capitalize text-[#1c1109]">{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Payment Status</label>
        <select
          defaultValue={order.payment_status}
          onChange={handlePaymentStatus}
          disabled={pending}
          className={`${selectClass} ${STATUS_STYLES[order.payment_status] || ""}`}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-white capitalize text-[#1c1109]">{s}</option>
          ))}
        </select>
      </div>
      {pending && <p className="text-base text-[#a8451a]/90">Updating…</p>}
    </div>
  );
}
