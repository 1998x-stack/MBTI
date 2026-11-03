import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SMOKE_ASSETS = Object.freeze([
  { path: "", expect: 'id="screen-home"', type: "text/html" },
  { path: "styles.css", expect: ".app-shell", type: "text/css" },
  { path: "src/app.js", expect: "function init()", type: "javascript" },
  { path: "src/data/questions.js", expect: "export const questions", type: "javascript" },
  { path: "src/data/image-manifest.js", expect: "imageManifest", type: "javascript" },
  { path: "assets/images/all-animals_resized.png", type: "image/png" },
  { path: "assets/optimized/estj-bee-640.webp", type: "image/webp" },
]);

export function normalizePagesURL(value) {
  if (!value) throw new Error("Missing Pages deployment URL");
  const base = new URL(value);
  if (base.protocol !== "https:" || !base.hostname) {
    throw new Error("Pages URL must use HTTPS");
  }
  if (base.username || base.password || base.search || base.hash) {
    throw new Error("Pages URL must not contain credentials, query or fragment");
  }
  base.pathname = base.pathname.replace(/\/?$/, "/");
  return base;
}

export async function verifyPublishedSite(url, request = fetch) {
  const base = normalizePagesURL(url);
  for (const asset of SMOKE_ASSETS) {
    const target = new URL(asset.path, base);
    if (target.origin !== base.origin || !target.pathname.startsWith(base.pathname)) {
      throw new Error("Asset escaped Pages project path: " + target);
    }
    const response = await request(target, { headers: { "Cache-Control": "no-cache" } });
    if (!response.ok) throw new Error(target + " returned HTTP " + response.status);
    const mime = response.headers?.get("content-type")?.toLowerCase() ?? "";
    if (!mime.includes(asset.type) && !(asset.type === "javascript" && mime.includes("ecmascript"))) {
      throw new Error("Unexpected MIME for " + target + ": " + mime);
    }
    if (asset.expect && !(await response.text()).includes(asset.expect)) {
      throw new Error("Expected content missing from " + target);
    }
  }
  return { url: base.href, checked: SMOKE_ASSETS.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const base = process.argv[2];
  let error;
  for (let attempt = 1; attempt <= 12; attempt++) {
    try {
      const result = await verifyPublishedSite(base);
      console.log("Published site verified:", result.url, result.checked, "resources");
      process.exit(0);
    } catch (e) {
      error = e;
      console.error("Pages smoke attempt", attempt, "failed:", e.message);
      if (attempt < 12) await new Promise(done => setTimeout(done, 8_000));
    }
  }
  throw new Error("Published site did not pass smoke checks: " + error?.message);
}
