import heroAvif from "../assets/portraits/fenil-hero.avif";
import heroWebp from "../assets/portraits/fenil-hero.webp";
import heroJpg from "../assets/portraits/fenil-hero.jpg";
import secondaryAvif from "../assets/portraits/fenil-secondary.avif";
import secondaryWebp from "../assets/portraits/fenil-secondary.webp";
import secondaryJpg from "../assets/portraits/fenil-secondary.jpg";
import atmosphericAvif from "../assets/portraits/fenil-atmospheric.avif";
import atmosphericWebp from "../assets/portraits/fenil-atmospheric.webp";
import atmosphericJpg from "../assets/portraits/fenil-atmospheric.jpg";

export type ImageSet = {
  avif: string;
  webp: string;
  fallback: string;
};

export const portraits = {
  hero: {
    avif: heroAvif,
    webp: heroWebp,
    fallback: heroJpg
  },
  secondary: {
    avif: secondaryAvif,
    webp: secondaryWebp,
    fallback: secondaryJpg
  },
  atmospheric: {
    avif: atmosphericAvif,
    webp: atmosphericWebp,
    fallback: atmosphericJpg
  }
} satisfies Record<string, ImageSet>;

export const links = {
  email: "fenilsata@gmail.com",
  phone: "+91 91573 83155",
  linkedin: "https://linkedin.com/in/fenil-sata",
  autopsy: "https://www.linkedin.com/posts/fenil-sata_theautopsy-productmanagement-arthakram-share-7452239838319239168-A-2a/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFuGLQ4BY9jKQdJbtxu3WjIkjjJQ3_mN9u8",
  github: "https://github.com/FSS3096",
  startupInfo: "https://startup-info-gamma.vercel.app",
  minimalist:
    "https://www.notion.so/Minimalist-Company-Breakdown-33bdb2f40e6b800f84a8d213edbec498?source=copy_link",
  ucoResearch:
    "https://www.notion.so/Indian-Used-Cooking-Oil-Market-Research-346db2f40e6b80539fa4f51527f83f9f?source=copy_link"
};

export const proofMetrics = [
  {
    value: "15+",
    label: "E-Cell members use Startup-Info"
  },
  {
    value: "Top 5",
    label: "of 300 teams at IIT Roorkee"
  },
  {
    value: "3rd",
    label: "Global Circuit Hackathon worldwide"
  },
  {
    value: "Year 1",
    label: "building at founder-office speed"
  }
];

export const timeline = [
  {
    year: "2025 - 2029",
    title: "B.Tech Computer Science, AI and ML",
    detail:
      "Newton School of Technology at Rishihood University. Coursework spans product thinking, design thinking, data structures, AI/ML fundamentals, and statistics.",
    meta: "CGPA 8.01"
  },
  {
    year: "2025",
    title: "Team Lead, GryffinsDev - SIH",
    detail:
      "Led a cross-functional team through Smart India Hackathon 2025, translating a government challenge into product scope, sprint tasks, and execution rhythm.",
    meta: "National hackathon"
  },
  {
    year: "2026",
    title: "Product case and research track",
    detail:
      "Competed across IIT Kanpur, IIT Roorkee, IIT Delhi, product, marketing, case study, and investor simulation tracks.",
    meta: "6+ national challenges"
  }
];

export const skills = [
  { label: "Product Strategy", group: "Product", strength: 0.95 },
  { label: "User Research", group: "Product", strength: 0.9 },
  { label: "Roadmapping", group: "Product", strength: 0.86 },
  { label: "PRD Writing", group: "Product", strength: 0.82 },
  { label: "OKRs", group: "Product", strength: 0.8 },
  { label: "Go-To-Market", group: "Product", strength: 0.82 },
  { label: "React", group: "Tech", strength: 0.76 },
  { label: "Python", group: "Tech", strength: 0.72 },
  { label: "Supabase", group: "Tech", strength: 0.68 },
  { label: "Tailwind CSS", group: "Tech", strength: 0.8 },
  { label: "Notion", group: "Tools", strength: 0.86 },
  { label: "Vercel", group: "Tools", strength: 0.78 },
  { label: "Google Analytics", group: "Tools", strength: 0.7 },
  { label: "Team Leadership", group: "Soft", strength: 0.88 },
  { label: "Communication", group: "Soft", strength: 0.84 }
];

export const projects = [
  {
    title: "Startup-Info",
    eyebrow: "Startup schemes discovery platform",
    year: "2026",
    description:
      "A startup discovery tool for first-time Indian founders who cannot easily discover 50+ central and state startup schemes. The 5-question eligibility checker reduced decision friction for non-technical founders.",
    impact: "Adopted organically by 15 E-Cell members without a single ad.",
    tags: ["TypeScript", "Tailwind CSS", "Vercel", "Product Discovery"],
    actionLabel: "Live",
    liveUrl: links.startupInfo,
    repoUrl: ""
  },
  {
    title: "Company Breakdown - Minimalist",
    eyebrow: "D2C skincare strategy research",
    year: "Feb 2026",
    description:
      "Analyzed growth to Rs. 514.8 Cr FY25 and the Rs. 2,955 Cr HUL acquisition. Mapped LTV:CAC differences, dermatologist referral upside, stockout risks, and FY26 KPI paths.",
    impact: "Converted public signals into a scenario-based roadmap.",
    tags: ["Market Research", "Unit Economics", "LTV:CAC", "Strategy"],
    actionLabel: "Read breakdown",
    liveUrl: links.minimalist,
    repoUrl: ""
  },
  {
    title: "India UCO Biofuel Opportunity - For Renewlium",
    eyebrow: "Market research and policy thesis",
    year: "Apr 2026",
    description:
      "Mapped a USD 356.7M market, 60-70% informal leakage of annual UCO, RUCO policy tailwinds, and city prioritization across Maharashtra, Delhi NCR, and Tamil Nadu.",
    impact: "Framed a three-scenario strategic outlook through 2030.",
    tags: ["Market Sizing", "Policy", "Unit Economics", "2030 Outlook"],
    actionLabel: "Read research",
    liveUrl: links.ucoResearch,
    repoUrl: ""
  }
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
  "IIT Roorkee E'Summit - Top 5 / 300",
  "Mind the Product - Finalist",
  "Productathon - Finalist",
  "Global Circuit Hackathon - 3rd Prize",
  "BITS Pilani Consultathon 5.0",
  "Arthakram Product and Consulting Club"
];
