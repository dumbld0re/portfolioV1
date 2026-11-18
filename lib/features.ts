// Posts (/posts, the header link and the sitemap entries). Set to false to
// hide them again; the pages, components and content/posts stay in place.
export const SHOW_POSTS = true

// The year-by-year timeline (/timeline) is a work in progress with placeholder
// data. While this is false the route 404s; flip it to preview the page.
export const SHOW_TIMELINE = false

// The reworked projects page and the case studies under it (/projects/[slug]).
// While this is false they stay unlisted: /projects shows the "being reworked"
// note unless ?preview is in the URL, and the case studies are noindex and left
// out of the sitemap. Flip it to put them live.
export const PROJECTS_LIVE = true

// The bookshelf on the home page (the sentence's "bookshelf" pill). While this
// is false the place opens on a "currently working on it" line with no books;
// flip it to list the reading library there again.
export const BOOKSHELF_LIVE = false
