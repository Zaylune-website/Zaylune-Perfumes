"use client";

import { useActionState } from "react";
import { UserCog, Check, AlertCircle } from "lucide-react";
import { updateAdminProfile } from "@/actions/admin/profile";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/50 transition-colors duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/35";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/70";

export default function ProfileForm({ profile }) {
  const [state, formAction, pending] = useActionState(updateAdminProfile, {});
  const initial = (profile?.full_name || "A").trim().charAt(0).toUpperCase();

  return (
    <form
      action={formAction}
      className="max-w-md space-y-5 rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:p-6 md:p-8"
    >
      <div className="flex items-center gap-4 rounded-2xl border border-[#a8451a]/15 bg-[#fffaf5] p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c04a1c] to-[#7a2812] text-lg font-bold text-white shadow-sm">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-display truncate text-base font-bold text-[#1c1109]">{profile?.full_name || "Admin"}</p>
          <p className="flex items-center gap-1 text-sm text-[#2b1d12]/70">
            <UserCog className="h-3.5 w-3.5" /> Administrator
          </p>
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-sm text-green-800">
          <Check className="h-4 w-4 shrink-0" /> Profile updated.
        </div>
      )}

      <div>
        <label className={labelClass}>Full Name</label>
        <input required name="full_name" defaultValue={profile?.full_name} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input disabled value={profile?.email || ""} className={`${inputClass} opacity-50`} />
      </div>
      <div>
        <label className={labelClass}>New Password (optional)</label>
        <input type="password" name="new_password" placeholder="Leave blank to keep current password" className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="btn-gold w-full py-3 disabled:opacity-60">
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
