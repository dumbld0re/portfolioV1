import type { Metadata } from "next"

import { LANGUAGES, localizePath, type Language } from "@/lib/i18n"

export const SITE_URL = "https://www.dannymiguel.com"
export const SITE_NAME = "Danny-Miguel Mittelberger"

export const OG_LOCALE: Record<Language, string> = { de: "de_DE", en: "en_US" }

export const siteMeta: Record<
  Language,
  { tagline: string; description: string; cvDescription: string; postsDescription: string }
> = {
  de: {
    tagline: "Entwickler in Windhoek, Namibia",
    description:
      "Entwickler und Student der Quantitative Finance in Windhoek, Namibia — ich baue schnelle, saubere Web-Interfaces, mit einer Schwäche für Linux und das Terminal.",
    cvDescription:
      "Lebenslauf von Danny-Miguel Mittelberger — Webentwickler und Student der Quantitative Finance an der University of Namibia in Windhoek.",
    postsDescription:
      "Notizen und Beiträge von Danny-Miguel Mittelberger — ein digitaler Garten über Webentwicklung, Linux und alles andere.",
  },
  en: {
    tagline: "Developer in Windhoek, Namibia",
    description:
      "Developer and quantitative finance student in Windhoek, Namibia — building fast, clean web interfaces with a soft spot for Linux and the terminal.",
    cvDescription:
      "CV of Danny-Miguel Mittelberger — web developer and quantitative finance student at the University of Namibia, based in Windhoek.",
    postsDescription:
      "Notes and posts by Danny-Miguel Mittelberger — a digital garden on web development, Linux and whatever else.",
  },
}

// Canonical plus hreflang links for a page that exists in every language.
export function languageAlternates(language: Language, path: string): Metadata["alternates"] {
  return {
    canonical: localizePath(language, path),
    languages: {
      ...Object.fromEntries(LANGUAGES.map((lang) => [lang, localizePath(lang, path)])),
      "x-default": path,
    },
  }
}

// schema.org Person for the home page — helps search engines tie the site,
// the name and the linked profiles together.
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  alternateName: "danny-miguel",
  url: SITE_URL,
  jobTitle: "Web Developer",
  description:
    "Developer and quantitative finance student in Windhoek, Namibia — building fast, clean web interfaces.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Windhoek",
    addressCountry: "NA",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Namibia",
  },
  knowsAbout: ["Web development", "Next.js", "React", "TypeScript", "Linux", "Quantitative finance"],
  sameAs: ["https://github.com/dumbld0re"],
}

// Escapes "<" so post titles or summaries can never close the script tag.
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") }
}

const SHARE_IMAGE_ALT = "danny-miguel — developer and quantitative finance student in Windhoek, Namibia"

export const shareImages = {
  openGraph: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: SHARE_IMAGE_ALT }],
  twitter: [{ url: "/twitter-image.png", width: 1200, height: 630, alt: SHARE_IMAGE_ALT }],
}

// Next merges metadata shallowly, so a page that sets its own openGraph drops
// the root's share image and site name. Pages spread this base to keep them.
export function baseOpenGraph(language: Language) {
  return {
    siteName: SITE_NAME,
    locale: OG_LOCALE[language],
    images: shareImages.openGraph,
  }
}
