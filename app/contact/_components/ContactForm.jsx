"use client";

import { useActionState, useState } from "react";
import { submitInquiry } from "@/actions/contact";
import { PHONE_PATTERN, keepDigits } from "@/lib/phone";
import { CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

const INQUIRY_TOPICS = [
  { id: "recommendation", label: "Help Choosing a Scent" },
  { id: "bespoke", label: "Gift Sets & Bulk" },
  { id: "order", label: "Order Status" },
  { id: "general", label: "General Question" },
];

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, {});
  const [selectedTopic, setSelectedTopic] = useState("recommendation");
  const [message, setMessage] = useState("");

  if (state.success) {
    return (
      <div className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[2.75rem] border border-[#a8451a]/25 bg-white/90 p-8 sm:p-12 text-center shadow-lg backdrop-blur-md animate-fadeUp">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-500/25 text-emerald-700 shadow-xs">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800">
          Message Sent
        </div>
        <h3 className="font-display mt-3 text-2xl sm:text-3xl font-bold text-[#1c1109]">
          Thank You!
        </h3>
        <p className="mx-auto mt-3 max-w-md text-base sm:text-lg leading-relaxed text-[#2b1d12]/85 font-normal">
          We have received your message and will get back to you soon.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-[#a8451a]/30 bg-white/80 px-8 py-3.5 text-sm sm:text-base font-semibold uppercase tracking-wider text-[#a8451a] hover:border-[#a8451a] hover:bg-[#a8451a] hover:text-white transition-all shadow-xs"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[2.75rem] border border-[#a8451a]/25 bg-white/90 p-6 sm:p-10 shadow-lg backdrop-blur-md hover:border-[#a8451a]/40 transition-all duration-300">
      {/* Top Hairline Accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/20 bg-[#a8451a]/10 px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]">
            <Sparkles className="h-3.5 w-3.5 text-[#a8451a]" /> Message Form
          </span>
          <span className="text-sm text-[#2b1d12]/80 font-medium">
            · Usually replies in a few hours
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1c1109] leading-tight">
          How Can We Help?
        </h3>
        <p className="mt-2 text-base sm:text-lg text-[#2b1d12]/85 leading-relaxed font-normal">
          Leave your details below and we will get back to you.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {state.error && (
          <div className="rounded-2xl border border-red-500/25 bg-red-50 p-4 text-base text-red-700 flex items-center gap-2 animate-fadeUp">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            {state.error}
          </div>
        )}

        {/* Topic Pills */}
        <div>
          <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider text-[#2b1d12]/85 mb-2.5">
            What is this about?
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {INQUIRY_TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                className={`rounded-2xl sm:rounded-full px-3 py-2.5 sm:px-5 text-[13px] sm:text-base leading-snug text-center font-medium sm:whitespace-nowrap transition-all duration-300 ${
                  selectedTopic === topic.id
                    ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] text-white font-semibold shadow-xs sm:scale-[1.02]"
                    : "border border-[#a8451a]/25 bg-white/80 text-[#2b1d12]/85 hover:border-[#a8451a]/40 hover:text-[#1c1109]"
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
          <input
            type="hidden"
            name="topic"
            value={INQUIRY_TOPICS.find((t) => t.id === selectedTopic)?.label || ""}
          />
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider text-[#2b1d12]/85 mb-2">
              Your Name <span className="text-[#a8451a]">*</span>
            </label>
            <input
              required
              name="name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-2xl border border-[#a8451a]/20 bg-white/80 px-4 sm:px-5 py-3.5 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 transition-all duration-300 focus:border-[#a8451a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 hover:border-[#a8451a]/40"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider text-[#2b1d12]/85 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-[#a8451a]/20 bg-white/80 px-4 sm:px-5 py-3.5 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 transition-all duration-300 focus:border-[#a8451a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 hover:border-[#a8451a]/40"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider text-[#2b1d12]/85 mb-2">
                Phone or WhatsApp
              </label>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern={PHONE_PATTERN}
                title="Enter a valid 10-digit mobile number starting with 6-9"
                onInput={(e) => (e.currentTarget.value = keepDigits(e.currentTarget.value))}
                placeholder="10-digit mobile number"
                className="w-full rounded-2xl border border-[#a8451a]/20 bg-white/80 px-4 sm:px-5 py-3.5 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 transition-all duration-300 focus:border-[#a8451a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 hover:border-[#a8451a]/40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <label className="text-sm sm:text-base font-semibold uppercase tracking-wider text-[#2b1d12]/85">
                Your Message <span className="text-[#a8451a]">*</span>
              </label>
              <span className="shrink-0 whitespace-nowrap text-xs sm:text-sm text-[#2b1d12]/70 font-medium">
                {message.length} / 500
              </span>
            </div>
            <textarea
              required
              name="message"
              rows={4}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you need help with..."
              className="w-full rounded-2xl border border-[#a8451a]/20 bg-white/80 px-4 sm:px-5 py-3.5 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 transition-all duration-300 focus:border-[#a8451a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 resize-none hover:border-[#a8451a]/40"
            />
          </div>
        </div>

        {/* Submit Button - Centered Text, Shimmer Sweep, No Arrows */}
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-10 py-4 font-display text-base sm:text-lg font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          {pending ? (
            <span className="relative z-10 inline-flex items-center gap-2.5">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            <span className="relative z-10 inline-flex items-center">
              Send Message
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
