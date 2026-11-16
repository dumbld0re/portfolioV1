import { SITE_URL } from "@/lib/seo"

// The reading library lives at dannymiguel.com/read (app/read). It used to be
// read.dannymiguel.com; proxy.ts sends that host's old links here. Kept free
// of Node APIs so proxy.ts can import it.
export const LIBRARY_PATH = "/read"
export const LIBRARY_URL = `${SITE_URL}${LIBRARY_PATH}`

export function isOldLibraryHost(host: string) {
  return host.startsWith("read.")
}
