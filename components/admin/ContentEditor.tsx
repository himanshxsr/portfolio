"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import type { JsonValue, ContentType } from "@/lib/content/types";
import {
  deleteContent,
  publishContent,
  saveContentEntry,
  type ContentActionState,
  unpublishContent,
} from "@/app/admin/(dashboard)/content-actions";

type EditableObject = Record<string, JsonValue>;
type Path = Array<string | number>;

const initialActionState: ContentActionState = {};

function titleCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function updatePath(
  root: EditableObject,
  path: Path,
  value: JsonValue
): EditableObject {
  const clone = structuredClone(root);
  let cursor: JsonValue = clone;

  path.slice(0, -1).forEach((segment) => {
    cursor =
      typeof segment === "number"
        ? (cursor as JsonValue[])[segment]
        : (cursor as EditableObject)[segment];
  });

  const last = path[path.length - 1];
  if (typeof last === "number") {
    (cursor as unknown as JsonValue[])[last] = value;
  } else {
    (cursor as EditableObject)[last] = value;
  }
  return clone;
}

function shouldUseTextarea(keyName: string) {
  return /(body|bio|description|summary|content|intro|pitch|message|copy|text)/i.test(
    keyName
  );
}

function Field({
  name,
  value,
  path,
  onChange,
}: {
  name: string;
  value: JsonValue;
  path: Path;
  onChange: (path: Path, value: JsonValue) => void;
}) {
  const label = titleCase(name);
  const inputClass =
    "w-full rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary/60";

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-lg border border-border-subtle p-3 text-sm">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4 accent-[var(--primary)]"
        />
        {label}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">{label}</span>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(path, Number(event.target.value))}
          className={inputClass}
        />
      </label>
    );
  }

  if (typeof value === "string" || value === null) {
    const stringValue = value ?? "";
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">{label}</span>
        {shouldUseTextarea(name) ? (
          <textarea
            value={stringValue}
            rows={name.toLowerCase().includes("body") ? 14 : 5}
            onChange={(event) => onChange(path, event.target.value)}
            className={inputClass}
          />
        ) : (
          <input
            type={/email/i.test(name) ? "email" : /url|image|resume/i.test(name) ? "url" : "text"}
            value={stringValue}
            onChange={(event) => onChange(path, event.target.value)}
            className={inputClass}
          />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    const primitiveArray = value.every(
      (item) =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
    );

    if (primitiveArray) {
      return (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{label}</span>
          <textarea
            value={value.join("\n")}
            rows={Math.max(3, Math.min(8, value.length + 1))}
            onChange={(event) =>
              onChange(
                path,
                event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-text-secondary">
            One item per line
          </span>
        </label>
      );
    }

    return (
      <fieldset className="space-y-3 rounded-xl border border-border-subtle p-4">
        <legend className="px-2 text-sm font-semibold">{label}</legend>
        {value.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg bg-background/60 p-4"
          >
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Item {index + 1}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...value];
                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1],
                    ];
                    onChange(path, next);
                  }}
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="text-red-300"
                  onClick={() =>
                    onChange(
                      path,
                      value.filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </div>
            {item && typeof item === "object" && !Array.isArray(item) ? (
              Object.entries(item).map(([childName, childValue]) => (
                <Field
                  key={childName}
                  name={childName}
                  value={childValue}
                  path={[...path, index, childName]}
                  onChange={onChange}
                />
              ))
            ) : (
              <Field
                name={`item-${index + 1}`}
                value={item}
                path={[...path, index]}
                onChange={onChange}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const template = value[0];
            const nextItem =
              template && typeof template === "object"
                ? Object.fromEntries(
                    Object.entries(template).map(([key, itemValue]) => [
                      key,
                      typeof itemValue === "boolean"
                        ? false
                        : typeof itemValue === "number"
                          ? 0
                          : Array.isArray(itemValue)
                            ? []
                            : "",
                    ])
                  )
                : "";
            onChange(path, [...value, nextItem] as JsonValue[]);
          }}
          className="rounded-lg border border-border-subtle px-3 py-2 text-sm hover:border-primary/40"
        >
          Add item
        </button>
      </fieldset>
    );
  }

  return (
    <fieldset className="space-y-4 rounded-xl border border-border-subtle p-4">
      <legend className="px-2 text-sm font-semibold">{label}</legend>
      {Object.entries(value).map(([childName, childValue]) => (
        <Field
          key={childName}
          name={childName}
          value={childValue}
          path={[...path, childName]}
          onChange={onChange}
        />
      ))}
    </fieldset>
  );
}

export function ContentEditor({
  entry,
  contentType,
  initialData,
}: {
  entry?: {
    id: string;
    slug: string;
    sort_order: number;
    revision: number;
    status: string;
    draft_data: EditableObject;
  };
  contentType: ContentType;
  initialData: EditableObject;
}) {
  const [data, setData] = useState<EditableObject>(
    entry?.draft_data ?? initialData
  );
  const [state, action, pending] = useActionState(
    saveContentEntry,
    initialActionState
  );
  const [publishState, publishAction, publishPending] = useActionState(
    publishContent,
    initialActionState
  );
  const [unpublishState, unpublishAction, unpublishPending] = useActionState(
    unpublishContent,
    initialActionState
  );
  const serialized = useMemo(() => JSON.stringify(data), [data]);
  const sidebarMessage = publishState.error
    ? { tone: "error" as const, text: publishState.error }
    : publishState.success
      ? { tone: "success" as const, text: publishState.success }
      : unpublishState.error
        ? { tone: "error" as const, text: unpublishState.error }
        : unpublishState.success
          ? { tone: "success" as const, text: unpublishState.success }
          : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <form action={action} className="space-y-5">
        {entry && <input type="hidden" name="id" value={entry.id} />}
        {entry && (
          <input type="hidden" name="revision" value={entry.revision} />
        )}
        <input type="hidden" name="contentType" value={contentType} />
        <input type="hidden" name="data" value={serialized} />

        <div className="grid gap-4 rounded-xl border border-border-subtle bg-surface p-5 sm:grid-cols-[1fr_130px]">
          <label>
            <span className="mb-1.5 block text-sm font-medium">Slug</span>
            <input
              name="slug"
              required
              pattern="[a-z0-9][a-z0-9-]*"
              defaultValue={entry?.slug ?? ""}
              className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Order</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={entry?.sort_order ?? 0}
              className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60"
            />
          </label>
        </div>

        <div className="space-y-5 rounded-xl border border-border-subtle bg-surface p-5">
          {Object.entries(data).map(([name, value]) => (
            <Field
              key={name}
              name={name}
              value={value}
              path={[name]}
              onChange={(path, nextValue) =>
                setData((current) => updatePath(current, path, nextValue))
              }
            />
          ))}
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="text-sm text-emerald-300">
            {state.success}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save draft"}
        </button>
      </form>

      {entry && (
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-xl border border-border-subtle bg-surface p-5">
            <p className="text-xs uppercase tracking-wider text-text-secondary">
              Status
            </p>
            <p className="mt-2 font-semibold capitalize">
              {publishState.success
                ? "published"
                : unpublishState.success
                  ? "draft"
                  : entry.status}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Revision {entry.revision}
            </p>
            {sidebarMessage && (
              <p
                role={sidebarMessage.tone === "error" ? "alert" : "status"}
                className={`mt-3 text-sm ${
                  sidebarMessage.tone === "error"
                    ? "text-red-400"
                    : "text-emerald-300"
                }`}
              >
                {sidebarMessage.text}
              </p>
            )}
            <div className="mt-5 space-y-2">
              <Link
                href={`/admin/preview/${entry.id}`}
                target="_blank"
                className="block w-full rounded-lg border border-primary/30 px-3 py-2.5 text-center text-sm text-primary"
              >
                Preview draft
              </Link>
              <form action={publishAction}>
                <input type="hidden" name="id" value={entry.id} />
                <button
                  type="submit"
                  disabled={publishPending || unpublishPending}
                  className="w-full rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {publishPending ? "Publishing..." : "Publish draft"}
                </button>
              </form>
              {(entry.status === "published" || publishState.success) &&
                !unpublishState.success && (
                <form action={unpublishAction}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button
                    type="submit"
                    disabled={publishPending || unpublishPending}
                    className="w-full rounded-lg border border-border-subtle px-3 py-2.5 text-sm disabled:opacity-60"
                  >
                    {unpublishPending ? "Unpublishing..." : "Unpublish"}
                  </button>
                </form>
              )}
            </div>
          </div>
          <form action={deleteContent}>
            <input type="hidden" name="id" value={entry.id} />
            <input type="hidden" name="contentType" value={contentType} />
            <button
              type="submit"
              className="w-full rounded-lg border border-red-500/30 px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
            >
              Delete entry
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}
