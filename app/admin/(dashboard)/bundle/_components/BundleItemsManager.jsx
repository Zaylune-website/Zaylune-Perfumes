"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Pencil, X, AlertCircle, ListChecks } from "lucide-react";
import { addBundleItem, updateBundleItem, removeBundleItem } from "@/actions/admin/bundle";
import ImageUploader from "@/components/admin/ImageUploader";

const inputClass =
  "w-full rounded-xl border border-[#a8451a]/10 bg-white px-4 py-2.5 text-base text-[#1c1109] shadow-2xs transition-all duration-300 focus:border-[#a8451a]/40 focus:outline-none focus:ring-2 focus:ring-[#a8451a]/20 hover:border-[#a8451a]/40";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-[#2b1d12]/72";

function ProductFields({ defaults, images, setImages }) {
  return (
    <div className="space-y-3">
      <div>
        <label className={labelClass}>Photos (click the star to set the cover image)</label>
        <ImageUploader value={images} onChange={setImages} multiple showCoverPicker folder="zaylune/bundle-items" />
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-2">
        <div key="name" className="col-span-full min-w-0">
          <label className={labelClass}>Product Name</label>
          <input type="text" name="name" placeholder="e.g. Oudh Mini" defaultValue={defaults?.name} className={inputClass} required />
        </div>
        <div key="description" className="col-span-full min-w-0">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            placeholder="Short description shown to customers"
            defaultValue={defaults?.description}
            rows={2}
            className={inputClass}
          />
        </div>
        <div key="variant_name" className="min-w-0">
          <label className={labelClass}>Size / Label</label>
          <input type="text" name="variant_name" placeholder="e.g. 6ml" defaultValue={defaults?.variantName} className={inputClass} />
        </div>
        <div key="stock_quantity" className="min-w-0">
          <label className={labelClass}>Stock</label>
          <input type="number" name="stock_quantity" min={0} defaultValue={defaults?.stock ?? 0} className={inputClass} required />
        </div>
        <div key="price" className="min-w-0">
          <label className={labelClass}>Price (₹)</label>
          <input type="number" name="price" min={1} defaultValue={defaults?.price} className={inputClass} required />
        </div>
        <div key="original_price" className="min-w-0">
          <label className={`${labelClass} sm:whitespace-nowrap`}>Cut Price (₹)</label>
          <input
            type="number"
            name="original_price"
            min={1}
            defaultValue={defaults?.originalPrice ?? ""}
            placeholder="e.g. 499"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

function AddItemForm() {
  const [state, formAction, pending] = useActionState(addBundleItem, {});
  const [images, setImages] = useState([]);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-[#a8451a]/10 bg-white/30 p-4">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {state.error}
        </div>
      )}

      <p className="text-sm text-[#2b1d12]/70">
        Add a brand-new product just for the bundle — it won't appear on the regular shop or in Products.
      </p>

      <ProductFields images={images} setImages={setImages} />

      <button type="submit" disabled={pending} className="btn-gold flex w-fit items-center justify-center gap-1.5 px-6 py-2.5 text-base disabled:opacity-60">
        <Plus className="h-4 w-4" /> {pending ? "Adding…" : "Add to Bundle"}
      </button>
    </form>
  );
}

function EditItemModal({ item, onDone }) {
  const [state, formAction, pending] = useActionState(updateBundleItem, {});
  const [images, setImages] = useState(item.productImages || []);

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onDone();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onDone]);

  // Portaled straight to <body> — this panel's own ancestors (the card it
  // lives in) use backdrop-blur, which makes `fixed` descendants scope to
  // that box instead of the viewport. Rendering outside that DOM subtree
  // is what actually gets it centered over the whole screen.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-white sm:flex sm:items-start sm:justify-center sm:bg-transparent sm:p-6 sm:pt-12">
      <div className="fixed inset-0 hidden bg-black/75 backdrop-blur-md sm:block" onClick={onDone} />

      <form
        action={formAction}
        className="relative flex min-h-screen w-full max-w-none animate-fadeUp flex-col sm:overflow-hidden border-[#a8451a]/15 sm:max-w-lg bg-white shadow-[0_30px_80px_rgba(0,0,0,0.15),0_0_50px_rgba(212,163,89,0.05)] sm:mb-8 sm:min-h-0 sm:max-h-[85vh] sm:rounded-3xl sm:border"
      >
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[#a8451a]/10 bg-white/95 px-4 py-4 backdrop-blur-md sm:px-8">
          <h3 className="font-display text-lg sm:text-xl text-[#1c1109]">Edit Bundle Product</h3>
          <button
            type="button"
            onClick={onDone}
            aria-label="Close"
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#a8451a]/15 bg-white text-[#2b1d12]/78 transition-all duration-300 hover:border-[#a8451a]/30 hover:text-[#a8451a]"
          >
            <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-8 sm:py-5">
          <input type="hidden" name="product_id" value={item.productId} />
          <input type="hidden" name="variant_id" value={item.variantId} />
          <input type="hidden" name="images" value={JSON.stringify(images)} />

          {state.error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {state.error}
            </div>
          )}

          <ProductFields
            defaults={{
              name: item.productName,
              description: item.productDescription,
              variantName: item.variantName,
              price: item.price,
              originalPrice: item.originalPrice,
              stock: item.stock,
            }}
            images={images}
            setImages={setImages}
          />
        </div>

        <div className="sticky bottom-0 flex shrink-0 items-center gap-2 border-t border-[#a8451a]/10 bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-8">
          <button type="submit" disabled={pending} className="btn-gold flex-1 px-8 py-2.5 text-base disabled:opacity-60 sm:flex-none sm:w-fit">
            {pending ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="flex w-fit items-center justify-center gap-1.5 rounded-xl border border-[#a8451a]/15 px-4 py-2.5 text-base text-[#2b1d12]/75 hover:text-[#1c1109] hover:border-[#a8451a]/40"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}

