import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
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
      <main className="min-h-screen bg-[#0b0a0a] text-ivory pb-20 sm:pb-28 pt-8 sm:pt-12">
        <div className="mx-auto max-w-5xl px-6 md:px-12">

          {/* Back link */}
          <Link
            href={`/shop/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-ivory/50 hover:text-gold-300 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" /> Back to {product.name}
          </Link>

          {/* Header */}
          <div className="mb-10 sm:mb-14 border-b border-ink-line pb-10 sm:pb-14">
            <p className="eyebrow mb-3">
              <span className="gold-line" /> Customer Love
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-6">
              Reviews for <span className="bg-gradient-to-r from-gold-100 to-gold-400 bg-clip-text text-transparent font-medium">{product.name}</span>
            </h1>

            {/* Rating summary */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start sm:items-center">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gold-400/15 bg-gold-400/5 px-8 py-6 min-w-[120px]">
                <span className="font-display text-5xl font-medium text-gold-200">
                  {product.average_rating > 0 ? Number(product.average_rating).toFixed(1) : "—"}
                </span>
                <StarRating rating={product.average_rating || 0} size={14} className="mt-2" />
                <span className="mt-2 text-xs text-ivory/40 font-medium">{product.review_count} review{product.review_count !== 1 ? "s" : ""}</span>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full sm:max-w-xs">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-ivory/50 font-medium w-4 shrink-0">{star}</span>
                    <Star className="h-3 w-3 shrink-0 text-gold-400/60 fill-gold-400/60" />
                    <div className="flex-1 h-1.5 rounded-full bg-ink-line overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-300 transition-all duration-500"
                        style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-ivory/40 w-4 text-right shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Reviews */}
          {reviews.length > 0 ? (
            <AllReviews reviews={JSON.parse(JSON.stringify(reviews))} />
          ) : (
            <p className="text-ivory/40 text-base font-light">No reviews yet for this product.</p>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
