#!/usr/bin/env python3
"""Normalize the ck9ps.com WordPress scrape into structured page records.

Inputs  (scrape dir): rest.json (WP REST dump), pages.json (rendered-page scrape:
        titles, meta descriptions), media-index.json + media/ (downloaded files).
Outputs (project):    content/pages.json, content/media.json (+ image map used by
        tools/images.py).
Run:    python3 -I tools/extract.py <scrape_dir> <project_dir>
"""
import json, re, sys, html, hashlib
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Comment

SCRAPE = Path(sys.argv[1]); PROJ = Path(sys.argv[2])
R = json.load(open(SCRAPE / 'rest.json'))
RENDERED = {p['url'].replace('https://ck9ps.com', '') or '/': p for p in json.load(open(SCRAPE / 'pages.json'))}
MEDIA_IDX = json.load(open(SCRAPE / 'media-index.json'))

SITE = 'https://ck9ps.com'
# Kept out of the build: apparent AI scenes shown as real, a personal ID/document photo, a screenshot of a
# third party's LinkedIn profile, the old Urban Canine/UCPAWS-branded flyer, and a SC flyer printing a
# different phone number (404-234-0688) from the site NAP.
EXCLUDE_IMG = ('a-clean-modern-office', 'a-bright-sunny-suburban', 'img-0581', 'img-3199', '123-1', 'coastalk9-southcarolina-flyer')

# ---------------------------------------------------------------- media map
def media_key(url):
    """Normalise a wp-content URL to a base key: strip host, query, size and
    -scaled/-rotated suffixes and the extension."""
    p = re.sub(r'^https?://[^/]+', '', url.split('?')[0])
    p = re.sub(r'\.(jpe?g|png|webp|jfif|gif)$', '', p, flags=re.I)
    p = re.sub(r'-\d{2,4}x\d{2,4}$', '', p)
    p = re.sub(r'-(scaled|rotated)$', '', p)
    p = re.sub(r'-(scaled|rotated)$', '', p)
    return p.lower()

downloaded = {}  # key -> local file (largest)
for m in MEDIA_IDX:
    f = m.get('file')
    if not f or not re.search(r'\.(jpe?g|png|webp|jfif|gif)$', f, re.I):
        continue
    k = media_key(m['url'])
    size = (SCRAPE / f).stat().st_size
    if k not in downloaded or size > downloaded[k][1]:
        downloaded[k] = (f, size)

REST_MEDIA = {m['id']: m for m in R['media']['items']}

def slugify(s):
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    return s[:60] or 'img'

image_map = {}   # key -> {"src": "/media/x", "file": local, "alt":..}
def resolve_image(url, alt=''):
    if not url:
        return None
    if not re.search(r'wp-content/uploads', url):
        return None
    k = media_key(url)
    if k not in downloaded:
        return None
    if k not in image_map:
        base = slugify(k.split('/')[-1])
        # disambiguate repeated base names
        if any(v['name'] == base for v in image_map.values()):
            base = base + '-' + hashlib.md5(k.encode()).hexdigest()[:5]
        image_map[k] = {'name': base, 'file': downloaded[k][0], 'alt': alt or '', 'legacy': [url]}
    elif url not in image_map[k]['legacy']:
        image_map[k]['legacy'].append(url)
    if alt and not image_map[k]['alt']:
        image_map[k]['alt'] = alt
    return image_map[k]

# ---------------------------------------------------------------- page kind
CITY_SVC = re.compile(r'^/(k9-bed-bug-detection|k9-rodent-detection|goose-control|bird-control)-([a-z-]+)-sc/$')
RES_SERVICES = ['/bed-bug-control/', '/bed-bug-treatment/', '/rodent-control/', '/rat-mouse-control/',
                '/goose-control/', '/bird-exclusion/', '/pest-control/', '/spider-control/',
                '/cockroach-control/', '/repairs/']
