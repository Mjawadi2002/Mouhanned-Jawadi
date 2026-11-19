import { useEffect, useRef, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  });
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) { return undefined; }
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

const GLYPHS = '01<>/\\{}[]#$%&*+=?';

// Scrambles text into place once, when it first scrolls into view.
export function useDecode(text, { enabled = true, delay = 0 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    let raf = 0;
    let timer = 0;
    let done = false;
    const run = () => {
      const start = performance.now();
      const dur = Math.min(900, 260 + text.length * 22);
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const reveal = Math.floor(t * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          out += i < reveal || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done) {
          done = true;
          timer = window.setTimeout(run, delay);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); el.textContent = text; };
  }, [text, enabled, delay]);
  return ref;
}
