import { getProducts } from "@/actions/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zaylunefragrances.com";

export default async function sitemap() {
  const products = await getProducts({});

  const staticRoutes = [
    { url: "/", changeFrequency: "daily", priority: 1 },
    { url: "/shop", changeFrequency: "daily", priority: 0.9 },
    { url: "/bundle", changeFrequency: "weekly", priority: 0.7 },
    { url: "/about", changeFrequency: "monthly", priority: 0.5 },
    { url: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { url: "/policies/terms", changeFrequency: "yearly", priority: 0.2 },
    { url: "/policies/privacy", changeFrequency: "yearly", priority: 0.2 },
    { url: "/policies/shipping", changeFrequency: "yearly", priority: 0.2 },
    { url: "/policies/refund", changeFrequency: "yearly", priority: 0.2 },
  ].map((route) => ({
    ...route,
    url: `${SITE_URL}${route.url}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${SITE_URL}/shop/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
