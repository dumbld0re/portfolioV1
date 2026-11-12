import type { Metadata } from "next"

import { LANGUAGES, localizePath, type Language } from "@/lib/i18n"

export const SITE_URL = "https://www.dannymiguel.com"
export const SITE_NAME = "Danny-Miguel Mittelberger"

export const OG_LOCALE: Record<Language, string> = { de: "de_DE", en: "en_US" }

export const siteMeta: Record<
  Language,
  { description: string; postsDescription: string; projectsDescription: string }
> = {
  de: {
    description:
      "Entwickler und Student der Quantitative Finance in Windhoek, Namibia — ich baue schnelle, saubere Web-Interfaces, mit einer Schwäche für Linux und das Terminal.",
    postsDescription:
      "Notizen und Beiträge von Danny-Miguel Mittelberger — ein digitaler Garten über Webentwicklung, Linux und alles andere.",
    projectsDescription: "Ausgewählte Projekte von Danny-Miguel Mittelberger. Die Seite wird gerade überarbeitet.",
  },
  en: {
    description:
      "Developer and quantitative finance student in Windhoek, Namibia — building fast, clean web interfaces with a soft spot for Linux and the terminal.",
    postsDescription:
      "Notes and posts by Danny-Miguel Mittelberger — a digital garden on web development, Linux and whatever else.",
    projectsDescription: "Selected work by Danny-Miguel Mittelberger. This page is being reworked.",
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

const SHARE_IMAGE_ALT =
  "danny-miguel mittelberger, written in dots, above the site's triangle cursor mark."

// Bump the version when the card changes: X, iMessage and friends cache share
// images by URL, so a new query string makes them fetch the new one.
// The cards are captured from the live dot name on the dev-only /share-card
// page (see app/[lang]/share-card/page.tsx); the still is 2x so its dots stay round.
const SHARE_IMAGE_VERSION = 4

export const shareImages = {
  openGraph: [
    { url: `/opengraph-image.png?v=${SHARE_IMAGE_VERSION}`, width: 2400, height: 1260, alt: SHARE_IMAGE_ALT },
  ],
  twitter: [{ url: `/twitter-image.png?v=${SHARE_IMAGE_VERSION}`, width: 2400, height: 1260, alt: SHARE_IMAGE_ALT }],
}

// A cursor playing with the name's dots, for the apps that play og:video
// (Discord, Telegram and others); the rest show the still.
export const shareVideos = [
  { url: `${SITE_URL}/share-card.mp4?v=${SHARE_IMAGE_VERSION}`, width: 1920, height: 1080, type: "video/mp4" },
]

// Next merges metadata shallowly, so a page that sets its own openGraph drops
// the root's share image and site name. Pages spread this base to keep them.
export function baseOpenGraph(language: Language) {
  return {
    siteName: SITE_NAME,
    locale: OG_LOCALE[language],
    images: shareImages.openGraph,
    videos: shareVideos,
  }
}
