import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  COLLECTION_LABELS,
  getCollectionForContentType,
} from "@/lib/content/admin-collections";
import { getAdminContentEntry } from "@/lib/content/admin-queries";
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

export default async function EditAdminContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let entry;
  try {
    entry = await getAdminContentEntry(id);
  } catch {
    notFound();
  }

  const collection = getCollectionForContentType(entry.content_type);
  const title = entryTitle(entry);

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[
          { label: "Overview", href: "/admin" },
          ...(collection
            ? [
                {
                  label: COLLECTION_LABELS[collection],
                  href: `/admin/${collection}`,
                },
              ]
            : []),
          { label: title },
        ]}
      />

      <AdminPageHeader
        eyebrow={CONTENT_TYPE_LABELS[entry.content_type]}
        title={title}
        description="Draft changes stay private until you publish. Use Preview before going live."
      />

      <ContentEditor
        entry={entry}
        contentType={entry.content_type}
        initialData={entry.draft_data}
      />
    </div>
  );
}
