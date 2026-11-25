#!/usr/bin/env node
// Copy lint for the built site. Reads the static HTML in .next/server/app (run `npm run build` first)
// and the CSS under app/, then prints a count and up to five examples for each pattern below.
// Exits 0 unless --strict is passed, in which case any hit exits 1. Not part of the build.
// Usage: npm run lint:copy [-- --strict] [-- --dir path/to/html]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const dirArg = args.indexOf('--dir');
const ROOT = process.cwd();
const HTML_DIR = dirArg >= 0 ? args[dirArg + 1] : join(ROOT, '.next/server/app');
const CSS_DIRS = [join(ROOT, 'app'), join(ROOT, 'components'), join(ROOT, 'styles')];

function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, ext, out);
    else if (name.endsWith(ext)) out.push(p);
  }
  return out;
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', bull: '•', rarr: '→', raquo: '»', rsaquo: '›', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–', hellip: '…' };
const decode = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const strip = (html) => html.replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, ' ');

const checks = {
  'real / really': [],
  'quiet / quietly': [],
  'one- or two-word sentences in paragraphs': [],
  'arrows in link or button text': [],
  'middots and bullets in main': [],
  'eyebrow / kicker / overline elements': [],
  'border-left accent rules in CSS': [],
};
const hit = (k, where, sample) => checks[k].push({ where, sample: sample.slice(0, 120) });

if (!existsSync(HTML_DIR)) {
  console.error(`No build output at ${relative(ROOT, HTML_DIR) || HTML_DIR}. Run the build first.`);
  process.exit(strict ? 1 : 0);
}

const pages = walk(HTML_DIR, '.html').filter((p) => !/_not-found|\/(404|500)\.html$/.test(p)).sort();
for (const file of pages) {
  const where = '/' + relative(HTML_DIR, file).replace(/(index)?\.html$/, '').replace(/\/$/, '');
  const html = strip(readFileSync(file, 'utf8'));
  const bodyM = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyM ? bodyM[1] : html;
  const mainM = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const main = mainM ? mainM[1] : body;
  const all = text(body);

  for (const [k, re] of [['real / really', /\breal(ly)?\b/gi], ['quiet / quietly', /\bquiet(ly)?\b/gi]]) {
    for (const m of all.matchAll(re)) hit(k, where, all.slice(Math.max(0, m.index - 50), m.index + 40));
  }

  for (const pm of main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = text(pm[1]);
    const ss = t.split(/(?<=[.!?])\s+/);
    if (ss.length < 2) continue;
    ss.forEach((s, i) => {
      if (i === 0) return;
      const ws = s.match(/[A-Za-z0-9'’-]+/g) || [];
      if (ws.length >= 1 && ws.length <= 2 && s.endsWith('.') && !/\d/.test(s) && s.length < 30) hit('one- or two-word sentences in paragraphs', where, `${ss[i - 1].slice(-60)} ${s}`);
    });
  }

  for (const am of body.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = text(am[2]);
    if (/[→›»➜➔⟶←‹«]/.test(t)) hit('arrows in link or button text', where, t);
  }

  const mt = text(main);
  for (const m of mt.matchAll(/\S\s*[·•]\s*\S/g)) hit('middots and bullets in main', where, mt.slice(Math.max(0, m.index - 40), m.index + 40));

  for (const em of body.matchAll(/<[a-z0-9]+\b[^>]*class="([^"]*)"[^>]*>/gi)) {
    if (/(^|\s)[\w-]*(eyebrow|kicker|overline)[\w-]*(\s|$)/i.test(em[1])) hit('eyebrow / kicker / overline elements', where, em[0]);
  }
}

for (const dir of CSS_DIRS) {
  for (const file of [...walk(dir, '.css'), ...walk(dir, '.scss')]) {
    const css = readFileSync(file, 'utf8');
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const decl = m[2];
      const bl = decl.match(/border-left\s*:\s*([^;]+)/i) || decl.match(/border-inline-start\s*:\s*([^;]+)/i);
      if (!bl) continue;
      const v = bl[1].trim();
      // Flag any visible left bar except a hairline (under 2px) or none/0.
      const px = v.match(/([\d.]+)px/);
      if (/^(none|0)\b/.test(v) || (px && parseFloat(px[1]) < 2)) continue;
      hit('border-left accent rules in CSS', relative(ROOT, file), `${m[1].trim().split('\n').pop()} { border-left: ${v} }`);
    }
  }
}

let total = 0;
console.log(`copy-lint: ${pages.length} pages in ${relative(ROOT, HTML_DIR) || HTML_DIR}\n`);
for (const [k, list] of Object.entries(checks)) {
  total += list.length;
  const pagesHit = new Set(list.map((x) => x.where)).size;
  console.log(`${String(list.length).padStart(5)}  ${k}${list.length ? ` (${pagesHit} ${pagesHit === 1 ? 'file' : 'files'})` : ''}`);
  for (const x of list.slice(0, 5)) console.log(`         ${x.where}: ${x.sample}`);
}
console.log(`\n${total} hits in total.${strict ? '' : ' Run with --strict to fail on any hit.'}`);
process.exit(strict && total > 0 ? 1 : 0);
