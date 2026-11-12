// The real marks of the two places in the hero, sized like the text around them.

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
