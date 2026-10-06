"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ImagePlus, Check, AlertCircle, Sparkles, Pencil } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { createHeroSlide, updateHeroSlide, toggleHeroSlide, deleteHeroSlide } from "@/actions/admin/hero";
import { updateSiteSetting } from "@/actions/settings";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/50 transition-colors duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/35";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/70";
const panelClass =
  "rounded-3xl border border-[#a8451a]/20 bg-white/90 shadow-sm backdrop-blur-xl";

const HERO_ENABLED_KEY = "home_hero_enabled";

const HERO_SETTINGS_FIELDS = [
  { key: "home_hero_badge_text", label: "Badge Text", hint: "The small pill shown above the title (e.g. \"Zaylune\")." },
  { key: "home_hero_rating_value", label: "Star Rating", hint: "A number from 0–5, e.g. 4.9." },
  { key: "home_hero_reviews_text", label: "Reviews Text", hint: "Shown next to the star rating, e.g. \"500+ Reviews\"." },
  { key: "home_hero_shipped_text", label: "Shipped Stat", hint: "e.g. \"10k+ Bottles Shipped Pan-India\"." },
];

function HeroSettingsPanel({ settings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(null);
  const [values, setValues] = useState(() => {
    const initial = { [HERO_ENABLED_KEY]: settings[HERO_ENABLED_KEY]?.value ?? "true" };
    HERO_SETTINGS_FIELDS.forEach((f) => {
      initial[f.key] = settings[f.key]?.value ?? "";
    });
    return initial;
  });
  const heroEnabled = values[HERO_ENABLED_KEY] !== "false";

  const handleChange = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaved(null);
    startTransition(async () => {
      const keys = [HERO_ENABLED_KEY, ...HERO_SETTINGS_FIELDS.map((f) => f.key)];
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      if (failed) {
        setSaved({ success: false, error: failed.error });
      } else {
        setSaved({ success: true });
        router.refresh();
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  return (
    <div className={`${panelClass} p-5 sm:p-6 md:p-8`}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[#1c1109]">Hero Section Settings</h2>
            <p className="text-sm text-[#2b1d12]/70">Applies across every slide — badge, rating and stats shown over the banner.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 rounded-full border border-[#a8451a]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#2b1d12]/75">
            <input
              type="checkbox"
              checked={heroEnabled}
              onChange={(e) => handleChange(HERO_ENABLED_KEY, e.target.checked ? "true" : "false")}
            />
            Show on Homepage
          </label>
          <button onClick={handleSave} disabled={pending} className="btn-gold px-6 py-2.5 text-xs font-semibold disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {HERO_SETTINGS_FIELDS.map((field) => (
          <div key={field.key}>
            <label className={labelClass}>{field.label}</label>
            <input
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={inputClass}
            />
            {field.hint && <p className="mt-1.5 text-sm text-[#2b1d12]/67">{field.hint}</p>}
          </div>
        ))}
      </div>

      {saved && (
        <div className={`mt-4 flex items-center gap-2 text-sm ${saved.success ? "text-emerald-700" : "text-red-600"}`}>
          {saved.success ? (
            <>
              <Check className="h-3.5 w-3.5" /> Saved successfully
            </>
          ) : (
            <>
              <AlertCircle className="h-3.5 w-3.5" /> {saved.error}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SlideEditForm({ slide, onCancel, onSaved }) {
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(slide.image_url);
  const [mobileImageUrl, setMobileImageUrl] = useState(slide.mobile_image_url || null);
  const [form, setForm] = useState({
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    button_text: slide.button_text || "",
    button_link: slide.button_link || "",
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateHeroSlide(slide.id, { ...form, image_url: imageUrl, mobile_image_url: mobileImageUrl });
      if (result.success) onSaved();
    });
  };

  return (
    <form onSubmit={handleSave} className="w-full space-y-3 rounded-2xl border border-[#a8451a]/25 bg-[#fffaf5] p-4 sm:p-5">
      <div>
        <p className={labelClass}>Desktop Image</p>
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="zaylune/hero" />
      </div>
      <div>
        <p className={labelClass}>Mobile Image — 4:5 ratio <span className="normal-case tracking-normal text-[#2b1d12]/67">(optional, shown only on phones)</span></p>
        <ImageUploader value={mobileImageUrl} onChange={setMobileImageUrl} folder="zaylune/hero" />
      </div>
      <div>
        <textarea
          placeholder={"Title\ne.g. Timeless Scents,\nPremium Quality,\nLuxury Within Reach"}
          value={form.title}
          onChange={update("title")}
          rows={3}
          className={`${inputClass} resize-none`}
        />
        <p className="mt-1.5 text-sm text-[#2b1d12]/67">Use Enter for line breaks. The last line is highlighted in gold.</p>
      </div>
      <input placeholder="Subtitle" value={form.subtitle} onChange={update("subtitle")} className={inputClass} />
      <input placeholder="Button Text" value={form.button_text} onChange={update("button_text")} className={inputClass} />
      <input placeholder="Button Link (e.g. /shop)" value={form.button_link} onChange={update("button_link")} className={inputClass} />
      <div className="flex items-center justify-end gap-2 pt-1">
        <button type="submit" disabled={pending || !imageUrl} className="btn-gold px-7 py-2.5 text-sm disabled:opacity-60">
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#2b1d12]/75 transition-colors hover:border-[#a8451a]/40 hover:text-[#a8451a]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function HeroSlideManager({ slides, settings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(null);
  const [mobileImageUrl, setMobileImageUrl] = useState(null);
  const [form, setForm] = useState({ title: "", subtitle: "", button_text: "", button_link: "" });
  const [editingId, setEditingId] = useState(null);
  const [addError, setAddError] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    setAddError(null);
    startTransition(async () => {
      const result = await createHeroSlide({ ...form, image_url: imageUrl, mobile_image_url: mobileImageUrl });
      if (result.success) {
        setImageUrl(null);
        setMobileImageUrl(null);
        setForm({ title: "", subtitle: "", button_text: "", button_link: "" });
        router.refresh();
      } else {
        setAddError(result.error || "Something went wrong. Please try again.");
      }
    });
  };

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleHeroSlide(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteHeroSlide(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <HeroSettingsPanel settings={settings} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className={`${panelClass} min-w-0 p-5 sm:p-6 md:p-8`}>
        <h2 className="mb-4 font-display text-lg font-bold text-[#1c1109]">Existing Slides</h2>
        {slides.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#2b1d12]/70">No slides yet — the homepage will use a default hero.</p>
        ) : (
          <ul className="space-y-3">
            {slides.map((s) =>
              editingId === s.id ? (
                <li key={s.id} className="rounded-2xl border border-[#a8451a]/15 bg-white p-4">
                  <SlideEditForm slide={s} onCancel={() => setEditingId(null)} onSaved={() => { setEditingId(null); router.refresh(); }} />
                </li>
              ) : (
                <li
                  key={s.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#a8451a]/15 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl border border-[#a8451a]/10 bg-[#fde3cf]/40 sm:h-16 sm:w-24">
                    <Image src={s.image_url} alt="" fill sizes="(max-width: 640px) 100vw, 96px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[#1c1109]">
                      {s.title ? s.title.split("\n")[0] : <em className="text-[#2b1d12]/67">No title</em>}
                    </p>
                    <p className="truncate text-sm text-[#2b1d12]/70">{s.subtitle}</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#a8451a]/10 pt-3 sm:justify-start sm:border-t-0 sm:pt-0">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#2b1d12]/75">
                      <input type="checkbox" checked={s.is_active} disabled={pending} onChange={(e) => handleToggle(s.id, e.target.checked)} />
                      Active
                    </label>
                    <button
                      onClick={() => setEditingId(s.id)}
                      disabled={pending}
                      className="rounded-xl p-2 text-[#2b1d12]/70 transition-colors hover:bg-[#a8451a]/10 hover:text-[#a8451a]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={pending}
                      className="rounded-xl p-2 text-[#2b1d12]/70 transition-colors hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <form onSubmit={handleAdd} className={`${panelClass} h-fit min-w-0 space-y-4 p-5 sm:p-6`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/60 text-[#c04a1c]">
            <ImagePlus className="h-4 w-4" />
          </div>
          <h2 className="font-display text-base font-bold text-[#1c1109]">Add Slide</h2>
        </div>
        <div>
          <p className={labelClass}>Desktop Image</p>
          <ImageUploader value={imageUrl} onChange={setImageUrl} folder="zaylune/hero" />
        </div>
        <div>
          <p className={labelClass}>Mobile Image — 4:5 ratio <span className="normal-case tracking-normal text-[#2b1d12]/67">(optional, shown only on phones)</span></p>
          <ImageUploader value={mobileImageUrl} onChange={setMobileImageUrl} folder="zaylune/hero" />
        </div>
        <div>
          <textarea
            placeholder={"Title\ne.g. Timeless Scents,\nPremium Quality,\nLuxury Within Reach"}
            value={form.title}
            onChange={update("title")}
            rows={3}
            className={`${inputClass} resize-none`}
          />
          <p className="mt-1.5 text-sm text-[#2b1d12]/67">Use Enter for line breaks. The last line is highlighted in gold.</p>
        </div>
        <input placeholder="Subtitle" value={form.subtitle} onChange={update("subtitle")} className={inputClass} />
        <input placeholder="Button Text" value={form.button_text} onChange={update("button_text")} className={inputClass} />
        <input placeholder="Button Link (e.g. /shop)" value={form.button_link} onChange={update("button_link")} className={inputClass} />
        <button type="submit" disabled={pending || !imageUrl} className="btn-gold w-full disabled:opacity-60">
          {pending ? "Adding…" : "Add Slide"}
        </button>
        {!imageUrl && <p className="text-center text-sm text-[#2b1d12]/67">Upload an image to enable this button.</p>}
        {addError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {addError}
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
