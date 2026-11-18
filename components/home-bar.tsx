"use client"

import { exploreContent } from "@/content/explore"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitch } from "@/components/language-switch"
import { ThemeToggle } from "@/components/theme-toggle"

// The home page's top: no links (the sentence is the way around), only the
// three languages and the theme, top right. A small note with a hand-drawn
// arrow points up at the languages, the way Fairhour points at its email
// button. It's a <header>, so the corner's language switch knows when it has
// scrolled away (components/corner-controls.tsx).
export function HomeBar() {
  const { language } = useLanguage()
  const t = exploreContent[language]

  return (
    <header className="relative z-30 w-full px-6 pt-5 pb-4 md:px-12 md:pt-10 print:hidden">
      <div className="mx-auto flex max-w-[90rem] justify-end">
        <div className="relative flex items-center gap-x-4 font-mono text-sm md:text-base">
          <span className="flex items-center gap-x-3 text-muted-foreground">
            <LanguageSwitch className="-my-3 py-3 transition-colors hover:text-foreground" />
          </span>
          <ThemeToggle />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[4.25rem] top-full mt-1 flex items-start text-muted-foreground"
          >
            <span className="mt-6 whitespace-nowrap font-mono text-xs md:text-[13px]">{t.languageNote}</span>
            {/* From the end of the note, a curve up to the codes. */}
            <svg viewBox="0 0 40 34" className="ml-1 h-[34px] w-10 overflow-visible" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 28c14 3 26-4 30-24" />
              <path d="M26.5 9 32 3.5l4.5 6.5" />
            </svg>
          </span>
        </div>
      </div>
    </header>
  )
}