COMMERCIAL = ['/commercial-pest-control/', '/hotels-hospitality-pest-control/',
              '/multifamily-property-management-pest-control/', '/restaurant-food-service-pest-control/',
              '/warehouse-distribution-pest-control/', '/healthcare-senior-living-pest-control/',
              '/food-processing-manufacturing-pest-control/', '/schools-student-housing-pest-control/',
              '/hoa-golf-course-goose-management/', '/falconry-bird-abatement/']
NATIONWIDE = ['/nationwide-k9-rodent-detection/', '/independent-canine-detection/', '/canine-scent-detection-accuracy/']
HUBS = {'/': 'home', '/services/': 'hub-services', '/service-areas/': 'hub-areas', '/coastal-k9-blog/': 'hub-blog',
        '/pest-library/': 'hub-pests', '/about/': 'about', '/contact/': 'contact',
        '/coastal-k9-image-gallery/': 'gallery', '/k9-detection-video-library/': 'videos',
        '/awards-and-recognition/': 'awards', '/media-and-press/': 'press', '/pest-control-coupons/': 'coupons'}

def classify(path, wptype):
    if path in HUBS: return HUBS[path]
    if path.startswith('/ty-') or path == '/thank-you/': return 'utility'
    if path == '/nationwide-rodent-mitigation/': return 'redirect'
    if path.startswith('/pest-library/'): return 'pest'
    if wptype == 'post': return 'post'
    if path in RES_SERVICES: return 'service'
    if path in COMMERCIAL: return 'commercial'
    if path in NATIONWIDE or path.startswith('/nationwide-k9-rodent-detection/'): return 'nationwide'
    if CITY_SVC.match(path): return 'city-service'
    if re.match(r'^/pest-control-[a-z-]+-aiken-sc/$', path): return 'neighborhood'
    if wptype == 'service-area' or re.search(r'pest-control', path): return 'city'
    return 'page'

# ---------------------------------------------------------------- sanitizer
KEEP_ATTR = {'a': ['href', 'title'], 'img': ['src', 'alt', 'width', 'height'], 'iframe': ['src', 'title'],
             'td': ['colspan', 'rowspan'], 'th': ['colspan', 'rowspan', 'scope'], 'ol': ['start'],
             'video': ['src', 'poster', 'controls'], 'source': ['src', 'type'], 'time': ['datetime']}
DROP_TAGS = ['script', 'style', 'link', 'noscript', 'form', 'input', 'select', 'textarea', 'button', 'meta']
SUFFIX_OK = re.compile(r'^(hero|eyebrow|lead|meta|cta|ctas|btn|btns|badge|badges|intro|stats|stat|faq|grid|card|step|steps|step-num|'
                       r'list|area|rel|ctaband|band|reg|pest|cmp|proc|svclist|signs|info|callout|toc|by|author|links|xref|'
                       r'insight|kick|aeo|sub|tags|check|pod|pods|podmeta|podtag|podcta|bio|topic|topics|facts|cimg|bg|'
                       r'row|logo|name|rib|why|trust|vp|svc|areas|sec|hl|hl-grid|hl-item|hl-step|hl-steps|hl-note|hl-t|'
                       r'in|h|formcard|frow|fsub|form)$')

def norm_classes(classes):
    out = []
    for c in classes or []:
        m = re.match(r'^ck9[a-z]*-(.+)$', c)
        if m and SUFFIX_OK.match(m.group(1)):
            out.append('k-' + m.group(1))
        elif re.match(r'^ck9[a-z]*$', c):
            continue  # root wrapper, unwrapped later
        elif c in ('two', 'alt', 'p', 's', 'q', 't'):
            out.append('k-m-' + c)  # modifiers (k-btn p = primary, s = secondary)
        elif c == 'wp-block-gallery':
            out.append('k-gallery')
        elif c == 'ck9pic':
            out.append('k-pic')
    return out

ICON_RE = re.compile(r'^fa-(?!solid|regular|brands)')

