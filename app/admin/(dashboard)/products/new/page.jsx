import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../_components/ProductForm";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();
  return (
    <div>
      <Link
        href="/admin/products"
        className="group/btn mb-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#2b1d12]/70 hover:text-[#a8451a] transition-colors uppercase duration-300"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-1" /> Back to Products
      </Link>
      <div className="mb-8 border-b border-[#a8451a]/10 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1c1109]">
          New <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#c04a1c] via-[#a8451a] to-[#d4651f]">Product</span>
        </h1>
        <p className="text-base text-[#2b1d12]/78 font-normal mt-1.5">Add a new product to your store.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
