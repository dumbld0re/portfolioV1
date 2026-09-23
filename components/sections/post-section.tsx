"use client"

import Link from "next/link"

import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { formatPostDate } from "@/lib/format-date"
import type { Post } from "@/lib/posts"

export function PostSection({ post }: { post: Post }) {
  const { language, localize } = useLanguage()
  const labels = siteCopy[language]

  return (
    <main className="flex-1 px-6 py-16 md:py-20">
      <article className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <Link
            href={localize("/posts")}
            className="group mb-4 inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:-translate-x-1">
              ←
            </span>
            {labels.nav.posts}
          </Link>
          <h1 className="font-serif text-heading font-semibold tracking-tight">{post.title}</h1>
          {post.date && (
            <time dateTime={post.date} className="block font-mono text-sm text-muted-foreground">
              {formatPostDate(post.date, language)}
            </time>
          )}
        </div>

        <div className="post-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  )
}
