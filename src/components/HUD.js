import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, SpeakerHigh, SpeakerSlash, DownloadSimple } from '@phosphor-icons/react';
import { ZONES, PROFILE } from '../data';
import { sfx } from '../sfx';

export default function HUD({ zone, onGoto, onTerminal, depthRef, barRef }) {
  const [sound, setSound] = useState(sfx.isOn());
  const [banner, setBanner] = useState(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    setBanner({ key: Date.now(), name: ZONES[zone].label });
    sfx.zone();
    const t = setTimeout(() => setBanner(null), 1900);
    return () => clearTimeout(t);
  }, [zone]);

  const toggleSound = () => {
    const next = !sound;
    sfx.set(next);
    setSound(next);
  };

  return (
    <>
      <div className="progress" aria-hidden="true"><i ref={barRef} /></div>

      <header className="bar">
        <a href="#start" className="bar-brand" onClick={(e) => { e.preventDefault(); onGoto('start'); }} aria-label="Mouhanned Jawadi, back to start">
          MOUHANNED.OS
        </a>
        <nav className="bar-actions" aria-label="Quick actions">
          <button type="button" className="btn btn-sm" onClick={onTerminal} aria-label="Open terminal, shortcut backtick">
            <TerminalIcon size={16} /> <span>Open terminal</span> <kbd>`</kbd>
          </button>
          <button type="button" className="btn btn-sm btn-icon-lg" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn sound off' : 'Turn sound on'}>
            {sound ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
          </button>
          <a className="btn btn-sm btn-primary" href={PROFILE.resume} download="Mouhanned_Jawadi_Resume.pdf">
            <DownloadSimple size={16} /> <span>Resume</span>
          </a>
        </nav>
      </header>

      <nav className="rail" aria-label="Zones">
        <ul>
          {ZONES.map((z, i) => (
            <li key={z.id}>
              <a
                href={`#${z.id}`}
                className={i === zone ? 'is-active' : ''}
                aria-current={i === zone ? 'true' : undefined}
                onClick={(e) => { e.preventDefault(); onGoto(z.id); }}
              >
                <i aria-hidden="true" />
                <span>{z.label}</span>
                <kbd aria-hidden="true">{i + 1}</kbd>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="depth" aria-hidden="true">
        <span className="depth-label">Depth</span>
        <span className="depth-val"><b ref={depthRef}>0000</b> m</span>
      </div>

      {banner && (
        <div className="banner" key={banner.key} aria-hidden="true">
          <span>{banner.name}</span>
        </div>
      )}
    </>
  );
}
