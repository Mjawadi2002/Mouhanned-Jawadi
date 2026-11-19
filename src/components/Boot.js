import { useEffect, useRef, useState } from 'react';
import { ArrowRight, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { sfx } from '../sfx';

const LINES = [
  ['mount', '/education', 'ENSIT, Computer Engineering'],
  ['load', '/experience', 'ETG, CAEI, Sagemcom, CPG'],
  ['index', '/projects', '6 products built'],
  ['link', '/skills', 'TypeScript, Python, FastAPI, RAG'],
  ['check', '/certifications', '5 credentials'],
  ['open', '/contact', 'ready'],
];

export default function Boot({ onEnter, reduced }) {
  const [shown, setShown] = useState(reduced ? LINES.length : 0);
  const [leaving, setLeaving] = useState(false);
  const [sound, setSound] = useState(sfx.isOn());
  const btnRef = useRef(null);
  const ready = shown >= LINES.length;

  useEffect(() => {
    if (reduced || shown >= LINES.length) return undefined;
    const t = setTimeout(() => { setShown((n) => n + 1); sfx.tick(); }, shown === 0 ? 700 : 340);
    return () => clearTimeout(t);
  }, [shown, reduced]);

  useEffect(() => { if (ready && btnRef.current) btnRef.current.focus({ preventScroll: true }); }, [ready]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    sfx.dive();
    onEnter();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!ready) setShown(LINES.length);
        else enter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, leaving]);

  const toggleSound = (e) => {
    e.stopPropagation();
    const next = !sound;
    sfx.set(next);
    setSound(next);
  };

  return (
    <div className={`boot${leaving ? ' boot-leaving' : ''}`} role="dialog" aria-label="Start screen">
      <div className="boot-inner">
        <p className="boot-head">mouhanned.os is starting</p>
        <ul className="boot-log" aria-live="polite">
          {LINES.slice(0, shown).map(([verb, path, note]) => (
            <li key={path}>
              <span className="boot-ok">OK</span>
              <span className="boot-verb">{verb}</span>
              <span className="boot-path">{path}</span>
              <span className="boot-note">{note}</span>
            </li>
          ))}
        </ul>

        <div className={`boot-gate${ready ? ' is-ready' : ''}`} aria-hidden={!ready}>
          <h1 className="boot-title">Mouhanned Jawadi</h1>
          <p className="boot-sub">Software engineer. Press Enter to dive in.</p>
          <div className="boot-actions">
            <button ref={btnRef} type="button" className="btn btn-primary" onClick={enter} tabIndex={ready ? 0 : -1}>
              Enter <ArrowRight size={16} weight="bold" />
            </button>
            <button type="button" className="btn" onClick={toggleSound} aria-pressed={sound} tabIndex={ready ? 0 : -1}>
              {sound ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
              Sound {sound ? 'on' : 'off'}
            </button>
          </div>
        </div>
      </div>
      {!ready && (
        <button type="button" className="boot-skip" onClick={() => setShown(LINES.length)}>
          Skip
        </button>
      )}
    </div>
  );
}
