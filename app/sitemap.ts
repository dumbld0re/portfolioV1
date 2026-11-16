import type { MetadataRoute } from "next"

import { LANGUAGES, localizePath } from "@/lib/i18n"
import { SHOW_POSTS } from "@/lib/features"
import { getLibrary } from "@/lib/library"
import { LIBRARY_URL } from "@/lib/library-host"
import { getAllPosts } from "@/lib/posts"
import { SITE_URL } from "@/lib/seo"

// Every page exists in each language; hreflang alternates tie the copies together.
function localized(path: string, entry: Omit<MetadataRoute.Sitemap[number], "url">): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LANGUAGES.map((lang) => [lang, `${SITE_URL}${localizePath(lang, path)}`]))
  return LANGUAGES.map((lang) => ({
    ...entry,
    url: `${SITE_URL}${localizePath(lang, path)}`,
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = SHOW_POSTS ? getAllPosts() : []
  const latestPost = posts[0]?.date ? new Date(posts[0].date) : undefined
  const latestRead = getLibrary().at(-1)?.added

  return [
    ...localized("/", { changeFrequency: "monthly", priority: 1 }),
    ...localized("/projects", { changeFrequency: "monthly", priority: 0.7 }),
    ...(SHOW_POSTS ? localized("/posts", { lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 }) : []),
    // Posts are English-only; the /de copies canonicalize to these URLs.
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    // The reading library, English-only.
    { url: LIBRARY_URL, lastModified: latestRead ? new Date(latestRead) : undefined, changeFrequency: "weekly", priority: 0.6 },
  ]
}
