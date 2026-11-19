import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Terminal as TerminalIcon, Trophy, Copy, Check, GithubLogo, LinkedinLogo, EnvelopeSimple, DownloadSimple } from '@phosphor-icons/react';
import { PROFILE, EDUCATION, EXPERIENCE, PROJECTS, SKILLS, CERTS, SIDE_QUESTS } from '../data';
import { usePrefersReducedMotion, useDecode } from '../hooks';
import { sfx } from '../sfx';
import portrait from '../images/profileimage.png';
import camera from '../images/personel.jpg';

// Real screenshots of the live sites, captured from the URLs in data.js.
// Missing files are simply skipped, and that project falls back to a typographic panel.
const shotCtx = require.context('../assets/shots', false, /\.jpg$/);
const SHOTS = {};
shotCtx.keys().forEach((k) => { SHOTS[k.replace('./', '').replace('.jpg', '')] = shotCtx(k); });

const FACTS = {
  rankode: [['10', 'subject tracks'], ['1v1', 'live duels'], ['Glicko-2', 'matchmaking']],
};

export function Decode({ text, as: Tag = 'span', className, delay = 0, id }) {
  const reduced = usePrefersReducedMotion();
  const ref = useDecode(text, { enabled: !reduced, delay });
  return (
    <Tag id={id} className={className} aria-label={text}>
      <span ref={ref} aria-hidden="true">{text}</span>
    </Tag>
  );
}

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced) { el.textContent = `${to}${suffix}`; return undefined; }
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 1100, 1);
        el.textContent = `${Math.round(to * (1 - Math.pow(1 - t, 3)))}${suffix}`;
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, suffix, reduced]);
  return <span ref={ref}>{reduced ? `${to}${suffix}` : `0${suffix}`}</span>;
}

