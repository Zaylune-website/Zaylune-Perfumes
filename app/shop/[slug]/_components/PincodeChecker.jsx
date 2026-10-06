"use client";

import { useState } from "react";
import { Check, X, MapPin, Loader2 } from "lucide-react";
import { checkPincodeServiceability } from "@/actions/shiprocket";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'serviceable' | 'unserviceable' | 'error'
  const [info, setInfo] = useState(null); // { district, state, cod }

  const handleCheck = async (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setStatus("error");
      setInfo({ message: "Please enter a valid 6-digit PIN code." });
      return;
    }

    setLoading(true);
    setStatus(null);
    setInfo(null);

    try {
      const result = await checkPincodeServiceability(cleanPin);

      if (!result.success) {
        setStatus("error");
        setInfo({ message: result.error });
      } else if (result.serviceable) {
        setStatus("serviceable");
        setInfo({ district: result.district || cleanPin, state: result.state || "your area", cod: result.cod });
      } else {
        setStatus("unserviceable");
      }
    } catch {
      setStatus("error");
      setInfo({ message: "Unable to check pincode right now. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#a8451a]/20 bg-white/85 p-5 shadow-sm backdrop-blur-md max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-[#c04a1c]" />
        <span className="text-sm font-bold uppercase tracking-wider text-[#a8451a]">
          Check Delivery Pincode
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            if (status) setStatus(null);
          }}
          placeholder="6-digit PIN Code"
          className="min-w-0 flex-1 truncate rounded-xl border border-[#a8451a]/25 bg-white px-3 sm:px-4 py-3 text-base text-[#1c1109] placeholder-[#2b1d12]/40 outline-none transition-all focus:border-[#a8451a] focus:ring-2 focus:ring-[#a8451a]/15 font-mono"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="shrink-0 rounded-xl bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] px-4 sm:px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:shadow-md hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center min-w-[64px] sm:min-w-[84px]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </form>

      {status === "serviceable" && info && (
        <div className="pincode-ok relative mt-3.5 overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-3.5 sm:p-4">
          <style>{`
            @keyframes pcPop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
            @keyframes pcHalo { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(2.1); opacity: 0; } }
            @keyframes pcRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
            @keyframes pcShine { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
            @media (prefers-reduced-motion: reduce) { .pincode-ok, .pincode-ok * { animation: none !important; } }
          `}</style>
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" style={{ animation: "pcShine 1.4s ease-in-out 0.3s both" }} />
          <div className="relative flex items-start gap-3">
            <span className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center">
              <span aria-hidden className="absolute inset-0 rounded-full border-2 border-emerald-500/50" style={{ animation: "pcHalo 1.6s ease-out 0.4s infinite" }} />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md" style={{ animation: "pcPop 0.6s cubic-bezier(.34,1.56,.64,1) both" }}>
                <Check className="h-4 w-4 stroke-[3]" />
              </span>
            </span>
            <p className="text-sm sm:text-base font-semibold text-emerald-800" style={{ animation: "pcRise 0.6s ease-out 0.25s both" }}>
              Express Delivery available to{" "}
              <span className="font-extrabold text-[#1c1109]">{info.district}, {info.state}</span>
            </p>
          </div>
        </div>
      )}

      {status === "unserviceable" && (
        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-50/80 p-3.5 text-sm text-rose-800 animate-fadeIn">
          <X className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-bold text-rose-800">Not Serviceable</p>
            <p className="mt-0.5 text-[#2b1d12]/80">
              Sorry, we currently do not deliver to this pincode via courier.
            </p>
          </div>
        </div>
      )}

      {status === "error" && info && (
        <div className="mt-3.5 text-sm font-semibold text-rose-600 px-1 animate-fadeIn">
          {info.message}
        </div>
      )}
    </div>
  );
}
