import test from "node:test";
import assert from "node:assert/strict";
import { normalizePagesURL, verifyPublishedSite, SMOKE_ASSETS } from "../../scripts/smoke-pages.mjs";

test("Pages URL preserves project subpath and requires HTTPS", () => {
  assert.equal(normalizePagesURL("https://1998x-stack.github.io/MBTI").href,
    "https://1998x-stack.github.io/MBTI/");
  assert.throws(() => normalizePagesURL("http://x.test/MBTI"), /HTTPS/);
  assert.throws(() => normalizePagesURL("https://x.test/MBTI?secret=x"), /query/);
  assert.throws(() => normalizePagesURL(""), /Missing/);
});

test("smoke checker probes all assets underneath /MBTI/", async () => {
  const seen = [];
  const result = await verifyPublishedSite("https://example.org/MBTI/", async (url) => {
    seen.push(url.pathname);
    const asset = SMOKE_ASSETS.find(item => url.pathname.endsWith("/MBTI/" + item.path));
    return {
      ok:true, status:200,
      headers:{get:()=>asset?.type==="javascript"?"text/javascript":asset?.type},
      text:async()=>asset?.expect ?? ""
    };
  });
  assert.equal(result.checked, 7);
  assert.equal(seen[0], "/MBTI/");
  assert.equal(seen.length, 7);
  assert.ok(seen.every(path=>path.startsWith("/MBTI/")));
});

test("smoke checker rejects missing assets, MIME errors, and invalid HTML", async () => {
  const base="https://example.org/MBTI/";
  await assert.rejects(verifyPublishedSite(base,async()=>({ok:false,status:404,headers:{get:()=>""}})), /404/);
  await assert.rejects(verifyPublishedSite(base,async()=>({
    ok:true,status:200,headers:{get:()=>"image/jpeg"},text:async()=>""})), /MIME/);
  await assert.rejects(verifyPublishedSite(base,async()=>({
    ok:true,status:200,headers:{get:()=>"text/html"},text:async()=>""})), /Expected content/);
});