/* ------------------------------------------------------------ Start */
export function Hero({ onGoto, onTerminal }) {
  return (
    <section id="start" className="zone hero" aria-label="Start">
      <div className="hero-inner">
        <Decode as="p" className="hero-eyebrow" text={PROFILE.title} delay={1900} />
        <h1 className="hero-name">{PROFILE.name}</h1>
        <p className="hero-sub">{PROFILE.tagline}</p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={() => onGoto('projects')}>
            View projects <ArrowDown size={18} weight="bold" />
          </button>
          <button type="button" className="btn btn-lg" onClick={onTerminal}>
            <TerminalIcon size={18} /> Open terminal
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ About */
export function About() {
  return (
    <section id="about" className="zone about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <figure className="card-id" data-rv>
          <div className="card-id-frame">
            <img src={portrait} alt="Mouhanned Jawadi in a suit and glasses" width="503" height="496" loading="lazy" />
          </div>
          <figcaption>
            <strong>{PROFILE.name}</strong>
            <span>Software Engineer, ETG</span>
          </figcaption>
        </figure>

        <div className="about-copy">
          <Decode as="h2" id="about-title" className="h2" text="Engineer by training. Builder by habit." />
          <p className="lead" data-rv>
            Computer engineer from ENSIT, specialised in software engineering and decision intelligence. I design the architecture, run the infrastructure and write the code that ships.
          </p>
          <p className="body" data-rv>
            At ETG I was CTO of SaleSide and PM of MidrollPro, two AI products built from the ground up.
          </p>

          <dl className="stats" data-rv>
            <div><dt>Roles held</dt><dd><CountUp to={4} /></dd></div>
            <div><dt>Products built</dt><dd><CountUp to={6} /></dd></div>
            <div><dt>Credentials</dt><dd><CountUp to={5} /></dd></div>
          </dl>

          <ul className="edu" data-rv>
            {EDUCATION.map((e) => (
              <li key={e.school}>
                <span className="edu-period">{e.period}</span>
                <span className="edu-school">{e.school}</span>
                <span className="edu-degree">{e.degree}</span>
              </li>
            ))}
          </ul>

          <div className="quests" data-rv>
            <img src={camera} alt="Mouhanned behind a camera on a tripod" width="933" height="1031" loading="lazy" />
            <div>
              <h3 className="h4">Side quests</h3>
              <ul className="chips">
                {SIDE_QUESTS.map((q) => <li key={q} className="chip">{q}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Experience */
export function Experience() {
  const [active, setActive] = useState(EXPERIENCE[0].id);
  const refs = useRef({});

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.id); });
    }, { rootMargin: '-40% 0px -50% 0px' });
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" className="zone xp" aria-labelledby="xp-title">
      <div className="wrap xp-grid">
        <aside className="xp-side">
          <Decode as="h2" id="xp-title" className="h2" text="Where I have shipped." />
          <ol className="xp-index" aria-label="Employers">
            {EXPERIENCE.map((x) => (
              <li key={x.id} className={x.id === active ? 'is-active' : ''}>{x.short}</li>
            ))}
          </ol>
        </aside>

        <div className="xp-list">
          {EXPERIENCE.map((x) => (
            <article key={x.id} className="mission" data-id={x.id} ref={(el) => { refs.current[x.id] = el; }} data-rv>
              <header className="mission-head">
                <h3 className="h3">{x.company}</h3>
                <p className="mission-meta">
                  <span>{x.role}</span>
                  <time>{x.period}</time>
                  {x.current && <span className="live"><i aria-hidden="true" />Current</span>}
                </p>
              </header>
              {x.products && (
                <div className="mission-products">
                  {x.products.map((p) => (
                    <div key={p.name} className="product">
                      <h4>{p.name} <span>{p.role}</span></h4>
                      <p>{p.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <ul className="mission-bullets">
                {x.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <ul className="chips">
                {x.stack.map((s) => <li key={s} className="chip">{s}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Projects */
function Showcase({ p }) {
  const shot = SHOTS[p.id];
  const facts = FACTS[p.id];
  return (
    <div className="shot" key={p.id}>
      {shot ? (
        <img src={shot} alt={`${p.name} website, ${p.host}`} width="1280" height="800" loading="lazy" />
      ) : (
        <div className="shot-facts">
          <p className="shot-name">{p.name}</p>
          {facts && (
            <ul>
              {facts.map(([big, small]) => <li key={big}><b>{big}</b><span>{small}</span></li>)}
            </ul>
          )}
        </div>
      )}
      <i className="scan" aria-hidden="true" />
    </div>
  );
}

export function Projects() {
  const [sel, setSel] = useState(0);
  const p = PROJECTS[sel];
  const listRef = useRef(null);

  const pick = (i) => { setSel(i); sfx.select(); };
  const onKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const n = (sel + (e.key === 'ArrowDown' ? 1 : PROJECTS.length - 1)) % PROJECTS.length;
    pick(n);
    const btn = listRef.current && listRef.current.querySelectorAll('button')[n];
    if (btn) btn.focus();
  };

  return (
    <section id="projects" className="zone arena" aria-labelledby="arena-title">
      <div className="wrap">
        <Decode as="h2" id="arena-title" className="h2" text="Things I have built." />
        <div className="arena-grid">
          <div className="arena-menu" role="tablist" aria-orientation="vertical" aria-label="Projects" ref={listRef} onKeyDown={onKey} data-rv>
            {PROJECTS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={i === sel}
                aria-controls="arena-panel"
                tabIndex={i === sel ? 0 : -1}
                className={i === sel ? 'is-active' : ''}
                onClick={() => pick(i)}
                onMouseEnter={() => sfx.tick()}
              >
                <span className="arena-name">{x.name}</span>
                <span className="arena-kind">{x.kind}</span>
              </button>
            ))}
          </div>

          <div className="arena-detail" role="tabpanel" id="arena-panel" aria-labelledby={`tab-${p.id}`} data-rv>
            <Showcase p={p} />
            <div className="arena-info" key={`info-${p.id}`}>
              <div className="arena-title">
                <h3 className="h3">{p.name}</h3>
                <a className="btn btn-sm" href={p.url} target="_blank" rel="noopener noreferrer">
                  Visit {p.host} <ArrowUpRight size={15} weight="bold" />
                </a>
              </div>
              <p className="lead">{p.summary}</p>
              <ul className="points">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <ul className="chips">
                {p.stack.map((s) => <li key={s} className="chip">{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Skills */
export function Skills() {
  return (
    <section id="skills" className="zone skills" aria-labelledby="skills-title">
      <div className="wrap">
        <Decode as="h2" id="skills-title" className="h2" text="The loadout." />
        <div className="loadout">
          {SKILLS.map((g) => (
            <div key={g.id} className={`slot slot-${g.id}${g.feature ? ' slot-feature' : ''}`} data-rv>
              <h3 className="h4">{g.label}</h3>
              <ul className="chips">
                {g.items.map((s) => <li key={s} className="chip" onMouseEnter={() => sfx.tick()}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Certifications */
export function Certifications() {
  return (
    <section id="certifications" className="zone certs" aria-labelledby="certs-title">
      <div className="wrap">
        <Decode as="h2" id="certs-title" className="h2" text="Credentials unlocked." />
        <ul className="cert-grid">
          {CERTS.map((c) => (
            <li key={c.name} data-rv>
              <a href={c.link} target="_blank" rel="noopener noreferrer" onMouseEnter={() => sfx.tick()}>
                <Trophy size={22} weight="duotone" aria-hidden="true" />
                <span className="cert-body">
                  <span className="cert-issuer">{c.issuer}, {c.year}</span>
                  <span className="cert-name">{c.name}</span>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" className="cert-arrow" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Contact */
export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch (e) {
      const t = document.createElement('textarea');
      t.value = PROFILE.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    sfx.select();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="zone contact" aria-labelledby="contact-title">
      <div className="wrap contact-inner">
        <Decode as="h2" id="contact-title" className="h1" text="Let's build something." />
        <p className="lead" data-rv>{PROFILE.open}</p>

        <ul className="cmds" data-rv>
          <li>
            <a href={`mailto:${PROFILE.email}`}>
              <span className="cmd-prompt">$ mail</span>
              <span className="cmd-val"><EnvelopeSimple size={18} aria-hidden="true" /> {PROFILE.email}</span>
            </a>
            <button type="button" className="btn btn-sm" onClick={copy} aria-label="Copy email address">
              {copied ? <Check size={15} weight="bold" /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </li>
          <li>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
              <span className="cmd-prompt">$ open github</span>
              <span className="cmd-val"><GithubLogo size={18} aria-hidden="true" /> Mjawadi2002 <ArrowUpRight size={15} aria-hidden="true" /></span>
            </a>
          </li>
          <li>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
              <span className="cmd-prompt">$ open linkedin</span>
              <span className="cmd-val"><LinkedinLogo size={18} aria-hidden="true" /> mouhanned-jawadi-software-engineer <ArrowUpRight size={15} aria-hidden="true" /></span>
            </a>
          </li>
          <li>
            <a href={PROFILE.resume} download="Mouhanned_Jawadi_Resume.pdf">
              <span className="cmd-prompt">$ resume</span>
              <span className="cmd-val"><DownloadSimple size={18} aria-hidden="true" /> Mouhanned_Jawadi_Resume.pdf</span>
            </a>
          </li>
        </ul>

        <p className="foot">&copy; {new Date().getFullYear()} {PROFILE.name}</p>
      </div>
    </section>
  );
}
