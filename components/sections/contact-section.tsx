"use client"

import { contactContent } from "@/content/contact"
import { LetterForm, openLetter } from "@/components/letter-form"
import { useLanguage } from "@/components/language-provider"
import { SiteFooter } from "@/components/site-footer"
import { GlobeHorizon } from "@/components/visitor-globe"
import { BrandIcon } from "@/components/social-links"
import { TimeStatus } from "@/components/time-status"
import { ReadingNow } from "@/components/reading-now"
import { column, inlineLink, sectionHeading, sectionLabel } from "@/lib/styles"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]

  return (
    <section id="contact" className="scroll-mt-10 px-6 pt-16 md:px-12 md:pt-24">
      <div data-reveal className={column}>
        {/* Phones and tablets: one centred column under the hero's centre
            line. Wide screens: the text on the left, the letter open beside it. */}
        <div className="mx-auto max-w-[68rem] lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <div className="mx-auto max-w-[42rem] text-center lg:mx-0 lg:text-left">
        <h2 className={sectionLabel}>
          {t.title}
        </h2>

        <p className={sectionHeading}>
          {t.heading.replace(/\.$/, "")}
          <span className="text-primary">.</span>
        </p>

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
        <ReadingNow className="mt-1" />
        </div>

        {/* Wide screens: the letter sits open on the right. Phones: it opens
            from the email address (and the corner's "say hello") instead. */}
        <LetterForm id="contact-letter" see className="mt-12 hidden lg:mt-0 lg:flex" />
        </div>

        <SiteFooter className="mt-24" globe />
      </div>
      {/* Wide screens: the globe rises under the footer row, edge to edge. */}
      <GlobeHorizon screens="wide" className="mt-12 hidden h-64 lg:block" />
    </section>
  )
}
