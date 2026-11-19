import { useEffect, useState } from 'react';

// Small achievement system. Unlocks persist in localStorage and announce themselves
// with a window event so any component (terminal, zones, HUD) can trigger one.

export const ACHIEVEMENTS = [
  { id: 'dive', title: 'Dive in', text: 'Entered the portfolio.' },
  { id: 'descent', title: 'Full descent', text: 'Visited every zone.' },
  { id: 'shell', title: 'Shell access', text: 'Opened the terminal.' },
  { id: 'select', title: 'Level select', text: 'Looked at every project.' },
  { id: 'paper', title: 'Paper trail', text: 'Downloaded the resume.' },
  { id: 'duel', title: 'Duelist', text: 'Beat Sensei in a typing duel.' },
  { id: 'hire', title: 'Good call', text: 'Ran sudo hire mouhanned.', secret: true },
  { id: 'konami', title: 'Old school', text: 'Entered the Konami code.', secret: true },
];

const KEY = 'mj-achievements';
let got = new Set();
try {
  got = new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
} catch (e) { /* storage blocked */ }

export const isUnlocked = (id) => got.has(id);

export function unlock(id) {
  if (got.has(id) || !ACHIEVEMENTS.some((a) => a.id === id)) return;
  got.add(id);
  try { localStorage.setItem(KEY, JSON.stringify([...got])); } catch (e) { /* ignore */ }
  window.dispatchEvent(new CustomEvent('mj-achievement', { detail: id }));
}

export function useAchievements() {
  const [count, setCount] = useState(got.size);
  const [toast, setToast] = useState(null);
  useEffect(() => {
    let timer = 0;
    const on = (e) => {
      setCount(got.size);
      const a = ACHIEVEMENTS.find((x) => x.id === e.detail);
      setToast({ key: Date.now(), ...a });
      clearTimeout(timer);
      timer = window.setTimeout(() => setToast(null), 4200);
    };
    window.addEventListener('mj-achievement', on);
    return () => { window.removeEventListener('mj-achievement', on); clearTimeout(timer); };
  }, []);
  return { count, toast, total: ACHIEVEMENTS.length };
}
