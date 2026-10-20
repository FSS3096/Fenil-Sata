import fenilPortrait from "../assets/portraits/fenil-portrait.webp";
import arthakramTeam from "../assets/team/arthakram-team.jpg";
import autopsyInfographic from "../assets/autopsy/autopsy-teardown-infographic.webp";
import startupInfoImg from "../assets/projects/startup-info.png";

export type ImageSet = {
  avif?: string;
  webp?: string;
  fallback: string;
};

export const portraits = {
  hero: {
    webp: fenilPortrait,
    fallback: fenilPortrait
  },
  secondary: {
    fallback: arthakramTeam
  },
  atmospheric: {
    webp: autopsyInfographic,
    fallback: autopsyInfographic
  }
} satisfies Record<string, ImageSet>;

export const links = {
  email: "fenilsata@gmail.com",
  phone: "+91 91573 83155",
  resume: "/Fenil_Sata.pdf",
  linkedin: "https://linkedin.com/in/fenil-sata",
  autopsy:
    "https://www.linkedin.com/posts/fenil-sata_theautopsy-productmanagement-arthakram-share-7452239838319239168-A-2a/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFuGLQ4BY9jKQdJbtxu3WjIkjjJQ3_mN9u8",
  github: "https://github.com/FSS3096",
  portfolio: "https://fenil-sata.vercel.app",
  startupInfo: "https://startup-info-gamma.vercel.app",
  productGuys: "https://productguys.arthakram.in/",
  minimalist:
    "https://www.notion.so/Minimalist-Company-Breakdown-33bdb2f40e6b800f84a8d213edbec498",
  ucoResearch:
    "https://www.notion.so/Indian-Used-Cooking-Oil-Market-Research-346db2f40e6b80539fa4f51527f83f9f?source=copy_link"
};

export const proofMetrics = [
  {
    value: "600+",
    label: "Learners reached & platform visitors"
  },
  {
    value: "30+",
    label: "E-Cell founders use Startup-Info"
  },
  {
    value: "2nd",
    label: "Place, The Desk at BITS Pilani"
  },
  {
    value: "Top 5",
    label: "of 300 teams at IIT Roorkee"
  }
];

export const timeline = [
  {
    year: "Jan 2025 – 2029",
    title: "B.Tech Computer Science, AI & ML",
    detail:
      "Newton School of Technology at Rishihood University (Sonipat, Delhi NCR). Coursework in AI/ML fundamentals, data structures, product thinking, statistics, and system design.",
    meta: "CGPA: 7.53"
  },
  {
    year: "Jun 2026 – Aug 2026",
    title: "COO Office Intern — Rishihood University",
    detail:
      "Designed and executed Semester Zero end-to-end (3 competitions, 10+ sessions, 6-week quiz series across 5 courses) for 600+ incoming learners. Owned learner communication & led Communication Dept for Team Arambh.",
    meta: "Work Experience"
  },
  {
    year: "2025",
    title: "Team Lead, GryffinsDev — Smart India Hackathon",
    detail:
      "Led a cross-functional team through SIH 2025, translating a government challenge into product scope, sprint tasks, and execution rhythm.",
    meta: "National Hackathon"
  },
  {
    year: "2025 – 2026",
    title: "6+ National Competitions & Hackathons",
    detail:
      "Podiums and finalist across BITS Pilani (2nd Place), Global Circuit Hackathon (3rd Place), IIT Roorkee (Top 5 of 300), IIT Kanpur, IIT Delhi, NSUT, DU, and Ashoka.",
    meta: "National Podiums"
  }
];

export type PORItem = {
  title: string;
  organization: string;
  shortOrg: string;
  period: string;
  location?: string;
  contributions: string[];
  tags: string[];
};

export const porList: PORItem[] = [
  {
    title: "Chief of Staff",
    organization: "Entrepreneurship Cell (E-Cell), Rishihood University",
    shortOrg: "E-Cell, Rishihood",
    period: "Aug 2026 – Present",
    contributions: [
      "Aligned E-Cell’s strategic priorities by working closely with the President across the Core Committee, translating strategic decisions into execution.",
      "Drove cross-functional execution across a 50+ member E-Cell by tracking deliverables, consolidating updates and escalating dependencies to leadership, keeping the Core Committee accountable.",
      "Designed startup sessions on building, teardowns and frameworks, guiding members on 10+ startup ideas and closely mentoring startups."
    ],
    tags: [
      "Strategy Execution",
      "Core Committee",
      "50+ Member Team",
      "Startup Mentoring",
      "Operations"
    ]
  },
  {
    title: "Associate Product Manager",
    organization: "Arthakram — Product & Consulting Club",
    shortOrg: "Arthakram Club",
    period: "Oct 2025 – Present",
    location: "Sonipat, Haryana",
    contributions: [
      "Led product teardowns of Minimalist and Blinkit Single Mode using competitive positioning, pricing logic and UX failure-point analysis, educating 40+ members.",
      "Coordinated 50+ participants across 20+ product and entrepreneurship competitions by managing judges and sponsors and designing PM problem statements on user research, prioritization and GTM."
    ],
    tags: [
      "Product Teardowns",
      "Competitive Analysis",
      "PM Frameworks",
      "Consulting",
      "Case Competitions"
    ]
  }
];

