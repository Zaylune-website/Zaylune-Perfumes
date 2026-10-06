"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteOrder } from "@/actions/admin/orders";

export default function DeleteOrderButton({ orderId, orderNumber }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteOrder(orderId);
      if (result.success) {
        router.push("/admin/orders");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
        Delete Order
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !pending && setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-red-500/20 bg-gradient-to-b from-[#fdf0ee] via-[#fbe3df] to-[#f6d2cb] p-8 shadow-sm">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.06),transparent_65%)]" />

            <button
              onClick={() => setOpen(false)}
              disabled={pending}
              className="absolute right-5 top-5 rounded-full p-1.5 text-[#2b1d12]/70 transition-colors hover:text-[#1c1109] disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex flex-col items-center text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/25 bg-red-500/10">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>

              <h2 className="font-display text-2xl font-medium text-[#1c1109]">Delete Order?</h2>
              <p className="mt-2 text-sm text-[#2b1d12]/72">
                Order <span className="font-semibold text-[#2b1d12]/82">{orderNumber}</span> will be permanently deleted. This cannot be undone.
              </p>

              <div className="mt-7 flex w-full gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  className="flex-1 rounded-2xl border border-[#a8451a]/15 bg-[#fde3cf]/40 py-3 text-sm font-medium text-[#2b1d12]/75 transition-colors hover:text-[#1c1109] disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={pending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500/80 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(239,68,68,0.2)] transition-all hover:bg-red-500 hover:shadow-[0_4px_24px_rgba(239,68,68,0.35)] disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  {pending ? "Deleting…" : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
