"use client"

import Link from "next/link"

import { useLanguage } from "@/components/language-provider"
import { inlineLink } from "@/lib/styles"

// The footer promises a master's thesis. This is its title page: every field
// filled in honestly, which means mostly with "not yet".
const copy = {
  en: {
    label: "master's thesis",
    line: "nothing here yet, but with time i will have one!",
    fields: [
      ["title", "to be decided"],
      ["author", "Danny-Miguel"],
      ["pages", "0"],
      ["submitted", "someday"],
    ],
    back: "ok, take me back",
  },
  de: {
    label: "masterarbeit",
    line: "hier ist noch nichts, aber mit der zeit kommt eine!",
    fields: [
      ["titel", "steht noch aus"],
      ["autor", "Danny-Miguel"],
      ["seiten", "0"],
      ["abgabe", "irgendwann"],
    ],
    back: "ok, bring mich zurück",
  },
  it: {
    label: "tesi magistrale",
    line: "qui non c'è ancora niente, ma col tempo ne avrò una!",
    fields: [
      ["titolo", "da decidere"],
      ["autore", "Danny-Miguel"],
      ["pagine", "0"],
      ["consegna", "prima o poi"],
    ],
    back: "ok, riportami indietro",
  },
}

export default function MastersThesisPage() {
  const { language, localize } = useLanguage()
  const t = copy[language]

  return (
    <main className="site flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center text-foreground">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground motion-safe:animate-reveal-up md:text-[13px]">
        {t.label}
      </p>
      <h1
        className="mt-6 max-w-2xl font-serif text-4xl lowercase leading-tight tracking-[-0.02em] text-balance motion-safe:animate-reveal-up md:text-6xl"
        style={{ animationDelay: "150ms" }}
      >
        {t.line}
      </h1>
      <dl
        className="mt-12 grid grid-cols-[auto_auto] gap-x-6 gap-y-1.5 text-left font-mono text-xs text-muted-foreground motion-safe:animate-reveal-up"
        style={{ animationDelay: "300ms" }}
      >
        {t.fields.map(([term, value]) => (
          <div key={term} className="contents">
            <dt className="text-muted-foreground/70">{term}</dt>
            <dd className="tabular-nums text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href={localize("/")}
        className={`${inlineLink} mt-12 font-mono text-xs text-muted-foreground motion-safe:animate-reveal-up`}
        style={{ animationDelay: "450ms" }}
      >
        {t.back}
      </Link>
    </main>
  )
}
