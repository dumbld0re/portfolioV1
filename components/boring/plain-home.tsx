"use client"

import { contactContent } from "@/content/contact"
import { experienceContent } from "@/content/experience"
import { homeContent } from "@/content/home"
import { projectsContent } from "@/content/projects"
import { useLanguage } from "@/components/language-provider"
import { formatPeriod, monthStart } from "@/lib/format-date"
import { setBoring } from "@/lib/boring-store"
import { X_URL } from "@/lib/styles"

const copy = {
  en: {
    notice: "Boring mode is on.",
    off: "Make it fun again",
    projects: "Projects",
    builtWith: "Built with",
    demo: "Demo",
    site: "Website",
    source: "Source code",
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
    builtWith: "Gebaut mit",
    demo: "Demo",
    site: "Website",
    source: "Quellcode",
    experience: "Erfahrung",
    when: "Wann",
    role: "Rolle",
    where: "Wo",
    contact: "Kontakt",
    email: "E-Mail",
    cv: "Lebenslauf",
    viewed: "Am besten in Netscape Navigator 3.0 bei 800×600.",
  },
}

// Boring mode, plain: the home page as an HTML document from 1996. Same
// content, no design at all: everything here is reset to the browser's own
// default styles (.plain-doc in globals.css), so the markup is all it has.
export function PlainHome() {
  const { language } = useLanguage()
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
        <i>{hero.location}</i>
      </p>
      <p>{hero.intro}</p>
      <p>
        {hero.now.map((part, i) =>
          typeof part === "string" ? part : part.href ? <a key={i} href={part.href}>{part.label}</a> : part.label,
        )}
      </p>
      <p>{hero.description}</p>

      <hr />
      <h2>{t.projects}</h2>
      <ul>
        {projects.projects.map((project) => (
          <li key={project.title}>
            <p>
              <b>{project.title}</b>
              {project.status && ` (${projects.statusLabels[project.status]})`}
              <br />
              {project.tagline && (
                <>
                  {project.tagline}
                  <br />
                </>
              )}
              {project.description}
              <br />
              <i>
                {t.builtWith}: {project.tech.join(", ")}
              </i>
              {(project.demoHref || project.githubHref) && <br />}
              {project.demoHref && <a href={project.demoHref}>{project.demoKind === "site" ? t.site : t.demo}</a>}
              {project.demoHref && project.githubHref && " | "}
              {project.githubHref && <a href={project.githubHref}>{t.source}</a>}
            </p>
          </li>
        ))}
      </ul>

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
