import Link from "next/link";
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
import { logout } from "@/app/admin/login/actions";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/site", label: "Site & pages", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border-subtle bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Portfolio CMS
            </p>
            <p className="mt-1 max-w-48 truncate text-xs text-text-secondary">
              {email}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-border-subtle px-3 py-2 text-xs text-text-secondary hover:border-primary/30 hover:text-primary"
            >
              Sign out
            </button>
          </form>
        </div>
        <nav
          aria-label="Admin navigation"
          className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:space-y-1 lg:overflow-visible"
        >
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition hover:bg-primary/10 hover:text-primary"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-border-subtle px-5 py-4 sm:px-8">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-text-secondary hover:text-primary"
          >
            Open public portfolio ↗
          </Link>
        </header>
        <div className="px-5 py-6 sm:px-8 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
