import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";
import AccountTabs from "./_components/AccountTabs";
import { LogOut, Sparkles } from "lucide-react";

export const metadata = { title: "My Account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, order_status, payment_status, payment_method, created_at, awb_code, courier_name, order_items ( product_name, variant_name, quantity )")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] pb-24 sm:pb-32 pt-6 sm:pt-14 selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        {/* Ambient luxury background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
          <div className="absolute bottom-[5%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#8e3510]/[0.07] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <div className="mb-6 sm:mb-10 flex flex-row items-start justify-between gap-3 sm:items-center sm:gap-5 border-b border-[#a8451a]/15 pb-5 sm:pb-8">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-3.5 py-1 rounded-full border border-[#a8451a]/25 bg-white/85 text-[10px] sm:text-sm font-bold uppercase tracking-wider text-[#a8451a] shadow-2xs backdrop-blur-md mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c04a1c]" />
                Personal Portal
              </span>
              <h1 className="font-display whitespace-nowrap text-[26px] sm:text-4xl md:text-5xl font-extrabold text-[#1c1109]">
                My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a2812] via-[#c04a1c] to-[#d4651f]">
                  Account
                </span>
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-[#2b1d12]/80 font-medium break-words">
                {profile?.full_name || "Zaylune Customer"} · <span className="text-[#a8451a]">{profile?.email}</span>
              </p>
            </div>
            <form action={logout} className="shrink-0">
              <button
                type="submit"
                className="group flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full border border-rose-500/25 bg-white/85 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider text-rose-700 transition-all duration-300 hover:border-rose-400 hover:bg-rose-50 shadow-2xs hover:shadow-xs active:scale-95"
              >
                <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                Log Out
              </button>
            </form>
          </div>

          <AccountTabs profile={profile} orders={orders} />
        </div>
      </main>
      <Footer />
    </>
  );
}
