"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/admin/products";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function ProductRow({ product }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProduct(product.id);
      setModalOpen(false);
      router.refresh();
    });
  };

  const stockBadge =
    product.totalStock === 0
      ? "border-rose-500/30 bg-rose-50 text-rose-700"
      : product.totalStock <= 5
      ? "border-amber-500/30 bg-amber-50 text-amber-800"
      : "border-[#a8451a]/25 bg-[#fde3cf]/50 text-[#a8451a]";

  return (
    <>
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        pending={pending}
        label={product.name}
      />
      <tr className="group/row transition-colors duration-300 hover:bg-[#fde3cf]/30">
        <td className="py-4 pr-4 pl-2">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/40 shadow-2xs transition-all duration-300 group-hover/row:border-[#a8451a]/40 group-hover/row:shadow-md">
              {product.featured_image_url && (
                <Image
                  src={product.featured_image_url}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover transition-transform duration-500 group-hover/row:scale-[1.08]"
                />
              )}
            </div>
            <span className="text-sm font-bold text-[#1c1109] transition-colors duration-300 group-hover/row:text-[#a8451a]">
              {product.name}
            </span>
          </div>
        </td>
        <td className="py-4 pr-4 text-sm font-medium text-[#2b1d12]/80">{product.categoryName || "—"}</td>
        <td className="py-4 pr-4 text-sm font-bold text-[#1c1109]">
          {product.minPrice != null ? `₹${product.minPrice.toLocaleString("en-IN")}` : "—"}
        </td>
        <td className="py-4 pr-4">
          <span className={`inline-flex min-w-[2rem] items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold ${stockBadge}`}>
            {product.totalStock}
          </span>
        </td>
        <td className="py-4 pr-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
              product.is_active
                ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
                : "border-[#a8451a]/20 bg-white text-[#2b1d12]/70"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              {product.is_active && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${product.is_active ? "bg-emerald-500" : "bg-[#a8451a]/40"}`} />
            </span>
            {product.is_active ? "Active" : "Hidden"}
          </span>
        </td>
        <td className="py-4 pr-2 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="rounded-xl border border-transparent p-2.5 text-[#a8451a]/70 transition-all duration-300 hover:border-[#a8451a]/25 hover:bg-[#fde3cf]/60 hover:text-[#a8451a]"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              disabled={pending}
              className="rounded-xl border border-transparent p-2.5 text-[#a8451a]/70 transition-all duration-300 hover:border-rose-500/25 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
