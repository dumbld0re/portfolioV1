import { notFound } from "next/navigation"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { PostSection } from "@/components/sections/post-section"
import { getAllPosts, getPostBySlug } from "@/lib/posts"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return (
    <LayoutWrapper>
      <PostSection post={post} />
    </LayoutWrapper>
  )
}
