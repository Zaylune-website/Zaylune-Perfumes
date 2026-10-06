import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export const metadata = { title: "Forgot Password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-[85vh] items-center justify-center bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] px-5 py-12 sm:py-18 overflow-hidden selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#c04a1c]/[0.08] blur-[150px]" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#d4a359]/[0.10] blur-[160px]" />
          <div className="absolute bottom-[5%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#8e3510]/[0.07] blur-[150px]" />
        </div>

        <div className="relative z-10 flex w-full items-center justify-center">
          <Suspense fallback={null}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
