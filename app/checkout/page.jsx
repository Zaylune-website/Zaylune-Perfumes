import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CheckoutForm from "./_components/CheckoutForm";
import { isRazorpayEnabled } from "@/actions/checkout";
import { getShippingSettings } from "@/actions/admin/shipping";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getBundleSettings } from "@/actions/bundle";
import { isCodEnabled, isOnlinePaymentEnabled } from "@/actions/settings";
import { getPublicCouponHints } from "@/actions/checkout";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function CheckoutPage() {
  const [razorpayConfigured, shipping, quantityDiscount, bundleSettings, codEnabled, onlinePaymentEnabled, couponHints] = await Promise.all([
    isRazorpayEnabled(),
    getShippingSettings(),
    getQuantityDiscountSettings(),
    getBundleSettings(),
    isCodEnabled(),
    isOnlinePaymentEnabled(),
    getPublicCouponHints(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] pb-24 sm:pb-32 pt-8 sm:pt-12 selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        {/* Ambient luxury background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#8e3510]/[0.07] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 z-10">
          <Reveal className="mb-10 sm:mb-14 border-b border-[#a8451a]/15 pb-8 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#a8451a]/25 bg-white/85 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs backdrop-blur-md mb-4">
              <ShieldCheck className="w-4 h-4 text-[#c04a1c]" />
              Safe &amp; Encrypted Checkout
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] text-[#1c1109]">
              Secure{" "}
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                Checkout
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-[#2b1d12]/85 font-normal max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              Complete your details below to place your order — we'll confirm everything with you on WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <CheckoutForm
              codEnabled={codEnabled}
              razorpayEnabled={razorpayConfigured && onlinePaymentEnabled}
              shipping={shipping}
              quantityDiscount={quantityDiscount}
              bundleSettings={bundleSettings}
              couponHints={couponHints}
            />
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
