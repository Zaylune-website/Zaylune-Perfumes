import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductForEdit } from "@/actions/admin/products";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import ProductForm from "../../_components/ProductForm";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductForEdit(id), getAllCategoriesAdmin()]);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="group/btn mb-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#2b1d12]/70 hover:text-[#a8451a] transition-colors uppercase duration-300"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-1" /> Back to Products
      </Link>
      <div className="mb-8 border-b border-[#a8451a]/10 pb-6">
        <h1 className="break-words font-display text-2xl font-semibold text-[#1c1109] sm:text-4xl">
          Edit <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#c04a1c] via-[#a8451a] to-[#d4651f]">{product.name}</span>
        </h1>
        <p className="mt-1.5 text-sm font-normal text-[#2b1d12]/78 sm:text-base">Edit product details, price, and images.</p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
