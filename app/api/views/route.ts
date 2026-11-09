import { createHash } from "node:crypto"
import { NextResponse, type NextRequest } from "next/server"

import { BOT, redis, redisReady } from "@/lib/redis"

// All-time visitor count, kept in Upstash Redis. Each device is counted once:
// the first visit increments the counter and leaves a long-lived cookie, later
// visits from that browser only read the number. Dropping the cookie doesn't
// help either: an address only counts once a day.
//
// The counter only started on 4 November 2026, so it is shown on top of the
// 149 visitors Vercel Analytics had recorded by then (the last 30 days).

const KEY = "views"
const START = 149
const COOKIE = "counted"
const TEN_YEARS = 60 * 60 * 24 * 365 * 10
const ONE_DAY = 60 * 60 * 24

// The address itself is never stored: only a hash that changes daily and
// expires after a day.
function addressKey(request: NextRequest) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const day = new Date().toISOString().slice(0, 10)
  return `seen:${createHash("sha256").update(`${day}:${address}`).digest("hex").slice(0, 32)}`
}

export async function POST(request: NextRequest) {
  if (!redisReady) return NextResponse.json({ views: null }, { status: 503 })

  const seen = request.cookies.has(COOKIE)
  const bot = BOT.test(request.headers.get("user-agent") ?? "")

  try {
    const fresh = !seen && !bot && (await redis(["SET", addressKey(request), "1", "NX", "EX", String(ONE_DAY)])) === "OK"
    const views = Number((await redis(fresh ? ["INCR", KEY] : ["GET", KEY])) ?? 0)
    const response = NextResponse.json({ views: START + views }, { headers: { "Cache-Control": "no-store" } })
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
