import { getShipmentTone, SHIPMENT_TONE_ICON } from "@/lib/shipmentTone";

const TONE_PILL_STYLES = {
  green: "border-emerald-500/30 bg-emerald-50 text-emerald-800",
  red: "border-rose-500/30 bg-rose-50 text-rose-800",
  blue: "border-blue-500/30 bg-blue-50 text-blue-800",
  gold: "border-amber-500/30 bg-amber-50 text-amber-900",
};

export default function ShipmentStatusPill({ status }) {
  const tone = getShipmentTone(status);
  const Icon = SHIPMENT_TONE_ICON[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${TONE_PILL_STYLES[tone] || TONE_PILL_STYLES.gold}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {status}
    </span>
  );
}
