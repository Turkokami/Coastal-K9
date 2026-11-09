import Link from 'next/link';
import { imgTag } from '@/lib/content';
import { SITE } from '@/lib/site';
export default function Byline({ modified, label = 'Written & reviewed by' }: { modified?: string; label?: string }) {
  const d = modified ? new Date(modified + 'Z') : null;
  return (
    <div className="byline">
      <span className="byline-img" dangerouslySetInnerHTML={{ __html: imgTag('kim1', 'Kimberly Camera', { sizes: '56px' }) }} />
      <div>
        <div>{label} <Link href="/about/"><b>{SITE.founder.name}</b></Link>, founder</div>
        <div className="byline-sub">FEMA US&amp;R-trained K9 handler · NESDCA · WDDO · CPDA · ICRWDA{d ? <> · Updated <time dateTime={d.toISOString().slice(0, 10)}>{d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time></> : null}</div>
      </div>
    </div>
  );
}
