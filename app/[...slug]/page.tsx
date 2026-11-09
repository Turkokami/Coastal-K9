import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PAGES, getPage, renderBody, related, plain, byKind, MEDIA, Page, seoTitle, SERVICE_PESTS } from '@/lib/content';
import { KIND_PARENT, SITE } from '@/lib/site';
import { pageGraph } from '@/lib/schema';
import Hero from '@/components/Hero';
import JsonLd from '@/components/JsonLd';
import CtaBand from '@/components/CtaBand';
import Byline from '@/components/Byline';
import Related, { CardGrid } from '@/components/Related';
import InspectionForm from '@/components/InspectionForm';

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.filter((p) => p.path !== '/' && p.kind !== 'redirect').map((p) => ({ slug: p.path.split('/').filter(Boolean) }));
}

const pathOf = (slug: string[]) => '/' + slug.join('/') + '/';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPage(pathOf(slug));
  if (!p) return {};
  const m = p.heroImage ? MEDIA[p.heroImage] : undefined;
  const og = m ? m.sizes[m.sizes.length - 1].src : '/brand/og-default.jpg';
  return {
    title: { absolute: seoTitle(p) },
    description: p.description,
    alternates: { canonical: p.path },
    robots: p.noindex ? { index: false, follow: true } : undefined,
    openGraph: { title: seoTitle(p), description: p.description, url: p.path, images: [{ url: og }], type: p.kind === 'post' ? 'article' : 'website' },
    twitter: { card: 'summary_large_image', title: seoTitle(p), description: p.description, images: [og] },
  };
}

function crumbsFor(p: Page) {
  const c = [{ label: 'Home', href: '/' }];
  const parent = KIND_PARENT[p.kind];
  if (parent && parent.href !== p.path) c.push(parent);
  if (p.path.startsWith('/nationwide-k9-rodent-detection/') && p.path !== '/nationwide-k9-rodent-detection/' && parent?.href !== '/nationwide-k9-rodent-detection/')
    c.push({ label: 'Nationwide Rodent', href: '/nationwide-k9-rodent-detection/' });
  c.push({ label: plain(p.h1).replace(/\s*[—–].*$/, '').slice(0, 60), href: p.path });
  return c;
}

const RELATED_TITLE: Record<string, string> = {
  'city-service': 'More K9 detection services near you', city: 'Other communities we serve', neighborhood: 'More Aiken neighborhoods',
  pest: 'More from the pest library', post: 'Keep reading', commercial: 'Other commercial programs', nationwide: 'Nationwide program detail', service: 'Related services',
};

const LONGFORM = new Set(['service', 'commercial', 'nationwide', 'city-service', 'city', 'neighborhood', 'post']);

