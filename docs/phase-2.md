# Phase 2: Personality

The reference sites (janiswanger.ch, ingrassiadaniel.it, poulo.site) feel like
people, not CVs. dannymiguel.com already has the craft (handwriting, the
triangle cursor, boring mode, the visitor eye) but almost nothing about who you
are once work stops. Phase 2 fixes that. Each point below lists directions it
could go in, with a recommendation. Pick one direction per point, or mix.

Ground rules, carried over from earlier decisions:

- Everything stays in the narrow home column and uses `lib/styles.ts`.
- Amber (`text-primary`) is the only accent. No numbered labels (001, 002).
- Translate references into the site's own language. Never copy them.
- Design and client work stays on aestudio. Phase 2 is about you, not services.
- Every new animation obeys "pause animation", reduced motion and boring mode.
- English and German copy for everything (`content/*.ts`).

## Already done

- **Time line (ported from aestudio):** the contact section now shows
  `my time currently → 15:07` and `your time currently → 08:07 (7h behind)`,
  or `we're in the same timezone`. Zones are compared by UTC offset, so
  Johannesburg counts as the same zone. See `components/time-status.tsx`.
- **The late note:** when the visitor is in a different timezone and it's
  22:00–07:00 in Windhoek, an amber line appears:
  - before midnight: "it's past 10pm here, i'll reply tomorrow"
  - after midnight: "it's the middle of the night here, i'll reply in the morning"

  The hours are `LATE_FROM` and `LATE_UNTIL` in the same file.
- **Underlines after "say hi to me":** once the handwriting finishes, four
  quick underline strokes follow (there, back, there again, then a short flick
  under "me"). The paths are hand-placed in `content/handwriting.ts` under
  `underlines` and are faster than the writing.

---

## 1. Off the clock

**The gap:** the hero says what you do. Nothing says what you're like. Janis's
"private" section (treehouse, DJ nights, a self-built bike) is the part people
remember.

**What you have to work with:** teaching German, quant finance at UNAM,
breaking your Linux setup, the reading library, Windhoek, and whatever else is
true (music, sport, food, places).

### Directions

**A. A prose paragraph** *(recommended to start)*
Three or four sentences in your voice, in the column. The words that carry the
story (*worksheets*, *Arch*, *Windhoek*) get an amber underline that draws
in on scroll, reusing the handwriting's dash animation.
- Effort: half a day.
- Risk: none. It is just writing.
- Twist: hovering a highlighted word shows a tiny photo or object beside it
  (like the project hover cards, but much smaller).

**B. A "/now" page**
A dated page: what you're working on, reading, learning and listening to this
month. The home page links to it in a single line ("what i'm up to →").
- Effort: half a day, plus updating it monthly.
- Strength: it's honest and cheap to keep fresh.
- Risk: a stale "now" page reads worse than none. Show the date prominently.

**C. A live ledger**
Short mono lines filled from real data, for example:
```
reading      — <title> (from read.dannymiguel.com)
last sheet   — präteritum, A2 (from typstLibrary)
listening    — <track> (last.fm)
uptime       — arch, 41 days since last breakage
```
- Effort: 1–2 days. Each source needs an API route and caching.
- Strength: it updates itself and shows engineering skill without saying so.
- Risk: every external source can break. Each line needs a quiet fallback.

**D. Photos**
A short strip of real photos (Windhoek, the desk, a lesson board), pinned like
the /timeline photos. It could be a teaser that leads into /timeline once that
has real content.
- Effort: 1 day, mostly picking photos.
- Risk: weak photos cheapen the page. Use few and good ones, or none.

**Mix that works:** A on the home page, with one amber word linking to B.

---

## 2. Visitor interaction

**The gap:** the visitor eye counts people but they can't do anything back.
Janis's like counter (rolling digits, "slow down a second ;)") makes visitors
feel noticed. Upstash Redis is already set up for the view counter, so storage
isn't a blocker any more.

### Directions

**A. "Wave back"** *(recommended)*
A small mono button next to the eye in the footer: `wave back (312)`.
- Clicking it rolls the digits up like an odometer, and the triangle cursor
  gives a little wave.
- Clicking fast shows "ok ok, i saw you" (de: "schon gut, hab dich gesehen").
- Same API pattern as `app/api/views`, one Redis key, one cookie per device.
- Effort: 1 day.

**B. Guestbook** *(already on your list)*
Visitors leave a name and a one-line note. Show the last 10 in mono, newest
first.
- Needs moderation. Options: approve each entry by hand (a review queue in
  Redis plus a secret admin route), or a word filter with instant posting.
