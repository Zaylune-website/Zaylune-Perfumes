"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// A Razorpay order only counts as a real sale once payment is confirmed —
// until then it may still be sitting in checkout or have been abandoned.
// COD has no online-payment step, so it's always real the moment it's
// placed. (Duplicated locally — a "use server" file may only export async
// functions, so this can't be imported from orders.js/dashboard.js.)
const VISIBLE_ORDERS_FILTER = "payment_method.neq.RAZORPAY,payment_status.eq.paid";

export async function getAllUsers() {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (!profiles || profiles.length === 0) return [];

  const { data: orders } = await supabase.from("orders").select("user_id, total_amount").or(VISIBLE_ORDERS_FILTER);

  return profiles.map((p) => {
    const userOrders = (orders || []).filter((o) => o.user_id === p.id);
    return {
      ...p,
      orderCount: userOrders.length,
      totalSpend: userOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
    };
  });
}
