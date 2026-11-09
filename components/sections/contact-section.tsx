"use client"


import { contactContent } from "@/content/contact"
import { sayHiToMe } from "@/content/handwriting"
import { siteCopy } from "@/content/site"
import { BoringToggle } from "@/components/boring-toggle"
import { DontClickLink } from "@/components/dont-click-link"
import { Handwritten } from "@/components/handwritten"
import { LastUpdated } from "@/components/last-updated"
import { openLetter } from "@/components/letter-form"
import { useLanguage } from "@/components/language-provider"
import { SocialLinks } from "@/components/social-links"
import { TimeStatus } from "@/components/time-status"
import { column, inlineLink, sectionLabel } from "@/lib/styles"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]
  const copy = siteCopy[language]

  return (
    <section id="contact" className="scroll-mt-10 px-6 md:px-12 pt-24 pb-10 md:pt-32 lg:pb-16">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>
          {t.title}
        </h2>

        {/* The set heading, with "say hi to me" scribbled over it by hand. */}
        <div className="relative mt-6 mb-16 w-fit md:mb-20">
          <p className="font-serif text-5xl lowercase leading-tight tracking-[-0.02em] text-balance text-foreground/35 md:text-7xl">
            {t.heading.replace(/\.$/, "")}
            <span className="text-primary/60">.</span>
          </p>
          <Handwritten
            writing={sayHiToMe}
            label="say hi to me"
            delay={250}
            className="pointer-events-none absolute left-[12%] top-[-55%] w-[min(30rem,72vw)] -rotate-6 text-primary"
          />
        </div>

        <p className="mt-8 max-w-2xl text-xl leading-relaxed md:text-2xl text-muted-foreground">
          {t.blurbBefore}{" "}
          {/* opens the letter; the real mailto stays as the href for
              no-js, middle-click and copy-link */}
          <a
            href={`mailto:${t.email}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
              e.preventDefault()
              openLetter()
            }}
            aria-haspopup="dialog"
            className={`${inlineLink} text-foreground`}
          >
            {t.email}
          </a>
          {t.blurbAfter}
        </p>

        <SocialLinks items={["whatsapp", "github", "cv", "x"]} className="mt-8" />

        <TimeStatus className="mt-8 space-y-1 font-mono text-sm text-muted-foreground" />

        <div className="mt-24 flex flex-col gap-3 border-t border-border/60 pt-6 font-mono text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{copy.footer}</p>
          <LastUpdated />
          <DontClickLink className="w-fit transition-colors hover:text-foreground">{copy.dontClickHere}</DontClickLink>
          <div className="mt-2 lg:hidden">
            <BoringToggle />
          </div>
        </div>
      </div>
    </section>
  )
}