- Effort: 2–3 days with moderation.
- Twist: entries appear in your handwriting font, once that exists.

**C. Leave a dot**
Clicking empty background drops an amber dot into the dot grid at that spot.
The last 200 dots from all visitors persist, so the background slowly fills
with other people's marks.
- Effort: 2 days. Needs throttling and a cap.
- Strength: the most "only on this site" option, and it ties into the
  background you already have.
- Risk: invisible to people who don't think to click. Needs a hint in the
  corner controls ("click anywhere to leave a mark").

**D. Handwritten thank-you**
After someone copies your email or opens WhatsApp, a handwritten "thanks!"
writes itself next to the link.
- Needs a new photo of the phrase in black pen on white paper.
- Effort: half a day once traced. No storage.

**Mix that works:** A now, C later as part of phase 3 (it overlaps with the
ASCII piece).

---

## 3. How I work

**The gap:** the hero says what you make. Nobody learns what it's like to work
with you, which is what a client or employer decides on. Ingrassia's
"how I work" is three sentences and does a lot.

### Directions

**A. Three lines** *(recommended)*
Three short statements, each with a mono keyword in front, for example:
```
small     — one person, no handoffs, you talk to the one building it
fast      — sites that load before you blink, checked on a slow phone
plain     — you get the code and a page explaining how to change it
```
- Effort: an hour or two. All of the work is in the writing.

**B. Good fit / not a fit**
Two short columns: "we'll get on if…" and "i'm probably not your person if…".
This is the Soft/Technical split from Janis's screenshot, but honest instead of
a skills list.
- Strength: it filters out the wrong people and shows confidence.
- Risk: the tone has to be friendly, not prickly.

**C. A working-together walk-through**
"first call → a page of notes → a rough version in a week → …" as a short
sequence. On scroll, each step gets underlined in amber.
- Better suited to aestudio than here. Consider putting it there and linking.

**D. FAQ in your voice**
"do you do wordpress?" "no, and here's why." Four or five questions.
- Strength: easy to scan, and good for SEO.
- Risk: can turn into a sales page. Keep it to questions people actually asked.

**Note:** if this section ends up being about design services, it belongs on
aestudio. On dannymiguel.com, keep it about how you build and work (job
applications, engineering collaborations).

---

## 4. Availability and time

**Done:** the time line and the late note (see "Already done").

### Further directions

**A. A dot that's alive** *(recommended)*
A small amber dot before "status: open to work" in the hero, blinking like the
1-bit dot on aestudio (`steps(1)`, mostly on). It turns grey and stops when
you set `status` to closed.
- Effort: 30 minutes.

**B. Reply-time line**
"usually replies within a day" under the email. It could be computed later
from real data if mail ever goes through a form.

**C. The late note elsewhere**
Show the same note as a tooltip on the email link in the hero, so night-time
visitors see it before they reach the bottom of the page.

**D. Weekend note**
On Saturdays and Sundays (your time): "it's the weekend here, i'll reply on
monday". Same component, one more rule.

---

## 5. Little words

**The gap:** your 404 ("this page is in the trash") already has the voice.
Spread a bit more of it around.

### Directions (all small, pick any)

- **Colophon line** in the footer: "set in geist serif · built with next.js ·
  made in windhoek" (Poulo's "this website was built with…").
- **End mark:** a closing glyph after the footer, written in your handwriting
  if possible (Janis's "the end☆", in your style).
- **Copy-email feedback:** clicking the email copies it and the address
  briefly reads "copied, now go write me something".
- **Tab title when away:** when the tab loses focus, the title changes to
  "come back ↩" (de: "komm zurück ↩"). It's well known, so it's optional.
- **Console note:** a short message in devtools for developers who look,
  linking to the GitHub repo.

---

## Suggested order

| Step | What | Effort |
|------|------|--------|
| 1 | 4A blinking dot, 5 colophon and end mark | ~1 hour |
| 2 | 3A three lines | ~2 hours (writing) |
| 3 | 1A off-the-clock paragraph with amber underlined words | ~half a day |
| 4 | 2A wave back counter | ~1 day |
| 5 | 1B /now page, or 1C live ledger | ½–2 days |
| 6 | 2B guestbook (if still wanted) | 2–3 days |

What needs your input before building:

- Your own words for 1A and 3A. I can draft them, but they should sound like you.
- Photos (1D), a new handwriting photo (2D, end mark), and last.fm or similar
  accounts (1C), if you choose those.
