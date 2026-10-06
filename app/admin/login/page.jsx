"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminLogin } from "@/actions/auth";
import { Mail, Lock, ShieldCheck, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-[#a8451a]/25 bg-white py-3.5 pl-12 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 shadow-2xs transition-all duration-300 hover:border-[#a8451a]/45 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15";
const iconClass =
  "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8451a]/70 group-focus-within:text-[#c04a1c] transition-colors duration-300";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] px-5 text-[#1c1109] selection:bg-[#a8451a]/20">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] h-[550px] w-[550px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
        <div className="absolute top-[35%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
        <div className="absolute bottom-[5%] left-[20%] h-[550px] w-[550px] rounded-full bg-[#8e3510]/[0.07] blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-[#a8451a]/20 bg-white/90 p-7 sm:p-10 shadow-lg backdrop-blur-xl">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="relative mb-4 w-36">
            <Image src="/navbar-logo.png" alt="Zaylune" width={144} height={72} className="h-auto w-full object-contain" />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-[#c04a1c]" />
            Authorized users only
          </span>

          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#1c1109]">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">Login</span>
          </h1>
          <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent" />
        </div>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-50 p-3.5 text-sm text-rose-800">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500 animate-pulse" />
              {state.error}
            </div>
          )}

          <div className="relative group">
            <Mail className={iconClass} />
            <input required name="email" type="email" placeholder="Email Address" className={`${inputClass} pr-5`} />
          </div>

          <div className="relative group">
            <Lock className={iconClass} />
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#a8451a]/70 transition-colors hover:text-[#c04a1c]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Checking Details...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Sign In
              </span>
            )}
          </button>
        </form>

        <div className="mt-7 border-t border-[#a8451a]/15 pt-5 text-center">
          <Link
            href="/"
            className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a8451a] transition-colors hover:text-[#782c0c]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-1" /> Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
