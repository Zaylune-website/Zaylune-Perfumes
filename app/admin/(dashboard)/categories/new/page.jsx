import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "../_components/CategoryForm";

export const metadata = { title: "New Category" };

export default function NewCategoryPage() {
  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#2b1d12]/70 transition-colors hover:text-[#a8451a]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
      </Link>
      <h1 className="mb-6 font-display text-3xl sm:text-4xl font-semibold text-[#1c1109]">
        New <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#c04a1c] via-[#a8451a] to-[#d4651f]">Category</span>
      </h1>
      <CategoryForm />
    </div>
  );
}
