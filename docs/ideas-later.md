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

## From the references of 12 November 2026

Sites Danny pointed to: an about page with a map popover over "Uruguay"
(Nacho), ozzy's bio with coloured inline pills, fuss.gg, mikes.cv and
shwn.design. Taken as ideas to translate into this site's own language (dots,
the triangle, one amber accent), not to copy. Already done from this round:
the centred hero ("20, i make things" under the name), which Danny liked.

### Namibia map in dots (from the Uruguay popover)
The favourite. Hovering (or tapping) the word "namibia" in the text opens a
small card above it: southern Africa drawn in the site's dots, grey, with
Namibia lit amber, and a soft wedge from it to a larger amber Namibia. In our
version the dots could fly out of the word into the map, like the name's dots
gather, and fall back into the word when the card closes. Needs:
- a place where "namibia" is said again: the old "currently in namibia,
  windhoek" line (taken out of the centred hero) could come back under the
  tagline, or the experience prose could mention it;
- the map outlines as data, sampled to dots at build time (a public-domain
  outline, simplified);
- a check against the global rule that bans Namibia content in design work:
  Danny asked for this one directly, so confirm it is an exception before
  building.

### Small marks inline in the prose (ozzy, fuss.gg, shwn.design)
Names in running text carry a tiny mark right before them: aestudio's mark
before "aestudio", the Oratores Novi crest, UNAM's, a penguin before "Linux".
Ozzy colours each link as a different pill; here that would be one amber tint
on hover only, so the text stays calm. Option: draw the marks as 7x7 dot
glyphs, so they belong to the dot name. Fits the experience prose
(`content/experience.ts`) and the hero sentences.

### Words you can play with (shwn.design)
Shawn's bio has words that change when you use them (font and style
switches). Ours: "things" in "20, i make things" cycles when clicked
(websites, fonts, mistakes, coffee…), or the word is drawn in dots and can be
pushed around like the name. No handwriting or italic styles (standing rule).

### A metaphor that runs through the page (mikes.cv)
Mike's site is one consistent idea: a flight. Coordinates and time zone up
top, the theme switch is "close the window shade", jobs are flight legs with
airport codes, the footer says "thank you for flying". Ours could be the
screen the dots live on (phosphor, a dot-matrix printer, the sound kit's
language): the theme switch named "lights off", experience entries printed
like receipt lines, the footer "end of transmission". Or coordinates and time
zone in mono beside the name (this ties in with the Namibia idea).

### Easter eggs, fleshed out (fuss.gg counts them: "secrets 0/19")
- **A secrets counter.** A small mono "secrets 2/9" in the footer, kept in
  localStorage. Each egg found ticks it; finding them all turns the name amber
  for that visitor and unlocks a wallpaper of the dot name to download.
- **New eggs** that fit the dots (leaving out what was already turned down:
  mouse shake, the hyphen, a logo poke, the console, a bottom dock):
  - type any word and press enter: the name's dots spell it for a few seconds
    (the `morph` handle already exists);
  - leave the page alone for a minute: the dots slowly sag and doze, and wake
    with a jolt when the pointer moves;
  - switch the theme five times in a row: the dot wave comes out dizzy (spins)
    and a small "make up your mind" appears;
  - select the name's text: the dots light up amber where the selection is;
  - visit at 20:20, or on your birthday: the dots burst like confetti once;
  - squeeze the window very narrow: the name gives up and says "too small".
- Each new egg should also have a sound in the phosphor kit.

### A lab of small pieces (shwn.design)
Shawn's page is a wall of small working prototypes. The projects page, which
is waiting to be reworked, could open with a "lab" row: the dot name, the
theme wave, the sound kits, the share-card cursor, each live and playable.

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
