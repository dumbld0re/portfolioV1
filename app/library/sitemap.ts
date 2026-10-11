import type { MetadataRoute } from "next"

import { getLibrary } from "@/lib/library"
import { LIBRARY_URL } from "@/lib/library-host"

// Served at read.dannymiguel.com/sitemap.xml via the proxy.ts rewrite.
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = getLibrary().at(-1)?.added

  return [
    {
      url: `${LIBRARY_URL}/`,
      lastModified: latest ? new Date(latest) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
