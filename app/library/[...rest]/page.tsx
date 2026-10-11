import { notFound } from "next/navigation"

// Unknown library URLs land here so they render app/library/not-found.tsx
// inside the library layout instead of Next's bare default 404.
export default function CatchAll() {
  notFound()
}
