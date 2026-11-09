import Link from 'next/link';
import { Page, imgTag, plain } from '@/lib/content';

export function CardGrid({ pages, more = 'Read more', withImage = true }: { pages: Page[]; more?: string; withImage?: boolean }) {
  return (
    <div className="cards">
      {pages.map((r) => (
        <Link key={r.path} href={r.path} className="card">
          {withImage && r.heroImage ? <span dangerouslySetInnerHTML={{ __html: imgTag(r.heroImage, '', { sizes: '(max-width: 700px) 100vw, 300px' }) }} /> : null}
          <div className="card-b">
            <h3>{plain(r.h1)}</h3>
            <p>{(r.description || r.excerpt).slice(0, 150)}{(r.description || r.excerpt).length > 150 ? '…' : ''}</p>
            <span className="card-more">{more} →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Related({ title, pages }: { title: string; pages: Page[] }) {
  if (!pages.length) return null;
  return (
    <section className="section soft" aria-labelledby="rel-h">
      <div className="wrap">
        <div className="section-head"><h2 id="rel-h">{title}</h2></div>
        <CardGrid pages={pages} />
      </div>
    </section>
  );
}
