"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

// High enough that the duplicated track is always wider than even an
// ultra-wide laptop viewport, however short/few the messages are — otherwise
// there's no room to scroll and it clamps at the end, looking frozen.
const COPIES = 16;
const SPEED_PX = 1;

function Item({ message }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-6 sm:px-9">
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#f7d9a8]" />
      <p className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.18em] text-[#fef2e6] [text-shadow:0_1px_6px_rgba(60,15,5,0.35)] sm:text-xs">
        {message}
      </p>
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#f7d9a8]" />
      <span className="ml-3 h-1 w-1 shrink-0 rounded-full bg-[#f0c27a] shadow-[0_0_8px_rgba(240,194,122,0.9)] sm:ml-6" />
    </div>
  );
}

function Frame({ children }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#5c1d0b] via-[#a8451a] to-[#5c1d0b] text-[#fef2e6]">
      <style>{`@keyframes annSweep { from { transform: translateX(-100%) skewX(-14deg); } to { transform: translateX(450%) skewX(-14deg); } }`}</style>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        style={{ animation: "annSweep 4.5s ease-in-out infinite" }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#f0c27a]/70 to-transparent" />
      <div className="relative py-2.5 sm:py-3">{children}</div>
    </div>
  );
}

export default function AnnouncementTicker({ messages }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const half = () => track.scrollWidth / 2;
    let frame = null;

    // Start in the middle copy so the wrap-around never shows a seam.
    el.scrollLeft = half();

    const wrap = () => {
      if (el.scrollLeft >= half()) el.scrollLeft -= half();
      else if (el.scrollLeft <= 0) el.scrollLeft += half();
    };

    const tick = () => {
      el.scrollLeft += SPEED_PX;
      wrap();
      frame = requestAnimationFrame(tick);
    };

    el.addEventListener("scroll", wrap, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", wrap);
    };
  }, [messages]);

  if (!messages.length) return null;

  return (
    <Frame>
      <div
        ref={scrollRef}
        className="no-scrollbar overflow-x-auto touch-pan-x select-none"
        style={{ scrollBehavior: "auto" }}
        aria-label="Announcements"
      >
        <div ref={trackRef} className="flex w-max">
          {Array.from({ length: COPIES }).flatMap((_, copy) =>
            messages.map((message, i) => <Item key={`${copy}-${i}`} message={message} />)
          )}
        </div>
      </div>
    </Frame>
  );
}
