import Link from 'next/link';
import { Page, imgTag, plain, postTopic } from '@/lib/content';

const TOPIC_IMG: Record<string, string[]> = {
  'bed-bugs': ['img-9437', 'img-9432', 'dog-insp-bb', 'img-9429', 'img-9425', 'img-9419', 'img-9428', 'img-9424'],
  rodents: ['ratsbig', 'img-9280', 'rats3', 'img-4510', 'kim-rats-4', 'img-9101'],
  bats: ['img-7044', 'img-7042', 'img-7043'],
  'geese-birds': ['goose', 'kimgoose', 'img-20260603-143908', 'bird', '20260412-051442-under-2mb'],
  spiders: ['spider-exterminator', 'img-7043'],
  k9: ['img-4510', 'trainnig', 'dog-insp', 'lab', 'insp5', 'img-4517'],
};
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const cardImg = (r: Page) => r.heroImage || (r.kind === 'post' ? (TOPIC_IMG[postTopic(r)] ?? TOPIC_IMG.k9)[hash(r.path) % (TOPIC_IMG[postTopic(r)] ?? TOPIC_IMG.k9).length] : null);
const cardTitle = (r: Page) => (r.kind === 'pest' ? plain(r.h1).replace(/\s*[—–]\s*Identification.*$/, '') : plain(r.h1));

export function CardGrid({ pages, more = 'Read more', withImage = true }: { pages: Page[]; more?: string; withImage?: boolean }) {
  return (
    <div className="cards">
      {pages.map((r) => (
        <Link key={r.path} href={r.path} className="card">
          {withImage && cardImg(r) ? <span dangerouslySetInnerHTML={{ __html: imgTag(cardImg(r)!, '', { sizes: '(max-width: 700px) 100vw, 300px' }) }} /> : null}
          <div className="card-b">
            <h3>{cardTitle(r)}</h3>
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
