import { createClient } from "@supabase/supabase-js";
import { blogPosts } from "../data/blog";
import { experiences } from "../data/experience";
import { personalData } from "../data/personal";
import { projects } from "../data/projects";
import { skillCategories } from "../data/skills";
import { NAV_LINKS } from "../lib/constants";
import { uploadSeedAssets } from "./lib/upload-asset";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "portfolio-assets";

if (!url || !serviceKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding."
  );
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function assertSupabaseReachable() {
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });
    if (response.status >= 500) {
      throw new Error(`Supabase returned ${response.status}.`);
    }
  } catch (error) {
    const cause =
      error instanceof Error && "cause" in error && error.cause instanceof Error
        ? error.cause.message
        : error instanceof Error
          ? error.message
          : String(error);

    if (/ENOTFOUND|getaddrinfo|fetch failed/i.test(cause)) {
      throw new Error(
        `Cannot reach Supabase at ${url}. DNS lookup failed — the project may be deleted, paused, or the URL in .env.local is wrong. Open the Supabase dashboard, copy the current Project URL and API keys, update .env.local, then retry.`
      );
    }

    throw new Error(`Cannot reach Supabase: ${cause}`);
  }
}

type SeedEntry = {
  content_type: string;
  slug: string;
  draft_data: Record<string, unknown>;
  published_data: Record<string, unknown>;
  status: "published";
  sort_order: number;
  published_at: string;
};

const now = new Date().toISOString();
const entries: SeedEntry[] = [];

function add(
  contentType: string,
  slug: string,
  data: Record<string, unknown>,
  sortOrder = 0
) {
  entries.push({
    content_type: contentType,
    slug,
    draft_data: data,
    published_data: data,
    status: "published",
    sort_order: sortOrder,
    published_at: now,
  });
}

