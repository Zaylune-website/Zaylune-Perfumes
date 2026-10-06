// Shared by the order page (server) and the live-refresh poller (client).
// Keeps the fields that change while an order moves along, so the poller can
// tell when the page is stale.
export const TRACKING_FIELDS = [
  "order_status",
  "processing_at",
  "shipped_at",
  "delivered_at",
  "awb_code",
  "courier_name",
  "shiprocket_status",
];

export function trackingSnapshot(order) {
  const picked = {};
  for (const key of TRACKING_FIELDS) picked[key] = order?.[key] ?? null;
  return JSON.stringify(picked);
}
