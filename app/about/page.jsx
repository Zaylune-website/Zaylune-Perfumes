import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TestimonialSection from "@/components/about/TestimonialSection";
import StatCounter from "@/components/about/StatCounter";
import { getActiveTestimonials } from "@/actions/site";
import { getSiteSettings } from "@/actions/settings";
import { settingsToBrand, whatsappLink } from "@/lib/constants";
import {
  Sparkles,
  FlaskConical,
  Clock,
  ShieldCheck,
  MapPin,
  Check,
  Quote,
  Droplets,
} from "lucide-react";

export const metadata = {
  title: "About Us — Honest, Long-Lasting Perfumes & Attars",
  description:
    "Learn the story behind Zaylune Fragrances. Handcrafted perfumes and pure attar oils made with honest pricing in Robertsonpet, KGF.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "100%", label: "Safe on Skin" },
  { value: "10h+", label: "Lasts All Day" },
  { value: "100%", label: "Cruelty Free" },
  { value: "100%", label: "Hand-Made Batches" },
];

const CRAFT_PILLARS = [
  {
    icon: Droplets,
    title: "Lasts All Day (10+ Hours)",
    description:
      "We use more pure perfume oil in every bottle, so your scent stays strong on your skin from morning to night without needing to re-apply.",
  },
  {
    icon: FlaskConical,
    title: "100% Safe on Skin",
    description:
      "We only use skin-friendly, certified ingredients. No harsh chemicals, no burning sensation, and completely safe for daily use.",
  },
  {
    icon: Clock,
    title: "Made for Indian Weather",
    description:
      "We test our perfumes in real heat, humidity, and long workdays before releasing them, so they don't fade away when you sweat.",
  },
  {
    icon: ShieldCheck,
    title: "Never Tested on Animals",
    description:
      "We love animals as much as great scent. None of our oils or bottles are ever tested on animals. 100% clean and ethical.",
  },
];

const ADVANTAGES = [
  "Imported high-quality perfume oils",
  "Lasts all day on skin and clothes",
  "Gentle and safe on sensitive skin",
  "Tested to perform in hot & humid weather",
  "Scents for Men, Women & Unisex",
  "Every bottle checked by hand",
  "Zero animal testing, 100% cruelty-free",
  "Direct from maker, honest prices",
];

