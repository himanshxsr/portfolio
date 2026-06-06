import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Himanshu Aashish",
  description:
    "Professional experience — Software Development Engineer at Elisium Space Pvt. Ltd., building enterprise-grade applications with Next.js, Node.js, and AWS.",
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
