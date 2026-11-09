import { NextResponse, type NextRequest } from "next/server"

import { BOT, redis, redisReady } from "@/lib/redis"

// How many times anyone has clicked "dont click here". Every visit to the
// page counts, repeat offenders included: that's the joke.
const KEY = "dont-click"

export async function POST(request: NextRequest) {
  if (!redisReady) return NextResponse.json({ clicks: null }, { status: 503 })

  const bot = BOT.test(request.headers.get("user-agent") ?? "")

  try {
    const clicks = Number((await redis(bot ? ["GET", KEY] : ["INCR", KEY])) ?? 0)
    return NextResponse.json({ clicks }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ clicks: null }, { status: 502 })
  }
}
