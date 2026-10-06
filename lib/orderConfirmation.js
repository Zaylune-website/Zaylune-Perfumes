// Server-only. Sends the "order confirmed" email exactly once per order.
// Called from COD checkout and from markOrderPaid (Razorpay verify + webhook),
// so the same order can reach it more than once. The claim below makes sure
// only the first call sends.

import { sendBrevoEmail, orderConfirmationEmailHtml } from "@/lib/brevo";

export async function sendOrderConfirmation(admin, orderId) {
  try {
    const { data: claimed } = await admin
      .from("orders")
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq("id", orderId)
      .is("confirmation_sent_at", null)
      .select("id");

    if (!claimed || claimed.length === 0) return { sent: false, reason: "already-sent" };

    const { data: order } = await admin
      .from("orders")
      .select(`
        id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, bundle_discount,
        coupon_code, total_amount, payment_method, created_at,
        profiles ( full_name, email ),
        addresses:address_id ( full_name, phone, address_line_1, address_line_2, city, state, postal_code ),
        order_items ( product_name, variant_name, quantity, line_total )
      `)
      .eq("id", orderId)
      .maybeSingle();

    const to = order?.profiles?.email;
    if (!order || !to) {
      await admin.from("orders").update({ confirmation_sent_at: null }).eq("id", orderId);
      return { sent: false, reason: "no-recipient" };
    }

    const result = await sendBrevoEmail({
      to,
      subject: `Order ${order.order_number} confirmed | Zaylune Fragrances`,
      html: orderConfirmationEmailHtml(order),
    });

    if (result.error) {
      // Release the claim so a later attempt can still send it.
      await admin.from("orders").update({ confirmation_sent_at: null }).eq("id", orderId);
      console.error("[OrderConfirmation] Email send failed for order", orderId, result.error);
      return { sent: false, reason: result.error };
    }

    return { sent: true };
  } catch (err) {
    // Never let an email problem break checkout or payment confirmation.
    console.error("[OrderConfirmation] Unexpected error for order", orderId, err);
    return { sent: false, reason: err?.message || "unknown" };
  }
}
