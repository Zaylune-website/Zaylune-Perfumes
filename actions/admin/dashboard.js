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
      { data: lowStockRaw },
      { data: recentOrders },
      { count: pendingReviewCount },
      { count: unresolvedInquiryCount },
    ] = await Promise.all([
      supabase.from("orders").select("total_amount, payment_status, order_status", { count: "exact" }).or(VISIBLE_ORDERS_FILTER),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("show_in_shop", true).eq("is_active", true),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("product_variants")
        .select("id, variant_name, stock_quantity, products!inner ( name, show_in_shop, is_active )")
        .lte("stock_quantity", 5)
        .gt("stock_quantity", 0)
        .eq("is_active", true)
        .order("stock_quantity", { ascending: true }),
      supabase
        .from("orders")
        .select("id, order_number, total_amount, order_status, created_at")
        .or(VISIBLE_ORDERS_FILTER)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("is_resolved", false),
    ]);

    // PostgREST embedded-resource filters are unreliable for nested columns;
    // post-filter in JS to ensure we only surface active, visible products,
    // and deduplicate any rows sharing the same product + variant name (DB
    // can accumulate duplicate variant records from re-saves).
    const _seen = new Set();
    const lowStock = (lowStockRaw || [])
      .filter((v) => v.products?.is_active === true && v.products?.show_in_shop === true)
      .filter((v) => {
        const key = `${v.products?.name}::${v.variant_name}`;
        if (_seen.has(key)) return false;
        _seen.add(key);
        return true;
      });

    const revenue = (orders || [])
      .filter((o) => o.payment_status === "paid" || o.order_status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const pendingOrders = (orders || []).filter((o) => o.order_status === "pending").length;

    return {
      orderCount: orderCount || 0,
      productCount: productCount || 0,
      customerCount: customerCount || 0,
      revenue,
      pendingOrders,
      lowStock: lowStock || [],
      recentOrders: recentOrders || [],
      pendingReviewCount: pendingReviewCount || 0,
      unresolvedInquiryCount: unresolvedInquiryCount || 0,
    };
  },
  ["admin-dashboard-stats-v3"],
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
