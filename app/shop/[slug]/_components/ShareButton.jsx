"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Link as LinkIcon, Send, Share2, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

export default function ShareButton({ productName }) {
  const [productUrl, setProductUrl] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const shareText = `Check out ${productName} by Zaylune`;

  useEffect(() => {
    setProductUrl(window.location.href);
  }, []);

  const copyProductLink = async () => {
    if (!productUrl) return;
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      showToast("Product link copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Failed to copy link.");
    }
  };

  const shareNative = async () => {
    if (!productUrl) return;
    if (!navigator.share) {
      await copyProductLink();
      return;
    }
    try {
      await navigator.share({
        title: productName,
        text: shareText,
        url: productUrl,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        await copyProductLink();
      }
    }
  };

  const shareOnInstagram = async () => {
    await copyProductLink();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative z-[1000]">
      <button
        type="button"
        onClick={() => setShareOpen((open) => !open)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a8451a]/20 bg-white/85 px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#a8451a] backdrop-blur-md shadow-2xs transition-all duration-300 hover:border-[#a8451a] hover:bg-white hover:shadow-xs active:scale-95"
      >
        <Share2 className="w-4 h-4 text-[#c04a1c]" />
        <span>Share</span>
      </button>

      {shareOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all duration-300 animate-fadeIn"
            onClick={() => setShareOpen(false)}
          >
            <div
              className="relative w-full max-w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border border-[#a8451a]/25 bg-gradient-to-b from-[#fffbf8] via-[#fdf7f2] to-[#fde3cf] p-6 sm:p-7 shadow-2xl transition-all duration-300 animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Glows */}
              <div className="pointer-events-none absolute -top-24 -left-20 h-48 w-48 rounded-full bg-[#c04a1c]/[0.08] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-20 h-48 w-48 rounded-full bg-[#d4a359]/[0.10] blur-3xl" />
              
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#d4651f]" />
              
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1c1109]">
                    Share Fragrance
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-[#a8451a] font-bold mt-0.5">Zaylune Haute Parfumerie</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#a8451a]/20 bg-white text-[#2b1d12] transition-all duration-300 hover:bg-[#a8451a] hover:text-white shadow-2xs"
                  aria-label="Close share popup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="my-5 h-px bg-[#a8451a]/15" />

              <p className="text-sm font-bold uppercase tracking-wider text-[#1c1109]/80 mb-3.5">Share via social media</p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareText}: ${productUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-800 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-500/20 shadow-2xs"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
                <button
                  type="button"
                  onClick={shareOnInstagram}
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-pink-500/25 bg-pink-500/10 text-pink-700 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 hover:bg-pink-500/20 shadow-2xs"
                  aria-label="Share on Instagram"
                >
                  <FaInstagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/25 bg-sky-500/10 text-sky-700 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500 hover:bg-sky-500/20 shadow-2xs"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-700 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:bg-cyan-500/20 shadow-2xs"
                  aria-label="Share on Twitter"
                >
                  <FaTwitter className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
                <button
                  type="button"
                  onClick={shareNative}
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#a8451a]/25 bg-[#a8451a]/10 text-[#a8451a] transition-all duration-300 hover:-translate-y-1 hover:border-[#a8451a] hover:bg-[#a8451a]/20 shadow-2xs"
                  aria-label="Open more share options"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </button>
              </div>

              <div className="my-5 h-px bg-[#a8451a]/15" />

              <p className="text-sm font-bold uppercase tracking-wider text-[#1c1109]/80 mb-3">Or copy link</p>

              <div className="group/copy flex items-stretch overflow-hidden rounded-2xl border border-[#a8451a]/25 bg-white transition-all duration-300 shadow-2xs">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3 text-sm text-[#1c1109]">
                  <LinkIcon className="h-4 w-4 shrink-0 text-[#a8451a]" />
                  <span className="truncate pr-2 font-mono text-xs sm:text-sm text-[#2b1d12]/80">{productUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={copyProductLink}
                  className={`shrink-0 px-5 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] text-white hover:opacity-95 active:scale-95"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
