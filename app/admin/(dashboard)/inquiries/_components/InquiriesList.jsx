"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Eye, List, Mail, Phone, Sparkles, Table, Trash2, X } from "lucide-react";
import { resolveInquiry, deleteInquiry } from "@/actions/admin/inquiries";

const TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "resolved", label: "Resolved" },
];

export default function InquiriesList({ inquiries }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("all");
  const [viewingId, setViewingId] = useState(null);
  const [view, setView] = useState("table");
  const viewing = inquiries.find((i) => i.id === viewingId) || null;

  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setView("list");
  }, []);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (e) => e.key === "Escape" && setViewingId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  const toggle = (id, current) => {
    startTransition(async () => {
      await resolveInquiry(id, !current);
      router.refresh();
    });
  };

  const remove = (id, name) => {
    if (!window.confirm(`"${name}" ka inquiry permanently delete karna hai?`)) return;
    setViewingId(null);
    startTransition(async () => {
      await deleteInquiry(id);
      router.refresh();
    });
  };

  const filtered = inquiries.filter((inq) => {
    if (tab === "new") return !inq.is_resolved;
    if (tab === "resolved") return inq.is_resolved;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-300 ${
                tab === t.key
                  ? "border-[#a8451a]/30 bg-[#a8451a]/10 text-[#a8451a]"
                  : "border-[#a8451a]/10 text-[#2b1d12]/70 hover:text-[#1c1109]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-full border border-[#a8451a]/25 bg-white p-1 shadow-2xs">
          {[
            { key: "table", label: "Table", Icon: Table },
            { key: "list", label: "List", Icon: List },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                view === key
                  ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#c04a1c] text-white shadow-sm"
                  : "text-[#a8451a] hover:bg-[#fde3cf]/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "table" && (
        <div className="overflow-x-auto thin-x-scroll rounded-3xl border border-[#a8451a]/15 bg-white/90 p-4 shadow-sm backdrop-blur-xl sm:p-6">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#2b1d12]/70">No inquiries here.</p>
          ) : (
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#a8451a]/15 text-xs font-bold uppercase tracking-widest text-[#a8451a]">
                  <th className="pb-4 pl-2 font-bold">Name</th>
                  <th className="pb-4 font-bold">Contact</th>
                  <th className="pb-4 font-bold">Message</th>
                  <th className="pb-4 font-bold">Date</th>
                  <th className="pb-4 pr-2 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#a8451a]/10">
                {filtered.map((inq) => (
                  <tr key={inq.id} className="transition-colors duration-300 hover:bg-[#fde3cf]/30">
                    <td className="py-4 pl-2 pr-4 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base font-bold text-[#1c1109]">{inq.name}</span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            inq.is_resolved
                              ? "border-green-400/20 bg-green-400/15 text-green-800"
                              : "border-[#a8451a]/20 bg-[#a8451a]/10 text-[#a8451a]"
                          }`}
                        >
                          {inq.is_resolved ? "Resolved" : "New"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 align-top text-sm text-[#2b1d12]/75">
                      {inq.email && <p className="break-all">{inq.email}</p>}
                      {inq.phone && <p className="text-[#2b1d12]/65">{inq.phone}</p>}
                    </td>
                    <td className="max-w-xs py-4 pr-4 align-top text-sm text-[#2b1d12]/80">
                      <p className="line-clamp-2 whitespace-pre-line">{inq.message}</p>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 align-top text-sm text-[#2b1d12]/70">
                      {new Date(inq.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
                    </td>
                    <td className="py-4 pr-2 align-top">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingId(inq.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#a8451a] transition-colors duration-300 hover:bg-[#fff5ee]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => toggle(inq.id, inq.is_resolved)}
                          disabled={pending}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-300 ${
                            inq.is_resolved
                              ? "border-[#a8451a]/10 text-[#2b1d12]/72 hover:text-[#a8451a]"
                              : "border-green-400/20 bg-green-400/10 text-green-800 hover:bg-green-400/20"
                          }`}
                        >
                          Mark {inq.is_resolved ? "Unresolved" : "Resolved"}
                        </button>
                        <button
                          onClick={() => remove(inq.id, inq.name)}
                          disabled={pending}
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors duration-300 hover:bg-rose-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {view === "list" && (filtered.length === 0 ? (
        <p className="rounded-3xl border border-[#a8451a]/10 bg-white/90 py-12 text-center text-sm text-[#2b1d12]/70 backdrop-blur-md">
          No inquiries here.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((inq) => (
            <li
              key={inq.id}
              className="rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-bold text-[#1c1109]">{inq.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        inq.is_resolved
                          ? "bg-green-400/15 text-green-800 border-green-400/20"
                          : "bg-[#a8451a]/10 text-[#a8451a] border-[#a8451a]/20"
                      }`}
                    >
                      {inq.is_resolved ? "Resolved" : "New"}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-[#2b1d12]/70">
                    {inq.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {inq.email}
                      </span>
                    )}
                    {inq.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {inq.phone}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-[#2b1d12]/78">{inq.message}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#a8451a]/10 pt-4">
                <p className="text-xs font-medium text-[#2b1d12]/67 sm:text-sm">{new Date(inq.created_at).toLocaleString("en-IN")}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setViewingId(inq.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-white px-4 py-2 text-xs font-semibold text-[#a8451a] transition-colors duration-300 hover:bg-[#fff5ee]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => toggle(inq.id, inq.is_resolved)}
                    disabled={pending}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-300 ${
                      inq.is_resolved
                        ? "border-[#a8451a]/10 text-[#2b1d12]/72 hover:text-[#a8451a]"
                        : "border-green-400/20 bg-green-400/10 text-green-800 hover:bg-green-400/20"
                    }`}
                  >
                    Mark {inq.is_resolved ? "Unresolved" : "Resolved"}
                  </button>
                  <button
                    onClick={() => remove(inq.id, inq.name)}
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-colors duration-300 hover:bg-rose-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ))}

      {viewing &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1109]/50 p-4 backdrop-blur-md inq-fade"
            onClick={() => setViewingId(null)}
          >
            <style>{`
              @keyframes inqFade { from { opacity: 0; } to { opacity: 1; } }
              @keyframes inqPop { from { opacity: 0; transform: translateY(14px) scale(0.96); } to { opacity: 1; transform: none; } }
              .inq-fade { animation: inqFade 0.25s ease-out both; }
              .inq-pop { animation: inqPop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
              @media (prefers-reduced-motion: reduce) { .inq-fade, .inq-pop { animation: none; } }
            `}</style>
            <div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-[#a8451a]/20 bg-gradient-to-b from-white via-white to-[#fffaf5] shadow-[0_30px_80px_-30px_rgba(122,40,18,0.55)] inq-pop"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#c04a1c]/10 blur-3xl" />
              <button
                onClick={() => setViewingId(null)}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#a8451a]/25 bg-white text-[#a8451a] shadow-2xs transition-all duration-300 hover:rotate-90 hover:bg-[#fff5ee]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 [scrollbar-width:thin] [scrollbar-color:rgba(168,69,26,0.35)_transparent]">

              <span className="relative mb-3 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                Enquiry
              </span>

              <div className="relative flex flex-wrap items-center gap-2 pr-12">
                <h2 className="font-display text-2xl font-extrabold text-[#1c1109]">{viewing.name}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    viewing.is_resolved
                      ? "bg-green-400/15 text-green-800 border-green-400/20"
                      : "bg-[#a8451a]/10 text-[#a8451a] border-[#a8451a]/20"
                  }`}
                >
                  {viewing.is_resolved ? "Resolved" : "New"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#2b1d12]/70">
                {viewing.email && (
                  <span className="flex items-center gap-1 break-all">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {viewing.email}
                  </span>
                )}
                {viewing.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> {viewing.phone}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#2b1d12]/60">{new Date(viewing.created_at).toLocaleString("en-IN")}</p>

              <div className="relative mt-5 rounded-2xl border border-[#a8451a]/15 border-l-4 border-l-[#c04a1c] bg-[#fffaf5] p-5 text-[15px] leading-relaxed text-[#2b1d12]/85 whitespace-pre-line break-words">
                {viewing.message}
              </div>

              <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-[#a8451a]/10 pt-5">
                <button
                  onClick={() => toggle(viewing.id, viewing.is_resolved)}
                  disabled={pending}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-300 ${
                    viewing.is_resolved
                      ? "border-[#a8451a]/10 text-[#2b1d12]/72 hover:text-[#a8451a]"
                      : "border-green-400/20 bg-green-400/10 text-green-800 hover:bg-green-400/20"
                  }`}
                >
                  Mark {viewing.is_resolved ? "Unresolved" : "Resolved"}
                </button>
                <button
                  onClick={() => remove(viewing.id, viewing.name)}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-colors duration-300 hover:bg-rose-100 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
