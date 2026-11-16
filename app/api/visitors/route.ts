import { NextResponse, type NextRequest } from "next/server"

import { redis, redisReady } from "@/lib/redis"
import { COUNTRIES_KEY, SEED } from "@/lib/visitors"

// Visitors per country for the globe: the analytics baseline plus every
// visitor counted since (app/api/views adds them).
export async function GET(request: NextRequest) {
  const countries: Record<string, number> = { ...SEED }
  if (redisReady) {
    try {
      const flat = (await redis(["HGETALL", COUNTRIES_KEY])) ?? []
      if (Array.isArray(flat)) {
        for (let i = 0; i < flat.length; i += 2) {
          const code = String(flat[i])
          countries[code] = (countries[code] ?? 0) + Number(flat[i + 1])
        }
      }
    } catch {
      // The baseline alone still draws a globe.
    }
  }
  // The asker's own country, for the "you" marker. Never stored.
  const country = request.headers.get("x-vercel-ip-country")
  const you = country && /^[A-Z]{2}$/.test(country) ? country : null
  return NextResponse.json({ countries, you }, { headers: { "Cache-Control": "private, no-store" } })
}
