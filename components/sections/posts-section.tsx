"use client"

import Link from "next/link"

import { postsContent } from "@/content/posts"
import { useLanguage } from "@/components/language-provider"
import type { PostMeta } from "@/lib/posts"

export function PostsSection({ posts }: { posts: PostMeta[] }) {
  const { language } = useLanguage()
  const t = postsContent[language]

  if (posts.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="text-center space-y-6">
          <h1 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground motion-safe:animate-reveal-up">
            <span className="text-primary">006</span> / {t.label}
          </h1>
          <p
            className="font-mono text-heading font-semibold tracking-tight motion-safe:animate-reveal-up"
            style={{ animationDelay: "100ms" }}
          >
            {t.emptyState}
            <span aria-hidden="true" className="motion-safe:animate-caret-blink">
              ▍
            </span>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground motion-safe:animate-reveal-up">
          <span className="text-primary">006</span> / {t.label}
        </h1>
        <div className="space-y-8">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group block space-y-2 border-b border-border pb-8 last:border-0 motion-safe:animate-reveal-up"
              style={{ animationDelay: `${100 + i * 60}ms` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-serif text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                {post.date && <span className="font-mono text-sm text-muted-foreground shrink-0">{post.date}</span>}
              </div>
              {post.summary && <p className="text-muted-foreground leading-relaxed">{post.summary}</p>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