function ItemRow({ item }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const handleDelete = () => {
    if (!window.confirm(`Remove "${item.productName}" from the bundle? This deletes it permanently.`)) return;
    setError("");
    startTransition(async () => {
      const result = await removeBundleItem(item.id);
      if (result?.success === false) {
        setError(result.error || "Failed to remove — please try again.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="rounded-xl border border-[#a8451a]/10 bg-white/20 px-3 py-2.5">
      {editing && (
        <EditItemModal
          item={item}
          onDone={() => {
            setEditing(false);
            router.refresh();
          }}
        />
      )}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-11 sm:w-11 sm:rounded-lg border border-[#a8451a]/10 bg-[#fde3cf]/40">
          {item.productImage && <Image src={item.productImage} alt="" fill sizes="44px" className="object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-[#1c1109] sm:text-base sm:font-medium">{item.productName}</p>
          <p className="text-xs leading-snug text-[#2b1d12]/72 sm:truncate sm:text-sm">
            {item.variantName} {item.price != null && `· ₹${item.price}`}
            {item.originalPrice != null && <span className="line-through text-[#2b1d12]/67"> ₹{item.originalPrice}</span>}
            {item.stock != null && ` · Stock ${item.stock}`}
          </p>
          {item.productDescription && <p className="line-clamp-2 text-xs text-[#2b1d12]/70 sm:truncate sm:text-sm">{item.productDescription}</p>}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="shrink-0 rounded-lg p-1.5 sm:p-2 border border-transparent text-[#2b1d12]/70 transition-all duration-300 hover:text-[#a8451a] hover:bg-[#a8451a]/10 hover:border-[#a8451a]/10"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="shrink-0 rounded-lg p-1.5 sm:p-2 border border-transparent text-[#2b1d12]/70 transition-all duration-300 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/20 disabled:opacity-50"
          title="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}

export default function BundleItemsManager({ items }) {
  return (
    <div className="min-w-0 space-y-5 rounded-3xl border border-[#a8451a]/10 bg-white/95 p-5 sm:p-6 backdrop-blur-xl shadow-sm md:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a8451a]/10 text-[#a8451a]">
          <ListChecks className="h-4 w-4" />
        </div>
        <h2 className="font-display text-lg text-[#1c1109]">Bundle Products</h2>
      </div>

      <AddItemForm />

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="py-8 text-center text-base text-[#2b1d12]/70">No products added yet — add one above.</p>
        ) : (
          items.map((item) => <ItemRow key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
