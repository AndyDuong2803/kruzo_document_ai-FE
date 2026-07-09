import type { MetadataRoute } from "next";

import { absoluteUrl, seoRoutes, type SeoRoute } from "@/lib/seo";

const routes: SeoRoute[] = Object.values(seoRoutes);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes
    .filter((route) => route.index !== false)
    .map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.path === "/" ? "weekly" : "monthly",
      priority: route.priority,
    }));
}
