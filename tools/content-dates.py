#!/usr/bin/env python3
"""Write content/content-dates.json: for every page, when its on-page text last changed in this repo.

Why: pages.json keeps each page's WordPress `modified` date. Pages whose text was rewritten in this
repo (scope fixes, rewrites, audit fixes) would otherwise show an "Updated" date older than the text.
lib/content.ts uses the later of the WordPress date and the date written here, for the byline,
WebPage/Article dateModified and the sitemap lastmod.

Only text a visitor reads counts (H1, hero, body text, FAQs). Title/description edits and markup-only
changes (image tags, classes) do not move the date. A page's first appearance in the repo does not
count either: the initial import carried the WordPress text as it was.

Needs full git history (Vercel builds are shallow), so run it locally after content changes and commit
the JSON:  python3 tools/content-dates.py
"""
import hashlib, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILE = 'content/pages.json'


def git(*a):
    return subprocess.run(['git', *a], cwd=ROOT, check=True, capture_output=True, text=True).stdout


def plain(s):
    s = re.sub(r'<[^>]+>', ' ', s or '')
    s = s.replace('&amp;', '&').replace('&nbsp;', ' ').replace('&#8217;', '’').replace('&rsquo;', '’')
    return re.sub(r'\s+', ' ', s).strip()


def fingerprint(p):
    h = p.get('hero') or {}
    parts = [p.get('h1', ''), h.get('h1', ''), h.get('eyebrow', ''), h.get('lead', ''), h.get('meta', ''),
             ' '.join(h.get('badges') or []), p.get('body', '')]
    parts += [f"{f.get('q', '')} {f.get('a', '')}" for f in p.get('faqs') or []]
    return hashlib.sha1(plain(' '.join(parts)).encode()).hexdigest()


def main():
    if git('rev-parse', '--is-shallow-repository').strip() == 'true':
        raise SystemExit('Shallow clone: fetch full history first (git fetch --unshallow).')
    commits = git('log', '--reverse', '--format=%H %cI', '--', FILE).split('\n')
    commits = [c.split() for c in commits if c.strip()]
    seen, dates = {}, {}
    for sha, when in commits:
        try:
            pages = json.loads(git('show', f'{sha}:{FILE}'))
        except subprocess.CalledProcessError:
            continue
        for p in pages:
            fp = fingerprint(p)
            if p['path'] in seen and seen[p['path']] != fp:
                dates[p['path']] = when
            seen[p['path']] = fp
    # dates in UTC, same shape as pages.json (no zone suffix; the app appends Z)
    from datetime import datetime, timezone
    out = {k: datetime.fromisoformat(v).astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
           for k, v in sorted(dates.items())}
    (ROOT / 'content/content-dates.json').write_text(json.dumps(out, indent=1) + '\n')
    print(f'{len(out)} pages with text changed after import')


if __name__ == '__main__':
    main()
