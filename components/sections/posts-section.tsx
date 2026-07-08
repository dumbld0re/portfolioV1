"use client"

import { postsContent } from "@/content/posts"
import { useLanguage } from "@/components/language-provider"

export function PostsSection() {
  const { language } = useLanguage()
  const t = postsContent[language]

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
