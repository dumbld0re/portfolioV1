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
      /** The short line under the name, before its changing last word. */
      tagline: string
      /** The tagline's last word: a click moves on to the next. */
      things: readonly string[]
      /** The hero's lines under the tagline. {tokens} are the words that do
       *  something: names on pills, words to play with, links. */
      lines: readonly string[]
      /** "check me out on …" */
      socials: string
      manual: { word: string; answer: string }
      breaks: string
      unam: string
      linux: string
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
      currently: "gerade in namibia, windhoek",
      tagline: "20, ich mache",
      things: ["dinge", "websites", "es möglich", "kaffee"],
      lines: [
        "websites, die schnell laden und keine {manual} brauchen.",
        "gerade in {namibia}, studium an der {unam}, basteln an {linux}, bis es {breaks}.",
      ],
      socials: "schau vorbei auf {pinterest}, {x} und {instagram}.",
      manual: { word: "anleitung", answer: "gibt's keine. genau darum geht's." },
      breaks: "kaputtgeht",
      unam: "unam",
      linux: "linux",
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
      currently: "currently in namibia, windhoek",
      tagline: "20, i make",
      things: ["things", "websites", "it work", "coffee"],
      lines: [
        "websites that load fast and need no {manual}.",
        "currently in {namibia}, studying at {unam}, tinkering with {linux} until it {breaks}.",
      ],
      socials: "check me out on {pinterest}, {x} and {instagram}.",
      manual: { word: "manual", answer: "there isn't one. that's the point." },
      breaks: "breaks",
      unam: "unam",
      linux: "linux",
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
      currently: "al momento in namibia, windhoek",
      tagline: "20, faccio",
      things: ["cose", "siti web", "funzionare tutto", "il caffè"],
      lines: [
        "siti web che si caricano in fretta e non hanno bisogno di {manual}.",
        "al momento in {namibia}, studio alla {unam}, smanetto con {linux} finché non si {breaks}.",
      ],
      socials: "trovami su {pinterest}, {x} e {instagram}.",
      manual: { word: "istruzioni", answer: "non ce ne sono. è proprio questo il punto." },
      breaks: "rompe",
      unam: "unam",
      linux: "linux",
      namibia: { word: "namibia", place: "windhoek, namibia", coords: "22.56° s 17.08° e" },
    },
  },
}
