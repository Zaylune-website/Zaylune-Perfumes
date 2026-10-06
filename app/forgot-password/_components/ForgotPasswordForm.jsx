"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, SendHorizonal, Sparkles, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "@/actions/auth";

const inputClass =
  "w-full rounded-2xl border border-[#a8451a]/25 bg-white py-3.5 pl-12 pr-4 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 shadow-2xs transition-all duration-300 hover:border-[#a8451a]/45 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {});

  return (
    <div className="relative w-full max-w-md rounded-[2.5rem] border border-[#a8451a]/20 bg-white/90 p-6 sm:p-10 shadow-lg backdrop-blur-xl">
      <div className="relative mx-auto mb-4 w-36">
        <Image src="/navbar-logo.png" alt="Zaylune" width={144} height={72} className="h-auto w-full object-contain" />
      </div>

      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
          Forgot Password
        </span>
      </div>
      <h1 className="mt-3 text-center font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109]">Reset Your Password</h1>
      <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent" />
      <p className="mt-3 text-center text-sm sm:text-base text-[#2b1d12]/75">
        Enter your account email and we&apos;ll send you a reset link.
      </p>

      {state.success ? (
        <div className="mt-7 flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          {state.message}
        </div>
      ) : (
        <form action={formAction} className="mt-7 space-y-4">
          {state.error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-50 p-3.5 text-sm text-rose-800">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500 animate-pulse" />
              {state.error}
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8451a]/70 group-focus-within:text-[#c04a1c] transition-colors duration-300" />
            <input required name="email" type="email" placeholder="Email Address" className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <SendHorizonal className="h-4 w-4" />
                Send Reset Link
              </span>
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm sm:text-base text-[#2b1d12]/75">
        Remembered it?{" "}
        <Link href="/login" className="font-bold text-[#a8451a] hover:text-[#782c0c] transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}
