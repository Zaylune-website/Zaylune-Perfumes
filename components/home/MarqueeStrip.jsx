import { Sparkles, Award, Flame, Droplets, ShieldCheck, Truck } from "lucide-react";

const DEFAULT_ITEMS =
  "*Extrait-Grade Concentration\nHand-Poured in Small Batches\n*100% Cruelty-Free\nPan-India Express Shipping\n*Cash on Delivery Available\nAlcohol-Free Artisan Attars";

function getItemIcon(text) {
  const lower = text.toLowerCase();
  if (lower.includes("extrait") || lower.includes("grade") || lower.includes("luxury")) return Award;
  if (lower.includes("batch") || lower.includes("hand") || lower.includes("poured")) return Flame;
  if (lower.includes("cruelty") || lower.includes("vegan") || lower.includes("free")) return Sparkles;
  if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("india")) return Truck;
  if (lower.includes("cash") || lower.includes("cod") || lower.includes("secure")) return ShieldCheck;
  if (lower.includes("alcohol") || lower.includes("attar") || lower.includes("oil")) return Droplets;
  return Sparkles;
}

function parseItems(raw) {
  if (!raw) raw = DEFAULT_ITEMS;
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const isHighlight = line.startsWith("*");
      const text = isHighlight ? line.slice(1).trim() : line;
      return {
        text,
        highlight: isHighlight,
        icon: getItemIcon(text),
      };
    });
}

export default function MarqueeStrip({ items = DEFAULT_ITEMS }) {
  const parsed = parseItems(items);
  // Exactly 2 identical halves for seamless infinite loop with translateX(-50%)
  const half = [...parsed, ...parsed];
  const loop = [...half, ...half];

  return (
    <section
      aria-label="Brand Highlights"
      className="relative overflow-hidden border-y border-[#d49959]/30 bg-gradient-to-r from-[#150c05] via-[#241309] to-[#150c05] py-4 sm:py-5 shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(212,153,89,0.3)] select-none"
    >
      {/* 24K Gold Shimmering Hairlines */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d49959]/70 to-transparent bg-[length:200%_200%] animate-shimmer" />
      <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d49959]/70 to-transparent bg-[length:200%_200%] animate-shimmer" />

      {/* Luminous Golden Ambient Light */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d49959]/15 blur-3xl" />

      {/* Deep Velvet Fade Masks on Edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#150c05] via-[#150c05]/85 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#150c05] via-[#150c05]/85 to-transparent z-10" />

      {/* Silky 60fps Marquee Track */}
      <div className="relative flex w-max animate-marquee items-center gap-7 sm:gap-12 whitespace-nowrap hover:[animation-play-state:paused] cursor-default">
        {loop.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-7 sm:gap-12">
              {item.highlight ? (
                /* Glowing 24K Gold Pill Badge */
                <span className="group/badge inline-flex items-center gap-2.5 rounded-full border border-[#d49959]/45 bg-gradient-to-r from-[#d49959]/20 via-[#f5d7a6]/15 to-[#d49959]/20 px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#fff6ec] shadow-[0_0_20px_rgba(212,153,89,0.25)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#f5d7a6] hover:shadow-[0_0_28px_rgba(212,153,89,0.45)]">
                  <Icon className="h-3.5 w-3.5 text-[#f5d7a6] animate-pulse shrink-0 drop-shadow-[0_0_8px_rgba(245,215,166,0.6)]" />
                  <span className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{item.text}</span>
                </span>
              ) : (
                /* Crisp Champagne Ivory Label */
                <span className="inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.22em] text-[#fbeadb]/85 transition-all duration-300 hover:text-[#f5d7a6] hover:scale-105">
                  <Icon className="h-3.5 w-3.5 text-[#d49959]/90 shrink-0" />
                  <span>{item.text}</span>
                </span>
              )}

              {/* Glowing 4-Point Star / Diamond Jewel */}
              <div className="relative flex items-center justify-center shrink-0">
                <span className="h-2 w-2 rotate-45 rounded-[1px] bg-gradient-to-tr from-[#b37a3c] via-[#f5d7a6] to-[#b37a3c] shadow-[0_0_10px_rgba(245,215,166,0.7)]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
