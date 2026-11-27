export default function ProofStrip() {
  const items = ['Founded by Kim Camera, retired FEMA K9 handler', '2026 NPMA Impact Award', '18 working detection dogs', 'CPDA & ICRWDA certified K9 teams', 'Licensed SC pest control company', 'BBB A+ accredited'];
  return (
    <div className="proofstrip" aria-label="Credentials">
      <ul className="wrap proofstrip-in">{items.map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );
}
