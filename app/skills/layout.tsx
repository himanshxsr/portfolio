import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Himanshu Aashish",
  description:
    "Technical skills and technologies — React, Next.js, Node.js, MongoDB, AWS, LangChain, Socket.io, TypeScript, and more.",
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
