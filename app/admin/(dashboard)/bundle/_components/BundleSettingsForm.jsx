"use client";

import { useActionState, useState } from "react";
import { Sparkles, Check, AlertCircle } from "lucide-react";
import { updateBundleSettings } from "@/actions/admin/bundle";
import ImageUploader from "@/components/admin/ImageUploader";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/10 bg-white/40 px-4 py-2.5 text-base text-[#1c1109] shadow-2xs transition-all duration-300 focus:border-[#a8451a]/40 focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/40";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/72";

export default function BundleSettingsForm({ settings }) {
  const [state, formAction, pending] = useActionState(updateBundleSettings, {});
  const [enabled, setEnabled] = useState(settings.enabled);
  const [bannerImageUrl, setBannerImageUrl] = useState(settings.banner_image_url || null);

  return (
    <form
      action={formAction}
      className="h-fit min-w-0 space-y-5 rounded-3xl border border-[#a8451a]/10 bg-white/95 p-5 sm:p-6 backdrop-blur-xl shadow-sm md:p-8"
    >
      <input type="hidden" name="banner_image_url" value={bannerImageUrl || ""} />

      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a8451a]/10 text-[#a8451a]">
          <Sparkles className="h-4 w-4" />
        </div>
        <h2 className="font-display text-lg text-[#1c1109]">Bundle Settings</h2>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-sm text-green-800">
          <Check className="h-4 w-4 shrink-0" /> Bundle settings saved.
        </div>
      )}

      <label className="flex items-center gap-3 rounded-xl border border-[#a8451a]/10 bg-white/30 px-4 py-3 cursor-pointer">
        <input
          type="checkbox"
          name="enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 accent-[#a8451a]"
        />
        <span className="text-base text-[#1c1109]">Show the "Gift Set" page and nav link</span>
      </label>

      <div>
        <label className={labelClass}>Bottles to pick</label>
        <input
          type="number"
          name="bottle_count"
          min={2}
          defaultValue={settings.bottle_count}
          className={inputClass}
        />
        <p className="mt-1.5 text-sm text-[#2b1d12]/70">How many products a customer must select before they can add the bundle to their bag.</p>
      </div>

      <div>
        <label className={labelClass}>Fixed Bundle Price (₹)</label>
        <input
          type="number"
          name="fixed_price"
          min={1}
          defaultValue={settings.fixed_price ?? ""}
          placeholder="e.g. 799"
          className={inputClass}
        />
        <p className="mt-1.5 text-sm text-[#2b1d12]/70">
          Each product still shows its own price, but once a customer picks the full set, the total drops to this flat price. Leave blank to just charge the sum of individual prices.
        </p>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input type="text" name="title" defaultValue={settings.title} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Subtitle</label>
        <input type="text" name="subtitle" defaultValue={settings.subtitle} className={inputClass} />
      </div>

      <div className="space-y-4 rounded-2xl border border-[#a8451a]/10 bg-white/30 p-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#a8451a]">Shop menu card</p>
          <p className="mt-1 text-sm text-[#2b1d12]/70">Shown in the Shop mega-menu only while the Gift Set page is enabled.</p>
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <input type="text" name="showcase_badge" defaultValue={settings.showcase_badge} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Heading</label>
          <input type="text" name="showcase_heading" defaultValue={settings.showcase_heading} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="showcase_description"
            rows={3}
            defaultValue={settings.showcase_description}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Banner image (optional)</label>
        <ImageUploader
          value={bannerImageUrl}
          onChange={setBannerImageUrl}
          folder="zaylune/bundle"
          previewClassName="aspect-video w-full max-w-md"
        />
      </div>

      <button type="submit" disabled={pending} className="btn-gold w-fit px-8 disabled:opacity-60">
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
