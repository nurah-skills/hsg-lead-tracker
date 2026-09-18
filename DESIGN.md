# How this board is built

The lead tracker, the [Sales scoreboard](https://nurah-skills.github.io/every-sale-matters/) and the [Mailer board](https://nurah-skills.github.io/hsg-mailer-management/) share one design. Same palette, same two faces, same three shapes, same shell. A person who knows one board can read the others without learning anything new. This file is the lead tracker's copy of that agreement; where it differs, it is because this board has something the others do not, never because a choice drifted.

## Colour

Colours live as custom properties on `:root` in `assets/css/styles.css`, redefined once under `@media (prefers-color-scheme: dark)`. Nothing in the stylesheet uses a raw colour value, with two deliberate exceptions noted below — if a new colour is needed, it becomes a token first.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--page` | `#F1F6F3` | `#0A130F` | The ground behind everything |
| `--card` | `#FFFFFF` | `#12201A` | Panels, tiles, the menu, the raised surfaces |
| `--field` | `#E6EEE9` | `#1A2B24` | Inputs, chip backgrounds, tracks |
| `--ink` | `#11211B` | `#E7F0EB` | Body text |
| `--muted` | `#52665D` | `#96A9A0` | Second-line text, labels, captions |
| `--line` | `#D6E4DC` | `#26382F` | Hairlines and dividers |
| `--navy` / `--navy-deep` | `#14352C` / `#0C211A` | `#143027` / `#0C1F19` | The dark card art, the sign-in panel |
| `--accent` | `#17A57C` | `#3FBF95` | The green both boards are known by |
| `--accent-ink` | `#0A6B50` | `#7FDCBB` | Links, and text on green |
| `--college-sa` / `--college-mc` / `--college-bv` | teal / red / navy | lighter versions | Skills Academy, Matric College and Bellview, wherever a chart splits by college |
| `--focus` | `#0F766E` | `#6EE7C4` | The focus ring |

**Matric College's red is a college colour, not a verdict.** Every chart that uses the college colours names them in its key, and a state still lives in a chip or a tinted card, never in a bar or a slice.

**The three status colours** carry meaning and are used nowhere decorative: red for stop (needs repair, waiting 8 days or more, nothing recorded), yellow for hold (fixed but unchecked, waiting 4 to 7 days), green for go (checked and passed, something recorded).

**Contrast.** Every text colour measures at least 4.5:1 against the surface behind it, in both themes, measured against its own tint rather than the page.

## Type

Two faces, from Google Fonts:

- **Archivo** (500/600/700) for headings, figures and anything counted.
- **Nunito** (400/600/700) for running text.

Figures use `font-variant-numeric: tabular-nums` wherever they line up in a column, so a changing number does not shift the ones beside it.

## Space and shape

**Three shapes, and nothing else.**

| Token | Size | For |
| --- | --- | --- |
| `--radius` | 16px | Surfaces: panels, tiles, cards, dialogs |
| `--radius-control` | 10px | Controls: buttons, inputs, selects, the menu, notices, the toast |
| `--radius-mark` | 4px | Marks: small bars and swatches |

Pills (`999px`) are for chips and counts only; `50%` is for avatars. Nothing else rounds its own corners.

**Depth instead of outlines.** A surface lifts off the page with `--shell` rather than drawing a border around itself. In dark mode `--shell` becomes a single hairline, because a shadow on a dark ground reads as dirt.

**The page rhythm is 22px.** `.app-main` spaces its children by 22px and `.grid` uses the same gap. Cards in a row stretch to the same depth, so nothing floats above a gap.

## What the board will not do

These are design decisions, not missing work:

- **It works out no conversion rate.** Registrations are not matched to submissions, so any rate would be a guess with a decimal point on it.
- **It does not score a person's follow-up.** Note quality is measured on length alone, because that is the only thing the text can honestly be read for. A board that scores people on their notes gets better notes, not better follow-up.
- **It does not treat a blank row as proof.** A lead with nothing recorded means nobody wrote anything down. Every figure that counts blanks says so beside itself.
- **It carries no machine review.** Nothing on this board judges a note, ranks a person, or suggests what to do next.

## Components

- **The menu** — a light column on `--card`, held off the page by a single hairline. The page you are on is a soft green pill with a thin green ring; everything else is `--muted` until you hover it. Seven pages have to fit without scrolling, so the gaps, the padding and the row height are sized against the window with `clamp()`, and two `max-height` steps draw it tighter on a short laptop screen. A finger still gets a 44px row through `@media (pointer: coarse)`.
- **The page header** — the page name and its one-line note, closed by a hairline.
- **`.tile`** — a figure with its name, a note under it, a small chart of the run behind it and an **(i)** that says what the figure counts and what it does not. On `--card` with `--shell`.
- **Where to start** — a row of counts at the top of Daily actions, above the filters, each a link into the right group. It counts only things that are true right now.
- **The filter bar** — period, college, salesperson and a search, shared by four pages through `assets/js/shared/leads.js` so they can never count the selection differently. The state lives in the query string. A salesperson's own name is set and locked, so the control shows the rule rather than hiding it.
- **Drill-down tiles** — `.status-tile` for a state or a waiting band, `.category-tile` for a kind of note or finding. Opening one puts the step in the address bar; a `.trail` above the heading names the way back.
- **`.panel`** — the surface everything else sits in.
- **Card art** — the dark green block on a category tile. It takes `--navy` to `--navy-deep` and `--on-navy` for its text, so it follows the palette rather than carrying a colour of its own.
- **Tables** (`.results`) show a heading row on a laptop. On a phone the heading row is hidden and each cell carries its own heading through `data-label`.
- **Sign in** — one card resting on `--page`: the green panel on the left with the brand, the lead line and three points; the form on the right. The panel's soft lights are radial gradients on a `::after`, never images. Under 900px the panel drops away and the form fills the screen.

## One shell, seven pages

`tools/build-pages.js` writes all seven signed-in pages from one template. The menu, the head, the top bar and the footer exist once, so an entry cannot be right on six pages and wrong on the seventh. Change the shell or add a page there, then run it, then run the stamper.

## Asset addresses

Every link to a stylesheet, a script or the logo carries `?v=` and a short hash of that file, written by `tools/stamp-assets.js` before a commit. GitHub Pages caches assets for ten minutes, and without this a new page can load beside a cached older script: the markup is there, the behaviour is not, and the page looks broken in a way nothing on screen explains.

## Motion

Almost none, and always short: 0.15s ease on colour and shadow, and the menu drawer sliding in. `prefers-reduced-motion` turns transitions off. Nothing animates on load — the page is readable in its first frame.

## Writing

Plain words, and the same voice as the mailer board. A control says exactly what happens. A figure says what it counts and what it does not. Nothing on the page claims a result the numbers do not support.

## Accessibility

Every control reaches 44px on a touch screen, every field has a real label, focus is always visible, and colour is never the only thing carrying a meaning — a status has words as well as a tint.
