import Link from "next/link";
import { Sparkles, Compass, MessageCircle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import BottleGlyph from "@/components/BottleGlyph";
import { whatsappLink } from "@/lib/constants";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] px-5 py-16 text-center text-[#1c1109] sm:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-[#c04a1c]/[0.08] blur-[140px]" />
          <div className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[#d4a359]/[0.12] blur-[140px]" />
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute select-none font-display text-[32vw] font-extrabold leading-none text-[#a8451a]/[0.06] sm:text-[220px]"
        >
          404
        </span>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8 flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
            <span className="absolute inset-0 rounded-full border border-dashed border-[#cfa14b]/50 animate-spin" style={{ animationDuration: "40s" }} />
            <span className="absolute inset-3 rounded-full border border-[#a8451a]/20 bg-white/70 shadow-md backdrop-blur-md" />
            <BottleGlyph className="relative h-16 w-auto text-[#a8451a] animate-floatSlow sm:h-20" />
          </div>

          <p className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.26em] text-[#a8451a] shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
            Page Not Found
            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
          </p>

          <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Oops! This page is{" "}
            <span className="bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] bg-clip-text text-transparent">
              missing
            </span>
          </h1>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent" />

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#2b1d12]/85 sm:text-lg">
            The page may have moved, or the link is wrong. Go back to our shop and find your favourite perfume.
          </p>

          <div className="mt-9 flex w-full max-w-sm flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Link href="/shop" className="btn-gold w-full sm:w-auto">
              <Compass className="h-4 w-4" />
              Shop Perfumes
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#c04a1c]/40 bg-white/70 px-7 py-3 text-sm font-semibold tracking-wide text-[#a8451a] shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c04a1c] hover:bg-accent-gradient hover:text-[#fef2e6] sm:w-auto"
            >
              Home Page
            </Link>
          </div>

          <a
            href={whatsappLink("Hi Zaylune, I couldn't find a page on your website. Can you help?")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a8451a] transition-colors hover:text-[#782c0c]"
          >
            <MessageCircle className="h-4 w-4" />
            Need help? Message us on WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
