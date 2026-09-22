import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { PostSection } from "@/components/sections/post-section"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { SITE_NAME, SITE_URL, baseOpenGraph, jsonLdScript } from "@/lib/seo"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `/posts/${post.slug}`
  return {
    title: post.title,
    description: post.summary || undefined,
    alternates: { canonical: url },
    openGraph: {
      ...baseOpenGraph,
      type: "article",
      url,
      title: post.title,
      description: post.summary || undefined,
      publishedTime: post.date || undefined,
      authors: [SITE_NAME],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return (
    <LayoutWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary || undefined,
          datePublished: post.date || undefined,
          url: `${SITE_URL}/posts/${post.slug}`,
          author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
        })}
      />
      <PostSection post={post} />
    </LayoutWrapper>
  )
}
