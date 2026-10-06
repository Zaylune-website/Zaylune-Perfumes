const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zaylunefragrances.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/account",
        "/admin",
        "/api",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/auth",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
