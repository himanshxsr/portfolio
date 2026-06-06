export const SITE_CONFIG = {
  name: "Himanshu Aashish",
  title: "Full-Stack & Generative AI Developer",
  description:
    "Full-Stack Developer & Generative AI Engineer building scalable web applications, real-time systems, and AI-powered solutions.",
  url: "https://himanshuaashish.dev",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const ANIMATION_CONFIG = {
  pageTransition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  stagger: { staggerChildren: 0.08 },
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
} as const;
