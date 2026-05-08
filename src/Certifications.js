const CERTS = [
  { name: 'Associate AI Engineer for Data Scientists', issuer: 'DataCamp', year: '2024', link: 'https://www.datacamp.com/certificate/AIEDA0015057790682' },
  { name: 'AWS Academy Machine Learning Foundations', issuer: 'Amazon Web Services', year: '2024', link: 'https://www.credly.com/badges/77811255-17cf-4a7a-bdcb-a47494ef7e1c/linked_in_profile' },
  { name: 'AWS Academy Introduction to Cloud', issuer: 'Amazon Web Services', year: '2024', link: 'https://www.credly.com/badges/2baf8266-eaa1-45de-813e-53269a57ce5e/linked_in_profile' },
  { name: 'CCNAv7: Switching, Routing & Wireless Essentials', issuer: 'Cisco', year: '2023', link: 'https://www.netacad.com/certificates?issuanceId=a68eb266-0fbd-4b7b-ba29-6a368d84b477' },
  { name: 'CCNAv7: Introduction to Networks', issuer: 'Cisco', year: '2023', link: 'https://www.netacad.com/certificates?issuanceId=9ddb7e30-5316-443f-8e65-dd7b1ddfd1d2' },
];

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <div className="container">
        <span className="section-label fade-up">06 — Certifications</span>
        <h2 className="section-title fade-up fade-up-d1">Credentials</h2>
        <div className="certs-grid fade-up fade-up-d2">
          {CERTS.map((c) => (
            <a key={c.name} href={c.link} target="_blank" rel="noopener noreferrer" className="cert-card">
              <span className="cert-arrow">↗</span>
              <div className="cert-issuer">{c.issuer}</div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-year">{c.year}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
