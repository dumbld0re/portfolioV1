import type { Language } from "@/lib/i18n"

// /things: things i like, each a cut-out photo and its name, nothing else.
// Demo set for now: public-domain product photos by Evan-Amos (Wikimedia
// Commons), cut out to transparent webp in public/things.

export type ThingKind = "play" | "listen" | "carry"

export interface Thing {
  id: string
  name: string
  kind: ThingKind
  image: string
  /** How much of its tile the object fills (0–1), so a phone and a console
   *  read at a believable size next to each other. */
  fill?: number
}

export const things: Thing[] = [
  { id: "game-boy", name: "Nintendo Game Boy", kind: "play", image: "/things/game-boy.webp", fill: 0.72 },
  { id: "ipod", name: "iPod Classic 6th gen", kind: "listen", image: "/things/ipod-classic.webp", fill: 0.74 },
  { id: "alpha", name: "Sony Alpha A700", kind: "carry", image: "/things/alpha-a700.webp", fill: 0.8 },
  { id: "gba", name: "Game Boy Advance Indigo", kind: "play", image: "/things/game-boy-advance-purple.webp", fill: 0.82 },
  { id: "walkman", name: "Sony Walkman WM-FX421", kind: "listen", image: "/things/sony-walkman.webp", fill: 0.72 },
  { id: "nokia", name: "Nokia 5125", kind: "carry", image: "/things/nokia-5125-cobalt.webp", fill: 0.8 },
  { id: "dualshock", name: "PlayStation DualShock", kind: "play", image: "/things/psx-dualshock-controller.webp", fill: 0.84 },
  { id: "mdr", name: "Sony MDR-CD580", kind: "listen", image: "/things/sony-mdr-cd580-v2.webp", fill: 0.84 },
  { id: "ds-lite", name: "Nintendo DS Lite", kind: "play", image: "/things/ds-lite.webp", fill: 0.82 },
  { id: "ps2", name: "PlayStation 2 Slim", kind: "play", image: "/things/playstation-2.webp", fill: 0.9 },
]

export const thingsContent: Record<
  Language,
  { tagline: string; all: string; kinds: Record<ThingKind, string>; zoomOut: string; zoomIn: string; reset: string }
> = {
  de: {
    tagline: "dinge, die ich mag.",
    all: "alle",
    kinds: { play: "spielen", listen: "hören", carry: "dabei" },
    zoomOut: "kleiner",
    zoomIn: "größer",
    reset: "zurück",
  },
  en: {
    tagline: "things i like.",
    all: "all",
    kinds: { play: "play", listen: "listen", carry: "carry" },
    zoomOut: "smaller",
    zoomIn: "bigger",
    reset: "reset",
  },
  it: {
    tagline: "cose che mi piacciono.",
    all: "tutto",
    kinds: { play: "giocare", listen: "ascoltare", carry: "con me" },
    zoomOut: "più piccolo",
    zoomIn: "più grande",
    reset: "reset",
  },
}
