import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BottleGlyph from "@/components/BottleGlyph";
import TestimonialSection from "@/components/about/TestimonialSection";
import StatCounter from "@/components/about/StatCounter";
import { getActiveTestimonials } from "@/actions/site";
import { whatsappLink } from "@/lib/constants";
import {
  Sparkles,
  FlaskConical,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  MapPin,
  Check,
  Quote,
  Heart,
  Droplets,
} from "lucide-react";

export const metadata = {
  title: "About Us — Zaylune Fragrances",
  description:
    "Zaylune crafts hand-poured attars and fine fragrances in small batches. Born in Robertsonpet, KGF — learn our story, craftsmanship, and philosophy.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "100%", label: "IFRA Compliant" },
  { value: "10h+", label: "Average Longevity" },
  { value: "100%", label: "Cruelty Free" },
  { value: "100%", label: "Small Batch Poured" },
];

const CRAFT_PILLARS = [
  {
    icon: Droplets,
    title: "High Oil Concentration",
    description:
      "We formulate at extrait strength so your fragrance doesn't evaporate after an hour. Rich, layered oils that hold close to the skin and project naturally through the day.",
  },
  {
    icon: FlaskConical,
    title: "IFRA Certified Ingredients",
    description:
      "Every drop uses imported fragrance oils blended with certified premix cosmetic solvents. Completely skin-safe, consistent, and free from harmful additives.",
  },
  {
    icon: Clock,
    title: "Personally Wear-Tested",
    description:
      "Before any formula launches, we wear it ourselves through real Indian weather, humidity, and long days. If it doesn't perform to our standards, it never goes into a bottle.",
  },
  {
    icon: ShieldCheck,
    title: "100% Cruelty-Free",
    description:
      "We love animals as much as we love great scent. None of our oils, solvents, or finished bottles are ever tested on animals. Ethical from start to finish.",
  },
];

const ADVANTAGES = [
  "Imported premium fragrance oils",
  "IFRA-compliant cosmetic grade solvents",
  "Extrait-grade concentration for lasting sillage",
  "Personally tested in Indian climate",
  "Formulations for Men, Women & Unisex",
  "Hand-poured and inspected in small batches",
  "100% Cruelty-Free, zero animal testing",
  "Fair, direct-to-consumer pricing",
];

