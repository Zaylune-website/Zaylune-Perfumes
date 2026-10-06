import { Truck, ExternalLink, MapPin, CheckCircle2, Package } from "lucide-react";
import { getShipmentTone } from "@/lib/shipmentTone";

// Same structure as the storefront tracking card: status hero, AWB box, track
// button and a timeline with the latest scan highlighted. Rendered on the server
// with the scans the order page already synced from Shiprocket.

const STATUS_STYLE = {
  green: "text-emerald-800 bg-emerald-50 border-emerald-500/35",
  red: "text-rose-800 bg-rose-50 border-rose-500/35",
  blue: "text-blue-800 bg-blue-50 border-blue-500/35",
  gold: "text-[#a8451a] bg-[#fde3cf]/60 border-[#a8451a]/30",
};

function eventIcon(text) {
  const s = (text || "").toLowerCase();
  if (s.includes("deliver")) return CheckCircle2;
  if (s.includes("transit") || s.includes("out for") || s.includes("dispatch") || s.includes("pickup")) return Truck;
  return Package;
}

function formatWhen(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ShiprocketTracking({ awbCode, courierName, status, currentLocation, scans }) {
  const sortedScans = [...scans].sort((a, b) => {
    const ta = a.date ? new Date(a.date).getTime() : 0;
    const tb = b.date ? new Date(b.date).getTime() : 0;
    return tb - ta;
  });
  const tone = getShipmentTone(status);
  const isDelivered = (status || "").toLowerCase().includes("deliver");
  const isLive = Boolean(awbCode);

  return (
    <div className="relative rounded-[1.5rem] sm:rounded-[2rem] p-[2px] bg-gradient-to-br from-[#8e3510] via-[#d4a359]/70 to-[#c04a1c] shadow-[0_8px_40px_-12px_rgba(122,40,18,0.35)]">
      <div className="relative overflow-hidden rounded-[calc(1.5rem-2px)] sm:rounded-[calc(2rem-2px)] bg-white p-4 sm:p-6 md:p-9">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#c04a1c]/[0.07] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#d4a359]/[0.10] blur-[100px]" />

        <div className="relative mb-5 flex items-center justify-between gap-2 sm:mb-6 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
            <div className="flex h-10 w-10 shrink-0 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-lg sm:h-12 sm:w-12">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-display text-base sm:text-xl font-extrabold leading-tight text-[#1c1109]">Shipment Tracking</h2>
              <p className="mt-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#2b1d12]/50">Powered by Shiprocket</p>
            </div>
          </div>
          {isLive && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
          )}
        </div>

        {/* Status hero */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#a8451a]/15 bg-gradient-to-br from-[#fffaf5] to-[#fde3cf]/30 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            {status ? (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider ${STATUS_STYLE[tone] || STATUS_STYLE.gold}`}>
                {isDelivered && <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                {status}
              </span>
            ) : (
              <span className="text-sm font-semibold text-[#2b1d12]/60">Status not available yet</span>
            )}
          </div>
          {currentLocation && (
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2b1d12]/50">Current location</p>
                <p className="text-xs sm:text-sm font-bold text-[#1c1109]">{currentLocation}</p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#a8451a]/20 bg-white sm:h-9 sm:w-9">
                <MapPin className="h-3.5 w-3.5 text-[#c04a1c] sm:h-4 sm:w-4" />
              </div>
            </div>
          )}
        </div>

        {/* Courier + AWB */}
        <div className="relative mt-3.5 flex flex-wrap gap-2.5 sm:mt-4 sm:gap-3">
          <div className="flex-1 min-w-[140px] rounded-xl border border-[#a8451a]/15 bg-[#fffaf5] px-3.5 py-2.5 sm:px-4 sm:py-3">
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2b1d12]/50">Courier</p>
            <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#1c1109]">{courierName || "Assigned soon"}</p>
          </div>
          <div className="flex-1 min-w-[140px] rounded-xl border border-[#a8451a]/15 bg-[#fffaf5] px-3.5 py-2.5 sm:px-4 sm:py-3">
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2b1d12]/50">AWB Number</p>
            <p className="mt-0.5 select-all font-mono text-xs sm:text-sm font-bold text-[#1c1109]">{awbCode || "Not yet assigned"}</p>
          </div>
        </div>

        {isLive && (
          <a
            href={`https://shiprocket.co/tracking/${awbCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-3.5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8e3510] to-[#c04a1c] px-5 py-2.5 text-[11px] sm:py-3 sm:text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-[#8e3510]/20 transition-all hover:shadow-xl sm:w-auto sm:inline-flex sm:hover:scale-[1.02] active:scale-100"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Track Shipment<span className="hidden sm:inline"> on Shiprocket</span></span>
          </a>
        )}

        {/* Timeline */}
        {sortedScans.length > 0 && (
          <div className="relative mt-6 border-t border-[#a8451a]/10 pt-5 sm:mt-7 sm:pt-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#2b1d12]/55 sm:mb-5">Tracking Timeline</p>
            <div
              className="max-h-96 space-y-0 overflow-y-auto px-2 -mx-2"
              style={{ maskImage: "linear-gradient(to bottom, black 92%, transparent 100%)" }}
            >
              {sortedScans.map((scan, idx) => {
                const isLatest = idx === 0;
                const EventIcon = eventIcon(scan.activity || scan.status || "");
                return (
                  <div key={idx} className="flex gap-2.5 sm:gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className={`shrink-0 rounded-full ${isLatest ? "bg-[#c04a1c]/15 p-1" : ""}`}>
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
                            isLatest
                              ? "bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-lg shadow-[#c04a1c]/30"
                              : "border-2 border-[#a8451a]/15 bg-white text-[#2b1d12]/35"
                          }`}
                        >
                          <EventIcon className="h-4 w-4" />
                        </div>
                      </div>
                      {idx !== sortedScans.length - 1 && (
                        <div className={`my-1 w-px flex-1 ${isLatest ? "bg-gradient-to-b from-[#c04a1c]/40 to-[#a8451a]/10" : "bg-[#a8451a]/10"}`} />
                      )}
                    </div>
                    <div className={`min-w-0 flex-1 ${isLatest ? "mb-4 rounded-xl border border-[#c04a1c]/15 bg-[#fde3cf]/35 px-4 py-3" : "pb-5"}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`text-sm font-bold ${isLatest ? "text-[#1c1109]" : "text-[#2b1d12]/70"}`}>
                          {scan.activity || scan.status}
                        </p>
                        {isLatest && (
                          <span className="rounded-full border border-[#a8451a]/20 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#a8451a]">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[#2b1d12]/55">
                        {scan.location && <span>{scan.location}</span>}
                        {scan.location && scan.date && <span className="text-[#2b1d12]/25">&middot;</span>}
                        {scan.date && <span>{formatWhen(scan.date)}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sortedScans.length === 0 && !isLive && (
          <p className="relative mt-6 border-t border-[#a8451a]/10 pt-4 text-sm text-[#2b1d12]/60">
            Your order is with our team. Tracking details will appear here once the courier picks it up.
          </p>
        )}
      </div>
    </div>
  );
}
