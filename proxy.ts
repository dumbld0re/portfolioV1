import { NextResponse, type NextRequest } from "next/server"

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage, localizePath, stripLanguage } from "@/lib/i18n"
import { LIBRARY_PATH, ROOT_DOMAIN, isLibraryHost, libraryHost } from "@/lib/library-host"

// Pages live under app/[lang]. English is served from the unprefixed URLs via
// an internal rewrite to /en; German lives at /de. First-time visitors whose
// browser prefers German are sent to /de, and the language toggle's cookie
// keeps each visitor on the language they last picked.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = request.headers.get("host") ?? ""

  if (isLibraryHost(host)) return libraryProxy(request)

  // The library lives on its own subdomain; its internal path only serves
  // directly on hosts without one (localhost, preview deployments).
  if (pathname === LIBRARY_PATH || pathname.startsWith(`${LIBRARY_PATH}/`)) {
    if (!host.endsWith(ROOT_DOMAIN)) return NextResponse.next()
    const url = new URL(pathname.slice(LIBRARY_PATH.length) || "/", request.url)
    url.host = libraryHost(host)
    url.search = search
    return NextResponse.redirect(url, 308)
  }

  // Matched only so the library host can claim them; the main site's own
  // metadata routes need no rewriting.
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

// read.dannymiguel.com (and read.localhost in dev) serves app/library from its
// root: "/" -> "/library", "/robots.txt" -> "/library/robots.txt". The library
// is English-only, so none of the language handling below applies.
function libraryProxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Keep a single URL per page: drop the internal prefix if someone types it.
  if (pathname === LIBRARY_PATH || pathname.startsWith(`${LIBRARY_PATH}/`)) {
    return NextResponse.redirect(new URL((pathname.slice(LIBRARY_PATH.length) || "/") + search, request.url), 308)
  }

  return NextResponse.rewrite(new URL(`${LIBRARY_PATH}${pathname === "/" ? "" : pathname}${search}`, request.url))
}

function preferredLanguage(request: NextRequest) {
  // "lang" is the cookie name the site used before lang_pref.
  const cookie = request.cookies.get(LANGUAGE_COOKIE)?.value ?? request.cookies.get("lang")?.value
  if (isLanguage(cookie)) return cookie

  const primary = request.headers.get("accept-language")?.split(",")[0]?.trim().slice(0, 2).toLowerCase()
  return isLanguage(primary) ? primary : DEFAULT_LANGUAGE
}

export const config = {
  // Skip Next internals and anything with a file extension (public assets like
  // cv.pdf, icons and the share images) — except the metadata routes, which the
  // library host rewrites to its own.
  matcher: ["/((?!_next/|_vercel/|.*\\.[^/]+$).*)", "/robots.txt", "/sitemap.xml"],
}
