import type { Language } from "@/lib/i18n"

export const eggsContent: Record<
  Language,
  {
    /** Words that, typed anywhere on the page, trigger an egg. */
    words: { hello: string[]; gravity: string[] }
    /** What the name spells back after "hello". */
    greeting: string[]
    /** The tab's title while the visitor is away. */
    away: string
    broke: { title: string; note: string }
    /** What the name spells after five theme switches in a row. */
    dizzy: string[]
    /** The footer's count, and the list it opens. */
    secrets: { label: string; unknown: string; again: string; wallpaper: string; names: Record<string, string> }
  }
> = {
  en: {
    words: { hello: ["hello", "hallo"], gravity: ["gravity", "schwerkraft"] },
    greeting: ["hello", "you."],
    away: "● ● ● come back",
    broke: { title: "you broke it.", note: "putting it back together" },
    dizzy: ["make up", "your mind"],
    secrets: {
      label: "secrets",
      unknown: "???",
      again: "forget them",
      wallpaper: "get the wallpaper",
      names: {
        hello: "said hello",
        gravity: "turned on gravity",
        konami: "the old cheat code",
        comeback: "left and came back",
        word: "made it spell a word",
        doze: "let it doze off",
        dizzy: "made it dizzy",
        things: "saw every thing",
        manual: "asked for the manual",
        breaks: "broke it",
        "2086": "went to 2086",
      },
    },
  },
  de: {
    words: { hello: ["hallo", "hello"], gravity: ["schwerkraft", "gravity"] },
    greeting: ["hallo", "du."],
    away: "● ● ● komm zurück",
    broke: { title: "kaputt gemacht.", note: "wird wieder zusammengesetzt" },
    dizzy: ["entscheid", "dich mal"],
    secrets: {
      label: "geheimnisse",
      unknown: "???",
      again: "vergessen",
      wallpaper: "hintergrundbild holen",
      names: {
        hello: "hallo gesagt",
        gravity: "schwerkraft an",
        konami: "der alte cheat-code",
        comeback: "weg und wieder da",
        word: "ein wort buchstabieren lassen",
        doze: "einschlafen lassen",
        dizzy: "schwindlig gemacht",
        things: "alle dinge gesehen",
        manual: "nach der anleitung gefragt",
        breaks: "kaputtgemacht",
        "2086": "nach 2086 gereist",
      },
    },
  },
  it: {
    words: { hello: ["ciao", "hello"], gravity: ["gravità", "gravita", "gravity"] },
    greeting: ["ciao", "a te."],
    away: "● ● ● torna qui",
    broke: { title: "l'hai rotto.", note: "lo sto rimettendo insieme" },
    dizzy: ["deciditi", "su, dai"],
    secrets: {
      label: "segreti",
      unknown: "???",
      again: "dimenticali",
      wallpaper: "scarica lo sfondo",
      names: {
        hello: "hai detto ciao",
        gravity: "hai acceso la gravità",
        konami: "il vecchio trucco",
        comeback: "via e di nuovo qui",
        word: "gli hai fatto scrivere una parola",
        doze: "l'hai lasciato appisolare",
        dizzy: "gli hai fatto girare la testa",
        things: "hai visto ogni cosa",
        manual: "hai chiesto le istruzioni",
        breaks: "l'hai rotto",
        "2086": "un salto nel 2086",
      },
    },
  },
}
