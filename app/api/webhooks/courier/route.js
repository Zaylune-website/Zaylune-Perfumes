import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapShiprocketStatusToOrderStatus } from "@/lib/shiprocket";

// Shiprocket pushes shipment status updates here once this URL is registered
// under Shiprocket -> Settings -> API -> Configure Webhooks, with a "Secret
// Key" that must match SHIPROCKET_WEBHOOK_SECRET. Shiprocket sends that key
// back in the `x-api-key` header.

export async function POST(req) {
  try {
    const webhookSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    const receivedKey = req.headers.get("x-api-key");

    if (webhookSecret) {
      if (!receivedKey || receivedKey !== webhookSecret) {
        console.error("[Shiprocket Webhook Error]: Missing/invalid x-api-key header.");
        return NextResponse.json({ success: false, error: "Invalid webhook secret" }, { status: 401 });
      }
    } else {
      console.warn("[Shiprocket Webhook]: SHIPROCKET_WEBHOOK_SECRET is not configured, accepting request unverified.");
    }

    const payload = await req.json().catch(() => null);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    // `channel_order_id` is the reference WE sent (our orders.id).
    // `order_id` is Shiprocket's own internal id, stored in shiprocket_order_id.
    // They are not interchangeable.
    const channelOrderId = payload.channel_order_id ? String(payload.channel_order_id) : undefined;
    const shiprocketOrderId = payload.order_id ? String(payload.order_id) : undefined;
    const awbCode = payload.awb ? String(payload.awb) : undefined;
    const courierName = payload.courier_name ? String(payload.courier_name) : undefined;
    const currentStatus = payload.current_status || payload.shipment_status;

    console.log("[Shiprocket Webhook]: Received update", { channelOrderId, shiprocketOrderId, awbCode, courierName, currentStatus });

    if (!channelOrderId && !shiprocketOrderId) {
      console.warn("[Shiprocket Webhook]: Payload had no order_id/channel_order_id, ignoring.", payload);
      return NextResponse.json({ success: true, ignored: true });
    }

    const supabaseAdmin = createAdminClient();

    // Find the order. Prefer Shiprocket's id, then our reference: a UUID is orders.id,
    // anything else is treated as orders.order_number. Never error on a miss, so
    // Shiprocket's test call gets a clean 200.
    const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let order = null;
    if (shiprocketOrderId) {
      const { data } = await supabaseAdmin.from("orders").select("id").eq("shiprocket_order_id", shiprocketOrderId).maybeSingle();
      order = data;
    }
    if (!order && channelOrderId) {
      const column = UUID.test(channelOrderId) ? "id" : "order_number";
      const { data } = await supabaseAdmin.from("orders").select("id").eq(column, channelOrderId).maybeSingle();
      order = data;
    }
    if (!order) {
      console.warn("[Shiprocket Webhook]: No matching order found.", { channelOrderId, shiprocketOrderId });
      return NextResponse.json({ success: true, ignored: true });
    }

    const updateData = { shiprocket_status: currentStatus || null };
    if (awbCode) updateData.awb_code = awbCode;
    if (courierName) updateData.courier_name = courierName;

    const mappedStatus = mapShiprocketStatusToOrderStatus(currentStatus);
    if (mappedStatus) {
      updateData.order_status = mappedStatus;
      if (mappedStatus === "shipped") updateData.shipped_at = new Date().toISOString();
      if (mappedStatus === "delivered") updateData.delivered_at = new Date().toISOString();
      if (mappedStatus === "cancelled") updateData.cancelled_at = new Date().toISOString();
    }

    const { error } = await supabaseAdmin.from("orders").update(updateData).eq("id", order.id);
    if (error) {
      console.error("[Shiprocket Webhook Error]: DB update failed:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Shiprocket Webhook Critical Error]:", error);
    return NextResponse.json({ success: false, error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
