"use client";

import { useState } from "react";
import { Mail, Phone, Copy, Check, ChevronDown, Clock, Instagram, Facebook, Youtube } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/constants";
import ContactForm from "./ContactForm";
import Reveal from "@/components/Reveal";

const FAQS = [
  {
    q: "How long do Zaylune fragrances last?",
    a: "Longevity depends on the fragrance family. Fresh and citrus scents typically last 4–6 hours, while our woody, amber, oud, and sweet fragrances can last 8–10 hours or more. We use IFRA-compliant premium fragrance oils to ensure consistent performance.",
  },
  {
    q: "Can you help me choose the right fragrance?",
    a: "Absolutely! Just tell us what kind of scents you enjoy — woody, floral, sweet, musky, or oud-based — and whether it's for daily wear or a special occasion. Message us on WhatsApp or fill the form above and we'll give you a personalised recommendation.",
  },
  {
    q: "How fast do you ship and what are the charges?",
    a: "Orders are processed within 1–2 business days and delivered within 4–7 business days across India. Shipping is free on prepaid orders above the threshold shown at checkout. A flat fee applies below that, and COD orders carry a small handling charge.",
  },
  {
    q: "What is your return and refund policy?",
    a: "Since fragrances are personal care products, we cannot accept returns on opened bottles. However, if your order arrives damaged, leaking, or incorrect, contact us within 48 hours of delivery with photos and we will arrange a free replacement or full refund.",
  },
  {
    q: "Do you offer gift sets or bulk orders for events?",
    a: "Yes! We offer curated gift sets perfect for weddings, corporate gifting, and festive occasions. For bulk orders (10+ bottles), reach out to us via WhatsApp or the contact form for special pricing and custom packaging options.",
  },
  {
    q: "Are Zaylune fragrances cruelty-free?",
    a: "Yes, every Zaylune fragrance is 100% cruelty-free. We never test on animals and use only IFRA-certified, ethically sourced ingredients.",
  },
  {
    q: "Can I cancel or modify my order after placing it?",
    a: "Orders can be cancelled or modified any time before they are dispatched. Once the parcel is with our courier partner, changes are no longer possible. Message us immediately on WhatsApp with your order number for the fastest response.",
  },
  {
    q: "Where is Zaylune based and do you ship pan-India?",
    a: "We are proudly based in Robertsonpet, KGF, Karnataka. We ship to all serviceable pin codes across India through our trusted courier partners.",
  },
];

export default function ContactContent() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(BRAND.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="mx-auto max-w-wrap px-6 md:px-12 relative">

      {/* Hero Header */}
      <div className="relative mx-auto max-w-3xl text-center mb-10 sm:mb-16">
        <Reveal>
          {/* Status Pill */}
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold-400/20 bg-ink-soft/80 px-3 sm:px-4 py-1.5 backdrop-blur-md mb-6">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-wide sm:tracking-wider text-ivory/80">
              Support Desk Active <span className="mx-1 text-gold-400/40">•</span> Usually replies in &lt; 2 hrs
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory leading-none">
            Contact <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Us</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ivory/60 max-w-xl mx-auto font-light leading-relaxed">
            Have questions about our perfumes, gift packs, or need help choosing a scent? We are here to help you.
          </p>
        </Reveal>
      </div>

      {/* Main Grid Section */}
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        
        {/* Left Column: Direct Channels & Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-5">
          
          {/* Email Card */}
          <Reveal delay={80} className="h-full">
            <div className="group relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md transition-all duration-500 hover:border-gold-400/35 hover:shadow-[0_0_30px_rgba(212,163,89,0.06)] hover:-translate-y-1 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/20 group-hover:scale-105 transition-transform duration-500">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">
                      Email Us
                    </span>
                    <p className="font-display mt-0.5 text-lg sm:text-xl text-ivory group-hover:text-gold-200 transition-colors break-all">
                      {BRAND.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  title="Copy Email"
                  className="rounded-xl border border-ink-line bg-ink/60 p-2.5 text-ivory/60 hover:border-gold-400/40 hover:text-gold-200 transition-all shrink-0"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-ink-line/50 pt-4 text-base text-ivory/50">
                <span>For questions & support</span>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="inline-flex items-center gap-1 text-gold-300 hover:text-gold-200 font-medium"
                >
                  Send email
                </a>
              </div>
            </div>
          </Reveal>

          {/* WhatsApp Card */}
          <Reveal delay={120} className="h-full">
            <a
              href={whatsappLink("Greetings Zaylune Concierge, I would like to inquire about your fragrances.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)] hover:-translate-y-1 h-full flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      WhatsApp Support
                    </span>
                    <p className="font-display mt-0.5 text-lg sm:text-xl text-ivory group-hover:text-emerald-200 transition-colors break-all">
                      {BRAND.whatsappDisplay}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-ink-line/50 pt-4 text-base text-ivory/50">
                <span>Quick help & chat</span>
                <span className="text-emerald-400 font-medium group-hover:underline">Chat now</span>
              </div>
            </a>
          </Reveal>

          {/* Business Hours */}
          <Reveal delay={200} className="h-full">
            <div className="rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md hover:-translate-y-1 transition-all duration-500 hover:border-gold-400/20 hover:shadow-[0_0_30px_rgba(212,163,89,0.04)] h-full flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/20">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ivory/40">
                    Support Hours
                  </span>
                  <p className="font-display mt-0.5 text-lg text-ivory">Mon – Sat, 10 AM – 7 PM IST</p>
                </div>
              </div>
              <p className="mt-4 text-lg sm:text-xl leading-relaxed text-ivory/60 font-light">
                If you message us outside these hours, we will get back to you the next morning.
              </p>
            </div>
          </Reveal>

          {/* Follow Us */}
          <Reveal delay={280} className="h-full">
            <div className="rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md hover:-translate-y-1 transition-all duration-500 hover:border-gold-400/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-ivory/50 block mb-4">Follow Us</span>
              <div className="flex items-center gap-3">
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-line text-ivory/60 transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-300 bg-ink/30"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a
                  href={BRAND.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-line text-ivory/60 transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-300 bg-ink/30"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
                <a
                  href={BRAND.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-line text-ivory/60 transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:text-gold-300 bg-ink/30"
                >
                  <Youtube className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>
          </Reveal>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>

      </div>

      {/* FAQ Section */}
      <div className="mt-16 sm:mt-28 border-t border-ink-line/80 pt-14 sm:pt-20">
        <Reveal className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3 block">
            FAQs
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Reveal key={idx} delay={idx * 80}>
                <div
                  className="overflow-hidden rounded-[1.5rem] border border-ink-line bg-ink-soft/40 backdrop-blur-sm transition-all duration-300 hover:border-gold-400/20"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-ink-soft/80"
                  >
                    <span className="font-display text-lg sm:text-xl text-ivory font-medium pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 shrink-0 text-gold-300 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-gold-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-lg sm:text-xl leading-relaxed text-ivory/60 font-light border-t border-ink-line/30 pt-4 animate-fadeUp">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

    </div>
  );
}
