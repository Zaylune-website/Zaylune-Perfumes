import { Suspense } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import SortSelect from "@/components/shop/SortSelect";
import { getActiveCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";

export const metadata = {
  title: "Shop All Fragrances",
  description:
    "Browse the full Zaylune collection — attars, extrait-grade oils and eau de parfums, hand-poured in small batches.",
  alternates: { canonical: "/shop" },
  openGraph: {
    url: "/shop",
    title: "Shop All Fragrances — Zaylune",
    description:
      "Browse the full Zaylune collection — attars, extrait-grade oils and eau de parfums, hand-poured in small batches.",
  },
};

const PAGE_SIZE = 20;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withEllipsis = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(p);
  });
  return withEllipsis;
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;

  // Fetch without price filter so we can compute the global price range
  const [categories, allProducts] = await Promise.all([
    getActiveCategories(),
    getProducts({
      categoryId: params.category || undefined,
      gender: params.gender || undefined,
      sort: params.sort || undefined,
      search: params.search || undefined,
    }),
  ]);

  // Compute global price range from unfiltered product set
  const prices = allProducts.map((p) => p.price).filter((p) => p != null && p > 0);
  const globalMin = prices.length > 0 ? Math.floor(Math.min(...prices) / 100) * 100 : 0;
  const globalMax = prices.length > 0 ? Math.ceil(Math.max(...prices) / 100) * 100 : 10000;

  // Apply price filter in JS
  const minPriceParam = params.minPrice ? parseInt(params.minPrice, 10) : null;
  const maxPriceParam = params.maxPrice ? parseInt(params.maxPrice, 10) : null;
  const hasPriceFilter =
    (minPriceParam != null && minPriceParam > globalMin) ||
    (maxPriceParam != null && maxPriceParam < globalMax);

  const products = hasPriceFilter
    ? allProducts.filter((p) => {
        const price = p.price ?? 0;
        if (minPriceParam != null && price < minPriceParam) return false;
        if (maxPriceParam != null && price > maxPriceParam) return false;
        return true;
      })
    : allProducts;

  const activeCategoryName = categories.find((c) => c.id === params.category)?.name;

  const activeChips = [
    params.search ? { key: "search", label: `"${params.search}"` } : null,
    params.category ? { key: "category", label: activeCategoryName || "Category" } : null,
    params.gender ? { key: "gender", label: params.gender } : null,
    hasPriceFilter
      ? {
          key: "price",
          label: `₹${(minPriceParam ?? globalMin).toLocaleString("en-IN")} – ₹${(maxPriceParam ?? globalMax).toLocaleString("en-IN")}`,
        }
      : null,
  ].filter(Boolean);

  const chipHref = (omitKey) => {
    const usp = new URLSearchParams();
    if (params.search && omitKey !== "search") usp.set("search", params.search);
    if (params.category && omitKey !== "category") usp.set("category", params.category);
    if (params.gender && omitKey !== "gender") usp.set("gender", params.gender);
    if (params.sort) usp.set("sort", params.sort);
    if (params.minPrice && omitKey !== "price") usp.set("minPrice", params.minPrice);
    if (params.maxPrice && omitKey !== "price") usp.set("maxPrice", params.maxPrice);
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(parseInt(params.page, 10) || 1, 1), totalPages);
  const pagedProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageHref = (pageNum) => {
    const usp = new URLSearchParams();
    if (params.search) usp.set("search", params.search);
    if (params.category) usp.set("category", params.category);
    if (params.gender) usp.set("gender", params.gender);
    if (params.sort) usp.set("sort", params.sort);
    if (params.minPrice) usp.set("minPrice", params.minPrice);
    if (params.maxPrice) usp.set("maxPrice", params.maxPrice);
    if (pageNum > 1) usp.set("page", String(pageNum));
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProducts = JSON.parse(JSON.stringify(pagedProducts));
  const safeCategories = JSON.parse(JSON.stringify(categories));

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-4 sm:pt-8 bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        
        {/* Decorative ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-[10%] h-[500px] w-[500px] rounded-full bg-[#c04a1c]/[0.08] blur-[160px]" />
          <div className="absolute top-[30%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#cfa14b]/[0.10] blur-[180px]" />
          <div className="absolute bottom-[10%] left-[5%] h-[550px] w-[550px] rounded-full bg-[#8e3510]/[0.06] blur-[160px]" />
        </div>

        <section className="relative">
          <div className="relative mx-auto max-w-wrap px-6 py-5 sm:py-10 md:px-12 md:py-12">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                    The Collection
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                </div>
                <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                    {params.search ? `Results for "${params.search}"` : activeCategoryName || "Shop All Fragrances"}
                  </span>
                </h1>
                <p className="mt-2 max-w-xs text-sm sm:max-w-none sm:text-base text-[#2b1d12]/80 font-normal">
                  {products.length} {products.length === 1 ? "fragrance" : "fragrances"} crafted in small batches with extrait-grade oils
                </p>
              </div>
              <Suspense fallback={null}>
                <SortSelect className="hidden w-56 md:block shrink-0" />
              </Suspense>
            </div>

            {activeChips.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 animate-fadeUp">
                {activeChips.map((chip) => (
                  <Link
                    key={chip.key}
                    href={chipHref(chip.key)}
                    scroll={false}
                    className="flex items-center gap-1.5 rounded-full border border-[#a8451a]/25 bg-white/90 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#8e3510] shadow-2xs transition-all hover:border-[#a8451a] hover:bg-white"
                  >
                    <span>{chip.label}</span>
                    <X className="h-3.5 w-3.5 text-[#a8451a]" />
                  </Link>
                ))}
                <Link
                  href="/shop"
                  scroll={false}
                  className="text-xs sm:text-sm font-semibold text-[#2b1d12]/70 hover:text-rose-600 transition-colors ml-2"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>
        </section>

        <div className="relative mx-auto max-w-wrap px-6 md:px-12">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[260px_1fr] lg:gap-12">
            <aside className="md:sticky md:top-24 md:self-start">
              <Suspense fallback={null}>
                <ShopFilters categories={safeCategories} globalMin={globalMin} globalMax={globalMax} />
              </Suspense>
            </aside>
            <div>
              <ProductGrid
                products={safeProducts}
                emptyMessage="No fragrances match these filters yet. Try clearing a filter, or message us on WhatsApp for a recommendation."
              />

              {totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <Link
                    href={pageHref(currentPage - 1)}
                    scroll={false}
                    aria-disabled={currentPage === 1}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      currentPage === 1
                        ? "pointer-events-none border-[#a8451a]/15 bg-white/40 text-[#2b1d12]/30"
                        : "border-[#a8451a]/25 bg-white/90 text-[#a8451a] hover:bg-white hover:border-[#a8451a] shadow-2xs"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>

                  {getPageNumbers(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-sm font-semibold text-[#2b1d12]/50">
                        &hellip;
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p)}
                        scroll={false}
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border text-sm transition-all ${
                          p === currentPage
                            ? "border-[#a8451a] bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] text-white shadow-md font-bold"
                            : "border-[#a8451a]/20 bg-white/80 text-[#2b1d12]/80 hover:border-[#a8451a] hover:bg-white hover:text-[#1c1109] font-semibold"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                  <Link
                    href={pageHref(currentPage + 1)}
                    scroll={false}
                    aria-disabled={currentPage === totalPages}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      currentPage === totalPages
                        ? "pointer-events-none border-[#a8451a]/15 bg-white/40 text-[#2b1d12]/30"
                        : "border-[#a8451a]/25 bg-white/90 text-[#a8451a] hover:bg-white hover:border-[#a8451a] shadow-2xs"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
