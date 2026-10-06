"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, User, Mail, Phone, ChevronRight, Truck, ExternalLink, Pencil, AlertCircle, X } from "lucide-react";
import { updateProfile } from "@/actions/account";
import { PHONE_PATTERN, keepDigits } from "@/lib/phone";

const inputClass =
  "w-full rounded-2xl border border-[#a8451a]/25 bg-white px-4 py-3 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 transition-all duration-300 focus:border-[#a8451a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 shadow-2xs";

const STATUS_STYLES = {
  pending: "text-amber-800 bg-amber-50 border-amber-500/25",
  processing: "text-amber-900 bg-amber-100/80 border-amber-500/35 font-bold",
  shipped: "text-blue-900 bg-blue-50 border-blue-500/30 font-bold",
  delivered: "text-emerald-900 bg-emerald-50 border-emerald-500/30 font-bold",
  cancelled: "text-rose-900 bg-rose-50 border-rose-500/30 font-bold",
};

const TABS = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "profile", label: "My Profile", icon: User },
];

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function ProfileEditForm({ profile, onDone }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-50 p-3.5 text-sm text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">Full Name</label>
        <input name="full_name" defaultValue={profile?.full_name || ""} required className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">Phone Number</label>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern={PHONE_PATTERN}
          title="Enter a valid 10-digit mobile number starting with 6-9"
          maxLength={10}
          onInput={(e) => (e.currentTarget.value = keepDigits(e.currentTarget.value))}
          defaultValue={profile?.phone || ""}
          placeholder="10-digit mobile number"
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] text-white px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 transition-all"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex items-center justify-center gap-1.5 rounded-full border border-[#a8451a]/25 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#2b1d12]/80 hover:bg-[#fff5ee] hover:text-[#1c1109] transition-all"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </form>
  );
}

