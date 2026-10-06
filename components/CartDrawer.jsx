"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, Sparkles, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import BottleGlyph from "@/components/BottleGlyph";
import {
  calculateQuantityDiscount,
  calculateBundleDiscount,
  nonBundleCartQuantity,
  SHIPPING_DEFAULTS,
} from "@/lib/constants";

export default function CartDrawer({ quantityDiscount, bundleSettings }) {
  const { cart, drawerOpen, setDrawerOpen, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const qtyDiscount = calculateQuantityDiscount(nonBundleCartQuantity(cart), quantityDiscount);
  const bundleDiscount = calculateBundleDiscount(cart, bundleSettings);

  const freeShippingThreshold = SHIPPING_DEFAULTS.free_threshold || 1499;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingUnlocked = distanceToFreeShipping === 0;
  const shippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const totalDiscount = (qtyDiscount || 0) + (bundleDiscount || 0);
  const estimatedTotal = Math.max(0, cartSubtotal - totalDiscount);

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 animate-fadeIn"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-[#a8451a]/20 bg-gradient-to-b from-[#fffbf8] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] transition-transform duration-500 ease-out shadow-[-20px_0_60px_rgba(43,29,18,0.25)] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#a8451a]/15 bg-white/80 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-white shadow-md shadow-[#a8451a]/25 ring-2 ring-[#a8451a]/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#1c1109]">
                  Your Bag
                </h2>
                <span className="inline-flex items-center justify-center rounded-full bg-[#a8451a]/10 border border-[#a8451a]/25 px-2.5 py-0.5 text-xs font-bold text-[#a8451a]">
                  {cartCount}
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#2b1d12]/80 font-medium mt-0.5">
                {cartCount === 1 ? "1 item selected" : `${cartCount} items selected`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close bag"
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#a8451a]/20 bg-white text-[#2b1d12] shadow-2xs hover:bg-[#a8451a] hover:text-white transition-all duration-300"
          >
            <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Free Shipping Dynamic Progress Meter */}
        {cart.length > 0 && (
          <div className="border-b border-[#a8451a]/15 bg-[#fff8f2] px-6 py-3.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="flex items-center gap-1.5 text-[#1c1109]">
                {freeShippingUnlocked ? (
                  <>
                    <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" style={{ animationDuration: "4s" }} />
                    <span className="text-emerald-800 font-bold">🎉 FREE Delivery Unlocked!</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 text-[#c04a1c]" />
                    <span>
                      Add <strong className="text-[#a8451a]">₹{distanceToFreeShipping.toLocaleString("en-IN")}</strong> for <strong className="text-[#1c1109]">FREE Delivery</strong>
                    </span>
                  </>
                )}
              </span>
              <span className="text-xs font-bold text-[#a8451a]">
                {Math.round(shippingProgress)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#a8451a]/15">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  freeShippingUnlocked
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/50"
                    : "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#d4651f]"
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 scrollbar-thin scrollbar-thumb-[#a8451a]/20">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white to-[#fde3cf] border border-[#a8451a]/25 shadow-lg ring-4 ring-[#a8451a]/10">
                <BottleGlyph className="h-12 w-auto text-[#c04a1c] animate-floatSlow" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1c1109]">
                Your bag is empty
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#2b1d12]/75 leading-relaxed max-w-[280px]">
                Discover hand-poured attars and fine luxury fragrances crafted in small batches.
              </p>
              <Link
                href="/shop"
                onClick={() => setDrawerOpen(false)}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Fragrances
              </Link>
            </div>
          ) : (
            <ul className="space-y-3.5">
              {cart.map((item) => (
                <li
                  key={item.variantId}
                  className="group flex gap-3.5 sm:gap-4 rounded-2xl border border-[#a8451a]/20 bg-white/90 p-3 sm:p-3.5 shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-[#a8451a]/40 hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-[#a8451a]/15 bg-[#fff8f2] shadow-2xs">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#fff7ef] to-[#fde5ce]">
                        <ShoppingBag className="h-8 w-8 text-[#a8451a]/30" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-sm sm:text-base font-bold text-[#1c1109] leading-snug line-clamp-2 group-hover:text-[#a8451a] transition-colors">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          aria-label="Remove item"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#2b1d12]/40 hover:bg-rose-50 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {item.variantName && (
                        <span className="mt-1 inline-flex items-center rounded-full border border-[#a8451a]/20 bg-[#a8451a]/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#a8451a]">
                          {item.variantName}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between rounded-full border border-[#a8451a]/25 bg-[#fffaf5] p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-[#a8451a] border border-[#a8451a]/20 hover:bg-[#a8451a] hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                        <span className="w-6 text-center text-xs sm:text-sm font-extrabold text-[#1c1109]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-[#a8451a] border border-[#a8451a]/20 hover:bg-[#a8451a] hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="font-bold text-sm sm:text-base text-[#1c1109]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#a8451a]/20 bg-white/95 px-4 sm:px-6 py-3 sm:py-5 backdrop-blur-xl shadow-[0_-12px_32px_rgba(43,29,18,0.08)] space-y-2.5 sm:space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#2b1d12]/75">
                <span className="uppercase tracking-wider font-semibold">Subtotal</span>
                <span className="font-display text-base sm:text-lg font-bold text-[#1c1109]">
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {qtyDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="font-semibold inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Bulk Quantity Savings
                  </span>
                  <span className="font-bold">-₹{qtyDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {bundleDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="font-semibold inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Gift Set Bundle Savings
                  </span>
                  <span className="font-bold">-₹{bundleDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {totalDiscount > 0 && (
                <div className="pt-1.5 sm:pt-2 border-t border-[#a8451a]/15 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1c1109] uppercase tracking-wider">Estimated Total</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                    ₹{estimatedTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Reassurance pills */}
            <div className="hidden sm:flex items-center justify-center gap-2 pt-1 text-xs text-[#2b1d12]/75 font-medium">
              <span>✦ 100% Extrait</span>
              <span>•</span>
              <span>Free COD Available</span>
              <span>•</span>
              <span>Easy Returns</span>
            </div>

            {/* Checkout CTA Button */}
            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] py-3 sm:py-4 text-center font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ring-4 ring-[#a8451a]/20"
            >
              <CreditCard className="h-5 w-5" /> Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
