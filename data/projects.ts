export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  category: "fullstack" | "frontend" | "ai" | "backend";
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "elisium-space-website",
    title: "Elisium Space — Company Website & Player Platform",
    description:
      "Built the full www.elisiumspace.com experience from scratch: cinematic marketing site, player portal, CMS admin, and analytics for a strategy game studio.",
    longDescription:
      "Designed and engineered Elisium Space's production web platform end-to-end — from cinematic marketing pages (About, Services, Careers, Help) to authenticated player portal flows, CMS-backed content administration, and first-party analytics. The stack pairs Next.js App Router with dual Prisma/PostgreSQL schemas (website + game data), GSAP/Lenis motion, Three.js scene bands, and Framer Motion UI. Deliverables included auth, careers/services intake forms, COBRA live stats integration, and an admin console for team, FAQs, games, and page content — shipped as a cohesive brand and product surface at www.elisiumspace.com.",
    tech: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Three.js",
      "GSAP",
      "Framer Motion",
      "Tailwind CSS",
    ],
    category: "fullstack",
    image: "/elisium-space.svg",
    liveUrl: "https://www.elisiumspace.com",
    featured: true,
  },
  {
    id: "cobra-card-game",
    title: "COBRA - Strategy Card Game",
    description:
      "Full backend ecosystem and real-time session tracking for a complex, 6-deck multiplayer strategy card game hosted on AWS.",
    longDescription:
      "Engineered the complete backend ecosystem and real-time session tracking rules for a complex, 6-deck multiplayer strategy card game hosted natively on AWS cloud servers. Built an event-driven synchronization layer using Socket.io to broadcast live match telemetry under strict latency constraints. Implemented server-side validation to mitigate unauthorized client-side states and protect online gameplay logic.",
    tech: ["AWS", "Node.js", "Socket.io", "Real-time", "Event-driven"],
    category: "backend",
    image: "/cobra.svg",
    githubUrl: "https://github.com/himanshxsr",
    featured: true,
  },
  {
    id: "chess-platform",
    title: "Real-Time Multi-Room Chess Platform",
    description:
      "Full-stack chess platform with unified shared database architecture, matchmaking algorithms, and real-time state persistence.",
    longDescription:
      "Designed a unified shared database architecture from scratch to handle player match history, active rooms, and real-time profiles. Programmed matchmaking algorithms and automated state persistence routines to protect active game state parameters from abrupt disconnects.",
    tech: ["Next.js", "Express", "MongoDB", "Socket.io", "Real-time"],
    category: "fullstack",
    image: "/chess.svg",
    githubUrl: "https://github.com/himanshxsr",
    featured: true,
  },
  {
    id: "genai-dev-workflows",
    title: "GenAI Development Workflow Agents",
    description:
      "LangChain and Ollama-powered agents that accelerate boilerplate, docs, and pre-review checks inside engineering workflows.",
    longDescription:
      "Integrated Generative AI into day-to-day engineering workflows using LangChain orchestration and local LLMs via Ollama. Built agentic helpers for boilerplate generation, documentation drafts, and pre-review checks while keeping sensitive code on local models when required. Focused on measurable cycle-time gains rather than novelty demos.",
    tech: ["LangChain", "Ollama", "TypeScript", "Node.js", "GenAI"],
    category: "ai",
    image: "/genai.svg",
    featured: false,
  },
  {
    id: "3d-portfolio",
    title: "Interactive 3D / Spatial Engineering Showcase",
    description:
      "Immersive personal web application utilizing spatial layout configurations and 3D animations to showcase core projects.",
    longDescription:
      "Building an immersive personal web application utilizing spatial layout configurations and 3D animations powered by Three.js mechanics to showcase core projects and technical capabilities with a premium developer aesthetic.",
    tech: ["Next.js", "Three.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    category: "frontend",
    image: "/3d-portfolio.svg",
    liveUrl: "https://himanshuaashish.dev",
    githubUrl: "https://github.com/himanshxsr/portfolio",
    featured: false,
  },
  {
    id: "hrms-portal",
    title: "Enterprise HRMS Attendance Portal",
    description:
      "Enterprise-grade HR management system automating workforce tracking, shift logic, and data telemetry.",
    longDescription:
      "Architected and launched an enterprise-grade HRMS Attendance Portal to automate internal workforce tracking, workforce shift logic, and data telemetry. Features optimized database schemas, high-throughput REST APIs, and responsive frontend dashboards.",
    tech: ["Next.js", "Node.js", "MongoDB", "AWS", "Tailwind CSS"],
    category: "fullstack",
    image: "/hrms.svg",
    featured: false,
  },
];
