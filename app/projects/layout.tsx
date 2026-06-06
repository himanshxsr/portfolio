import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Himanshu Aashish",
  description:
    "Portfolio of projects — COBRA card game, real-time chess platform, HRMS portal, 3D portfolio showcase, and more.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
