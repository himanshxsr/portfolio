import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ADMIN_COLLECTIONS,
  COLLECTION_LABELS,
  isAdminCollection,
} from "@/lib/content/admin-collections";
import { getAdminContentEntries } from "@/lib/content/admin-queries";
import { CONTENT_TYPE_LABELS } from "@/lib/content/types";

export default async function AdminCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!isAdminCollection(collection)) notFound();

  const allowedTypes = ADMIN_COLLECTIONS[collection];
  const allEntries = await getAdminContentEntries();
  const entries = allEntries.filter((entry) =>
    (allowedTypes as readonly string[]).includes(entry.content_type)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-sm text-primary">Content</p>
          <h1 className="mt-2 text-3xl font-bold">
            {COLLECTION_LABELS[collection]}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Reorder, edit, preview, publish, or unpublish entries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allowedTypes.map((type, index) => (
            <Link
              key={type}
              href={`/admin/${collection}/new?type=${type}`}
              className={
                index === 0
                  ? "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background"
                  : "rounded-lg border border-border-subtle px-4 py-2.5 text-sm hover:border-primary/40"
              }
            >
              Add {CONTENT_TYPE_LABELS[type].toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        {entries.length ? (
          <div className="divide-y divide-border-subtle">
            {entries.map((entry) => {
              const title =
                typeof entry.draft_data.title === "string"
                  ? entry.draft_data.title
                  : typeof entry.draft_data.name === "string"
                    ? entry.draft_data.name
                    : entry.slug;
              return (
                <Link
                  href={`/admin/content/${entry.id}`}
                  key={entry.id}
                  className="grid gap-2 px-5 py-4 transition hover:bg-primary/5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{title}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {CONTENT_TYPE_LABELS[entry.content_type]} · /{entry.slug}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs ${
                      entry.status === "published"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {entry.status}
                  </span>
                  <time className="text-xs text-text-secondary">
                    {new Date(entry.updated_at).toLocaleDateString()}
                  </time>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="text-text-secondary">No entries yet.</p>
            <Link
              href={`/admin/${collection}/new`}
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              Create the first entry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
