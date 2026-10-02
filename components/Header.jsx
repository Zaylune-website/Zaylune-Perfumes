"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, User, Sparkles, ChevronDown, ChevronRight, LayoutDashboard, LogOut, LogIn, Search, ChevronUp, Home, Store, Gift, Info, Phone, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { logout } from "@/actions/auth";

const STATIC_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

function AnnouncementBar({ message }) {
  if (!message) return null;

  return (
    <div className="relative overflow-hidden border-b border-gold-400/15 bg-gradient-to-r from-[#120f0d] via-[#1c1611] to-[#120f0d]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.08] blur-[60px]" />
      <div className="relative mx-auto flex max-w-wrap items-center justify-center gap-2 px-8 py-1.5 sm:px-12">
        <Sparkles className="h-3 w-3 shrink-0 text-gold-300 animate-pulse" />
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 sm:text-xs sm:tracking-[0.18em]">
          {message}
        </p>
        <Sparkles className="h-3 w-3 shrink-0 text-gold-300 animate-pulse" />
      </div>
    </div>
  );
}

export default function Header({ categories = [], announcement, isLoggedIn = false, bundleEnabled = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, setDrawerOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", mobileOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [mobileOpen]);

  const navLinks = bundleEnabled
    ? [...STATIC_LINKS.slice(0, 2), { label: "Gift Set", href: "/bundle", icon: Gift }, ...STATIC_LINKS.slice(2)]
    : STATIC_LINKS;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
    <header className={`sticky top-0 z-40 border-b border-gold-400/10 transition-all duration-300 ${mobileOpen ? "bg-[#0b0a0a]" : "bg-[#0a0908] backdrop-blur-2xl"}`}>
      <AnnouncementBar message={announcement} />

      {/* Ambient top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      {/* Shimmering bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
      {/* Subtle center glow behind navbar content */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.04] blur-2xl" />

      {/* Main Navbar Row */}
      <div className="mx-auto flex max-w-wrap items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3.5 md:py-4 md:px-12">

        {/* Brand Logo */}
        <Link href="/" className="relative flex h-10 w-[130px] items-center shrink-0 group sm:h-12 sm:w-[185px] lg:w-[210px]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute left-0 top-1/2 aspect-[3/2] h-20 -translate-y-1/2 transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(212,163,89,0.35)] sm:h-28 lg:h-32">
            <Image
              src="/navbar-logo.png"
              alt="Zaylune"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.label === "Shop") {
              return (
                <div key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium tracking-wide transition-all duration-300 ${pathname?.startsWith("/shop") ? "bg-gold-400/10 text-gold-200" : "text-ivory/65 hover:bg-white/5 hover:text-gold-300"}`}
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 text-gold-400/70 group-hover:rotate-180 transition-transform duration-300" />
                  </Link>

                  {/* Dropdown Menu (Glassmorphic panel) */}
                  {categories.length > 0 && (
                    <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-3 scale-95 rounded-[1.75rem] border border-gold-400/15 bg-gradient-to-b from-[#181310] via-[#120f0d] to-[#0b0a0a] p-3 opacity-0 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:visible group-hover:translate-y-2 group-hover:scale-100 group-hover:opacity-100">
                      {/* Caret pointer */}
                      <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-l border-t border-gold-400/15 bg-[#181310]" />
                      {/* Decorative glow */}
                      <div className="pointer-events-none absolute -top-8 left-1/2 h-24 w-44 -translate-x-1/2 rounded-full bg-gold-400/10 blur-2xl" />
                      <div className="pointer-events-none absolute -bottom-6 right-2 h-16 w-16 rounded-full bg-gold-300/10 blur-2xl" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between px-4 pb-3 pt-2">
                          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300/60">
                            <Sparkles className="h-3 w-3 text-gold-400/60" />
                            Browse Categories
                          </p>
                          <Link
                            href="/shop"
                            className="flex shrink-0 items-center gap-1 rounded-full border border-gold-400/25 bg-gold-400/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-300 whitespace-nowrap transition-all duration-200 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200"
                          >
                            See All
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                        <div className="mx-4 mb-2 h-px bg-gradient-to-r from-gold-400/30 via-gold-400/10 to-transparent" />
                        <div className="max-h-[min(60vh,320px)] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold-400/20 hover:scrollbar-thumb-gold-400/40">
                          <div className="space-y-0.5">
                            {categories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/shop?category=${cat.id}`}
                                className="group/item relative flex items-center justify-between overflow-hidden rounded-xl px-4 py-3 text-sm text-ivory/65 transition-all duration-300 hover:bg-gold-400/10 hover:text-gold-200"
                              >
                                <span className="relative z-10 flex items-center gap-3">
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/30 transition-all duration-300 group-hover/item:bg-gold-300 group-hover/item:shadow-[0_0_10px_rgba(212,163,89,0.6)]" />
                                  {cat.name}
                                </span>
                                <ChevronRight className="relative z-10 h-3.5 w-3.5 text-gold-300 opacity-0 -translate-x-1 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                <span className="absolute inset-y-0 left-0 w-0.5 bg-gold-400/50 scale-y-0 transition-transform duration-300 group-hover/item:scale-y-100" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-[15px] font-medium tracking-wide transition-all duration-300 ${isActive ? "bg-gold-400/10 text-gold-200" : "text-ivory/65 hover:bg-white/5 hover:text-gold-300"}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-300 shadow-[0_0_6px_rgba(212,163,89,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2">

          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 ${
              searchOpen
                ? "border-gold-400/50 bg-gold-400/15 text-gold-300 shadow-[0_0_16px_rgba(202,161,75,0.2)]"
                : "border-gold-400/25 bg-gold-400/8 text-gold-300/80 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200"
            }`}
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Account (Mobile) */}
          <Link
            href="/account"
            aria-label="My Account"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/8 text-gold-300/80 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200 hover:scale-105 sm:hidden"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>

          {/* Account (Desktop) */}
          {isLoggedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/account"
                className="flex h-10 items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/8 px-4 text-[13px] font-semibold uppercase tracking-widest text-gold-300/80 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200 hover:scale-[1.03] hover:shadow-[0_0_16px_rgba(202,161,75,0.15)]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Account
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  aria-label="Log out"
                  title="Log out"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/8 text-gold-300/80 transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/8 hover:text-red-300 hover:scale-105"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/8 text-gold-300/80 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200 hover:scale-105 sm:flex"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/8 text-gold-300/80 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(202,161,75,0.15)]"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-gradient text-[8px] font-bold text-ink shadow-gold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/8 text-gold-300/80 hover:border-gold-400/50 hover:bg-gold-400/15 hover:text-gold-200 md:hidden transition-all duration-300"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-gold-400/10 bg-[#0b0a0a]/95 backdrop-blur-lg animate-fadeUp">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-wrap items-center gap-3 px-4 py-4 sm:px-6 md:px-12">
            <Search className="h-4.5 w-4.5 shrink-0 text-gold-300/70" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragrances..."
              className="flex-1 bg-transparent text-base text-ivory placeholder:text-ivory/30 focus:outline-none"
            />
            <button type="submit" className="btn-gold px-5 py-2 text-xs font-semibold uppercase tracking-wide shrink-0">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-line text-ivory/60 transition-all hover:border-gold-300/30 hover:text-gold-300"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      </header>

      {/* Mobile Drawer Overlay — outside <header> so backdrop-blur doesn't trap fixed positioning */}
      <div className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#0f0d0b] via-[#0b0a0a] to-[#080707] md:hidden transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"}`}>
          {/* Ambient glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-400/5 blur-[80px]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

          {/* Header row */}
          <div className="flex shrink-0 items-center justify-between border-b border-gold-400/10 px-5 py-3">
            <Link href="/" onClick={() => setMobileOpen(false)} className="relative h-10 w-32">
              <Image src="/navbar-logo.png" alt="Zaylune" fill className="object-contain object-left" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/15 bg-ink-soft/60 text-ivory/70 transition-all hover:border-gold-300/40 hover:text-gold-300"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Scrollable nav body */}
          <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-5">

            {/* Main links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3.5 rounded-2xl px-5 py-3.5 font-display text-base tracking-wide transition-all duration-200 ${
                      active
                        ? "bg-gold-400/12 text-gold-200 border border-gold-400/20"
                        : "text-ivory/75 hover:bg-ink-soft/60 hover:text-gold-200 border border-transparent"
                    }`}
                  >
                    {Icon && (
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${active ? "border-gold-400/30 bg-gold-400/15 text-gold-300" : "border-gold-400/15 bg-gold-400/8 text-gold-400/60"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    <span className="flex-1">{link.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-gold-300 shadow-[0_0_8px_rgba(212,163,89,0.8)]" />}
                  </Link>
                );
              })}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mt-5 border-t border-gold-400/10 pt-5">
                <p className="mb-2 px-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300/50">
                  Shop by Category
                </p>
                <div className="space-y-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-5 py-3 text-sm text-ivory/65 transition-all hover:bg-ink-soft/50 hover:text-gold-200"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-gold-400/40" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Account section — always visible at bottom */}
          <div className="shrink-0 border-t border-gold-400/10 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-1 items-center gap-2.5 rounded-2xl border border-gold-400/20 bg-gold-400/5 px-5 py-3.5 text-sm font-semibold tracking-wide text-gold-200 transition-all hover:bg-gold-400/10"
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    My Account
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      aria-label="Log out"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink-line text-ivory/50 transition-all hover:border-red-400/30 hover:bg-red-500/5 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-gold-400/10 bg-ink-soft/40 px-5 py-3 text-sm font-medium text-ivory/70 transition-all hover:border-gold-400/20 hover:bg-gold-400/5 hover:text-gold-200"
                >
                  <Package className="h-4 w-4 shrink-0 text-gold-400/60" />
                  My Orders
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-gold flex w-full items-center justify-center gap-2 py-3.5 text-xs font-semibold tracking-widest uppercase"
              >
                <LogIn className="h-4 w-4" />
                Login / Register
              </Link>
            )}
          </div>
        </div>

    </>
  );
}
