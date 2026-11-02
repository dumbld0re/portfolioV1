"use client"


import { contactContent } from "@/content/contact"
import { siteCopy } from "@/content/site"
import { BoringToggle } from "@/components/boring-toggle"
import { DontClickLink } from "@/components/dont-click-link"
import { useLanguage } from "@/components/language-provider"
import { LocalClock } from "@/components/local-clock"
import { SocialLinks } from "@/components/social-links"
import { column, inlineLink, sectionLabel } from "@/lib/styles"

export function ContactSection() {
  const { language } = useLanguage()
  const t = contactContent[language]
  const copy = siteCopy[language]

  return (
    <section id="contact" className="scroll-mt-10 px-6 md:px-12 pt-24 pb-10 md:pt-32 lg:pb-16">
      <div data-reveal className={column}>
        <h2 className={sectionLabel}>
          <span className="text-primary">003</span> / {t.title}
        </h2>

        <p className="mt-6 font-serif text-5xl lowercase leading-tight tracking-[-0.02em] text-balance md:text-7xl">
          {t.heading.replace(/\.$/, "")}
          <span className="text-primary">.</span>
        </p>

        <p className="mt-8 max-w-2xl text-xl leading-relaxed md:text-2xl text-muted-foreground">
          {t.blurbBefore}{" "}
          <a href={`mailto:${t.email}`} className={`${inlineLink} text-foreground`}>
            {t.email}
          </a>{" "}
          {t.blurbAfter}
        </p>

        <SocialLinks items={["whatsapp", "github", "cv", "x"]} className="mt-8" />

        <p className="mt-8 font-mono text-sm text-muted-foreground">
          {t.localTimeLabel.toLowerCase()}: <LocalClock className="text-foreground/80" showPlace />
        </p>

        <div className="mt-24 flex flex-col gap-3 border-t border-border/60 pt-6 font-mono text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{copy.footer}</p>
          <DontClickLink className="w-fit transition-colors hover:text-foreground">{copy.dontClickHere}</DontClickLink>
          <div className="mt-2 lg:hidden">
            <BoringToggle />
          </div>
        </div>
      </div>
    </section>
  )
}
