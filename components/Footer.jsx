import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Sparkles, ArrowUpRight } from "lucide-react";
import { whatsappLink, settingsToBrand } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";

const EXPLORE_LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact Atelier" },
  { href: "/account", label: "My Account" },
];

const POLICY_LINKS = [
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/refund", label: "Refund Policy" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms of Service" },
];

const BADGES = ["Extrait Concentration", "Small Batch", "100% Cruelty-Free"];

const linkClass =
  "group inline-flex items-center gap-1.5 text-base font-medium text-ivory/80 transition-colors duration-300 hover:text-gold-200";

function SocialLink({ href, label, Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-line bg-ink-soft/70 text-gold-200 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:bg-accent-gradient hover:text-[#fef2e6]"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export default async function Footer() {
  const dbSettings = (await getSiteSettings()) || {};
  const brandInfo = settingsToBrand(dbSettings);
  const hasSocial = [brandInfo.instagram, brandInfo.facebook, brandInfo.youtube].some((u) => u && u !== "#");

  return (
    <footer className="relative overflow-hidden border-t border-ink-line bg-ink-gradient text-ivory">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-[360px] w-[420px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute -right-24 bottom-0 h-[360px] w-[420px] rounded-full bg-gold-300/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-[1.02]">
              <Image
                src="/navbar-logo.png"
                alt={brandInfo.name || "Zaylune"}
                width={220}
                height={130}
                className="h-16 sm:h-18 w-auto object-contain"
              />
            </Link>

            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75">
              We believe great fragrances should be enjoyed by everyone. Every bottle is carefully hand-poured using
              concentrated extrait-grade oils and clean ingredients to deliver lasting luxury.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-ink-soft/70 px-3.5 py-1.5 text-xs font-semibold text-ivory/85 shadow-2xs"
                >
                  <Sparkles className="h-3 w-3 text-gold-200" />
                  {badge}
                </span>
              ))}
            </div>

            {brandInfo.address && (
              <div className="mt-6 flex items-start gap-2.5 max-w-sm text-sm font-medium leading-snug text-ivory/75">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-200" />
                <span>{brandInfo.address}</span>
              </div>
            )}

            {hasSocial && (
              <div className="mt-6 flex items-center gap-3">
                {brandInfo.instagram && brandInfo.instagram !== "#" && (
                  <SocialLink href={brandInfo.instagram} label="Instagram" Icon={Instagram} />
                )}
                {brandInfo.facebook && brandInfo.facebook !== "#" && (
                  <SocialLink href={brandInfo.facebook} label="Facebook" Icon={Facebook} />
                )}
                {brandInfo.youtube && brandInfo.youtube !== "#" && (
                  <SocialLink href={brandInfo.youtube} label="YouTube" Icon={Youtube} />
                )}
              </div>
            )}
          </div>

          {/* Explore */}
          <div className="col-span-1 lg:col-span-2 lg:pl-2">
            <p className="eyebrow">
              <span className="gold-line" /> Explore
            </p>
            <ul className="mt-6 space-y-3.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="col-span-1 lg:col-span-2">
            <p className="eyebrow">
              <span className="gold-line" /> Policies
            </p>
            <ul className="mt-6 space-y-3.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge */}
          <div className="col-span-2 lg:col-span-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-line bg-white/85 p-6 sm:p-7 shadow-sm backdrop-blur-xl">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
              />
              <p className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" /> Haute Concierge
              </p>
              <h4 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold leading-tight text-ivory">
                Need help choosing?
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">
                Our fragrance specialists are available on WhatsApp for direct recommendations.
              </p>

              <a
                href={whatsappLink("Hi Zaylune, I have a question about your fragrances.", brandInfo)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-6 w-full"
              >
                <Phone className="h-4 w-4" />
                Chat on WhatsApp
              </a>

              <p className="mt-3 text-center text-xs font-medium text-ivory/60">Instant WhatsApp replies · Mon – Sat</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-5 border-t border-ink-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-ivory">
              &copy; {new Date().getFullYear()} {brandInfo.name || "Zaylune Fragrances"}. All rights reserved.
            </p>
            <p className="text-ivory/65">
              Developed by{" "}
              <a
                href="https://nexa-solutions.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold-200 transition-colors hover:text-gold-300 hover:underline"
              >
                Nexa Solutions
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`mailto:${brandInfo.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/70 px-4 py-2 text-sm font-medium text-ivory/90 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-200"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-gold-200" />
              <span>{brandInfo.email}</span>
            </a>
            <a
              href={whatsappLink("", brandInfo)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/70 px-4 py-2 text-sm font-medium text-ivory/90 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-200"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-gold-200" />
              <span>{brandInfo.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
