export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  tech: string[];
}

export const experiences: Experience[] = [
  {
    id: "elisium-sde",
    company: "Elisium Space Pvt. Ltd.",
    role: "Software Development Engineer (SDE)",
    period: "April 2025 – Present",
    description:
      "Architecting and launching enterprise-grade applications, automating internal workforce systems, and integrating Generative AI into development workflows.",
    achievements: [
      "Architected and launched an enterprise-grade HRMS Attendance Portal (April 2026 live deployment) to automate internal workforce tracking and shift logic",
      "Designed optimized database schemas and high-throughput REST APIs using Node.js and MongoDB, decreasing query latency",
      "Developed responsive frontend dashboards using Next.js and Tailwind CSS, increasing operational efficiency",
      "Integrated Generative AI toolings into development workflows to optimize code quality and accelerate feature release cycles",
      "Collaborated with corporate leadership to engineer and deploy multi-tier application microservices on AWS infrastructure",
    ],
    tech: ["Next.js", "Node.js", "MongoDB", "AWS", "Tailwind CSS", "GenAI"],
  },
];
