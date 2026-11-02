import type { Language } from "@/lib/i18n"

/** A sentence that mixes plain text and links: strings stay text, objects become links. */
export type RichText = (string | { label: string; href?: string })[]

export const homeContent: Record<
  Language,
  {
    hero: {
      name: string
      subtitle: string
      intro: string
      now: RichText
      description: string
      location: string
      status: string
      introLabel: string
      cta: string
    }
  }
> = {
  de: {
    hero: {
      name: "danny-miguel mittelberger",
      subtitle: "Entwickler • Linux-Enthusiast",
      intro:
        "Ich baue Websites, die schnell laden, sich gut lesen und keine Anleitung brauchen. Klingt selbstverständlich, ist es aber erstaunlich oft nicht.",
      now: [
        "Gerade baue ich an ",
        { label: "aestudio", href: "https://www.aestudio.site" },
        ", arbeite bei ",
        { label: "Oratores Novi" },
        " und unterrichte Deutsch bei ",
        { label: "Fluent Academy", href: "https://fluentacademy.co/" },
        ".",
      ],
      description:
        "Daneben studiere ich Quantitative Finance an der UNAM und bastle so lange an meinem Linux-Setup, bis irgendwas kaputtgeht.",
      location: "Windhoek, Namibia",
      status: "status: offen für projekte",
      introLabel: "Über mich",
      cta: "Lass uns zusammenarbeiten",
    },
  },
  en: {
    hero: {
      name: "danny-miguel mittelberger",
      subtitle: "Developer • Linux Enthusiast",
      intro:
        "I make websites that load fast, read easily and don't need a manual. Sounds obvious, but you'd be surprised how often it isn't.",
      now: [
        "Right now I'm building ",
        { label: "aestudio", href: "https://www.aestudio.site" },
        ", working at ",
        { label: "Oratores Novi" },
        " and teaching German at ",
        { label: "Fluent Academy", href: "https://fluentacademy.co/" },
        ".",
      ],
      description:
        "On the side I study quantitative finance at UNAM and tinker with my Linux setup until something breaks.",
      location: "Windhoek, Namibia",
      status: "status: open to work",
      introLabel: "Introduction",
      cta: "Let's work together",
    },
  },
}
