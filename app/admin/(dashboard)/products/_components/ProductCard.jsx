"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/admin/products";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function ProductCard({ product }) {
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
      ? "bg-red-500/10 text-red-700 border-red-500/20"
      : product.totalStock <= 5
      ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
      : "bg-[#1c1109]/5 text-[#2b1d12]/75 border-[#1c1109]/10";

  return (
    <>
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        pending={pending}
        label={product.name}
      />
      <li className="rounded-2xl border border-[#a8451a]/10 bg-[#1c1109]/[0.02] p-4">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#a8451a]/10 bg-[#fde3cf]/40">
            {product.featured_image_url && (
              <Image src={product.featured_image_url} alt="" fill sizes="48px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#1c1109]">{product.name}</p>
            <p className="truncate text-sm text-[#2b1d12]/68">{product.categoryName || "No category"}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="rounded-lg p-2 text-[#2b1d12]/70 hover:bg-[#a8451a]/10 hover:text-[#a8451a]"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              disabled={pending}
              className="rounded-lg p-2 text-[#2b1d12]/70 hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#1c1109]/10 bg-[#1c1109]/5 px-2.5 py-1 text-xs font-semibold text-[#2b1d12]/75">
            {product.minPrice != null ? `₹${product.minPrice.toLocaleString("en-IN")}` : "No price"}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${stockBadge}`}>
            {product.totalStock} in stock
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase border ${
              product.is_active
                ? "bg-green-500/10 text-green-800 border-green-500/20"
                : "bg-[#1c1109]/5 text-[#2b1d12]/70 border-[#1c1109]/10"
            }`}
          >
            {product.is_active ? "Active" : "Hidden"}
          </span>
        </div>
      </li>
    </>
  );
}
