import type { Metadata } from 'next';
import Link from 'next/link';
import { getPage, imgTag, icon, byKind, plain } from '@/lib/content';
import { SITE } from '@/lib/site';
import { pageGraph } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';
import InspectionForm from '@/components/InspectionForm';
import CtaBand from '@/components/CtaBand';
import BannerVideo from '@/components/BannerVideo';
import CredentialLogos from '@/components/CredentialLogos';
import { CardGrid } from '@/components/Related';

const home = getPage('/')!;

export const metadata: Metadata = {
  title: { absolute: 'Aiken SC Pest Control and K9 Bed Bug Detection | Coastal K9' },
  description: 'Family-owned exterminator with certified K9 bed bug and rodent detection in Aiken and surrounding counties, with roots in FEMA search and rescue.',
  alternates: { canonical: '/' },
  openGraph: { url: '/', images: [{ url: '/brand/og-default.jpg' }] },
};

const DIVISIONS = [
  { href: '/bed-bug-control/', icon: 'bed', img: 'dog-insp-bb', title: 'K9 Bed Bug Detection', text: 'Certified dogs find live bugs and viable eggs room by room — discreet, documented and fast.' },
  { href: '/rodent-control/', icon: 'shield-halved', img: 'img-4512', title: 'Rodent Detection & Exclusion', text: 'Dogs locate active harborage behind walls and below ground; then we seal entry points for good.' },
  { href: '/goose-control/', icon: 'feather', img: 'goose', title: 'Canada Goose Management', text: 'Humane, dog-powered hazing that reclaims HOAs, golf courses, parks and campuses.' },
  { href: '/bird-exclusion/', icon: 'crow', img: 'bird', title: 'Bird Control & Exclusion', text: 'Netting, wire and exclusion that keep pigeons and starlings off buildings — plus falconry abatement.' },
  { href: '/commercial-pest-control/', icon: 'building', img: 'img-20260603-143831', title: 'Commercial Programs', text: 'Documented, detection-driven programs for hotels, multifamily, food, healthcare and warehouses.' },
  { href: '/nationwide-k9-rodent-detection/', icon: 'flag-usa', img: 'tunneling', title: 'Nationwide Rodent Detection', text: 'Norway rat burrow mitigation for food processing and agriculture operations across the country.' },
];

const MORE = [
  { href: '/bed-bug-treatment/', label: 'Bed Bug Treatment' }, { href: '/pest-control/', label: 'Integrated Pest Management' },
  { href: '/spider-control/', label: 'Spider Control' }, { href: '/cockroach-control/', label: 'Cockroach Control' },
  { href: '/mosquito-control/', label: 'Mosquito Control (No Fogging)' }, { href: '/bat-removal/', label: 'Bat Removal & Exclusion' },
];

const AREAS: [string, string | null][] = [
  ['Aiken', '/pest-control-aiken-south-carolina/'], ['North Augusta', '/pest-control-north-augusta-sc/'], ['Graniteville', '/pest-control-graniteville-sc/'],
  ['Windsor', '/pest-control-windsor-sc/'], ['Beech Island', '/pest-control-beech-island-sc/'], ['New Ellenton', '/pest-control-new-ellenton-sc/'],
  ['Edgefield', '/pest-control-edgefield-sc/'], ['Lexington', '/pest-control-lexington-sc/'], ['Columbia', '/columbia-sc-pest-control/'],
  ['West Columbia', '/pest-control-west-columbia-sc/'], ['Cayce', '/pest-control-cayce-sc/'], ['Irmo', '/pest-control-irmo-sc/'],
  ['Orangeburg', '/pest-control-orangeburg-sc/'], ['Barnwell', '/pest-control-barnwell-sc/'], ['Augusta, GA', '/pest-control-augusta-ga/'], ['Martinez, GA', '/pest-control-martinez-ga/'], ['Evans, GA', '/pest-control-evans-ga/'], ['Grovetown, GA', '/pest-control-grovetown-ga/'],
];

