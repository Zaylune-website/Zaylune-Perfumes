import { NextResponse } from "next/server";
import https from "https";

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const AUTH = "Basic " + Buffer.from(PRIVATE_KEY + ":").toString("base64");

function uploadToImageKit(fileBuffer, mimeType, fileName, folder) {
  const boundary = "----IKBound" + Date.now();
  const CRLF = "\r\n";
  const parts = [
    Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${fileName}"${CRLF}Content-Type: ${mimeType}${CRLF}${CRLF}`),
    fileBuffer,
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
          Authorization: AUTH,
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
            else reject(new Error(json.message || "Upload failed"));
          } catch {
            reject(new Error("Invalid response from ImageKit"));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "/zaylune";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const fileName = file.name || `upload-${Date.now()}.jpg`;

    const url = await uploadToImageKit(buffer, mimeType, fileName, folder);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
