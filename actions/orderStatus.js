"use server";

import { createClient } from "@/lib/supabase/server";
import { TRACKING_FIELDS, trackingSnapshot } from "@/lib/orderTracking";

// Polled by the order page. Reads only this customer's own order, and only the
// tracking fields, so nothing else leaks through.
export async function getOrderTrackingSnapshot(orderId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("orders")
    .select(TRACKING_FIELDS.join(", "))
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? trackingSnapshot(data) : null;
}
