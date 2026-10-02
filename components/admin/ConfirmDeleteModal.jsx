"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, pending, label = "this item" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !pending && onClose()} />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-red-500/20 bg-gradient-to-b from-[#1a0f0f] via-[#120a0a] to-[#0b0808] p-8 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.06),transparent_65%)]" />
        <button
          onClick={onClose}
          disabled={pending}
          className="absolute right-5 top-5 rounded-full p-1.5 text-ivory/40 transition-colors hover:text-ivory disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/25 bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <h2 className="font-display text-2xl font-light text-ivory">Delete?</h2>
          <p className="mt-2 text-sm text-ivory/50">
            <span className="font-semibold text-ivory/80">{label}</span> will be permanently deleted. This cannot be undone.
          </p>
          <div className="mt-7 flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={pending}
              className="flex-1 rounded-2xl border border-gold-400/15 bg-ink-soft/40 py-3 text-sm font-medium text-ivory/60 transition-colors hover:text-ivory disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
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
  );
}
