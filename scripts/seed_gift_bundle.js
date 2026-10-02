// Run: node --env-file=.env scripts/seed_gift_bundle.js
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PRODUCTS = [
  { name: "Arabian Oud",     price: 499, original_price: 649, description: "Rich, smoky oud with warm sandalwood and amber base notes." },
  { name: "Rose Royale",     price: 449, original_price: 599, description: "Velvety Bulgarian rose with a hint of oud and musk." },
  { name: "White Musk Silk", price: 399, original_price: 549, description: "Clean, powdery white musk with soft floral top notes." },
  { name: "Amber Noir",      price: 449, original_price: 599, description: "Deep amber resin blended with vanilla and dark patchouli." },
  { name: "Saffron Royale",  price: 499, original_price: 649, description: "Precious saffron with rose and oud — bold and opulent." },
  { name: "Cedar & Vetiver", price: 399, original_price: 499, description: "Earthy vetiver grounded in smoky cedarwood and tobacco leaf." },
];

async function main() {
  // Enable bundle settings
  const { error: settingsError } = await supabase
    .from("settings")
    .upsert(
      { id: 1, bundle: { enabled: true, bottle_count: 4, fixed_price: 1499, title: "Build Your Gift Set", subtitle: "Pick any 4 fragrances and get them for ₹1,499", banner_image_url: null } },
      { onConflict: "id" }
    );

  if (settingsError) console.error("Settings error:", settingsError.message);
  else console.log("✓ Bundle enabled — 4 bottles for ₹1,499");

  const { data: existingMax } = await supabase
    .from("bundle_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  let sort = (existingMax?.sort_order ?? -1) + 1;

  for (const item of PRODUCTS) {
    const slug = `${slugify(item.name)}-6ml-${Date.now().toString(36).slice(-4)}-${sort}`;

    const { data: product, error: pErr } = await supabase
      .from("products")
      .insert({ name: item.name, slug, short_description: item.description, featured_image_url: null, is_active: true, show_in_shop: false })
      .select("id")
      .single();

    if (pErr || !product) { console.error(`✗ "${item.name}":`, pErr?.message); continue; }

    const { data: variant, error: vErr } = await supabase
      .from("product_variants")
      .insert({ product_id: product.id, variant_name: "6ml", price: item.price, original_price: item.original_price, stock_quantity: 100, is_active: true })
      .select("id")
      .single();

    if (vErr || !variant) {
      console.error(`✗ Variant "${item.name}":`, vErr?.message);
      await supabase.from("products").delete().eq("id", product.id);
      continue;
    }

    const { error: bErr } = await supabase
      .from("bundle_items")
      .insert({ product_id: product.id, variant_id: variant.id, sort_order: sort, is_active: true });

    if (bErr) {
      console.error(`✗ Bundle item "${item.name}":`, bErr.message);
      await supabase.from("products").delete().eq("id", product.id);
      continue;
    }

    console.log(`✓ "${item.name}" — 6ml — ₹${item.price} (MRP ₹${item.original_price})`);
    sort++;
  }

  console.log("\nDone! Open /bundle to see the gift set page.");
}

main();
