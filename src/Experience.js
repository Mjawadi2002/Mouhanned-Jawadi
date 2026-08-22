import { useState } from 'react';

const EXPERIENCES = [
  {
    id: 'etg',
    company: 'ETG — Everything To Gain',
    role: 'Software Engineer',
    period: 'July 2025 – Present',
    stack: ['React', 'Angular', 'FastAPI', 'PostgreSQL', 'Redis', 'Electron', 'Node.js', 'LLMs', 'RAG', 'Docker'],
    featured: true,
    current: true,
    bullets: [
      'Schema design and query optimization across PostgreSQL and MongoDB',
      'DNS configuration, cloud hosting, CI/CD pipelines',
      'Frontend and backend development across multiple client products',
    ],
    projects: [
      {
        name: 'SaleSide',
        role: 'Dev Lead — sole developer',
        desc: 'AI-powered in-call sales coaching platform. Joins live calls, gives reps real-time context-aware suggestions. Built from zero to production.',
        surfaces: ['React Web App', 'Electron Desktop', 'Chrome Extension'],
        stack: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'RAG', 'LLMs'],
      },
      {
        name: 'MidrollPro',
        role: 'Architect & sole developer',
        desc: 'YouTube monetization optimizer. Analyzes creator channels and uses a trained RL model to predict optimal ad-break positions to maximize revenue.',
        surfaces: ['Next.js Web App (live)'],
        stack: ['Next.js', 'FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis'],
      },
    ],
  },
  {
    id: 'caei',
    company: 'CAEI',
    role: 'Software Engineer Intern',
    period: 'Feb 2025 – June 2025',
    stack: ['React', 'Node.js', 'Express.js', 'MySQL', 'LLMs', 'Docker'],
    bullets: [
      'Built a full-stack digital AI training platform',
      'Integrated a real-time LLM chatbot for learner support',
      'Built a personalized course recommendation engine using tag-based filtering',
    ],
  },
  {
    id: 'sagemcom',
    company: 'Sagemcom',
    role: 'Software Engineer Intern',
    period: 'July 2024 – Aug 2024',
    stack: ['Raspberry Pi', 'Python', 'Tkinter', 'Linux'],
    bullets: [
      'Built a GUI sensor-testing application on Raspberry Pi',
      'Replaced a fully manual hardware validation process',
      'Real-world hardware-software integration and testing',
    ],
  },
  {
    id: 'cpg',
    company: 'CPG',
    role: 'Software Engineer Intern',
    period: 'July 2023 – Aug 2023',
    stack: ['PHP', 'JavaScript', 'Bootstrap', 'MVC'],
    bullets: [
      'Built a responsive internal resource management system for staff operations',
      'Followed strict MVC architecture',
    ],
  },
];

function ProjectCard({ p }) {
  return (
    <div className="exp-proj-card">
      <div className="exp-proj-head">
        <span className="exp-proj-name">{p.name}</span>
        <span className="badge mono" style={{ fontSize: '0.6rem' }}>{p.role}</span>
      </div>
      <p className="exp-proj-desc">{p.desc}</p>
      <div className="exp-proj-surfaces">
        {p.surfaces.map((s) => <span key={s} className="tag-surface">{s}</span>)}
      </div>
      <div className="stack-badges">
        {p.stack.map((t) => <span key={t} className="badge">{t}</span>)}
      </div>
    </div>
  );
}

export default function Experience() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="experience" className="section">
      <div className="container">
        <span className="section-label fade-up">03 — Experience</span>
        <h2 className="section-title fade-up fade-up-d1">Where I've Shipped</h2>
        <div className="roadmap">
          {EXPERIENCES.map((exp) => (
            <div key={exp.id} className="roadmap-item fade-up">
              <div className="roadmap-marker">
                <div className={`roadmap-dot${exp.current ? ' roadmap-dot-current' : ''}`} />
                <div className="roadmap-line" />
              </div>
              <div className="roadmap-content">
                <div className={`exp-card${exp.featured ? ' exp-featured' : ''}`}>
                  <div
                    className="exp-card-header"
                    onClick={() => exp.projects && setExpanded(expanded === exp.id ? null : exp.id)}
                  >
                    <div className="exp-left">
                      <div>
                        <div className="exp-company">
                          {exp.company}
                          {exp.current && <span className="exp-current-tag">Current</span>}
                        </div>
                        <div className="exp-role">{exp.role}</div>
                      </div>
                    </div>
                    <div className="exp-right">
                      <span className="exp-period">{exp.period}</span>
                      {exp.projects && (
                        <span className="exp-expand">{expanded === exp.id ? '− collapse' : '+ details'}</span>
                      )}
                    </div>
                  </div>
                  <div className="stack-badges" style={{ marginTop: '0.85rem' }}>
                    {exp.stack.map((t) => <span key={t} className="badge">{t}</span>)}
                  </div>
                  <ul className="exp-bullets">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  {exp.projects && expanded === exp.id && (
                    <div className="exp-projects-wrap">
                      <span className="section-label">Featured Projects</span>
                      <div className="exp-projects-grid">
                        {exp.projects.map((p) => <ProjectCard key={p.name} p={p} />)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
