import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  ADMIN_COLLECTIONS,
  COLLECTION_LABELS,
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
      <AdminBreadcrumbs
        items={[
          { label: "Overview", href: "/admin" },
          {
            label: COLLECTION_LABELS[collection],
            href: `/admin/${collection}`,
          },
          { label: "New entry" },
        ]}
      />

      <AdminPageHeader
        eyebrow={CONTENT_TYPE_LABELS[contentType]}
        title="Create entry"
        description="Save as a draft first, then publish when ready."
      />

      <ContentEditor
        contentType={contentType}
        initialData={CONTENT_TEMPLATES[contentType]}
      />
    </div>
  );
}
