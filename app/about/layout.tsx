import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Himanshu Aashish",
  description:
    "Learn about Himanshu Aashish — Full-Stack Developer & GenAI Engineer with experience in MERN Stack, AWS, LangChain, and real-time systems.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
