// node --env-file=.env scripts/update_bundle_price.js
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { error } = await supabase
    .from("settings")
    .upsert({
      id: 1,
      bundle: {
        enabled: true,
        bottle_count: 4,
        fixed_price: 799,
        title: "Create Your Own Gift Set",
        subtitle: "Pick any 4 attars (6ml each) for just ₹799",
        banner_image_url: null,
      },
    }, { onConflict: "id" });

  if (error) console.error("Error:", error.message);
  else console.log("✓ Bundle price updated — Any 4 for ₹799");
}
main();
