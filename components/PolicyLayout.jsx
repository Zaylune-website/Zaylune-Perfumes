import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FileText, Sparkles } from "lucide-react";

export default function PolicyLayout({ title, updated, icon: Icon = FileText, children }) {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] pb-24 pt-12 sm:pt-16 text-[#1c1109] selection:bg-[#a8451a]/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
          <div className="absolute top-[40%] right-[-10%] h-[550px] w-[550px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
          <div className="absolute bottom-[5%] left-[20%] h-[450px] w-[450px] rounded-full bg-[#8e3510]/[0.07] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <div className="text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8451a] shadow-2xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              Legal
            </span>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#a8451a]/25 bg-[#fde3cf]/60 text-[#c04a1c] shadow-sm">
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#1c1109] leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                {title}
              </span>
            </h1>
            <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent" />
            <p className="mt-5 inline-flex items-center rounded-full border border-[#a8451a]/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#2b1d12]/70">
              Last updated {updated}
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-[#a8451a]/20 bg-white/90 px-6 py-8 shadow-sm backdrop-blur-xl sm:px-10 sm:py-10">
            <div className="space-y-5 text-base leading-relaxed text-[#2b1d12]/85 [&_h2]:mt-9 [&_h2]:font-display [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#1c1109] [&_h2:first-child]:mt-0 [&_strong]:text-[#1c1109] [&_a]:font-semibold [&_a]:text-[#a8451a] [&_a]:underline [&_a]:underline-offset-4 [&_li::marker]:text-[#c04a1c]">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
