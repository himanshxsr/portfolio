"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type MediaAsset = {
  id: string;
  public_url: string;
  filename: string;
  mime_type: string;
};

export function MediaUrlField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || assets.length) return;

    const supabase = createBrowserSupabaseClient();
    void supabase
      .from("media_assets")
      .select("id,public_url,filename,mime_type")
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => {
        setAssets((data as MediaAsset[]) ?? []);
        setLoading(false);
      });
  }, [open, assets.length]);

  const inputClass =
    "w-full rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary/60";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <button
          type="button"
          onClick={() => {
            if (!open && !assets.length) {
              setLoading(true);
            }
            setOpen((current) => !current);
          }}
          className="text-xs text-primary hover:underline"
        >
          {open ? "Hide library" : "Pick from media"}
        </button>
      </div>
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://… or pick from media library"
        className={inputClass}
      />
      {open ? (
        <div className="rounded-xl border border-border-subtle bg-background p-3">
          {loading ? (
            <p className="text-xs text-text-secondary">Loading media…</p>
          ) : assets.length ? (
            <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onChange(asset.public_url);
                    setOpen(false);
                  }}
                  className="overflow-hidden rounded-lg border border-border-subtle text-left transition hover:border-primary/40"
                >
                  <div className="flex aspect-video items-center justify-center bg-surface">
                    {asset.mime_type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.public_url}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-primary">PDF</span>
                    )}
                  </div>
                  <p className="truncate px-1 py-1 text-[10px] text-text-secondary">
                    {asset.filename}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary">
              No media yet. Upload files in{" "}
              <Link href="/admin/media" className="text-primary hover:underline">
                Media library
              </Link>
              .
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Fields that should use the media library picker (exact names only). */
const MEDIA_URL_FIELD_NAMES = new Set([
  "resumeUrl",
  "heroSketchUrl",
  "heroSketchUrlLight",
  "ogImage",
  "image",
]);

function isMediaUrlField(name: string) {
  return MEDIA_URL_FIELD_NAMES.has(name);
}

export { isMediaUrlField };
