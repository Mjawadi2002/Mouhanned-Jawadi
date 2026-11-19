// Single source of truth. Everything here comes from the resume (Jawadi Mouhanned CV).
// Dash rule: hyphens only, no em or en dashes anywhere in visible copy.

const PUBLIC = process.env.PUBLIC_URL || '';

export const PROFILE = {
  name: 'Mouhanned Jawadi',
  title: 'Software Engineer, AI Systems',
  tagline: 'I take AI products from zero to production: architecture, infrastructure and shipped code.',
  email: 'mouhanned.j18@gmail.com',
  github: 'https://github.com/Mjawadi2002',
  linkedin: 'https://www.linkedin.com/in/mouhanned-jawadi-software-engineer/',
  resume: `${PUBLIC}/Mouhanned_Jawadi_Resume.pdf`,
  open: 'Open to software engineering roles, remote work and European opportunities.',
};

export const ZONES = [
  { id: 'start', label: 'Start', command: 'start' },
  { id: 'about', label: 'About', command: 'about' },
  { id: 'experience', label: 'Experience', command: 'experience' },
  { id: 'projects', label: 'Projects', command: 'projects' },
  { id: 'skills', label: 'Skills', command: 'skills' },
  { id: 'certifications', label: 'Certifications', command: 'certs' },
  { id: 'contact', label: 'Contact', command: 'contact' },
];

export const EDUCATION = [
  {
    school: 'National School of Engineers of Tunis (ENSIT)',
    degree: 'Computer Engineering, Software Engineering and Decision Intelligence',
    period: 'Sept 2022 - June 2025',
  },
  {
    school: 'Faculty of Sciences of Monastir (FSM)',
    degree: 'Preparatory Cycle, Mathematics and Physics',
    period: 'Sept 2020 - July 2022',
  },
];

export const EXPERIENCE = [
  {
    id: 'etg',
    company: 'ETG (Everything To Gain)',
    short: 'ETG',
    role: 'Software Engineer',
    period: 'July 2025 - Present',
    current: true,
    stack: ['React', 'Angular', 'FastAPI', 'PostgreSQL', 'Redis', 'Electron', 'LLMs', 'RAG'],
    bullets: [
      'Owned DNS, cloud hosting and query-optimization standards across every shipped production application.',
    ],
    products: [
      {
        name: 'SaleSide',
        role: 'CTO',
        text: 'AI in-call sales coach built from zero to production on web, Electron and a Chrome extension. A RAG pipeline serves real-time, context-aware suggestions that reduce rep hesitation.',
      },
      {
        name: 'MidrollPro',
        role: 'PM',
        text: 'YouTube monetization platform where an RL model predicts the best ad-break positions. Next.js and FastAPI on PostgreSQL, MongoDB and Redis, with a measurable lift in creator revenue.',
      },
    ],
  },
  {
    id: 'caei',
    company: 'CAEI',
    short: 'CAEI',
    role: 'Software Engineer Intern',
    period: 'Feb 2025 - June 2025',
    stack: ['React', 'Node.js', 'Express.js', 'MySQL', 'LLMs', 'Docker'],
    bullets: ['Full-stack AI training platform with a real-time LLM chatbot and a tag-based recommendation engine.'],
  },
  {
    id: 'sagemcom',
    company: 'Sagemcom',
    short: 'Sagemcom',
    role: 'Software Engineer Intern',
    period: 'July 2024 - Aug 2024',
    stack: ['Raspberry Pi', 'Python', 'Tkinter', 'Linux'],
    bullets: ['GUI sensor-testing tool on Raspberry Pi that replaced manual validation and sped up hardware-software integration.'],
  },
  {
    id: 'cpg',
    company: 'CPG',
    short: 'CPG',
    role: 'Software Engineer Intern',
    period: 'July 2023 - Aug 2023',
    stack: ['PHP', 'JavaScript', 'Bootstrap', 'MVC'],
    bullets: ['Responsive internal resource-management system for staff operations, built on strict MVC architecture.'],
  },
];

