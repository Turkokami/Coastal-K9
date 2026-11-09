# ck9ps.com — Coastal K9 & Pest Solutions (Keystone build)

Static Next.js 16 (App Router) rebuild of ck9ps.com. Every one of the 160 live WordPress URLs is
reproduced at the **same path** (trailing slash kept), so no page redirects are needed at cutover.

## Deploy (Vercel)
1. `npm install`
2. `npx vercel link` → create project **coastal-k9** in team `turkokami-9144s-projects`
3. Env vars (Production + Preview):
   - `RESEND_API_KEY` — sending key from the turkokami Resend team
   - `INQUIRY_TO` — `Kim@ck9ps.com` (comma-separate for more)
   - `INQUIRY_FROM` — e.g. `Coastal K9 Website <inquiries@ck9ps.com>` (domain must be verified in Resend)
   - `NEXT_PUBLIC_GTM_ID` — optional; defaults to the live container `GTM-NMPGCW4`
4. `npx vercel --prod` (or push to GitHub and connect the repo)
5. Check the preview URL, then add `ck9ps.com` + `www.ck9ps.com` as project domains and repoint DNS.
   Canonical host in code is `https://ck9ps.com` (apex) — make www redirect to apex.

## Structure
- `content/pages.json` — all 160 pages, normalised from the WP REST API (hero, body, FAQs, TOC, images)
- `content/media.json` — 144 images as responsive WebP in `public/media` (640/1280w)
- `content/legacy-media-redirects.json` — every old `/wp-content/uploads/...` image URL 308s to its new copy
- `lib/site.ts` — NAP, hours, credentials, nav (single source of truth)
- `lib/schema.ts` — JSON-LD @graph (LocalBusiness, WebSite, Person, WebPage, ImageObject, Breadcrumb, Service/Article, conditional FAQPage)
- `app/[...slug]/page.tsx` — every non-home template; `app/page.tsx` — homepage
- `app/api/inquiry/route.ts` — inspection form → Resend
- `tools/extract.py`, `tools/images.py` — re-run the migration from a fresh scrape
- `tools/verify.mjs` — harness that reads RENDERED html: status, single h1, titles, descriptions, canonical, OG, JSON-LD parse, alt text, internal links, legacy URL parity

```
npm run build && npm start   # then:
node tools/verify.mjs http://localhost:3000 tools/legacy-urls.json
```
