import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from '@phosphor-icons/react';
import { PROFILE, EXPERIENCE, PROJECTS, SKILLS, CERTS, ZONES, EDUCATION } from '../data';
import { sfx } from '../sfx';
import { ACHIEVEMENTS, isUnlocked, unlock } from '../achievements';
import Duel, { SNIPPETS } from './Duel';

const PROMPT = 'visitor@mouhanned.os:~$';
const COMMANDS = ['help', 'about', 'neofetch', 'experience', 'projects', 'open', 'skills', 'certs', 'contact', 'resume', 'duel', 'achievements', 'goto', 'clear', 'exit'];
const ALIASES = { whoami: 'about', ls: 'projects', xp: 'experience', cv: 'resume', cd: 'goto', man: 'help', '?': 'help', quit: 'exit', close: 'exit', mail: 'contact', email: 'contact', certifications: 'certs', stack: 'skills', play: 'duel', ach: 'achievements', trophies: 'achievements' };

const LOGO = String.raw` __  __      _
|  \/  |    | |
| |\/| |    | |
| |  | | |__| |
|_|  |_|\____/`;

const Row = ({ k, children }) => (
  <div className="t-row"><span className="t-key">{k}</span><span>{children}</span></div>
);
const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

function findProject(q) {
  const s = (q || '').toLowerCase();
  return PROJECTS.find((p) => p.id === s) || PROJECTS.find((p) => p.id.startsWith(s) && s.length > 1);
}

