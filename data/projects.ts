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
    id: "cobra-card-game",
    title: "COBRA - Strategy Card Game",
    description:
      "Full backend ecosystem and real-time session tracking for a complex, 6-deck multiplayer strategy card game hosted on AWS.",
    longDescription:
      "Engineered the complete backend ecosystem and real-time session tracking rules for a complex, 6-deck multiplayer strategy card game hosted natively on AWS cloud servers. Built an event-driven synchronization layer using Socket.io to broadcast live match telemetry under strict latency constraints. Implemented server-side validation to mitigate unauthorized client-side states and protect online gameplay logic.",
    tech: ["AWS", "Node.js", "Socket.io", "Real-time", "Event-driven"],
    category: "backend",
    image: "/cobra.png",
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
    githubUrl: "https://github.com/himanshxsr",
    featured: true,
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
    featured: true,
  },
];
