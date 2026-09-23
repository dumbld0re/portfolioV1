import type { MetadataRoute } from "next"

import { LANGUAGES, localizePath } from "@/lib/i18n"
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
  const posts = getAllPosts()
  const latestPost = posts[0]?.date ? new Date(posts[0].date) : undefined

  return [
    ...localized("/", { changeFrequency: "monthly", priority: 1 }),
    ...localized("/cv", { changeFrequency: "monthly", priority: 0.8 }),
    ...localized("/posts", { lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 }),
    // Posts are English-only; the /de copies canonicalize to these URLs.
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
