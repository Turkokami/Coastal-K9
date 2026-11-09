import type { MetadataRoute } from 'next';
import { PAGES } from '@/lib/content';
import { SITE } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.filter((p) => !p.noindex && p.kind !== 'redirect').map((p) => ({
    url: SITE.url + p.path,
    lastModified: p.modified ? new Date(p.modified + 'Z') : undefined,
  }));
}
