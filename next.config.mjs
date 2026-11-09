import fs from 'node:fs';
const legacyMedia = JSON.parse(fs.readFileSync(new URL('./content/legacy-media-redirects.json', import.meta.url)));

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,           // matches every legacy WordPress URL exactly
  poweredByHeader: false,
  experimental: { inlineCss: true }, // no render-blocking stylesheet request (Keystone performance gate)
  images: { unoptimized: true }, // images are pre-optimised to responsive WebP in /public/media
  async redirects() {
    return [
      { source: '/nationwide-rodent-mitigation/', destination: '/nationwide-k9-rodent-detection/', permanent: true },
      { source: '/bed-bugs-hotels-multifamily-playbook/', destination: '/hotels-hospitality-pest-control/', permanent: true },
      { source: '/profile/kim-camera/', destination: '/about/', permanent: true },
      { source: '/pest-control-columbia-pest-control-sc/', destination: '/columbia-sc-pest-control/', permanent: true },
      { source: '/home/', destination: '/', permanent: true },
      { source: '/feed/', destination: '/coastal-k9-blog/', permanent: true },
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/wp-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-posttype-:t.xml', destination: '/sitemap.xml', permanent: true },
      // legacy image URLs (Google Images, backlinks) -> optimised copies
      ...Object.entries(legacyMedia).filter(([s]) => /^[A-Za-z0-9/_.-]+$/.test(s)).map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
  async headers() {
    return [
      { source: '/media/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }] },
    ];
  },
};
export default nextConfig;
