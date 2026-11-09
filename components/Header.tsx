import Link from 'next/link';
import { NAV, SITE } from '@/lib/site';

export default function Header() {
  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="topbar">
        <div className="wrap topbar-in">
          <span><b>{SITE.rating.value}★</b> rating · {SITE.rating.count} reviews · Family-owned · Windsor, SC</span>
          <span className="topbar-r">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.phoneHref}>Call or text {SITE.phone}</a>
          </span>
        </div>
      </div>
      <div className="wrap nav-row">
        <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
          <img src={SITE.logo} alt={SITE.name} width={480} height={134} />
        </Link>
        <nav aria-label="Main" className="mainnav">
          <input type="checkbox" id="navcheck" className="navcheck" aria-label="Open main menu" />
          <label htmlFor="navcheck" className="navtoggle-btn" aria-hidden="true"><span className="burger" aria-hidden="true" /> Menu</label>
          <ul className="navlist">
              {NAV.map((n) => (
                <li key={n.label} className="navitem">
                  <details className="dd">
                    <summary>{n.label}</summary>
                    <ul className="ddlist">
                      {n.children!.map((c) => (
                        <li key={c.href}><Link href={c.href}>{c.label}</Link></li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
          </ul>
        </nav>
        <div className="nav-cta">
          <a className="btn btn-ghost nav-phone" href={SITE.phoneHref}>{SITE.phone}</a>
          <Link className="btn btn-primary" href="/contact/#inspection">Request Inspection</Link>
        </div>
      </div>
    </header>
  );
}
