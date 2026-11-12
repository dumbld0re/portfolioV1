"use client"

import { contactContent } from "@/content/contact"
import { sayHiToMe } from "@/content/handwriting"
import { Handwritten } from "@/components/handwritten"
import { LetterForm, openLetter } from "@/components/letter-form"
import { useLanguage } from "@/components/language-provider"
import { SiteFooter } from "@/components/site-footer"
import { BrandIcon } from "@/components/social-links"
import { TimeStatus } from "@/components/time-status"
import { column, inlineLink, sectionHeading, sectionLabel } from "@/lib/styles"
import { cn } from "@/lib/utils"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]
  // The handwriting only exists in English ("say hi to me"); German keeps
  // its heading as set type.
  const scribbled = language === "en"

  return (
    <section id="contact" className="scroll-mt-10 px-6 pt-16 pb-10 md:px-12 md:pt-24 lg:pb-24">
      <div data-reveal className={column}>
        {/* Phones and tablets: one centred column under the hero's centre
            line. Wide screens: the text on the left, the letter open beside it. */}
        <div className="mx-auto max-w-[68rem] lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <div className="mx-auto max-w-[42rem] text-center lg:mx-0 lg:text-left">
        <h2 className={sectionLabel}>
          {t.title}
        </h2>

        {/* The set heading; in English "say hi to me" is scribbled over it by
            hand, and the space below is for the scribble's tail. The scribble is centred on the heading, and starts
            inside it where the text is left-aligned. */}
        <div className={cn("relative mx-auto w-fit lg:mx-0", // Room above for the scribble's tall strokes where it is centred.
          scribbled && "mt-5 mb-12 md:mb-20 lg:mt-0")}>
          <p className={cn(sectionHeading, scribbled && "text-foreground/35")}>
            {t.heading.replace(/\.$/, "")}
            <span className={scribbled ? "text-primary/60" : "text-primary"}>.</span>
          </p>
          {scribbled && (
            <Handwritten
              writing={sayHiToMe}
              label="say hi to me"
              delay={250}
              className="pointer-events-none absolute left-1/2 top-[-55%] w-[min(18.5rem,45vw)] -translate-x-1/2 -rotate-6 lg:left-[12%] lg:translate-x-0 text-primary"
            />
          )}
        </div>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl mx-auto lg:mx-0">
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
          {t.blurbAfter}{" "}
          {/* The logo stays on the word's line. */}
          <a
            href={`https://wa.me/${t.phone.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className={`${inlineLink} whitespace-nowrap text-foreground`}
          >
            <BrandIcon name="whatsapp" className="mr-1.5 inline-block size-[0.95em] align-[-0.12em]" />
            whatsapp
          </a>
          {t.blurbEnd}
        </p>


        <TimeStatus className="mt-8 space-y-1 font-mono text-sm text-muted-foreground" />
        </div>

        {/* Wide screens: the letter sits open on the right. Phones: it opens
            from the email address (and the corner's "say hello") instead. */}
        <LetterForm id="contact-letter" see className="mt-12 hidden lg:mt-0 lg:flex" />
        </div>

        <SiteFooter className="mt-24" />
      </div>
    </section>
  )
}
