import Link from 'next/link';
import { SITE } from '@/lib/site';
export default function Byline({ modified, label = 'Written & reviewed by' }: { modified?: string; label?: string }) {
  const d = modified ? new Date(modified + 'Z') : null;
  return (
    <div className="byline">
            <div>
        <div>{label} <Link href="/about/"><b>{SITE.name}</b></Link></div>
        <div className="byline-sub">FEMA US&amp;R roots · NESDCA · WDDO · CPDA · ICRWDA{d ? <> · Updated <time dateTime={d.toISOString().slice(0, 10)}>{d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time></> : null}</div>
      </div>
    </div>
  );
}
