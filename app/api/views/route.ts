import { NextResponse, type NextRequest } from "next/server"

// All-time visitor count, kept in Upstash Redis. Each device is counted once:
// the first visit increments the counter and leaves a long-lived cookie, later
// visits from that browser only read the number.

const KEY = "views"
const COOKIE = "counted"
const TEN_YEARS = 60 * 60 * 24 * 365 * 10
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget/i

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

// Local dev without a database: count in memory so the footer still shows.
const devStore = process.env.NODE_ENV === "development" && (!url || !token)
let devViews = 0

async function redis(command: string[]): Promise<number> {
  if (devStore) return command[0] === "INCR" ? ++devViews : devViews
  const res = await fetch(url!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`redis ${res.status}`)
  const { result } = (await res.json()) as { result: string | number | null }
  return Number(result ?? 0)
}

export async function POST(request: NextRequest) {
  if (!devStore && (!url || !token)) return NextResponse.json({ views: null }, { status: 503 })

  const seen = request.cookies.has(COOKIE)
  const bot = BOT.test(request.headers.get("user-agent") ?? "")

  try {
    const views = await redis(seen || bot ? ["GET", KEY] : ["INCR", KEY])
    const response = NextResponse.json({ views }, { headers: { "Cache-Control": "no-store" } })
    if (!seen && !bot) {
      response.cookies.set(COOKIE, "1", {
        maxAge: TEN_YEARS,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
    }
    return response
  } catch {
    return NextResponse.json({ views: null }, { status: 502 })
  }
}
