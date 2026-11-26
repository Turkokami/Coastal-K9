import Link from 'next/link';
import { imgTag } from '@/lib/content';
export default function FounderCard() {
  return (
    <section className="founder-card" aria-labelledby="founder-card-h">
      <div className="founder-card-img" dangerouslySetInnerHTML={{ __html: imgTag('founder-portrait', 'Kim Camera, founder of Coastal K9 and Pest Solutions', { sizes: '120px' }) }} />
      <div>
        <h2 id="founder-card-h">Who stands behind your service</h2>
        <p>Coastal K9 and Pest Solutions was founded by <b>Kim Camera</b>, a retired FEMA K9 handler with Tennessee Task Force 1 and a 2026 NPMA Impact Award recipient. Every handler on our team is certified through at least one K9 detection organization, and the company is a fully licensed South Carolina pest control business.</p>
        <p><Link href="/about/">Meet Kim and the team →</Link> · <a href="tel:8032263155">Call or text 803-226-3155</a></p>
      </div>
    </section>
  );
}
