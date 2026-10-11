import { LIBRARY_URL } from "@/lib/library-host"

export const dynamic = "force-static"

// Served at read.dannymiguel.com/robots.txt via the proxy.ts rewrite; the
// app-level robots.ts only answers for the main site.
export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${LIBRARY_URL}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain" },
  })
}
