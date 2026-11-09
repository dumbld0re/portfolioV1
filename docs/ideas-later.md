# Ideas for later

Left over from the full review on 9 November 2026. Two ideas from that list
are built: the dot piece in the hero (`components/hero-piece.tsx`) and the
"dont click here" page that gets more exasperated each visit
(`app/[lang]/dont-click-here/page.tsx`). The rest wait here. Phase 2
("personality": wave back, guestbook, how I work) is in `phase-2.md`.

## Ideas not built yet

### "Currently reading" line
Pull the open entry (status `reading`) from `content/library` at build time
and show it as one mono line in the hero or the contact section, linking to
read.dannymiguel.com. No API needed. It would also be the first link from the
home page to the library, which nothing links to today.

### Keyboard layer
Single keys across the site: `t` theme, `b` boring, `h` say hello, `g p` /
`g e` / `g c` to jump to projects, experience and contact, with a small `?`
hint in a corner. The library already uses `/` for its filter, so the two
should share one handler.

### Project write-ups as the first posts
Posts are hidden (`SHOW_POSTS` in `lib/features.ts`) because there is nothing
to read. A short page per project (what it is for, the decisions, what broke)
would give the section real content and reuse the markdown setup as it is.

### CV generated from the site's content
Build `public/cv.pdf` from `content/experience.ts` (Typst would fit), so the
PDF can never fall behind the site.

## Waiting on a decision or on material

- **Library look.** It still has the older style (the `dm_ | /home/…` header,
  the ghost word, the `007 / Index` label), while the home page moved to the
  quiet style. Restyling it changes a design that was agreed, so it needs a
  decision first.
- **`uni` terminal card.** The session shown in the projects list is
  illustrative (`UNI_SESSION` in `content/projects.ts`). It needs a real
  session pasted in.
- **CV file.** `public/cv.pdf` was last changed on 8 July 2026. Check that it
  includes the Oratores Novi role that started in October.
