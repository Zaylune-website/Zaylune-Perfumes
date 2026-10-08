import { cache } from "react";
import { notFound } from "next/navigation";
import { ChevronDown, Sparkles, Flame, Wind, Anchor } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import StarRating from "@/components/StarRating";
import ProductGallery from "./_components/ProductGallery";
import ProductPurchasePanel from "./_components/ProductPurchasePanel";
import { ProductVariantProvider } from "./_components/ProductVariantContext";
import ReviewForm from "./_components/ReviewForm";
import ReviewsList from "./_components/ReviewsList";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import Reveal from "@/components/Reveal";
import { BRAND } from "@/lib/constants";

// Dedupes the fetch: generateMetadata and the page component both need this
// product, and without caching each would trigger its own DB round trip.
const getCachedProduct = cache(getProductBySlug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) return {};

  const titleText = product.seo_title || product.name;
  // OpenGraph/Twitter tags don't go through the root layout's title template,
  // so the brand suffix is added here explicitly. A custom seo_title is
  // trusted as-is (same rule as the <title> tag below) to avoid double-suffixing.
  const socialTitle = product.seo_title ? titleText : `${titleText} — ${BRAND.name}`;
  const description = product.seo_description || product.short_description || undefined;
  const image = product.featured_image_url || product.images?.[0]?.image_url;

  return {
    // A custom seo_title from admin is treated as the full, final title tag
    // (skips the root layout's "%s — Zaylune" template so it isn't
    // suffixed twice); the product.name fallback still gets the brand suffix.
    title: product.seo_title ? { absolute: titleText } : titleText,
    description,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: {
      url: `/shop/${slug}`,
      siteName: BRAND.name,
      title: socialTitle,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);

  // Map notes with corresponding luxury icons
  const notes = [
    { label: "Top Notes", value: product.notes_top, icon: Wind, desc: "The initial impression, opening instantly" },
    { label: "Heart Notes", value: product.notes_middle, icon: Flame, desc: "The core identity, evolving over hours" },
    { label: "Base Notes", value: product.notes_base, icon: Anchor, desc: "The lingering depth, lasting all day" },
  ].filter((n) => n.value);

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProduct = JSON.parse(JSON.stringify(product));
  const safeRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zaylunefragrances.com";
  const cheapestVariant = safeProduct.variants?.[0];
  const inStockAny = safeProduct.variants?.some((v) => v.stock_quantity > 0);
  const productImages = (safeProduct.images || []).map((img) => img.image_url).filter(Boolean);
  if (safeProduct.featured_image_url) productImages.unshift(safeProduct.featured_image_url);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || product.description || undefined,
    image: productImages.length > 0 ? productImages : undefined,
    sku: cheapestVariant?.id,
    brand: { "@type": "Brand", name: BRAND.name },
    ...(product.review_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.average_rating,
            reviewCount: product.review_count,
          },
        }
      : {}),
    ...(cheapestVariant
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/shop/${slug}`,
            priceCurrency: "INR",
            price: cheapestVariant.price,
            availability: inStockAny
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/shop/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />
      <main className="relative min-h-screen bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] overflow-hidden pb-16 sm:pb-24 pt-6 sm:pt-10 selection:bg-[#a8451a]/20 selection:text-[#1c1109]">

        {/* Ambient luxury background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[8%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#c04a1c]/[0.09] blur-[150px]" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
          <div className="absolute bottom-[5%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#8e3510]/[0.07] blur-[150px]" />
        </div>

        <div className="mx-auto max-w-wrap px-6 md:px-12 relative z-10">

          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-10">
            <ProductVariantProvider variants={safeProduct.variants}>

              {/* Gallery Panel — sticks smoothly on desktop */}
              <Reveal className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 lg:sticky lg:top-[104px] lg:self-start">
                <ProductGallery images={safeProduct.images} name={safeProduct.name} featuredImage={safeProduct.featured_image_url} />
              </Reveal>

              {/* Purchase Options */}
              <Reveal delay={100} className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 flex flex-col">
                {product.gender && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#a8451a]/25 bg-white/85 text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-xs backdrop-blur-md mb-4 w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-[#c04a1c]" />
                    <span>{product.gender}</span>
                  </span>
                )}

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1c1109] leading-tight">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                    {product.name}
                  </span>
                </h1>
                <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent" />

                <div className="mt-4 flex items-center gap-3">
                  <StarRating rating={product.review_count > 0 ? product.average_rating : 0} showValue />
                  <span className="text-base sm:text-lg text-[#2b1d12]/80 font-bold">
                    {product.review_count > 0
                      ? `(${product.review_count} Customer review${product.review_count === 1 ? "" : "s"})`
                      : "New Release"}
                  </span>
                </div>

                {product.description && (
                  <p className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-[#2b1d12]/90 font-normal whitespace-pre-wrap">
                    {product.description}
                  </p>
                )}

                <div className="mt-8 border-t border-[#a8451a]/15 pt-8">
                  <ProductPurchasePanel product={safeProduct} variants={safeProduct.variants} />
                </div>
              </Reveal>
            </ProductVariantProvider>

            {/* Fragrance Story & Olfactory Architecture Showcase — sits below the gallery on desktop, below the purchase panel on mobile */}
            {(product.short_description || notes.length > 0) && (
              <Reveal className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 mt-8 sm:mt-10 lg:mt-16 border-t border-[#a8451a]/15 pt-8 sm:pt-10 lg:border-t-0 lg:pt-0">
                <div className="grid grid-cols-1 gap-6 sm:gap-8">

                  {/* The Story / Fragrance Profile */}
                  {product.short_description && (
                    <div className="rounded-3xl border border-[#a8451a]/20 bg-white/85 p-5 sm:p-6 lg:p-8 shadow-sm backdrop-blur-xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                        <span>The Story</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1c1109] mb-3">
                        Fragrance Profile
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#2b1d12]/90 font-normal">
                        {product.short_description}
                      </p>
                    </div>
                  )}

                  {/* Olfactory Composition with Luxury Ingredient Capsules */}
                  {notes.length > 0 && (
                    <div className="rounded-3xl border border-[#a8451a]/20 bg-white/85 p-5 sm:p-6 lg:p-8 shadow-sm backdrop-blur-xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                        <span>Fragrance Architecture</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1c1109] mb-4">
                        Olfactory Composition
                      </h2>

                      <div className="space-y-3 sm:space-y-4">
                        {notes.map((n) => {
                          const NoteIcon = n.icon;
                          const ingredients = n.value.includes(",")
                            ? n.value.split(",").map((i) => i.trim()).filter(Boolean)
                            : [n.value.trim()];
                          return (
                            <div
                              key={n.label}
                              className="group relative rounded-2xl border border-[#a8451a]/20 bg-white/95 p-4 sm:p-5 shadow-2xs hover:border-[#a8451a]/40 hover:bg-white hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-xs">
                                    <NoteIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                                  </div>
                                  <div>
                                    <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#a8451a]">
                                      {n.label}
                                    </p>
                                    <p className="text-sm text-[#2b1d12]/75 font-medium">
                                      {n.desc}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {ingredients.map((item, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center rounded-xl border border-[#a8451a]/20 bg-gradient-to-b from-white to-[#fdf7f2] px-3 py-1 text-xs sm:text-sm font-bold text-[#1c1109] shadow-2xs hover:border-[#a8451a]/50 hover:bg-white transition-colors"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* Symmetrical Grid: FAQs on left, Reviews on right */}
          <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 border-t border-[#a8451a]/15 pt-10 sm:pt-16">

            {/* Left Column: FAQs */}
            <Reveal>
              {product.faqs && product.faqs.length > 0 ? (
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-3 sm:mb-4">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#c04a1c]" />
                    <span>Need to Know</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-3xl font-extrabold text-[#1c1109] mb-4 sm:mb-6">Common Questions</h2>
                  <div className="space-y-2.5 sm:space-y-3.5">
                    {product.faqs.map((faq) => (
                      <details key={faq.id} className="group overflow-hidden rounded-2xl border border-[#a8451a]/20 bg-white/90 shadow-2xs backdrop-blur-md hover:border-[#a8451a]/40 hover:bg-white transition-all duration-300">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 text-[15px] sm:text-xl font-bold leading-snug text-[#1c1109] hover:bg-white/60">
                          <span>{faq.question}</span>
                          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#a8451a] transition-transform duration-300 group-open:rotate-180" />
                        </summary>
                        <p className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 text-sm sm:text-lg leading-relaxed text-[#2b1d12]/90 font-normal border-t border-[#a8451a]/10 pt-3 sm:pt-3.5 animate-fadeUp">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full rounded-3xl border border-dashed border-[#a8451a]/25 p-8 text-center text-[#2b1d12]/70 py-16 bg-white/40">
                  <p className="text-base sm:text-lg">No questions listed yet for this fragrance.</p>
                </div>
              )}
            </Reveal>

            {/* Right Column: Reviews */}
            <Reveal delay={100} className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-4">
                  <Sparkles className="h-4 w-4 text-[#c04a1c]" />
                  <span>Customer Love</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109] mb-6">Ratings &amp; Reviews</h2>
              </div>
              <ReviewForm productId={product.id} existingReview={safeProduct.myReview} />

              <ReviewsList reviews={safeProduct.reviews} slug={slug} hasOwnReview={!!safeProduct.myReview} />
            </Reveal>

          </div>

          {/* Related Products */}
          {safeRelatedProducts.length > 0 && (
            <Reveal className="mt-16 sm:mt-24 border-t border-[#a8451a]/15 pt-10 sm:pt-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/85 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                <span>Complementary Selections</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#1c1109] mb-8 sm:mb-12">
                You Might Also Like
              </h2>
              <ProductGrid products={safeRelatedProducts} />
            </Reveal>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
