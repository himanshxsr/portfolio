import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  ADMIN_COLLECTIONS,
  DEFAULT_CONTENT_TYPE,
  isAdminCollection,
} from "@/lib/content/admin-collections";
import { contentTypeSchema } from "@/lib/content/schemas";
import { CONTENT_TEMPLATES } from "@/lib/content/templates";
import { CONTENT_TYPE_LABELS } from "@/lib/content/types";

export default async function NewAdminContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { collection } = await params;
  if (!isAdminCollection(collection)) notFound();

  const { type } = await searchParams;
  const requestedType = contentTypeSchema.safeParse(type);
  const contentType =
    requestedType.success &&
    (ADMIN_COLLECTIONS[collection] as readonly string[]).includes(
      requestedType.data
    )
      ? requestedType.data
      : DEFAULT_CONTENT_TYPE[collection];
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-sm text-primary">
          {CONTENT_TYPE_LABELS[contentType]}
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create entry</h1>
        <p className="mt-2 text-sm text-text-secondary">
          The entry remains private until you publish it.
        </p>
      </div>
      <ContentEditor
        contentType={contentType}
        initialData={CONTENT_TEMPLATES[contentType]}
      />
    </div>
  );
}
