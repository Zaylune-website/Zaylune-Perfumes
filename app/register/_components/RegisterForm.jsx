"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { registerUser } from "@/actions/auth";

const inputClass =
  "w-full rounded-2xl border border-gold-400/10 bg-ink/40 py-3 pl-12 pr-4 text-base text-ivory placeholder:text-ivory/20 transition-all duration-500 focus:border-gold-300/50 focus:bg-ink/70 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, pending] = useActionState(registerUser, {});

  return (
    <div className="relative w-full max-w-md rounded-[2.5rem] border border-gold-400/10 bg-gradient-to-b from-[#120f0d]/90 via-[#0b0a0a]/90 to-[#080707]/95 p-6 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(212,163,89,0.02)] backdrop-blur-xl transition-all duration-500 hover:border-gold-400/20">

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent rounded-t-[2.5rem]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-300/5 blur-3xl" />

      <div className="relative mx-auto mb-4 w-44">
        <Image src="/navbar-logo.png" alt="Zaylune" width={176} height={88} className="h-auto w-full object-contain" />
      </div>

      <span className="eyebrow relative flex justify-center text-[11px] font-semibold uppercase tracking-widest text-gold-300">
        Join Zaylune
      </span>
      <h1 className="relative mt-2 text-center font-display text-2xl sm:text-3xl text-ivory font-light">Create an Account</h1>
      <p className="relative mt-2 text-center text-sm text-ivory/50 font-light">Faster checkout and order tracking, every visit.</p>

      <form action={action} className="relative mt-5 space-y-3">
        <input type="hidden" name="redirect_to" value={redirectTo} />

        {state.error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            {state.error}
          </div>
        )}

        <div className="relative group">
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
          <input required name="full_name" placeholder="Full Name" className={inputClass} />
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
          <input required name="email" type="email" placeholder="Email Address" className={inputClass} />
        </div>

        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
          <input name="phone" type="tel" placeholder="Phone Number" className={inputClass} />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
          <input required name="password" type={showPassword ? "text" : "password"} placeholder="Password (min. 6 chars)" className={`${inputClass} pr-12`} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400/40 hover:text-gold-300 transition-colors p-1">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <button type="submit" disabled={pending} className="btn-gold group w-full py-3.5 text-sm font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5">
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              Creating account…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <UserPlus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              Create Account
            </span>
          )}
        </button>
      </form>

      <p className="relative mt-5 text-center text-sm text-ivory/50 font-light">
        Already have an account?{" "}
        <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-gold-300 hover:text-gold-200 transition-colors font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
