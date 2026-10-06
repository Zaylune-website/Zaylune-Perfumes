"use server";

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// A Razorpay order only counts as a real sale once the webhook (or the
// post-payment verify call) has flipped it to "paid" — until then the
// customer may still be in the checkout modal, or may have abandoned it.
// COD has no online-payment step, so it's always real the moment it's placed.
// (Kept as a local literal — this is duplicated from admin/orders.js since a
// "use server" file may only export async functions.)
const VISIBLE_ORDERS_FILTER = "payment_method.neq.RAZORPAY,payment_status.eq.paid";

const getDashboardStatsCached = unstable_cache(
  async () => {
    const supabase = createAdminClient();

    const [
      { data: orders, count: orderCount },
      { count: productCount },
      { count: customerCount },
      { data: recentOrders },
      { count: pendingReviewCount },
      { count: unresolvedInquiryCount },
    ] = await Promise.all([
      supabase.from("orders").select("total_amount, payment_status, order_status, created_at", { count: "exact" }).or(VISIBLE_ORDERS_FILTER),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("show_in_shop", true).eq("is_active", true),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id, order_number, total_amount, order_status, created_at")
        .or(VISIBLE_ORDERS_FILTER)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("is_resolved", false),
    ]);

    const isRealized = (o) => o.payment_status === "paid" || o.order_status !== "cancelled";

    const revenue = (orders || [])
      .filter(isRealized)
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const pendingOrders = (orders || []).filter((o) => o.order_status === "pending").length;

    // Revenue for each of the last 6 calendar months (including the current
    // one), for the dashboard trend chart. Reuses the `orders` rows already
    // fetched above for the all-time revenue total — no extra query needed.
    const monthKeys = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setUTCDate(1); // pin to day 1 first so subtracting months never rolls into the wrong month
      d.setUTCMonth(d.getUTCMonth() - (5 - i));
      return d.toISOString().slice(0, 7); // "YYYY-MM"
    });
    const revenueByMonth = Object.fromEntries(monthKeys.map((k) => [k, 0]));
    const orderCountByMonth = Object.fromEntries(monthKeys.map((k) => [k, 0]));
    (orders || []).filter(isRealized).forEach((o) => {
      const key = new Date(o.created_at).toISOString().slice(0, 7);
      if (key in revenueByMonth) {
        revenueByMonth[key] += Number(o.total_amount);
        orderCountByMonth[key] += 1;
      }
    });
    const revenueTrend = monthKeys.map((month) => ({
      month,
      revenue: revenueByMonth[month],
      orders: orderCountByMonth[month],
    }));

    const orderStatusCounts = (orders || []).reduce((acc, o) => {
      acc[o.order_status] = (acc[o.order_status] || 0) + 1;
      return acc;
    }, {});

    return {
      orderCount: orderCount || 0,
      productCount: productCount || 0,
      customerCount: customerCount || 0,
      revenue,
      pendingOrders,
      recentOrders: recentOrders || [],
      pendingReviewCount: pendingReviewCount || 0,
      unresolvedInquiryCount: unresolvedInquiryCount || 0,
      revenueTrend,
      orderStatusCounts,
    };
  },
  ["admin-dashboard-stats-v6"],
  { revalidate: 30, tags: ["dashboard-stats"] }
);

export async function getDashboardStats() {
  return getDashboardStatsCached();
}

// Lean, separately-cached counts for the sidebar's nav badges — avoids
// running the full 7-query dashboard stats fetch just to show 3 numbers.
const getSidebarBadgeCountsCached = unstable_cache(
  async () => {
    const supabase = createAdminClient();

    const [{ count: pendingOrders }, { count: pendingReviewCount }, { count: unresolvedInquiryCount }] =
      await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending").or(VISIBLE_ORDERS_FILTER),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("is_resolved", false),
      ]);

    return {
      pendingOrders: pendingOrders || 0,
      pendingReviewCount: pendingReviewCount || 0,
      unresolvedInquiryCount: unresolvedInquiryCount || 0,
    };
  },
  ["admin-sidebar-badges"],
  { revalidate: 30, tags: ["dashboard-stats"] }
);

export async function getSidebarBadgeCounts() {
  return getSidebarBadgeCountsCached();
}
