"use client"

import Link from "next/link"

import { postsContent } from "@/content/posts"
import { useLanguage } from "@/components/language-provider"
import { formatPostDate } from "@/lib/format-date"
import { inLanguage } from "@/lib/post-language"
import type { PostMeta } from "@/lib/posts"
import { column } from "@/lib/styles"

// /posts: a small serif heading, one muted line under it, then a plain list
// of titles and dates. No entrance animation: it just appears.
export function PostsSection({ posts }: { posts: PostMeta[] }) {
  const { language, localize } = useLanguage()
  const t = postsContent[language]

  return (
    <main className="flex-1 px-6 md:px-12 pt-14 pb-24 md:pt-20 md:pb-32 short:pt-8">
      <div className={column}>
        <div className="max-w-2xl">
          <header>
            <h1 className="font-serif text-4xl lowercase leading-tight tracking-[-0.02em] md:text-5xl">{t.label}</h1>
            <p className="mt-3 text-muted-foreground">{t.tagline}</p>
          </header>

          {posts.length === 0 ? (
            <p className="mt-16 text-muted-foreground">{t.emptyState}</p>
          ) : (
            <ol className="mt-12 space-y-6 short:mt-8">
              {posts.map((source) => inLanguage(source, language)).map((post) => (
                <li key={post.slug}>
                  <Link href={localize(`/posts/${post.slug}`)} className="group block">
                    <div className="flex items-baseline justify-between gap-6">
                      <h2 className="font-serif text-xl lowercase tracking-[-0.01em] underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-primary md:text-2xl">
                        {post.title}
                      </h2>
                      {post.pinned ? (
                        <span className="shrink-0 font-mono text-xs text-primary">{t.pinned}</span>
                      ) : (
                        post.date && (
                          <time dateTime={post.date} className="shrink-0 font-mono text-xs text-muted-foreground">
                            {formatPostDate(post.date, language)}
                          </time>
                        )
                      )}
                    </div>
                    {post.summary && <p className="mt-1 text-sm text-muted-foreground">{post.summary}</p>}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </main>
  )
}
