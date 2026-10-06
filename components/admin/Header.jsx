"use client";

import Link from "next/link";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";

export default function AdminHeader({ adminName }) {
  const { setMobileOpen } = useAdminSidebar();
  const initial = (adminName || "A").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#a8451a]/20 bg-white/80 px-4 backdrop-blur-xl md:px-6">
      <button onClick={() => setMobileOpen(true)} className="p-1.5 text-[#2b1d12]/75 hover:text-[#a8451a] lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-lg font-bold text-[#1c1109]">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
            {adminName || "Admin"}
          </span>
        </p>
        <p className="mt-0.5 text-sm font-medium text-[#2b1d12]/70">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/"
          target="_blank"
          aria-label="View store"
          className="group flex items-center gap-1.5 rounded-full border border-[#a8451a]/30 bg-white p-2 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a8451a] hover:bg-[#fff5ee] hover:shadow-sm sm:px-4 sm:py-1.5"
        >
          <span className="hidden sm:inline">View Store </span>
          <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-3.5 sm:w-3.5" />
        </Link>

        <div className="hidden h-8 w-px bg-[#a8451a]/20 sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8e3510] to-[#c04a1c] text-sm font-bold text-white shadow-sm ring-2 ring-[#c04a1c]/15 transition-transform duration-300 hover:scale-105">
            {initial}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              aria-label="Log out"
              className="flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-50 hover:shadow-sm sm:px-4"
            >
              <LogOut className="h-3.5 w-3.5 sm:hidden" />
              Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
