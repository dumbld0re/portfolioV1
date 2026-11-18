import type { Language } from "@/lib/i18n"

export const homeContent: Record<
  Language,
  {
    hero: {
      name: string
      intro: string
      description: string
      location: string
      /** "things" in the sentence: a click moves on to the next. */
      things: readonly string[]
      namibia: { word: string; place: string; coords: string }
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
      things: ["dinge", "websites", "es möglich", "kaffee"],
      namibia: { word: "namibia", place: "windhoek, namibia", coords: "22.56° s 17.08° o" },
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
      things: ["things", "websites", "it work", "coffee"],
      namibia: { word: "namibia", place: "windhoek, namibia", coords: "22.56° s 17.08° e" },
    },
  },
  it: {
    hero: {
      name: "danny-miguel mittelberger",
      intro:
        "Faccio siti web che si caricano in fretta, si leggono bene e non hanno bisogno di istruzioni. Sembra ovvio, ma ti stupiresti di quanto spesso non lo sia.",
      description:
        "Nel frattempo studio finanza quantitativa alla UNAM e smanetto con il mio setup Linux finché qualcosa non si rompe.",
      location: "Windhoek, Namibia",
      things: ["cose", "siti web", "funzionare tutto", "il caffè"],
      namibia: { word: "namibia", place: "windhoek, namibia", coords: "22.56° s 17.08° e" },
    },
  },
}
