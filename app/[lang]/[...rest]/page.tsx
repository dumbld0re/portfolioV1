import { notFound } from "next/navigation"

// The root layout lives in app/[lang], so there is no app-level not-found
// boundary. Unknown URLs land here and render app/[lang]/not-found.tsx inside
// the site layout instead of Next's bare default 404.
export default function CatchAll() {
  notFound()
}
