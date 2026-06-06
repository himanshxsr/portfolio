import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ClientLayout } from "@/components/providers/ClientLayout";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Himanshu Aashish | Full-Stack & GenAI Developer",
  description:
    "Full-Stack Developer & Generative AI Engineer building scalable web applications, real-time systems, and AI-powered solutions. Explore my portfolio.",
  keywords: [
    "Full-Stack Developer",
    "Generative AI",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "AWS",
    "LangChain",
    "Portfolio",
  ],
  metadataBase: new URL("https://himanshuaashish.dev"),
  openGraph: {
    title: "Himanshu Aashish | Full-Stack & GenAI Developer",
    description:
      "Full-Stack Developer & Generative AI Engineer building scalable web applications, real-time systems, and AI-powered solutions.",
    url: "https://himanshuaashish.dev",
    siteName: "Himanshu Aashish Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Himanshu Aashish | Full-Stack & GenAI Developer",
    description:
      "Full-Stack Developer & Generative AI Engineer building scalable web applications and AI-powered solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Himanshu Aashish",
  url: "https://himanshuaashish.dev",
  jobTitle: "Full-Stack Developer & Generative AI Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Elisium Space Pvt. Ltd.",
  },
  sameAs: [
    "https://github.com/himanshxsr",
    "https://linkedin.com/in/himanshu-aashish-0a5554243",
  ],
  knowsAbout: [
    "React.js",
    "Next.js",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "AWS",
    "LangChain",
    "Socket.io",
    "Generative AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
