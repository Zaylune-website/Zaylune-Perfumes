// Shiprocket API client. Server-only: makes network calls with server secrets,
// so import it only from server actions, route handlers or server components.
//
// Auth: Shiprocket has no static API key. We log in with the email/password of
// the dedicated API user (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD), use the
// bearer token it returns, and cache that token in memory (~10 days).

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken = null;
let cachedTokenExpiresAt = 0; // epoch ms

async function login() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD are not configured on the server environment.");
  }

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.token) {
    console.error("[Shiprocket] Login failed:", res.status, data);
    throw new Error(data?.message || "Failed to authenticate with Shiprocket.");
  }

  cachedToken = data.token;
  // Tokens last ~10 days; refresh a day early.
  cachedTokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
  return cachedToken;
}

async function getToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;
  return login();
}

async function shiprocketFetch(path, options = {}, retry = true) {
  const token = await getToken();

  const res = await fetch(`${SHIPROCKET_BASE}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  // Cached token was rejected: refresh once and retry.
  if (res.status === 401 && retry) {
    cachedToken = null;
    return shiprocketFetch(path, options, false);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error(`[Shiprocket] ${path} failed:`, res.status, data);
    const message =
      data?.message || (data?.errors ? JSON.stringify(data.errors) : `Shiprocket request failed (${res.status})`);
    throw new Error(message);
  }

  return data;
}

// Shiprocket wants "YYYY-MM-DD HH:mm" in local time.
function toShiprocketDate(iso) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function buildOrderPayload(input) {
  const isCod = String(input.paymentMethod || "").toUpperCase().includes("COD");

  return {
    order_id: input.orderId,
    order_date: toShiprocketDate(input.orderDate),
    // Trim defensively: a stray space in the env var makes Shiprocket reject
    // every order with "Wrong Pickup location entered".
    pickup_location: (process.env.SHIPROCKET_PICKUP_LOCATION || "").trim(),
    billing_customer_name: input.customerName || "Customer",
    billing_last_name: "",
    billing_address: input.shippingStreet,
    billing_city: input.shippingCity,
    billing_pincode: input.shippingPincode,
    billing_state: input.shippingState,
    billing_country: input.shippingCountry || "India",
    billing_email: input.customerEmail,
    billing_phone: String(input.customerPhone || "").replace(/\D/g, "").slice(-10),
    shipping_is_billing: true,
    order_items: input.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.selling_price,
    })),
    payment_method: isCod ? "COD" : "Prepaid",
    sub_total: input.subtotal,
    length: input.lengthCm,
    breadth: input.breadthCm,
    height: input.heightCm,
    weight: input.weightKg,
  };
}

export async function createShiprocketOrder(input) {
  if (!process.env.SHIPROCKET_PICKUP_LOCATION?.trim()) {
    throw new Error("SHIPROCKET_PICKUP_LOCATION is not configured on the server environment.");
  }

  const payload = buildOrderPayload(input);
  const data = await shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Shiprocket can return HTTP 200 without order/shipment ids when the payload
  // is wrong (bad pickup name, pending KYC, duplicate order_id, bad phone or
  // pincode). The reason comes back in `message` or `errors`.
  const message =
    typeof data?.message === "string" && data.message ? data.message : data?.errors ? JSON.stringify(data.errors) : null;

  return {
    shiprocketOrderId: data?.order_id ? String(data.order_id) : null,
    shipmentId: data?.shipment_id ? String(data.shipment_id) : null,
    status: data?.status || null,
    message,
    raw: data,
  };
}

export function trackingUrlForAwb(awbCode) {
  return `https://shiprocket.co/tracking/${awbCode}`;
}

// Shared by the webhook (push) and the manual sync (pull) so both collapse a
// Shiprocket status into the 4 order_status values the app understands.
export function mapShiprocketStatusToOrderStatus(currentStatus) {
  if (!currentStatus) return null;
  const s = currentStatus.toLowerCase();

  if (s.includes("delivered")) return "delivered";
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("rto")) return "cancelled";
  if (s.includes("out for delivery") || s.includes("in transit") || s.includes("shipped") || s.includes("picked up")) {
    return "shipped";
  }
  // Pickup scheduled, label generated, AWB assigned, etc. — order status stays put.
  return null;
}

