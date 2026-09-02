import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  ADMIN_COLLECTIONS,
  COLLECTION_LABELS,
  type AdminCollection,
} from "@/lib/content/admin-collections";
import { COLLECTION_DESCRIPTIONS } from "@/lib/content/admin-nav";
import { getAdminDashboardStats } from "@/lib/content/admin-queries";

export default async function AdminOverviewPage() {
  const stats = await getAdminDashboardStats();

  const statCards = [
    {
      label: "Content entries",
      value: stats.total,
      href: "/admin/projects",
      hint: "Browse collections",
    },
    {
      label: "Published",
      value: stats.published,
      href: "/admin/site",
      hint: "Live on site",
    },
    {
      label: "Drafts",
      value: stats.drafts,
      href: "/admin/projects",
      hint: "Needs publish",
    },
    {
      label: "Unread messages",
      value: stats.unreadMessages,
      href: "/admin/messages",
      hint: "Contact inbox",
    },
    {
      label: "Views · 30 days",
      value: stats.views30d,
      href: "/admin/analytics",
      hint: "Visitor analytics",
    },
  ];

  const collections = Object.keys(ADMIN_COLLECTIONS) as AdminCollection[];

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Overview"
        title="Portfolio dashboard"
        description="Edit content as drafts, preview changes, then publish to update the live site without redeploying code."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border-subtle bg-surface p-5 transition hover:border-primary/30 hover:bg-primary/5"
          >
            <p className="text-3xl font-bold text-primary">{card.value}</p>
            <p className="mt-2 text-sm font-medium">{card.label}</p>
            <p className="mt-1 text-xs text-text-secondary">{card.hint}</p>
          </Link>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Content sections</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection}
              href={`/admin/${collection}`}
              className="rounded-xl border border-border-subtle bg-surface p-5 transition hover:border-primary/30"
            >
              <p className="font-semibold">{COLLECTION_LABELS[collection]}</p>
              <p className="mt-2 text-sm text-text-secondary">
                {COLLECTION_DESCRIPTIONS[collection]}
              </p>
              <p className="mt-3 text-xs text-primary">
                Manage →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
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
            <Link
              href="/admin/profile"
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm hover:border-primary/40"
            >
              Edit profile
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-border-subtle bg-surface p-6">
          <h2 className="text-lg font-semibold">Publishing workflow</h2>
          <ol className="mt-4 space-y-3 text-sm text-text-secondary">
            <li>
              <span className="font-medium text-text-primary">1. Save draft</span> —
              changes stay private in the CMS.
            </li>
            <li>
              <span className="font-medium text-text-primary">2. Preview</span> —
              open the preview link from the editor sidebar.
            </li>
            <li>
              <span className="font-medium text-text-primary">3. Publish</span> —
              pushes draft to the live portfolio immediately.
            </li>
            <li>
              <span className="font-medium text-text-primary">4. Media URLs</span> —
              upload files in Media, copy URL, paste into image or résumé fields.
            </li>
          </ol>
        </section>
      </div>

      <section className="rounded-xl border border-dashed border-primary/25 bg-primary/5 p-5 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">Common edits</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <strong className="text-text-primary">Home hero sketch</strong> — Site &amp;
            pages → Home → set <code className="text-primary">heroSketchUrl</code>
          </li>
          <li>
            <strong className="text-text-primary">Résumé</strong> — Media upload →
            Profile → <code className="text-primary">resumeUrl</code>
          </li>
          <li>
            <strong className="text-text-primary">Project thumbnails</strong> — Media →
            Projects → image field
          </li>
        </ul>
      </section>
    </div>
  );
}