export default function Home() {
  const posts = byKind('post').sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3);
  return (
    <>
      <div className="video-banner">
        <video className="vb-d" src="/video/banner-desktop.mp4" poster="/video/banner-poster.jpg" autoPlay muted loop playsInline preload="metadata" aria-label="Coastal K9 detection dog searching a hotel room" />
        <video className="vb-m" src="/video/banner-mobile.mp4" poster="/video/banner-poster.jpg" autoPlay muted loop playsInline preload="metadata" aria-label="Coastal K9 detection dog searching a hotel room" />
        <BannerVideo />
      </div>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <span className="eyebrow">Aiken, SC · Detection Before Treatment</span>
            <h1>Certified K9 Bed Bug &amp; Rodent Detection</h1>
            <p className="lead">{plain(home.hero.lead || '')}</p>
            <div className="hero-ctas">
              <a className="btn btn-primary btn-lg" href={SITE.readReviewsUrl} target="_blank" rel="noopener">Read Reviews</a>
              <a className="btn btn-outline-light btn-lg" href={SITE.leaveReviewUrl} target="_blank" rel="noopener">Leave a Review</a>
            </div>
          </div>
          <div className="hero-card"><InspectionForm compact /></div>
        </div>
      </section>

      <CredentialLogos onHome />


      <section className="section" aria-labelledby="h-div">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">One company, six specialties</span>
            <h2 id="h-div">What our certified detection teams handle</h2>
            <p>Every service starts the same way: a certified detection team confirms what is there and where, before anyone treats.</p>
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
          <div className="k-founder home-founder" dangerouslySetInnerHTML={{ __html: imgTag('founder-portrait', 'Founder of Coastal K9 and Pest Solutions with a Jack Russell terrier', { sizes: '(max-width: 860px) 80vw, 360px' }) }} />
          <div>
            <span className="kicker">Our founder</span>
            <h2 id="h-kim">A first-class environmental detection program</h2>
            <p>Our founder started Coastal K9 and Pest Solutions after 28+ years handling working dogs, beginning with FEMA Urban Search and Rescue, and 27 years in wildlife management and education.</p>
            <p>The goal: detection teams working side by side with pest professionals, making their jobs easier, delivering faster results, and focusing and reducing the use of pesticides and rodenticides.</p>
            <div className="hero-ctas"><Link className="btn btn-teal" href="/about/">About us</Link><Link className="btn btn-light" href="/awards-and-recognition/">Awards &amp; recognition</Link></div>
          </div>
        </div>
      </section>

      <section className="section dark" aria-labelledby="h-nat">
        <div className="wrap split">
          <div>
            <span className="kicker">Nationwide · Food processing &amp; agriculture</span>
            <h2 id="h-nat">Nationwide K9 rodent detection and Norway rat burrow mitigation</h2>
            <p>Beyond the CSRA, Coastal K9 provides large-scale rodent mitigation across the country — including complex Norway rat burrow systems that overwhelm conventional programs. We specialize in food processing and agricultural operations where documentation is critical and detection-driven precision is the difference between control and chronic reinfestation.</p>
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
            <p>Same-week K9 detection within roughly 60 miles of our Windsor base, on both sides of the Savannah River — from Aiken’s Winter Colony and Houndslake to Lexington and Columbia — plus scheduled service across South Carolina, including Greenville and Charleston.</p>
          </div>
          <ul className="chips">
            {AREAS.map(([n, h]) => <li key={n}>{h ? <Link href={h}>{n}</Link> : <span>{n}</span>}</li>)}
            <li><Link href="/service-areas/">All service areas →</Link></li>
          </ul>
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
      <JsonLd data={pageGraph({ ...home, title: 'Coastal K9 and Pest Solutions', heroImage: 'facility-aerial' }, [{ label: 'Home', href: '/' }])} />
    </>
  );
}
