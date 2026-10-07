"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Quote, AlertCircle } from "lucide-react";
import StarRating from "@/components/StarRating";
import ImageUploader from "@/components/admin/ImageUploader";
import { createTestimonial, updateTestimonial, toggleTestimonial, deleteTestimonial } from "@/actions/admin/testimonials";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/20 bg-white px-4 py-2.5 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/50 transition-colors duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/35";
const panelClass =
  "rounded-3xl border border-[#a8451a]/20 bg-white/90 shadow-sm backdrop-blur-xl";

const RATING_OPTIONS = [5, 4.5, 4, 3.5, 3];

function RatingPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RATING_OPTIONS.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 ${
            Number(value) === r
              ? "border-transparent bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#c04a1c] text-white shadow-sm"
              : "border-[#a8451a]/20 bg-white text-[#2b1d12]/75 hover:border-[#a8451a]/40 hover:text-[#a8451a]"
          }`}
        >
          {r}★
        </button>
      ))}
    </div>
  );
}

function TestimonialEditForm({ testimonial, onCancel, onSaved }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(testimonial.image_url);
  const [form, setForm] = useState({
    customer_name: testimonial.customer_name || "",
    location: testimonial.location || "",
    review_text: testimonial.review_text || "",
    rating: testimonial.rating || 5,
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateTestimonial(testimonial.id, { ...form, image_url: imageUrl });
      if (result.success) onSaved();
      else setError(result.error || "Failed to save changes. Please try again.");
    });
  };

  return (
    <form onSubmit={handleSave} className="w-full space-y-3 rounded-2xl border border-[#a8451a]/25 bg-[#fffaf5] p-4 sm:p-5">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <ImageUploader value={imageUrl} onChange={setImageUrl} folder="zaylune/testimonials" />
      <input placeholder="Customer Name" value={form.customer_name} onChange={update("customer_name")} className={inputClass} required />
      <input placeholder="Location (e.g. Delhi)" value={form.location} onChange={update("location")} className={inputClass} />
      <textarea placeholder="Review text" value={form.review_text} onChange={update("review_text")} rows={4} className={inputClass} required />
      <div>
        <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/70">Rating</label>
        <RatingPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button type="submit" disabled={pending} className="btn-gold px-7 py-2.5 text-sm disabled:opacity-60">
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

export default function TestimonialManager({ testimonials }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(null);
  const [form, setForm] = useState({ customer_name: "", location: "", review_text: "", rating: 5 });
  const [editingId, setEditingId] = useState(null);
  const [addError, setAddError] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    setAddError(null);
    startTransition(async () => {
      const result = await createTestimonial({ ...form, image_url: imageUrl });
      if (result.success) {
        setImageUrl(null);
        setForm({ customer_name: "", location: "", review_text: "", rating: 5 });
        router.refresh();
      } else {
        setAddError(result.error || "Failed to add testimonial. Please try again.");
      }
    });
  };

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleTestimonial(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteTestimonial(id);
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className={`${panelClass} order-2 min-w-0 p-6 md:p-8 lg:order-1`}>
        <h2 className="mb-4 font-display text-lg font-bold text-[#1c1109]">Existing Testimonials</h2>
        {testimonials.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#2b1d12]/70">No testimonials yet — the homepage will show default sample quotes.</p>
        ) : (
          <ul className="space-y-3">
            {testimonials.map((t) =>
              editingId === t.id ? (
                <li key={t.id}>
                  <TestimonialEditForm
                    testimonial={t}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => { setEditingId(null); router.refresh(); }}
                  />
                </li>
              ) : (
                <li
                  key={t.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#a8451a]/15 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#a8451a]/15 bg-[#fde3cf]/50">
                    {t.image_url ? (
                      <Image src={t.image_url} alt="" fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#2b1d12]/65">
                        <Quote className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <StarRating rating={t.rating} size={12} />
                    <p className="truncate text-sm text-[#1c1109]">{t.customer_name} {t.location && <span className="text-[#2b1d12]/70">· {t.location}</span>}</p>
                    <p className="line-clamp-2 text-sm text-[#2b1d12]/70">{t.review_text}</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                    <label className="flex items-center gap-2 text-sm text-[#2b1d12]/75">
                      <input type="checkbox" checked={t.is_active} disabled={pending} onChange={(e) => handleToggle(t.id, e.target.checked)} />
                      Active
                    </label>
                    <button
                      onClick={() => setEditingId(t.id)}
                      disabled={pending}
                      className="rounded-xl p-2 text-[#2b1d12]/70 transition-colors hover:bg-[#a8451a]/10 hover:text-[#a8451a]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
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

      <form onSubmit={handleAdd} className={`${panelClass} order-1 h-fit min-w-0 space-y-4 p-6 lg:order-2`}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a8451a]/10 text-[#a8451a]">
            <Quote className="h-4 w-4" />
          </div>
          <h2 className="font-display text-base font-bold text-[#1c1109]">Add Testimonial</h2>
        </div>
        {addError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" /> {addError}
          </div>
        )}
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="zaylune/testimonials" />
        <input placeholder="Customer Name" value={form.customer_name} onChange={update("customer_name")} className={inputClass} required />
        <input placeholder="Location (e.g. Delhi)" value={form.location} onChange={update("location")} className={inputClass} />
        <textarea placeholder="Review text" value={form.review_text} onChange={update("review_text")} rows={4} className={inputClass} required />
        <div>
          <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/70">Rating</label>
          <RatingPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
        </div>
        <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-60">
          {pending ? "Adding…" : "Add Testimonial"}
        </button>
      </form>
    </div>
  );
}
