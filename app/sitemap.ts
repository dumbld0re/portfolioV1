import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/posts"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const latestPost = posts[0]?.date ? new Date(posts[0].date) : undefined

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/cv`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/posts`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
