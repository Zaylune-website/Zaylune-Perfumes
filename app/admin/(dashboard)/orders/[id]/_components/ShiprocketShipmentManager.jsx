"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { createShiprocketShipment, syncShiprocketStatus } from "@/actions/admin/orders";
import { SHIPROCKET_NEW_ORDERS_URL } from "@/lib/shiprocket-constants";
import { DEFAULT_PACKAGE } from "@/lib/constants";
import ShipmentStatusPill from "@/components/ShipmentStatusPill";
import ShiprocketTracking from "@/components/ShiprocketTracking";
import { Truck, ExternalLink, RefreshCw, CheckCircle2, X } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] transition-colors focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#2b1d12]/70";

// Default parcel weight shown in the ship modal. Matches a single bottle (150g) plus packaging (50g).
const DEFAULT_WEIGHT_KG = 0.2;

function ShipModal({ onClose, onConfirm, isPending, error }) {
  const [weightKg, setWeightKg] = useState(String(DEFAULT_WEIGHT_KG));
  const [dims, setDims] = useState({
    lengthCm: String(DEFAULT_PACKAGE.lengthCm),
    breadthCm: String(DEFAULT_PACKAGE.breadthCm),
    heightCm: String(DEFAULT_PACKAGE.heightCm),
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !isPending && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPending, onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#1c1109]/50 p-4 backdrop-blur-sm"
      onClick={() => !isPending && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-[#a8451a]/20 bg-white p-5 shadow-xl sm:p-7"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#a8451a]" />
            <h3 className="font-display text-lg font-bold text-[#1c1109]">Ship via Shiprocket</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close"
            className="rounded-full p-1.5 text-[#2b1d12]/70 hover:bg-[#fff5ee] hover:text-[#1c1109] disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-sm text-[#2b1d12]/70">
          The order is sent to Shiprocket with these package details. Then pick a courier in Shiprocket.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              disabled={isPending}
              className={inputClass}
            />
          </div>
          {[["lengthCm", "Length (cm)"], ["breadthCm", "Breadth (cm)"], ["heightCm", "Height (cm)"]].map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={dims[key]}
                onChange={(e) => setDims((d) => ({ ...d, [key]: e.target.value }))}
                disabled={isPending}
                className={inputClass}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-[#2b1d12]/60">Weight and size are pre-filled with defaults. Change them to match the packed parcel.</p>

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

        <div className="mt-6 flex gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 whitespace-nowrap rounded-xl border border-[#a8451a]/20 bg-white px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/75 hover:text-[#1c1109] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ weightKg, dims })}
            disabled={isPending}
            className="btn-gold flex-1 whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
          >
            {isPending ? "Sending…" : "Confirm Shipment"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ShiprocketShipmentManager({ order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSyncing, startSyncTransition] = useTransition();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [shiprocketOrderId, setShiprocketOrderId] = useState(order.shiprocket_order_id || null);
  const [awbCode, setAwbCode] = useState(order.awb_code || null);
  const [courierName, setCourierName] = useState(order.courier_name || null);
  const [status, setStatus] = useState(order.shiprocket_status || null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [scans, setScans] = useState([]);

  const handleCreate = ({ weightKg, dims }) => {
    setModalError(null);
    const parsedWeight = weightKg.trim() ? parseFloat(weightKg) : undefined;
    if (weightKg.trim() && (!parsedWeight || parsedWeight <= 0)) {
      setModalError("Enter a valid weight in kg (e.g. 0.3), or leave it blank to auto-estimate.");
      return;
    }
    const parsedDims = {};
    for (const key of ["lengthCm", "breadthCm", "heightCm"]) {
      const raw = dims[key].trim();
      if (!raw) continue;
      const value = parseFloat(raw);
      if (!value || value <= 0) {
        setModalError("Length, breadth and height must be positive numbers in cm, or left blank for the default.");
        return;
      }
      parsedDims[key] = value;
    }
    startTransition(async () => {
      const result = await createShiprocketShipment(order.id, parsedWeight, parsedDims);
      if (!result?.success) {
        setModalError(result?.error || "Failed to create Shiprocket shipment.");
        return;
      }
      if (result.shiprocketOrderId) setShiprocketOrderId(result.shiprocketOrderId);
      setStatus("NEW");
      setModalOpen(false);
      setMessage("Order sent to Shiprocket. Now click Ship Now there and pick a courier.");
    });
  };

  const handleSync = (silent = false) => {
    if (!silent) {
      setError(null);
      setMessage(null);
    }
    startSyncTransition(async () => {
      const result = await syncShiprocketStatus(order.id);
      if (!result.success) {
        if (!silent) setError(result.error || "Failed to sync status from Shiprocket.");
        return;
      }
      if (result.shiprocketStatus) setStatus(result.shiprocketStatus);
      if (result.awbCode) setAwbCode(result.awbCode);
      if (result.courierName) setCourierName(result.courierName);
      setCurrentLocation(result.currentLocation || null);
      setScans(result.scans || []);
      // Sync can move the order to shipped/delivered. Refresh so the order stepper above matches.
      if (result.orderStatus && result.orderStatus !== order.order_status) router.refresh();
      if (!silent) setMessage("Status synced from Shiprocket.");
    });
  };

  // Pull the live status once when the panel opens, so the admin doesn't have
  // to click refresh. Silent: a slow Shiprocket shouldn't flash an error.
  useEffect(() => {
    if (order.shiprocket_order_id) handleSync(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!shiprocketOrderId) {
    return (
      <div className="mt-5 space-y-4 border-t border-[#a8451a]/10 pt-5">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#a8451a]" />
          <h3 className="text-base font-semibold uppercase tracking-wide text-[#2b1d12]/70">Shipment</h3>
        </div>
        <p className="text-sm text-[#2b1d12]/70">
          Pushes this order to Shiprocket. You then pick a courier and confirm pickup in Shiprocket.
        </p>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button
          type="button"
          onClick={() => {
            setModalError(null);
            setModalOpen(true);
          }}
          className="btn-gold w-full px-4 py-2.5 text-sm font-semibold uppercase tracking-wide"
        >
          Ship via Shiprocket
        </button>

        {modalOpen && (
          <ShipModal
            onClose={() => setModalOpen(false)}
            onConfirm={handleCreate}
            isPending={isPending}
            error={modalError}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4 border-t border-[#a8451a]/10 pt-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#a8451a]" />
          <h3 className="text-base font-semibold uppercase tracking-wide text-[#2b1d12]/70">Shipment</h3>
        </div>
        <button
          type="button"
          onClick={() => handleSync()}
          disabled={isSyncing}
          aria-label="Refresh status from Shiprocket"
          title="Fetch the latest status from Shiprocket"
          className="rounded-full border border-[#a8451a]/25 bg-white p-1.5 text-[#a8451a] transition-colors hover:bg-[#fff5ee] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      {message && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> {message}
        </p>
      )}

      {awbCode ? (
        <ShiprocketTracking
          awbCode={awbCode}
          courierName={courierName}
          status={status}
          currentLocation={currentLocation}
          scans={scans}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[#2b1d12]/70">
            Sent to Shiprocket (order <span className="font-mono text-[#1c1109]">{shiprocketOrderId}</span>). No courier assigned yet.
          </p>
          <p className="text-xs italic text-[#2b1d12]/65">
            Click &quot;Ship Now&quot; on this order in Shiprocket. The AWB, courier and tracking will appear here automatically.
          </p>
          <a
            href={SHIPROCKET_NEW_ORDERS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#a8451a]/30 bg-white px-4 py-2.5 text-sm font-semibold text-[#a8451a] shadow-2xs transition-colors hover:bg-[#fff5ee]"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open Shiprocket: Ship Now
          </a>
          {status && (
            <div className="flex items-center justify-between text-sm text-[#2b1d12]/70">
              <span>Status</span>
              <ShipmentStatusPill status={status} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
