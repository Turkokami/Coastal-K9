import Link from 'next/link';
import { SITE } from '@/lib/site';
export default function NotFound() {
  return (
    <section className="hero"><div className="wrap hero-in noimg"><div>
      <span className="eyebrow">404</span>
      <h1>We couldn’t sniff out that page</h1>
      <p className="lead">It may have moved when we rebuilt the site. Try one of these, or call us — a real person answers.</p>
      <div className="hero-ctas">
        <Link className="btn btn-primary btn-lg" href="/services/">Our services</Link>
        <Link className="btn btn-outline-light btn-lg" href="/service-areas/">Service areas</Link>
        <a className="btn btn-outline-light btn-lg" href={SITE.phoneHref}>Call {SITE.phone}</a>
      </div>
    </div></div></section>
  );
}
