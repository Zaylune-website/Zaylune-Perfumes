"use client";

import { useState } from "react";
import { GalleryHorizontal, Sparkles, Compass, Route, Gem, Quote, HelpCircle } from "lucide-react";
import HeroSlideManager from "./HeroSlideManager";
import HomeSectionsManager from "./HomeSectionsManager";

const TABS = [
  { id: "hero", label: "Hero", icon: GalleryHorizontal },
  { id: "marquee", label: "Marquee Strip", icon: Sparkles, sections: ["marquee"] },
  { id: "choose", label: "Find the Perfect Scent", icon: Compass, sections: ["choose"] },
  { id: "journey", label: "Fragrance Journey", icon: Route, sections: ["journey"] },
  { id: "limited", label: "Limited Edition", icon: Gem, sections: ["limited"] },
  { id: "testimonials", label: "Testimonials", icon: Quote, sections: ["testimonials"] },
  { id: "faq", label: "FAQ", icon: HelpCircle, sections: ["faq"] },
];

export default function HomeCustomizationTabs({ slides, settings }) {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === activeId);

  return (
    <div>
      <div className="thin-x-scroll mb-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {TABS.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                active
                  ? "border-transparent bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#c04a1c] text-white shadow-sm"
                  : "border-[#a8451a]/20 bg-white text-[#a8451a] hover:border-[#a8451a]/40 hover:bg-[#fff5ee]"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab.id === "hero" ? (
        <HeroSlideManager slides={slides} settings={settings} />
      ) : (
        <HomeSectionsManager key={activeTab.id} settings={settings} only={activeTab.sections} />
      )}
    </div>
  );
}
