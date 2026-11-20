import type { NextRequest } from 'next/server';

// The production alias coastal-k9.vercel.app served the whole site with a 200. Send it to the canonical
// host in one 308, keeping the path and query. The matcher only fires on that host, so ck9ps.com and
// preview deployments (their own *.vercel.app hostnames) never run this.
export function proxy(req: NextRequest) {
  let path = req.nextUrl.pathname;
  // the site uses trailingSlash: true and Next hands us the path without it; put it back for pages
  // (anything without a file extension) so /about/ lands on https://ck9ps.com/about/ in one hop
  if (!path.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(path)) path += '/';
  // a plain Response: NextResponse.redirect re-normalises the Location and drops the slash again
  return new Response(null, { status: 308, headers: { Location: `https://ck9ps.com${path}${req.nextUrl.search}` } });
}

export const config = {
  matcher: [{ source: '/:path*', has: [{ type: 'host', value: 'coastal-k9.vercel.app' }] }],
};
