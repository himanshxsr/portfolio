import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Image,
  Inbox,
  LayoutDashboard,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  ADMIN_COLLECTIONS,
  COLLECTION_LABELS,
  type AdminCollection,
} from "./admin-collections";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  badgeKey?: "unreadMessages";
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

const collectionIcons: Record<AdminCollection, LucideIcon> = {
  site: Settings,
  profile: UserRound,
  projects: FolderKanban,
  experience: BriefcaseBusiness,
  skills: Sparkles,
  blog: FileText,
};

export const COLLECTION_DESCRIPTIONS: Record<AdminCollection, string> = {
  site: "Global settings, pages, navigation, education, and site copy.",
  profile: "Your name, bio, social links, stats, and résumé URL.",
  projects: "Portfolio projects shown on the home and projects pages.",
  experience: "Work history on the experience page.",
  skills: "Skill categories and proficiency bars on the skills page.",
  blog: "Blog posts and tags for the blog section.",
};

const collectionNavItems: AdminNavItem[] = (
  Object.keys(ADMIN_COLLECTIONS) as AdminCollection[]
).map((collection) => ({
  href: `/admin/${collection}`,
  label: COLLECTION_LABELS[collection],
  icon: collectionIcons[collection],
  description: COLLECTION_DESCRIPTIONS[collection],
}));

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        href: "/admin",
        label: "Overview",
        icon: LayoutDashboard,
        description: "Stats and quick actions",
      },
    ],
  },
  {
    title: "Content",
    items: collectionNavItems,
  },
  {
    title: "Library",
    items: [
      {
        href: "/admin/media",
        label: "Media",
        icon: Image,
        description: "Images and PDFs for projects, profile, and site",
      },
    ],
  },
  {
    title: "Inbox & insights",
    items: [
      {
        href: "/admin/messages",
        label: "Messages",
        icon: Inbox,
        description: "Contact form submissions",
        badgeKey: "unreadMessages",
      },
      {
        href: "/admin/analytics",
        label: "Analytics",
        icon: BarChart3,
        description: "Page views for the last 30 days",
      },
    ],
  },
];

export const CONTENT_TYPE_USAGE: Partial<
  Record<string, { live: boolean; note: string }>
> = {
  site: { live: true, note: "SEO, OG image, base URL" },
  profile: { live: true, note: "About page and hero CTAs" },
  page: { live: true, note: "Home, about, contact page copy" },
  navigation: { live: true, note: "Navbar links" },
  education: { live: true, note: "About page education section" },
  project: { live: true, note: "Projects listing and detail pages" },
  "skill-category": { live: true, note: "Skills page categories" },
  experience: { live: true, note: "Experience page timeline" },
  "blog-post": { live: true, note: "Blog listing and posts" },
  stat: { live: false, note: "Reserved — stats come from Profile today" },
  "ui-copy": { live: false, note: "Reserved for future UI strings" },
  "project-category": { live: false, note: "Reserved for project filters" },
  technology: { live: false, note: "Reserved for tech taxonomy" },
  skill: { live: false, note: "Use skill categories instead" },
  "blog-tag": { live: false, note: "Reserved for blog filtering" },
};
