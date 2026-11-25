#!/usr/bin/env node
/**
 * indexnow.mjs — tell Bing (and Yandex, Seznam, Naver) about ck9ps.com pages
 * that are new or have changed, instead of waiting to be crawled.
 *
 *     npm run indexnow                    submit what changed since last time
 *     npm run indexnow -- --dry           show what would be submitted, send nothing
 *     npm run indexnow -- --all           submit every URL in the sitemap
 *     npm run indexnow -- --state FILE    where the record of past submissions lives
 *                                         (default: .indexnow-state.json, git-ignored)
 *     npm run indexnow -- --sitemap URL   read another sitemap (a URL or a local file)
 *
 * Adapted from the Bellingham Sasquatch site's scripts/indexnow.mjs. Zero
 * dependencies, no build needed: it reads the LIVE sitemap, so it only ever
 * submits pages that are actually published.
 *
 * WHAT THIS IS AND IS NOT. IndexNow is an open submission protocol that
 * Microsoft Bing, Yandex, Seznam and Naver consume. Submitting a URL is a
 * request to recrawl, not a promise of indexing — the engines still decide.
 *
 * GOOGLE IS NOT HERE, AND THAT IS NOT AN OVERSIGHT. Google does not take part
 * in IndexNow and has no public API for submitting ordinary pages (its
 * Indexing API covers job postings and livestreams only). For Google the
 * mechanism is /sitemap.xml, which every build regenerates, plus Request
 * Indexing in Search Console for a page that genuinely cannot wait.
 *
 * WHAT COUNTS AS CHANGED. Each sitemap entry carries a lastmod. This compares
 * the live sitemap against the last state we successfully submitted and sends
 * only pages that are new or whose lastmod moved FORWARD. Re-sending the whole
 * site on every deploy is the noise that teaches an engine to ignore a host.
 *
 * WHERE THE STATE LIVES. The GitHub workflow keeps it on its own branch,
 * `indexnow-state`, not on main — so the bot never commits to main (no extra
 * production deploys, nothing for anyone to pull) and vercel.json tells Vercel
 * not to deploy that branch. See .github/workflows/indexnow.yml.
 */
import fs from 'node:fs';

const HOST = 'ck9ps.com';
const KEY = '2e43307a92d89e735f345960a373c235';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const dry = flag('--dry');
const all = flag('--all');
const STATE = opt('--state', '.indexnow-state.json');
const SITEMAP = opt('--sitemap', `https://${HOST}/sitemap.xml`);

const UA = 'ck9ps-indexnow/1.0 (+https://ck9ps.com/)';
async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'manual' });
  return { status: res.status, text: await res.text().catch(() => '') };
}

/* The key file has to be served at the host root or every submission is
   rejected as unverified. Checked here rather than discovered in a 403. */
const localKey = new URL(`../public/${KEY}.txt`, import.meta.url);
if (!fs.existsSync(localKey) || fs.readFileSync(localKey, 'utf8').trim() !== KEY) {
  console.error(`key file missing or wrong: public/${KEY}.txt must contain exactly ${KEY}`);
  process.exit(1);
}
if (!dry) {
  const k = await get(KEY_LOCATION);
  if (k.status !== 200 || k.text.trim() !== KEY) {
    console.error(`live key file not served: ${KEY_LOCATION} returned ${k.status}. Deploy first.`);
    process.exit(1);
  }
  console.log(`key file live: ${KEY_LOCATION} → 200`);
}

/* Every <loc> and its <lastmod>. Only this host's URLs; anything else in the
   sitemap would be rejected by the endpoint anyway. */
const xml = /^https?:\/\//.test(SITEMAP)
  ? await get(SITEMAP).then((r) => {
      if (r.status !== 200) {
        console.error(`sitemap ${SITEMAP} returned ${r.status}`);
        process.exit(1);
      }
      return r.text;
    })
  : fs.readFileSync(SITEMAP, 'utf8');

const current = new Map();
for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
  const loc = (block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1];
  const lastmod = (block.match(/<lastmod>\s*([^<\s]*)\s*<\/lastmod>/) || [])[1] || '';
  if (loc && new URL(loc).host === HOST) current.set(loc, lastmod);
}
if (!current.size) {
  console.error(`no ${HOST} URLs found in ${SITEMAP} — nothing to do.`);
  process.exit(1);
}

const previous = fs.existsSync(STATE)
  ? JSON.parse(fs.readFileSync(STATE, 'utf8'))
  : { submitted: {}, runs: [] };

/* FORWARD-ONLY, not merely different: a lastmod that moved backward is a
   correction, not a change, and is not worth telling an engine about. */
const changed = [];
for (const [url, lastmod] of current) {
  const already = previous.submitted[url];
  if (all || already === undefined || lastmod > already) changed.push(url);
}

console.log(`sitemap: ${current.size} URLs`);
console.log(`new or changed since last submission: ${changed.length}`);
for (const u of changed.slice(0, 12)) console.log(`  ${u}`);
if (changed.length > 12) console.log(`  … and ${changed.length - 12} more`);

if (!changed.length) {
  console.log('nothing to submit.');
  process.exit(0);
}
if (dry) {
  console.log('\n--dry: nothing sent.');
  process.exit(0);
}

/* 10,000 URLs per request is the documented ceiling; batching well under it
   keeps a single failure small. */
const BATCH = 2000;
let sent = 0;
for (let i = 0; i < changed.length; i += BATCH) {
  const urlList = changed.slice(i, i + BATCH);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8', 'user-agent': UA },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  /* 200 accepted, 202 accepted while the key is still being validated. */
  if (res.status !== 200 && res.status !== 202) {
    const body = await res.text().catch(() => '');
    console.error(`\nFAILED: HTTP ${res.status} ${body.slice(0, 200)}`);
    console.error('State not updated, so the next run retries these.');
    process.exit(1);
  }
  sent += urlList.length;
  console.log(`submitted ${urlList.length} URLs — HTTP ${res.status}`);
}

/* Record the later of the two, so the state only ever moves forward. */
for (const [url, lastmod] of current) {
  const already = previous.submitted[url];
  if (already === undefined || lastmod > already) previous.submitted[url] = lastmod;
}
previous.runs = [{ at: new Date().toISOString(), count: sent }, ...(previous.runs || [])].slice(0, 20);
fs.writeFileSync(STATE, JSON.stringify(previous, null, 2) + '\n');
console.log(`\ndone — ${sent} URLs submitted, state recorded in ${STATE}`);
