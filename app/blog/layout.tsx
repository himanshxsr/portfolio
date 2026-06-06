import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Himanshu Aashish",
  description:
    "Technical articles on full-stack development, real-time systems, GenAI integration, and software architecture.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