def clean_fragment(soup_el, path, page_images):
    for t in soup_el.find_all(DROP_TAGS):
        t.decompose()
    for c in soup_el.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for svg in soup_el.find_all('svg'):
        svg.decompose()
    # font-awesome icons -> data-icon spans
    for i in soup_el.find_all('i'):
        cls = i.get('class') or []
        icon = next((c[3:] for c in cls if ICON_RE.match(c)), None)
        if 'fa-solid' in cls or 'fa-regular' in cls or icon:
            span = soup_el.new_tag('span') if hasattr(soup_el, 'new_tag') else None
            i.name = 'span'; i.attrs = {'class': ['k-ic'], 'data-icon': icon or 'circle', 'aria-hidden': 'true'}
            i.clear()
    for el in soup_el.find_all(True):
        if el.name in ('span',) and 'k-ic' in (el.get('class') or []):
            continue
        cls = norm_classes(el.get('class'))
        keep = {k: v for k, v in el.attrs.items() if k in KEEP_ATTR.get(el.name, [])}
        if el.name == 'details': keep = {}
        if el.name == 'a':
            href = keep.get('href', '')
            href = href.replace('https://ck9ps.com', '').replace('http://ck9ps.com', '')
            if href.startswith('/') and '?' in href: href = href.split('?')[0]
            if href.startswith('/') and not re.search(r'\.\w{2,4}$', href.split('#')[0]) and not href.split('#')[0].endswith('/') and href.split('#')[0]:
                parts = href.split('#'); parts[0] += '/'; href = '#'.join(parts)
            keep['href'] = href
            if href.startswith('http'):
                keep['rel'] = 'noopener'
        if el.name == 'img':
            src = el.get('data-src') or el.get('src') or ''
            ss = el.get('srcset') or el.get('data-srcset')
            if ss:
                best = sorted([x.strip().split() for x in ss.split(',') if x.strip()],
                              key=lambda x: int(re.sub(r'\D', '', x[1]) or 0) if len(x) > 1 else 0)[-1]
                src = best[0]
            img = resolve_image(src, el.get('alt', ''))
            if img:
                keep['src'] = 'media:' + img['name']
                page_images.append(img['name'])
            else:
                keep['src'] = src
            keep['alt'] = el.get('alt', '')
        if el.name == 'iframe':
            src = el.get('src') or el.get('data-src') or ''
            keep['src'] = src
        if el.name == 'video':
            src = el.get('src') or ''
            if 'VID_20260603' in src or 'wp-content' in src:
                keep['src'] = '/media/video/' + src.split('/')[-1].split('?')[0]
        if el.name in ('h2', 'h3') and el.get('id'):
            keep['id'] = el['id']
        if cls: keep['class'] = cls
        el.attrs = keep
    # unwrap meaningless wrappers
    for el in soup_el.find_all(['div', 'span', 'section']):
        if not el.attrs and el.name != 'span':
            el.unwrap()
        elif el.name == 'span' and not el.attrs:
            el.unwrap()
    for p in soup_el.find_all('p'):
        if not p.get_text(strip=True) and not p.find(['img', 'iframe', 'video']):
            p.decompose()
    return soup_el

def faq_from(soup_el):
    out = []
    for d in soup_el.find_all('details'):
        s = d.find('summary')
        if not s: continue
        q = s.get_text(' ', strip=True)
        a = ''.join(str(x) for x in d.contents if x is not s).strip()
        out.append({'q': q, 'a': a})
    return out

def text_of(el):
    return re.sub(r'\s+', ' ', el.get_text(' ', strip=True)) if el else ''

def inner(el):
    return ''.join(str(c) for c in el.contents).strip() if el else ''

# ---------------------------------------------------------------- hero
def extract_hero(soup, kind):
    hero = {}
    h = soup.find(class_='k-hero')
    h1 = soup.find('h1')
    if h is None and h1 is not None:
        # simple pages: the h1 is the hero; the first paragraph after it is the lead
        hero['h1'] = inner(h1)
        nxt = h1.find_next_sibling('p')
        if nxt and kind in ('pest',):
            hero['lead'] = inner(nxt); nxt.decompose()
        h1.decompose()
        return hero
    if h is None:
        return hero
    e = h.find(class_='k-eyebrow')
    if e: hero['eyebrow'] = text_of(e)
    if h1: hero['h1'] = inner(h1)
    leads = h.find_all(class_='k-lead') or ([] if h1 is None else [p for p in h.find_all('p') if not p.find_parent(class_=['k-cta', 'k-badges', 'k-btns'])][:1])
    hero['lead'] = ''.join(inner(l) if l.name == 'p' else str(l) for l in leads)
    m = h.find(class_='k-meta')
    if m: hero['meta'] = inner(m)
    hero['badges'] = [text_of(b) for b in h.find_all(class_='k-badge')]
    ctas = []
    for a in h.find_all('a'):
        lab = text_of(a)
        if lab: ctas.append({'label': lab, 'href': a.get('href', '')})
    hero['ctas'] = ctas
    h.decompose()
    return hero

