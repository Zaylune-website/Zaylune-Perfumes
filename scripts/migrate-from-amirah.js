// Migration script: Copy catalog/content data from Amirah Perfumes DB → Zaylune DB
// Run: node --env-file=.env scripts/migrate-from-amirah.js

const { Client } = require("pg");

// Source = Amirah, Target = Zaylune
// Windows env vars are case-insensitive so both direct/Direct resolve to same key.
// Hard-code the source string here to avoid ambiguity.
const SRC = "postgresql://postgres.dcvhcncipbyuhsyrhhiz:Amiarhs%400302@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";
const DST = process.env.Direct_connection_str;

if (!DST) {
  console.error("Missing Direct_connection_str in .env");
  process.exit(1);
}

const src = new Client({ connectionString: SRC, ssl: { rejectUnauthorized: false } });
const dst = new Client({ connectionString: DST, ssl: { rejectUnauthorized: false } });

async function copyTable(tableName, columns, { truncate = false, conflictTarget = null } = {}) {
  const rows = await src.query(`SELECT ${columns.join(", ")} FROM ${tableName}`);
  if (!rows.rows.length) {
    console.log(`  ${tableName}: 0 rows (skipped)`);
    return 0;
  }

  if (truncate) {
    await dst.query(`TRUNCATE TABLE ${tableName} CASCADE`);
  }

  const cols = columns.join(", ");
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const conflict = conflictTarget
    ? `ON CONFLICT (${conflictTarget}) DO NOTHING`
    : "ON CONFLICT DO NOTHING";

  let inserted = 0;
  for (const row of rows.rows) {
    const vals = columns.map((c) => row[c]);
    try {
      await dst.query(
        `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders}) ${conflict}`,
        vals
      );
      inserted++;
    } catch (e) {
      console.warn(`  Warning [${tableName}]: ${e.message.slice(0, 120)}`);
    }
  }
  console.log(`  ${tableName}: ${inserted}/${rows.rows.length} rows copied`);
  return inserted;
}

async function run() {
  await src.connect();
  await dst.connect();
  console.log("Connected to both databases.\n");

  // ── 1. categories ─────────────────────────────────────────────────────────
  await copyTable("categories", [
    "id", "name", "slug", "description", "image_url", "sort_order", "is_active", "created_at",
  ], { conflictTarget: "id" });

  // ── 2. products ───────────────────────────────────────────────────────────
  await copyTable("products", [
    "id", "category_id", "name", "slug", "short_description", "description",
    "concentration", "gender", "notes_top", "notes_middle", "notes_base",
    "featured_image_url", "badge", "average_rating", "review_count",
    "is_active", "is_featured", "seo_title", "seo_description",
    "show_in_shop", "created_at", "updated_at",
  ], { conflictTarget: "id" });

  // ── 3. product_variants ───────────────────────────────────────────────────
  await copyTable("product_variants", [
    "id", "product_id", "variant_name", "price", "original_price",
    "stock_quantity", "is_active", "bottle_type", "weight_grams", "created_at",
  ], { conflictTarget: "id" });

  // ── 4. product_images ─────────────────────────────────────────────────────
  await copyTable("product_images", [
    "id", "product_id", "image_url", "sort_order", "variant_name", "created_at",
  ], { conflictTarget: "id" });

  // ── 5. product_faqs ───────────────────────────────────────────────────────
  await copyTable("product_faqs", [
    "id", "product_id", "question", "answer", "display_order",
  ], { conflictTarget: "id" });

  // ── 6. hero_slides ────────────────────────────────────────────────────────
  await copyTable("hero_slides", [
    "id", "image_url", "title", "subtitle", "button_text", "button_link",
    "display_order", "is_active", "created_at",
  ], { conflictTarget: "id" });

  // ── 7. announcements ──────────────────────────────────────────────────────
  await copyTable("announcements", [
    "id", "message", "is_active", "created_at",
  ], { conflictTarget: "id" });

  // ── 8. testimonials ───────────────────────────────────────────────────────
  await copyTable("testimonials", [
    "id", "customer_name", "location", "review_text", "rating",
    "image_url", "display_order", "is_active", "created_at",
  ], { conflictTarget: "id" });

  // ── 9. coupons ────────────────────────────────────────────────────────────
  await copyTable("coupons", [
    "id", "code", "type", "value", "min_purchase", "is_active", "expires_at", "created_at",
  ], { conflictTarget: "id" });

  // ── 10. settings (shipping + bundle config) ────────────────────────────────
  // Overwrite the single row — Zaylune gets Amirah's shipping rates & bundle config
  const settingsRow = await src.query("SELECT shipping, quantity_discount, bundle FROM settings WHERE id = 1");
  if (settingsRow.rows.length) {
    const { shipping, quantity_discount, bundle } = settingsRow.rows[0];
    await dst.query(
      `UPDATE settings SET shipping = $1, quantity_discount = $2, bundle = $3 WHERE id = 1`,
      [shipping, quantity_discount, bundle]
    );
    console.log("  settings: shipping + quantity_discount + bundle config copied");
  }

  // ── 11. bundle_items ──────────────────────────────────────────────────────
  // Only copy if products/variants already exist in target (they do — copied above)
  await copyTable("bundle_items", [
    "id", "product_id", "variant_id", "sort_order", "is_active", "created_at",
  ], { conflictTarget: "id" });

  // ── 12. site_settings — only non-brand keys ────────────────────────────────
  // We keep Zaylune's brand_name/email/tagline; copy only operational settings
  const operationalKeys = ["whatsapp_number", "whatsapp_display", "facebook_url", "cod_enabled", "online_payment_enabled"];
  const siteRows = await src.query(
    `SELECT id, key, value, category, description, updated_at FROM site_settings WHERE key = ANY($1)`,
    [operationalKeys]
  );
  let siteCount = 0;
  for (const row of siteRows.rows) {
    try {
      await dst.query(
        `INSERT INTO site_settings (id, key, value, category, description, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [row.id, row.key, row.value, row.category, row.description, row.updated_at]
      );
      siteCount++;
    } catch (e) {
      console.warn(`  site_settings [${row.key}]: ${e.message.slice(0, 100)}`);
    }
  }
  console.log(`  site_settings: ${siteCount} operational keys copied`);

  console.log("\nMigration complete!");
  await src.end();
  await dst.end();
}

run().catch((e) => {
  console.error("Migration failed:", e.message);
  src.end().catch(() => {});
  dst.end().catch(() => {});
  process.exit(1);
});
