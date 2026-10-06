import { getActiveCategories } from "@/actions/categories";
import { getActiveAnnouncements } from "@/actions/site";
import { getBundleSettings } from "@/actions/bundle";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";

export default async function SiteHeader() {
  const supabase = await createClient();
  const [categories, announcements, bundleSettings, { data: { user } }] = await Promise.all([
    getActiveCategories(),
    getActiveAnnouncements(),
    getBundleSettings(),
    supabase.auth.getUser(),
  ]);

  return (
    <Header
      categories={categories}
      announcements={announcements}
      isLoggedIn={Boolean(user)}
      bundleEnabled={Boolean(bundleSettings.enabled)}
      showcase={{
        badge: bundleSettings.showcase_badge,
        heading: bundleSettings.showcase_heading,
        description: bundleSettings.showcase_description,
      }}
    />
  );
}
