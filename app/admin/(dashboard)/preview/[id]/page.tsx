import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { getAdminContentEntry } from "@/lib/content/admin-queries";
import type { BlogPost } from "@/data/blog";
import type { Project } from "@/data/projects";

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false, nocache: true },
};

export default async function DraftPreviewPage({
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

  if (entry.content_type === "project") {
    const project = {
      ...(entry.draft_data as unknown as Project),
      id: entry.slug,
    };
    return <ProjectDetailView project={project} />;
  }

  if (entry.content_type === "blog-post") {
    const post = {
      ...(entry.draft_data as unknown as BlogPost),
      id: entry.slug,
    };
    return <BlogPostView post={post} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-12">
      <div>
        <p className="font-mono text-sm text-primary">Draft preview</p>
        <h1 className="mt-2 text-3xl font-bold">
          {String(entry.draft_data.title ?? entry.draft_data.name ?? entry.slug)}
        </h1>
      </div>
      <div className="space-y-4 rounded-xl border border-border-subtle bg-surface p-6">
        {Object.entries(entry.draft_data).map(([key, value]) => (
          <div key={key} className="border-b border-border-subtle pb-4 last:border-0">
            <p className="text-xs uppercase tracking-wider text-text-secondary">
              {key}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm">
              {typeof value === "string"
                ? value
                : JSON.stringify(value, null, 2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
