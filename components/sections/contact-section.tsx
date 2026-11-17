"use client"

import { contactContent } from "@/content/contact"
import { LetterForm } from "@/components/letter-form"
import { useLanguage } from "@/components/language-provider"
import { SiteFooter } from "@/components/site-footer"
import { GlobeHorizon } from "@/components/visitor-globe"
import { TimeStatus } from "@/components/time-status"
import { column, inlineLink, sectionHeading } from "@/lib/styles"
import { cn } from "@/lib/utils"

// The end of the home page: "say hi." and an open letter written straight onto
// the page, centred, on every width. Email and WhatsApp stay one quiet line
// under it, then where my clock stands against the visitor's.
export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]

  return (
    <section id="contact" className="scroll-mt-10 px-6 pt-16 md:px-12 md:pt-24">
      <div data-reveal className={column}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="sr-only">{t.title}</h2>
          <p className={cn(sectionHeading, "mt-0 md:mt-0")}>
            {t.heading.replace(/\.$/, "")}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-3 text-muted-foreground md:text-lg">{t.letterLine}</p>

          <LetterForm id="contact-letter" variant="open" className="mt-12 md:mt-14" />

          <p className="mt-4 font-mono text-sm lowercase text-muted-foreground">
            or{" "}
            <a href={`mailto:${t.email}`} className={inlineLink}>
              email
            </a>{" "}
            ·{" "}
            <a href={`https://wa.me/${t.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className={inlineLink}>
              whatsapp
            </a>
          </p>
          <TimeStatus className="mt-8 space-y-1 font-mono text-sm text-muted-foreground" />
        </div>

        <SiteFooter className="mt-24" globe />
      </div>
      {/* Wide screens: the globe rises under the footer, edge to edge; the
          footer's own line already says where people came from. */}
      <GlobeHorizon screens="wide" pill={false} className="mt-6 hidden h-72 lg:block" />
    </section>
  )
}
