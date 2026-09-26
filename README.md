# HSG lead tracker

A management view of the leads that come in from the Tally and survey forms: where they went, how long they waited, and what was written down when somebody worked one.

**Live:** https://nurah-skills.github.io/hsg-lead-tracker/

Every figure on this board is made up. No real person, form, lead or sheet is in here.

## Trying it

Open the live link and choose a role. No account is needed and nothing is saved.

- A **sales manager** sees every salesperson, and can record a decision on a repair.
- A **marketing manager** sees the same. They are on this board because they build and own the forms the leads arrive on, so a finding or a repair is theirs to settle.
- A **salesperson** sees the leads allocated to them, and nothing else. The salesperson filter is set to them and locked.

## Pages

| Page | What it does |
| --- | --- |
| `pages/actions.html` | The landing page. **Where to start** across the top: leads waiting over a week, forms with a finding, repairs waiting on a check, one-word notes. Then three figures (lead records, something recorded, days to first evidence), how long leads have been waiting, what evidence there is, the five questions in the order they can be answered, what people recorded, and leads arriving by day. |
| `pages/team.html` | Every salesperson in the selection: leads given, leads a day, how much was recorded, the middle number of days to first evidence, and how many of their leads have waited over a week. Open one to see their own figures and their leads, longest wait first. |
| `pages/waiting.html` | Leads with nothing recorded against them, opened by how long they have waited — same day, 1 to 3 days, 4 to 7, 8 to 14, 15 or more. Tick rows and **Export these rows** saves just those. |
| `pages/notes.html` | The follow-up notes people wrote, opened by how much they say: **Says what happened**, **Barely a note**, **One word**. |
| `pages/forms.html` | Every form in the register, and the eight kinds of finding a check can raise against one. Open a finding to see the forms it applies to. Filter by college or search. |
| `pages/repairs.html` | What was found on a form, what was done about it, and whether anyone checked afterwards — **Needs repair**, **Fixed, waiting on a check**, **Checked and passed**. A manager sees the button to record a decision. |
| `pages/sources.html` | Which workbooks this board reads and when, how each figure is counted, and what is not joined up. |
| `index.html` | Sign in, or look around. |

## What the figures mean

- **A lead record** is one row per submission on a salesperson's tab, counted once.
- **Something recorded** means a status, a note or a worked marker is on the row. It does not prove the person was reached, or that the contact was any good.
- **Days to first evidence** is the middle value, not the average, so one very old lead cannot drag it. Only rows carrying both a status and a date can be measured at all.
- **Waiting** runs from the submission date to today, for rows with nothing recorded. It does not prove nobody phoned — it proves nobody wrote it down.
- **Note quality** is measured on length alone: whether the next person could pick the lead up. Nothing here judges the work.

Three things this board deliberately keeps apart: **supply** (did the lead arrive), **speed** (how fast someone followed up) and **quality** (what the note says). Mixing them produces a number that means nothing.

## What it will not tell you

- **Whether every lead arrived.** Nothing compares the submission numbers a form issued against the rows that reached a sheet, so a lead that never arrived does not appear anywhere here.
- **Whether a lead became a sale.** Registrations are not matched back to submissions. A row marked *Sale* is what the salesperson recorded, and nothing has checked it. This board works out no conversion rate, and neither should anyone reading it.
- **Whether the follow-up was any good.** It counts what was written down. That is all.

## Sample data

Names, forms, leads, notes and repairs are invented. The shapes match what the real trackers hold, so the counting rules can be read and argued with, but no figure here came from a real sheet.

## Folders

```
index.html               sign in
pages/                   the seven signed-in pages
assets/css/styles.css    the whole design, shared with the other two boards
assets/js/shared/        data.js, app.js (the shell), charts.js, leads.js (the filters), session.js, auth.js
assets/js/pages/         one script per page
tools/build-pages.js     builds the seven pages from one shell
tools/stamp-assets.js    puts a version on every asset link before a commit
```

## Finding one thing

Every page carries **Search the board** in its header. Type two letters or more and it looks through the salespeople, the forms, the findings and the repairs at once. Each result opens the page with that thing already showing.

## How it looks

This board, the [Sales scoreboard](https://nurah-skills.github.io/every-sale-matters/) and the [Mailer board](https://nurah-skills.github.io/hsg-mailer-management/) share one design, so a person who knows one can read the others. It is written down in [DESIGN.md](DESIGN.md).

## On a phone

The menu becomes a bottom bar with **Today**, **Waiting**, **People** and **More**. Tables lose their heading row and each cell carries its own heading instead.

## Working on it

Plain HTML, CSS and JavaScript, with nothing to build. To run it on your own computer, open a terminal in this folder and run:

```
npx.cmd serve .
```

After changing the shell or adding a page:

```
node tools/build-pages.js
```

Before committing a change to anything in `assets/`:

```
node tools/stamp-assets.js
```

GitHub Pages lets a browser keep a stylesheet or a script for ten minutes. Without that step a visitor can load the new page beside the old script, and a control that is on screen does nothing.

Changes pushed to the `main` branch go live on GitHub Pages within a few minutes.

## Still to do

- Connect the real salespeople master, form inventory and repair tracker
- Real sign-in with approved work emails
- Reconcile submission numbers against the rows that reached a sheet, so a missing lead shows up
- Match registrations to submissions, so the question about sales can be answered at all
- Report a newly discovered form from the board itself, rather than in a message
