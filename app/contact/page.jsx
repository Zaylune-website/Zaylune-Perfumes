import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ContactContent from "./_components/ContactContent";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Zaylune Fragrances for scent recommendations, gifting options, and order support.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-8 sm:pt-12 bg-gradient-to-b from-[#fde3cf] via-[#fdf7f2] to-[#fde3cf] text-[#1c1109] selection:bg-[#a8451a]/20 selection:text-[#1c1109]">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-[10%] h-[500px] w-[500px] rounded-full bg-[#c04a1c]/[0.08] blur-[160px]" />
          <div className="absolute top-[35%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#cfa14b]/[0.10] blur-[180px]" />
          <div className="absolute bottom-[10%] left-[5%] h-[550px] w-[550px] rounded-full bg-[#8e3510]/[0.06] blur-[160px]" />
        </div>

        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
