"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Sparkles, ShieldCheck } from "lucide-react";
import { requestSignupOtp, verifySignupOtp } from "@/actions/auth";
import { PHONE_PATTERN, keepDigits } from "@/lib/phone";

const inputClass =
  "w-full rounded-2xl border border-[#a8451a]/25 bg-white py-3.5 pl-12 pr-4 text-base text-[#1c1109] placeholder:text-[#2b1d12]/40 shadow-2xs transition-all duration-300 hover:border-[#a8451a]/45 focus:border-[#a8451a] focus:outline-none focus:ring-2 focus:ring-[#a8451a]/15";
const iconClass =
  "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8451a]/70 group-focus-within:text-[#c04a1c] transition-colors duration-300";
const errorClass =
  "flex items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-50 p-3.5 text-sm text-rose-800";
const submitClass =
  "w-full rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-[#782c0c] py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const [showPassword, setShowPassword] = useState(false);

  // Step 1 sends a code to the email, step 2 verifies it and creates the account.
  // The details are kept in state so they can be re-posted in step 2 and when
  // the user goes back to edit them.
  const [step, setStep] = useState("details");
  const [details, setDetails] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [cooldown, setCooldown] = useState(0);
  const [otp, setOtp] = useState("");

  const [otpState, otpAction, otpSendPending] = useActionState(requestSignupOtp, {});
  const [verifyState, verifyAction, verifyPending] = useActionState(verifySignupOtp, {});

  useEffect(() => {
    if (otpState.success) {
      setStep("otp");
      setCooldown(60);
    }
  }, [otpState]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleDetailsSubmit = (e) => {
    const fd = new FormData(e.currentTarget);
    setDetails({
      full_name: fd.get("full_name") || "",
      email: fd.get("email") || "",
      phone: fd.get("phone") || "",
      password: fd.get("password") || "",
    });
  };

  return (
    <div className="relative w-full max-w-md rounded-[2.5rem] border border-[#a8451a]/20 bg-white/90 p-6 sm:p-10 shadow-lg backdrop-blur-xl">
      <div className="relative mx-auto mb-4 w-40">
        <Image src="/navbar-logo.png" alt="Zaylune" width={160} height={80} className="h-auto w-full object-contain" />
      </div>

      {step === "details" ? (
        <>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#c04a1c]" />
              Join Zaylune
            </span>
          </div>
          <h1 className="mt-3 text-center font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109]">Create an Account</h1>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent" />
          <p className="mt-3 text-center text-sm sm:text-base text-[#2b1d12]/75">Faster checkout and order tracking, every visit.</p>

          <form action={otpAction} onSubmit={handleDetailsSubmit} className="mt-6 space-y-3.5">
            <input type="hidden" name="redirect_to" value={redirectTo} />

            {otpState.error && <div className={errorClass}><span className="h-2 w-2 shrink-0 rounded-full bg-rose-500 animate-pulse" />{otpState.error}</div>}

            <div className="relative group">
              <User className={iconClass} />
              <input required name="full_name" defaultValue={details.full_name} placeholder="Full Name" className={inputClass} />
            </div>

            <div className="relative group">
              <Mail className={iconClass} />
              <input required name="email" type="email" defaultValue={details.email} placeholder="Email Address" className={inputClass} />
            </div>

            <div className="relative group">
              <Phone className={iconClass} />
              <input
                required
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern={PHONE_PATTERN}
                defaultValue={details.phone}
                onInput={(e) => (e.currentTarget.value = keepDigits(e.currentTarget.value))}
                title="Enter a valid 10-digit mobile number starting with 6-9"
                placeholder="10-Digit Mobile Number"
                className={inputClass}
              />
            </div>

            <div className="relative group">
              <Lock className={iconClass} />
              <input
                required
                name="password"
                type={showPassword ? "text" : "password"}
                defaultValue={details.password}
                placeholder="Password (min. 6 chars)"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#a8451a]/70 hover:text-[#c04a1c] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button type="submit" disabled={otpSendPending} className={submitClass}>
              {otpSendPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending code…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Send Verification Code
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm sm:text-base text-[#2b1d12]/75">
            Already have an account?{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-bold text-[#a8451a] hover:text-[#782c0c] transition-colors">
              Log in
            </Link>
          </p>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#a8451a]/25 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c04a1c]" />
              Verify Email
            </span>
          </div>
          <h1 className="mt-3 text-center font-display text-2xl sm:text-3xl font-extrabold text-[#1c1109]">Enter Your Code</h1>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[#8e3510] via-[#c04a1c] to-transparent" />
          <p className="mt-3 text-center text-sm sm:text-base text-[#2b1d12]/75">
            We sent a 6-digit code to <span className="font-bold text-[#1c1109] break-all">{details.email}</span>
          </p>

          <form action={verifyAction} className="mt-6 space-y-3.5">
            <input type="hidden" name="email" value={details.email} />
            <input type="hidden" name="full_name" value={details.full_name} />
            <input type="hidden" name="phone" value={details.phone} />
            <input type="hidden" name="password" value={details.password} />
            <input type="hidden" name="redirect_to" value={redirectTo} />

            {verifyState.error && <div className={errorClass}><span className="h-2 w-2 shrink-0 rounded-full bg-rose-500 animate-pulse" />{verifyState.error}</div>}

            <div className="relative mx-auto w-fit">
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => {
                  const digit = otp[i];
                  const isActive = i === otp.length && otp.length < 6;
                  return (
                    <span
                      key={i}
                      className={`flex h-14 w-11 items-center justify-center rounded-2xl border-2 font-display text-2xl font-extrabold transition-all duration-300 sm:w-12 ${
                        digit
                          ? "border-[#a8451a] bg-[#fff5ee] text-[#1c1109] shadow-sm"
                          : isActive
                          ? "border-[#c04a1c] bg-white ring-4 ring-[#c04a1c]/15"
                          : "border-[#a8451a]/20 bg-white text-[#2b1d12]/30"
                      }`}
                    >
                      {digit || ""}
                    </span>
                  );
                })}
              </div>
              {/* Real input sits on top of the boxes: taps focus it, typing fills them. */}
              <input
                required
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                aria-label="6-digit verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
              />
            </div>
            <p className="text-center text-xs text-[#2b1d12]/60">Code expires in 10 minutes.</p>

            <button type="submit" disabled={verifyPending || otp.length !== 6} className={submitClass}>
              {verifyPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Verify &amp; Create Account
                </span>
              )}
            </button>
          </form>

          <form action={otpAction} className="mt-5 flex items-center justify-between text-sm">
            <input type="hidden" name="full_name" value={details.full_name} />
            <input type="hidden" name="email" value={details.email} />
            <input type="hidden" name="phone" value={details.phone} />
            <input type="hidden" name="password" value={details.password} />
            <input type="hidden" name="redirect_to" value={redirectTo} />
            <button
              type="button"
              onClick={() => setStep("details")}
              className="font-semibold text-[#2b1d12]/70 transition-colors hover:text-[#a8451a]"
            >
              Change email
            </button>
            <button
              type="submit"
              disabled={cooldown > 0 || otpSendPending}
              className="font-bold text-[#a8451a] transition-colors hover:text-[#782c0c] disabled:opacity-40"
            >
              {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
            </button>
          </form>
          {otpState.error && <p className="mt-3 text-center text-sm text-rose-700">{otpState.error}</p>}
        </>
      )}
    </div>
  );
}
