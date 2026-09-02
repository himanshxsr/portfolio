/**
 * CMS URL wins. In development, falls back to NEXT_PUBLIC_DEV_HERO_SKETCH_URL
 * or /hero-sketch.webp in public/ for quick localhost previews.
 */
export function resolveHeroSketchUrl(cmsUrl: unknown): string {
  const fromCms = typeof cmsUrl === "string" ? cmsUrl.trim() : "";
  if (fromCms) return fromCms;

  if (process.env.NODE_ENV !== "development") {
    return "";
  }

  return (
    process.env.NEXT_PUBLIC_DEV_HERO_SKETCH_URL?.trim() || "/hero-sketch.webp"
  );
}
