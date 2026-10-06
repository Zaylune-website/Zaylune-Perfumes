import { Plus_Jakarta_Sans, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { BRAND } from "@/lib/constants";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getBundleSettings } from "@/actions/bundle";
import Script from "next/script";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zaylunefragrances.com";
const SITE_DESCRIPTION =
  "Hand-poured attars and fine fragrances crafted in small batches — extrait-grade oils, alcohol-free options, made to last.";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — Perfumes & Attar`,
    template: `%s — ${BRAND.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["perfumes", "attar", "fragrances", "luxury perfume India", "alcohol-free attar", "Zaylune Fragrances", "KGF fragrances"],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Favicon.png",
    apple: "/Favicon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} — Perfumes & Attar`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/navbar-logo.png", width: 512, height: 512, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Perfumes & Attar`,
    description: SITE_DESCRIPTION,
    images: ["/navbar-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default async function RootLayout({ children }) {
  const [quantityDiscount, bundleSettings] = await Promise.all([getQuantityDiscountSettings(), getBundleSettings()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <Script id="ld-json-organization" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: BRAND.name,
            url: SITE_URL,
            logo: `${SITE_URL}/navbar-logo.png`,
            sameAs: [BRAND.instagram, BRAND.facebook, BRAND.youtube].filter(Boolean),
          })}
        </Script>
        <Script id="ld-json-website" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: BRAND.name,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/shop?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            {children}
            <CartDrawer quantityDiscount={quantityDiscount} bundleSettings={bundleSettings} />
            <FloatingWhatsApp />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
