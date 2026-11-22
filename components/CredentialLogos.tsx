// Certification and professional membership logos, shown at the bottom of every page.
const certs = [
  { src: '/media/logos/wddo.webp', alt: 'World Detector Dog Organization (WDDO)' },
  { src: '/media/logos/nesdca.webp', alt: 'NESDCA accredited bed bug detection team' },
  { src: '/media/logos/cpda.webp', alt: 'CPDA' },
];
const members = [
  { src: '/media/logos/scpca.webp', alt: 'South Carolina Pest Control Association' },
  { src: '/media/logos/nwcoa.webp', alt: 'National Wildlife Control Operators Association (NWCOA)' },
  { src: '/media/logos/npma.webp', alt: 'National Pest Management Association (NPMA)' },
];

export default function CredentialLogos() {
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
            <li><span className="logo-text">UPMTC</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
