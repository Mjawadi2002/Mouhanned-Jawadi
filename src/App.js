import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import World3D from './components/World3D';
import Boot from './components/Boot';
import HUD from './components/HUD';
import Terminal from './components/Terminal';
import { Hero, About, Experience, Projects, Skills, Certifications, Contact } from './components/Zones';
import { ZONES } from './data';
import { usePrefersReducedMotion } from './hooks';
import { sfx } from './sfx';

gsap.registerPlugin(ScrollTrigger);

const MAX_DEPTH_M = 1800;

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState('boot'); // boot -> world
  const [zone, setZone] = useState(0);
  const [termOpen, setTermOpen] = useState(false);

  const progressRef = useRef(0);
  const gatesRef = useRef([]);
  const zoneRef = useRef(0);
  const introRef = useRef({ t: 0 });
  const depthRef = useRef(null);
  const barRef = useRef(null);

  // scroll is locked until the player dives in
  useEffect(() => {
    document.body.classList.toggle('locked', phase === 'boot');
  }, [phase]);

  const dive = useCallback(() => {
    setPhase('world');
    gsap.to(introRef.current, { t: 1, duration: reduced ? 0.01 : 2.8, ease: 'none' });
  }, [reduced]);

  const goto = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTermOpen(false);
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [reduced]);

  // scroll-linked world: depth, zone tracking, gate positions, reveals
  useEffect(() => {
    if (phase !== 'world') return undefined;
    const ctx = gsap.context(() => {
      const computeGates = () => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        gatesRef.current = ZONES.map((z) => {
          const el = document.getElementById(z.id);
          return el ? Math.min(el.offsetTop / max, 1) : 0;
        });
      };
      computeGates();
      ScrollTrigger.addEventListener('refresh', computeGates);

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (depthRef.current) depthRef.current.textContent = String(Math.round(self.progress * MAX_DEPTH_M)).padStart(4, '0');
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
        },
      });

      ZONES.forEach((z, i) => {
        ScrollTrigger.create({
          trigger: `#${z.id}`,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) { zoneRef.current = i; setZone(i); }
          },
        });
      });

      if (!reduced) {
        document.documentElement.classList.add('rv-on');
        ScrollTrigger.batch('[data-rv]', {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true }),
        });
      }
      ScrollTrigger.refresh();
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      document.documentElement.classList.remove('rv-on');
      ctx.revert();
    };
  }, [phase, reduced]);

  // keyboard: backtick / ctrl+k terminal, 1-7 teleport
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === '`' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        if (phase === 'world') setTermOpen((o) => !o);
        return;
      }
      if (phase !== 'world' || typing || termOpen || e.altKey || e.ctrlKey || e.metaKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= ZONES.length) { sfx.select(); goto(ZONES[n - 1].id); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, termOpen, goto]);

  return (
    <div className="App">
      <a className="skip" href="#about">Skip to content</a>
      <World3D progressRef={progressRef} gatesRef={gatesRef} zoneRef={zoneRef} introRef={introRef} reduced={reduced} />
      <div className="scrim" aria-hidden="true" />

      {phase === 'boot' && <Boot onEnter={dive} reduced={reduced} />}

      <div className={`stage${phase === 'world' ? ' is-live' : ''}`} aria-hidden={phase === 'boot'}>
        <HUD zone={zone} onGoto={goto} onTerminal={() => setTermOpen(true)} depthRef={depthRef} barRef={barRef} />
        <main>
          <Hero onGoto={goto} onTerminal={() => setTermOpen(true)} />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Certifications />
          <Contact />
        </main>
      </div>

      <Terminal open={termOpen} onClose={() => setTermOpen(false)} onGoto={goto} />
      <noscript><p className="noscript">This portfolio is an interactive 3D experience. Enable JavaScript to enter. Contact: mouhanned.j18@gmail.com</p></noscript>
    </div>
  );
}
