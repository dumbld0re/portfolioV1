"use client"

import { Fragment } from "react"

import { exploreContent } from "@/content/explore"
import { homeContent } from "@/content/home"
import { useLanguage } from "@/components/language-provider"
import { setBoring } from "@/lib/boring-store"
import { INSTAGRAM_URL, PINTEREST_URL, X_URL } from "@/lib/styles"

const copy = {
  en: {
    notice: "Boring mode is on.",
    off: "Make it fun again",
    cv: "CV",
    viewed: "Best viewed in Netscape Navigator 3.0 at 800×600.",
  },
  de: {
    notice: "Der langweilige Modus ist an.",
    off: "Mach es wieder schön",
    cv: "Lebenslauf",
    viewed: "Am besten in Netscape Navigator 3.0 bei 800×600.",
  },
  it: {
    notice: "La modalità noiosa è attiva.",
    off: "Rendilo di nuovo divertente",
    cv: "CV",
    viewed: "Visualizzazione ottimale con Netscape Navigator 3.0 a 800×600.",
  },
}

// Boring mode, plain: the home page as an HTML document from 1996. Same
// content, no design at all: everything here is reset to the browser's own
// default styles (.plain-doc in globals.css), so the markup is all it has.
// The sentence's pills become plain links: to the pages, or down the page.
export function PlainHome() {
  const { language, localize } = useLanguage()
  const t = copy[language]
  const e = exploreContent[language]
  const hero = homeContent[language].hero

  const links: Record<string, string> = {
    posts: localize("/posts"),
    projects: localize("/projects"),
    reading: "/read",
    elsewhere: "#elsewhere",
    about: "#about",
  }
  const sentence = e.sentence.split(/(\{\w+\})/).map((bit, i) => {
    const key = bit.match(/^\{(\w+)\}$/)?.[1]
    if (key === "namibia") return <Fragment key={i}>Namibia</Fragment>
    if (key === "things") return <Fragment key={i}>{hero.things[0]}</Fragment>
    if (key && key in links)
      return (
        <a key={i} href={links[key]}>
          {e.sentenceWords[key as keyof typeof e.sentenceWords]}
        </a>
      )
    return <Fragment key={i}>{bit}</Fragment>
  })

  const elsewhere: [string, string][] = [
    ["GitHub", "https://github.com/dumbld0re"],
    ["Pinterest", PINTEREST_URL],
    ["X", X_URL],
    ["Instagram", INSTAGRAM_URL],
    ["æ design studio", "https://www.aestudio.site/"],
  ]

  return (
    <div className="plain-doc">
      <p>
        <small>
          {t.notice} [
          <button type="button" onClick={() => setBoring(false)}>
            {t.off}
          </button>
          ]
        </small>
      </p>

      <h1>Danny-Miguel Mittelberger</h1>
      <p>{sentence}</p>

      <hr />
      <h2 id="about">{e.sections.about.title}</h2>
      <p>{hero.intro}</p>
      <p>{hero.description}</p>
      <p>
        {t.cv}: <a href="/cv.pdf">cv.pdf</a>
      </p>

      <hr />
      <h2 id="elsewhere">{e.sections.elsewhere.title}</h2>
      <ul>
        {elsewhere.map(([label, href]) => (
          <li key={label}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>

      <hr />
      <address>
        Danny-Miguel Mittelberger, {hero.location}
        <br />
        <small>{t.viewed}</small>
      </address>
    </div>
  )
}
