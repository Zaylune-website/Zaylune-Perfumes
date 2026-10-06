"use client";

import { useState } from "react";
import { Mail, Phone, Copy, Check, ChevronDown, Clock, MapPin, Sparkles } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/constants";
import ContactForm from "./ContactForm";
import Reveal from "@/components/Reveal";

const FAQS = [
  {
    q: "How long do your perfumes last?",
    a: "Our perfumes usually last between 6 to 10 hours. Fresh and citrus scents last around 4 to 6 hours, while deeper woody and oud fragrances can easily last all day.",
  },
  {
    q: "Can you help me choose the right perfume?",
    a: "Yes! Tell us what kind of scents you like (woody, floral, fresh, or sweet) on WhatsApp or in the contact form, and we will happily suggest the best options for you.",
  },
  {
    q: "How long does shipping take?",
    a: "We pack and dispatch orders within 1 to 2 business days. Delivery across India usually takes 4 to 7 working days, and we send you tracking details as soon as your parcel ships.",
  },
  {
    q: "What if my bottle arrives broken or leaking?",
    a: "If your parcel arrives damaged or leaking, please send us a photo on WhatsApp within 48 hours. We will quickly send you a replacement or issue a full refund.",
  },
  {
    q: "Do you offer gift boxes or bulk orders?",
    a: "Yes, we prepare gift boxes and bulk orders for weddings, celebrations, and corporate gifts. Message us on WhatsApp to discuss quantities and special pricing.",
  },
  {
    q: "Are your attars alcohol-free?",
    a: "Yes, our pure attar oils are 100% alcohol-free and skin-friendly. None of our products are tested on animals.",
  },
  {
    q: "Can I cancel or change my order?",
    a: "You can change or cancel your order as long as it has not been shipped yet. Message us on WhatsApp with your order number as soon as possible.",
  },
  {
    q: "Where are you based?",
    a: "We are based in Robertsonpet, KGF, Karnataka, and we deliver to pin codes all across India.",
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
    <div className="mx-auto max-w-wrap px-5 sm:px-8 md:px-12 relative">

      {/* Hero Header */}
      <div className="relative mx-auto max-w-3xl text-center mb-10 sm:mb-14">
        <Reveal>
          {/* Status Pill */}
          <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-white/80 px-4 py-2 backdrop-blur-md shadow-xs mb-5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] sm:text-sm font-bold uppercase tracking-wide sm:tracking-wider text-[#a8451a]">
              Online Support · Fast WhatsApp Replies
            </span>
          </div>

          <h1 className="section-heading font-light tracking-tight">
            Get in <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">Touch</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#2b1d12]/85 max-w-2xl mx-auto font-normal leading-relaxed">
            Have a question about our perfumes or need help with your order? Send us a message or chat with us directly.
          </p>
        </Reveal>
      </div>

      {/* Main Grid Section: Balanced 5 / 7 Layout */}
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10 items-start">
        
        {/* Left Column: Direct Contact Information */}
        <div className="space-y-6 lg:col-span-5">
          
          {/* Card 1: Direct Channels */}
          <Reveal delay={80}>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#a8451a]/20 bg-white/85 p-6 sm:p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-[#a8451a]/40 hover:shadow-md">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8451a]/30 to-transparent" />
              
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/20 bg-[#a8451a]/10 px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                  <Sparkles className="h-3.5 w-3.5 text-[#a8451a]" /> Quick Contact
                </span>
                <span className="text-xs sm:text-sm text-[#2b1d12]/80 font-medium">Fast Replies</span>
              </div>

              {/* WhatsApp */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 sm:p-5 transition-all duration-300 hover:border-emerald-500/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                      <Phone className="h-6 w-6" />
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800">
                        WhatsApp Support
                      </span>
                      <p className="font-display text-base sm:text-lg font-bold text-[#1c1109]">
                        {BRAND.whatsappDisplay}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-col gap-3 border-t border-emerald-500/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-[#2b1d12]/80">Quick replies on WhatsApp</span>
                  <a
                    href={whatsappLink("Hi Zaylune, I have a question about your perfumes.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 sm:w-auto sm:py-2 text-sm font-semibold shadow-2xs transition-all hover:shadow-xs hover:-translate-y-0.5"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="mt-4 rounded-2xl border border-[#a8451a]/20 bg-[#fff9f4] p-4 sm:p-5 transition-all duration-300 hover:border-[#a8451a]/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e3510] to-[#a8451a] text-white shadow-xs">
                      <Mail className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                        Email Support
                      </span>
                      <p className="font-display text-sm sm:text-base font-bold text-[#1c1109] break-all">
                        {BRAND.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    title="Copy Email"
                    className="rounded-lg border border-[#a8451a]/20 bg-white p-2.5 text-[#2b1d12]/80 hover:border-[#a8451a] hover:text-[#8e3510] transition-all shrink-0 shadow-2xs"
                  >
                    {copiedEmail ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-3.5 flex flex-col gap-3 border-t border-[#a8451a]/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-[#2b1d12]/80">Order & general help</span>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#8e3510] hover:bg-[#a8451a] text-white px-5 py-2.5 sm:w-auto sm:py-2 text-sm font-semibold shadow-2xs transition-all hover:shadow-xs hover:-translate-y-0.5"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Hours & Location */}
          <Reveal delay={160}>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#a8451a]/20 bg-white/85 p-6 sm:p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-[#a8451a]/40 hover:shadow-md">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8451a]/30 to-transparent" />
              
              {/* Working Hours */}
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbe3d2] to-[#f4cfb6] border border-[#a8451a]/25 text-[#a8451a] shadow-xs">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                    Support Hours
                  </span>
                  <p className="font-display text-base sm:text-lg font-bold text-[#1c1109] mt-0.5">
                    Monday – Saturday: 10:00 AM – 7:00 PM
                  </p>
                  <p className="text-sm text-[#2b1d12]/80 mt-1 leading-relaxed">
                    Messages received at night or on Sundays are answered the next morning.
                  </p>
                </div>
              </div>

              {/* Physical Location */}
              <div className="mt-5 pt-5 border-t border-[#a8451a]/15 flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbe3d2] to-[#f4cfb6] border border-[#a8451a]/25 text-[#a8451a] shadow-xs">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
                    Store Location
                  </span>
                  <p className="text-sm sm:text-base text-[#2b1d12]/90 font-medium mt-0.5 leading-snug">
                    No.1598 Station Road, 4th Block, Robertsonpet Town, KGF, Karnataka — 563122
                  </p>
                </div>
              </div>

              {/* Reassurance Badges */}
              <div className="mt-5 pt-4 border-t border-[#a8451a]/15 flex flex-wrap gap-2.5">
                {["Small Batch", "Cruelty-Free", "Pan-India Delivery"].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/20 bg-white/80 px-3 py-1.5 text-xs sm:px-3.5 sm:text-sm font-semibold text-[#2b1d12]/90"
                  >
                    <Sparkles className="h-3 w-3 text-[#c04a1c]" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

        </div>

        {/* Right Column: Contact Form (7 Cols on LG) */}
        <div className="lg:col-span-7">
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>

      </div>

      {/* Map Section */}
      <div className="mt-16 sm:mt-24">
        <Reveal>
          {/* Map Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#c04a1c]" />
              <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#a8451a]">
                Visit Us
              </span>
              <Sparkles className="h-4 w-4 text-[#c04a1c]" />
            </div>
            <h2 className="section-heading font-light">
              Our Location in <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">Robertsonpet, KGF</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
              Drop by our store to explore our fragrances in person or get personalized scent recommendations.
            </p>
          </div>

          {/* Luxury Map Container */}
          <div className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[3rem] border border-[#a8451a]/25 bg-white/90 p-3 sm:p-4 shadow-xl backdrop-blur-md">
            {/* Top Hairline Accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent z-10" />

            <div className="relative flex w-full flex-col overflow-hidden rounded-[1.75rem] sm:block sm:h-[460px] sm:rounded-[2.5rem]">
              <iframe
                title="Zaylune Fragrances Store Location"
                src="https://maps.google.com/maps?q=Robertsonpet,%20KGF,%20Karnataka%20563122&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-[260px] w-full border-0 filter contrast-[1.02] saturate-[0.9] sm:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Location Card — stacked below the map on mobile, floating over it on larger screens */}
              <div className="relative m-2.5 rounded-2xl border border-[#a8451a]/25 bg-white/95 p-4 shadow-lg backdrop-blur-md sm:absolute sm:bottom-6 sm:left-6 sm:m-0 sm:max-w-md sm:rounded-3xl sm:p-6">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8e3510] to-[#a8451a] text-white shadow-xs sm:h-11 sm:w-11">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display text-base sm:text-lg font-bold text-[#1c1109]">
                      Zaylune Fragrances
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-[#2b1d12]/85 leading-snug">
                      No.1598 Station Road, 4th Block, Robertsonpet Town, KGF, Karnataka — 563122
                    </p>
                  </div>
                </div>
                <div className="mt-3.5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
                  <a
                    href="https://maps.google.com/?q=Robertsonpet+KGF+Karnataka+563122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-3 py-2 text-xs sm:px-5 sm:text-sm font-semibold text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    Get Directions
                  </a>
                  <a
                    href={whatsappLink("Hi Zaylune, I would like to visit your store in Robertsonpet KGF.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[#a8451a]/25 bg-white px-3 py-2 text-xs sm:px-4 sm:text-sm font-semibold text-[#a8451a] hover:bg-[#a8451a] hover:text-white transition-all"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 sm:mt-24 border-t border-[#a8451a]/15 pt-14 sm:pt-20">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#c04a1c]" />
            <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#a8451a]">
              FAQs
            </span>
            <Sparkles className="h-4 w-4 text-[#c04a1c]" />
          </div>
          <h2 className="section-heading font-light">
            Frequently Asked <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">Questions</span>
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
            Quick answers to common questions about our perfumes, shipping, and returns.
          </p>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Reveal key={idx} delay={idx * 50}>
                <div
                  className={`overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 backdrop-blur-md ${
                    isOpen
                      ? "border-[#a8451a]/40 bg-white/95 shadow-md"
                      : "border-[#a8451a]/20 bg-white/80 hover:border-[#a8451a]/35 hover:bg-white/90 shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 pr-3">
                      <span
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full font-display text-xs sm:text-sm font-bold transition-all duration-300 ${
                          isOpen
                            ? "bg-gradient-to-r from-[#8e3510] to-[#a8451a] text-white shadow-xs"
                            : "bg-[#a8451a]/10 text-[#a8451a]"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-base sm:text-lg font-bold text-[#1c1109]">
                        {faq.q}
                      </span>
                    </div>
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 border-[#a8451a] bg-[#a8451a] text-white"
                          : "border-[#a8451a]/25 bg-white/80 text-[#a8451a]"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#a8451a]/15 px-5 sm:px-6 pb-5 pt-3.5 text-base sm:text-[17px] leading-relaxed text-[#2b1d12]/85 font-normal">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

    </div>
  );
}
