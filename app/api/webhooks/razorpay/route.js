import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { markOrderPaid, markOrderFailed } from "@/lib/orderPayment";

async function applyCapturedPayment(supabaseAdmin, internalOrderId, razorpayPaymentId, paidAmountPaise) {
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, total_amount")
    .eq("id", internalOrderId)
    .maybeSingle();

  if (error || !order) {
    console.error("[Razorpay Webhook Error]: order lookup failed", error?.message);
    return;
  }

  if (paidAmountPaise !== Math.round(Number(order.total_amount) * 100)) {
    console.error(`[Razorpay Webhook Error]: amount mismatch for order ${internalOrderId}`);
    return;
  }

  const result = await markOrderPaid(supabaseAdmin, order.id, razorpayPaymentId);
  if (result.error) console.error("[Razorpay Webhook Error]: markOrderPaid failed", result.error);
}

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Razorpay Webhook Error]: RAZORPAY_WEBHOOK_SECRET is not configured on server.");
      return NextResponse.json({ success: false, error: "Webhook secret is not configured" }, { status: 500 });
    }
    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const isValid =
      signatureBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isValid) {
      console.error("[Razorpay Webhook Error]: Signature mismatch.");
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    const { event, payload } = JSON.parse(rawBody);
    const supabaseAdmin = createAdminClient();

    switch (event) {
      case "payment.captured": {
        const payment = payload?.payment?.entity;
        const internalOrderId = payment?.notes?.internal_order_id || payment?.notes?.order_id || payment?.receipt;
        if (payment && internalOrderId) {
          await applyCapturedPayment(supabaseAdmin, internalOrderId, payment.id, Number(payment.amount));
        }
        break;
      }

      case "order.paid": {
        const orderEntity = payload?.order?.entity;
        const paymentEntity = payload?.payment?.entity;
        const internalOrderId = orderEntity?.receipt || orderEntity?.notes?.internal_order_id || orderEntity?.notes?.order_id;
        if (orderEntity && internalOrderId && paymentEntity) {
          await applyCapturedPayment(supabaseAdmin, internalOrderId, paymentEntity.id, Number(orderEntity.amount_paid));
        }
        break;
      }

      case "payment.failed": {
        const payment = payload?.payment?.entity;
        const internalOrderId = payment?.notes?.internal_order_id || payment?.notes?.order_id || payment?.receipt;
        if (internalOrderId) await markOrderFailed(supabaseAdmin, internalOrderId);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error("[Razorpay Webhook Critical Error]:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
