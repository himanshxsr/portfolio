import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Himanshu Aashish",
  description:
    "Portfolio of projects — Elisium Space website, COBRA backend, real-time chess platform, HRMS portal, GenAI workflows, and more.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
