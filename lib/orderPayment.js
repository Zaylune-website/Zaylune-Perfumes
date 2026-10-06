// Server-only. Shared by the Razorpay verify action and the webhook so a payment
// is applied exactly once no matter which of them arrives first.

import { sendOrderConfirmation } from "@/lib/orderConfirmation";

async function decrementVariantStock(admin, variantId, quantity) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: variant } = await admin
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", variantId)
      .maybeSingle();
    if (!variant) return;

    const next = Math.max(0, variant.stock_quantity - quantity);
    const { data: updated } = await admin
      .from("product_variants")
      .update({ stock_quantity: next })
      .eq("id", variantId)
      .eq("stock_quantity", variant.stock_quantity)
      .select("id");

    if (updated && updated.length > 0) return;
  }
}

// Marks the order paid only if it wasn't already, then decrements stock from the
// order's own saved items (never from client-supplied items).
export async function markOrderPaid(admin, orderId, razorpayPaymentId) {
  const { data: updated, error } = await admin
    .from("orders")
    .update({
      payment_status: "paid",
      order_status: "processing",
      processing_at: new Date().toISOString(),
      razorpay_payment_id: razorpayPaymentId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .neq("payment_status", "paid")
    .select("id");

  if (error) return { applied: false, error: error.message };
  if (!updated || updated.length === 0) return { applied: false, alreadyPaid: true };

  const { data: items } = await admin
    .from("order_items")
    .select("variant_id, quantity")
    .eq("order_id", orderId);

  for (const item of items || []) {
    if (item.variant_id) await decrementVariantStock(admin, item.variant_id, item.quantity);
  }

  await sendOrderConfirmation(admin, orderId);

  return { applied: true };
}

export async function markOrderFailed(admin, orderId) {
  await admin
    .from("orders")
    .update({ payment_status: "failed", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .neq("payment_status", "paid");
}
