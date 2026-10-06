"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const { drawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMobileMenuOpen(document.body.classList.contains("mobile-menu-open"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/bundle") ||
    pathname?.startsWith("/account") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname === "/shop" ||
    pathname?.startsWith("/shop/")
  ) return null;
  if (drawerOpen || mobileMenuOpen) return null;

  return (
    <a
      href={whatsappLink("Hi Zaylune, I'd like to know more about your fragrances.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[45] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_28px_-6px_rgba(37,211,102,0.65)] transition-transform duration-300 hover:scale-110"
    >
      <FaWhatsapp className="h-7 w-7 text-white" />
    </a>
  );
}
