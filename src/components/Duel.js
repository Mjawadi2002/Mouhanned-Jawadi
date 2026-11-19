import { useEffect, useRef, useState } from 'react';

// A tiny 1v1 typing duel against a bot called Sensei.
export const SNIPPETS = [
  'const fib = (n) => n < 2 ? n : fib(n - 1) + fib(n - 2);',
  'SELECT id, COUNT(*) FROM duels GROUP BY id HAVING COUNT(*) > 3;',
  'def two_sum(a, t): return {t - x: i for i, x in enumerate(a)}',
  'for (const [k, v] of Object.entries(rating)) update(k, v);',
];

export function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

const LANE = 28;
const lane = (frac) => {
  const at = Math.min(LANE - 1, Math.floor(frac * (LANE - 1)));
  return `${'-'.repeat(at)}>${'-'.repeat(LANE - 1 - at)}|`;
};

export default function Duel({ duel, value, onLose }) {
  const [now, setNow] = useState(Date.now());
  const done = useRef(false);

  useEffect(() => {
    done.current = false;
    const id = setInterval(() => setNow(Date.now()), 90);
    return () => clearInterval(id);
  }, [duel]);

  const { target, start, cps } = duel;
  const botChars = Math.max(0, Math.min(target.length, Math.floor(((now - start) / 1000) * cps)));
  const ok = commonPrefix(value, target);
  const wrong = value.length > ok;

  useEffect(() => {
    if (botChars >= target.length && !done.current) {
      done.current = true;
      onLose();
    }
  }, [botChars, target.length, onLose]);

  return (
    <div className="duel" aria-live="off">
      <p className="t-dim">Duel with Sensei. Type this line exactly, then press Enter. Esc forfeits.</p>
      <pre className="duel-target" aria-label={`Type: ${target}`}>
        <span className="duel-ok">{target.slice(0, ok)}</span>
        {wrong && <span className="duel-bad">{target[ok]}</span>}
        <span className="duel-rest">{wrong ? target.slice(ok + 1) : target.slice(ok)}</span>
      </pre>
      <pre className="duel-lanes" aria-hidden="true">
        {`you     ${lane(ok / target.length)}\nsensei  ${lane(botChars / target.length)}`}
      </pre>
    </div>
  );
}
