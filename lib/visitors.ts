// Where the site's visitors come from, for the globe (components/visitor-globe).

/** Redis hash: country code -> visitors counted since the globe went live. */
export const COUNTRIES_KEY = "countries"

/** Unique visitors per country from Vercel Web Analytics, 17 October to
 *  16 November 2026 (the 30 days the hobby plan keeps). The live hash counts
 *  on top of this from 16 November. */
export const SEED: Record<string, number> = {
  NA: 99, NG: 36, US: 27, IN: 16, ZA: 6, DE: 4, ID: 4, PK: 4, PH: 3, IT: 3, FR: 3, GB: 3, HK: 3,
  AO: 2, GH: 2, AE: 2, BR: 2, CA: 2, CN: 2, DZ: 2, NL: 2,
  BW: 1, AR: 1, BD: 1, ET: 1, GR: 1, IE: 1, JO: 1, JP: 1, KE: 1, LK: 1, MY: 1, NP: 1, PL: 1, RO: 1, RS: 1, SE: 1,
}

/** The colour bands, fewest visitors first. Blue for the one-offs, green for
 *  a handful, then the hero pills' warmer colours as a country fills up. */
export const BANDS = [
  { from: 1, label: "1", color: "#4d94ff" },
  { from: 2, label: "2–4", color: "#2ed678" },
  { from: 5, label: "5–19", color: "#ffc61a" },
  { from: 20, label: "20–49", color: "#ff6e46" },
  { from: 50, label: "50+", color: "#a06eff" },
] as const

export function bandOf(count: number) {
  let band = 0
  BANDS.forEach((b, i) => {
    if (count >= b.from) band = i
  })
  return band
}

/** What every counter on the site shows, from one read: the all-time count
 *  (the footer's eye) and where those people came from (the globe).
 *  The count is the total; the countries add up to less, because the
 *  country tally started later (16 Nov) and some visits carry no country.
 *  That gap is `elsewhere`, so the globe's total is always the footer's. */
export type VisitorCounts = {
  views: number
  countries: Record<string, number>
  elsewhere: number
  you: string | null
}

export function countsFrom(views: number, hash: unknown, you: string | null): VisitorCounts {
  const countries: Record<string, number> = { ...SEED }
  if (Array.isArray(hash)) {
    for (let i = 0; i < hash.length; i += 2) {
      const code = String(hash[i])
      countries[code] = (countries[code] ?? 0) + Number(hash[i + 1])
    }
  }
  const placed = Object.values(countries).reduce((a, b) => a + b, 0)
  // Never fewer people than dots on the globe.
  const total = Math.max(views, placed)
  return { views: total, countries, elsewhere: total - placed, you }
}