export const PROJECTS = [
  {
    id: 'saleside',
    name: 'SaleSide',
    kind: 'ETG product, CTO',
    summary: 'AI in-call sales coach, shipped on web, desktop and as a Chrome extension.',
    points: [
      'RAG pipeline that feeds context-aware suggestions during live calls',
      'Built from zero to production as CTO',
      'One product across web, Electron and Chrome extension',
    ],
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'RAG', 'LLMs', 'Electron'],
    url: 'https://saleside.ai',
    host: 'saleside.ai',
  },
  {
    id: 'midrollpro',
    name: 'MidrollPro',
    kind: 'ETG product, PM',
    summary: 'YouTube monetization platform that decides where the ad breaks go.',
    points: [
      'Reinforcement learning model predicts optimal ad-break positions',
      'Measurably increased creator revenue',
      'PostgreSQL, MongoDB and Redis behind a Next.js and FastAPI stack',
    ],
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'RL'],
    url: 'https://www.midrollpro.com',
    host: 'midrollpro.com',
  },
  {
    id: 'rankode',
    name: 'Rankode',
    kind: 'Personal project',
    summary: 'Competitive ranked coding platform with live 1v1 duels.',
    points: [
      '10 subject tracks with Glicko-2 matchmaking',
      'Sensei AI tutor and SCREEN mock interview prep',
      'Judge0 sandbox and Socket.IO for the live code arena',
      'Multi-platform: Electron, Expo and Next.js',
    ],
    stack: ['Electron', 'React', 'Vite', 'Fastify', 'Socket.IO', 'Judge0'],
    url: 'https://rankode.app',
    host: 'rankode.app',
  },
  {
    id: 'portico',
    name: 'Portico',
    kind: 'Personal project',
    summary: 'Operations SaaS for small agencies, from tasks to a client portal.',
    points: [
      'Three-tier auth for owner, employee and client',
      'Zero-knowledge encrypted vault',
      'AI agent with tool-calling, visual automations and Kanban tasks',
      'Floating Panel widget for quick access',
    ],
    stack: ['NestJS', 'React', 'Vite', 'Electron', 'TypeORM', 'PostgreSQL'],
    url: 'https://portico-front-production.up.railway.app/',
    host: 'portico on railway',
  },
  {
    id: 'tawelti',
    name: 'Tawelti',
    kind: 'Personal project',
    summary: 'QR digital menu and loyalty SaaS for Tunisian cafes.',
    points: [
      'Offline-first architecture',
      'Dual-path ordering: local WiFi or cellular cloud',
    ],
    stack: ['Electron', 'SQLite', 'MongoDB', 'Railway'],
    url: 'https://www.tawelti.online',
    host: 'tawelti.online',
  },
  {
    id: 'teamyy',
    name: 'Teamyy',
    kind: 'Personal project',
    summary: 'All-in-one workspace product, built toward a YC application.',
    points: [
      'AES-256-GCM encrypted vault',
      'Recruiting module and marketing pipeline',
      'Real-time collaboration over Socket.IO',
    ],
    stack: ['React', 'Node.js', 'Electron', 'Socket.IO'],
    url: 'https://www.teamyy.org',
    host: 'teamyy.org',
  },
];

export const SKILLS = [
  { id: 'ai', label: 'AI and ML', items: ['LLMs', 'RAG', 'Reinforcement Learning', 'Vector Databases', 'Glicko-2'], feature: true },
  { id: 'lang', label: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C / C++ / C#', 'SQL'] },
  { id: 'front', label: 'Frontend', items: ['React', 'Next.js', 'Angular', 'HTML / CSS', 'Bootstrap'] },
  { id: 'back', label: 'Backend', items: ['Node.js', 'Express.js', 'FastAPI', 'Flask', 'Spring Boot', 'NestJS'] },
  { id: 'db', label: 'Databases', items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis'] },
  { id: 'infra', label: 'DevOps and Infra', items: ['Docker', 'Electron', 'Socket.IO', 'DNS', 'Cloud Deployment', 'Git / GitHub'] },
];

export const CERTS = [
  { name: 'Associate AI Engineer for Data Scientists', issuer: 'DataCamp', year: '2024', link: 'https://www.datacamp.com/certificate/AIEDA0015057790682' },
  { name: 'AWS Academy Machine Learning Foundations', issuer: 'Amazon Web Services', year: '2024', link: 'https://www.credly.com/badges/77811255-17cf-4a7a-bdcb-a47494ef7e1c/linked_in_profile' },
  { name: 'AWS Academy Introduction to Cloud', issuer: 'Amazon Web Services', year: '2024', link: 'https://www.credly.com/badges/2baf8266-eaa1-45de-813e-53269a57ce5e/linked_in_profile' },
  { name: 'CCNAv7: Switching, Routing and Wireless Essentials', issuer: 'Cisco', year: '2023', link: 'https://www.netacad.com/certificates?issuanceId=a68eb266-0fbd-4b7b-ba29-6a368d84b477' },
  { name: 'CCNAv7: Introduction to Networks', issuer: 'Cisco', year: '2023', link: 'https://www.netacad.com/certificates?issuanceId=9ddb7e30-5316-443f-8e65-dd7b1ddfd1d2' },
];

export const SIDE_QUESTS = ['Piano', 'Cinematography', 'Photography', 'Poetry', 'FC Barcelona', 'Hiking', 'Cooking'];
