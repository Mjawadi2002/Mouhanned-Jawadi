import { useState, useEffect } from 'react';

const ROLES = ['Full-Stack Engineer', 'AI Systems Builder', 'Dev Lead'];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  useEffect(() => {
    const current = ROLES[roleIdx];
    let t;
    if (!deleting && text.length < current.length) {
      t = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === current.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && text.length > 0) {
      t = setTimeout(() => setText(current.slice(0, text.length - 1)), 45);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setRoleIdx((roleIdx + 1) % ROLES.length);
    }
    return () => clearTimeout(t);
  }, [text, deleting, roleIdx]);

  const scroll = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="container">
        <div className={`hero-content${visible ? ' visible' : ''}`}>
          <p className="hero-label">Based in Tunis, Tunisia</p>
          <h1 className="hero-name">
            Mouhanned<br />
            <span className="accent">Jawadi</span>
          </h1>
          <p className="hero-tagline">"I don't just write features. I own the architecture, the infra, and the outcome."</p>
          <div className="hero-role">
            <span className="accent">&gt;</span>
            <span>{text}</span>
            <span className="cursor-blink">_</span>
          </div>
          <p className="hero-desc">
            Software engineer who architects systems, owns infrastructure, and writes production code end to end — web, desktop, and AI-integrated.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary" onClick={(e) => scroll(e, '#projects')}>View My Work</a>
            <a href="#contact" className="btn-ghost" onClick={(e) => scroll(e, '#contact')}>Get in Touch</a>
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <span className="scroll-label">scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