export async function trackShipmentByAwb(awbCode) {
  const data = await shiprocketFetch(`/courier/track/awb/${encodeURIComponent(awbCode)}`);
  const shipmentData = data?.tracking_data?.shipment_track?.[0];
  const activities = data?.tracking_data?.shipment_track_activities || [];

  const scans = activities.map((a) => ({
    date: a?.date ? String(a.date) : null,
    status: a?.status ? String(a.status) : null,
    activity: a?.activity ? String(a.activity) : null,
    location: a?.location ? String(a.location) : null,
  }));

  return {
    currentStatus: shipmentData?.current_status ? String(shipmentData.current_status) : null,
    courierName: shipmentData?.courier_name ? String(shipmentData.courier_name) : null,
    currentLocation: scans[0]?.location || null,
    scans,
    raw: data,
  };
}

// For an order with no AWB yet: checks the order-level status, and picks up an
// AWB if Shiprocket has one but our DB never got the webhook.
export async function getShiprocketOrderStatus(shiprocketOrderId) {
  const data = await shiprocketFetch(`/orders/show/${encodeURIComponent(shiprocketOrderId)}`);
  const order = data?.data;
  // `shipments` is an object for one shipment, an array when split.
  const shipment = Array.isArray(order?.shipments) ? order.shipments[0] : order?.shipments;

  const awbCode = shipment?.awb || shipment?.awb_code || order?.last_mile_awb || order?.awb_code || order?.awb || null;
  const courierName =
    shipment?.courier || shipment?.courier_name || order?.last_mile_courier_name || order?.courier_name || null;

  return {
    currentStatus: order?.status ? String(order.status) : null,
    awbCode: awbCode ? String(awbCode) : null,
    courierName: courierName ? String(courierName) : null,
    raw: data,
  };
}

// Courier serviceability for a delivery pincode. Shiprocket lists the couriers
// that can deliver from the pickup pincode; each courier has a `cod` flag.
export async function checkServiceability({ deliveryPincode, weightKg = 0.2 }) {
  const pickup = process.env.SHIPROCKET_PICKUP_PINCODE;
  if (!pickup) throw new Error("SHIPROCKET_PICKUP_PINCODE is not configured on the server environment.");

  const params = new URLSearchParams({
    pickup_postcode: pickup,
    delivery_postcode: deliveryPincode,
    weight: String(weightKg),
    cod: "0",
  });
  const data = await shiprocketFetch(`/courier/serviceability/?${params.toString()}`);
  const couriers = data?.data?.available_courier_companies || [];

  return {
    serviceable: couriers.length > 0,
    codAvailable: couriers.some((c) => Number(c.cod) === 1),
  };
}

// Shared by the admin sync actions and the customer order page: fetches the
// live status from Shiprocket and writes it to our DB, saving the AWB and
// courier too if Shiprocket has them. Callers must already have verified who
// is allowed to see the order.
export async function syncOneOrderFromShiprocket(adminClient, order) {
  let currentStatus = null;
  let awbCode = order.awb_code || null;
  let courierName = null;
  let currentLocation = null;
  let scans = [];

  if (order.awb_code) {
    const tracked = await trackShipmentByAwb(order.awb_code);
    currentStatus = tracked.currentStatus;
    courierName = tracked.courierName;
    currentLocation = tracked.currentLocation;
    scans = tracked.scans;
  } else {
    const orderStatus = await getShiprocketOrderStatus(order.shiprocket_order_id);
    currentStatus = orderStatus.currentStatus;
    if (orderStatus.awbCode) {
      awbCode = orderStatus.awbCode;
      courierName = orderStatus.courierName;
      const tracked = await trackShipmentByAwb(orderStatus.awbCode);
      if (tracked.currentStatus) currentStatus = tracked.currentStatus;
      if (tracked.courierName) courierName = tracked.courierName;
      currentLocation = tracked.currentLocation;
      scans = tracked.scans;
    }
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

  const { error: updateError } = await adminClient.from("orders").update(updateData).eq("id", order.id);
  if (updateError) throw new Error(updateError.message);

  return {
    shiprocketStatus: currentStatus,
    awbCode,
    courierName,
    orderStatus: mappedStatus,
    currentLocation,
    scans,
  };
}
