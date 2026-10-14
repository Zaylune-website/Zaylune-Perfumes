"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ImageIcon, Check, AlertCircle } from "lucide-react";
import { updateSiteSetting } from "@/actions/settings";
import ImageUploader from "@/components/admin/ImageUploader";

const panelClass =
  "rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:p-6 md:p-8";

export default function LogoSettingsSection({ initialLogoUrl }) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl || "/navbar-logo.png");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(null);

  const handleSave = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await updateSiteSetting("site_logo", logoUrl);
      if (result.success) {
        setStatus({ success: true });
        setTimeout(() => setStatus(null), 2000);
      } else {
        setStatus({ success: false, error: result.error });
      }
    });
  };

  return (
    <div className={panelClass}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[#1c1109]">Site Logo</h2>
            <p className="text-xs text-[#2b1d12]/60">Appears in header, footer, and loading screen across the entire site.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={pending}
          className="btn-gold w-full px-6 py-2.5 text-xs font-semibold disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Saving…" : "Save Logo"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-start">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#a8451a]">Upload New Logo</p>
          <ImageUploader value={logoUrl} onChange={setLogoUrl} folder="zaylune/branding" />
          <div className="mt-3 space-y-1.5 rounded-2xl border border-amber-400/30 bg-amber-50 px-4 py-3">
            <p className="text-xs font-bold text-amber-800">Tips for best result:</p>
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• <span className="font-semibold">Transparent background (PNG)</span> — no white or colored box behind the logo</li>
              <li>• <span className="font-semibold">Recommended ratio: 3:2</span> — e.g. 600×400 px or 900×600 px</li>
              <li>• Min width 400px for sharp display on all screens</li>
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#a8451a]">Preview</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#a8451a]/15 bg-[#fde3cf]/30 px-4 py-3">
              <div className="relative h-10 w-32 shrink-0">
                <Image src={logoUrl} alt="Logo preview" fill className="object-contain object-left" />
              </div>
              <span className="text-xs text-[#2b1d12]/50">Navbar size</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#a8451a]/15 bg-[#fde3cf]/30 px-4 py-3">
              <div className="relative h-16 w-40 shrink-0">
                <Image src={logoUrl} alt="Logo preview" fill className="object-contain object-left" />
              </div>
              <span className="text-xs text-[#2b1d12]/50">Footer size</span>
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className={`mt-4 flex items-center gap-2 text-sm ${status.success ? "text-emerald-700" : "text-red-600"}`}>
          {status.success ? (
            <><Check className="h-3.5 w-3.5" /> Logo saved — changes are live on the site.</>
          ) : (
            <><AlertCircle className="h-3.5 w-3.5" /> {status.error}</>
          )}
        </div>
      )}
    </div>
  );
}
