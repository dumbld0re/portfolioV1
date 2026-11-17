"use client"

import { ViewTransition, type ReactNode } from "react"

// A project's title by name: the same name on the projects list, the case
// study's heading and its "next project" line, so navigating between them
// morphs one into the other (React's <ViewTransition> on the browser's View
// Transitions API, which animates GPU snapshots). default="none" keeps it
// still during unrelated transitions.
export function ProjectMorph({ slug, children }: { slug?: string; children: ReactNode }) {
  if (!slug) return <>{children}</>
  return (
    <ViewTransition name={`project-title-${slug}`} share="project-morph" default="none">
      {children}
    </ViewTransition>
  )
}
