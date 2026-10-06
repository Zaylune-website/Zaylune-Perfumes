"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Megaphone } from "lucide-react";
import { createAnnouncement, toggleAnnouncement, deleteAnnouncement } from "@/actions/admin/announcements";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function AnnouncementForm({ announcements }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createAnnouncement(message);
      if (result.success) {
        setMessage("");
        router.refresh();
      }
    });
  };

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleAnnouncement(id, active);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteAnnouncement(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        pending={pending}
        label={deleteTarget?.label || "this announcement"}
      />
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:p-6"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
          <Megaphone className="h-4 w-4" />
        </div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Free shipping on orders above ₹1499"
          className="min-w-0 flex-1 rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/50 transition-colors duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20"
        />
        <button type="submit" disabled={pending || !message} className="btn-gold w-full shrink-0 disabled:opacity-60 sm:w-auto">
          Add Announcement
        </button>
      </form>

      {announcements.length === 0 ? (
        <p className="rounded-3xl border border-[#a8451a]/20 bg-white/90 py-12 text-center text-sm text-[#2b1d12]/70 shadow-sm backdrop-blur-xl">
          No announcements yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#a8451a]/15 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
            >
              <p className="flex-1 break-words text-[15px] font-medium text-[#1c1109]">{a.message}</p>
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#a8451a]/10 pt-3 sm:border-t-0 sm:pt-0 sm:justify-start">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2b1d12]/75">
                  <input type="checkbox" checked={a.is_active} disabled={pending} onChange={(e) => handleToggle(a.id, e.target.checked)} />
                  Active
                </label>
                <button
                  onClick={() => setDeleteTarget({ id: a.id, label: `"${a.message.slice(0, 40)}${a.message.length > 40 ? "…" : ""}"` })}
                  disabled={pending}
                  className="rounded-xl p-2 text-[#2b1d12]/70 transition-colors hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
