import { SITE } from './site';
import { MEDIA, Page, plain, PAGES } from './content';

const U = (p: string) => SITE.url + p;
export const LB_ID = U('/#localbusiness');
export const WEBSITE_ID = U('/#website');
export const PERSON_ID = U('/about/#kimberly-camera');

function abs(src: string) { return src.startsWith('http') ? src : U(src); }

export function imageNode(name: string | null | undefined, pageUrl: string) {
  const m = name ? MEDIA[name] : undefined;
  const src = m ? m.sizes[m.sizes.length - 1].src : '/brand/og-default.jpg';
  return {
    '@type': 'ImageObject', '@id': pageUrl + '#primaryimage', url: abs(src), contentUrl: abs(src),
    width: m?.w ?? 1200, height: m?.h ?? 630, caption: m?.alt || SITE.name,
    creditText: SITE.name, copyrightNotice: `© ${SITE.name}`,
  };
}

export function coreNodes() {
  return [
    {
      '@type': ['LocalBusiness', 'ProfessionalService'], '@id': LB_ID, name: SITE.name, url: U('/'),
      logo: { '@type': 'ImageObject', url: U(SITE.logo) }, image: U('/brand/og-default.jpg'),
      description: 'Family-owned certified K9 detection and pest solutions company in Windsor, SC — K9 bed bug and rodent detection, rodent exclusion, Canada goose and bird management for the CSRA and Midlands, plus nationwide K9 rodent detection for food processing and agriculture.',
      telephone: '+1-' + SITE.phone, email: SITE.email, priceRange: '$$',
      address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.zip, addressCountry: SITE.address.country },
      openingHoursSpecification: SITE.hours.filter((h) => h.days.length).map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
      areaServed: SITE.areaServed.map((c) => ({ '@type': 'City', name: c.includes(',') ? c : `${c}, SC` })),
      founder: { '@id': PERSON_ID },
      sameAs: SITE.social.map((s) => s.url),
      knowsAbout: ['Canine scent detection', 'Bed bug detection', 'Rodent detection', 'Norway rat burrow mitigation', 'Integrated pest management', 'Canada goose management', 'Bird exclusion', 'Rodent exclusion'],
    },
    { '@type': 'WebSite', '@id': WEBSITE_ID, url: U('/'), name: SITE.name, publisher: { '@id': LB_ID }, inLanguage: 'en-US' },
    {
      '@type': 'Person', '@id': PERSON_ID, name: SITE.founder.name, jobTitle: SITE.founder.jobTitle, url: U('/about/'),
      worksFor: { '@id': LB_ID }, description: SITE.founder.summary, sameAs: SITE.founder.sameAs,
      hasCredential: SITE.credentials.map((c) => ({ '@type': 'EducationalOccupationalCredential', name: `${c.abbr} — ${c.name}`, recognizedBy: { '@type': 'Organization', name: c.name, url: c.url } })),
      knowsAbout: ['Canine scent detection', 'FEMA urban search and rescue canine handling', 'Wildlife biology', 'Integrated pest management'],
    },
  ];
}

export function breadcrumbNode(url: string, crumbs: { label: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: U(c.href) })),
  };
}

const SERVICE_KINDS = new Set(['service', 'commercial', 'nationwide', 'city-service', 'city', 'neighborhood']);

export function pageGraph(p: Page, crumbs: { label: string; href: string }[]) {
  const url = U(p.path);
  const graph: any[] = [...coreNodes()];
  const webpage: any = {
    '@type': p.kind === 'about' ? 'AboutPage' : p.kind === 'contact' ? 'ContactPage' : p.kind.startsWith('hub') || p.kind === 'gallery' || p.kind === 'videos' ? 'CollectionPage' : 'WebPage',
    '@id': url + '#webpage', url, name: p.title, description: p.description, isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': LB_ID }, primaryImageOfPage: { '@id': url + '#primaryimage' }, breadcrumb: { '@id': url + '#breadcrumb' },
    inLanguage: 'en-US', dateModified: p.modified ? p.modified + 'Z' : undefined,
  };
  if (p.kind === 'about') webpage.mainEntity = { '@id': PERSON_ID };
  graph.push(webpage, imageNode(p.heroImage, url), breadcrumbNode(url, crumbs));

  if (SERVICE_KINDS.has(p.kind)) {
    const city = p.citySvc ? p.citySvc.city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;
    graph.push({
      '@type': 'Service', '@id': url + '#service', name: plain(p.h1), url, description: p.description,
      provider: { '@id': LB_ID }, serviceType: plain(p.hero.eyebrow || p.h1),
      areaServed: city ? { '@type': 'City', name: `${city}, SC` } : p.kind === 'nationwide' ? { '@type': 'Country', name: 'United States' } : { '@type': 'AdministrativeArea', name: 'CSRA and South Carolina Midlands' },
      mainEntityOfPage: { '@id': url + '#webpage' },
    });
  }
  if (p.kind === 'post' || p.kind === 'pest') {
    graph.push({
      '@type': p.kind === 'post' ? 'BlogPosting' : 'Article', '@id': url + '#article', headline: plain(p.h1).slice(0, 110), description: p.description,
      author: { '@id': PERSON_ID }, publisher: { '@id': LB_ID }, image: { '@id': url + '#primaryimage' },
      datePublished: p.date ? p.date + 'Z' : undefined, dateModified: p.modified ? p.modified + 'Z' : undefined,
      mainEntityOfPage: { '@id': url + '#webpage' }, inLanguage: 'en-US',
      citation: p.citations.length ? p.citations.map((c) => ({ '@type': 'CreativeWork', name: c.name, url: c.url })) : undefined,
    });
  }
  // Conditional: FAQPage only where the Q&A is visible on the page.
  // Hubs: ItemList of the pages they index
  const hubKinds: Record<string, string> = { 'hub-blog': 'post', 'hub-pests': 'pest', 'hub-areas': 'city' };
  if (hubKinds[p.kind]) {
    const items = PAGES.filter((x) => x.kind === hubKinds[p.kind]);
    webpage.mainEntity = { '@id': url + '#itemlist' };
    graph.push({ '@type': 'ItemList', '@id': url + '#itemlist', numberOfItems: items.length,
      itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: U(x.path), name: plain(x.h1) })) });
  }
  if (p.faqs.length >= 2) {
    graph.push({
      '@type': 'FAQPage', '@id': url + '#faq',
      mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
