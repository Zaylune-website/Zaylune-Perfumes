"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from "@/lib/adminSession";
import { createShiprocketOrder, syncOneOrderFromShiprocket } from "@/lib/shiprocket";
import { DEFAULT_PACKAGE } from "@/lib/constants";

// Server actions are public POST endpoints, so the Shiprocket actions check
// the admin session cookie themselves instead of trusting the page.
async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(token && (await verifyAdminSessionToken(token)));
}

// A Razorpay order only represents a real sale once the webhook (or the
// post-payment verify call) has flipped it to "paid" — until then the
// customer may still be sitting in the checkout modal, or may have
// abandoned/failed it entirely. COD has no online-payment step, so it's
// always a real order the moment it's placed.
// Note: kept local (not exported) — a "use server" file may only export
// async functions, and this same filter is duplicated in admin/dashboard.js.
const VISIBLE_ORDERS_FILTER = "payment_method.neq.RAZORPAY,payment_status.eq.paid";

export async function getAllOrdersAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, order_status, payment_status, payment_method, awb_code, courier_name, shiprocket_order_id, created_at, profiles ( full_name, email )")
    .or(VISIBLE_ORDERS_FILTER)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getOrderById(id) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select(`
      id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, bundle_discount, coupon_code, total_amount,
      payment_method, payment_status, order_status, created_at, razorpay_order_id, razorpay_payment_id,
      awb_code, courier_name, shiprocket_order_id, shiprocket_shipment_id, shiprocket_status, shipped_at, delivered_at,
      profiles ( full_name, email, phone ),
      addresses ( full_name, phone, address_line_1, address_line_2, city, state, postal_code, country ),
      order_items ( id, product_name, variant_name, price_at_purchase, quantity, line_total, products ( id, slug, featured_image_url ) )
    `)
    .eq("id", id)
    .or(VISIBLE_ORDERS_FILTER)
    .maybeSingle();

  return data;
}

