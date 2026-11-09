// Keystone Dimension 14 mechanical check + 320/390px overflow check, run per TEMPLATE against a running server.
// Needs dev deps: npm i -D playwright axe-core   (a silent run is NOT a pass for the human accessibility review)
// Usage: node tools/a11y-mobile.mjs [baseUrl]
import { chromium } from 'playwright';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.argv[2] || 'http://localhost:3000';
const TEMPLATES = ['/', '/bed-bug-control/', '/hotels-hospitality-pest-control/', '/nationwide-k9-rodent-detection/', '/k9-bed-bug-detection-aiken-sc/',
  '/pest-control-aiken-south-carolina/', '/pest-control-houndslake-aiken-sc/', '/pest-library/norway-rat/', '/canine-scent-detection-science/',
  '/service-areas/', '/pest-library/', '/coastal-k9-blog/', '/about/', '/contact/', '/coastal-k9-image-gallery/', '/k9-detection-video-library/', '/thank-you/', '/pest-control-augusta-ga/'];
const b = await chromium.launch(); let fails = 0;
for (const width of [1366, 390, 320]) {
  const pg = await b.newPage({ viewport: { width, height: 900 } });
  for (const p of TEMPLATES) {
    await pg.goto(BASE + p, { waitUntil: 'networkidle' });
    const sw = await pg.evaluate(() => document.documentElement.scrollWidth);
    if (sw > width) { fails++; console.log(`OVERFLOW ${width}px ${p} scrollWidth=${sw}`); }
    await pg.addScriptTag({ content: axe });
    const v = await pg.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.map((x) => `${x.id}(${x.nodes.length})`));
    if (v.length) { fails++; console.log(`AXE ${width}px ${p}: ${v.join(', ')}`); }
  }
  await pg.close();
}
await b.close();
console.log(fails ? `${fails} template issue(s)` : `0 mechanical issues across ${TEMPLATES.length} templates × 3 widths (human review still required)`);
