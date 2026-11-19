import type { CSSProperties } from "react"

/** A word whose letters hop up off its underline, one after another, when the
 *  link around it (a `.group`) is pointed at. Used on links that leave the
 *  site, in place of an arrow. Styles: `.explore-pop` in globals.css. */
export function PopWord({ text }: { text: string }) {
  return (
    <span className="explore-pop" aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ "--i": i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  )
}
