import type { Metadata } from 'next';
import Link from 'next/link';
import { getPage, imgTag, icon, byKind, plain } from '@/lib/content';
import { SITE } from '@/lib/site';
import { pageGraph } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';
import InspectionForm from '@/components/InspectionForm';
import CtaBand from '@/components/CtaBand';
import { CardGrid } from '@/components/Related';

const home = getPage('/')!;

export const metadata: Metadata = {
  title: { absolute: 'K9 Bed Bug & Rodent Detection in Aiken, SC | Coastal K9' },
  description: 'Certified K9 bed bug, rodent and wildlife detection in Aiken, North Augusta & the CSRA, led by FEMA-trained handler Kimberly Camera. Detection before treatment, every time.',
  alternates: { canonical: '/' },
  openGraph: { url: '/', images: [{ url: '/brand/og-default.jpg' }] },
};

const DIVISIONS = [
  { href: '/bed-bug-control/', icon: 'bed', img: 'dog-insp-bb', title: 'K9 Bed Bug Detection', text: 'Certified dogs find live bugs and viable eggs room by room — discreet, documented and fast.' },
  { href: '/rodent-control/', icon: 'shield-halved', img: 'img-9280', title: 'Rodent Detection & Exclusion', text: 'Dogs locate active harborage behind walls and below ground; then we seal entry points for good.' },
  { href: '/goose-control/', icon: 'feather', img: 'goose', title: 'Canada Goose Management', text: 'Humane, dog-powered hazing that reclaims HOAs, golf courses, parks and campuses.' },
  { href: '/bird-exclusion/', icon: 'crow', img: 'bird', title: 'Bird Control & Exclusion', text: 'Netting, wire and exclusion that keep pigeons and starlings off buildings — plus falconry abatement.' },
  { href: '/commercial-pest-control/', icon: 'building', img: 'img-20260603-143831', title: 'Commercial Programs', text: 'Documented, detection-driven programs for hotels, multifamily, food, healthcare and warehouses.' },
  { href: '/nationwide-k9-rodent-detection/', icon: 'flag-usa', img: 'ratsbig', title: 'Nationwide Rodent Detection', text: 'Norway rat burrow mitigation for food processing and agriculture — supporting 15+ companies nationwide.' },
];

const MORE = [
  { href: '/bed-bug-treatment/', label: 'Bed Bug Treatment' }, { href: '/rat-mouse-control/', label: 'Rat & Mouse Control' },
  { href: '/repairs/', label: 'Repairs & Exclusion' }, { href: '/pest-control/', label: 'Integrated Pest Management' },
  { href: '/spider-control/', label: 'Spider Control' }, { href: '/cockroach-control/', label: 'Cockroach Control' },
  { href: '/falconry-bird-abatement/', label: 'Falconry Bird Abatement' }, { href: '/hoa-golf-course-goose-management/', label: 'HOA & Golf Goose Management' },
];

const AREAS: [string, string | null][] = [
  ['Aiken', '/pest-control-aiken-south-carolina/'], ['North Augusta', '/pest-control-north-augusta-sc/'], ['Graniteville', '/pest-control-graniteville-sc/'],
  ['Windsor', '/pest-control-windsor-sc/'], ['Beech Island', '/pest-control-beech-island-sc/'], ['New Ellenton', '/pest-control-new-ellenton-sc/'],
  ['Edgefield', '/pest-control-edgefield-sc/'], ['Lexington', '/pest-control-lexington-sc/'], ['Columbia', '/columbia-sc-pest-control/'],
  ['West Columbia', '/pest-control-west-columbia-sc/'], ['Cayce', '/pest-control-cayce-sc/'], ['Irmo', '/pest-control-irmo-sc/'],
  ['Orangeburg', '/pest-control-orangeburg-sc/'], ['Barnwell', '/pest-control-barnwell-sc/'], ['Augusta, GA', null], ['Martinez, GA', null], ['Evans, GA', null],
];