export default async function AboutPage() {
  const [testimonials, settings] = await Promise.all([
    getActiveTestimonials(),
    getSiteSettings(),
  ]);

  const safeTestimonials = JSON.parse(JSON.stringify(testimonials || []));
  const brand = settingsToBrand(settings);

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-8 sm:pt-12 bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        
        {/* Decorative ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-[10%] h-[500px] w-[500px] rounded-full bg-[#c04a1c]/[0.08] blur-[160px]" />
          <div className="absolute top-[35%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#cfa14b]/[0.10] blur-[180px]" />
          <div className="absolute bottom-[10%] left-[5%] h-[550px] w-[550px] rounded-full bg-[#8e3510]/[0.06] blur-[160px]" />
        </div>

        {/* ─── Hero Section ────────────────────────── */}
        <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-20 lg:pt-14 lg:pb-24">
          <div className="relative mx-auto max-w-4xl px-5 sm:px-8 text-center">
            <Reveal>
              {/* Status Pill */}
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-2 backdrop-blur-md shadow-xs mb-6">
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                  Pure Perfume Oils · Made in Small Batches
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.12] text-[#1c1109] font-light">
                Luxury Perfumes, <br />
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                  Made Honest & Affordable.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg md:text-xl text-[#2b1d12]/85 leading-relaxed font-normal max-w-2xl mx-auto">
                We started {brand.name} with one simple goal: you shouldn&rsquo;t have to spend a fortune to smell amazing. We hand-blend long-lasting perfumes and pure attars in small batches, and ship them directly to your door across India.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-9 sm:px-10 py-3.5 sm:py-4 font-display text-base font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <span className="relative z-10">Explore Our Perfumes</span>
                </Link>

                <a
                  href={whatsappLink(`Hi ${brand.name}, I would like to explore your perfumes.`, brand)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[#a8451a]/30 bg-white/85 px-8 sm:px-9 py-3.5 sm:py-4 font-display text-base font-semibold text-[#a8451a] hover:bg-[#a8451a] hover:text-white transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Story Section ──────────────────────────── */}
        <section className="relative py-16 sm:py-24 border-y border-[#a8451a]/15 bg-white/50 backdrop-blur-xs">
          <div className="mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              
              {/* Left Column: Bottle photo */}
              <div className="lg:col-span-5 flex justify-center">
                <Reveal className="group relative w-full max-w-[360px] sm:max-w-[400px]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.25rem] sm:rounded-[2.75rem] border border-[#a8451a]/25 bg-white shadow-xl transition-all duration-500 hover:border-[#a8451a]/45 hover:shadow-2xl">
                    <Image
                      src="/about.png"
                      alt={`${brand.name} handcrafted fragrance bottle`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 85vw, 400px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle top hairline highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent z-10" />

                    {/* Subtle gradient vignette at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Bottom floating workshop badge */}
                    <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a8451a]">
                        Hand-Made In KGF
                      </p>
                      <p className="font-display text-sm sm:text-base text-[#1c1109] font-bold mt-0.5 truncate">
                        {brand.name}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Story Copy in Simple English */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <Reveal delay={100}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs mb-3.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                      Our Story
                    </span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-[#1c1109] font-light">
                    Why We Started <br />
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                      {brand.name}
                    </span>
                  </h2>

                  <div className="mt-6 space-y-4 text-base sm:text-lg text-[#2b1d12]/85 font-normal leading-relaxed">
                    <p>
                      Big designer perfume brands charge ₹10,000 to ₹15,000 for a single bottle. But most of that money doesn&rsquo;t go into the perfume. It goes to celebrity advertising, expensive mall rent, and middleman profits.
                    </p>
                    <p>
                      We wanted to change that. We cut out all the middlemen and sell directly to you. We source authentic imported oils and add more concentration to every bottle. That means you get a deep, rich scent that actually lasts on your skin all day long.
                    </p>
                    <p>
                      Every bottle is hand-filled, capped, and tested right here in our workshop. We wear our own perfumes every day, so we know they easily survive hot weather, sweat, and busy days.
                    </p>
                  </div>

                  {/* Store & Workshop Card */}
                  <div className="mt-8 rounded-2xl sm:rounded-3xl border border-[#a8451a]/20 bg-white/85 p-5 sm:p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-[#a8451a]/40">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e3510] to-[#a8451a] text-white shadow-xs">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-base font-bold text-[#1c1109]">
                          Our Store & Workshop
                        </h4>
                        <p className="mt-1 text-sm text-[#2b1d12]/80 leading-relaxed font-normal">
                          {brand.address}
                        </p>
                        <div className="mt-3.5 flex items-center gap-3 flex-wrap">
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(brand.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
                          >
                            Get Directions
                          </a>
                          <a
                            href={whatsappLink(`Hi ${brand.name}, I would like to know more about your store.`, brand)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-[#a8451a]/25 bg-white px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#a8451a] hover:bg-[#a8451a] hover:text-white transition-all"
                          >
                            WhatsApp Us
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Quality & Craft: 4 Pillars Grid ───────────────────── */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
            
            <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs mb-3.5">
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                  What Makes Us Special
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
                What Goes Into{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                  Every Bottle
                </span>
              </h2>
              <p className="mt-3.5 text-base sm:text-lg text-[#2b1d12]/80 leading-relaxed font-normal">
                Four simple promises behind every perfume and attar we make.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CRAFT_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <Reveal key={pillar.title} delay={idx * 80}>
                    <div className="group relative h-full overflow-hidden rounded-[2rem] border border-[#a8451a]/20 bg-white/85 p-7 sm:p-8 backdrop-blur-md shadow-xs transition-all duration-500 hover:-translate-y-1.5 hover:border-[#a8451a]/40 hover:bg-white hover:shadow-lg flex flex-col justify-between">
                      {/* Top shimmer sweep hairline on hover */}
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#c04a1c] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div>
                        {/* Icon Medallion */}
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-gradient-to-br from-[#fff7ef] to-[#fde5ce] text-[#a8451a] shadow-xs group-hover:scale-105 transition-transform duration-300">
                          <Icon className="h-6 w-6 text-[#a8451a]" strokeWidth={1.8} />
                        </div>
                        <h3 className="font-display text-lg sm:text-xl text-[#1c1109] font-bold mb-2.5">
                          {pillar.title}
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed text-[#2b1d12]/80 font-normal">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

          </div>
        </section>

        {/* ─── Numbers / Stats Strip ──────────────────────────────────── */}
        <section className="py-12 sm:py-16 relative border-y border-[#a8451a]/15 bg-white/60 backdrop-blur-xs">
          <div className="mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
            <Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                {STATS.map((stat, idx) => (
                  <div key={stat.label} className="relative">
                    {idx > 0 && (
                      <div className="hidden sm:block absolute left-0 top-1/4 bottom-1/4 w-px bg-[#a8451a]/15" />
                    )}
                    <p className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2b1d12]/80">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Why Choose Zaylune: Two-Column Commitment ──────────────── */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              
              <div className="lg:col-span-5">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs mb-3.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                      Our Promise
                    </span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#1c1109] leading-tight">
                    Why You&rsquo;ll Love <br />
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                      {brand.name}
                    </span>
                  </h2>

                  <p className="mt-5 text-base sm:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
                    We want you to smell great and feel confident every day. From our smooth spray nozzles to long-lasting perfume oils, everything is made with care and sold at a fair price.
                  </p>

                  <div className="mt-8">
                    <Link
                      href="/shop"
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-9 sm:px-10 py-3.5 sm:py-4 font-display text-base font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                      <span className="relative z-10">See All Fragrances</span>
                    </Link>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {ADVANTAGES.map((item, i) => (
                    <Reveal key={item} delay={i * 40}>
                      <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/85 border border-[#a8451a]/20 shadow-2xs backdrop-blur-md hover:border-[#a8451a]/40 hover:bg-white transition-all">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#a8451a]/15 text-[#a8451a]">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm sm:text-base text-[#1c1109] font-medium">
                          {item}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Testimonials from real customers ───────────────────────── */}
        <TestimonialSection testimonials={safeTestimonials} />

        {/* ─── Founder's Quote / Closing Statement ─────────────────────── */}
        <section className="relative py-12 sm:py-16">
          <div className="mx-auto max-w-wrap px-5 sm:px-8 md:px-12">
            <Reveal className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[3rem] border border-[#a8451a]/25 bg-white/90 p-8 sm:p-14 md:p-18 text-center shadow-lg backdrop-blur-md">
              
              {/* Top Hairline Highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-gradient-to-br from-[#fff7ef] to-[#fde5ce] text-[#a8451a] shadow-xs">
                  <Quote className="w-6 h-6" />
                </div>

                <p className="font-display text-xl sm:text-2xl md:text-3xl text-[#1c1109] leading-relaxed font-light italic">
                  &ldquo;A good perfume shouldn&rsquo;t be something you save only for weddings or special days. It should be something you enjoy every morning, feeling your best without worrying about the cost.&rdquo;
                </p>

                <div className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />

                <span className="font-display text-base sm:text-lg uppercase tracking-wider text-[#a8451a] font-bold mt-4">
                  {brand.name}
                </span>
                <span className="text-xs sm:text-sm text-[#2b1d12]/75 font-medium tracking-wide mt-1">
                  {brand.address}
                </span>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                  <Link
                    href="/shop"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-9 sm:px-10 py-3.5 sm:py-4 font-display text-base font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    <span className="relative z-10">Shop Fragrances</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-[#a8451a]/30 bg-white/90 hover:bg-[#a8451a] hover:text-white px-8 sm:px-9 py-3.5 sm:py-4 font-display text-base font-semibold text-[#a8451a] transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