export default function Terminal({ open, onClose, onGoto }) {
  const [history, setHistory] = useState([]);
  const [value, setValue] = useState('');
  const [cursor, setCursor] = useState(-1);
  const [duel, setDuel] = useState(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const returnFocus = useRef(null);
  const past = useRef([]);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
      return () => clearTimeout(t);
    }
    if (returnFocus.current && returnFocus.current.focus) returnFocus.current.focus({ preventScroll: true });
    return undefined;
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history, open, duel]);

  const output = useCallback((cmd, args) => {
    switch (cmd) {
      case 'help':
        return (
          <div className="t-block">
            {[
              ['about', 'who I am'],
              ['neofetch', 'system summary'],
              ['experience', 'where I have worked'],
              ['projects', 'everything I have built'],
              ['open <name>', 'project details, for example: open portico'],
              ['skills', 'the tech stack'],
              ['certs', 'certifications'],
              ['contact', 'email and links'],
              ['resume', 'download the resume'],
              ['duel', 'race Sensei in a typing duel'],
              ['achievements', 'see what you have unlocked'],
              ['goto <zone>', 'jump the page to a zone'],
              ['clear', 'clear the screen'],
              ['exit', 'close the terminal'],
            ].map(([c, d]) => <Row key={c} k={c}>{d}</Row>)}
            <p className="t-dim">Tab completes. Arrow keys cycle history. Try the number keys 1 to 7 outside the terminal.</p>
          </div>
        );
      case 'about':
        return (
          <div className="t-block">
            <p>{PROFILE.name}, software engineer.</p>
            <p>{PROFILE.tagline}</p>
            {EDUCATION.map((e) => <Row key={e.school} k={e.period}>{e.school}</Row>)}
          </div>
        );
      case 'neofetch':
        return (
          <div className="t-neo">
            <pre className="t-logo" aria-hidden="true">{LOGO}</pre>
            <div className="t-block">
              <Row k="name">{PROFILE.name}</Row>
              <Row k="role">Software Engineer at ETG</Row>
              <Row k="focus">AI products, RAG, full-stack, infrastructure</Row>
              <Row k="school">ENSIT, Computer Engineering</Row>
              <Row k="shipped">{PROJECTS.map((p) => p.name).join(', ')}</Row>
              <Row k="stack">React, Next.js, FastAPI, NestJS, PostgreSQL, Redis</Row>
              <Row k="status">{PROFILE.open}</Row>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="t-block">
            {EXPERIENCE.map((x) => (
              <div key={x.id} className="t-item">
                <strong>{x.company}</strong> <span className="t-dim">{x.role}, {x.period}</span>
                {x.products && x.products.map((p) => <div key={p.name} className="t-sub">{p.name} ({p.role}): {p.text}</div>)}
                {x.bullets.map((b) => <div key={b} className="t-sub">{b}</div>)}
              </div>
            ))}
          </div>
        );
      case 'projects':
        return (
          <div className="t-block">
            {PROJECTS.map((p) => <Row key={p.id} k={p.id}>{p.summary}</Row>)}
            <p className="t-dim">Type open followed by a name for details.</p>
          </div>
        );
      case 'open': {
        if (!args[0]) return <p className="t-err">Usage: open &lt;name&gt;. Try: {PROJECTS.map((p) => p.id).join(', ')}</p>;
        const p = findProject(args[0]);
        if (!p) return <p className="t-err">No project called "{args[0]}". Try: {PROJECTS.map((x) => x.id).join(', ')}</p>;
        return (
          <div className="t-block">
            <p><strong>{p.name}</strong> <span className="t-dim">{p.kind}</span></p>
            <p>{p.summary}</p>
            {p.points.map((pt) => <div key={pt} className="t-sub">{pt}</div>)}
            <Row k="stack">{p.stack.join(', ')}</Row>
            <Row k="link"><A href={p.url}>{p.url}</A></Row>
          </div>
        );
      }
      case 'skills':
        return (
          <div className="t-block">
            {SKILLS.map((g) => <Row key={g.id} k={g.label}>{g.items.join(', ')}</Row>)}
          </div>
        );
      case 'certs':
        return (
          <div className="t-block">
            {CERTS.map((c) => <Row key={c.name} k={c.year}><A href={c.link}>{c.name}</A> <span className="t-dim">{c.issuer}</span></Row>)}
          </div>
        );
      case 'contact':
        return (
          <div className="t-block">
            <Row k="email"><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></Row>
            <Row k="github"><A href={PROFILE.github}>{PROFILE.github}</A></Row>
            <Row k="linkedin"><A href={PROFILE.linkedin}>{PROFILE.linkedin}</A></Row>
            <p className="t-dim">{PROFILE.open}</p>
          </div>
        );
      case 'resume': {
        const a = document.createElement('a');
        a.href = PROFILE.resume;
        a.download = 'Mouhanned_Jawadi_Resume.pdf';
        unlock('paper');
        document.body.appendChild(a);
        a.click();
        a.remove();
        return <p>Downloading the resume. If nothing happens, <a href={PROFILE.resume}>open it here</a>.</p>;
      }
      case 'achievements':
        return (
          <div className="t-block">
            {ACHIEVEMENTS.map((a) => {
              const done = isUnlocked(a.id);
              return <Row key={a.id} k={done ? '[x]' : '[ ]'}>{done || !a.secret ? `${a.title}: ${a.text}` : 'Hidden. Keep exploring.'}</Row>;
            })}
          </div>
        );
      case 'duel': {
        const target = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
        const now = Date.now();
        setDuel({ target, start: now + 1400, begun: now, cps: 3.6 + Math.random() * 1.2 });
        return <p>Sensei accepted the duel. Get ready.</p>;
      }
      case 'goto': {
        const z = ZONES.find((x) => x.id === (args[0] || '').toLowerCase() || x.command === (args[0] || '').toLowerCase());
        if (!z) return <p className="t-err">Unknown zone. Try: {ZONES.map((x) => x.command).join(', ')}</p>;
        window.setTimeout(() => onGoto(z.id), 120);
        return <p>Jumping to {z.label}.</p>;
      }
      default:
        return null;
    }
  }, [onGoto]);

  const run = useCallback((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    past.current.unshift(trimmed);
    setCursor(-1);
    const parts = trimmed.split(/\s+/);
    let cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') { setHistory([]); return; }
    if (cmd === 'exit' || ALIASES[cmd] === 'exit') { onClose(); return; }

    let out;
    if (cmd === 'sudo' && /^hire/i.test(args.join(' '))) {
      out = (
        <div className="t-block">
          <p>[sudo] permission granted.</p>
          <p>Good call. Start the conversation: <a href={`mailto:${PROFILE.email}?subject=Let%27s%20work%20together`}>{PROFILE.email}</a></p>
        </div>
      );
      unlock('hire');
      sfx.select();
    } else {
      cmd = ALIASES[cmd] || cmd;
      out = COMMANDS.includes(cmd) ? output(cmd, args) : null;
      if (out === null) {
        out = <p className="t-err">command not found: {parts[0]}. Type help to list commands.</p>;
        sfx.error();
      } else {
        sfx.select();
      }
    }
    setHistory((h) => [...h, { id: `${Date.now()}-${Math.random()}`, cmd: trimmed, out }]);
  }, [onClose, output]);

  const push = useCallback((cmd, out) => setHistory((h) => [...h, { id: `${Date.now()}-${Math.random()}`, cmd, out }]), []);

  const lose = useCallback(() => {
    setDuel(null);
    setValue('');
    sfx.error();
    push('duel', <p className="t-err">Sensei finished first. Type duel to run it back.</p>);
  }, [push]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (duel) { setDuel(null); setValue(''); push('duel', <p className="t-dim">You forfeited the duel.</p>); } else onClose();
      return;
    }
    if (duel && e.key === 'Enter') {
      e.preventDefault();
      if (Date.now() < duel.start) return;
      if (value === duel.target) {
        const secs = (Date.now() - duel.start) / 1000;
        const wpm = Math.round((duel.target.length / 5) / (secs / 60));
        setDuel(null);
        setValue('');
        sfx.select();
        unlock('duel');
        push('duel', <p>You beat Sensei in {secs.toFixed(1)}s, about {wpm} WPM.</p>);
      } else {
        sfx.error();
      }
      return;
    }
    if (e.key === 'Enter') { run(value); setValue(''); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const n = Math.min(cursor + 1, past.current.length - 1);
      if (n >= 0) { setCursor(n); setValue(past.current[n]); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const n = cursor - 1;
      setCursor(n);
      setValue(n >= 0 ? past.current[n] : '');
      return;
    }
    if (e.key === 'Tab' && value.trim()) {
      e.preventDefault();
      const parts = value.split(/\s+/);
      const last = parts[parts.length - 1].toLowerCase();
      const pool = parts.length === 1
        ? [...COMMANDS, ...Object.keys(ALIASES)]
        : parts[0] === 'open' ? PROJECTS.map((p) => p.id) : parts[0] === 'goto' || parts[0] === 'cd' ? ZONES.map((z) => z.command) : [];
      const hit = pool.find((c) => c.startsWith(last));
      if (hit) { parts[parts.length - 1] = hit; setValue(parts.join(' ') + (parts.length === 1 ? ' ' : '')); }
      return;
    }
    sfx.key();
  };

  if (!open) return null;

  return (
    <div className="term-layer">
      <button type="button" className="term-backdrop" aria-label="Close terminal" onClick={onClose} tabIndex={-1} />
      <section className="term" role="dialog" aria-modal="true" aria-label="Terminal" onClick={() => inputRef.current && inputRef.current.focus()}>
        <header className="term-bar">
          <span>mouhanned.os terminal</span>
          <button type="button" className="term-close" onClick={onClose} aria-label="Close terminal"><X size={16} /> Esc</button>
        </header>
        <div className="term-body" ref={bodyRef} aria-live="polite">
          <p className="t-dim">Type help to see what this terminal can do.</p>
          <div className="term-chips">
            {['help', 'projects', 'skills', 'contact', 'resume'].map((c) => (
              <button key={c} type="button" className="term-chip" onClick={(e) => { e.stopPropagation(); run(c); }}>{c}</button>
            ))}
          </div>
          {history.map((h) => (
            <div key={h.id} className="t-entry">
              <div className="t-line"><span className="t-prompt">{PROMPT}</span> {h.cmd}</div>
              {h.out}
            </div>
          ))}
          {duel && <Duel duel={duel} value={value} onLose={lose} />}
        </div>
        <label className="term-input">
          <span className="t-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label="Terminal command"
          />
        </label>
      </section>
    </div>
  );
}
