"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { postsContent } from "@/content/posts"
import { useLanguage } from "@/components/language-provider"
import { SplitChars } from "@/components/split-chars"
import { formatPostDate } from "@/lib/format-date"
import type { PostMeta } from "@/lib/posts"

export function PostsSection({ posts }: { posts: PostMeta[] }) {
  const { language, localize } = useLanguage()
  const t = postsContent[language]

  return (
    <main className="flex-1 px-6 md:px-12 lg:px-16 pt-12 md:pt-20 pb-16">
      <div className="mx-auto max-w-[90rem]">
        <header className="relative flex items-end justify-between gap-6 pb-12 md:pb-16">
          <div className="space-y-8">
            <h1 className="font-mono text-label uppercase tracking-[0.3em] text-muted-foreground motion-safe:animate-reveal-up">
              <span className="text-primary">006</span> / {t.label}
            </h1>
            <p className="font-serif lowercase leading-[0.85] tracking-[-0.04em] text-[clamp(4rem,1rem+14vw,15rem)]">
              <SplitChars text={t.label} delay={150} />
              <span className="text-primary">.</span>
            </p>
          </div>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-border motion-safe:animate-line-in" />
        </header>

        {posts.length === 0 ? (
          <p
            className="py-16 font-mono text-heading tracking-tight text-muted-foreground motion-safe:animate-reveal-up"
            style={{ animationDelay: "400ms" }}
          >
            {t.emptyState}
            <span aria-hidden="true" className="text-primary motion-safe:animate-caret-blink">
              ▍
            </span>
          </p>
        ) : (
          <ol>
            {posts.map((post, i) => (
              <li
                key={post.slug}
                className="motion-safe:animate-reveal-up"
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <Link
                  href={localize(`/posts/${post.slug}`)}
                  className="group relative grid grid-cols-[2.5rem_1fr] md:grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-border/60 py-8 md:py-10 md:px-4"
                >
                  {/* Wipe-in fill behind the row on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-card transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                  />
                  <span className="font-mono text-sm text-muted-foreground transition-colors group-hover:text-primary md:col-span-1">
                    {String(posts.length - i).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl leading-[1] tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:col-span-7 md:group-hover:translate-x-4">
                    {post.title}
                  </h2>
                  {post.date && (
                    <time
                      dateTime={post.date}
                      className="col-start-2 md:col-start-auto md:col-span-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      {formatPostDate(post.date, language)}
                    </time>
                  )}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden md:block md:col-span-1 justify-self-end size-6 text-muted-foreground transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:text-primary"
                  />
                  {post.summary && (
                    <p className="col-start-2 md:col-start-2 md:col-span-7 max-w-2xl text-muted-foreground leading-relaxed">{post.summary}</p>
                  )}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  )
}