function mapPublicPath(
  value: string | undefined,
  assetUrls: Record<string, string>
) {
  if (!value?.startsWith("/")) return value ?? "";
  const filename = value.replace(/^\//, "");
  return assetUrls[filename] ?? value;
}

async function main() {
  await assertSupabaseReachable();

  const projectFiles = [
    "elisium-space.svg",
    "cobra.svg",
    "chess.svg",
    "genai.svg",
    "3d-portfolio.svg",
    "hrms.svg",
  ];
  const siteFiles = ["og.svg"];
  const profileFiles = ["resume.pdf"];

  const [projectUrls, siteUrls, profileUrls] = await Promise.all([
    uploadSeedAssets(supabase, bucket, projectFiles, "projects"),
    uploadSeedAssets(supabase, bucket, siteFiles, "site"),
    uploadSeedAssets(supabase, bucket, profileFiles, "profile"),
  ]);

  const assetUrls = { ...projectUrls, ...siteUrls, ...profileUrls };

  add("site", "main", {
    title: "Himanshu Aashish | Full-Stack & GenAI Developer",
    description:
      "Full-Stack Developer & Generative AI Engineer building scalable web applications, real-time systems, and AI-powered solutions. Explore my portfolio.",
    baseUrl: "https://himansh.co.in",
    language: "en",
    locale: "en_US",
    brandMark: "<dev_himansh />",
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
    ogImage: assetUrls["og.svg"] ?? "",
    theme: {
      primary: "#00f0ff",
      secondary: "#7b2ff7",
      background: "#0a0a0f",
    },
  });

  add("profile", "main", {
    ...personalData,
    resumeUrl: assetUrls["resume.pdf"] ?? personalData.resumeUrl,
  } as unknown as Record<string, unknown>);

  NAV_LINKS.forEach((item, index) =>
    add("navigation", item.label.toLowerCase(), { ...item, enabled: true }, index)
  );

  projects.forEach((project, index) => {
    const data = {
      ...(project as unknown as Record<string, unknown>),
      image: mapPublicPath(project.image, assetUrls),
    };
    add("project", project.id, data, index);
  });

  blogPosts.forEach((post, index) =>
    add("blog-post", post.id, post as unknown as Record<string, unknown>, index)
  );
  experiences.forEach((experience, index) =>
    add(
      "experience",
      experience.id,
      experience as unknown as Record<string, unknown>,
      index
    )
  );
  skillCategories.forEach((category, index) =>
    add(
      "skill-category",
      category.id,
      category as unknown as Record<string, unknown>,
      index
    )
  );

  [
    {
      slug: "home",
      title: "Home",
      subtitle: "Portfolio homepage",
      sectionNumber: "00",
      heroGreeting: "// Hello, World! I'm",
      heroDescription:
        "I build scalable web applications, real-time multiplayer systems, and AI-powered solutions that drive business impact.",
      workCtaLabel: "View My Work",
      resumeCtaLabel: "Download Resume",
      contactCtaLabel: "Get In Touch",
      featuredEyebrow: "// Featured work",
      featuredTitle: "Selected projects",
      aboutTitle: "A bit about me",
      contactEyebrow: "// Let's connect",
      contactTitle: "Have a project in mind?",
      contactDescription:
        "I'm always open to discussing new projects, creative ideas, or opportunities to bring your vision to life. Let's build something great together.",
    },
    {
      slug: "about",
      title: "About Me",
      subtitle: "Get to know the developer behind the code",
      sectionNumber: "01",
    },
    {
      slug: "skills",
      title: "Skills & Technologies",
      subtitle: "The tools and technologies I use to bring ideas to life",
      sectionNumber: "02",
    },
    {
      slug: "projects",
      title: "Projects",
      subtitle: "A selection of things I've built",
      sectionNumber: "03",
    },
    {
      slug: "experience",
      title: "Experience",
      subtitle: "My professional journey so far",
      sectionNumber: "04",
    },
    {
      slug: "contact",
      title: "Get In Touch",
      subtitle: "Have a project in mind? Let's build something together.",
      sectionNumber: "05",
    },
    {
      slug: "blog",
      title: "Blog",
      subtitle: "Thoughts on development, architecture, and AI",
      sectionNumber: "06",
    },
    {
      slug: "loading",
      title: "Loading",
      subtitle: "",
      sectionNumber: "",
      label: "Initializing...",
    },
  ].forEach((page, index) => add("page", page.slug, page, index));

  [
    {
      qualification: "B.Tech – Electronics & Communication Engineering",
      institution: "Rustam Ji Institute of Technology (RJIT), BSF Academy",
      location: "Gwalior, Madhya Pradesh",
      startDate: "",
      endDate: "2026",
      description: "",
    },
    {
      qualification: "All India Senior School Certificate Examination",
      institution: "Shree Krishna International School",
      location: "Bhubaneswar, Odisha",
      startDate: "",
      endDate: "",
      description: "Class XII – Intermediate",
    },
  ].forEach((education, index) =>
    add("education", `education-${index + 1}`, education, index)
  );

  const categories = [
    ["fullstack", "Full-Stack"],
    ["frontend", "Frontend"],
    ["ai", "AI / ML"],
    ["backend", "Backend"],
  ];
  categories.forEach(([slug, label], index) =>
    add("project-category", slug, { label, enabled: true }, index)
  );

  const technologies = new Set<string>();
  projects.forEach((project) => project.tech.forEach((tech) => technologies.add(tech)));
  experiences.forEach((experience) =>
    experience.tech.forEach((tech) => technologies.add(tech))
  );
  skillCategories.forEach((category) =>
    category.skills.forEach((skill) => technologies.add(skill.name))
  );
  Array.from(technologies)
    .sort()
    .forEach((name, index) =>
      add(
        "technology",
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        { name, icon: "", url: "" },
        index
      )
    );

  for (const entry of entries) {
    const { error } = await supabase
      .from("content_entries")
      .upsert(entry, { onConflict: "content_type,slug" });
    if (error) {
      throw new Error(
        `Failed to seed ${entry.content_type}/${entry.slug}: ${error.message}`
      );
    }
  }

  console.log(`Seeded ${entries.length} CMS entries.`);
  console.log(`Uploaded ${Object.keys(assetUrls).length} assets to Storage.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
