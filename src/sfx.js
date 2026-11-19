// Tiny synthesized UI sounds. Off by default; the player opts in. No audio files.
let ctx = null;
let enabled = false;

try {
  enabled = localStorage.getItem('mj-sfx') === 'on';
} catch (e) { /* storage blocked */ }

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function blip(freq, dur, type = 'square', gain = 0.03, slide = 0) {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(freq + slide, 30), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  isOn: () => enabled,
  set(on) {
    enabled = on;
    try { localStorage.setItem('mj-sfx', on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    if (on) blip(660, 0.08, 'triangle', 0.05);
  },
  tick: () => blip(1200, 0.025, 'square', 0.012),
  key: () => blip(900 + Math.random() * 200, 0.02, 'square', 0.01),
  select: () => blip(520, 0.07, 'triangle', 0.04, 180),
  zone: () => { blip(330, 0.14, 'triangle', 0.04, 220); },
  dive: () => { blip(90, 1.1, 'sawtooth', 0.05, 700); },
  error: () => blip(160, 0.12, 'square', 0.04, -60),
};
