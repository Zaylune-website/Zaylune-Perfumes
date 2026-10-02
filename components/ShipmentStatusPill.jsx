import { getShipmentTone, SHIPMENT_TONE_PILL, SHIPMENT_TONE_ICON } from "@/lib/shipmentTone";

export default function ShipmentStatusPill({ status }) {
  const tone = getShipmentTone(status);
  const Icon = SHIPMENT_TONE_ICON[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${SHIPMENT_TONE_PILL[tone]}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {status}
    </span>
  );
}
