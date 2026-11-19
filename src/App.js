import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Boot from './components/Boot';
import HUD from './components/HUD';
import { AchievementToast, AchievementPanel } from './components/Achievements';
import { useAchievements, unlock } from './achievements';
import { Hero, About, Experience, Projects, Skills, Certifications, Contact } from './components/Zones';
import { ZONES } from './data';
import { usePrefersReducedMotion } from './hooks';
import { sfx } from './sfx';

gsap.registerPlugin(ScrollTrigger);

// heavy pieces load in parallel with the boot screen, or only when first needed
const World3D = lazy(() => import('./components/World3D'));
const Terminal = lazy(() => import('./components/Terminal'));

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const MAX_DEPTH_M = 1800;

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState('boot'); // boot -> world
  const [zone, setZone] = useState(0);
  const [termOpen, setTermOpen] = useState(false);
  const [achOpen, setAchOpen] = useState(false);
  const { count, toast, total } = useAchievements();
  const visited = useRef(new Set([0]));
  const konami = useRef(0);

  const progressRef = useRef(0);
  const gatesRef = useRef([]);
  const zoneRef = useRef(0);
  const introRef = useRef({ t: 0 });
  const uiRef = useRef({ project: 0, mission: 0, cert: -1 });
  const depthRef = useRef(null);
  const barRef = useRef(null);

  // scroll is locked until the player dives in
  useEffect(() => {
    document.body.classList.toggle('locked', phase === 'boot');
  }, [phase]);

  const dive = useCallback(() => {
    setPhase('world');
    unlock('dive');
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
            if (self.isActive) {
              zoneRef.current = i;
              setZone(i);
              visited.current.add(i);
              if (visited.current.size === ZONES.length) unlock('descent');
              try { window.history.replaceState(null, '', i === 0 ? window.location.pathname : `#${z.id}`); } catch (e) { /* ignore */ }
              document.title = i === 0 ? 'Mouhanned Jawadi | Software Engineer, AI Systems' : `${z.label} | Mouhanned Jawadi`;
            }
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

  useEffect(() => { if (termOpen) unlock('shell'); }, [termOpen]);

  // deep link: open straight to a zone after the dive when the URL has a hash
  useEffect(() => {
    if (phase !== 'world') return undefined;
    const id = window.location.hash.replace('#', '');
    if (!id || !ZONES.some((z) => z.id === id)) return undefined;
    const t = setTimeout(() => goto(id), 1400);
    return () => clearTimeout(t);
  }, [phase, goto]);

  // keyboard: backtick / ctrl+k terminal, 1-7 teleport
  useEffect(() => {
    const onKey = (e) => {
      if (phase === 'world') {
        const want = KONAMI[konami.current];
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (key === want) {
          konami.current += 1;
          if (konami.current === KONAMI.length) { konami.current = 0; unlock('konami'); uiRef.current.surge = 1; }
        } else konami.current = key === KONAMI[0] ? 1 : 0;
      }
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
      <Suspense fallback={null}>
        <World3D progressRef={progressRef} gatesRef={gatesRef} zoneRef={zoneRef} introRef={introRef} uiRef={uiRef} reduced={reduced} />
      </Suspense>
      <div className="scrim" aria-hidden="true" />

      {phase === 'boot' && <Boot onEnter={dive} reduced={reduced} />}

      <div className={`stage${phase === 'world' ? ' is-live' : ''}`} aria-hidden={phase === 'boot'}>
        <HUD zone={zone} onGoto={goto} onTerminal={() => setTermOpen(true)} onAchievements={() => setAchOpen(true)} achCount={count} achTotal={total} depthRef={depthRef} barRef={barRef} />
        <main>
          <Hero onGoto={goto} onTerminal={() => setTermOpen(true)} />
          <About />
          <Experience ui={uiRef} />
          <Projects ui={uiRef} />
          <Skills />
          <Certifications ui={uiRef} />
          <Contact />
        </main>
      </div>

      {termOpen && (
        <Suspense fallback={null}>
          <Terminal open={termOpen} onClose={() => setTermOpen(false)} onGoto={goto} />
        </Suspense>
      )}
      <AchievementToast toast={toast} />
      <AchievementPanel open={achOpen} onClose={() => setAchOpen(false)} count={count} />
      <noscript><p className="noscript">This portfolio is an interactive 3D experience. Enable JavaScript to enter. Contact: mouhanned.j18@gmail.com</p></noscript>
    </div>
  );
}
