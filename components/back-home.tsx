import Link from "next/link"

import { cn } from "@/lib/utils"

/** "← home" at the start of the top bar, in the bar's own type, on a dotted
 *  line: the way back from the posts and the reading shelf. `href` is the
 *  (localized) home URL. The dotted line is a border, so it runs unbroken
 *  under both the arrow and the word. With `compact`, phones see just the arrow. */
export function BackHome({
  href = "/",
  label = "home",
  compact = false,
  className,
}: {
  href?: string
  label?: string
  compact?: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      aria-label={compact ? label : undefined}
      className={cn(
        "group inline-flex shrink-0 items-baseline gap-2 border-b border-dotted border-muted-foreground/60 pb-1 lowercase text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
        ←
      </span>
      <span className={cn(compact && "hidden md:inline")}>{label}</span>
    </Link>
  )
}
