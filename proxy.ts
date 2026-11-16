import { NextResponse, type NextRequest } from "next/server"

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage, localizePath, stripLanguage, type Language } from "@/lib/i18n"
import { LIBRARY_PATH, LIBRARY_URL, isOldLibraryHost } from "@/lib/library-host"

const ROOT_DOMAIN = "dannymiguel.com"

// Pages live under app/[lang]. English is served from the unprefixed URLs via
// an internal rewrite to /en; German lives at /de. First-time visitors whose
// browser prefers German are sent to /de, and the language toggle's cookie
// keeps each visitor on the language they last picked.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = request.headers.get("host") ?? ""

  // The library used to live on read.dannymiguel.com (read.localhost in
  // dev): its old links go to the shelf on the main site. Filters and an open
  // piece live in the query and hash, so they carry over.
  if (isOldLibraryHost(host)) {
    const url = new URL(`${LIBRARY_PATH}${search}`, request.url)
    if (host.endsWith(ROOT_DOMAIN)) return NextResponse.redirect(`${LIBRARY_URL}${search}`, 308)
    url.host = host.replace(/^read\./, "")
    return NextResponse.redirect(url, 308)
  }

  // The library (app/read) has its own root layout and no language prefix.
  if (pathname === LIBRARY_PATH || pathname.startsWith(`${LIBRARY_PATH}/`)) return NextResponse.next()

  // The metadata routes need no language rewriting.
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return NextResponse.next()

  const [, first] = pathname.split("/")

  // /en/... is only an internal path — send it to the canonical unprefixed URL.
  if (first === DEFAULT_LANGUAGE) {
    return NextResponse.redirect(new URL(stripLanguage(pathname) + search, request.url), 308)
  }

  if (isLanguage(first)) return NextResponse.next()

  const preferred = preferredLanguage(request)
  if (preferred !== DEFAULT_LANGUAGE) {
    return NextResponse.redirect(new URL(localizePath(preferred, pathname) + search, request.url), 307)
  }

  return NextResponse.rewrite(new URL(`/${DEFAULT_LANGUAGE}${pathname === "/" ? "" : pathname}${search}`, request.url))
}

// Who gets what on a first visit (a language picked before, kept in the
// cookie, always wins): a phone or browser set to German or Italian gets that
// language; otherwise someone in Germany gets German and someone in Italy
// gets Italian; everyone else gets English.
const COUNTRY_LANGUAGE: Record<string, Language> = { DE: "de", IT: "it" }

function preferredLanguage(request: NextRequest): Language {
  // "lang" is the cookie name the site used before lang_pref.
  const cookie = request.cookies.get(LANGUAGE_COOKIE)?.value ?? request.cookies.get("lang")?.value
  if (isLanguage(cookie)) return cookie

  const primary = request.headers.get("accept-language")?.split(",")[0]?.trim().slice(0, 2).toLowerCase()
  if (isLanguage(primary) && primary !== DEFAULT_LANGUAGE) return primary

  // Set by Vercel from the visitor's IP; absent locally.
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase()
  return (country && COUNTRY_LANGUAGE[country]) || DEFAULT_LANGUAGE
}

export const config = {
  // Skip API routes, Next internals and anything with a file extension (public assets like
  // cv.pdf, icons and the share images) — except the metadata routes, so the
  // old library host's /robots.txt and /sitemap.xml redirect too.
  matcher: ["/((?!api/|_next/|_vercel/|.*\\.[^/]+$).*)", "/robots.txt", "/sitemap.xml"],
}
