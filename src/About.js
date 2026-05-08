import profileImg from './images/Monochrome Ilustration Graffiti Logo (1).png';

export default function About() {
  return (
    <section id="about" className="section about-bg">
      <div className="container">
        <span className="section-label fade-up">02 — About</span>
        <div className="about-grid">
          <div>
            <h2 className="section-title fade-up fade-up-d1">
              Engineer by training.<br />Builder by nature.
            </h2>
            <p className="about-p fade-up fade-up-d2">
              I'm a Computer Engineer from ENSIT (Tunis), specializing in Software Engineering and Decision Intelligence. I build production systems — full-stack web apps, desktop clients, AI-integrated platforms — and own every layer: architecture, database design, infrastructure, deployment.
            </p>
            <p className="about-p fade-up fade-up-d2">
              At <span className="accent">ETG</span>, I led development on SaleSide, an AI-powered in-call coaching platform shipped from zero to production across web, desktop, and a Chrome extension. I also architected MidrollPro, a YouTube monetization optimizer powered by a custom reinforcement learning model.
            </p>
            <p className="about-p fade-up fade-up-d3">
              I'm not just an AI tooling user — I architect systems, own the infrastructure, write clean production code, and make technical decisions I can defend end to end.
            </p>
            <p className="about-p fade-up fade-up-d3">
              Outside the terminal: piano, cinematography, photography, poetry, FC Barcelona, hiking, cooking.
            </p>
            <div className="about-tags fade-up fade-up-d4">
              {['Tunis, Tunisia', 'Open to Remote', 'Open to European Roles', 'Full-Stack', 'AI Systems'].map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
          <div className="about-img-col fade-up fade-up-d2">
            <div className="about-img-placeholder">
              <img src={profileImg} alt="Mouhanned Jawadi" className="about-photo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
