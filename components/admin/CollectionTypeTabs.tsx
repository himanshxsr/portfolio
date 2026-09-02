import Link from "next/link";
import type { ContentType } from "@/lib/content/types";
import { CONTENT_TYPE_LABELS } from "@/lib/content/types";

export function CollectionTypeTabs({
  collection,
  types,
  activeType,
  counts,
}: {
  collection: string;
  types: readonly ContentType[];
  activeType?: ContentType;
  counts: Record<string, number>;
}) {
  const base = `/admin/${collection}`;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={base}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          !activeType
            ? "bg-primary text-background"
            : "border border-border-subtle text-text-secondary hover:border-primary/40 hover:text-primary"
        }`}
      >
        All ({Object.values(counts).reduce((sum, n) => sum + n, 0)})
      </Link>
      {types.map((type) => (
        <Link
          key={type}
          href={`${base}?type=${type}`}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            activeType === type
              ? "bg-primary text-background"
              : "border border-border-subtle text-text-secondary hover:border-primary/40 hover:text-primary"
          }`}
        >
          {CONTENT_TYPE_LABELS[type]} ({counts[type] ?? 0})
        </Link>
      ))}
    </div>
  );
}
