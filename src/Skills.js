const GROUPS = [
  { label: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'SQL', 'PHP'] },
  { label: 'Frontend', skills: ['React', 'Next.js', 'Angular', 'HTML / CSS', 'Bootstrap', 'Tailwind CSS'] },
  { label: 'Backend', skills: ['Node.js', 'Express.js', 'FastAPI', 'Flask', 'Spring Boot'] },
  { label: 'AI / ML', skills: ['LLMs', 'RAG', 'Reinforcement Learning', 'Deep Learning', 'VGG19', 'SVM', 'Vector Databases', 'Content-based Filtering'] },
  { label: 'Databases', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'] },
  { label: 'DevOps & Infra', skills: ['Docker', 'CI/CD', 'DNS Configuration', 'Cloud Deployment', 'Git / GitHub', 'Linux'] },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <span className="section-label fade-up">05 — Skills</span>
        <h2 className="section-title fade-up fade-up-d1">The Stack</h2>
        <div className="skills-grid">
          {GROUPS.map((g, i) => (
            <div key={g.label} className={`skill-group fade-up fade-up-d${Math.min(i % 3 + 1, 4)}`}>
              <div className="skill-group-label">{g.label}</div>
              <div className="skill-badges">
                {g.skills.map((s) => <span key={s} className="skill-badge">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
