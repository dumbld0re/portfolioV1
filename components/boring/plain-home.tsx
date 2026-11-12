"use client"

import { Fragment } from "react"

import { contactContent } from "@/content/contact"
import { experienceContent } from "@/content/experience"
import { homeContent } from "@/content/home"
import { projectsContent } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"
import { formatPeriod, monthStart } from "@/lib/format-date"
import { setBoring } from "@/lib/boring-store"
import { INSTAGRAM_URL, PINTEREST_URL, X_URL } from "@/lib/styles"

const copy = {
  en: {
    notice: "Boring mode is on.",
    off: "Make it fun again",
    projects: "Projects",
    experience: "Experience",
    when: "When",
    role: "Role",
    where: "Where",
    contact: "Contact",
    email: "E-mail",
    cv: "CV",
    viewed: "Best viewed in Netscape Navigator 3.0 at 800×600.",
  },
  de: {
    notice: "Der langweilige Modus ist an.",
    off: "Mach es wieder schön",
    projects: "Projekte",
    experience: "Erfahrung",
    when: "Wann",
    role: "Rolle",
    where: "Wo",
    contact: "Kontakt",
    email: "E-Mail",
    cv: "Lebenslauf",
    viewed: "Am besten in Netscape Navigator 3.0 bei 800×600.",
  },
  it: {
    notice: "La modalità noiosa è attiva.",
    off: "Rendilo di nuovo divertente",
    projects: "Progetti",
    experience: "Esperienza",
    when: "Quando",
    role: "Ruolo",
    where: "Dove",
    contact: "Contatti",
    email: "E-mail",
    cv: "CV",
    viewed: "Visualizzazione ottimale con Netscape Navigator 3.0 a 800×600.",
  },
}

/** The hero's {tokens} as 1996 would have them: names as plain links, the rest as words. */
function plainFill(text: string, hero: (typeof homeContent)["en"]["hero"]) {
  const links: Record<string, [string, string]> = {
    unam: ["UNAM", "https://www.unam.edu.na"],
    pinterest: ["Pinterest", PINTEREST_URL],
    x: ["X", X_URL],
    instagram: ["Instagram", INSTAGRAM_URL],
  }
  const words: Record<string, string> = {
    manual: hero.manual.word,
    breaks: hero.breaks,
    linux: "Linux",
    namibia: "Namibia",
    things: hero.things[0],
  }
  return text.split(/(\{\w+\})/).map((bit, i) => {
    const key = bit.match(/^\{(\w+)\}$/)?.[1]
    if (key && links[key]) return <a key={i} href={links[key][1]}>{links[key][0]}</a>
    if (key && words[key]) return <Fragment key={i}>{words[key]}</Fragment>
    return <Fragment key={i}>{bit}</Fragment>
  })
}

// Boring mode, plain: the home page as an HTML document from 1996. Same
// content, no design at all: everything here is reset to the browser's own
// default styles (.plain-doc in globals.css), so the markup is all it has.
export function PlainHome() {
  const { language, localize } = useLanguage()
  const t = copy[language]
  const hero = homeContent[language].hero
  const projects = projectsContent[language]
  const experience = experienceContent[language]
  const contact = contactContent[language]
  const roles = [...experience.experiences].sort((a, b) => monthStart(b.start) - monthStart(a.start))

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
      <p>
        <i>
          {hero.tagline} {hero.things[0]}
        </i>
      </p>
      {/* The same lines as the styled hero, as plain text and plain links. */}
      {hero.lines.map((line) => (
        <p key={line}>{plainFill(line, hero)}</p>
      ))}
      <p>{plainFill(hero.socials, hero)}</p>

      <hr />
      <h2>{t.projects}</h2>
      <p>
        <a href={localize("/projects")}>{projects.heading}</a>: {projects.updating}
      </p>

      <hr />
      <h2>{t.experience}</h2>
      <table border={1} cellPadding={4}>
        <thead>
          <tr>
            <th>{t.when}</th>
            <th>{t.role}</th>
            <th>{t.where}</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.company + role.start}>
              <td>{formatPeriod(role.start, role.end, language, experience.present)}</td>
              <td>{role.role}</td>
              <td>{role.companyHref ? <a href={role.companyHref}>{role.company}</a> : role.company}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <h2>{t.contact}</h2>
      <p>
        {t.email}: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <br />
        WhatsApp: <a href={`https://wa.me/${contact.phone.replace(/[^\d]/g, "")}`}>{contact.phone}</a>
        <br />
        GitHub: <a href="https://github.com/dumbld0re">github.com/dumbld0re</a>
        <br />
        X: <a href={X_URL}>{X_URL.replace("https://", "")}</a>
        <br />
        {t.cv}: <a href="/cv.pdf">cv.pdf</a>
      </p>

      <hr />
      <address>
        Danny-Miguel Mittelberger, {hero.location}
        <br />
        <small>{t.viewed}</small>
      </address>
    </div>
  )
}
