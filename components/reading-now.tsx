"use client"

import { useLanguage } from "@/components/language-provider"
import { readingNow, readingNowCopy } from "@/content/reading-now"
import { LIBRARY_URL } from "@/lib/library-host"
import { cn } from "@/lib/utils"

/** "currently reading → title by author ↗", in the clock's voice; links to the shelf. */
export function ReadingNow({ className }: { className?: string }) {
  const { language } = useLanguage()
  const t = readingNowCopy[language]
  return (
    <p className={cn("font-mono text-sm text-muted-foreground text-balance", className)}>
      {t.label} →{" "}
      <a
        href={LIBRARY_URL}
        title={t.shelf}
        className="text-foreground/80 underline decoration-border decoration-1 underline-offset-[5px] transition-colors hover:text-foreground hover:decoration-primary"
      >
        {readingNow.title}
      </a>{" "}
      {/* The author and arrow stay together when the line wraps. */}
      <span className="whitespace-nowrap">
        {t.by} {readingNow.author}
        <span className="text-primary" aria-hidden="true">
          {" "}
          ↗
        </span>
      </span>
    </p>
  )
}
