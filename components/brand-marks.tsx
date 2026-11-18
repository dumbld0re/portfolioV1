// The real marks of the places I work at, sized like the text around them.

/** aestudio's mark (from the brand files), in the text's own colour. */
export function AestudioLogo() {
  return (
    <svg viewBox="0 0 20 20" className="logo-mark" aria-hidden="true" fill="currentColor">
      <path d="M0 10V6a6 6 0 0 1 6-6h14v4H6a2 2 0 0 0-2 2v4z" />
      <path d="M20 10v4a6 6 0 0 1-6 6H0v-4h14a2 2 0 0 0 2-2v-4z" />
    </svg>
  )
}

/** Oratores Novi's mark (from its own site's files), at 88px high in public/logos. */
export function OratoresLogo() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logos/oratores-novi.png" alt="" aria-hidden="true" width={96} height={88} className="logo-mark logo-oratores" />
}

/** Fluent Academy's mark: the open "A" of its FLAC wordmark with the colour
 *  bar under it (colours sampled from fluentacademy.co's logo), the letter in
 *  the text's own colour so it reads on both themes. */
export function FluentLogo() {
  return (
    <svg viewBox="0 0 24 20" className="logo-mark" aria-hidden="true">
      <path d="M3.5 15 12 2.2 20.5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
      <rect x="3" y="17" width="6.6" height="1.8" fill="#ec0008" />
      <rect x="9.6" y="17" width="2.3" height="1.8" fill="#fa2400" />
      <rect x="11.9" y="17" width="2.8" height="1.8" fill="#fb7d00" />
      <rect x="14.7" y="17" width="6.3" height="1.8" fill="#fcb400" />
    </svg>
  )
}
