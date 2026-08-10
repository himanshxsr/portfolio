import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/content/admin-queries";

export default async function AdminOverviewPage() {
  const stats = await getAdminDashboardStats();
  const cards = [
    { label: "Content entries", value: stats.total },
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Unread messages", value: stats.unreadMessages },
    { label: "Views · 30 days", value: stats.views30d },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-sm text-primary">Overview</p>
        <h1 className="mt-2 text-3xl font-bold">Portfolio dashboard</h1>
        <p className="mt-2 text-text-secondary">
          Edit drafts, preview changes, and publish without a code deployment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border-subtle bg-surface p-5"
          >
            <p className="text-3xl font-bold text-primary">{card.value}</p>
            <p className="mt-2 text-sm text-text-secondary">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-xl border border-border-subtle bg-surface p-6">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/projects/new"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background"
            >
              New project
            </Link>
            <Link
              href="/admin/blog/new"
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm hover:border-primary/40"
            >
              New blog post
            </Link>
            <Link
              href="/admin/media"
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm hover:border-primary/40"
            >
              Upload media
            </Link>
          </div>
        </section>
        <section className="rounded-xl border border-border-subtle bg-surface p-6">
          <h2 className="text-lg font-semibold">Publishing workflow</h2>
          <ol className="mt-4 space-y-2 text-sm text-text-secondary">
            <li>1. Save changes as a private draft.</li>
            <li>2. Open Preview to verify the draft.</li>
            <li>3. Publish to refresh the live portfolio immediately.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
