import { CheckCircle2, Truck, Clock3, AlertTriangle } from "lucide-react";

// Courier scan/status text is free-form ("In Transit", "Dispatched",
// "Pending", "RTO Initiated", ...) so tone is inferred from keywords rather
// than an exact match against a fixed status list. Shared by the admin and
// customer shipment-tracking UIs so both stay visually consistent.
export function getShipmentTone(text) {
  const s = (text || "").toLowerCase();
  if (s.includes("delivered")) return "green";
  if (s.includes("rto") || s.includes("undelivered") || s.includes("cancel") || s.includes("lost") || s.includes("damage")) return "red";
  if (s.includes("transit") || s.includes("dispatch") || s.includes("out for")) return "blue";
  return "gold";
}

export const SHIPMENT_TONE_DOT = {
  green: "bg-emerald-400 text-emerald-400",
  red: "bg-red-400 text-red-400",
  blue: "bg-blue-400 text-blue-400",
  gold: "bg-gold-300 text-gold-300",
};

export const SHIPMENT_TONE_TEXT = {
  green: "text-emerald-300",
  red: "text-red-300",
  blue: "text-blue-300",
  gold: "text-gold-200",
};

export const SHIPMENT_TONE_PILL = {
  green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  red: "border-red-400/25 bg-red-400/10 text-red-300",
  blue: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  gold: "border-gold-400/25 bg-gold-400/10 text-gold-200",
};

// Solid-fill circle a timeline step's icon sits inside — bright enough that
// the icon needs a dark ("ink") glyph on the lighter tones and white on the
// deeper ones to stay readable.
export const SHIPMENT_TONE_CIRCLE = {
  green: "bg-emerald-400 text-ink",
  red: "bg-red-400 text-ink",
  blue: "bg-blue-400 text-ink",
  gold: "bg-gold-300 text-ink",
};

export const SHIPMENT_TONE_ICON = {
  green: CheckCircle2,
  red: AlertTriangle,
  blue: Truck,
  gold: Clock3,
};

export function scanTone(text) {
  const tone = getShipmentTone(text);
  return {
    dot: SHIPMENT_TONE_DOT[tone],
    text: SHIPMENT_TONE_TEXT[tone],
    circle: SHIPMENT_TONE_CIRCLE[tone],
    Icon: SHIPMENT_TONE_ICON[tone],
  };
}

// "24 Sep 2026, 6:44 PM" — reads faster in a timeline than the raw
// toLocaleString() output ("24/9/2026, 6:44:38 pm"), which crams in seconds
// and an all-numeric date.
export function formatScanTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
