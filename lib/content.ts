import pagesJson from '@/content/pages.json';
import mediaJson from '@/content/media.json';
import galleryJson from '@/content/gallery.json';
import altJson from '@/content/alt-overrides.json';
import { ICONS } from './icons';

export type Hero = {
  eyebrow?: string; h1?: string; lead?: string; meta?: string;
  badges?: string[]; ctas?: { label: string; href: string }[];
};
export type Page = {
  path: string; slug: string; wpType: string; kind: string; title: string; description: string;
  h1: string; hero: Hero; heroImage: string | null; body: string; faqs: { q: string; a: string }[];
  toc: { id: string; text: string }[]; citations: { name: string; url: string }[]; images: string[];
  date: string; modified: string; excerpt: string; words: number; noindex: boolean;
  citySvc?: { service: string; city: string };
};
export type Media = { alt: string; w: number; h: number; sizes: { w: number; h: number; src: string }[] };

export const PAGES = pagesJson as unknown as Page[];
export const MEDIA = mediaJson as unknown as Record<string, Media>;
export const GALLERY = galleryJson as unknown as string[];
/** Alt text written from looking at each photo (replaces the generic/inaccurate legacy alts). */
const ALT = altJson as Record<string, string>;

const BY_PATH = new Map(PAGES.map((p) => [p.path, p]));
export const getPage = (path: string) => BY_PATH.get(path);
export const byKind = (kind: string) => PAGES.filter((p) => p.kind === kind);

/** Paths that exist on the new site (used to neutralise dead links in legacy copy). */
const LIVE = new Set(PAGES.filter((p) => p.kind !== 'redirect').map((p) => p.path));
const LINK_FIX: Record<string, string> = {
  '/pest-control-columbia-pest-control-sc/': '/columbia-sc-pest-control/',
  '/bed-bugs-hotels-multifamily-playbook/': '/hotels-hospitality-pest-control/',
  '/nationwide-rodent-mitigation/': '/nationwide-k9-rodent-detection/',
  '/profile/kim-camera/': '/about/',
};

export function img(name: string | null | undefined) {
  return name ? MEDIA[name] : undefined;
}

export function imgTag(name: string, alt?: string, opts: { eager?: boolean; sizes?: string; cls?: string } = {}) {
  const m = MEDIA[name];
  if (!m) return '';
  const srcset = m.sizes.map((s) => `${s.src} ${s.w}w`).join(', ');
  const a = (ALT[name] ?? alt ?? m.alt ?? '').replace(/"/g, '&quot;');
  const largest = m.sizes[m.sizes.length - 1];
  return `<img src="${largest.src}" srcset="${srcset}" sizes="${opts.sizes ?? '(max-width: 900px) 100vw, 860px'}" width="${largest.w}" height="${largest.h}" alt="${a}" ${opts.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${opts.cls ? ` class="${opts.cls}"` : ''}>`;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Turn the sanitised legacy body into production HTML. */
export function renderBody(html: string): string {
  let out = html;
  // images
  out = out.replace(/<img([^>]*?)src="media:([^"]+)"([^>]*)>/g, (_m, a, name, b) => {
    const alt = (/alt="([^"]*)"/.exec(a + b) || [])[1];
    return imgTag(name, alt ? alt.replace(/&amp;/g, '&') : undefined);
  });
  // gallery thumbnails render ~220px wide — let the browser pick the 640w file, not 1280w
  out = out.replace(/<figure class="k-gallery">[\s\S]*?<\/figure>\s*<\/figure>|<figure class="k-gallery">[\s\S]*?(?=<h2|$)/g, (blk) =>
    blk.replace(/sizes="[^"]*"/g, 'sizes="(max-width: 600px) 50vw, 240px"'));
  // remote images that were not migrated (badges hosted elsewhere) – lazy + decoding
  out = out.replace(/<img(?![^>]*loading=)([^>]*)>/g, '<img loading="lazy" decoding="async"$1>');
  // YouTube iframes -> click-to-load facade (no third-party JS until the visitor asks)
  out = out.replace(/<iframe[^>]*src="https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})[^"]*"[^>]*>\s*<\/iframe>/g,
    (_m, id) => `<figure class="k-ytfig"><div class="k-yt" data-yt="${id}" data-title="${VIDEO_TITLES[id] ?? 'Coastal K9 video'}"><button type="button" aria-label="Play video: ${VIDEO_TITLES[id] ?? 'Coastal K9 video'}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="k-yt-play" aria-hidden="true"></span></button></div><figcaption>${VIDEO_TITLES[id] ?? 'Coastal K9 video'}</figcaption></figure>`);
  // other iframes (maps) – lazy
  out = out.replace(/<iframe(?![^>]*loading=)/g, '<iframe loading="lazy"');
  // icons
  out = out.replace(/<span aria-hidden="true" class="k-ic" data-icon="([^"]+)"><\/span>/g, (_m, n) => icon(n));
  // internal links: fix known moves; neutralise links to pages that do not exist (legacy 404s)
  out = out.replace(/<a href="(\/[^"#]*)(#[^"]*)?"([^>]*)>([\s\S]*?)<\/a>/g, (m, path, hash = '', rest, inner) => {
    if (/^\/(media|wp-content|brand)\//.test(path) || /\.\w{2,4}$/.test(path)) return m;
    const fixed = LINK_FIX[path] ?? path;
    if (fixed === '/' || LIVE.has(fixed)) return `<a href="${fixed}${hash}"${rest}>${inner}</a>`;
    return `<span class="k-deadlink">${inner}</span>`;
  });
  // external links open safely
  out = out.replace(/<a href="(https?:\/\/[^"]+)" rel="noopener">/g, '<a href="$1" rel="noopener" target="_blank">');
  // tables: wrap for horizontal scroll on phones
  out = out.replace(/<table/g, '<div class="k-tablewrap" role="region" aria-label="Comparison table" tabindex="0"><table').replace(/<\/table>/g, '</table></div>');
  return out;
}