export default async function AboutPage() {
  const testimonials = await getActiveTestimonials();
  const safeTestimonials = JSON.parse(JSON.stringify(testimonials));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#090807] text-ivory overflow-hidden pb-24 pt-10">
        {/* Subtle, warm ambient background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-[5%] left-[10%] h-[500px] w-[500px] rounded-full bg-gold-500/10 blur-[140px]" />
          <div className="absolute top-[40%] right-[5%] h-[550px] w-[550px] rounded-full bg-gold-400/8 blur-[150px]" />
          <div className="absolute bottom-[10%] left-[20%] h-[450px] w-[450px] rounded-full bg-gold-600/8 blur-[130px]" />
        </div>

        {/* ─── Hero Section: Clean & Confident ────────────────────────── */}
        <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-20 lg:pt-14 lg:pb-24">
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <p className="eyebrow justify-center mb-6">
                <span className="gold-line" />
                Robertsonpet, KGF
                <span className="gold-line" />
              </p>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] tracking-tight leading-[1.1] text-ivory font-light">
                The Art of Scent, <br />
                <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
                  Crafted Without Compromise.
                </span>
              </h1>

              <p className="mt-8 text-base sm:text-lg md:text-xl text-ivory/70 leading-relaxed font-light max-w-2xl mx-auto">
                Zaylune was built on a simple premise: a truly great fragrance should not cost a fortune. We hand-blend fine fragrances and luxury attars right here in Robertsonpet, KGF, and ship them to scent lovers across India.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                <Link
                  href="/shop"
                  className="btn-gold px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wider hover:scale-105 transition-all"
                >
                  Explore The Collection
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <a
                  href={whatsappLink(
                    "Hi Zaylune, I would love to explore your fragrances."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wider hover:border-gold-300 transition-all"
                >
                  Chat with Us
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Story Section: Honest & Human ──────────────────────────── */}
        <section className="relative py-16 sm:py-24 border-y border-ink-line/80 bg-ink-soft/30 backdrop-blur-sm">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left: Product / Studio Visual */}
              <div className="lg:col-span-5 flex justify-center">
                <Reveal className="group relative w-full max-w-[340px] sm:max-w-[380px]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-gold-400/25 bg-ink-soft shadow-2xl transition-all duration-500 hover:border-gold-300/50">
                    <Image
                      src="/about.png"
                      alt="Zaylune fragrance handcrafted in KGF"
                      fill
                      sizes="(max-width: 1024px) 85vw, 380px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle bottom vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Bottom caption */}
                    <div className="absolute inset-x-4 bottom-4 z-20 rounded-xl border border-white/10 bg-ink/90 p-4 backdrop-blur-md">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                        Hand-Poured Atelier
                      </p>
                      <p className="font-display text-sm sm:text-base text-ivory font-medium mt-0.5">
                        Zaylune Fragrances · KGF
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right: Authentic Story Copy */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <Reveal delay={100}>
                  <p className="eyebrow mb-3">Our Story</p>

                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory font-light">
                    A Story of Scent <br />
                    <span className="font-medium text-gold-200">and Simplicity.</span>
                  </h2>

                  <div className="mt-6 space-y-4 text-base sm:text-lg text-ivory/70 font-light leading-relaxed">
                    <p>
                      Zaylune started with a frustration that every perfume enthusiast shares: why should a memorable, rich scent cost ₹15,000 or more? Most of that money never goes into the perfume itself — it goes to celebrity sponsorships, marble retail rents, and middleman markups.
                    </p>
                    <p>
                      We set out to do things differently. We source genuine, imported fragrance oils and blend them with IFRA-certified cosmetic grade solvents at high concentrations. The result is pure, rich fragrance with impressive projection and staying power on skin.
                    </p>
                    <p>
                      Every single bottle is filled and checked by hand before dispatch. We believe in our products because we wear them ourselves every day.
                    </p>
                  </div>

                  {/* Location card */}
                  <div className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-ink-soft/60 border border-gold-400/15">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-gold-200 uppercase tracking-wider">
                        Rooted in Robertsonpet, KGF
                      </h4>
                      <p className="mt-1 text-sm text-ivory/60 leading-relaxed font-light">
                        Proudly formulated and dispatched from Robertsonpet, KGF, Karnataka. Carefully packed and shipped pan-India with dedicated customer support.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Quality & Craft: Clean 4-Column Grid ───────────────────── */}
        <section className="py-20 sm:py-28 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <p className="eyebrow justify-center mb-3">Our Standards</p>
              <h2 className="section-heading mt-2">
                What Goes Into Every Bottle
              </h2>
              <div className="w-16 h-px bg-gold-400/40 mx-auto mt-4" />
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CRAFT_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <Reveal key={pillar.title} delay={idx * 80}>
                    <div className="group h-full rounded-2xl border border-ink-line/80 bg-ink-soft/40 p-7 transition-all duration-300 hover:border-gold-400/30 hover:bg-ink-soft/70 hover:-translate-y-1 flex flex-col justify-between">
                      <div>
                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5 text-gold-300 group-hover:border-gold-300/40 transition-colors">
                          <Icon className="w-5 h-5" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display text-lg sm:text-xl text-ivory font-medium mb-2.5">
                          {pillar.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-ivory/60 font-light">
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
        <section className="py-12 sm:py-16 relative border-y border-ink-line/80 bg-ink-soft/20">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                {STATS.map((stat, idx) => (
                  <div key={stat.label} className="relative">
                    {idx > 0 && (
                      <div className="hidden sm:block absolute left-0 top-1/4 bottom-1/4 w-px bg-gold-400/10" />
                    )}
                    <p className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-ivory/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Why Choose Zaylune: Two-Column Commitment ──────────────── */}
        <section className="py-20 sm:py-28 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="eyebrow mb-3">The Zaylune Promise</p>
                  <h2 className="section-heading mt-2">
                    Why Choose <br />
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-400">
                      Zaylune
                    </span>
                  </h2>
                  <p className="mt-6 text-base sm:text-lg text-ivory/70 leading-relaxed font-light">
                    Every formulation choice we make — from the grade of oils we select to the atomizers we use — is made with one intention: delivering an extraordinary scent experience at an honest price.
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/shop"
                      className="btn-outline text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
                    >
                      Browse All Scents
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {ADVANTAGES.map((item, i) => (
                    <Reveal key={item} delay={i * 40}>
                      <div className="flex items-center gap-3.5 p-4 rounded-xl bg-ink-soft/40 border border-ink-line/80 hover:border-gold-400/20 transition-all">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm sm:text-base text-ivory/80 font-light">
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
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/20 bg-ink-soft/50 p-8 sm:p-14 md:p-18 text-center shadow-xl backdrop-blur-sm">
              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300">
                  <Quote className="w-6 h-6" />
                </div>

                <p className="font-display text-xl sm:text-2xl md:text-3xl text-ivory leading-relaxed font-light italic">
                  &ldquo;Fragrance is personal. We exist to make sure the scent you love is always within reach.&rdquo;
                </p>

                <div className="mt-6 h-px w-12 bg-gold-400/40" />

                <span className="font-display text-base uppercase tracking-widest text-gold-300 font-medium mt-4">
                  Zaylune Fragrances
                </span>
                <span className="text-xs text-ivory/40 font-light tracking-wide mt-1">
                  Robertsonpet, KGF · Karnataka
                </span>

                <div className="mt-8">
                  <Link
                    href="/shop"
                    className="btn-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-wider hover:scale-105 transition-all"
                  >
                    Shop Fragrances
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
