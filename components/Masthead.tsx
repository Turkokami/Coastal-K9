import Link from 'next/link';
import { SITE } from '@/lib/site';

/** Full-width logo band above the sticky menu (Kim, Nov 2026). Scrolls away; the small logo stays in the menu bar. */
export default function Masthead() {
  return (
    <div className="masthead">
      <Link href="/" aria-label={`${SITE.name} home`}>
        <img src="/brand/logo-wide.webp" alt={SITE.name} width={1920} height={536} fetchPriority="high" />
      </Link>
    </div>
  );
}
