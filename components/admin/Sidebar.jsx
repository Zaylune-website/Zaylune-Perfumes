"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  LayoutTemplate,
  Quote,
  Megaphone,
  Tag,
  Truck,
  Layers,
  PackagePlus,
  UserCog,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";
import { getSidebarBadgeCounts } from "@/actions/admin/dashboard";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Gift Set Builder", href: "/admin/bundle", icon: PackagePlus },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Coupons", href: "/admin/settings/coupons", icon: Tag },
      { label: "Shipping Settings", href: "/admin/settings/shipping", icon: Truck },
      { label: "Quantity Discount", href: "/admin/settings/quantity-discount", icon: Layers },
      { label: "My Profile", href: "/admin/settings/profile", icon: UserCog },
    ],
  },
];

export default function AdminSidebar({ adminName = "Admin" }) {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useAdminSidebar();
  const initial = adminName.trim().charAt(0).toUpperCase();

  // Fetched client-side (not awaited in the layout) so nav badge counts
  // never block a page's initial render — they just pop in a beat later.
  const [badges, setBadges] = useState({});
  useEffect(() => {
    let cancelled = false;
    getSidebarBadgeCounts().then((counts) => {
      if (cancelled) return;
      setBadges({
        "/admin/reviews": counts.pendingReviewCount,
        "/admin/inquiries": counts.unresolvedInquiryCount,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#1c1109]/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[#a8451a]/20 bg-white/85 backdrop-blur-xl shadow-[10px_0_40px_-30px_rgba(122,40,18,0.4)] transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top accent line */}
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#d4a359]" />

        <div className="relative flex h-16 shrink-0 items-center gap-3 border-b border-[#a8451a]/15 px-5">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#c04a1c]/10 blur-3xl" />
          <div className="relative flex-1 overflow-hidden">
            <p className="truncate font-display text-base font-extrabold tracking-wide text-[#1c1109]">Zaylune</p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-[#a8451a] font-bold">Admin Panel</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="relative p-1 text-[#2b1d12]/70 hover:text-[#1c1109] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-[#a8451a]/5 scrollbar-track-transparent">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a8451a]/80">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin" || item.href === "/admin/settings"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  const badgeCount = badges[item.href];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] text-white shadow-md"
                          : "text-[#2b1d12]/75 hover:bg-[#fde3cf]/60 hover:text-[#a8451a] hover:translate-x-0.5"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                          active ? "text-white" : "text-[#a8451a]/70 group-hover:text-[#c04a1c]"
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {!!badgeCount && (
                        <span
                          className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                            active ? "bg-white/25 text-white" : "bg-rose-100 text-rose-700 border border-rose-300/60"
                          }`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-[#a8451a]/15 bg-[#fffaf5] p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#a8451a]/20 bg-white p-2.5 shadow-2xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-xs font-bold text-white shadow-sm">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#1c1109]">{adminName}</p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-[#a8451a]">Administrator</p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#2b1d12]/70 transition-colors hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
