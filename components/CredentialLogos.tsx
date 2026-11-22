'use client';
import { usePathname } from 'next/navigation';
// Certification and professional membership logos, shown at the bottom of every page.
const certs = [
  { src: '/media/logos/cpda.webp', alt: 'Canine Pest Detection Association (CPDA)' },
  { src: '/media/logos/icrwda.webp', alt: 'International Casino & Resort Working Dog Association (ICRWDA)' },
  { src: '/media/logos/scapp.webp', alt: 'South Carolina Certified Commercial Pesticide Applicator' },
];
const members = [
  { src: '/media/logos/scpca.webp', alt: 'South Carolina Pest Control Association' },
  { src: '/media/logos/nwcoa.webp', alt: 'National Wildlife Control Operators Association (NWCOA)' },
  { src: '/media/logos/npma.webp', alt: 'National Pest Management Association (NPMA)' },
];

export default function CredentialLogos({ onHome = false }: { onHome?: boolean }) {
  const path = usePathname();
  // The home page shows these right under its top section, so skip the bottom band there.
  if (!onHome && path === '/') return null;
  return (
    <section className="section dark cred-logos" aria-label="Certifications and professional memberships">
      <div className="wrap">
        <div className="logo-group">
          <h3>Certifications</h3>
          <ul className="logo-row">
            {certs.map((l) => <li key={l.src}><img src={l.src} alt={l.alt} loading="lazy" /></li>)}
          </ul>
        </div>
        <div className="logo-group">
          <h3>Professional Memberships</h3>
          <ul className="logo-row">
            {members.map((l) => <li key={l.src}><img src={l.src} alt={l.alt} loading="lazy" /></li>)}
            <li title="Urban Pest Management Technical Committee (UPMTC)"><span className="logo-text">UPMTC<small>Urban Pest Management Technical Committee</small></span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