export async function updateOrderStatus(orderId, orderStatus) {
  const supabase = createAdminClient();
  const payload = { order_status: orderStatus, updated_at: new Date().toISOString() };
  if (orderStatus === "processing") payload.processing_at = new Date().toISOString();
  if (orderStatus === "shipped") payload.shipped_at = new Date().toISOString();
  if (orderStatus === "delivered") payload.delivered_at = new Date().toISOString();
  if (orderStatus === "cancelled") payload.cancelled_at = new Date().toISOString();

  const { error } = await supabase.from("orders").update(payload).eq("id", orderId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function deleteOrder(orderId) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  return { success: true };
}

// ─── Shiprocket ──────────────────────────────────────────────
//
// Creates the order on Shiprocket only. The admin then picks a courier and
// clicks "Ship Now" in Shiprocket's dashboard (SHIPROCKET_NEW_ORDERS_URL). The
// AWB, courier and live status come back through the Shiprocket webhook, or
// through the manual sync below.

export async function createShiprocketShipment(orderId, weightKgOverride, dimsOverride = {}) {
  if (!(await requireAdmin())) return { success: false, error: "Unauthorized" };

  const adminClient = createAdminClient();

  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .select(`
      id, order_number, created_at, payment_method, payment_status, subtotal,
      shiprocket_order_id, shiprocket_shipment_id, awb_code, courier_name,
      profiles ( full_name, email, phone ),
      addresses:address_id ( full_name, phone, address_line_1, address_line_2, city, state, postal_code, country ),
      order_items ( product_id, product_name, quantity, price_at_purchase, product_variants ( weight_grams ) )
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return { success: false, error: orderError?.message || "Order not found." };
  }

  // Idempotency: never push the same order to Shiprocket twice.
  if (order.shiprocket_order_id) {
    return {
      success: true,
      alreadyShipped: true,
      shiprocketOrderId: order.shiprocket_order_id,
      shipmentId: order.shiprocket_shipment_id,
      awbCode: order.awb_code || null,
      courierName: order.courier_name || null,
    };
  }

  // Online payments only count once Razorpay has confirmed them. COD ships as-is.
  if (order.payment_method !== "COD" && order.payment_status !== "paid") {
    return { success: false, error: "This online order is not paid yet, so it cannot be shipped." };
  }

  const address = order.addresses;
  if (!address || !address.city || !address.state || !address.postal_code) {
    return { success: false, error: "This order has no complete shipping address (city/state/pincode) on file." };
  }

  const items = order.order_items || [];
  if (items.length === 0) return { success: false, error: "Order has no items to ship." };

  const shiprocketItems = items.map((item) => ({
    name: item.product_name || "Product",
    sku: item.product_id || "SKU",
    units: Math.max(1, Number(item.quantity) || 1),
    selling_price: Number(item.price_at_purchase) || 0,
  }));

  // Prefer the weight the admin typed (the packed parcel). Otherwise estimate
  // from variant weights plus packaging overhead.
  let weightKg = Number(weightKgOverride) > 0 ? Number(weightKgOverride) : 0;
  if (!weightKg) {
    const itemsGrams = items.reduce((sum, item) => {
      const unit = item.product_variants?.weight_grams || DEFAULT_PACKAGE.itemWeightGrams;
      return sum + unit * Math.max(1, Number(item.quantity) || 1);
    }, 0);
    weightKg = (itemsGrams + DEFAULT_PACKAGE.packagingOverheadGrams) / 1000;
  }
  // Shiprocket rejects zero or near-zero weight.
  weightKg = Math.max(0.1, Math.round(weightKg * 100) / 100);

  const customer = order.profiles;
  const streetLine = [address.address_line_1, address.address_line_2].filter(Boolean).join(", ");

  try {
    const created = await createShiprocketOrder({
      orderId: order.id,
      orderDate: order.created_at,
      customerName: address.full_name || customer?.full_name || "Customer",
      customerEmail: customer?.email || "",
      customerPhone: address.phone || customer?.phone || "",
      shippingStreet: streetLine,
      shippingCity: address.city,
      shippingState: address.state,
      shippingPincode: address.postal_code,
      shippingCountry: address.country || "India",
      paymentMethod: order.payment_method || "RAZORPAY",
      subtotal: Number(order.subtotal) || 0,
      items: shiprocketItems,
      weightKg,
      lengthCm: Number(dimsOverride.lengthCm) > 0 ? Number(dimsOverride.lengthCm) : DEFAULT_PACKAGE.lengthCm,
      breadthCm: Number(dimsOverride.breadthCm) > 0 ? Number(dimsOverride.breadthCm) : DEFAULT_PACKAGE.breadthCm,
      heightCm: Number(dimsOverride.heightCm) > 0 ? Number(dimsOverride.heightCm) : DEFAULT_PACKAGE.heightCm,
    });

    if (!created.shiprocketOrderId || !created.shipmentId) {
      console.error("[Shiprocket] Order create returned 200 with no order/shipment id:", JSON.stringify(created.raw));
      return {
        success: false,
        error: created.message
          ? `Shiprocket did not return an order/shipment id: ${created.message}`
          : "Shiprocket did not return an order/shipment id. Check the pickup location name, phone and pincode, and whether the Shiprocket account has a pending KYC step.",
      };
    }

    const { error: updateError } = await adminClient
      .from("orders")
      .update({
        shiprocket_order_id: created.shiprocketOrderId,
        shiprocket_shipment_id: created.shipmentId,
        shiprocket_status: created.status || "NEW",
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("[Shiprocket] Order created on Shiprocket but DB save failed:", updateError.message);
      return {
        success: false,
        error: `Shipment was created on Shiprocket (order ${created.shiprocketOrderId}) but saving it locally failed: ${updateError.message}`,
      };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      shiprocketOrderId: created.shiprocketOrderId,
      shipmentId: created.shipmentId,
      awbCode: null,
      courierName: null,
    };
  } catch (err) {
    console.error("[Shiprocket] Failed to create shipment:", err);
    return { success: false, error: err?.message || "Failed to create Shiprocket shipment." };
  }
}

export async function syncShiprocketStatus(orderId) {
  if (!(await requireAdmin())) return { success: false, error: "Unauthorized" };

  const adminClient = createAdminClient();

  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .select("id, shiprocket_order_id, awb_code")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) return { success: false, error: orderError?.message || "Order not found." };
  if (!order.shiprocket_order_id) return { success: false, error: "This order has not been pushed to Shiprocket yet." };

  try {
    const result = await syncOneOrderFromShiprocket(adminClient, order);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, ...result };
  } catch (err) {
    console.error("[Shiprocket] Failed to sync status:", err);
    return { success: false, error: err?.message || "Failed to fetch status from Shiprocket." };
  }
}

// Catch-up for every order that was pushed to Shiprocket. Shiprocket rate
// limits its API, so there is a short pause between calls.
export async function syncAllShiprocketOrders() {
  if (!(await requireAdmin())) return { success: false, error: "Unauthorized" };

  const adminClient = createAdminClient();

  const { data: orders, error: ordersError } = await adminClient
    .from("orders")
    .select("id, order_number, shiprocket_order_id, awb_code")
    .not("shiprocket_order_id", "is", null);

  if (ordersError) return { success: false, error: ordersError.message };
  if (!orders || orders.length === 0) return { success: true, synced: 0, failed: 0, failures: [] };

  let synced = 0;
  const failures = [];

  for (const order of orders) {
    try {
      await syncOneOrderFromShiprocket(adminClient, order);
      synced += 1;
    } catch (err) {
      failures.push({ orderNumber: order.order_number, error: err?.message || "Unknown error" });
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  revalidatePath("/admin/orders");
  return { success: true, synced, failed: failures.length, failures };
}
