// Verification harness: reads the RENDERED HTML from a running server (never source).
// Usage: node tools/verify.mjs [baseUrl] [legacyUrlList.json]
import fs from 'node:fs';
const BASE = process.argv[2] || 'http://localhost:3100';
const legacy = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : [];
const get = async (u, redirect = 'follow') => { const r = await fetch(BASE + u, { redirect }); return { status: r.status, loc: r.headers.get('location'), text: redirect === 'follow' ? await r.text() : '' }; };
const sm = (await get('/sitemap.xml')).text;
const urls = [...sm.matchAll(/<loc>https:\/\/ck9ps\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
const problems = []; const links = new Set(); const titles = new Map(); const descs = new Map();
let pages = 0, imgsNoAlt = 0, ldErr = 0, faqPages = 0;
for (const u of urls) {
  const r = await get(u); pages++;
  if (r.status !== 200) { problems.push(`${u} -> ${r.status}`); continue; }
  const h = r.text;
  const h1 = (h.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) problems.push(`${u}: ${h1} <h1>`);
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ''; if (!t) problems.push(`${u}: no title`);
  if (t.length > 75) problems.push(`${u}: long title (${t.length})`);
  titles.set(t, [...(titles.get(t) || []), u]);
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''; if (!d) problems.push(`${u}: no meta description`);
  descs.set(d, [...(descs.get(d) || []), u]);
  if (!/<link rel="canonical" href="https:\/\/ck9ps\.com[^"]*"/.test(h)) problems.push(`${u}: no canonical`);
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url']) if (!h.includes(`property="${tag}"`)) problems.push(`${u}: missing ${tag}`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); const types = JSON.stringify(j).match(/"@type":"FAQPage"/); if (types) faqPages++; } catch { ldErr++; problems.push(`${u}: bad JSON-LD`); }
  }
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(m[0])) { imgsNoAlt++; }
  for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) links.add(m[1]);
  if (/media:/.test(h)) problems.push(`${u}: unresolved media: reference`);
}
let broken = 0;
for (const l of links) {
  if (/^\/(_next|media|brand)\//.test(l) || l === '/api/inquiry/') continue;
  const r = await get(l, 'manual');
  if (r.status >= 400) { broken++; problems.push(`broken link ${l} -> ${r.status}`); }
}
let legacyBad = 0;
for (const u of legacy) {
  const r = await get(u, 'manual');
  if (!(r.status === 200 || (r.status >= 301 && r.status <= 308))) { legacyBad++; problems.push(`legacy ${u} -> ${r.status}`); }
}
for (const [t, us] of titles) if (us.length > 1) problems.push(`duplicate title "${t}" x${us.length}`);
for (const [d, us] of descs) if (us.length > 1 && d) problems.push(`duplicate description x${us.length}: ${us.slice(0, 3).join(', ')}`);
console.log(JSON.stringify({ pages, internalLinks: links.size, brokenLinks: broken, legacyChecked: legacy.length, legacyBad, imgsMissingAlt: imgsNoAlt, jsonLdErrors: ldErr, faqPages, problems: problems.length }, null, 1));
console.log(problems.slice(0, 80).join('\n'));
