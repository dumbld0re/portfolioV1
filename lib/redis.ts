// The site's small counters (visitors, "dont click here") live in Upstash
// Redis, reached over its REST API. Server only.

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

// Local dev counts in memory, so testing never touches the live numbers.
const devStore = process.env.NODE_ENV === "development"
const dev = new Map<string, number>()

/** False when the store isn't configured; routes answer 503 and the UI hides the number. */
export const redisReady = devStore || Boolean(url && token)

/** Crawlers, link previews and scripts: they read counters, they never move them. */
export const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget/i

/** Runs one command (INCR, GET, SET … NX EX …) and returns its raw result. */
export async function redis(command: string[]): Promise<string | number | null> {
  if (devStore) {
    const [name, key] = command
    if (name === "INCR") dev.set(key, (dev.get(key) ?? 0) + 1)
    if (name === "SET") {
      if (command.includes("NX") && dev.has(key)) return null
      dev.set(key, 1)
      return "OK"
    }
    return dev.get(key) ?? 0
  }
  const res = await fetch(url!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`redis ${res.status}`)
  const { result } = (await res.json()) as { result: string | number | null }
  return result
}
