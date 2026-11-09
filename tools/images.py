#!/usr/bin/env python3
"""Optimise scraped images into public/media as responsive WebP and write
content/media.json (name -> {w,h,alt,sizes}) + content/legacy-media-redirects.json.
Run: python3 -I tools/images.py <scrape_dir> <project_dir>"""
import json, sys, re
from pathlib import Path
from PIL import Image, ImageOps

SCRAPE = Path(sys.argv[1]); PROJ = Path(sys.argv[2])
imap = json.load(open(PROJ / 'content/image-map.json'))
out = PROJ / 'public/media'; out.mkdir(parents=True, exist_ok=True)
WIDTHS = [480, 960, 1280]
media, redirects = {}, {}
for key, m in imap.items():
    src = SCRAPE / m['file']
    try:
        im = Image.open(src); im = ImageOps.exif_transpose(im)
    except Exception as e:
        print('skip', src, e); continue
    if im.mode in ('P', 'LA'): im = im.convert('RGBA')
    if im.mode == 'CMYK': im = im.convert('RGB')
    w0, h0 = im.size
    sizes = []
    for w in WIDTHS:
        if w > w0 and sizes: break
        tw = min(w, w0); th = round(h0 * tw / w0)
        fn = f"{m['name']}-{tw}.webp"
        im.resize((tw, th), Image.LANCZOS).save(out / fn, 'WEBP', quality=78, method=5)
        sizes.append({'w': tw, 'h': th, 'src': f'/media/{fn}'})
    media[m['name']] = {'alt': m['alt'], 'w': sizes[-1]['w'], 'h': sizes[-1]['h'], 'sizes': sizes, 'orig': key}
    for u in m['legacy'] + [m['file'].split('/', 1)[1] if '/' in m['file'] else '']:
        p = re.sub(r'^https?://[^/]+', '', u.split('?')[0]) if u.startswith('http') else '/' + u.split('/', 1)[1] if u else ''
        if p.startswith('/wp-content/'):
            redirects[p] = sizes[-1]['src']
json.dump(media, open(PROJ / 'content/media.json', 'w'), indent=1)
json.dump(redirects, open(PROJ / 'content/legacy-media-redirects.json', 'w'), indent=1)
tot = sum(f.stat().st_size for f in out.glob('*.webp'))
print('images', len(media), 'files', len(list(out.glob('*.webp'))), 'MB', round(tot / 1e6, 1), 'redirects', len(redirects))
