import Link from 'next/link';
import { SITE } from '@/lib/site';
export default function CtaBand({ title = 'Not sure what you’re dealing with?', text = 'Let a certified detection team find out — before anyone treats. Same-week inspections across Aiken, the CSRA and the Midlands.' }: { title?: string; text?: string }) {
  return (
    <section className="ctaband" aria-label="Request an inspection">
      <div className="wrap ctaband-in">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="ctaband-btns">
          <Link className="btn btn-primary btn-lg" href="/contact/#inspection">Request an Inspection</Link>
          <a className="btn btn-outline-light btn-lg" href={SITE.phoneHref}>Call {SITE.phone}</a>
        </div>
      </div>
    </section>
  );
}
