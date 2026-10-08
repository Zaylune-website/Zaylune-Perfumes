import { notFound } from "next/navigation";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import BundleBuilder from "./_components/BundleBuilder";
import { getBundleSettings, getBundleEligibleProducts } from "@/actions/bundle";

export const metadata = {
  title: "Build Your Own Bundle — Custom Fragrance Set",
  description: "Pick your favorite fragrances and build a custom Zaylune Fragrances gift set at a special bundle price.",
  alternates: { canonical: "/bundle" },
};

export default async function BundlePage() {
  const [settings, products] = await Promise.all([getBundleSettings(), getBundleEligibleProducts()]);

  if (!settings.enabled || products.length === 0) notFound();

  const safeProducts = JSON.parse(JSON.stringify(products));

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-32 bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        
        {/* Decorative ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-[10%] h-[500px] w-[500px] rounded-full bg-[#c04a1c]/[0.08] blur-[160px]" />
          <div className="absolute top-[30%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#cfa14b]/[0.10] blur-[180px]" />
          <div className="absolute bottom-[10%] left-[5%] h-[550px] w-[550px] rounded-full bg-[#8e3510]/[0.06] blur-[160px]" />
        </div>

        {settings.banner_image_url ? (
          <div className="relative w-full overflow-hidden border-b border-[#a8451a]/15 shadow-xs">
            <Image
              src={settings.banner_image_url}
              alt={settings.title}
              width={1920}
              height={800}
              priority
              className="h-auto w-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="pt-4 sm:pt-8" />
        )}

        <section className="relative overflow-hidden">
          <div className="relative mx-auto max-w-wrap px-5 py-8 sm:py-12 sm:px-8 md:px-12 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                Build Your Own Set
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                {settings.title}
              </span>
            </h1>

            {settings.subtitle && (
              <p className="mt-3 max-w-xl text-base sm:text-lg text-[#2b1d12]/80 leading-relaxed font-normal">
                {settings.subtitle}
              </p>
            )}

            {settings.fixed_price != null && (
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/90 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-xs">
                  <Sparkles className="h-4 w-4 text-[#c04a1c]" />
                  Pick Any {settings.bottle_count} for ₹{Number(settings.fixed_price).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </section>

        <div className="relative mx-auto max-w-wrap px-5 pt-4 sm:px-8 md:px-12">
          <BundleBuilder products={safeProducts} bottleCount={settings.bottle_count} fixedPrice={settings.fixed_price} />
        </div>
      </main>
      <Footer />
    </>
  );
}
