"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Truck, MessageSquare, Check, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { whatsappLink } from "@/lib/constants";
import { flyToCart } from "@/lib/flyToCart";
import { useProductVariant } from "./ProductVariantContext";
import PincodeChecker from "./PincodeChecker";
import ShareButton from "./ShareButton";

function getEstimatedDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


export default function ProductPurchasePanel({ product, variants }) {
  const router = useRouter();
  const ctx = useProductVariant();
  const defaultVariant = variants.find((v) => (v.bottle_type || "glass") === "glass") || variants[0];
  const [localSelectedId, setLocalSelectedId] = useState(defaultVariant?.id);
  const selectedId = ctx ? ctx.selectedId : localSelectedId;
  const setSelectedId = ctx ? ctx.setSelectedId : setLocalSelectedId;
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const { addToCart, setDrawerOpen } = useCart();

  const selected = variants.find((v) => v.id === selectedId) || defaultVariant;
  const inStock = selected && selected.stock_quantity > 0;

  useEffect(() => {
    setDeliveryDate(getEstimatedDeliveryDate());
  }, []);

  if (!variants || variants.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-ink-line p-6 text-sm text-ivory/72">
        This fragrance is currently unavailable. Message us on WhatsApp for availability.
      </div>
    );
  }

  // One "Select Size" button per distinct size name; a size that has both a
  // Glass and a Plastic variant additionally shows a bottle-type toggle,
  const sizeNames = Array.from(new Set(variants.map((v) => v.variant_name)));

  const selectSize = (name) => {
    // Try to keep same bottle type if possible, otherwise first available for that size
    const currentBottleType = selected.bottle_type || "glass";
    const match = variants.find(
      (v) => v.variant_name === name && (v.bottle_type || "glass") === currentBottleType && v.stock_quantity > 0
    );
    if (match) {
      setSelectedId(match.id);
    } else {
      const firstAvailable = variants.find((v) => v.variant_name === name && v.stock_quantity > 0);
      if (firstAvailable) {
        setSelectedId(firstAvailable.id);
      } else {
        const any = variants.find((v) => v.variant_name === name);
        if (any) setSelectedId(any.id);
      }
    }
  };

  const selectBottleType = (type) => {
    const match = variants.find(
      (v) => v.variant_name === selected.variant_name && (v.bottle_type || "glass") === type
    );
    if (match) {
      setSelectedId(match.id);
    }
  };

  const variantsForSelectedSize = variants.filter(
    (v) => v.variant_name === selected.variant_name
  );

  const buildCartItem = () => ({
    variantId: selected.id,
    productId: product.id,
    name: product.name,
    variantName: `${selected.variant_name} (${selected.bottle_type === "plastic" ? "Plastic" : "Glass"})`,
    price: selected.price,
    image: selected.image_url || product.featured_image_url || product.images?.[0] || "/placeholder.jpg",
    slug: product.slug,
  });

  const handleAdd = (e) => {
    if (!selected || !inStock) return;
    const item = buildCartItem();
    flyToCart(e.currentTarget, item.image);
    addToCart(item, quantity);
    setTimeout(() => setDrawerOpen(true), 650);
  };

  const handleBuyNow = () => {
    if (!selected || !inStock) return;
    addToCart(buildCartItem(), quantity);
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Price block */}
      <div className="flex flex-wrap items-baseline gap-3 sm:gap-4">
        <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
          ₹{selected.price.toLocaleString("en-IN")}
        </span>
        {selected.original_price && selected.original_price > selected.price && (
          <>
            <span className="text-base sm:text-xl text-[#2b1d12]/50 line-through">
              ₹{selected.original_price.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-emerald-800 shadow-2xs">
              Save {Math.round(((selected.original_price - selected.price) / selected.original_price) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Size buttons */}
      <div>
        <p className="mb-3 text-sm sm:text-base font-bold uppercase tracking-wider text-[#a8451a]">
          Select Size
        </p>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {sizeNames.map((name) => {
            const optionsForSize = variants.filter((v) => v.variant_name === name);
            const sizeInStock = optionsForSize.some((v) => v.stock_quantity > 0);
            const isSelected = selected.variant_name === name;
            return (
              <div key={name} className="flex flex-col items-stretch gap-1.5">
                <button
                  disabled={!sizeInStock}
                  onClick={() => selectSize(name)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-2xl border px-2 py-2.5 text-sm sm:gap-2 sm:px-5 sm:py-3 sm:text-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] text-white border-transparent font-bold shadow-md shadow-[#a8451a]/25 scale-[1.02]"
                      : "border-[#a8451a]/20 bg-white/80 text-[#2b1d12] hover:border-[#a8451a] hover:bg-white shadow-2xs font-semibold"
                  }`}
                >
                  {isSelected && <Check className="h-4 w-4 stroke-[2.5]" />}
                  {name}
                </button>
                {!sizeInStock && (
                  <span className="w-full rounded-xl border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-center text-xs font-bold uppercase tracking-wider text-rose-700">
                    Out of stock
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {!inStock && <p className="mt-3 text-base text-rose-600 font-bold">This size is currently sold out.</p>}
      </div>

      {/* Bottle type — always shown for the selected size */}
      <div>
        <p className="mb-3 text-sm sm:text-base font-bold uppercase tracking-wider text-[#a8451a]">
          Bottle Type
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {variantsForSelectedSize.map((v) => {
            const bottleType = v.bottle_type || "glass";
            const isSelected = selected.id === v.id;
            return (
              <div key={v.id} className="flex flex-col items-stretch gap-1.5">
                <button
                  disabled={v.stock_quantity <= 0}
                  onClick={() => selectBottleType(bottleType)}
                  className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl border px-2 py-2.5 text-[13px] sm:flex-row sm:gap-2.5 sm:px-5 sm:py-3 sm:text-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#8e3510] via-[#a8451a] to-[#782c0c] text-white border-transparent font-bold shadow-md shadow-[#a8451a]/25 scale-[1.02]"
                      : "border-[#a8451a]/20 bg-white/80 text-[#2b1d12] hover:border-[#a8451a] hover:bg-white shadow-2xs font-semibold"
                  }`}
                >
                  {isSelected && <Check className="hidden h-4 w-4 stroke-[2.5] sm:block" />}
                  <span>{bottleType === "plastic" ? "Plastic Bottle" : "Glass Bottle"}</span>
                  <span className={`text-[13px] sm:text-sm font-bold ${isSelected ? "text-white/90" : "text-[#a8451a]"}`}>
                    ₹{v.price.toLocaleString("en-IN")}
                  </span>
                </button>
                {v.stock_quantity <= 0 && (
                  <span className="w-full rounded-xl border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-center text-xs font-bold uppercase tracking-wider text-rose-700">
                    Out of stock
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex w-full items-center justify-between gap-4 rounded-full border border-[#a8451a]/25 bg-white/90 px-5 py-2.5 shadow-2xs sm:w-fit">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="text-[#2b1d12]/70 hover:text-[#a8451a] transition-colors p-1"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-lg font-bold text-[#1c1109]">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="text-[#2b1d12]/70 hover:text-[#a8451a] transition-colors p-1"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to Bag + Buy Now CTA */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className="flex-1 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] py-3.5 sm:py-4 px-6 text-sm sm:text-base font-bold tracking-wider uppercase text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2.5"
        >
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Add to Bag</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="flex-1 rounded-full border-2 border-[#c04a1c] bg-white py-3.5 sm:py-4 px-6 text-sm sm:text-base font-bold tracking-wider uppercase text-[#a8451a] shadow-xs hover:bg-gradient-to-r hover:from-[#8e3510] hover:to-[#c04a1c] hover:text-white hover:border-transparent hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2.5"
        >
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-[#c04a1c] group-hover:text-white" />
          <span>Buy Now</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <div className="shrink-0">
          <ShareButton productName={product.name} />
        </div>
        {deliveryDate && (
          <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#a8451a]/20 bg-white/85 px-3.5 py-2 text-[13px] sm:w-auto sm:shrink-0 sm:justify-start sm:px-4 sm:text-base text-[#2b1d12]/80 shadow-2xs backdrop-blur-md">
            <Truck className="h-4 w-4 text-[#a8451a] shrink-0" />
            <span className="whitespace-nowrap">
              Est. Delivery: <span className="font-bold text-[#1c1109]">{deliveryDate}</span>
            </span>
          </div>
        )}
      </div>

      <PincodeChecker />

      {/* WhatsApp Link */}
      <a
        href={whatsappLink(
          `Hi Zaylune, I'd like to order ${product.name} (${buildCartItem().variantName}).`
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center gap-2.5 text-left sm:justify-center sm:text-center text-[13px] sm:text-base font-semibold text-emerald-800 hover:text-emerald-900 transition-all py-3 sm:py-3.5 px-4 border border-emerald-500/30 rounded-2xl bg-white/80 hover:bg-emerald-50/60 shadow-2xs backdrop-blur-md"
      >
        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#25D366]" />
        <span className="min-w-0">Prefer to order on WhatsApp instead?</span>
      </a>

    </div>
  );
}
