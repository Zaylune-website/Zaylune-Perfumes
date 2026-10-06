"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/admin/categories";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function CategoryRow({ category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCategory(category.id);
      setModalOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        pending={pending}
        label={category.name}
      />
      <tr className="group/row transition-colors duration-300 hover:bg-[#fde3cf]/30">
        <td className="py-4 pr-4 pl-2">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-[#a8451a]/20 bg-[#fde3cf]/40 shadow-2xs transition-all duration-300 group-hover/row:border-[#a8451a]/40 group-hover/row:shadow-md">
              {category.image_url && <Image src={category.image_url} alt="" fill sizes="48px" className="object-cover transition-transform duration-500 group-hover/row:scale-[1.08]" />}
            </div>
            <span className="text-sm font-bold text-[#1c1109] transition-colors duration-300 group-hover/row:text-[#a8451a]">{category.name}</span>
          </div>
        </td>
        <td className="py-4 pr-4">
          <span className="inline-block rounded-lg border border-[#a8451a]/15 bg-white px-2.5 py-1 font-mono text-xs text-[#2b1d12]/75">{category.slug}</span>
        </td>
        <td className="py-4 pr-4">
          <span
            className={`inline-flex min-w-[2rem] items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold ${
              category.product_count === 0
                ? "border-rose-500/30 bg-rose-50 text-rose-700"
                : "border-[#a8451a]/25 bg-[#fde3cf]/50 text-[#a8451a]"
            }`}
          >
            {category.product_count}
          </span>
        </td>
        <td className="py-4 pr-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
            category.is_active
              ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
              : "border-[#a8451a]/20 bg-white text-[#2b1d12]/70"
          }`}>
            <span className="relative flex h-1.5 w-1.5">
              {category.is_active && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${category.is_active ? "bg-emerald-500" : "bg-[#a8451a]/40"}`} />
            </span>
            {category.is_active ? "Active" : "Hidden"}
          </span>
        </td>
        <td className="py-4 pr-2 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/admin/categories/${category.id}/edit`}
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