// Generic, topic-relevant titles for the YouTube embeds (no published titles were available).
const VIDEO_TITLES: Record<string, string> = {
  x5htvQ2lEtE: 'K9 detection in action', LGmStZNv2dA: 'Our detection dogs at work', U0opRCsZjPQ: 'Inside a Coastal K9 inspection',
  rXHDCYilQBQ: 'Working with the Coastal K9 team', H0NAGMj7Ir4: 'Behind the scenes at Coastal K9',
};
export function icon(name: string) {
  const d = ICONS[name] ?? ICONS['paw'];
  return `<svg class="k-ic" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

export function plain(s: string) {
  return (s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '’').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export { esc };

/** Related pages for internal linking. */
export const TOPICS: { key: string; label: string; test: RegExp }[] = [
  { key: 'bed-bugs', label: 'Bed bugs', test: /bed.?bug/i },
  { key: 'rodents', label: 'Rats, mice & burrows', test: /rodent|rat\b|rats|burrow|mouse|mice/i },
  { key: 'bats', label: 'Bats', test: /\bbats?\b|white-nose/i },
  { key: 'geese-birds', label: 'Geese & birds', test: /goose|geese|bird/i },
  { key: 'spiders', label: 'Spiders', test: /spider/i },
  { key: 'k9', label: 'Detection dogs & commercial compliance', test: /.*/ },
];
export const postTopic = (p: Page) => TOPICS.find((t) => t.test.test(p.h1 + ' ' + p.path))!.key;

export const PEST_GROUPS: { label: string; slugs: string[] }[] = [
  { label: 'Bed bugs & rodents — our detection dogs’ specialty', slugs: ['bed-bug', 'norway-rat', 'roof-rat', 'house-mouse'] },
  { label: 'Cockroaches & ants', slugs: ['german-cockroach', 'american-cockroach', 'odorous-house-ant', 'carpenter-ant', 'pharaoh-ant', 'red-imported-fire-ant'] },
  { label: 'Birds & geese', slugs: ['canada-goose', 'pigeon', 'european-starling', 'house-sparrow'] },
  { label: 'Wildlife', slugs: ['raccoon', 'virginia-opossum', 'eastern-gray-squirrel', 'bat', 'nine-banded-armadillo', 'eastern-mole'] },
  { label: 'Stinging insects', slugs: ['yellowjacket', 'paper-wasp'] },
  { label: 'Ticks, mosquitoes & fleas', slugs: ['lone-star-tick', 'asian-tiger-mosquito', 'cat-flea'] },
  { label: 'Spiders & occasional invaders', slugs: ['black-widow-spider', 'brown-recluse-spider', 'silverfish', 'house-fly'] },
  { label: 'Termites (handled through our licensed partner)', slugs: ['eastern-subterranean-termite'] },
];

export function related(p: Page, n = 6): Page[] {
  const pool = (k: string) => PAGES.filter((x) => x.kind === k && x.path !== p.path);
  let list: Page[] = [];
  if (p.kind === 'city-service' && p.citySvc) {
    list = [
      ...PAGES.filter((x) => x.citySvc?.city === p.citySvc!.city && x.path !== p.path),
      ...PAGES.filter((x) => x.citySvc?.service === p.citySvc!.service && x.path !== p.path),
    ];
  } else if (p.kind === 'neighborhood') list = pool('neighborhood');
  else if (p.kind === 'city') { const ga = p.path.endsWith('-ga/'); const all = pool('city'); list = [...all.filter((x) => x.path.endsWith('-ga/') === ga), ...all.filter((x) => x.path.endsWith('-ga/') !== ga)]; }
  else if (p.kind === 'pest') { const g = PEST_GROUPS.find((g) => g.slugs.some((x) => p.path === `/pest-library/${x}/`)); const all = pool('pest'); list = [...all.filter((x) => g?.slugs.some((y) => x.path === `/pest-library/${y}/`)), ...all.filter((x) => !g?.slugs.some((y) => x.path === `/pest-library/${y}/`))]; }
  else if (p.kind === 'post') { const t = postTopic(p); const all = pool('post'); list = [...all.filter((x) => postTopic(x) === t), ...all.filter((x) => postTopic(x) !== t)]; }
  else if (p.kind === 'commercial') list = pool('commercial');
  else if (p.kind === 'nationwide') list = pool('nationwide');
  else if (p.kind === 'service') list = pool('service');
  const seen = new Set<string>();
  return list.filter((x) => (seen.has(x.path) ? false : (seen.add(x.path), true))).slice(0, n);
}

export const shortTitle = (p: Page) => plain(p.h1 || p.title).replace(/\s*[—–|].*$/, '');

const BRAND = ' | Coastal K9';
const TITLE_OVERRIDES: Record<string, string> = {
  '/coastal-k9-blog/': 'K9 Detection & Pest Control Blog',
  '/norway-rat-burrow-mitigation/': 'Norway Rat Burrows: Identify, Treat & Prevent',
};
/** Title tag: page title + short brand when it fits in ~65 chars; otherwise trimmed at a natural break. */
export function seoTitle(p: Page): string {
  let t = (TITLE_OVERRIDES[p.path] || p.title).replace(/\s*\|\s*Coastal K9.*$/i, '').trim();
  if (t.length + BRAND.length <= 66) return t + BRAND;
  if (t.length <= 66) return t;
  const cut = t.slice(0, 66);
  const at = Math.max(cut.lastIndexOf(':'), cut.lastIndexOf(' —'), cut.lastIndexOf(' –'), cut.lastIndexOf(' |'), cut.lastIndexOf(','));
  return (at > 30 ? cut.slice(0, at) : cut.slice(0, cut.lastIndexOf(' '))).replace(/[\s,:;—–-]+$/, '');
}

/** Service page -> pest library entries it covers (internal linking hub-and-spoke). */
const PL = (...slugs: string[]) => slugs.map((x) => `/pest-library/${x}/`);
export const SERVICE_PESTS: Record<string, string[]> = {
  '/bed-bug-control/': PL('bed-bug'),
  '/bed-bug-treatment/': PL('bed-bug'),
  '/rodent-control/': PL('norway-rat', 'roof-rat', 'house-mouse'),
  '/rat-mouse-control/': PL('norway-rat', 'roof-rat', 'house-mouse'),
  '/repairs/': PL('norway-rat', 'roof-rat', 'house-mouse', 'eastern-gray-squirrel', 'raccoon', 'virginia-opossum', 'bat', 'nine-banded-armadillo'),
  '/goose-control/': PL('canada-goose'),
  '/hoa-golf-course-goose-management/': PL('canada-goose'),
  '/bird-exclusion/': PL('pigeon', 'european-starling', 'house-sparrow'),
  '/falconry-bird-abatement/': PL('pigeon', 'european-starling', 'house-sparrow'),
  '/pest-control/': PL('odorous-house-ant', 'carpenter-ant', 'red-imported-fire-ant', 'german-cockroach', 'american-cockroach', 'yellowjacket', 'paper-wasp', 'lone-star-tick', 'asian-tiger-mosquito', 'cat-flea', 'silverfish', 'eastern-mole'),
  '/spider-control/': PL('black-widow-spider', 'brown-recluse-spider'),
  '/cockroach-control/': PL('german-cockroach', 'american-cockroach'),
  '/restaurant-food-service-pest-control/': PL('german-cockroach', 'american-cockroach', 'house-mouse', 'norway-rat', 'house-fly'),
  '/food-processing-manufacturing-pest-control/': PL('norway-rat', 'house-mouse', 'german-cockroach', 'house-fly', 'pigeon', 'house-sparrow'),
  '/warehouse-distribution-pest-control/': PL('norway-rat', 'house-mouse', 'house-sparrow', 'pigeon'),
  '/healthcare-senior-living-pest-control/': PL('bed-bug', 'pharaoh-ant', 'german-cockroach', 'house-mouse'),
  '/hotels-hospitality-pest-control/': PL('bed-bug', 'german-cockroach', 'house-mouse'),
  '/multifamily-property-management-pest-control/': PL('bed-bug', 'german-cockroach', 'pharaoh-ant', 'norway-rat', 'house-mouse'),
  '/schools-student-housing-pest-control/': PL('bed-bug', 'german-cockroach', 'house-mouse', 'yellowjacket'),
  '/commercial-pest-control/': PL('norway-rat', 'house-mouse', 'german-cockroach', 'bed-bug', 'pigeon'),
};

/** Pages kept separate on purpose (distinct intents) — each points to its sibling. */
export const CROSS_LINKS: Record<string, string> = {
  '/norway-rat-burrow-mitigation/': 'This is our field guide to Norway rat burrows for homes and local properties. Running a food plant, farm or multi-site operation? See our <a href="/nationwide-k9-rodent-detection/norway-rat-burrow-mitigation/">commercial Norway rat burrow mitigation program</a>.',
  '/nationwide-k9-rodent-detection/norway-rat-burrow-mitigation/': 'This page covers our commercial and nationwide burrow program. For a plain-language guide to spotting and dealing with Norway rat burrows around a home, read <a href="/norway-rat-burrow-mitigation/">Norway rat burrows: identify, treat &amp; prevent</a>.',
};
