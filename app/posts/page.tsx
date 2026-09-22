import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { PostsSection } from "@/components/sections/posts-section"
import { getAllPosts } from "@/lib/posts"
import { baseOpenGraph } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Posts",
  description: "Notes and posts by Danny-Miguel Mittelberger — a digital garden on web development, Linux and whatever else.",
  alternates: { canonical: "/posts" },
  openGraph: { ...baseOpenGraph, url: "/posts" },
}

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <LayoutWrapper>
      <PostsSection posts={posts} />
    </LayoutWrapper>
  )
}
