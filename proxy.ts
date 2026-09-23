import { NextResponse, type NextRequest } from "next/server"

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage, localizePath, stripLanguage } from "@/lib/i18n"

// Pages live under app/[lang]. English is served from the unprefixed URLs via
// an internal rewrite to /en; German lives at /de. First-time visitors whose
// browser prefers German are sent to /de, and the language toggle's cookie
// keeps each visitor on the language they last picked.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
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

function preferredLanguage(request: NextRequest) {
  // "lang" is the cookie name the site used before lang_pref.
  const cookie = request.cookies.get(LANGUAGE_COOKIE)?.value ?? request.cookies.get("lang")?.value
  if (isLanguage(cookie)) return cookie

  const primary = request.headers.get("accept-language")?.split(",")[0]?.trim().slice(0, 2).toLowerCase()
  return isLanguage(primary) ? primary : DEFAULT_LANGUAGE
}

export const config = {
  // Skip Next internals, the metadata routes and anything with a file extension
  // (public assets like cv.pdf, icons and the share images).
  matcher: ["/((?!_next/|_vercel/|robots.txt|sitemap.xml|.*\\.[^/]+$).*)"],
}
