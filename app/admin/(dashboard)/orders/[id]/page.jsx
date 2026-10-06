import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { getOrderById } from "@/actions/admin/orders";
import OrderStatusManager from "./_components/OrderStatusManager";
import ShiprocketShipmentManager from "./_components/ShiprocketShipmentManager";
import DeleteOrderButton from "./_components/DeleteOrderButton";
import BottleGlyph from "@/components/BottleGlyph";

export const metadata = { title: "Order Detail" };

const PROGRESS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];
const PROGRESS_INDEX = { pending: 0, processing: 1, shipped: 2, delivered: 3 };

function OrderProgress({ status }) {
  if (status === "cancelled") {
    return (
      <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-50 p-5 shadow-sm">
        <p className="font-display text-lg font-extrabold text-rose-800">This order was cancelled</p>
      </div>
    );
  }
  const current = PROGRESS_INDEX[status] ?? 0;
  const pct = (current / (PROGRESS_STEPS.length - 1)) * 100;
  return (
    <div className="mt-6 rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm sm:p-6">
      <style>{`@keyframes opGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
      <div className="relative flex justify-between">
        <span aria-hidden className="absolute left-[12%] right-[12%] top-[15px] h-1 rounded-full bg-[#a8451a]/15" />
        <span
          aria-hidden
          className="absolute left-[12%] top-[15px] h-1 origin-left rounded-full bg-gradient-to-r from-[#8e3510] to-[#e69854]"
          style={{ width: `${pct * 0.76}%`, animation: "opGrow 1s ease-out both" }}
        />
        {PROGRESS_STEPS.map((label, i) => {
          const done = i <= current;
          const active = i === current;
          return (
            <div key={label} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-colors ${
                  done
                    ? "border-[#c04a1c] bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-md"
                    : "border-[#a8451a]/25 bg-white text-[#a8451a]/50"
                }`}
              >
                {i + 1}
              </span>
              <span className={`text-center text-[11px] font-bold uppercase tracking-wide sm:text-sm ${done ? "text-[#1c1109]" : "text-[#2b1d12]/45"}`}>
                {label}
              </span>
              {active && (
                <span className="rounded-full bg-[#fde3cf]/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a8451a]">Current</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const panelClass =
  "rounded-3xl border border-[#a8451a]/10 bg-white/90 p-6 backdrop-blur-md md:p-8";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const address = order.addresses;

  return (
    <div className="font-medium">
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-base font-medium text-[#2b1d12]/70 transition-colors hover:text-[#a8451a]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <div className="relative mb-2 overflow-hidden rounded-3xl border border-[#a8451a]/15 bg-gradient-to-br from-white/80 via-[#fffaf5]/80 to-[#fde3cf]/40 px-4 py-5 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
              <Package className="h-3.5 w-3.5 text-[#c04a1c]" />
              Order Detail
            </span>
            <h1 className="break-all font-display text-xl leading-tight sm:text-4xl font-extrabold text-[#1c1109]">
              Order{" "}
              <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">{order.order_number}</span>
            </h1>
            <p className="mt-1.5 text-base font-medium text-[#2b1d12]/75">Placed {new Date(order.created_at).toLocaleString("en-IN")}</p>
          </div>
          <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto"><DeleteOrderButton orderId={order.id} orderNumber={order.order_number} /></div>
        </div>
      </div>

      <OrderProgress status={order.order_status} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="min-w-0 space-y-6">
          <div className={panelClass}>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a8451a]/10 text-[#a8451a]">
                <Package className="h-4 w-4" />
              </div>
              <h2 className="font-display text-lg text-[#1c1109]">Items</h2>
            </div>
            <ul className="mt-4 divide-y divide-[#a8451a]/5">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3 text-base">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#a8451a]/10 bg-[#fde3cf]/40">
                    {item.products?.featured_image_url ? (
                      <Image src={item.products.featured_image_url} alt="" fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BottleGlyph className="h-7 w-auto text-[#2b1d12]/65" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.products?.id ? (
                      <Link
                        href={`/admin/products/${item.products.id}/edit`}
                        className="block truncate font-medium text-[#1c1109] transition-colors hover:text-[#a8451a] hover:underline"
                      >
                        {item.product_name}
                      </Link>
                    ) : (
                      <p className="truncate text-[#1c1109]">{item.product_name}</p>
                    )}
                    <p className="text-[#2b1d12]/70">{item.variant_name} × {item.quantity}</p>
                    {item.products?.slug && (
                      <a
                        href={`/shop/${item.products.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-[#a8451a] hover:text-[#782c0c]"
                      >
                        View in store ↗
                      </a>
                    )}
                  </div>
                  <span className="shrink-0 font-medium text-[#1c1109]">₹{Number(item.line_total).toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-[#a8451a]/10 pt-4 text-base">
              <div className="flex justify-between text-[#2b1d12]/75">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#2b1d12]/75">
                <span>Shipping</span>
                <span>₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
              </div>
              {order.quantity_discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Bulk Discount</span>
                  <span>-₹{Number(order.quantity_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.coupon_discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Coupon{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                  <span>-₹{Number(order.coupon_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.bundle_discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Bundle Discount</span>
                  <span>-₹{Number(order.bundle_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.quantity_discount === 0 && order.coupon_discount === 0 && order.bundle_discount === 0 && order.discount_amount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                  <span>-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#a8451a]/10 pt-2 font-display text-base text-[#1c1109]">
                <span>Total</span>
                <span className="text-[#a8451a]">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a8451a]/10 text-[#a8451a]">
                <MapPin className="h-4 w-4" />
              </div>
              <h2 className="font-display text-lg text-[#1c1109]">Customer &amp; Shipping</h2>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 text-base sm:grid-cols-2">
              <div>
                <p className="text-base font-semibold uppercase tracking-wide text-[#2b1d12]/70">Customer</p>
                <p className="mt-1.5 text-[#1c1109]">{order.profiles?.full_name}</p>
                <p className="text-[#2b1d12]/72">{order.profiles?.email}</p>
                <p className="text-[#2b1d12]/72">{order.profiles?.phone}</p>
              </div>
              {address && (
                <div>
                  <p className="text-base font-semibold uppercase tracking-wide text-[#2b1d12]/70">Shipping Address</p>
                  <p className="mt-1.5 text-[#1c1109]">{address.full_name} · {address.phone}</p>
                  <p className="text-[#2b1d12]/72">{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}</p>
                  <p className="text-[#2b1d12]/72">{address.city}, {address.state} {address.postal_code}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${panelClass} h-fit min-w-0`}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a8451a]/10 text-[#a8451a]">
              <CreditCard className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg text-[#1c1109]">Manage Status</h2>
          </div>
          <OrderStatusManager order={order} />
          <p className="mt-5 text-base text-[#2b1d12]/70">
            Payment method: <span className="text-[#2b1d12]/78">{order.payment_method === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}</span>
          </p>
          {order.payment_method === "RAZORPAY" && order.razorpay_payment_id && (
            <div className="mt-4 border-t border-[#a8451a]/10 pt-4 text-sm">
              <span className="block text-[#2b1d12]/70 uppercase tracking-wider font-semibold">Razorpay Payment ID</span>
              <span className="font-mono text-[#2b1d12]/82 select-all">{order.razorpay_payment_id}</span>
            </div>
          )}
          <ShiprocketShipmentManager order={order} />
        </div>
      </div>
    </div>
  );
}
