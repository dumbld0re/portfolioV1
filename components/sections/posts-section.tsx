"use client"

import Link from "next/link"

import { postsContent } from "@/content/posts"
import { useLanguage } from "@/components/language-provider"
import { formatPostDate } from "@/lib/format-date"
import type { PostMeta } from "@/lib/posts"
import { column } from "@/lib/styles"

// /posts: a small serif heading, one muted line under it, then a plain list
// of titles and dates.
export function PostsSection({ posts }: { posts: PostMeta[] }) {
  const { language, localize } = useLanguage()
  const t = postsContent[language]

  return (
    <main className="flex-1 px-6 md:px-12 py-24 md:py-32">
      <div className={column}>
        <div className="max-w-2xl">
          <header className="motion-safe:animate-reveal-up">
            <h1 className="font-serif text-4xl lowercase leading-tight tracking-[-0.02em] md:text-5xl">{t.label}</h1>
            <p className="mt-3 text-muted-foreground">{t.tagline}</p>
          </header>

          {posts.length === 0 ? (
            <p
              className="mt-16 text-muted-foreground motion-safe:animate-reveal-up"
              style={{ animationDelay: "150ms" }}
            >
              {t.emptyState}
            </p>
          ) : (
            <ol className="mt-16 space-y-8">
              {posts.map((post, i) => (
                <li
                  key={post.slug}
                  className="motion-safe:animate-reveal-up"
                  style={{ animationDelay: `${150 + i * 60}ms` }}
                >
                  <Link href={localize(`/posts/${post.slug}`)} className="group block">
                    <div className="flex items-baseline justify-between gap-6">
                      <h2 className="font-serif text-xl lowercase tracking-[-0.01em] underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-primary md:text-2xl">
                        {post.title}
                      </h2>
                      {post.date && (
                        <time dateTime={post.date} className="shrink-0 font-mono text-xs text-muted-foreground">
                          {formatPostDate(post.date, language)}
                        </time>
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
