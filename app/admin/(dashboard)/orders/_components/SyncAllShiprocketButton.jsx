"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { syncAllShiprocketOrders } from "@/actions/admin/orders";

// Pulls the latest AWB and status from Shiprocket for every order that was pushed.
export default function SyncAllShiprocketButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const handleSync = () => {
    setResult(null);
    startTransition(async () => {
      const res = await syncAllShiprocketOrders();
      if (!res.success) {
        setResult({ ok: false, text: res.error || "Sync failed." });
        return;
      }
      setResult({
        ok: res.failed === 0,
        text: `Synced ${res.synced} order${res.synced === 1 ? "" : "s"}${res.failed ? `, ${res.failed} failed` : ""}.`,
      });
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSync}
        disabled={pending}
        title="Fetch the latest AWB and status from Shiprocket for every shipped order, in case a webhook was missed"
        className="inline-flex items-center gap-2 rounded-xl border border-[#a8451a]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#a8451a] shadow-sm transition-colors hover:bg-[#fff5ee] disabled:opacity-60"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} />
        {pending ? "Syncing…" : "Sync with Shiprocket"}
      </button>
      {result && (
        <p className={`flex items-center gap-1.5 text-xs font-medium ${result.ok ? "text-emerald-700" : "text-rose-700"}`}>
          {result.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          {result.text}
        </p>
      )}
    </div>
  );
}
