"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { postsContent } from "@/content/posts"
import { siteCopy } from "@/content/site"
import { useLanguage } from "@/components/language-provider"
import { ReadingProgress } from "@/components/reading-progress"
import { RollText } from "@/components/roll-text"
import { SplitChars } from "@/components/split-chars"
import { formatPostDate } from "@/lib/format-date"
import type { Post } from "@/lib/posts"

const WORDS_PER_MINUTE = 220

export function PostSection({ post }: { post: Post }) {
  const { language, localize } = useLanguage()
  const labels = siteCopy[language]
  const t = postsContent[language]
  const words = post.html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))

  const metaLabel = "font-mono text-label uppercase tracking-[0.3em] text-muted-foreground"

  return (
    <main className="flex-1 px-6 md:px-12 lg:px-16 pt-12 md:pt-20 pb-16">
      <article className="mx-auto max-w-[90rem]">
        <header className="relative space-y-10 pb-8 md:pb-10">
          <Link
            href={localize("/posts")}
            className={`group inline-flex items-center gap-2 ${metaLabel} transition-colors hover:text-foreground motion-safe:animate-reveal-up`}
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
            <RollText>{labels.nav.posts}</RollText>
          </Link>
          <h1 className="max-w-6xl font-serif leading-[0.95] tracking-[-0.03em] text-[clamp(2.75rem,1rem+6vw,8rem)] text-balance">
            <SplitChars text={post.title} delay={150} />
          </h1>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-border motion-safe:animate-line-in" />
        </header>

        <div className="grid gap-10 pt-10 md:grid-cols-12 md:gap-x-6 md:pt-14">
          <aside
            className="md:col-span-3 md:sticky md:top-32 md:self-start flex flex-wrap gap-x-10 gap-y-6 md:flex-col motion-safe:animate-reveal-up"
            style={{ animationDelay: "500ms" }}
          >
            {post.date && (
              <div className="space-y-1.5">
                <p className={metaLabel}>{t.publishedLabel}</p>
                <time dateTime={post.date} className="block font-mono text-sm">
                  {formatPostDate(post.date, language)}
                </time>
              </div>
            )}
            <div className="space-y-1.5">
              <p className={metaLabel}>{t.readingLabel}</p>
              <p className="font-mono text-sm">
                {minutes} {t.minRead}
              </p>
            </div>
            <div className="hidden md:block pt-2">
              <ReadingProgress targetId="post-body" />
            </div>
          </aside>

          <div
            id="post-body"
            className="post-prose md:col-span-7 md:col-start-5 text-lg motion-safe:animate-reveal-up"
            style={{ animationDelay: "650ms" }}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </article>
    </main>
  )
}
