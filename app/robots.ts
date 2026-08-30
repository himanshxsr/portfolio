import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content/loaders";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { baseUrl } = await getSiteSettings();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
