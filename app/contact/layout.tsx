import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Himanshu Aashish",
  description:
    "Get in touch with Himanshu Aashish for collaboration, freelance projects, or job opportunities.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
