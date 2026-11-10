"use client"

import { contactContent } from "@/content/contact"
import { sayHiToMe } from "@/content/handwriting"
import { Handwritten } from "@/components/handwritten"
import { LetterForm, openLetter } from "@/components/letter-form"
import { useLanguage } from "@/components/language-provider"
import { SiteFooter } from "@/components/site-footer"
import { SocialLinks } from "@/components/social-links"
import { TimeStatus } from "@/components/time-status"
import { column, inlineLink, sectionLabel } from "@/lib/styles"
import { cn } from "@/lib/utils"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]
  // The handwriting only exists in English ("say hi to me"); German keeps
  // its heading as set type.
  const scribbled = language === "en"

  return (
    <section id="contact" className="scroll-mt-10 px-6 md:px-12 pt-24 pb-10 md:pt-32 lg:pb-24">
      <div data-reveal className={column}>
        {/* Wide screens: the text on the left, the message box on the right. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12">
        <div>
        <h2 className={sectionLabel}>
          {t.title}
        </h2>

        {/* The set heading; in English "say hi to me" is scribbled over it by
            hand, and the space below is for the scribble's tail. */}
        <div className={cn("relative mt-6 w-fit", scribbled && "mb-20 md:mb-28")}>
          <p
            className={cn(
              "font-serif text-5xl lowercase leading-tight tracking-[-0.02em] text-balance md:text-7xl",
              scribbled && "text-foreground/35",
            )}
          >
            {t.heading.replace(/\.$/, "")}
            <span className={scribbled ? "text-primary/60" : "text-primary"}>.</span>
          </p>
          {scribbled && (
            <Handwritten
              writing={sayHiToMe}
              label="say hi to me"
              delay={250}
              className="pointer-events-none absolute left-[12%] top-[-55%] w-[min(30rem,72vw)] -rotate-6 text-primary"
            />
          )}
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
        </div>

        {/* Wide screens: the letter sits open on the right. Phones: it opens
            from the email address (and the corner's "say hello") instead. */}
        <LetterForm id="contact-letter" className="mt-12 hidden lg:mt-0 lg:flex lg:justify-self-end" />
        </div>

        <SiteFooter className="mt-24" />
      </div>
    </section>
  )
}
