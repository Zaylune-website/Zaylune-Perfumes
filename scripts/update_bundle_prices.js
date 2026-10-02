// node --env-file=.env scripts/update_bundle_prices.js
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  // Get all active bundle item variant IDs
  const { data, error } = await supabase
    .from("bundle_items")
    .select("variant_id")
    .eq("is_active", true);

  if (error || !data?.length) {
    console.error("Failed to fetch bundle items:", error?.message);
    return;
  }

  const variantIds = data.map((r) => r.variant_id);

  const { error: updateError } = await supabase
    .from("product_variants")
    .update({ price: 249 })
    .in("id", variantIds);

  if (updateError) console.error("Update error:", updateError.message);
  else console.log(`✓ Updated ${variantIds.length} variants — price set to ₹249`);
}
main();
