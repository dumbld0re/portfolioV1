// Shared class strings for the quiet home column (components/sections/*).

/** Underlined text link whose line warms to amber on hover. */
export const inlineLink =
  "underline decoration-border decoration-1 underline-offset-[5px] transition-colors hover:text-foreground hover:decoration-primary"

/** The wide frame every home section sits in (90rem, left-aligned content). */
export const column = "mx-auto w-full max-w-[90rem]"

/** Comfortable reading width for lists and paragraphs inside the frame. */
export const measure = "max-w-3xl"

/** Small mono marker above each section heading, e.g. EXPERIENCE. */
export const sectionLabel = "font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground md:text-[13px]"

/** A section's set heading (experience, contact): one clear step below the
 *  dot name, so the name stays the only giant thing on the page. */
export const sectionHeading =
  "mt-4 font-serif text-[1.875rem] lowercase leading-[1.15] tracking-[-0.02em] text-balance md:mt-6 md:text-[2.75rem] md:leading-[1.1]"

/** A section heading in the hero tagline's voice: a mono line with one word
 *  on a pill (components/sections/tagline-heading.tsx). */
export const taglineHeading = "mt-4 font-mono text-base text-foreground"

/** X (Twitter) profile, linked from the hero and contact icon rows. */
export const X_URL = "https://x.com/dannymiiiguel"
// Placeholders until the profiles exist: swap in the real profile links.
export const INSTAGRAM_URL = "https://www.instagram.com/"
export const PINTEREST_URL = "https://www.pinterest.com/"
