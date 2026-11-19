import type { Language } from "@/lib/i18n"

// The home page (components/explore/): one sentence about me whose pills
// are the way in. Each section is a place you click into: a title, one line,
// a list.

export type SectionId = "about" | "posts" | "projects" | "reading" | "elsewhere"

type SectionCopy = { title: string; line?: string }

export const exploreContent: Record<
  Language,
  {
    sections: Record<SectionId, SectionCopy>
    /** The paragraph whose pills are the menu. {tokens} are section ids, plus
     *  {namibia} (the word with the map), {things} (the word that changes)
     *  and {hi}. */
    sentence: string
    /** The label each section's pill carries in that sentence. */
    sentenceWords: Record<SectionId, string>
    /** {hi}: the way to write to me, the sentence's one filled button. */
    hi: string
    /** The note pointing at the language switch, top right. */
    languageNote: string
    back: string
    close: string
    readIt: string
    fullCase: string
    fullLibrary: string
    allPosts: string
    allProjects: string
    noNotes: string
    minutes: string
    cv: string
    things: string
    status: Record<"read" | "reading" | "queued", string>
    /** The bookshelf's line while it's being built (lib/features.ts). */
    bookshelfSoon: string
    /** The heading over the projects place's second list. */
    tools: string
    /** The heading over the third list, after the internal tools. */
    fun: string
    /** The label on a tool's install line. */
    install: string
    copy: string
    copied: string
  }
> = {
  en: {
    sections: {
      about: { title: "about me" },
      posts: { title: "posts", line: "thoughts, notes and the odd rant, written whenever i can't sleep." },
      projects: { title: "projects", line: "small tools and sites i've built, mostly because i needed them." },
      reading: { title: "bookshelf", line: "essays, papers and books worth an evening. what i thought of them, too." },
      elsewhere: { title: "elsewhere" },
    },
    sentence:
      "20, in {namibia}, making {things}. read my {posts}, poke at my {projects}, borrow from my {reading}, find me {elsewhere}, get to know {about}, or just {hi}.",
    sentenceWords: { about: "me", posts: "posts", projects: "projects", reading: "bookshelf", elsewhere: "elsewhere" },
    hi: "say hi",
    languageNote: "change the language",
    back: "back",
    close: "close",
    readIt: "read it",
    fullCase: "the whole project",
    fullLibrary: "the whole library",
    allPosts: "all posts",
    allProjects: "all projects",
    noNotes: "no notes on this one yet.",
    minutes: "min",
    cv: "cv (pdf)",
    things: "things i like",
    status: { read: "read", reading: "reading now", queued: "next up" },
    bookshelfSoon: "currently working on it.",
    tools: "internal tools",
    fun: "random cool things (mostly ui/ux)",
    install: "install",
    copy: "copy",
    copied: "copied",
  },
  de: {
    sections: {
      about: { title: "über mich" },
      posts: { title: "beiträge", line: "gedanken, notizen und ab und zu ein wutanfall, geschrieben, wenn ich nicht schlafen kann." },
      projects: { title: "projekte", line: "kleine tools und websites, meistens gebaut, weil ich sie selbst brauchte." },
      reading: { title: "bücherregal", line: "essays, paper und bücher, die einen abend wert sind. und was ich davon halte." },
      elsewhere: { title: "anderswo" },
    },
    sentence:
      "20, in {namibia}, ich mache {things}. lies meine {posts}, stöber in meinen {projects}, bedien dich an meinem {reading}, find mich {elsewhere}, lern {about} kennen oder {hi}.",
    sentenceWords: { about: "mich", posts: "beiträge", projects: "projekten", reading: "bücherregal", elsewhere: "anderswo" },
    hi: "sag einfach hallo",
    languageNote: "sprache ändern",
    back: "zurück",
    close: "schließen",
    readIt: "lesen",
    fullCase: "das ganze projekt",
    fullLibrary: "die ganze bibliothek",
    allPosts: "alle beiträge",
    allProjects: "alle projekte",
    noNotes: "dazu noch keine notizen.",
    minutes: "min",
    cv: "lebenslauf (pdf)",
    things: "dinge, die ich mag",
    status: { read: "gelesen", reading: "lese ich gerade", queued: "als nächstes" },
    bookshelfSoon: "gerade in arbeit.",
    tools: "interne tools",
    fun: "zufällige coole sachen (meist ui/ux)",
    install: "installieren",
    copy: "kopieren",
    copied: "kopiert",
  },
  it: {
    sections: {
      about: { title: "su di me" },
      posts: { title: "articoli", line: "pensieri, appunti e qualche sfogo, scritti quando non riesco a dormire." },
      projects: { title: "progetti", line: "piccoli strumenti e siti che ho costruito, quasi sempre perché mi servivano." },
      reading: { title: "libreria", line: "saggi, paper e libri che valgono una serata. e cosa ne penso." },
      elsewhere: { title: "altrove" },
    },
    sentence:
      "20 anni, in {namibia}, faccio {things}. leggi i miei {posts}, curiosa tra i miei {projects}, prendi in prestito dalla mia {reading}, trovami {elsewhere}, {about} o semplicemente {hi}.",
    sentenceWords: { about: "conoscimi", posts: "articoli", projects: "progetti", reading: "libreria", elsewhere: "altrove" },
    hi: "saluta",
    languageNote: "cambia lingua",
    back: "indietro",
    close: "chiudi",
    readIt: "leggilo",
    fullCase: "il progetto intero",
    fullLibrary: "la biblioteca intera",
    allPosts: "tutti gli articoli",
    allProjects: "tutti i progetti",
    noNotes: "ancora nessuna nota su questo.",
    minutes: "min",
    cv: "cv (pdf)",
    things: "cose che mi piacciono",
    status: { read: "letto", reading: "sto leggendo", queued: "il prossimo" },
    bookshelfSoon: "ci sto ancora lavorando.",
    tools: "strumenti interni",
    fun: "cose belle a caso (soprattutto ui/ux)",
    install: "installa",
    copy: "copia",
    copied: "copiato",
  },
}
