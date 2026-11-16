// The site's small counters (visitors, "dont click here") live in Upstash
// Redis, reached over its REST API. Server only.

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

// Local dev counts in memory, so testing never touches the live numbers.
const devStore = process.env.NODE_ENV === "development"
const dev = new Map<string, number>()
const devHashes = new Map<string, Map<string, number>>()

/** False when the store isn't configured; routes answer 503 and the UI hides the number. */
export const redisReady = devStore || Boolean(url && token)

/** Crawlers, link previews and scripts: they read counters, they never move them. */
export const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget/i

type Result = string | number | null | (string | number)[]

/** Runs one command (INCR, GET, SET … NX EX …, HINCRBY, HGETALL) and returns its raw result. */
export async function redis(command: string[]): Promise<Result> {
  if (devStore) {
    const [name, key] = command
    if (name === "HINCRBY" || name === "HGETALL") {
      const hash = devHashes.get(key) ?? new Map<string, number>()
      devHashes.set(key, hash)
      if (name === "HGETALL") return [...hash].flat()
      hash.set(command[2], (hash.get(command[2]) ?? 0) + Number(command[3]))
      return hash.get(command[2])!
    }
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
  const { result } = (await res.json()) as { result: Result }
  return result
}
