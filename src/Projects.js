const PROJECTS = [
  {
    id: 'saleside',
    title: 'SaleSide',
    desc: 'AI-powered in-call sales coaching platform. Live call integration with real-time RAG-powered suggestions for sales reps. Shipped across web, desktop (Electron), and Chrome extension.',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'RAG', 'LLMs', 'Electron'],
    featured: true,
    badge: 'Dev Lead · Production',
    github: null,
    live: 'https://saleside.ai',
  },
  {
    id: 'midrollpro',
    title: 'MidrollPro',
    desc: 'YouTube monetization optimizer. Custom RL model predicts optimal ad-break positions to maximize revenue and engagement. Dual-database architecture, deployed and live.',
    stack: ['Next.js', 'FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis'],
    featured: true,
    badge: 'Architect · Live',
    github: null,
    live: 'https://www.midrollpro.com',
  },
  {
    id: 'rankode',
    title: 'Rankode',
    desc: 'Competitive ranked coding platform with 1v1 live duels across 10 subject tracks, Glicko-2 matchmaking, AI tutoring (Sensei), and mock interview prep (SCREEN). Judge0-powered live code arena with real-time multiplayer, shipped across Electron, Expo, and Next.js.',
    stack: ['Electron', 'React', 'Vite', 'Fastify', 'Socket.IO', 'Judge0'],
    featured: true,
    badge: 'Live',
    github: null,
    live: 'https://rankode.app',
  },
  {
    id: 'portico',
    title: 'Portico',
    desc: 'Operations SaaS for small agencies with three-tier auth (owner/employee/client), a zero-knowledge encrypted vault, and an AI agent with tool-calling. Visual automations, Kanban tasks, a client portal, and a floating Panel widget for quick access.',
    stack: ['NestJS', 'React', 'Vite', 'Electron', 'TypeORM', 'PostgreSQL'],
    featured: true,
    badge: 'Live',
    github: null,
    live: 'https://portico-front-production.up.railway.app/',
  },
  {
    id: 'tawelti',
    title: 'Tawelti',
    desc: 'QR digital menu and loyalty SaaS for Tunisian cafés. Offline-first architecture with dual-path ordering over local WiFi and cellular cloud.',
    stack: ['Electron', 'SQLite', 'MongoDB', 'Railway'],
    featured: false,
    badge: 'Live',
    github: null,
    live: 'https://www.tawelti.online',
  },
  {
    id: 'teamyy',
    title: 'Teamyy',
    desc: 'All-in-one workspace product with an AES-256-GCM encrypted vault, a recruiting module, and a marketing pipeline built for a YC application.',
    stack: ['React', 'Node.js', 'Electron', 'Socket.IO'],
    featured: false,
    badge: 'Live',
    github: null,
    live: 'https://www.teamyy.org',
  },
];

function Card({ p }) {
  return (
    <div className={`proj-card${p.featured ? ' proj-featured' : ''}`}>
      <div className="proj-top">
        <span className="proj-badge">{p.badge}</span>
        <div className="proj-links">
          {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="proj-link">GitHub ↗</a>}
          {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="proj-link">Live ↗</a>}
        </div>
      </div>
      <h3 className="proj-title">{p.title}</h3>
      <p className="proj-desc">{p.desc}</p>
      <div className="stack-badges" style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
        {p.stack.map((t) => <span key={t} className="badge">{t}</span>)}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <span className="section-label fade-up">04 — Projects</span>
        <h2 className="section-title fade-up fade-up-d1">Things I've Built</h2>
        <div className="projects-grid fade-up fade-up-d2">
          {PROJECTS.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
