import type { Metadata } from "next"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { PostsSection } from "@/components/sections/posts-section"
import { siteCopy } from "@/content/site"
import { DEFAULT_LANGUAGE, isLanguage, localizePath } from "@/lib/i18n"
import { getAllPosts } from "@/lib/posts"
import { baseOpenGraph, languageAlternates, siteMeta } from "@/lib/seo"

export async function generateMetadata({ params }: PageProps<"/[lang]/posts">): Promise<Metadata> {
  const { lang } = await params
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE

  return {
    title: siteCopy[language].nav.posts,
    description: siteMeta[language].postsDescription,
    alternates: languageAlternates(language, "/posts"),
    openGraph: { ...baseOpenGraph(language), url: localizePath(language, "/posts") },
  }
}

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <LayoutWrapper>
      <PostsSection posts={posts} />
    </LayoutWrapper>
  )
}
