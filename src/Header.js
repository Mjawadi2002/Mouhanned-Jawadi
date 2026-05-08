import { useState, useEffect } from 'react';

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`nav-header${scrolled ? ' nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#hero" className="nav-brand" onClick={(e) => go(e, '#hero')}>
          MJ<span className="accent">.</span>
        </a>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="nav-link" onClick={(e) => go(e, n.href)}>
              {n.label}
            </a>
          ))}
          <a href="mailto:mouhanned.jawadi23@gmail.com" className="nav-cta">Hire Me</a>
        </nav>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