export default function Home() {
  const posts = byKind('post').sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3);
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <span className="eyebrow">Aiken, SC · Detection Before Treatment</span>
            <h1>Certified K9 Bed Bug, Rodent &amp; Wildlife Detection</h1>
            <p className="lead">{plain(home.hero.lead || '')}</p>
            <ul className="badges">
              <li>{SITE.rating.value}★ · {SITE.rating.count} reviews</li><li>NESDCA certified</li><li>FEMA-trained handler</li><li>Licensed technician</li><li>Family-owned</li>
            </ul>
            <div className="hero-ctas">
              <a className="btn btn-primary btn-lg" href={SITE.phoneHref}>Call {SITE.phone}</a>
              <Link className="btn btn-outline-light btn-lg" href="/services/">See all services</Link>
            </div>
          </div>
          <div className="hero-card"><InspectionForm compact /></div>
        </div>
      </section>

      <div className="trust" aria-label="Why customers trust us">
        <ul className="wrap">
          <li dangerouslySetInnerHTML={{ __html: icon('award') + ' Founded by FEMA US&amp;R canine handler Kimberly Camera' }} />
          <li dangerouslySetInnerHTML={{ __html: icon('dog') + ' 28+ years of K9 detection' }} />
          <li dangerouslySetInnerHTML={{ __html: icon('certificate') + ' NESDCA · WDDO · CPDA · ICRWDA' }} />
          <li dangerouslySetInnerHTML={{ __html: icon('location-dot') + ' Windsor, SC — serving the CSRA &amp; Midlands' }} />
        </ul>
      </div>

      <section className="section" aria-labelledby="h-div">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">One company, six K9 specialties</span>
            <h2 id="h-div">What our certified detection teams handle</h2>
            <p>Certified canine detection sits at the center of everything we do: the dog finds exactly where the problem is, so treatment is targeted, documented and effective the first time.</p>
          </div>
          <div className="cards">
            {DIVISIONS.map((d) => (
              <Link key={d.href} href={d.href} className="card">
                <span dangerouslySetInnerHTML={{ __html: imgTag(d.img, '', { sizes: '(max-width: 700px) 100vw, 380px' }) }} />
                <div className="card-b">
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <span className="card-more">View service →</span>
                </div>
              </Link>
            ))}
          </div>
          <h3 style={{ marginTop: 34 }}>Also on our service list</h3>
          <ul className="chips">{MORE.map((m) => <li key={m.href}><Link href={m.href}>{m.label}</Link></li>)}</ul>
        </div>
      </section>

      <section className="section soft" aria-labelledby="h-how">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Our difference</span>
            <h2 id="h-how">Detection before treatment. Every time.</h2>
            <p>Most pest companies treat first and hope. We find it first — then treat only where activity is confirmed, and prove the result.</p>
          </div>
          <ol className="steps3">
            <li><b>Inspect</b>A certified K9 team sweeps the property — behind walls, under floors and in voids a visual inspection misses.</li>
            <li><b>Pinpoint</b>The handler confirms exactly what the dog found and where, and documents it room by room or zone by zone.</li>
            <li><b>Treat &amp; verify</b>Focused, least-toxic treatment only where activity is confirmed — then verification so you know it is solved.</li>
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="h-kim">
        <div className="wrap split">
          <div dangerouslySetInnerHTML={{ __html: imgTag('kim1', 'Kimberly Camera, founder of Coastal K9 & Pest Solutions, presenting with her detection dog', { sizes: '(max-width: 860px) 100vw, 560px' }) }} />
          <div>
            <span className="kicker">Meet the founder</span>
            <h2 id="h-kim">Kimberly Camera: from FEMA search-and-rescue to pest detection</h2>
            <p>Kim’s career in working dogs began as a certified FEMA Urban Search &amp; Rescue canine handler, deploying across the country with live-find and cadaver-recovery dogs. With a background in wildlife biology and 28+ years of K9 detection, she built Coastal K9 around one idea: find the problem precisely before anyone applies a product.</p>
            <p>She’s been profiled in <i>Pest Control Technology</i>, presented at the Purdue Pest Management Conference, and trains and certifies her own detection teams.</p>
            <div className="hero-ctas"><Link className="btn btn-teal" href="/about/">Read Kim’s story</Link><Link className="btn btn-light" href="/awards-and-recognition/">Awards &amp; recognition</Link></div>
          </div>
        </div>
      </section>

      <section className="section dark" aria-labelledby="h-nat">
        <div className="wrap split">
          <div>
            <span className="kicker">Nationwide · Food processing &amp; agriculture</span>
            <h2 id="h-nat">Nationwide K9 rodent detection and Norway rat burrow mitigation</h2>
            <p>Beyond the CSRA, Coastal K9 supports more than 15 companies across the country with large-scale rodent mitigation — including complex Norway rat burrow systems that overwhelm conventional programs. We specialize in food processing and agricultural operations where documentation is critical and detection-driven precision is the difference between control and chronic reinfestation.</p>
            <div className="hero-ctas"><Link className="btn btn-primary" href="/nationwide-k9-rodent-detection/">Explore the nationwide program</Link><Link className="btn btn-outline-light" href="/nationwide-k9-rodent-detection/norway-rat-burrow-mitigation/">Burrow mitigation</Link></div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: imgTag('ratsbig', 'Norway rats removed during a Coastal K9 commercial burrow mitigation project', { sizes: '(max-width: 860px) 100vw, 560px' }) }} />
        </div>
      </section>

      <section className="section" aria-labelledby="h-area">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Service area</span>
            <h2 id="h-area">Serving Aiken, the CSRA &amp; the SC Midlands</h2>
            <p>Certified K9 detection within roughly 60 miles of our Windsor base, on both sides of the Savannah River — from Aiken’s Winter Colony and Houndslake to Lexington and Columbia.</p>
          </div>
          <ul className="chips">
            {AREAS.map(([n, h]) => <li key={n}>{h ? <Link href={h}>{n}</Link> : <span>{n}</span>}</li>)}
            <li><Link href="/service-areas/">All service areas →</Link></li>
          </ul>
        </div>
      </section>

      <section className="section dark" aria-labelledby="h-cred">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Credentials</span>
            <h2 id="h-cred">Nationally &amp; internationally certified</h2>
            <p>Our founder’s detection credentials are held through recognized canine-detection authorities — verify each one directly.</p>
          </div>
          <div className="creds">
            {SITE.credentials.map((c) => <a key={c.abbr} href={c.url} rel="noopener" target="_blank"><b>{c.abbr}</b><span>{c.name}</span></a>)}
          </div>
        </div>
      </section>

      <section className="section soft" aria-labelledby="h-blog">
        <div className="wrap">
          <div className="section-head"><span className="kicker">From the field</span><h2 id="h-blog">Latest from the Coastal K9 blog</h2></div>
          <CardGrid pages={posts} />
          <p style={{ marginTop: 20 }}><Link href="/coastal-k9-blog/">All articles →</Link> · <Link href="/pest-library/">Pest library →</Link></p>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={pageGraph({ ...home, title: 'Coastal K9 & Pest Solutions', heroImage: 'kim1' }, [{ label: 'Home', href: '/' }])} />
    </>
  );
}
