import Link from "next/link";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/constants";
import { Sparkles, MessageCircle } from "lucide-react";

export default function FindYourScent() {
  return (
    <section className="relative mx-auto max-w-wrap px-5 pb-20 sm:pb-28 sm:px-8 md:px-12">
      <Reveal>
        <div className="group relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.25rem] border border-[#a8451a]/25 bg-gradient-to-b from-[#fff7ef] via-[#fde8d7] to-[#fde0ca] px-6 py-14 text-center shadow-[0_20px_50px_rgba(43,29,18,0.08)] transition-all duration-500 hover:border-[#a8451a]/45 hover:shadow-[0_28px_70px_rgba(168,69,26,0.18)] sm:px-12 sm:py-20 md:px-16">

          {/* Ambient luminous luxury orbs */}
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#c04a1c]/[0.08] blur-[120px]" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#cfa14b]/[0.10] blur-[120px]" />

          {/* Concentric ambient background halo rings */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[500px] aspect-square rounded-full border border-[#a8451a]/15 transition-transform duration-1000 group-hover:scale-105" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[380px] aspect-square rounded-full border border-[#cfa14b]/20 transition-transform duration-1000 group-hover:scale-110" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[440px] h-[300px] sm:h-[440px] rounded-full bg-[radial-gradient(circle,rgba(207,161,75,0.2)_0%,rgba(168,69,26,0.08)_50%,transparent_75%)] blur-[40px]" />

          {/* Top shimmer sweep hairline */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#c04a1c] to-transparent opacity-75" />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm mb-5">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
                Bespoke Fragrance Guidance
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
            </div>

            {/* Headline */}
            <h2 className="mb-5 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-light leading-[1.1] text-[#1c1109] tracking-tight">
              Let Us Help You Find <br className="hidden sm:inline" />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                Your Signature Scent
              </span>
            </h2>

            {/* Description */}
            <p className="mb-8 max-w-xl text-base sm:text-lg text-[#2b1d12]/85 leading-relaxed font-normal sm:mb-10">
              Just tell us what you like — woody, floral, fresh, or smoky — and we&rsquo;ll help you pick the right perfume.
            </p>

            {/* VIP Action Buttons */}
            <div className="flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row sm:gap-4">
              <a
                href={whatsappLink("Hi Zaylune, can you help me find a fragrance? I usually like...")}
                target="_blank"
                rel="noopener noreferrer"
                className="group/wa relative flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-9 py-4 font-display text-sm font-semibold tracking-wide text-white shadow-xl shadow-[#a8451a]/25 transition-all duration-300 hover:shadow-2xl hover:shadow-[#a8451a]/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover/wa:translate-x-full" />
                <MessageCircle className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Chat on WhatsApp</span>
              </a>

              <Link
                href="/shop"
                className="group/shop relative flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-full border-2 border-[#a8451a]/30 bg-white/75 px-8 py-3.5 font-display text-sm font-semibold tracking-wide text-[#a8451a] shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-[#a8451a] hover:bg-white hover:text-[#782c0c] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative z-10">Browse Full Collection</span>
              </Link>
            </div>

            {/* Footnote reassurance */}
            <p className="mt-6 text-sm sm:text-base font-medium text-[#2b1d12]/75">
              Complimentary direct guidance · Instant WhatsApp replies
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
