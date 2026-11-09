import Link from 'next/link';
import { Page, imgTag, img, renderBody } from '@/lib/content';
import { SITE } from '@/lib/site';
import Breadcrumbs from './Breadcrumbs';
import InspectionForm from './InspectionForm';

export default function Hero({ p, crumbs, aside = 'auto' }: { p: Page; crumbs: { label: string; href: string }[]; aside?: 'auto' | 'form' | 'image' | 'none' }) {
  const h = p.hero || {};
  const image = p.heroImage && img(p.heroImage) ? p.heroImage : null;
  const mode = aside === 'auto' ? (image ? 'image' : 'form') : aside;
  const seen = new Set<string>();
  const ctas = (h.ctas || [])
    .filter((c) => c.label.length < 40)
    .map((c) => (c.href.startsWith('tel:') ? { ...c, href: 'tel' } : c))
    .filter((c) => (seen.has(c.href) ? false : (seen.add(c.href), true)))
    .slice(0, 2);
  const hasCall = ctas.some((c) => c.href === 'tel');
  return (
    <section className="hero">
      <div className={`wrap hero-in${mode === 'none' ? ' noimg' : ''}`}>
        <div>
          <Breadcrumbs crumbs={crumbs} />
          {h.eyebrow ? <span className="eyebrow">{h.eyebrow}</span> : null}
          <h1 dangerouslySetInnerHTML={{ __html: h.h1 || p.h1 }} />
          {h.lead ? <div className="lead" dangerouslySetInnerHTML={{ __html: renderBody(h.lead.startsWith('<') ? h.lead : `<p>${h.lead}</p>`) }} /> : null}
          {h.badges && h.badges.length ? <ul className="badges">{h.badges.slice(0, 6).map((b) => <li key={b}>{b}</li>)}</ul> : null}
          <div className="hero-ctas">
            {hasCall ? null : <a className="btn btn-primary btn-lg" href={SITE.phoneHref}>Call {SITE.phone}</a>}
            {ctas.map((c, i) => c.href === 'tel'
              ? <a key={i} className="btn btn-primary btn-lg" href={SITE.phoneHref}>Call {SITE.phone}</a>
              : <Link key={i} className="btn btn-outline-light btn-lg" href={c.href.startsWith('/contact') ? '/contact/#inspection' : c.href}>{c.label}</Link>)}
            {ctas.every((c) => c.href === 'tel') ? <Link className="btn btn-outline-light btn-lg" href="/contact/#inspection">Request an Inspection</Link> : null}
          </div>
        </div>
        {mode === 'image' && image ? (
          <figure className="hero-media" style={{ margin: 0 }}>
            <span dangerouslySetInnerHTML={{ __html: imgTag(image, undefined, { eager: true, sizes: '(max-width: 900px) 100vw, 480px' }) }} />
          </figure>
        ) : null}
        {mode === 'form' ? <div className="hero-card"><InspectionForm compact={p.kind !== 'contact'} anchor={p.kind === 'contact'} /></div> : null}
      </div>
    </section>
  );
}
