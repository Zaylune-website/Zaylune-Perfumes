import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import AllReviews from "./_components/AllReviews";
import { createClient } from "@/lib/supabase/server";

async function getProductReviews(slug) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, name, slug, average_rating, review_count, featured_image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) return null;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, review_text, created_at, profiles ( full_name )")
    .eq("product_id", product.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return { product, reviews: reviews || [] };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getProductReviews(slug);
  if (!data) return {};
  return { title: `Reviews — ${data.product.name}` };
}

export default async function ReviewsPage({ params }) {
  const { slug } = await params;
  const data = await getProductReviews(slug);
  if (!data) notFound();

  const { product, reviews } = data;

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] overflow-hidden pb-20 sm:pb-28 pt-8 sm:pt-12">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[8%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8 md:px-12">

          {/* Back link */}
          <Link
            href={`/shop/${slug}`}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#a8451a]/20 bg-white/85 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-base font-bold uppercase tracking-wider text-[#a8451a] hover:bg-white shadow-2xs mb-6 sm:mb-8 transition-all hover:border-[#a8451a]"
          >
            <span className="truncate">Back to {product.name}</span>
          </Link>

          {/* Header */}
          <div className="mb-8 sm:mb-14 rounded-3xl border border-[#a8451a]/20 bg-white/85 p-5 sm:p-10 shadow-sm backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1.5 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-4">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-[#c04a1c] text-[#c04a1c]" />
              <span>Customer Love</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1c1109] mb-6 sm:mb-8 break-words">
              Reviews for{" "}
              <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">
                {product.name}
              </span>
            </h1>

            {/* Rating summary */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start sm:items-center">
              <div className="flex w-full sm:w-auto flex-col items-center justify-center rounded-2xl border border-[#a8451a]/20 bg-white px-6 sm:px-8 py-5 sm:py-6 sm:min-w-[150px] shadow-xs">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#1c1109]">
                  {product.average_rating > 0 ? Number(product.average_rating).toFixed(1) : "—"}
                </span>
                <StarRating rating={product.average_rating || 0} size={18} className="mt-2" />
                <span className="mt-2 text-sm text-[#2b1d12]/75 font-semibold">
                  {product.review_count} {product.review_count === 1 ? "review" : "reviews"}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 w-full sm:max-w-xs">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-[#1c1109] font-bold w-4 shrink-0">{star}</span>
                    <Star className="h-4 w-4 shrink-0 text-[#c04a1c] fill-[#c04a1c]" />
                    <div className="flex-1 h-2.5 rounded-full bg-[#a8451a]/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#d4651f] transition-all duration-500"
                        style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-sm text-[#2b1d12]/80 font-medium w-6 text-right shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Reviews */}
          {reviews.length > 0 ? (
            <AllReviews reviews={JSON.parse(JSON.stringify(reviews))} />
          ) : (
            <p className="text-[#2b1d12]/75 text-base font-normal">No reviews yet for this fragrance.</p>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
