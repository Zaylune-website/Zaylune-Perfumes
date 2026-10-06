"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, pending, label = "this item" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <style>{`
        @keyframes cdFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cdPop { from { opacity: 0; transform: translateY(14px) scale(0.96); } to { opacity: 1; transform: none; } }
        .cd-fade { animation: cdFade 0.25s ease-out both; }
        .cd-pop { animation: cdPop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) { .cd-fade, .cd-pop { animation: none; } }
      `}</style>
      <div
        className="cd-fade absolute inset-0 bg-[#1c1109]/50 backdrop-blur-md"
        onClick={() => !pending && onClose()}
      />
      <div className="cd-pop relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#a8451a]/20 bg-gradient-to-b from-white via-white to-[#fffaf5] p-6 shadow-[0_30px_80px_-30px_rgba(122,40,18,0.55)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-rose-500/10 blur-3xl" />
        <button
          onClick={onClose}
          disabled={pending}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#a8451a]/20 bg-white text-[#a8451a] shadow-2xs transition-all duration-300 hover:rotate-90 hover:bg-[#fff5ee] disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/25 bg-gradient-to-br from-rose-50 to-[#fde3cf] shadow-sm">
            <AlertTriangle className="h-7 w-7 text-rose-600" />
          </div>
          <span className="mb-2 inline-flex items-center rounded-full border border-rose-500/25 bg-rose-50 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-700">
            Permanent
          </span>
          <h2 className="font-display text-2xl font-extrabold text-[#1c1109]">Delete this?</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#2b1d12]/75">
            <span className="break-all font-semibold text-[#a8451a]">{label}</span> will be permanently deleted. This cannot be undone.
          </p>
        </div>

        <div className="relative mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            onClick={onClose}
            disabled={pending}
            className="flex-1 rounded-2xl border border-[#a8451a]/25 bg-white py-3 text-sm font-semibold text-[#2b1d12]/80 shadow-2xs transition-colors hover:border-[#a8451a]/40 hover:text-[#a8451a] disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-[#c04a1c] py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(190,18,60,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(190,18,60,0.7)] disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Trash2 className="h-4 w-4" />
            {pending ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
