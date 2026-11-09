import Link from 'next/link';
import { SITE } from '@/lib/site';
export default function MobileBar() {
  return (
    <div className="mobilebar" role="region" aria-label="Quick contact">
      <a className="btn btn-primary" href={SITE.phoneHref}>Call {SITE.phone}</a>
      <Link className="btn btn-light" href="/contact/#inspection">Get an Inspection</Link>
    </div>
  );
}
