"use client"

import { useLanguage } from "@/components/language-provider"
import { formatPostDate } from "@/lib/format-date"
import { inLanguage } from "@/lib/post-language"
import type { Post } from "@/lib/posts"
import { column } from "@/lib/styles"

// One post, in the same plain column as the list (posts-section.tsx): the
// title, its date, then the text at a comfortable reading width.
export function PostSection({ post: source }: { post: Post }) {
  const { language } = useLanguage()
  const post = inLanguage(source, language)

  return (
    <main className="flex-1 px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-32">
      <article className={column}>
        <div className="max-w-2xl">
          <header>
            <h1 className="font-serif text-4xl lowercase leading-tight tracking-[-0.02em] text-balance md:text-5xl">
              {post.title}
            </h1>
            {post.date && (
              <time dateTime={post.date} className="mt-3 block font-mono text-xs text-muted-foreground">
                {formatPostDate(post.date, language)}
              </time>
            )}
          </header>

          <div className="post-prose mt-12 text-lg md:mt-16" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </article>
    </main>
  )
}
