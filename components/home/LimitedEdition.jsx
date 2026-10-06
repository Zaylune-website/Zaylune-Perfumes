import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Sparkles } from "lucide-react";

const DEFAULT_IMAGE =
  "https://ik.imagekit.io/nc3h4sguy/zaylune/home-sections/Zaylune_Luxury_Perfume_Trio_c2Y631FUob.png";

export default function LimitedEdition({
  subtitle = "Exclusive drops from Zaylune — small batches, handcrafted in limited quantity. Once gone, they never return.",
  headingLine1 = "Exclusive Drops,",
  headingLine2 = "Only From Zaylune",
  buttonText = "Shop Limited Edition",
  image = DEFAULT_IMAGE,
  showImage = true,
}) {
  const displayImage = image || DEFAULT_IMAGE;

  return (
    <section className="relative w-full overflow-hidden border-y border-[#a8451a]/20 bg-gradient-to-b from-[#fde3cf] via-[#fff5eb] to-[#fde3cf] py-16 sm:py-24 lg:py-28">
      {/* Ambient luminous luxury glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-1/4 h-[480px] w-[520px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
        <div className="absolute -right-[10%] bottom-1/4 h-[520px] w-[560px] rounded-full bg-[#cfa14b]/[0.10] blur-[160px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-white/[0.25] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Bottle Exhibition Showcase (6 cols) */}
          {showImage && (
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] group">

              {/* Ambient Circular Halo Rings */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[440px] lg:w-[480px] aspect-square rounded-full border border-[#a8451a]/15 transition-transform duration-1000 group-hover:scale-105" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[350px] lg:w-[390px] aspect-square rounded-full border border-[#cfa14b]/25 transition-transform duration-1000 group-hover:scale-110" />

              {/* Radiant Warm Backlight Disc */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] rounded-full bg-[radial-gradient(circle,rgba(207,161,75,0.22)_0%,rgba(168,69,26,0.08)_50%,transparent_72%)] blur-[40px]" />

              {/* Luminous Exhibition Pedestal / Ground Reflection Glow */}
              <div className="pointer-events-none absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-[380px] h-10 rounded-[100%] bg-gradient-to-r from-transparent via-[#2b1d12]/20 to-transparent blur-md" />
              <div className="pointer-events-none absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-1/2 max-w-[260px] h-6 rounded-[100%] bg-gradient-to-r from-transparent via-[#cfa14b]/35 to-transparent blur-sm" />

              {/* Bottle Showcase Image */}
              <div className="relative z-10 aspect-square w-full max-w-[460px] lg:max-w-[500px] transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                <Image
                  src={displayImage}
                  alt="Zaylune limited edition bottles"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-contain drop-shadow-[0_20px_35px_rgba(43,29,18,0.22)]"
                  priority={false}
                />
              </div>

            </div>
          )}

          {/* Right Column: Editorial Copy */}
          <div className={`flex flex-col justify-center ${showImage ? "lg:col-span-6" : "lg:col-span-12 items-center text-center"}`}>
            <Reveal>
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/75 px-4 py-1.5 shadow-sm backdrop-blur-sm mb-5">
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a8451a]">
                  Limited Edition
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c] animate-pulse" />
              </div>

              {/* Headline */}
              <h2 className="mb-5 font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
                {headingLine1} <br />
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                  {headingLine2}
                </span>
              </h2>

              {/* Subtitle / Story Description */}
              <p className="mb-8 max-w-xl text-sm sm:text-base md:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
                {subtitle}
              </p>

              {/* Action Button */}
              <div>
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-9 py-4 font-display text-sm font-semibold tracking-wide text-white shadow-xl shadow-[#a8451a]/25 transition-all duration-300 hover:shadow-2xl hover:shadow-[#a8451a]/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <span className="relative z-10">{buttonText}</span>
                </Link>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
