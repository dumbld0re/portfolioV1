"use client"

import { postsContent } from "@/content/posts"
import { useLanguage } from "@/components/language-provider"
import { ReadingProgress } from "@/components/reading-progress"
import { formatPostDate } from "@/lib/format-date"
import type { Post } from "@/lib/posts"

export function PostSection({ post }: { post: Post }) {
  const { language } = useLanguage()
  const t = postsContent[language]

  const metaLabel = "font-mono text-label uppercase tracking-[0.3em] text-muted-foreground"

  return (
    <main className="flex-1 px-6 md:px-12 lg:px-16 pt-12 md:pt-20 pb-16">
      <article className="mx-auto max-w-[90rem]">
        <header className="relative space-y-10 pb-8 md:pb-10">
          <h1 className="max-w-6xl font-serif leading-[0.95] tracking-[-0.03em] text-[clamp(2.75rem,1rem+6vw,8rem)] text-balance">
            {post.title}
          </h1>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-border" />
        </header>

        <div className="grid gap-10 pt-10 md:grid-cols-12 md:gap-x-6 md:pt-14">
          <aside
            className="md:col-span-3 md:sticky md:top-32 md:self-start flex flex-wrap gap-x-10 gap-y-6 md:flex-col"
          >
            {post.date && (
              <div className="space-y-1.5">
                <p className={metaLabel}>{t.publishedLabel}</p>
                <time dateTime={post.date} className="block font-mono text-sm">
                  {formatPostDate(post.date, language)}
                </time>
              </div>
            )}
            <div className="hidden md:block pt-2">
              <ReadingProgress targetId="post-body" />
            </div>
          </aside>

          <div
            id="post-body"
            className="post-prose md:col-span-7 md:col-start-5 text-lg"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </article>
    </main>
  )
}
