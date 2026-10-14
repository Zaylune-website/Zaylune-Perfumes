import { getActiveCategories } from "@/actions/categories";
import { getActiveAnnouncements } from "@/actions/site";
import { getBundleSettings } from "@/actions/bundle";
import { getSiteLogo } from "@/actions/settings";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";

export default async function SiteHeader() {
  const supabase = await createClient();
  const [categories, announcements, bundleSettings, logoUrl, { data: { user } }] = await Promise.all([
    getActiveCategories(),
    getActiveAnnouncements(),
    getBundleSettings(),
    getSiteLogo(),
    supabase.auth.getUser(),
  ]);

  return (
    <Header
      categories={categories}
      announcements={announcements}
      isLoggedIn={Boolean(user)}
      bundleEnabled={Boolean(bundleSettings.enabled)}
      logoUrl={logoUrl}
      showcase={{
        badge: bundleSettings.showcase_badge,
        heading: bundleSettings.showcase_heading,
        description: bundleSettings.showcase_description,
      }}
    />
  );
}
