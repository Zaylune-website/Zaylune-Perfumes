import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncOneOrderFromShiprocket } from "@/lib/shiprocket";
import ShiprocketTracking from "@/components/ShiprocketTracking";
import OrderTimeline from "./_components/OrderTimeline";
import LiveOrderRefresh from "./_components/LiveOrderRefresh";
import { getOrderTrackingSnapshot } from "@/actions/orderStatus";

export const metadata = { title: "Order Details", robots: { index: false, follow: false } };

const STATUS_STYLES = {
  pending: "text-amber-800 bg-amber-50 border-amber-500/25",
  processing: "text-amber-900 bg-amber-100/80 border-amber-500/35 font-bold",
  shipped: "text-blue-900 bg-blue-50 border-blue-500/30 font-bold",
  delivered: "text-emerald-900 bg-emerald-50 border-emerald-500/30 font-bold",
  cancelled: "text-rose-900 bg-rose-50 border-rose-500/30 font-bold",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, bundle_discount, coupon_code, total_amount, payment_method, payment_status, order_status, created_at, razorpay_payment_id, shipped_at, delivered_at, processing_at, shiprocket_order_id, awb_code, courier_name, shiprocket_status, order_items ( id, product_name, variant_name, quantity, line_total ), addresses ( full_name, phone, address_line_1, address_line_2, city, state, postal_code )"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  // The row above was fetched through the customer's own session, so ownership
  // is already checked. Only then do we pull the live status from Shiprocket
  // (service role) and save it. Best-effort: the page still renders from the DB
  // if Shiprocket is slow or down.
  let trackingScans = [];
  let currentLocation = null;
  if (order.shiprocket_order_id) {
    try {
      const synced = await syncOneOrderFromShiprocket(createAdminClient(), {
        id: order.id,
        shiprocket_order_id: order.shiprocket_order_id,
        awb_code: order.awb_code || null,
      });
      if (synced.awbCode) order.awb_code = synced.awbCode;
      if (synced.courierName) order.courier_name = synced.courierName;
      if (synced.shiprocketStatus) order.shiprocket_status = synced.shiprocketStatus;
      if (synced.orderStatus) order.order_status = synced.orderStatus;
      trackingScans = synced.scans;
      currentLocation = synced.currentLocation;
    } catch (e) {
      console.error("Failed to sync order with Shiprocket on customer order page:", e);
    }
  }

  const address = order.addresses;
  // Read from the DB after the sync above, so the poller starts from the same state.
  const liveSnapshot = await getOrderTrackingSnapshot(order.id);
  const statusStyle = STATUS_STYLES[order.order_status] || STATUS_STYLES.pending;

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] pb-28 pt-10 sm:pt-14 selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        <LiveOrderRefresh orderId={order.id} initialSnapshot={liveSnapshot} />
        {/* Ambient luxury background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
          <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
          <div className="absolute bottom-[5%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#8e3510]/[0.07] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <Link
            href="/account"
            className="group mb-8 inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] hover:text-[#782c0c] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back to My Account
          </Link>

          <Reveal className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-[#a8451a]/15 pb-8">
            <div className="min-w-0">
              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1109] leading-tight break-words">
                Order{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                  {order.order_number}
                </span>
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-[#2b1d12]/75 font-medium">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-widest ${statusStyle}`}>
              {order.order_status}
            </span>
          </Reveal>

          <div className="space-y-6">
            <Reveal>
              <OrderTimeline status={order.order_status} placedAt={order.created_at} processingAt={order.processing_at} shippedAt={order.shipped_at} deliveredAt={order.delivered_at} />
            </Reveal>

            {/* Shipment Tracking */}
            {(order.awb_code || order.shiprocket_order_id) && (
              <ShiprocketTracking
                awbCode={order.awb_code}
                courierName={order.courier_name}
                status={order.shiprocket_status}
                currentLocation={currentLocation}
                scans={trackingScans}
              />
            )}

            {/* Items */}
            <Reveal className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-[#a8451a]/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-[#fde3cf]/50 text-[#c04a1c] shadow-2xs">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1c1109]">Ordered Items</h2>
              </div>
              <ul className="divide-y divide-[#a8451a]/10">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-4 text-base">
                    <div className="min-w-0">
                      <p className="text-[#1c1109] font-bold text-base sm:text-lg">{item.product_name}</p>
                      <p className="text-[#2b1d12]/70 mt-0.5 text-sm font-medium">
                        {item.variant_name ? `${item.variant_name} · ` : ""}Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-base sm:text-lg font-bold text-[#1c1109]">
                      ₹{Number(item.line_total).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2.5 border-t border-[#a8451a]/15 pt-5 text-sm sm:text-base">
                <div className="flex justify-between text-[#2b1d12]/75 font-normal">
                  <span>Subtotal</span>
                  <span className="text-[#1c1109] font-bold">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#2b1d12]/75 font-normal">
                  <span>Shipping</span>
                  <span className="text-[#1c1109] font-bold">{Number(order.shipping_cost) === 0 ? "Free" : `₹${Number(order.shipping_cost).toLocaleString("en-IN")}`}</span>
                </div>
                {order.quantity_discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Bulk Discount</span>
                    <span className="font-bold">-₹{Number(order.quantity_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.coupon_discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span className="font-bold">-₹{Number(order.coupon_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.bundle_discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Bundle Discount</span>
                    <span className="font-bold">-₹{Number(order.bundle_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.quantity_discount === 0 && order.coupon_discount === 0 && order.bundle_discount === 0 && order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span className="font-bold">-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#a8451a]/15 pt-4 items-baseline">
                  <span className="font-display text-lg font-bold text-[#1c1109] uppercase tracking-wider">Total</span>
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                    ₹{Number(order.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Shipping Address */}
            {address && (
              <Reveal delay={80} className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-[#a8451a]/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-[#fde3cf]/50 text-[#c04a1c] shadow-2xs">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1c1109]">Shipping Address</h2>
                </div>
                <p className="text-base sm:text-lg text-[#1c1109] font-bold">
                  {address.full_name} · <span className="font-medium text-[#2b1d12]/80">{address.phone}</span>
                </p>
                <p className="text-sm sm:text-base text-[#2b1d12]/80 mt-2 leading-relaxed">
                  {address.address_line_1}
                  {address.address_line_2 ? `, ${address.address_line_2}` : ""}
                </p>
                <p className="text-sm sm:text-base text-[#2b1d12]/80 leading-relaxed font-medium">
                  {address.city}, {address.state} — {address.postal_code}
                </p>
              </Reveal>
            )}

            {/* Payment */}
            <Reveal delay={160} className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-6 sm:p-8 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-[#a8451a]/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-[#fde3cf]/50 text-[#c04a1c] shadow-2xs">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1c1109]">Payment Details</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                <span className="text-[#2b1d12]/70 font-medium">Method:</span>
                <span className="text-[#1c1109] font-bold">
                  {order.payment_method === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}
                </span>
                <span className="text-[#a8451a]/40">|</span>
                <span className="text-[#2b1d12]/70 font-medium">Status:</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs sm:text-sm font-bold uppercase tracking-wider ${
                    order.payment_status === "paid"
                      ? "text-emerald-900 bg-emerald-50 border-emerald-500/30"
                      : order.payment_status === "failed"
                      ? "text-rose-900 bg-rose-50 border-rose-500/30"
                      : "text-[#2b1d12]/75 bg-amber-50 border-amber-500/25"
                  }`}
                >
                  {order.payment_status === "paid" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  {order.payment_status}
                </span>
              </div>
              {order.payment_method === "RAZORPAY" && order.razorpay_payment_id && (
                <div className="mt-4 border-t border-[#a8451a]/15 pt-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#a8451a]">Payment ID</span>
                  <span className="font-mono text-sm font-bold text-[#1c1109] select-all">{order.razorpay_payment_id}</span>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