export const porData = porList[0];

export const skills = [
  // Product
  { label: "User Research", group: "Product", strength: 0.95 },
  { label: "Product Strategy", group: "Product", strength: 0.95 },
  { label: "Roadmapping", group: "Product", strength: 0.9 },
  { label: "PRD Writing", group: "Product", strength: 0.88 },
  { label: "A/B Testing", group: "Product", strength: 0.84 },
  { label: "KPI Tracking", group: "Product", strength: 0.86 },
  { label: "OKRs", group: "Product", strength: 0.82 },
  { label: "GTM", group: "Product", strength: 0.85 },

  // Tools
  { label: "Figma", group: "Tools", strength: 0.88 },
  { label: "Notion", group: "Tools", strength: 0.9 },
  { label: "Google Analytics", group: "Tools", strength: 0.82 },
  { label: "Canva", group: "Tools", strength: 0.85 },
  { label: "Git / GitHub", group: "Tools", strength: 0.86 },
  { label: "Vercel", group: "Tools", strength: 0.88 },

  // Tech
  { label: "JavaScript", group: "Tech", strength: 0.82 },
  { label: "TypeScript", group: "Tech", strength: 0.86 },
  { label: "Python", group: "Tech", strength: 0.8 },
  { label: "SQL", group: "Tech", strength: 0.8 },
  { label: "Node.js", group: "Tech", strength: 0.78 },
  { label: "Express.js", group: "Tech", strength: 0.75 },
  { label: "Supabase", group: "Tech", strength: 0.78 },
  { label: "Tailwind CSS", group: "Tech", strength: 0.88 },

  // Soft Skills
  { label: "Stakeholder Communication", group: "Soft Skills", strength: 0.92 },
  { label: "Cross-functional Collaboration", group: "Soft Skills", strength: 0.9 },
  { label: "Strategic Thinking", group: "Soft Skills", strength: 0.92 },
  { label: "Agile / Scrum", group: "Soft Skills", strength: 0.85 }
];

export const projects = [
  {
    title: "Startup-Info",
    eyebrow: "Startup schemes discovery platform",
    year: "2026",
    description:
      "A live discovery tool for first-time Indian founders who cannot easily navigate central and state startup initiatives. A 5-question eligibility checker eliminates discovery friction and connects founders with 50+ schemes.",
    impact: "Adopted by 30+ E-Cell members without a single ad.",
    tags: ["TypeScript", "Tailwind CSS", "Vercel", "Product Discovery"],
    actionLabel: "Live platform",
    liveUrl: links.startupInfo,
    repoUrl: "",
    image: startupInfoImg
  },
  {
    title: "The Product Guys",
    eyebrow: "Daily PM learning & interactive teardowns",
    year: "2026 – Present",
    description:
      "A daily PM learning platform featuring bite-sized 5-minute lessons, weekly deep-dive teardowns (Duolingo, Spotify, Notion, Figma, Stripe), PM Duels, and 120 psychology principles. Authored teardowns and designing an interactive teardown section.",
    impact: "Drew 600+ visitors organically; authored teardowns and frameworks.",
    tags: ["Product Management", "Teardowns", "Psychology Principles", "TypeScript", "Vercel"],
    actionLabel: "Live platform",
    liveUrl: links.productGuys,
    repoUrl: ""
  },
  {
    title: "Company Breakdown — Minimalist",
    eyebrow: "D2C skincare strategy research",
    year: "Feb 2026",
    description:
      "Analyzed Minimalist’s D2C model using FY25 financials and LTV:CAC (D2C 11.7x vs. Modern Trade 2.5x), mapping Rs. 514.8 Cr revenue (+48% YoY) and flagging dermatologist referral as the top underinvested channel.",
    impact: "Mapped Rs. 514.8 Cr revenue and channel-by-channel unit economics.",
    tags: ["Market Research", "Unit Economics", "LTV:CAC", "Strategy"],
    actionLabel: "Read breakdown",
    liveUrl: links.minimalist,
    repoUrl: ""
  },
];

export const autopsyItems = [
  {
    company: "Quibi",
    cause: "Built for a behaviour that did not exist.",
    detail: "$1.75B raised. 90 days of content. Gone in 6 months."
  },
  {
    company: "Byju's",
    cause: "Growth became the product.",
    detail:
      "$22B valuation. Then nothing. A masterclass in what happens when metrics replace mission."
  }
];

export const wins = [
  "2nd Place — The Desk, BITS Pilani (Live Valuation Game)",
  "3rd Place — Global Circuit Virtual Hackathon (ECG Signal Intelligence)",
  "Top 5 of 300 teams — Investopedia, E'Summit IIT Roorkee (2026)",
  "Finalist — Mind the Product & Productathon",
  "Team Lead — GryffinsDev, Smart India Hackathon 2025",
  "6+ National Challenges across IIT Kanpur, Roorkee, Delhi, BITS Pilani, NSUT, DU & Ashoka"
];
