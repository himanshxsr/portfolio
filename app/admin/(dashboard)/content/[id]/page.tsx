import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getAdminContentEntry } from "@/lib/content/admin-queries";
import { CONTENT_TYPE_LABELS } from "@/lib/content/types";

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

  const title =
    typeof entry.draft_data.title === "string"
      ? entry.draft_data.title
      : typeof entry.draft_data.name === "string"
        ? entry.draft_data.name
        : entry.slug;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-sm text-primary">
          {CONTENT_TYPE_LABELS[entry.content_type]}
        </p>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Draft changes remain private until published.
        </p>
      </div>
      <ContentEditor
        entry={entry}
        contentType={entry.content_type}
        initialData={entry.draft_data}
      />
    </div>
  );
}
