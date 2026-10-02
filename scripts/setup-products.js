// Keeps 10 selected products in Zaylune DB, re-uploads their images to Zaylune ImageKit,
// deletes everything else. Run: node --env-file=.env scripts/setup-products.js

const { Client } = require("pg");
const https = require("https");

const KEEP_SLUGS = [
  "hawas",
  "hawas-ice",
  "sauvage",
  "bombshell",
  "velvet",
  "la-vie-est-belle",
  "khamrah",
  "rebel",
  "caramel-oud",
  "gucci-flora",
];

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const AUTH_HEADER = "Basic " + Buffer.from(IMAGEKIT_PRIVATE_KEY + ":").toString("base64");

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ buf: Buffer.concat(chunks), type: res.headers["content-type"] || "image/png" }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function uploadToImageKit(sourceUrl, fileName, folder) {
  const { buf, type } = await downloadBuffer(sourceUrl);
  const boundary = "----IKBound" + Date.now();
  const CRLF = "\r\n";
  const parts = [
    Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${fileName}"${CRLF}Content-Type: ${type}${CRLF}${CRLF}`),
    buf,
    Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="fileName"${CRLF}${CRLF}${fileName}${CRLF}`),
    Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="folder"${CRLF}${CRLF}${folder}${CRLF}`),
    Buffer.from(`--${boundary}--${CRLF}`),
  ];
  const body = Buffer.concat(parts);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "upload.imagekit.io",
        path: "/api/v1/files/upload",
        method: "POST",
        headers: {
          Authorization: AUTH_HEADER,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.url) resolve(json.url);
            else reject(new Error(json.message || JSON.stringify(json).slice(0, 200)));
          } catch (e) {
            reject(new Error("Bad response: " + data.slice(0, 120)));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  if (!IMAGEKIT_PRIVATE_KEY) { console.error("Missing IMAGEKIT_PRIVATE_KEY"); process.exit(1); }

  const db = new Client({ connectionString: process.env.Direct_connection_str, ssl: { rejectUnauthorized: false } });
  await db.connect();
  console.log("Connected to Zaylune DB.\n");

  // ── 1. Get the 10 selected products ────────────────────────────────────────
  const keepResult = await db.query(
    "SELECT id, name, slug, featured_image_url FROM products WHERE slug = ANY($1)",
    [KEEP_SLUGS]
  );
  if (!keepResult.rows.length) {
    console.error("No matching products found. Check KEEP_SLUGS."); await db.end(); process.exit(1);
  }

  const keepIds = keepResult.rows.map((r) => r.id);
  console.log(`Keeping ${keepResult.rows.length} products:`);
  keepResult.rows.forEach((r) => console.log(`  - ${r.name} (${r.slug})`));

  // ── 2. Re-upload images to Zaylune ImageKit ────────────────────────────────
  console.log("\nUploading images to Zaylune ImageKit...\n");

  for (const product of keepResult.rows) {
    const folder = `/zaylune/products/${product.slug}`;
    process.stdout.write(`  ${product.slug}: `);

    // featured image
    if (product.featured_image_url) {
      try {
        const newUrl = await uploadToImageKit(product.featured_image_url, "featured.jpg", folder);
        await db.query("UPDATE products SET featured_image_url = $1 WHERE id = $2", [newUrl, product.id]);
        process.stdout.write("F");
      } catch (e) {
        process.stdout.write("f(fail:" + e.message.slice(0, 40) + ")");
      }
    }

    // gallery images
    const imgs = await db.query(
      "SELECT id, image_url, sort_order FROM product_images WHERE product_id = $1 ORDER BY sort_order",
      [product.id]
    );
    for (const img of imgs.rows) {
      try {
        const newUrl = await uploadToImageKit(img.image_url, `gallery-${img.sort_order}.jpg`, folder);
        await db.query("UPDATE product_images SET image_url = $1 WHERE id = $2", [newUrl, img.id]);
        process.stdout.write("G");
      } catch (e) {
        process.stdout.write("x");
      }
    }
    console.log(` done`);
  }

  // ── 3. Final summary ───────────────────────────────────────────────────────
  const finalProds = await db.query("SELECT name, slug FROM products ORDER BY name");
  const finalCats = await db.query("SELECT name FROM categories ORDER BY name");
  console.log(`\nZaylune DB final state:`);
  console.log(`  Products (${finalProds.rows.length}): ${finalProds.rows.map(r=>r.name).join(", ")}`);
  console.log(`  Categories (${finalCats.rows.length}): ${finalCats.rows.map(r=>r.name).join(", ")}`);

  await db.end();
}

run().catch((e) => { console.error("\nFatal:", e.message); process.exit(1); });
