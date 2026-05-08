const PROJECTS = [
  {
    id: 'saleside',
    title: 'SaleSide',
    desc: 'AI-powered in-call sales coaching platform. Live call integration with real-time RAG-powered suggestions for sales reps. Shipped across web, desktop (Electron), and Chrome extension.',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'RAG', 'LLMs', 'Electron'],
    featured: true,
    badge: 'Dev Lead · Production',
    github: null,
    live: null,
  },
  {
    id: 'midrollpro',
    title: 'MidrollPro',
    desc: 'YouTube monetization optimizer. Custom RL model predicts optimal ad-break positions to maximize revenue and engagement. Dual-database architecture, deployed and live.',
    stack: ['Next.js', 'FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis'],
    featured: true,
    badge: 'Architect · Live',
    github: null,
    live: null,
  },
  {
    id: 'music',
    title: 'Music Genre Classifier',
    desc: '86% accuracy genre classification using VGG19 deep learning. Containerized microservices — Flask backend, React frontend, fully Dockerized.',
    stack: ['Flask', 'React', 'Python', 'VGG19', 'SVM', 'Docker'],
    featured: false,
    badge: '86% Accuracy',
    github: 'https://github.com/Mjawadi2002',
    live: null,
  },
  {
    id: 'erp',
    title: 'ERP Desktop App',
    desc: 'Cross-platform desktop ERP for inventory and sales management. MERN stack on Electron with full UML-designed architecture before implementation.',
    stack: ['Electron', 'React', 'MongoDB', 'Express.js', 'Node.js'],
    featured: false,
    badge: '2024',
    github: 'https://github.com/Mjawadi2002/ERP-desktop-application',
    live: null,
  },
  {
    id: 'movie',
    title: 'Movie Matchr',
    desc: 'Mood-based and content-based movie recommendation engine. Flask REST API connected to MongoDB with personalized suggestions based on user preferences.',
    stack: ['React', 'Flask', 'MongoDB', 'Python', 'ML'],
    featured: false,
    badge: '2024',
    github: 'https://github.com/Mjawadi2002/Mouhanned-Jawadi',
    live: null,
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
  const featured = PROJECTS.filter((p) => p.featured);
  const regular = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="section">
      <div className="container">
        <span className="section-label fade-up">04 — Projects</span>
        <h2 className="section-title fade-up fade-up-d1">Things I've Built</h2>
        <div className="projects-featured fade-up fade-up-d2">
          {featured.map((p) => <Card key={p.id} p={p} />)}
        </div>
        <div className="projects-regular fade-up fade-up-d3">
          {regular.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
