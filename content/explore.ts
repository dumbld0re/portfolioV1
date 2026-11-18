import type { Language } from "@/lib/i18n"

// The home page (components/explore/): one sentence about me whose pills
// are the way in. Each section is a place you click into: a title, one line,
// a list.

export type SectionId = "about" | "posts" | "projects" | "reading" | "elsewhere"

type SectionCopy = { title: string; line: string }

export const exploreContent: Record<
  Language,
  {
    sections: Record<SectionId, SectionCopy>
    /** The paragraph whose pills are the menu. {tokens} are section ids, plus
     *  {namibia} (the word with the map) and {things} (the word that changes). */
    sentence: string
    /** The label each section's pill carries in that sentence. */
    sentenceWords: Record<SectionId, string>
    back: string
    close: string
    readIt: string
    fullCase: string
    fullLibrary: string
    noNotes: string
    minutes: string
    cv: string
    things: string
    status: Record<"read" | "reading" | "queued", string>
  }
> = {
  en: {
    sections: {
      about: { title: "about me", line: "i'm 20, i study quantitative finance at unam, and i make websites that load fast and need no manual." },
      posts: { title: "posts", line: "thoughts, notes and the odd rant, written whenever i can't sleep." },
      projects: { title: "projects", line: "small tools and sites i've built, mostly because i needed them." },
      reading: { title: "reading", line: "essays, papers and books worth an evening. what i thought of them, too." },
      elsewhere: { title: "elsewhere", line: "where else i put things. none of them as often as i should." },
    },
    sentence:
      "20, in {namibia}, making {things}. read my {posts}, poke at my {projects}, borrow from my {reading}, find me {elsewhere}, or just get to know {about}.",
    sentenceWords: { about: "me", posts: "posts", projects: "projects", reading: "bookshelf", elsewhere: "elsewhere" },
    back: "back",
    close: "close",
    readIt: "read it",
    fullCase: "the whole project",
    fullLibrary: "the whole library",
    noNotes: "no notes on this one yet.",
    minutes: "min",
    cv: "cv (pdf)",
    things: "things i like",
    status: { read: "read", reading: "reading now", queued: "next up" },
  },
  de: {
    sections: {
      about: { title: "über mich", line: "ich bin 20, studiere quantitative finance an der unam und baue websites, die schnell laden und keine anleitung brauchen." },
      posts: { title: "beiträge", line: "gedanken, notizen und ab und zu ein wutanfall, geschrieben, wenn ich nicht schlafen kann." },
      projects: { title: "projekte", line: "kleine tools und websites, meistens gebaut, weil ich sie selbst brauchte." },
      reading: { title: "lesen", line: "essays, paper und bücher, die einen abend wert sind. und was ich davon halte." },
      elsewhere: { title: "anderswo", line: "wo ich sonst noch dinge ablege. nirgends so oft, wie ich sollte." },
    },
    sentence:
      "20, in {namibia}, ich mache {things}. lies meine {posts}, stöber in meinen {projects}, bedien dich an meinem {reading}, find mich {elsewhere} oder lern {about} einfach kennen.",
    sentenceWords: { about: "mich", posts: "beiträge", projects: "projekten", reading: "bücherregal", elsewhere: "anderswo" },
    back: "zurück",
    close: "schließen",
    readIt: "lesen",
    fullCase: "das ganze projekt",
    fullLibrary: "die ganze bibliothek",
    noNotes: "dazu noch keine notizen.",
    minutes: "min",
    cv: "lebenslauf (pdf)",
    things: "dinge, die ich mag",
    status: { read: "gelesen", reading: "lese ich gerade", queued: "als nächstes" },
  },
  it: {
    sections: {
      about: { title: "su di me", line: "ho 20 anni, studio finanza quantitativa alla unam e faccio siti web che si caricano in fretta e non hanno bisogno di istruzioni." },
      posts: { title: "articoli", line: "pensieri, appunti e qualche sfogo, scritti quando non riesco a dormire." },
      projects: { title: "progetti", line: "piccoli strumenti e siti che ho costruito, quasi sempre perché mi servivano." },
      reading: { title: "letture", line: "saggi, paper e libri che valgono una serata. e cosa ne penso." },
      elsewhere: { title: "altrove", line: "dove metto altre cose. mai spesso quanto dovrei." },
    },
    sentence:
      "20 anni, in {namibia}, faccio {things}. leggi i miei {posts}, curiosa tra i miei {projects}, prendi in prestito dalla mia {reading}, trovami {elsewhere} o semplicemente {about}.",
    sentenceWords: { about: "conoscimi", posts: "articoli", projects: "progetti", reading: "libreria", elsewhere: "altrove" },
    back: "indietro",
    close: "chiudi",
    readIt: "leggilo",
    fullCase: "il progetto intero",
    fullLibrary: "la biblioteca intera",
    noNotes: "ancora nessuna nota su questo.",
    minutes: "min",
    cv: "cv (pdf)",
    things: "cose che mi piacciono",
    status: { read: "letto", reading: "sto leggendo", queued: "il prossimo" },
  },
}
