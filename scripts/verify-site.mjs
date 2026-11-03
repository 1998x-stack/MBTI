import { readFile, stat, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, dirname, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const maxDistBytes = 1_000_000;
const read = (p) => readFile(resolve(dist, p));
const report = JSON.parse(await read("build-report.json"));
if (report.schemaVersion !== "1.0.0" || report.profiles?.length !== 16) {
  throw new Error("Unexpected image build report");
}
const { imageManifest } = await import(pathToFileURL(resolve(dist, "src/data/image-manifest.js")).href);
if (Object.keys(imageManifest).length !== 16) throw new Error("Manifest must have 16 image sets");

const seen = new Set();
const resolvedWithinDist = (path) => {
  if (!path.startsWith("./assets/optimized/")) throw new Error("Unsafe optimized path: " + path);
  const output = resolve(dist, path);
  const rel = relative(dist, output);
  if (rel.startsWith("..") || rel.includes(".." + sep)) throw new Error("Asset path escapes dist: " + path);
  return output;
};

let variantBytes = 0;
for (const profile of report.profiles) {
  if (seen.has(profile.type) || profile.variants?.length !== 4) {
    throw new Error("Duplicate/missing profile variants: " + profile.type);
  }
  seen.add(profile.type);
  const asset = imageManifest[profile.type];
  if (!asset || !asset.fallback?.endsWith("-640.webp")) {
    throw new Error("Invalid manifest entry: " + profile.type);
  }
  const allReferences = [];
  for (const format of ["webp", "avif"]) {
    const parts = asset[format]?.split(",").map((part) => part.trim().split(/\s+/));
    if (!Array.isArray(parts) || parts.length !== 2 ||
        parts[0][1] !== "320w" || parts[1][1] !== "640w") {
      throw new Error("Invalid srcset for " + profile.type + " " + format);
    }
    allReferences.push(...parts.map(([path]) => path));
  }
  if (!allReferences.includes(asset.fallback)) throw new Error("Fallback missing from srcset: " + profile.type);
  for (const variant of profile.variants) {
    const output = resolvedWithinDist(variant.path);
    const bytes = await readFile(output);
    const meta = await sharp(bytes).metadata();
    if (bytes.length !== variant.bytes ||
        createHash("sha256").update(bytes).digest("hex") !== variant.sha256 ||
        meta.format !== variant.format || meta.width !== variant.width) {
      throw new Error("Invalid encoded image bytes, SHA-256 or dimensions: " + variant.path);
    }
    if (!allReferences.includes(variant.path)) throw new Error("Manifest does not reference: " + variant.path);
    variantBytes += bytes.length;
  }
}
if (variantBytes !== report.totals.webpBytes + report.totals.avifBytes) {
  throw new Error("Variant total size mismatch");
}

for (const p of ["index.html","styles.css","src/app.js","src/data/questions.js",
  "src/data/image-manifest.js","assets/images/all-animals_resized.png"]) {
  if ((await stat(resolve(dist, p))).size === 0) throw new Error("Empty build file: " + p);
}
const originals = (await readdir(resolve(dist,"assets/images"))).filter(p => p.endsWith(".png"));
if (originals.length !== 1 || originals[0] !== "all-animals_resized.png") {
  throw new Error("Release must exclude the 16 unoptimized source illustrations");
}
const html = (await read("index.html")).toString("utf8");
if (!html.includes('id="screen-home"') ||
    /(?:src|href)="\/(?:assets|src|styles)/.test(html)) {
  throw new Error("Site entry is missing or has absolute URLs unsafe for /MBTI/");
}

async function directoryBytes(path) {
  const entries = await readdir(path, {withFileTypes:true});
  let sum = 0;
  for (const entry of entries) {
    const full = resolve(path, entry.name);
    if (entry.isSymbolicLink()) throw new Error("No symlinks in published artifact");
    sum += entry.isDirectory() ? await directoryBytes(full) : (await stat(full)).size;
  }
  return sum;
}
const total = await directoryBytes(dist);
if (total > maxDistBytes) throw new Error("Publish artifact exceeds " + maxDistBytes + " bytes: " + total);
console.log("Verified dist:", seen.size, "types, 64 encoded images,",
  variantBytes, "image bytes,", total, "total bytes (max", maxDistBytes, ")");
