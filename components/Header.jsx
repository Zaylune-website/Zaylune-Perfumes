"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Sparkles,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  LogIn,
  Search,
  Home,
  Store,
  Gift,
  Info,
  Phone,
  Package,
  ArrowRight,
  Compass,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { logout } from "@/actions/auth";
import AnnouncementTicker from "@/components/AnnouncementTicker";

const STATIC_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Store, hasMegaMenu: true },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

function AnnouncementBar({ messages }) {
  if (!messages.length) return null;

  return (
    <div className="border-b border-[#5c1d0b]/40">
      <AnnouncementTicker messages={messages} />
    </div>
  );
}

export default function Header({
  categories = [],
  announcements = [],
  isLoggedIn = false,
  bundleEnabled = false,
  showcase,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const { cartCount, setDrawerOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef(null);

  // Track window scroll for dynamic glassmorphic shrinking navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer or search spotlight is open
  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  // Focus search input on open
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Global hotkey support (Cmd+K / Ctrl+K or ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        if (mobileOpen) setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, mobileOpen]);

  const navLinks = bundleEnabled
    ? [
        ...STATIC_LINKS.slice(0, 2),
        { label: "Gift Sets", href: "/bundle", icon: Gift },
        ...STATIC_LINKS.slice(2),
      ]
    : STATIC_LINKS;

  const executeSearch = (query) => {
    const q = (query || searchQuery).trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery("");
      if (mobileOpen) setMobileOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ease-out bg-[#fde3cf] ${
          scrolled
            ? "border-b border-[#a8451a]/20 shadow-[0_12px_36px_-10px_rgba(43,29,18,0.15)]"
            : "border-b border-[#a8451a]/15"
        }`}
      >
        {pathname === "/" && <AnnouncementBar messages={announcements} />}

        {/* Ambient top light sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        {/* Subtle luminous center glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c04a1c]/[0.04] blur-3xl" />

        {/* Main Navbar Row */}
        <div
          className={`mx-auto flex max-w-wrap items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6 md:px-10 lg:px-12 ${
            scrolled ? "py-1 sm:py-1.5" : "py-2 sm:py-2.5"
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="group relative flex h-11 w-[130px] shrink-0 items-center sm:h-14 sm:w-[185px] lg:w-[210px] transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Soft luminous aura behind logo */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a8451a]/15 blur-xl transition-all duration-500 group-hover:bg-[#a8451a]/25 group-hover:scale-125" />
            <div className="relative aspect-[3/2] h-[82px] sm:h-32 lg:h-[135px] drop-shadow-[0_2px_12px_rgba(168,69,26,0.18)] transition-all duration-500 group-hover:drop-shadow-[0_4px_22px_rgba(168,69,26,0.35)]">
              <Image
                src="/navbar-logo.png"
                alt="Zaylune"
                fill
                priority
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 200px, 225px"
                className="object-contain object-left"
              />
              {/* Subtle diagonal shine sweep on hover */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100" />
              </div>
            </div>
          </Link>

          {/* Center Navigation Dock (Desktop Luxury Capsule) */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-gold-400/20 bg-[#fff9f3]/70 p-1.5 shadow-[0_4px_20px_-4px_rgba(43,29,18,0.06)] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

              if (link.hasMegaMenu) {
                return (
                  <div key={link.href} className="group relative">
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? "border border-gold-400/30 bg-white text-[#a8451a] shadow-[0_2px_10px_rgba(168,69,26,0.12)]"
                          : "text-ivory/78 hover:bg-white/60 hover:text-[#a8451a]"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 text-[#a8451a]/80 transition-transform duration-300 group-hover:rotate-180" />
                    </Link>

                    {/* Luxury Mega-Menu Dropdown Panel */}
                    <div className="invisible absolute left-1/2 top-full z-50 w-[580px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="relative overflow-hidden rounded-3xl border-2 border-[#a8451a]/25 bg-[#fffaf5] p-5 shadow-[0_25px_70px_rgba(43,29,18,0.35),0_0_0_1px_rgba(168,69,26,0.1)]">
                        {/* Decorative background subtle glow */}
                        <div className="pointer-events-none absolute -top-12 left-1/2 h-36 w-60 -translate-x-1/2 rounded-full bg-[#fde3cf] blur-2xl" />

                        {/* Top row header */}
                        <div className="relative z-10 flex items-center justify-between border-b border-[#a8451a]/15 pb-3">
                          <p className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#a8451a]">
                            <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
                            Collections &amp; Notes
                          </p>
                          <Link
                            href="/shop"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-[#fde3cf] px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] transition-all duration-200 hover:bg-[#a8451a] hover:text-white shadow-sm"
                          >
                            Explore All
                          </Link>
                        </div>

                        {/* Main Grid: Categories on Left + Editorial Showcase on Right */}
                        <div className={`relative z-10 mt-4 grid gap-4 ${bundleEnabled ? "grid-cols-5" : "grid-cols-1"}`}>
                          {/* Categories List */}
                          <div className={`${bundleEnabled ? "col-span-3" : "col-span-full"} max-h-[280px] space-y-2 overflow-y-auto pr-1`}>
                            {categories.length > 0 ? (
                              categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/shop?category=${cat.id}`}
                                  className="group/item flex items-center justify-between rounded-xl border border-[#a8451a]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#2b1d12] shadow-sm transition-all duration-200 hover:border-[#a8451a] hover:bg-[#a8451a] hover:text-white hover:translate-x-1 hover:shadow-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#a8451a] transition-colors group-hover/item:bg-white shrink-0" />
                                    <span className="tracking-wide">{cat.name}</span>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <Link
                                href="/shop"
                                className="block rounded-xl border border-[#a8451a]/15 bg-white p-3 text-sm font-semibold text-[#2b1d12] hover:bg-[#a8451a] hover:text-white"
                              >
                                View full fragrance catalog
                              </Link>
                            )}
                          </div>

                          {/* Editorial Showcase Card — only while the Gift Set page is enabled */}
                          {bundleEnabled && showcase && (
                            <div className="col-span-2 flex flex-col justify-between rounded-2xl border-2 border-[#a8451a]/20 bg-gradient-to-br from-[#fae5d2] to-[#f4d1b5] p-4 shadow-sm">
                              <div>
                                {showcase.badge && (
                                  <div className="mb-2 inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#a8451a] shadow-xs">
                                    <Sparkles className="h-3 w-3 text-[#c04a1c]" />
                                    {showcase.badge}
                                  </div>
                                )}
                                <h4 className="font-display text-base sm:text-lg font-bold text-[#1c1109] leading-snug">
                                  {showcase.heading}
                                </h4>
                                {showcase.description && (
                                  <p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed text-[#431a06]">
                                    {showcase.description}
                                  </p>
                                )}
                              </div>

                              <Link
                                href="/bundle"
                                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-transform duration-200 hover:scale-[1.03]"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Gift Sets</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "border border-gold-400/30 bg-white text-[#a8451a] shadow-[0_2px_10px_rgba(168,69,26,0.12)]"
                      : "text-ivory/78 hover:bg-white/60 hover:text-[#a8451a]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a8451a] shadow-[0_0_6px_rgba(168,69,26,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search Fragrances"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 bg-white/50 text-ivory/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-gold-400/50 hover:bg-white hover:text-[#a8451a] hover:scale-105 active:scale-95"
            >
              <Search className="h-[18px] w-[18px] text-[#a8451a]" />
            </button>

            {/* Account (Desktop Pill / Button) */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-full border border-gold-400/25 bg-white/50 px-3.5 py-2 text-[12px] font-semibold uppercase tracking-wider text-[#a8451a] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-gold-400/50 hover:bg-white hover:shadow-[0_4px_16px_rgba(168,69,26,0.12)]"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-[#c04a1c]" />
                  <span>Account</span>
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    aria-label="Log out"
                    title="Log out"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 bg-white/40 text-ivory/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-red-400/40 hover:bg-red-50 hover:text-red-700 hover:scale-105"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/account"
                aria-label="Account"
                className="hidden sm:flex h-10 items-center gap-1.5 rounded-full border border-gold-400/25 bg-white/45 px-3.5 text-[12px] font-semibold uppercase tracking-wider text-[#a8451a] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-gold-400/50 hover:bg-white hover:scale-105 active:scale-95"
              >
                <User className="h-3.5 w-3.5 text-[#c04a1c]" />
                <span className="hidden xl:inline">Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              id="site-cart-button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open Cart"
              className="relative flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-gold-400/25 bg-white/50 text-ivory shadow-sm backdrop-blur-md transition-all duration-300 hover:border-gold-400/50 hover:bg-white hover:text-[#a8451a] hover:scale-105 hover:shadow-[0_4px_18px_rgba(168,69,26,0.15)] active:scale-95"
            >
              <ShoppingBag className="h-[18px] w-[18px] text-[#a8451a]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-gradient px-1 text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(192,73,28,0.5)] ring-2 ring-[#fde3cf] animate-scaleUp">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open Navigation Menu"
              className="flex h-10 w-10 md:hidden items-center justify-center rounded-full border border-gold-400/25 bg-white/50 text-ivory/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-gold-400/50 hover:bg-white hover:text-[#a8451a] active:scale-95"
            >
              <Menu className="h-5 w-5 text-[#a8451a]" />
            </button>
          </div>
        </div>
      </header>

      {/* Spotlight Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 animate-fadeIn">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-ivory/40 backdrop-blur-md transition-opacity"
            onClick={() => setSearchOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 mx-auto w-full min-w-0 max-w-2xl overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-[#a8451a]/25 bg-[#fffbf7] p-4 sm:p-7 shadow-[0_30px_90px_rgba(43,29,18,0.35)] animate-scaleUp">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
            />

            <div className="mb-4 flex items-center justify-between">
              <p className="eyebrow">
                <span className="gold-line" /> Search
              </p>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#a8451a]/20 bg-white text-ivory/60 transition-all hover:border-[#a8451a] hover:text-[#a8451a] hover:rotate-90 duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-2 rounded-2xl border border-[#a8451a]/25 bg-white p-2 shadow-2xs transition-all focus-within:border-[#a8451a] focus-within:ring-2 focus-within:ring-[#a8451a]/15 sm:flex-row sm:items-center sm:gap-3 sm:py-2.5 sm:pl-4 sm:pr-2.5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5 px-2 sm:px-0">
                <Search className="h-5 w-5 shrink-0 text-[#a8451a]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fragrances…"
                  className="min-w-0 flex-1 bg-transparent py-2 text-base font-medium text-ivory placeholder:text-ivory/45 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 rounded-full p-1 text-ivory/50 transition-colors hover:text-ivory"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="btn-gold w-full shrink-0 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider sm:w-auto sm:py-2"
              >
                Search
              </button>
            </form>

            {categories.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow mb-3 text-[11px]">
                  <Compass className="h-3.5 w-3.5" /> Browse categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="rounded-full border border-[#a8451a]/25 bg-white px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-[#2b1d12] shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a8451a] hover:bg-accent-gradient hover:text-[#fef2e6] hover:shadow-md"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer (Luxury Editorial Slide-over) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${
          mobileOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-ivory/50 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sliding Panel */}
        <div
          className={`fixed inset-y-0 right-0 w-[88%] max-w-[380px] flex flex-col border-l border-gold-400/25 bg-gradient-to-b from-[#fffaf3] via-[#fdefdf] to-[#fde5ce] shadow-[0_0_50px_rgba(43,29,18,0.25)] backdrop-blur-2xl transition-transform duration-500 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header Row */}
          <div className="flex shrink-0 items-center justify-between border-b border-gold-400/15 px-6 py-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="relative h-10 w-32 drop-shadow-sm"
            >
              <Image
                src="/navbar-logo.png"
                alt="Zaylune"
                fill
                className="object-contain object-left"
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/20 bg-white/70 text-ivory/70 transition-all hover:border-[#a8451a] hover:text-[#a8451a] hover:rotate-90 duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search bar inside mobile drawer */}
          <div className="px-5 pt-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fragrances..."
                className="w-full rounded-full border border-gold-400/25 bg-white/70 py-2.5 pl-10 pr-4 text-sm font-medium text-ivory placeholder:text-ivory/50 focus:border-[#a8451a] focus:bg-white focus:outline-none"
              />
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#a8451a]" />
            </form>
          </div>

          {/* Navigation Links Body */}
          <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-1.5 scrollbar-thin">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              const Icon = link.icon;

              if (link.label === "Shop" && categories.length > 0) {
                return (
                  <div key={link.href} className="space-y-1">
                    <div
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold tracking-wide transition-all ${
                        active
                          ? "bg-white text-[#a8451a] shadow-sm border border-gold-400/25"
                          : "text-ivory/80 hover:bg-white/50"
                      }`}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 flex-1"
                      >
                        {Icon && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-gold-400/20 bg-white/70 text-[#a8451a]">
                            <Icon className="h-4 w-4" />
                          </span>
                        )}
                        <span>{link.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileCatOpen((o) => !o)}
                        className="p-1 rounded-lg text-ivory/60 hover:text-[#a8451a]"
                        aria-label="Toggle categories"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            mobileCatOpen ? "rotate-180 text-[#a8451a]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Accordion Categories */}
                    {mobileCatOpen && (
                      <div className="relative ml-6 mt-1 space-y-1.5 border-l-2 border-[#a8451a]/15 py-1 pl-4 animate-fadeIn">
                        {categories.map((cat, i) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.id}`}
                            onClick={() => setMobileOpen(false)}
                            style={{ animation: `fadeIn 0.35s ease-out ${i * 60}ms both` }}
                            className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-[#2b1d12]/85 transition-all duration-300 hover:border-[#a8451a]/20 hover:bg-white hover:text-[#a8451a] hover:shadow-2xs"
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#c04a1c]/60 transition-all duration-300 group-hover:scale-150 group-hover:bg-[#c04a1c]" />
                              {cat.name}
                            </span>
                            <ChevronRight className="h-4 w-4 text-[#a8451a]/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[#a8451a]" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold tracking-wide transition-all ${
                    active
                      ? "bg-white text-[#a8451a] shadow-sm border border-gold-400/25"
                      : "text-ivory/80 hover:bg-white/50"
                  }`}
                >
                  {Icon && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-gold-400/20 bg-white/70 text-[#a8451a]">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="flex-1">{link.label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a8451a] shadow-[0_0_8px_rgba(168,69,26,0.8)]" />
                  )}
                </Link>
              );
            })}

          </nav>

          {/* Account / Auth pinned at bottom */}
          <div className="shrink-0 border-t border-gold-400/15 p-5 bg-[#fff8f0]/80">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gold-400/25 bg-white py-3 text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-sm hover:shadow"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#c04a1c]" />
                    Dashboard
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      aria-label="Log out"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/25 bg-white text-ivory/60 hover:border-red-400/30 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gold-400/15 bg-white/40 py-2.5 text-sm font-medium text-ivory/85 hover:bg-white"
                >
                  <Package className="h-4 w-4 text-[#a8451a]" />
                  View Orders
                </Link>
              </div>
            ) : (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="btn-gold flex w-full items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wider shadow-md"
              >
                <LogIn className="h-4 w-4" />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
