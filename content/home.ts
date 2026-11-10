import type { Language } from "@/lib/i18n"

export const homeContent: Record<
  Language,
  {
    hero: {
      name: string
      intro: string
      description: string
      location: string
      /** The small line above the name. */
      currently: string
    }
  }
> = {
  de: {
    hero: {
      name: "danny-miguel mittelberger",
      intro:
        "Ich baue Websites, die schnell laden, sich gut lesen und keine Anleitung brauchen. Klingt selbstverständlich, ist es aber erstaunlich oft nicht.",
      description:
        "Daneben studiere ich Quantitative Finance an der UNAM und bastle so lange an meinem Linux-Setup, bis irgendwas kaputtgeht.",
      location: "Windhoek, Namibia",
      currently: "gerade in namibia, windhoek",
    },
  },
  en: {
    hero: {
      name: "danny-miguel mittelberger",
      intro:
        "I make websites that load fast, read easily and don't need a manual. Sounds obvious, but you'd be surprised how often it isn't.",
      description:
        "On the side I study quantitative finance at UNAM and tinker with my Linux setup until something breaks.",
      location: "Windhoek, Namibia",
      currently: "currently in namibia, windhoek",
    },
  },
}
