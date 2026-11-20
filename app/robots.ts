import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
export const dynamic = 'force-static';

/** AI assistants and AI search crawlers, named explicitly and allowed under the same rules as everyone else. Site guide: /llms.txt */
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'DuckAssistBot',
  'Amazonbot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'MistralAI-User',
  'cohere-ai',
  'YouBot',
  'CCBot',
  'Bytespider',
]
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }, { userAgent: AI_BOTS, allow: '/', disallow: ['/api/'] }], sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url };
}
