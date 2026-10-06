"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, CreditCard, Minus, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { fireConfetti } from "@/lib/confetti";

function QuantityStepper({ value, onDecrease, onIncrease, increaseDisabled, className = "" }) {
  return (
    <div className={`flex items-center justify-between rounded-full border-2 border-[#a8451a]/30 bg-[#fffaf5] p-1 shadow-xs ${className}`}>
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#a8451a] border border-[#a8451a]/25 hover:bg-[#a8451a] hover:text-white shadow-2xs transition-colors"
      >
        <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
      </button>
      <span className="min-w-[1.5rem] px-1 text-center text-sm sm:text-base font-extrabold text-[#1c1109]">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
        className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#a8451a] border border-[#a8451a]/25 hover:bg-[#a8451a] hover:text-white shadow-2xs transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#a8451a]"
      >
        <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
}

function ProductModal({ product, quantity, maxQuantity, onSetQuantity, onClose }) {
  const [qtyInput, setQtyInput] = useState(Math.max(1, quantity));

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const hasCutPrice = product.oldPrice && product.oldPrice > product.price;
  const gallery = product.images?.length ? product.images : product.image ? [product.image] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] || null;

  const soldOut = !product.inStock;
  const noRoom = maxQuantity <= 0;
  const isUnchanged = qtyInput === quantity;

  let label = "Add to Gift Set";
  if (soldOut) label = "Sold Out";
  else if (noRoom) label = "Set Full";
  else if (qtyInput === 0) label = "Remove from Gift Set";
  else if (quantity > 0) label = isUnchanged ? "Added to Set" : "Update Quantity";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative grid w-full max-w-2xl animate-fadeUp grid-cols-1 overflow-y-auto h-full rounded-none sm:h-auto sm:max-h-[92svh] sm:rounded-[2.25rem] sm:overflow-hidden border-t sm:border border-[#a8451a]/25 bg-[#fff8f2] shadow-2xl sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="group absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#a8451a]/25 bg-white/80 text-[#2b1d12] backdrop-blur-md transition-all duration-300 hover:border-[#a8451a] hover:text-[#8e3510]"
        >
          <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        <div className="flex flex-col sm:h-full">
          <div className="relative aspect-square sm:aspect-auto sm:flex-1 shrink-0 overflow-hidden bg-white/60">
            {activeImage ? (
              <Image src={activeImage} alt={product.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#fff7ef] to-[#fde5ce]">
                <Sparkles className="h-16 w-16 text-[#a8451a]/40" />
              </div>
            )}
            {soldOut && (
              <span className="absolute left-4 top-4 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700 shadow-2xs">
                Sold out
              </span>
            )}

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#a8451a]/25 bg-white/80 text-[#2b1d12] backdrop-blur-md transition-all duration-300 hover:border-[#a8451a] hover:text-[#8e3510]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i + 1) % gallery.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#a8451a]/25 bg-white/80 text-[#2b1d12] backdrop-blur-md transition-all duration-300 hover:border-[#a8451a] hover:text-[#8e3510]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3 scrollbar-thin">
              {gallery.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border transition-all duration-200 ${
                    i === activeIndex ? "border-[#a8451a] ring-2 ring-[#a8451a]/30" : "border-[#a8451a]/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={url} alt="" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/25 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] w-fit">
            <Sparkles className="h-3 w-3 text-[#c04a1c]" /> {product.variantName}
          </div>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl font-light text-[#1c1109]">{product.name}</h2>

          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasCutPrice && <span className="text-base text-[#2b1d12]/50 line-through">₹{product.oldPrice.toLocaleString("en-IN")}</span>}
          </div>

          {product.description && <p className="mt-4 text-base leading-relaxed text-[#2b1d12]/80 font-normal">{product.description}</p>}

          <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 border-t border-[#a8451a]/15 bg-[#fff8f2] px-6 pb-6 pt-4 sm:static sm:mx-0 sm:mb-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0">
            <div className="flex items-center gap-3">
              {!soldOut && !noRoom && (
                <QuantityStepper
                  value={qtyInput}
                  onDecrease={() => setQtyInput((q) => Math.max(0, q - 1))}
                  onIncrease={() => setQtyInput((q) => Math.min(quantity + maxQuantity, q + 1))}
                  increaseDisabled={qtyInput >= quantity + maxQuantity}
                  className="shrink-0 px-1"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  if (!isUnchanged) onSetQuantity(product, qtyInput);
                  onClose();
                }}
                disabled={soldOut || noRoom}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                  !isUnchanged && !soldOut && !noRoom
                    ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] text-white shadow-md hover:shadow-xl hover:-translate-y-0.5"
                    : quantity > 0
                    ? "border border-[#a8451a]/30 bg-[#a8451a]/10 text-[#a8451a]"
                    : "cursor-not-allowed border border-[#a8451a]/20 bg-white/60 text-[#2b1d12]/50"
                }`}
              >
                {quantity > 0 && isUnchanged ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BundleBuilder({ products, bottleCount, fixedPrice }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [quantities, setQuantities] = useState({});
  const [modalProduct, setModalProduct] = useState(null);

  const totalSelected = useMemo(() => Object.values(quantities).reduce((sum, q) => sum + q, 0), [quantities]);
  const isFull = totalSelected >= bottleCount;
  const isComplete = totalSelected === bottleCount;
  const remaining = bottleCount - totalSelected;

  const selectedUnits = useMemo(() => {
    const units = [];
    for (const product of products) {
      const qty = quantities[product.variantId] || 0;
      for (let i = 0; i < qty; i++) units.push(product);
    }
    return units;
  }, [products, quantities]);

  const selectedGroups = useMemo(
    () =>
      products
        .map((product) => ({ product, qty: quantities[product.variantId] || 0 }))
        .filter((g) => g.qty > 0),
    [products, quantities]
  );

  const naturalTotal = useMemo(() => selectedUnits.reduce((sum, p) => sum + p.price, 0), [selectedUnits]);

  const hasBundlePrice = isComplete && fixedPrice != null && fixedPrice < naturalTotal;
  const total = hasBundlePrice ? fixedPrice : naturalTotal;
  const savings = hasBundlePrice ? naturalTotal - fixedPrice : 0;

  const prevIsCompleteRef = useRef(false);

  useEffect(() => {
    // When the last bottle is added and the bundle/discount unlocks
    if (!prevIsCompleteRef.current && isComplete) {
      fireConfetti();
      if (hasBundlePrice && savings > 0) {
        showToast(`🎉 Discount unlocked! You saved ₹${savings.toLocaleString("en-IN")}!`);
      } else {
        showToast("🎉 Your gift set is complete!");
      }
    }
    prevIsCompleteRef.current = isComplete;
  }, [isComplete, hasBundlePrice, savings, showToast]);

  const setQuantity = (product, qty) => {
    if (!product.inStock) return;
    const current = quantities[product.variantId] || 0;
    const roomForThis = bottleCount - totalSelected + current;
    const clamped = Math.max(0, Math.min(qty, roomForThis));
    setQuantities((prev) => {
      if (clamped === 0) {
        const { [product.variantId]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [product.variantId]: clamped };
    });
  };

  const addOne = (product) => setQuantity(product, (quantities[product.variantId] || 0) + 1);
  const removeOne = (product) => setQuantity(product, (quantities[product.variantId] || 0) - 1);

  const handleCheckoutBundle = () => {
    if (!isComplete) return;
    const bundleGroupId = `bundle-${Date.now()}`;
    Object.entries(quantities).forEach(([variantId, qty]) => {
      const p = products.find((prod) => prod.variantId === variantId);
      if (!p || qty <= 0) return;
      addToCart(
        {
          variantId: p.variantId,
          productId: p.productId,
          slug: p.slug,
          name: p.name,
          variantName: p.variantName,
          price: p.price,
          image: p.image,
          bundleGroupId,
        },
        qty
      );
    });
    showToast(`${totalSelected} bottles added to your cart!`);
    setQuantities({});
    router.push("/checkout");
  };

  return (
    <div className="pb-56 sm:pb-48">
      <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => {
          const qty = quantities[product.variantId] || 0;
          const selected = qty > 0;
          const disabled = !product.inStock || (isFull && !selected);

          return (
            <div
              key={product.variantId}
              onClick={() => setModalProduct(product)}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              className={`group relative flex h-full animate-fadeUp cursor-pointer flex-col overflow-hidden rounded-2xl sm:rounded-3xl border text-left backdrop-blur-md transition-all duration-300 ${
                selected
                  ? "-translate-y-1 border-2 border-[#a8451a] bg-white shadow-xl ring-4 ring-[#a8451a]/20"
                  : "border-[#a8451a]/20 bg-white/85 hover:border-[#a8451a]/40 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
              } ${disabled && !selected ? "opacity-40 pointer-events-none" : ""}`}
            >
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-white/60">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${selected ? "scale-105" : ""}`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#fff7ef] to-[#fde5ce]">
                    <Sparkles className="h-12 w-12 text-[#a8451a]/30" />
                  </div>
                )}

                {selected && (
                  <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-[#8e3510] shadow-lg border-2 border-[#a8451a] ring-2 ring-black/10">
                    <Check className="h-3.5 w-3.5 stroke-[3] text-[#8e3510]" />
                    <span>{qty} Selected</span>
                  </div>
                )}

                {!product.inStock && (
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700 shadow-2xs">
                    Sold out
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <h3 className="font-display text-sm sm:text-base font-bold line-clamp-2 transition-colors text-[#1c1109] group-hover:text-[#a8451a]">
                  {product.name}
                </h3>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[#2b1d12]/75">{product.variantName}</p>
                {product.description && (
                  <p className="mt-1 hidden text-xs sm:text-sm text-[#2b1d12]/70 line-clamp-2 sm:block">{product.description}</p>
                )}
                <div className="mt-auto flex items-baseline gap-1.5 sm:gap-2 pt-2.5 sm:pt-3.5">
                  <span className="font-bold text-[#1c1109] text-sm sm:text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-xs sm:text-sm text-[#2b1d12]/50 line-through">₹{product.oldPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>

                {selected ? (
                  <QuantityStepper
                    value={qty}
                    onDecrease={(e) => {
                      e.stopPropagation();
                      removeOne(product);
                    }}
                    onIncrease={(e) => {
                      e.stopPropagation();
                      addOne(product);
                    }}
                    increaseDisabled={isFull}
                    className="mt-2.5 sm:mt-3 w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addOne(product);
                    }}
                    disabled={disabled}
                    className={`mt-2.5 sm:mt-3 flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 ${
                      disabled
                        ? "cursor-not-allowed border border-[#a8451a]/20 bg-white/60 text-[#2b1d12]/50"
                        : "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] text-white shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                    }`}
                  >
                    {!product.inStock ? "Sold Out" : isFull ? "Set Full" : "Add to Gift Set"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky build dock */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#a8451a]/20 bg-white/95 shadow-[0_-12px_40px_rgba(43,29,18,0.12)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8451a]/40 to-transparent" />

        <div className="mx-auto max-w-wrap px-4 py-3 sm:px-6 sm:py-4 md:px-12">
          {/* Progress message + bar */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <p className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs sm:gap-2 sm:text-base font-medium text-[#1c1109]">
              {isComplete ? (
                <>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
                  {hasBundlePrice ? (
                    <>
                      <span className="sm:hidden font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        🎉 Saved ₹{savings.toLocaleString("en-IN")}!
                      </span>
                      <span className="hidden sm:inline">
                        🎉 Gift set complete — you save{" "}
                        <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          ₹{savings.toLocaleString("en-IN")}
                        </span>!
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-emerald-800">🎉 Your gift set is ready!</span>
                  )}
                </>
              ) : (
                <>
                  <span className="sm:hidden">
                    Add <span className="font-bold text-[#a8451a]">{remaining}</span> more
                    {fixedPrice != null ? ` for ₹${fixedPrice.toLocaleString("en-IN")}` : ""}
                  </span>
                  <span className="hidden sm:inline">
                    Add <span className="font-bold text-[#a8451a]">{remaining}</span> more bottle{remaining === 1 ? "" : "s"}
                    {fixedPrice != null ? ` to unlock special price of ₹${fixedPrice.toLocaleString("en-IN")}` : " to complete your set"}
                  </span>
                </>
              )}
            </p>
            <span className="shrink-0 text-xs sm:text-base font-bold text-[#a8451a]">
              {totalSelected} / {bottleCount}
            </span>
          </div>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#a8451a]/15">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isComplete ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#d4651f]"
              }`}
              style={{ width: `${Math.min(100, (totalSelected / bottleCount) * 100)}%` }}
            />
          </div>

          {/* Slot thumbnails + CTA */}
          <div className="mt-3.5 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-2 overflow-x-auto scrollbar-thin sm:flex-1 sm:gap-2.5">
              {selectedGroups.map(({ product: p, qty }) => (
                <div key={p.variantId} className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#a8451a]/25 bg-white shadow-xs sm:h-20 sm:w-20">
                  {p.image ? (
                    <Image src={p.image} alt={p.name} fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#fff7ef] to-[#fde5ce]">
                      <Sparkles className="h-6 w-6 text-[#a8451a]/40" />
                    </div>
                  )}
                  {qty > 1 && (
                    <span className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">
                      ×{qty}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeOne(p)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 hover:opacity-100"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}

              {Array.from({ length: remaining }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-dashed border-[#a8451a]/30 text-[#a8451a]/60 bg-white/40 sm:h-20 sm:w-20"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:gap-4">
              {total > 0 && (
                <p className="text-left text-xs text-[#2b1d12]/80 sm:text-right sm:text-sm">
                  <span className="hidden sm:inline">Total: </span>
                  <span className={`text-base sm:text-xl font-bold ${hasBundlePrice ? "text-emerald-800" : "text-[#1c1109]"}`}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                  {hasBundlePrice && (
                    <span className="ml-1 sm:ml-1.5 text-xs sm:text-base text-[#2b1d12]/50 line-through">
                      ₹{naturalTotal.toLocaleString("en-IN")}
                    </span>
                  )}
                </p>
              )}
              <button
                type="button"
                onClick={handleCheckoutBundle}
                disabled={!isComplete}
                className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] px-6 py-3.5 font-display text-sm sm:text-base font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed sm:flex-none sm:px-8"
              >
                <CreditCard className="h-4 w-4" /> Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          quantity={quantities[modalProduct.variantId] || 0}
          maxQuantity={bottleCount - totalSelected + (quantities[modalProduct.variantId] || 0)}
          onSetQuantity={setQuantity}
          onClose={() => setModalProduct(null)}
        />
      )}
    </div>
  );
}