export default function AccountTabs({ profile, orders }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProfile, setEditingProfile] = useState(false);

  const filteredOrders =
    statusFilter === "all" ? orders : (orders || []).filter((o) => o.order_status === statusFilter);

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 rounded-full border border-[#a8451a]/20 bg-white/85 p-1.5 backdrop-blur-md shadow-2xs w-full sm:w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full px-3 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] text-white shadow-md"
                  : "text-[#2b1d12]/70 hover:text-[#a8451a] hover:bg-[#fde3cf]/40"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="mt-5 sm:mt-8">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1c1109] mb-4 sm:mb-6">Order History</h2>

          {orders && orders.length > 0 && (
            <div className="no-scrollbar -mx-5 mb-4 sm:mb-6 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {STATUS_FILTERS.map((f) => {
                const isActive = statusFilter === f.key;
                const count = f.key === "all" ? orders.length : orders.filter((o) => o.order_status === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs sm:px-4 sm:text-sm font-bold tracking-wide transition-all duration-300 ${
                      isActive
                        ? "border-[#c04a1c] bg-[#c04a1c] text-white shadow-xs"
                        : "border-[#a8451a]/20 bg-white/85 text-[#2b1d12]/75 hover:border-[#a8451a]/45 hover:text-[#1c1109] shadow-2xs"
                    }`}
                  >
                    {f.label}
                    <span className={`text-xs ${isActive ? "text-white/85" : "text-[#a8451a]/80 font-bold"}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {!orders || orders.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-[#a8451a]/20 bg-gradient-to-b from-white/95 via-[#fffaf5] to-[#fde3cf]/50 px-5 py-8 text-center shadow-sm sm:px-6 sm:py-16">
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[#d4a359]/15 blur-3xl" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                <span className="absolute inset-0 hidden rounded-full border border-dashed border-[#a8451a]/30 sm:block sm:animate-[spin_18s_linear_infinite]" />
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#a8451a]/25 bg-white text-[#c04a1c] shadow-md sm:h-14 sm:w-14">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
              </div>

              <h3 className="relative mt-6 font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109]">No orders yet</h3>
              <p className="relative mx-auto mt-3 max-w-sm text-sm sm:text-base leading-relaxed text-[#2b1d12]/70">
                When you place an order, you can see it and track it here.
              </p>

              <div className="relative mt-8 flex justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  Shop Now
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#a8451a]/25 bg-white/70 py-16 text-center shadow-xs">
              <p className="text-base text-[#2b1d12]/75 font-normal">No {statusFilter} orders found.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredOrders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 sm:p-7 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-[#a8451a]/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-base sm:text-xl font-extrabold text-[#1c1109] break-all">{order.order_number}</p>
                      <p className="text-xs sm:text-sm text-[#2b1d12]/65 font-medium mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-base sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] mb-1.5 whitespace-nowrap">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                          STATUS_STYLES[order.order_status] || "text-[#2b1d12]/75 bg-white border-[#a8451a]/20"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5 border-t border-[#a8451a]/15 pt-4 text-sm sm:text-base text-[#2b1d12]/85">
                    {order.order_items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c04a1c]/60 shrink-0" />
                        <span>
                          {item.product_name} {item.variant_name ? `(${item.variant_name})` : ""} × {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.awb_code && (
                    <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-[#a8451a]/20 bg-gradient-to-r from-[#fde3cf]/50 via-[#fdf7f2] to-white p-3.5 sm:p-4">
                      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-xs">
                        <Truck className="h-4 w-4" />
                        {order.order_status !== "delivered" && (
                          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8451a]">
                          {order.courier_name || "Shiprocket"} · {order.order_status === "delivered" ? "Delivered" : "On the way"}
                        </p>
                        <p className="truncate font-mono text-sm font-bold text-[#1c1109]">{order.awb_code}</p>
                      </div>
                      <a
                        href={`https://shiprocket.co/tracking/${order.awb_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs hover:bg-[#fff5ee] hover:border-[#a8451a] transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Track
                      </a>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#a8451a]/15 pt-4">
                    {order.awb_code && (
                      <a
                        href={`https://shiprocket.co/tracking/${order.awb_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs transition-all hover:border-[#a8451a] hover:bg-[#fff5ee]"
                      >
                        <Truck className="h-3.5 w-3.5" /> Track on Shiprocket
                      </a>
                    )}
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="group/link inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] hover:text-[#782c0c] transition-colors"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* My Profile Tab */}
      {activeTab === "profile" && (
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1c1109]">My Profile</h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs hover:border-[#a8451a] hover:bg-[#fff5ee] transition-all duration-300"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            )}
          </div>
          <div className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-4 sm:p-10 backdrop-blur-xl shadow-sm space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3.5 sm:gap-5 pb-5 sm:pb-6 border-b border-[#a8451a]/15">
              <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#a8451a]/25 bg-gradient-to-br from-white to-[#fde3cf] text-[#c04a1c] shadow-sm">
                <User className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg sm:text-3xl font-extrabold text-[#1c1109] break-words">
                  {profile?.full_name || "Zaylune Customer"}
                </p>
                <span className="mt-1.5 inline-block text-xs font-bold uppercase tracking-wider text-[#a8451a] bg-[#a8451a]/10 border border-[#a8451a]/20 rounded-full px-2.5 py-0.5">
                  Customer Account
                </span>
              </div>
            </div>

            {editingProfile ? (
              <ProfileEditForm profile={profile} onDone={() => setEditingProfile(false)} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#a8451a]/15 bg-[#fffaf5] p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#a8451a]/20 text-[#c04a1c] shadow-2xs">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#a8451a] font-bold">Email Address</p>
                    <p className="text-sm sm:text-base font-semibold text-[#1c1109] break-all">{profile?.email || "—"}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#a8451a]/15 bg-[#fffaf5] p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#a8451a]/20 text-[#c04a1c] shadow-2xs">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[#a8451a] font-bold">Phone Number</p>
                    <p className="text-sm sm:text-base font-semibold text-[#1c1109] break-all">{profile?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
