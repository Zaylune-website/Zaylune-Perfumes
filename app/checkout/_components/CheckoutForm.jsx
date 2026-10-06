"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { Banknote, CreditCard, CheckCircle2, Check, Minus, Plus, ShoppingBag, Sparkles, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { processCheckout, verifyRazorpayPayment, validateCoupon } from "@/actions/checkout";
import { calculateQuantityDiscount, calculateBundleDiscount, nonBundleCartQuantity } from "@/lib/constants";
import { fireConfetti } from "@/lib/confetti";

const inputClass =
  "w-full rounded-2xl border border-[#a8451a]/25 bg-white px-5 py-3.5 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 transition-all duration-300 focus:border-[#a8451a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 shadow-2xs hover:border-[#a8451a]/45";
const labelClass = "mb-2 block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a]";

export default function CheckoutForm({ codEnabled, razorpayEnabled, shipping, quantityDiscount, bundleSettings, couponHints = [] }) {
  const { cart, cartSubtotal, cartCount, clearCart, updateQuantity } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(codEnabled ? "COD" : razorpayEnabled ? "RAZORPAY" : null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Celebrate once, when the order is confirmed (COD placed, or Razorpay verified).
  useEffect(() => {
    if (confirmedOrder) fireConfetti();
  }, [confirmedOrder]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [errors, setErrors] = useState({});

  const shippingCost = cartSubtotal >= shipping.free_threshold ? 0 : shipping.flat_rate;
  const codCost = paymentMethod === "COD" ? shipping.cod_charge : 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const nonBundleQty = nonBundleCartQuantity(cart);
  const qtyDiscount = calculateQuantityDiscount(nonBundleQty, quantityDiscount);
  const bundleDiscount = calculateBundleDiscount(cart, bundleSettings);
  const total = Math.max(0, cartSubtotal + shippingCost + codCost - couponDiscount - qtyDiscount - bundleDiscount);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setApplyingCoupon(true);
    const result = await validateCoupon(couponInput, cartSubtotal);
    setApplyingCoupon(false);
    if (!result.valid) {
      showToast(result.error || "Invalid coupon.", "error");
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({ code: couponInput.toUpperCase(), discountAmount: result.discountAmount });
    showToast("Coupon applied!");
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length === 12 && val.startsWith("91")) {
      val = val.slice(2);
    } else if (val.length === 11 && val.startsWith("0")) {
      val = val.slice(1);
    }
    val = val.slice(0, 10);
    setForm((f) => ({ ...f, phone: val }));

    if (errors.phone) {
      if (val.length === 10 && /^[6-9][0-9]{9}$/.test(val)) {
        setErrors((err) => ({ ...err, phone: "" }));
      }
    }
  };

  const handlePhoneBlur = () => {
    const val = (form.phone || "").replace(/\D/g, "");
    if (!val) {
      setErrors((err) => ({ ...err, phone: "Phone number is required." }));
    } else if (val.length < 10) {
      setErrors((err) => ({ ...err, phone: `Phone number must be exactly 10 digits (${val.length}/10 entered).` }));
    } else if (!/^[6-9][0-9]{9}$/.test(val)) {
      setErrors((err) => ({ ...err, phone: "Enter a valid 10-digit mobile number starting with 6-9." }));
    } else {
      setErrors((err) => ({ ...err, phone: "" }));
    }
  };

  const handlePostalCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((f) => ({ ...f, postalCode: val }));
    if (errors.postalCode && val.length === 6) {
      setErrors((err) => ({ ...err, postalCode: "" }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!form.fullName || form.fullName.trim().length < 3 || !/^[a-zA-Z\s]*$/.test(form.fullName)) {
      tempErrors.fullName = "Name must only contain letters and spaces (min. 3 characters).";
    }
    const cleanPhone = (form.phone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      tempErrors.phone = "Phone number is required.";
    } else if (cleanPhone.length !== 10) {
      tempErrors.phone = `Phone number must be exactly 10 digits (${cleanPhone.length}/10 entered).`;
    } else if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      tempErrors.phone = "Enter a valid 10-digit mobile number starting with 6-9.";
    }
    if (!form.addressLine1 || form.addressLine1.trim() === "") {
      tempErrors.addressLine1 = "Address is required.";
    }
    if (!form.city || form.city.trim() === "") {
      tempErrors.city = "City is required.";
    }
    if (!form.state || form.state.trim() === "") {
      tempErrors.state = "State is required.";
    }
    if (!form.postalCode || !/^[0-9]{6}$/.test(form.postalCode)) {
      tempErrors.postalCode = "Enter a valid 6-digit postal code.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // Clear error on change
    if (errors[key]) {
      setErrors((err) => ({ ...err, [key]: "" }));
    }
  };

  const cartForServer = () =>
    cart.map((i) => ({
      variantId: i.variantId,
      productId: i.productId,
      name: i.name,
      variantName: i.variantName,
      price: i.price,
      quantity: i.quantity,
      bundleGroupId: i.bundleGroupId,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!paymentMethod) {
      showToast("No payment method is available right now.", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    setSubmitting(true);
    const result = await processCheckout(form, cartForServer(), paymentMethod, appliedCoupon?.code);
    setSubmitting(false);

    if (!result.success) {
      showToast(result.error || "Something went wrong. Please try again.", "error");
      return;
    }

    if (result.isRazorpay) {
      openRazorpay(result);
      return;
    }

    clearCart();
    setConfirmedOrder({ orderNumber: result.orderNumber });
  };

  const openRazorpay = (result) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      showToast("Payment gateway is still loading — please try again in a moment.", "error");
      return;
    }

    const rzp = new window.Razorpay({
      key: result.razorpayKeyId,
      amount: result.amount,
      currency: "INR",
      name: "Zaylune",
      description: `Order ${result.orderNumber}`,
      order_id: result.razorpayOrderId,
      handler: async (response) => {
        const verify = await verifyRazorpayPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          result.orderId
        );
        if (verify.success) {
          clearCart();
          setConfirmedOrder({ orderNumber: result.orderNumber, paymentId: verify.razorpayPaymentId });
        } else {
          showToast(verify.error || "Payment verification failed.", "error");
        }
      },
      theme: { color: "#c04a1c" },
    });
    rzp.open();
  };

  if (confirmedOrder) {
    const burstDots = [
      { x: -96, y: -64, d: 0, c: "#d4a359" },
      { x: 96, y: -64, d: 80, c: "#c04a1c" },
      { x: -128, y: 8, d: 160, c: "#d4a359" },
      { x: 128, y: 8, d: 120, c: "#c04a1c" },
      { x: -64, y: -112, d: 200, c: "#e69854" },
      { x: 64, y: -112, d: 40, c: "#d4a359" },
      { x: 0, y: -128, d: 240, c: "#c04a1c" },
      { x: -104, y: 56, d: 280, c: "#e69854" },
      { x: 104, y: 56, d: 320, c: "#d4a359" },
    ];

    return (
      <div className="order-success-anim relative overflow-hidden rounded-[2.5rem] border border-[#a8451a]/25 bg-white/90 px-8 sm:px-16 pt-10 sm:pt-14 pb-12 sm:pb-18 text-center shadow-xl backdrop-blur-xl animate-fadeUp">
        <style>{`
          @keyframes osPopIn { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
          @keyframes osHalo { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes osBurst { 0% { transform: translate(0, 0) scale(0.2); opacity: 1; } 70% { opacity: 1; } 100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; } }
          @keyframes osLetter { 0% { opacity: 0; transform: translateY(0.7em) scale(0.85); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes osRise { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes osShine { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
          @keyframes osBar { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
          @media (prefers-reduced-motion: reduce) {
            .order-success-anim, .order-success-anim * { animation: none !important; }
          }
        `}</style>

        <div className="pointer-events-none absolute -left-20 -top-20 w-72 h-72 rounded-full bg-[#c04a1c]/[0.08] blur-[100px]" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-[#d4a359]/[0.10] blur-[100px]" />

        <div className="relative z-10">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-emerald-500/50"
              style={{ animation: "osHalo 1.8s ease-out 0.5s infinite" }}
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-emerald-500/40"
              style={{ animation: "osHalo 1.8s ease-out 1.4s infinite" }}
            />
            {burstDots.map((dot, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute left-1/2 top-1/2 h-2 w-2 -ml-1 -mt-1 rounded-full"
                style={{
                  background: dot.c,
                  "--x": `${dot.x}px`,
                  "--y": `${dot.y}px`,
                  animation: `osBurst 1.1s cubic-bezier(.22,1,.36,1) ${300 + dot.d}ms both`,
                }}
              />
            ))}
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-50 text-emerald-600 shadow-md"
              style={{ animation: "osPopIn 0.7s cubic-bezier(.34,1.56,.64,1) 0.15s both" }}
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-600 stroke-[2.5]" />
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50/80 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 mb-4 shadow-2xs"
            style={{ animation: "osRise 0.6s cubic-bezier(.22,1,.36,1) 0.45s both" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Order Confirmed</span>
          </div>

          <h2 className="font-display text-[2.75rem] leading-tight sm:text-6xl font-extrabold text-[#1c1109] whitespace-nowrap">
            {"Thank".split("").map((ch, i) => (
              <span
                key={`a${i}`}
                className="inline-block"
                style={{ animation: `osLetter 0.6s cubic-bezier(.22,1,.36,1) ${600 + i * 70}ms both` }}
              >
                {ch}
              </span>
            ))}
            <span className="inline-block" style={{ width: "0.3em" }} />
            <span>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]" style={{ animation: "osLetter 0.6s cubic-bezier(.22,1,.36,1) 1000ms both" }}>You!</span>
            </span>
          </h2>
          <div
            className="mx-auto mt-4 h-1.5 w-24 origin-center rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent"
            style={{ animation: "osBar 0.8s cubic-bezier(.22,1,.36,1) 1.3s both" }}
          />

          <p
            className="mt-6 text-base sm:text-xl text-[#2b1d12]/90 font-normal max-w-xl mx-auto leading-relaxed"
            style={{ animation: "osRise 0.7s cubic-bezier(.22,1,.36,1) 1.4s both" }}
          >
            Your order{" "}
            <span className="relative inline align-baseline">
              <span className="font-bold text-[#c04a1c] select-all">{confirmedOrder.orderNumber}</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                style={{ animation: "osShine 1.4s ease-in-out 1.9s both" }}
              />
            </span>{" "}
            has been placed successfully.
          </p>
          {confirmedOrder.paymentId && (
            <p
              className="mt-2 text-sm text-[#2b1d12]/70 font-medium"
              style={{ animation: "osRise 0.7s cubic-bezier(.22,1,.36,1) 1.6s both" }}
            >
              Payment ID: <span className="font-mono font-bold text-[#1c1109] select-all">{confirmedOrder.paymentId}</span>
            </p>
          )}

          <div className="mt-8 sm:mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/shop"
              style={{ animation: "osRise 0.6s cubic-bezier(.22,1,.36,1) 1.8s both" }}
              className="w-full sm:w-auto whitespace-nowrap rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] px-6 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-base font-bold uppercase tracking-wider text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account"
              style={{ animation: "osRise 0.6s cubic-bezier(.22,1,.36,1) 1.95s both" }}
              className="w-full sm:w-auto whitespace-nowrap rounded-full border-2 border-[#a8451a]/30 bg-white/90 px-6 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-base font-bold uppercase tracking-wider text-[#a8451a] shadow-xs hover:border-[#a8451a] hover:bg-white active:scale-95 transition-all text-center"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-3xl border border-[#a8451a]/20 bg-white/85 p-12 sm:p-16 text-center shadow-sm backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white to-[#fde3cf] border border-[#a8451a]/25 shadow-lg">
          <ShoppingBag className="h-10 w-10 text-[#c04a1c]" />
        </div>
        <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109]">Your bag is empty</p>
        <p className="mt-2 text-base text-[#2b1d12]/75 max-w-sm mx-auto">
          Add some of our artisan fragrances to your bag before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] px-9 py-4 text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Explore Fragrances
        </Link>
      </div>
    );
  }

  return (
    <>
      {razorpayEnabled && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-[1fr_400px] items-start">
        {/* Left Form: Shipping Details & Payment */}
        <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-[#a8451a]/20 bg-white/85 p-5 sm:p-8 lg:p-10 shadow-sm backdrop-blur-xl space-y-6 sm:space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              <span>Delivery Address</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109]">
              Shipping Details
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent mb-6" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input 
                  required 
                  placeholder="e.g. Rahul Sharma" 
                  value={form.fullName} 
                  onChange={update("fullName")} 
                  minLength={3}
                  pattern="^[a-zA-Z\s]*$"
                  title="Name must only contain letters and spaces, at least 3 characters."
                  className={inputClass} 
                />
                {errors.fullName && <p className="text-rose-600 text-sm font-semibold mt-1.5">{errors.fullName}</p>}
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <input 
                    required 
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-Digit Mobile Number" 
                    value={form.phone} 
                    onChange={handlePhoneChange} 
                    onBlur={handlePhoneBlur}
                    maxLength={10}
                    className={`${inputClass} ${errors.phone ? "!border-rose-500 !ring-rose-500/20" : ""}`} 
                  />
                  {form.phone && form.phone.length > 0 && (
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold pointer-events-none select-none ${
                      form.phone.length === 10 ? "text-emerald-700" : "text-[#a8451a]/60"
                    }`}>
                      {form.phone.length}/10
                    </span>
                  )}
                </div>
                {errors.phone && <p className="text-rose-600 text-sm font-semibold mt-1.5">{errors.phone}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Address Line 1</label>
              <input 
                required 
                placeholder="Flat, House no., Building, Street, Area" 
                value={form.addressLine1} 
                onChange={update("addressLine1")} 
                className={inputClass} 
              />
              {errors.addressLine1 && <p className="text-rose-600 text-sm font-semibold mt-1.5">{errors.addressLine1}</p>}
            </div>
            
            <div className="mt-4">
              <label className={labelClass}>Address Line 2 (Optional)</label>
              <input 
                placeholder="Landmark, Suite, Unit, etc." 
                value={form.addressLine2} 
                onChange={update("addressLine2")} 
                className={inputClass} 
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>City</label>
                <input 
                  required 
                  placeholder="City" 
                  value={form.city} 
                  onChange={update("city")} 
                  className={inputClass} 
                />
                {errors.city && <p className="text-rose-600 text-sm font-semibold mt-1.5">{errors.city}</p>}
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input 
                  required 
                  placeholder="State" 
                  value={form.state} 
                  onChange={update("state")} 
                  className={inputClass} 
                />
                {errors.state && <p className="text-rose-600 text-sm font-semibold mt-1.5">{errors.state}</p>}
              </div>
              <div>
                <label className={labelClass}>PIN Code</label>
                <input 
                  required 
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit PIN" 
                  value={form.postalCode} 
                  onChange={handlePostalCodeChange} 
                  maxLength={6}
                  className={`${inputClass} ${errors.postalCode ? "!border-rose-500 !ring-rose-500/20" : ""}`} 
                />
                {errors.postalCode && <p className="text-rose-600 text-sm font-semibold mt-1.5">{errors.postalCode}</p>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#a8451a]/15">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              <span>Payment Option</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109]">
              Payment Method
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {codEnabled && (
                <label
                  className={`group relative flex cursor-pointer items-start gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                    paymentMethod === "COD"
                      ? "border-2 border-[#c04a1c] bg-gradient-to-br from-white to-[#fff8f2] shadow-md ring-2 ring-[#c04a1c]/15"
                      : "border border-[#a8451a]/20 bg-white/70 hover:border-[#a8451a]/40 hover:bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="sr-only"
                  />
                  
                  {/* Custom Radio Ring */}
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    paymentMethod === "COD" ? "border-[#c04a1c] bg-gradient-to-br from-[#8e3510] to-[#c04a1c]" : "border-[#a8451a]/30 bg-white"
                  }`}>
                    <Check className={`h-3 w-3 text-white transition-all duration-300 ${paymentMethod === "COD" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} strokeWidth={3} />
                  </div>

                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-3.5">
                    <span className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      paymentMethod === "COD"
                        ? "border-transparent bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-md"
                        : "border-[#a8451a]/25 bg-[#fde3cf]/50 text-[#c04a1c]"
                    }`}>
                      <Banknote className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base font-extrabold text-[#1c1109]">Cash on Delivery</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          Number(shipping.cod_charge) > 0
                            ? "border-[#a8451a]/25 bg-white text-[#a8451a]"
                            : "border-emerald-500/30 bg-emerald-50 text-emerald-800"
                        }`}>
                          {Number(shipping.cod_charge) > 0 ? `+₹${shipping.cod_charge} fee` : "No extra fee"}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-[#2b1d12]/75 font-normal">
                        Pay in cash when your parcel arrives at your door.
                      </p>
                    </div>
                  </div>
                </label>
              )}

              {razorpayEnabled && (
                <label
                  className={`group relative flex cursor-pointer items-start gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                    paymentMethod === "RAZORPAY"
                      ? "border-2 border-[#c04a1c] bg-gradient-to-br from-white to-[#fff8f2] shadow-md ring-2 ring-[#c04a1c]/15"
                      : "border border-[#a8451a]/20 bg-white/70 hover:border-[#a8451a]/40 hover:bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="sr-only"
                  />

                  {/* Custom Radio Ring */}
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    paymentMethod === "RAZORPAY" ? "border-[#c04a1c] bg-gradient-to-br from-[#8e3510] to-[#c04a1c]" : "border-[#a8451a]/30 bg-white"
                  }`}>
                    <Check className={`h-3 w-3 text-white transition-all duration-300 ${paymentMethod === "RAZORPAY" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} strokeWidth={3} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className={`h-5 w-5 ${paymentMethod === "RAZORPAY" ? "text-[#c04a1c]" : "text-[#2b1d12]/70 group-hover:text-[#a8451a]"} transition-colors duration-300`} />
                      <span className="font-bold text-base text-[#1c1109] tracking-wide">Pay Online</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#2b1d12]/75 font-normal">Cards, UPI, and Netbanking via Razorpay.</p>
                  </div>
                </label>
              )}

              {!codEnabled && !razorpayEnabled && (
                <div className="sm:col-span-2 flex items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-50/80 p-4 text-sm text-rose-800">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  Checkout is temporarily unavailable — please contact us on WhatsApp to place your order.
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center sm:items-center gap-3.5 sm:gap-5">
            <button
              type="submit"
              disabled={submitting || !paymentMethod}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] py-3.5 sm:py-4 px-6 sm:px-8 text-sm sm:text-base font-bold tracking-wider uppercase text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{submitting ? "Placing Order…" : `Place Order — ₹${total.toLocaleString("en-IN")}`}</span>
            </button>
            <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#2b1d12]/75 font-medium text-center sm:text-left">
              <ShieldCheck className="h-4 w-4 text-[#a8451a] shrink-0" />
              <span>100% Encrypted &amp; Secure Order</span>
            </p>
          </div>
        </form>

        {/* Right Sticky Order Summary */}
        <div className="relative rounded-3xl border border-[#a8451a]/25 bg-white/85 p-5 sm:p-8 space-y-5 sm:space-y-6 backdrop-blur-xl shadow-lg h-fit lg:sticky lg:top-28">
          <div className="flex items-center gap-2 border-b border-[#a8451a]/15 pb-4">
            <ShoppingBag className="h-5 w-5 text-[#c04a1c]" />
            <h2 className="min-w-0 whitespace-nowrap font-display text-lg sm:text-2xl font-extrabold text-[#1c1109]">
              Order Summary
            </h2>
            <span className="ml-auto shrink-0 whitespace-nowrap inline-flex items-center justify-center rounded-full bg-[#a8451a]/10 border border-[#a8451a]/25 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-[#a8451a]">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </div>

          <ul className="no-scrollbar space-y-4 max-h-[320px] sm:max-h-[360px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <li key={item.variantId} className="flex gap-3 sm:gap-4 items-center pb-4 border-b border-[#a8451a]/10 last:border-b-0 last:pb-0">
                {/* Product Thumbnail */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#a8451a]/20 bg-[#fff8f2] shadow-2xs">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#fde3cf]/40">
                      <ShoppingBag className="h-6 w-6 text-[#a8451a]/40" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-sm sm:text-base font-bold text-[#1c1109]">{item.name}</h4>
                  {item.variantName && (
                    <span className="mt-0.5 inline-block text-xs font-semibold text-[#a8451a]">
                      {item.variantName}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2.5 rounded-full border border-[#a8451a]/25 bg-[#fffaf5] px-2.5 py-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => item.quantity > 1 && updateQuantity(item.variantId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="text-[#2b1d12]/70 hover:text-[#a8451a] transition-colors p-0.5 disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3 stroke-[2.5]" />
                      </button>
                      <span className="w-4 text-center text-xs font-extrabold text-[#1c1109]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="text-[#2b1d12]/70 hover:text-[#a8451a] transition-colors p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3 stroke-[2.5]" />
                      </button>
                    </div>
                    <span className="text-base font-bold text-[#1c1109]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5 border-t border-[#a8451a]/15 pt-4 text-sm sm:text-base">
            <div className="flex justify-between text-[#2b1d12]/80 font-normal">
              <span>Subtotal</span>
              <span className="text-[#1c1109] font-bold">₹{cartSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[#2b1d12]/80 font-normal">
              <span>Shipping</span>
              <span className="text-[#1c1109] font-bold">{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
            </div>
            {codCost > 0 && (
              <div className="flex justify-between text-[#2b1d12]/80 font-normal">
                <span>COD Fee</span>
                <span className="text-[#1c1109] font-bold">₹{codCost}</span>
              </div>
            )}
            {qtyDiscount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Bulk Discount ({nonBundleQty} items)</span>
                <span className="font-bold">-₹{qtyDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Bundle Discount</span>
                <span className="font-bold">-₹{bundleDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div key={appliedCoupon.code} className="flex justify-between text-emerald-800 font-semibold animate-slideInRight">
                <span>Coupon ({appliedCoupon.code})</span>
                <span className="font-bold">-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#a8451a]/15 pt-3.5 items-baseline">
              <span className="font-display text-lg font-bold text-[#1c1109] uppercase tracking-wider">Total</span>
              <span
                key={`total-${couponDiscount}`}
                className={`font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f] inline-block ${couponDiscount > 0 ? "animate-couponPulse" : ""}`}
              >
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="border-t border-[#a8451a]/15 pt-4 space-y-3">
            <div className="flex gap-2">
              <input
                placeholder="Coupon Code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="min-w-0 flex-1 rounded-2xl border border-[#a8451a]/25 bg-white px-4 py-3 text-sm text-[#1c1109] placeholder:text-[#2b1d12]/40 transition-all duration-300 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15 font-mono uppercase"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={applyingCoupon || !couponInput}
                className="rounded-2xl bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] text-white px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs hover:shadow-md active:scale-95 disabled:opacity-50 transition-all"
              >
                {applyingCoupon ? "Checking…" : "Apply"}
              </button>
            </div>
            {appliedCoupon && couponDiscount > 0 && (
              <div
                key={`badge-${appliedCoupon.code}`}
                className="animate-scaleUp flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span>
                  <span className="font-mono font-bold">{appliedCoupon.code}</span> applied — you save ₹{couponDiscount.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {couponHints.length > 0 && !appliedCoupon && (
              <div className="flex flex-wrap gap-2 pt-1">
                {couponHints.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCouponInput(c.code)}
                    className="flex max-w-full items-center gap-1.5 rounded-2xl sm:rounded-full border border-[#a8451a]/20 bg-[#fde3cf]/50 px-3 py-1.5 text-left text-[11px] sm:text-xs text-[#2b1d12]/80 font-medium hover:border-[#a8451a] hover:bg-[#fde3cf] transition-all"
                  >
                    <span className="font-mono font-bold text-[#a8451a]">{c.code}</span>
                    <span className="text-[#a8451a]/40">·</span>
                    <span>{c.hint}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