# ---------------------------------------------------------------- run
def strip_tags(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()

TITLE_FIX = {'Sourth Carolina': 'South Carolina', 'Charleston. South Carolina': 'Charleston, South Carolina'}

SCOPE_FIXES = {k: v for k, v in json.load(open(PROJ / 'content/scope-fixes.json')).items() if not k.startswith('_')}
SCOPE_HITS, SCOPE_MISS = [], []
records = []
for wptype in ['page', 'post', 'service', 'service-area']:
    for x in R[wptype]['items']:
        path = x['link'].replace(SITE, '') or '/'
        kind = classify(path, wptype)
        rend = RENDERED.get(path, {})
        title = html.unescape(rend.get('title') or strip_tags(x['title']['rendered']))
        for a, b in TITLE_FIX.items(): title = title.replace(a, b)
        title = re.sub(r'\s*\|\s*Coastal K9 & Pest Solutions\s*$', '', title)
        desc = html.unescape(rend.get('desc', '') or strip_tags(x['excerpt']['rendered'])[:155])
        raw = x['content']['rendered']
        rewrite = PROJ / 'content/rewrites' / (path.strip('/') + '.html')
        rewritten = rewrite.exists()
        if rewritten:
            raw = rewrite.read_text()
        # Live-site defect: some posts open a JSON-LD <script> and never close it, which
        # swallows the entire article (it renders blank on ck9ps.com). Close it.
        fixed_script = False
        for mm in list(re.finditer(r'<script type="application/ld\+json">', raw)):
            tail = raw[mm.end():]
            if '</script>' not in tail.split('<script')[0]:
                try:
                    _, end = json.JSONDecoder().raw_decode(tail.lstrip())
                    end += len(tail) - len(tail.lstrip())
                except Exception:
                    mh = re.search(r'\n\s*<(p|h[1-6]|div|ul|ol|figure|table)\b', tail)
                    end = mh.start() if mh else 0
                if end:
                    raw = raw[:mm.end()] + tail[:end] + '</script>' + tail[end:]
                    fixed_script = True
        soup = BeautifulSoup(raw, 'html.parser')
        # pull page-authored JSON-LD citations (kept as data, re-emitted in our graph)
        citations = []
        for s in soup.find_all('script', type='application/ld+json'):
            try:
                j = json.loads(s.string or '{}')
                for c in (j.get('citation') or []):
                    if isinstance(c, dict) and c.get('url'): citations.append({'name': c.get('name', ''), 'url': c['url']})
            except Exception:
                pass
        page_images = []
        clean_fragment(soup, path, page_images)
        # keep out of the build: apparent AI-generated scenes shown as real, and a photo of a personal document
        for im in soup.find_all('img'):
            if any(str(im.get('src', '')).startswith('media:' + x) for x in EXCLUDE_IMG):
                (im.find_parent('figure') or im).decompose()
        page_images[:] = [n for n in page_images if not n.startswith(EXCLUDE_IMG)]
        for old, new in SCOPE_FIXES.get(path, []):
            for tn in soup.find_all(string=lambda t: t and old in t):
                tn.replace_with(tn.replace(old, new)); SCOPE_HITS.append(path)
        hero = extract_hero(soup, kind)
        faqs = faq_from(soup)
        # featured image
        feat = REST_MEDIA.get(x.get('featured_media'))
        hero_img = None
        if feat:
            im = resolve_image(feat['source_url'], feat.get('alt_text', ''))
            if im: hero_img = im['name']
        if not hero_img:
            fig = soup.find(class_='k-pic')
            if fig and fig.find('img') and str(fig.find('img').get('src', '')).startswith('media:'):
                hero_img = fig.find('img')['src'][6:]
        if not hero_img and rend.get('ogimage'):
            im = resolve_image(rend['ogimage'])
            if im: hero_img = im['name']
        if hero_img and hero_img.startswith(EXCLUDE_IMG):
            hero_img = None
        if not hero_img and page_images:
            hero_img = page_images[0]
        # heading ids for TOC
        toc = []
        used = set()
        for h2 in soup.find_all('h2'):
            t = text_of(h2)
            if not t: continue
            hid = h2.get('id') or slugify(t)[:48]
            while hid in used: hid += '-x'
            used.add(hid); h2['id'] = hid
            toc.append({'id': hid, 'text': t})
        body = str(soup).strip()
        for old, new in SCOPE_FIXES.get(path, []):
            o, n = html.escape(old, quote=False), html.escape(new, quote=False)
            if o in body: body = body.replace(o, n); SCOPE_HITS.append(path)
            elif old in body: body = body.replace(old, n); SCOPE_HITS.append(path)
            elif new not in body: SCOPE_MISS.append((path, old[:70]))
        words = len(strip_tags(body).split()) + len(strip_tags(hero.get('lead', '')).split())
        h1text = strip_tags(hero.get('h1', '')) or strip_tags(x['title']['rendered'])
        for a, b in TITLE_FIX.items(): h1text = h1text.replace(a, b)
        rec = {
            'path': path, 'slug': x['slug'], 'wpType': wptype, 'kind': kind,
            'title': title, 'description': desc, 'h1': h1text, 'hero': hero,
            'heroImage': hero_img, 'body': body, 'faqs': faqs, 'toc': toc,
            'citations': citations, 'images': sorted(set(page_images)),
            'date': x.get('date_gmt'), 'modified': (__import__('datetime').datetime.fromtimestamp(rewrite.stat().st_mtime, __import__('datetime').timezone.utc).strftime('%Y-%m-%dT%H:%M:%S') if rewritten else x.get('modified_gmt')),
            'excerpt': strip_tags(x['excerpt']['rendered'])[:300], 'words': words,
            'noindex': kind in ('utility',), 'fixedScript': fixed_script, 'rewritten': rewritten,
        }
        m = CITY_SVC.match(path)
        if m: rec['citySvc'] = {'service': m.group(1), 'city': m.group(2)}
        records.append(rec)

# og-only images referenced on rendered pages (gallery etc.) that are not in content
for p in records:
    rend = RENDERED.get(p['path'], {})
    if rend.get('ogimage'):
        resolve_image(rend['ogimage'])

DESC_OVERRIDES = {
    '/norway-rat-burrow-mitigation/': 'A field guide to Norway rat burrows: how bolt holes defeat bait and gas, how to spot an active system, and how K9 detection maps it before treatment.',
}
for r in records:
    if r['path'] in DESC_OVERRIDES: r['description'] = DESC_OVERRIDES[r['path']]
records.sort(key=lambda r: (r['path'] != '/', r['path']))
(PROJ / 'content').mkdir(exist_ok=True)
json.dump(records, open(PROJ / 'content/pages.json', 'w'), ensure_ascii=False, indent=0)
json.dump(image_map, open(PROJ / 'content/image-map.json', 'w'), ensure_ascii=False, indent=1)

from collections import Counter
print('records', len(records), Counter(r['kind'] for r in records))
print('images mapped', len(image_map), 'downloaded keys', len(downloaded))
print('unresolved imgs', sorted({m for r in records for m in re.findall(r'src="(https?://[^"]+wp-content[^"]+)"', r['body'])})[:20])
print('words total', sum(r['words'] for r in records))
thin = sorted((r['words'], r['path']) for r in records if r['words'] < 300 and r['kind'] not in ('utility', 'redirect'))
print('thin', thin)

print('scope fixes applied', len(SCOPE_HITS), 'missed', SCOPE_MISS)
