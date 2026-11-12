import type { Language } from "@/lib/i18n"

export type TimelineEntry = {
  title: string
  /** Shown after the title as "title @ org", linked when orgHref is set. */
  org?: string
  orgHref?: string
  note?: string
}

export type TimelinePhoto = {
  src: string
  caption: string
}

export type TimelineYear = {
  year: number
  /** One line that sums the year up. */
  summary: string
  /** A short look back, shown under the photos in the pinned panel. */
  reflection: string
  /** Up to three photos; the first one is shown biggest. */
  photos: TimelinePhoto[]
  entries: TimelineEntry[]
}

// Placeholder data (and placeholder photos), only here to preview how the page works.
const photo = (seed: string, caption: string, w = 800, h = 600): TimelinePhoto => ({
  src: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  caption,
})

const years: TimelineYear[] = [
  {
    year: 2026,
    summary: "chief vibes officer of a company that does not exist",
    reflection:
      "this was the year i stopped asking whether pizza could survive the vacuum of space and started asking how fast. looking back, i should have asked about the cat sooner.",
    photos: [
      photo("moonpizza", "launch day, moonbase pizza hq"),
      photo("cloudsteve", "this one is steve", 600, 750),
      photo("catstare", "hour seven of the staring contest", 600, 600),
    ],
    entries: [
      { title: "ceo", org: "moonbase pizza", orgHref: "https://example.com", note: "delivered 4 pizzas to the moon. 3 arrived warm." },
      { title: "professional cloud namer", note: "named 12,000 clouds. most of them are called steve." },
      { title: "won a staring contest against a cat", note: "it took 9 hours. the cat wants a rematch." },
    ],
  },
  {
    year: 2025,
    summary: "a mock year, so you can see how the page grows",
    reflection:
      "a year of small, wet victories. the dolphins were patient with me, the spaghetti was not. i learned that most problems look smaller after a nap.",
    photos: [
      photo("leftsocks", "the sock archive, aisle 4"),
      photo("dolphin", "my tutor, flipper", 600, 750),
      photo("spaghetti", "the site, before it went soggy", 600, 600),
    ],
    entries: [
      { title: "intern", org: "the department of left socks", orgHref: "https://example.com", note: "found 2 right socks. was let go." },
      { title: "learned to speak dolphin", note: "fluent in greetings. still working on small talk." },
      { title: "built a website out of spaghetti", note: "very fast. a little soggy." },
      { title: "slept", note: "highly recommend." },
    ],
  },
]

export const timelineContent: Record<Language, { reflection: string; jumpTo: string; years: TimelineYear[] }> = {
  en: { reflection: "looking back", jumpTo: "jump to year", years },
  de: { reflection: "rückblick", jumpTo: "zu jahr springen", years },
  it: { reflection: "guardando indietro", jumpTo: "vai all'anno", years },
}
