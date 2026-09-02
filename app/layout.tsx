import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ClientLayout } from "@/components/providers/ClientLayout";
import { ContentProvider } from "@/components/providers/ContentProvider";
import {
  getBlogPosts,
  getEducation,
  getExperiences,
  getNavigation,
  getPages,
  getProfile,
  getProjects,
  getSiteSettings,
  getSkillCategories,
} from "@/lib/content/loaders";
import "./globals.css";

export const dynamic = "force-dynamic";

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

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const metadataBase = new URL(site.baseUrl);
  return {
    title: site.title,
    description: site.description,
    keywords: site.keywords,
    metadataBase,
    openGraph: {
      title: site.title,
      description: site.description,
      url: site.baseUrl,
      siteName: site.title,
      locale: site.locale,
      type: "website",
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [site.ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    profile,
    projects,
    blogPosts,
    experiences,
    skillCategories,
    navigation,
    site,
    pages,
    education,
  ] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getBlogPosts(),
      getExperiences(),
      getSkillCategories(),
      getNavigation(),
      getSiteSettings(),
      getPages(),
      getEducation(),
    ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: site.baseUrl,
    jobTitle: profile.roles[0],
    worksFor: {
      "@type": "Organization",
      name: "Elisium Space Pvt. Ltd.",
    },
    sameAs: [profile.social.github, profile.social.linkedin],
    knowsAbout: skillCategories.flatMap((category) =>
      category.skills.map((skill) => skill.name)
    ),
  };

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
          <ContentProvider
            value={{
              site,
              profile,
              projects,
              blogPosts,
              experiences,
              skillCategories,
              navigation,
              pages,
              education,
            }}
          >
            <ClientLayout>{children}</ClientLayout>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
