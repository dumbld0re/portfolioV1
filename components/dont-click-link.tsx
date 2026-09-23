"use client"

import Link from "next/link"
import type { MouseEvent, ReactNode } from "react"

import { elementCenter, useCircleNavigate } from "@/components/circle-transition"
import { useLanguage } from "@/components/language-provider"

export function DontClickLink({ className, children }: { className?: string; children: ReactNode }) {
  const href = useLanguage().localize("/dont-click-here")
  const navigate = useCircleNavigate()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks open a new tab/window as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    // detail === 0 means keyboard activation — grow from the link itself.
    const origin = event.detail === 0 ? elementCenter(event.currentTarget) : { x: event.clientX, y: event.clientY }
    navigate(href, origin, "in")
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
