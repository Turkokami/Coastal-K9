import Link from 'next/link';
import { FOOTER_GROUPS, SITE } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div className="foot-nap">
          <img src={SITE.logo} alt={SITE.name} width={240} height={67} loading="lazy" />
          <p className="foot-tag">{SITE.tagline}</p>
          <address>
            <b>{SITE.name}</b><br />
            {SITE.address.street}<br />
            {SITE.address.city}, {SITE.address.region} {SITE.address.zip}<br />
            <a href={SITE.phoneHref}>{SITE.phone}</a><br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </address>
          <dl className="hours">
            {SITE.hours.map((h) => (<div key={h.label}><dt>{h.label}</dt><dd>{h.value}</dd></div>))}
          </dl>
          <ul className="social">
            {SITE.social.map((s) => (<li key={s.name}><a href={s.url} rel="noopener me" target="_blank">{s.name}</a></li>))}
          </ul>
        </div>
        {FOOTER_GROUPS.map((g) => (
          <nav key={g.title} aria-label={g.title} className="foot-col">
            <h2>{g.title}</h2>
            <ul>{g.links.map((l) => (<li key={l.href + l.label}><Link href={l.href}>{l.label}</Link></li>))}</ul>
          </nav>
        ))}
      </div>
      <div className="wrap foot-creds">
        <span>Founder credentials:</span>
        {SITE.credentials.map((c) => (<a key={c.abbr} href={c.url} rel="noopener" target="_blank" title={c.name}>{c.abbr}</a>))}
        <span>· FEMA US&amp;R-trained handler · Licensed pest control technician</span>
      </div>
      <div className="wrap foot-legal">
        <span>© {year} {SITE.name}. All rights reserved.</span>
        <span>K9 detection, bed bug &amp; rodent control serving Aiken, the CSRA &amp; the SC Midlands — nationwide K9 rodent detection for commercial clients.</span>
      </div>
    </footer>
  );
}
