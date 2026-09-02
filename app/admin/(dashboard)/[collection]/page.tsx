import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionTypeTabs } from "@/components/admin/CollectionTypeTabs";
import {
  ADMIN_COLLECTIONS,
  COLLECTION_LABELS,
  DEFAULT_CONTENT_TYPE,
  isAdminCollection,
} from "@/lib/content/admin-collections";
import { COLLECTION_DESCRIPTIONS, CONTENT_TYPE_USAGE } from "@/lib/content/admin-nav";
import { getAdminContentEntriesForCollection } from "@/lib/content/admin-queries";
import { contentTypeSchema } from "@/lib/content/schemas";
import { CONTENT_TYPE_LABELS } from "@/lib/content/types";

function entryTitle(entry: {
  slug: string;
  draft_data: Record<string, unknown>;
}) {
  if (typeof entry.draft_data.title === "string") return entry.draft_data.title;
  if (typeof entry.draft_data.name === "string") return entry.draft_data.name;
  if (typeof entry.draft_data.label === "string") return entry.draft_data.label;
  return entry.slug;
}

export default async function AdminCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { collection } = await params;
  const { type } = await searchParams;
  if (!isAdminCollection(collection)) notFound();

  const allowedTypes = ADMIN_COLLECTIONS[collection];
  const requestedType = contentTypeSchema.safeParse(type);
  const activeType =
    requestedType.success &&
    (allowedTypes as readonly string[]).includes(requestedType.data)
      ? requestedType.data
      : undefined;

  const allEntries = await getAdminContentEntriesForCollection(collection);
  const entries = activeType
    ? allEntries.filter((entry) => entry.content_type === activeType)
    : allEntries;

  const counts = allowedTypes.reduce<Record<string, number>>((totals, contentType) => {
    totals[contentType] = allEntries.filter(
      (entry) => entry.content_type === contentType
    ).length;
    return totals;
  }, {});

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[
          { label: "Overview", href: "/admin" },
          { label: COLLECTION_LABELS[collection] },
        ]}
      />

      <AdminPageHeader
        eyebrow="Content"
        title={COLLECTION_LABELS[collection]}
        description={COLLECTION_DESCRIPTIONS[collection]}
        actions={
          <Link
            href={`/admin/${collection}/new?type=${activeType ?? DEFAULT_CONTENT_TYPE[collection]}`}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background"
          >
            Add {CONTENT_TYPE_LABELS[activeType ?? DEFAULT_CONTENT_TYPE[collection]].toLowerCase()}
          </Link>
        }
      />

      <CollectionTypeTabs
        collection={collection}
        types={allowedTypes}
        activeType={activeType}
        counts={counts}
      />

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        {entries.length ? (
          <div className="divide-y divide-border-subtle">
            <div className="hidden grid-cols-[1fr_140px_100px_110px] gap-4 bg-background/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-text-secondary sm:grid">
              <span>Entry</span>
              <span>Type</span>
              <span>Status</span>
              <span>Updated</span>
            </div>
            {entries.map((entry) => {
              const usage = CONTENT_TYPE_USAGE[entry.content_type];
              return (
                <Link
                  href={`/admin/content/${entry.id}`}
                  key={entry.id}
                  className="grid gap-3 px-5 py-4 transition hover:bg-primary/5 sm:grid-cols-[1fr_140px_100px_110px] sm:items-center sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{entryTitle(entry)}</p>
                    <p className="mt-1 font-mono text-xs text-text-secondary">
                      /{entry.slug}
                    </p>
                  </div>
                  <div className="text-xs">
                    <p className="text-text-primary">
                      {CONTENT_TYPE_LABELS[entry.content_type]}
                    </p>
                    {usage ? (
                      <p
                        className={`mt-0.5 ${
                          usage.live ? "text-emerald-400/80" : "text-amber-400/80"
                        }`}
                      >
                        {usage.live ? "Live on site" : "Reserved"}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs capitalize ${
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
            <p className="text-text-secondary">
              {activeType
                ? `No ${CONTENT_TYPE_LABELS[activeType].toLowerCase()} entries yet.`
                : "No entries yet."}
            </p>
            <Link
              href={`/admin/${collection}/new?type=${activeType ?? DEFAULT_CONTENT_TYPE[collection]}`}
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              Create the first entry
            </Link>
          </div>
        )}
      </div>

      {allowedTypes.length > 1 ? (
        <p className="text-xs text-text-secondary">
          Tip: use the tabs above to filter by content type. Set <strong>Order</strong> in
          the editor to control display sequence on the public site.
        </p>
      ) : null}
    </div>
  );
}
