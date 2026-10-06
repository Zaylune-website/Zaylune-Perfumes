"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createCategory, updateCategory } from "@/actions/admin/categories";
import ImageUploader from "@/components/admin/ImageUploader";

const inputClass =
  "w-full rounded-2xl border border-[#a8451a]/20 bg-white px-5 py-3.5 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/40 shadow-2xs transition-all duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 hover:border-[#a8451a]/40";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-widest text-[#a8451a]";

function slugPreview(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryForm({ category }) {
  const isEditing = !!category;
  const action = isEditing ? updateCategory : createCategory;
  const [state, formAction, pending] = useActionState(action, {});
  const [imageUrl, setImageUrl] = useState(category?.image_url || null);
  const [name, setName] = useState(category?.name || "");
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  return (
    <form
      action={formAction}
      className="relative max-w-3xl space-y-6 overflow-hidden rounded-3xl border border-[#a8451a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-xl sm:p-6 md:p-8"
    >
      {isEditing && <input type="hidden" name="id" value={category.id} />}
      <input type="hidden" name="image_url" value={imageUrl || ""} />
      <input type="hidden" name="is_active" value={isActive ? "on" : "off"} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700 animate-fadeUp">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
        <div>
          <label className={labelClass}>Image</label>
          <ImageUploader value={imageUrl} onChange={setImageUrl} folder="zaylune/categories" />
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Name</label>
            <input
              required
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Attars"
              className={inputClass}
            />
            {name && (
              <p className="mt-2 text-sm text-[#2b1d12]/70">
                URL Preview: <span className="break-all rounded-md bg-[#fde3cf]/60 px-1.5 py-0.5 font-mono text-[#a8451a]">/shop?category={slugPreview(name)}</span>
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category?.description}
              placeholder="A short line about this collection…"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Sort Order</label>
              <input type="number" name="sort_order" defaultValue={category?.sort_order || 0} className={inputClass} />
              <p className="mt-2 text-sm text-[#2b1d12]/70">Lower numbers appear first on the store.</p>
            </div>

            <div>
              <label className={labelClass}>Visibility</label>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
                    : "border-[#a8451a]/20 bg-white text-[#2b1d12]/70"
                }`}
              >
                {isActive ? "Visible on store" : "Hidden from store"}
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-emerald-500" : "bg-[#a8451a]/25"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#a8451a]/15 pt-6 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-gold w-full px-6 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {pending ? "Saving…" : isEditing ? "Update Category" : "Create Category"}
        </button>
        <Link
          href="/admin/categories"
          className="py-2 text-center text-xs font-semibold uppercase tracking-widest text-[#2b1d12]/70 transition-colors duration-300 hover:text-[#a8451a]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
