export interface Skill {
  name: string;
  icon: string;
  level: number; // 0-100
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React.js", icon: "⚛️", level: 92 },
      { name: "Next.js", icon: "▲", level: 90 },
      { name: "TypeScript", icon: "🔷", level: 88 },
      { name: "Tailwind CSS", icon: "🎨", level: 95 },
      { name: "Redux Toolkit", icon: "🔄", level: 85 },
      { name: "3D Spatial Animations", icon: "🧊", level: 80 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", icon: "🟢", level: 92 },
      { name: "Express.js", icon: "⚡", level: 90 },
      { name: "MongoDB", icon: "🍃", level: 88 },
      { name: "Socket.io", icon: "🔌", level: 85 },
      { name: "PostgreSQL", icon: "🐘", level: 80 },
      { name: "RESTful APIs", icon: "🌐", level: 92 },
    ],
  },
  {
    id: "devops",
    label: "Cloud & DevOps",
    skills: [
      { name: "AWS", icon: "☁️", level: 82 },
      { name: "Docker", icon: "🐳", level: 78 },
      { name: "GitHub Actions", icon: "🔄", level: 85 },
      { name: "Git", icon: "📦", level: 92 },
      { name: "CI/CD Pipelines", icon: "🚀", level: 82 },
      { name: "PHP", icon: "🐘", level: 75 },
    ],
  },
  {
    id: "ai-ml",
    label: "Generative AI",
    skills: [
      { name: "LangChain", icon: "🦜", level: 85 },
      { name: "Ollama (Local LLMs)", icon: "🦙", level: 88 },
      { name: "OpenAI / Claude API", icon: "🤖", level: 90 },
      { name: "AI Agents", icon: "🧠", level: 82 },
      { name: "Prompt Engineering", icon: "✍️", level: 92 },
      { name: "Cursor IDE", icon: "⌨️", level: 88 },
    ],
  },
];
