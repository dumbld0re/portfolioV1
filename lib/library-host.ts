// Host routing for the reading library (read.dannymiguel.com). Kept free of
// Node APIs so proxy.ts can import it.
export const ROOT_DOMAIN = "dannymiguel.com"
export const LIBRARY_SUBDOMAIN = "read"
export const LIBRARY_PATH = "/library"
export const LIBRARY_URL = `https://${LIBRARY_SUBDOMAIN}.${ROOT_DOMAIN}`

export function isLibraryHost(host: string) {
  return host.startsWith(`${LIBRARY_SUBDOMAIN}.`)
}

// "www.dannymiguel.com" -> "read.dannymiguel.com", "dannymiguel.com" likewise.
export function libraryHost(host: string) {
  return `${LIBRARY_SUBDOMAIN}.${host.replace(/^www\./, "")}`
}
