import { useEffect, useRef } from 'react';
import { Trophy, X } from '@phosphor-icons/react';
import { ACHIEVEMENTS, isUnlocked } from '../achievements';

export function AchievementToast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast" key={toast.key} role="status">
      <Trophy size={22} weight="fill" aria-hidden="true" />
      <div>
        <strong>Achievement unlocked</strong>
        <span>{toast.title}: {toast.text}</span>
      </div>
    </div>
  );
}

export function AchievementPanel({ open, onClose, count }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    if (closeRef.current) closeRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus({ preventScroll: true }); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ach-layer">
      <button type="button" className="term-backdrop" aria-label="Close achievements" onClick={onClose} tabIndex={-1} />
      <section className="ach" role="dialog" aria-modal="true" aria-label="Achievements">
        <header>
          <h2 className="h3">Achievements <span>{count} of {ACHIEVEMENTS.length}</span></h2>
          <button type="button" ref={closeRef} className="term-close" onClick={onClose} aria-label="Close achievements"><X size={16} /> Esc</button>
        </header>
        <ul>
          {ACHIEVEMENTS.map((a) => {
            const done = isUnlocked(a.id);
            return (
              <li key={a.id} className={done ? 'is-done' : ''}>
                <Trophy size={20} weight={done ? 'fill' : 'regular'} aria-hidden="true" />
                <div>
                  <strong>{done || !a.secret ? a.title : 'Hidden'}</strong>
                  <span>{done || !a.secret ? a.text : 'Keep exploring. There is more than one way to get this.'}</span>
                </div>
                <span className="sr-only">{done ? 'Unlocked' : 'Locked'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