export default async function Route({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const p = getPage(pathOf(slug));
  if (!p || p.kind === 'redirect') notFound();
  const crumbs = crumbsFor(p);
  let raw = p.body;
  // the lead photo is shown in the hero — don't repeat it at the top of the body
  if (p.heroImage) {
    const m = new RegExp(`<figure[^>]*>(?:(?!</figure>)[\\s\\S])*?src="media:${p.heroImage}"(?:(?!</figure>)[\\s\\S])*?</figure>`).exec(raw);
    if (m && m.index < 2500) raw = raw.slice(0, m.index) + raw.slice(m.index + m[0].length);
  }
  const body = renderBody(raw);
  const rel = related(p);
  const showToc = p.toc.length >= 4 && LONGFORM.has(p.kind) && !p.body.includes('k-toc');

  // ---------- special templates ----------
  if (p.kind === 'contact') {
    return (
      <>
        <Hero p={p} crumbs={crumbs} aside="form" />
        <div className="wrap page single">
          <article className="content">
            <div dangerouslySetInnerHTML={{ __html: body }} />
            <h2>Visit or write to us</h2>
            <p><b>{SITE.name}</b><br />{SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.zip}<br />
              <a href={SITE.phoneHref}>{SITE.phone}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            <p>{SITE.hours.map((h) => `${h.label}: ${h.value}`).join(' · ')}</p>
            <iframe loading="lazy" title="Map: Coastal K9 & Pest Solutions, Windsor SC" src="https://www.google.com/maps?q=320+Wendy+Lane,+Windsor,+SC+29856&output=embed" style={{ width: '100%', minHeight: 360, border: 0, borderRadius: 14 }} />
          </article>
        </div>
        <JsonLd data={pageGraph(p, crumbs)} />
      </>
    );
  }
  if (p.kind === 'utility') {
    return (
      <>
        <section className="hero"><div className="wrap hero-in noimg">
          <div><h1 dangerouslySetInnerHTML={{ __html: p.hero.h1 || p.h1 }} />
            <div className="lead" dangerouslySetInnerHTML={{ __html: body }} />
            <div className="hero-ctas"><a className="btn btn-primary btn-lg" href={SITE.phoneHref}>Call {SITE.phone}</a><Link className="btn btn-outline-light btn-lg" href="/services/">Explore services</Link></div>
          </div></div></section>
      </>
    );
  }

  const listing =
    p.kind === 'hub-blog' ? <CardGrid pages={byKind('post').sort((a, b) => (b.date || '').localeCompare(a.date || ''))} /> :
    p.kind === 'hub-areas' ? (
      <>
        <h2>Community pages</h2>
        <ul className="chips">{byKind('city').map((c) => <li key={c.path}><Link href={c.path}>{plain(c.h1).replace(/^Pest Control in /, '').replace(/,? South Carolina.*$/, '')}</Link></li>)}</ul>
        <h2>Aiken neighborhoods</h2>
        <ul className="chips">{byKind('neighborhood').map((c) => <li key={c.path}><Link href={c.path}>{plain(c.h1).replace(/^Pest Control in /, '').replace(/\s*[–—-]\s*Aiken.*$/, '')}</Link></li>)}</ul>
        <h2>K9 detection, goose and bird services by city</h2>
        <ul className="chips">{byKind('city-service').map((c) => <li key={c.path}><Link href={c.path}>{plain(c.h1)}</Link></li>)}</ul>
      </>
    ) : null;

  const wide = ['hub-blog', 'hub-areas', 'hub-services', 'hub-pests', 'gallery', 'videos', 'awards', 'press', 'coupons', 'about'].includes(p.kind);

  return (
    <>
      <Hero p={p} crumbs={crumbs} aside={p.kind === 'pest' || p.kind === 'hub-blog' || p.kind === 'hub-pests' ? 'form' : 'auto'} />
      <div className={`wrap page${wide ? ' single' : ''}`}>
        <article className="content">
          {LONGFORM.has(p.kind) || p.kind === 'pest' ? <Byline modified={p.modified} label={p.kind === 'post' ? 'Written by' : 'Reviewed by'} /> : null}
          <div dangerouslySetInnerHTML={{ __html: body }} />
          {listing}
          {SERVICE_PESTS[p.path] ? (
            <section aria-labelledby="pests-h" className="k-intro" style={{ marginTop: 32 }}>
              <h2 id="pests-h" style={{ marginTop: 0 }}>Pests this service covers</h2>
              <p>Identification, signs and prevention for each one in our pest library:</p>
              <ul className="chips">{SERVICE_PESTS[p.path].map((x) => getPage(x)).filter(Boolean).map((x) => <li key={x!.path}><Link href={x!.path}>{plain(x!.h1).replace(/\s*[—–].*$/, '')}</Link></li>)}</ul>
            </section>
          ) : null}
          {p.kind === 'pest' ? (
            <p><Link href="/pest-library/">← Back to the pest library</Link></p>
          ) : null}
        </article>
        {wide ? null : (
          <aside className="side" aria-label="Page tools">
            <div className="side-sticky">
              <div className="side-box side-call">
                <h2>Talk to a certified K9 team</h2>
                <p>Family-owned, based in Windsor SC. Same-week inspections across the CSRA &amp; Midlands.</p>
                <a className="btn btn-primary" href={SITE.phoneHref}>Call {SITE.phone}</a>
                <Link className="btn btn-outline-light" href="/contact/#inspection">Request an Inspection</Link>
              </div>
              {showToc ? (
                <nav className="side-box" aria-label="On this page">
                  <h2>On this page</h2>
                  <ol>{p.toc.slice(0, 14).map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
                </nav>
              ) : null}
              {rel.length ? (
                <nav className="side-box" aria-label="Related">
                  <h2>Related</h2>
                  <ul>{rel.slice(0, 6).map((r) => <li key={r.path}><Link href={r.path}>{plain(r.h1).slice(0, 70)}</Link></li>)}</ul>
                </nav>
              ) : null}
            </div>
          </aside>
        )}
      </div>
      {['commercial', 'nationwide'].includes(p.kind) ? (
        <section className="section soft" aria-label="Request a commercial assessment"><div className="wrap" style={{ maxWidth: 820 }}>
          <InspectionForm heading={p.kind === 'nationwide' ? 'Scope a nationwide rodent program' : 'Request a commercial assessment'} />
        </div></section>
      ) : null}
      {rel.length && !wide ? <Related title={RELATED_TITLE[p.kind] || 'Related'} pages={rel} /> : null}
      <CtaBand />
      <JsonLd data={pageGraph(p, crumbs)} />
    </>
  );
}
