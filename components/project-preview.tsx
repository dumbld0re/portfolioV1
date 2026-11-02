"use client"

import Image from "next/image"

import type { Project } from "@/content/projects"
import { GlyphImage } from "@/components/glyph-image"

// The sticky panel beside the project list: whichever project is current,
// drawn in dots (or as a terminal session for tools without a UI).
export function ProjectPreview({
  project,
  folder,
  comingSoonLabel,
}: {
  project: Project
  /** "projects" / "projekte", for the ~/<folder>/<slug> path. */
  folder: string
  comingSoonLabel: string
}) {
  const preview = project.preview

  return (
    <figure className="overflow-hidden rounded-md border border-border/70 bg-background/70">
      <figcaption className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-2.5 font-mono text-xs text-muted-foreground">
        <span className="truncate">
          <span className="text-primary">~/{folder}/</span>
          {project.slug ?? "…"}
        </span>
      </figcaption>

      <div className="relative aspect-[4/3]">
        {preview?.kind === "image" && (
          // Keyed so each switch replays: the screenshot resolves out of dots,
          // then the real capture fades in over them at full resolution.
          <div key={preview.src} className="absolute inset-4">
            <GlyphImage src={preview.src} alt="" className="absolute inset-0" />
            <Image
              src={preview.src}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain motion-safe:animate-page-fade [animation-delay:650ms]"
            />
          </div>
        )}

        {preview?.kind === "terminal" && (
          <pre
            key={project.slug}
            className="absolute inset-0 flex flex-col justify-center gap-1.5 overflow-hidden px-8 font-mono text-sm leading-relaxed text-muted-foreground motion-safe:animate-page-fade"
          >
            {preview.lines.map((line, i) => (
              <span key={i} className={line.startsWith("$") ? "text-foreground" : line.includes("✓") ? "text-primary" : undefined}>
                {line}
              </span>
            ))}
            <span className="text-foreground">
              ${" "}
              <span className="text-primary motion-safe:animate-caret-blink">_</span>
            </span>
          </pre>
        )}

        {!preview && (
          <p className="absolute inset-0 flex items-center justify-center font-serif text-3xl lowercase text-muted-foreground/60">
            {comingSoonLabel}
            <span className="text-primary motion-safe:animate-caret-blink" aria-hidden="true">
              _
            </span>
          </p>
        )}
      </div>
    </figure>
  )
}
