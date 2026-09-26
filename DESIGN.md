# How this board is built

> **This board follows the Service Board design system.** Its tokens, type, spacing,
> radii and component rules come from there, so the boards in the family read as one
> thing. Where this file and the system disagree, the system wins — except for the one
> deviation recorded under Colour.

The lead tracker, the [Sales scoreboard](https://nurah-skills.github.io/every-sale-matters/) and the [Mailer board](https://nurah-skills.github.io/hsg-mailer-management/) share one design. Same palette, same two faces, same three shapes, same shell. A person who knows one board can read the others without learning anything new. This file is the lead tracker's copy of that agreement; where it differs, it is because this board has something the others do not, never because a choice drifted.

## Colour

The palette is the Service Board system's, light only. The boards are read at a desk in
office light and on meeting-room projectors, so there is no dark theme.

| Token | Value | Used for |
| --- | --- | --- |
| `--page` | `#F4F5F8` | The cool grey canvas behind every card |
| `--card` | `#FFFFFF` | Cards, the sidebar, controls |
| `--subtle` | `#FAFBFC` | Table headers, row hover, the user block |
| `--ink` | `#0F172A` | Headings, figures and body text |
| `--ink-2` | `#334155` | Secondary text: menu rows, table cells, neutral pills |
| `--muted` | `#5B6878` | Notes, labels, chart axes |
| `--line` | `#E7E9EE` | The hairline every surface is defined by |
| `--accent` | `#2F6FEB` | Charts, focus rings. Never text |
| `--accent-ink` | `#1D56C9` | Link and accent text |
| `--navy` | `#0E1B3D` | Primary buttons, the current menu icon, the dark card art |

**The State Colour Rule.** Green means on track, amber means attention, red means late,
and they mean nothing else. They appear as a soft pill, a thin meter or a short phrase —
never as a card fill.

**One deviation from the system, deliberately.** The system sets `--muted` to `#64748B`,
and its own note warns that this reaches only 4.4:1 on the page. These boards also use
`--field` and the segmented track as surfaces, where it falls to 4.17:1 and 4.02:1 —
below the system's own 4.5:1 requirement. One notch darker, `#5B6878`, clears 4.5:1 on
all five grounds these boards actually use.

## Type

One face, **Geist**, at 400/500/600/700, carries everything. **Geist Mono** at 500 is for
figures that should read like an instrument, and never for words. Both load from Google
Fonts, the only external resource the content security policy allows.

Every figure, table and scorecard uses `font-variant-numeric: tabular-nums`.

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
- **`.tile`** — a figure with its name, one muted line under it giving its base, and an **(i)** that says what the figure counts and what it does not. No chart inside the card: where a figure has a breakdown, it is a panel on the same page, and a figure the banner already gives is not a card as well. On `--card` with `--shell`.
- **Where to start** — a row of counts at the top of Daily actions, above the filters, each a link into the right group. It counts only things that are true right now.
- **The filter bar** — period, college and a search in sight; the salesperson and saved views behind one **More filters** button that opens them in the row. It opens by itself when one of its filters is already set, and when closed says how many are on (*More filters · 1*). Shared by four pages through `assets/js/shared/leads.js` so they can never count the selection differently. The state lives in the query string. A salesperson's own name is set and locked, so the control shows the rule rather than hiding it. The line under the bar (*Showing 412 lead records · …*) appears only when something other than the default thirty days is on screen.
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

Almost none, and always short: 0.15s ease on colour and shadow, the menu drawer sliding in, and **More filters** fading its controls in over 150ms on `--ease-out` (opacity only, no slide). `prefers-reduced-motion` turns transitions off. Nothing animates on load — the page is readable in its first frame.

## Writing

Plain words, and the same voice as the mailer board. A control says exactly what happens. A figure says what it counts and what it does not. Nothing on the page claims a result the numbers do not support.

## Accessibility

Every control reaches 44px on a touch screen, every field has a real label, focus is always visible, and colour is never the only thing carrying a meaning — a status has words as well as a tint.
