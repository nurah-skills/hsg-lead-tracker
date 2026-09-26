// The seven signed-in pages share one shell: the same head, the same menu, the same footer.
// Keeping it in one place means a menu entry can never be right on six pages and wrong on the seventh.
// Run it after changing the shell or adding a page:
//
//   node tools/build-pages.js
//
// Then run tools/stamp-assets.js before committing.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const ICONS = {
  actions: '<path d="M4 12.5l5 5L20 6.5"/>',
  team: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M16.5 6.2a3 3 0 0 1 0 5.8M17.5 19.5a5.4 5.4 0 0 0-2.2-4.3"/>',
  waiting: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  notes: '<path d="M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14.5 3.5V8H19"/><path d="M8.5 13h7M8.5 16.5h4"/>',
  forms: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8.5h8M8 12.5h8M8 16.5h4"/>',
  repairs: '<path d="M14.7 6.3a3.6 3.6 0 0 0 4.6 4.6l-8.6 8.6a2.2 2.2 0 0 1-3.1-3.1z"/><path d="M5 5l3 3"/>',
  sources: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'
};

const svg = (paths, size = 20) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

// group: where the entry sits in the menu. null means it sits above the first heading.
const PAGES = [
  { file: 'actions.html', script: 'actions', name: 'Daily actions', icon: 'actions', group: null,
    title: 'Daily actions', note: 'What the lead records show today, and what is waiting on a decision.',
    description: 'What the Tally and survey lead records show today.' },
  { file: 'team.html', script: 'team', name: 'By salesperson', icon: 'team', group: null,
    title: 'By salesperson', note: 'How many leads each person was given, and what came back on them.',
    description: 'Leads and recorded follow-up for each salesperson.' },
  { file: 'waiting.html', script: 'waiting', name: 'Waiting for evidence', icon: 'waiting', group: 'Leads',
    title: 'Waiting for evidence', note: 'Leads with nothing recorded against them, oldest first.',
    description: 'Leads with nothing recorded against them yet.' },
  { file: 'notes.html', script: 'notes', name: 'Note quality', icon: 'notes', group: 'Leads',
    title: 'Note quality', note: 'What people wrote against a lead, and whether the next person could use it.',
    description: 'The follow-up notes people recorded against leads.' },
  { file: 'forms.html', script: 'forms', name: 'Forms and alerts', icon: 'forms', group: 'Forms',
    title: 'Forms and alerts', note: 'Every form we know about, and what a check found on it.',
    description: 'The form register and what the checks found.' },
  { file: 'repairs.html', script: 'repairs', name: 'Repairs and checks', icon: 'repairs', group: 'Forms',
    title: 'Repairs and checks', note: 'What was found on a form, what was done, and whether anyone checked afterwards.',
    description: 'Form repairs and whether they were checked.' },
  { file: 'sources.html', script: 'sources', name: 'Sources and coverage', icon: 'sources', group: 'Evidence',
    title: 'Sources and coverage', note: 'Which workbooks this board reads, when they were read, and what is not joined up.',
    description: 'What this board reads and what it cannot see.' }
];

function menu(current) {
  const lines = [];
  let group = null;
  PAGES.forEach((page) => {
    if (page.group !== group) {
      group = page.group;
      if (group) lines.push(`        <p class="menu-label">${group}</p>`);
    }
    const here = page.file === current ? ' aria-current="page"' : '';
    lines.push(`        <a class="menu-item" href="${page.file}"${here}>`);
    lines.push(`          ${svg(ICONS[page.icon])}`);
    lines.push(`          <span>${page.name}</span>`);
    lines.push('        </a>');
  });
  return lines.join('\n');
}

const shell = (page, body) => `<!doctype html>
<html lang="en" data-page="app">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; form-action 'self'; base-uri 'self'; object-src 'none'">
  <meta name="theme-color" content="#F4F5F8" media="(prefers-color-scheme: light)">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="noindex">
  <meta name="description" content="${page.description}">
  <title>${page.title} · Lead tracker</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@500&display=swap">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script src="../assets/js/shared/session.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="app" id="app">
    <aside class="sidebar" id="sidebar" aria-label="Main menu">
      <a class="brand" href="actions.html"><img src="../assets/img/logo.svg" width="36" height="36" alt=""><span class="brand-text"><b>Lead tracker</b><small>HSG sales</small></span></a>

      <nav class="menu" aria-label="Pages">
${menu(page.file)}
      </nav>

      <div class="sidebar-user">
        <span class="avatar" id="user-initials" aria-hidden="true"></span>
        <div><b id="user-name"></b><small id="user-role"></small></div>
        <button class="icon-button" id="sign-out" type="button" aria-label="Sign out" title="Sign out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </div>
    </aside>

    <div class="scrim" id="scrim"></div>

    <div class="app-body">
      <header class="topbar">
        <button class="icon-button" id="menu-button" type="button" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <a class="brand" href="actions.html"><img src="../assets/img/logo.svg" width="30" height="30" alt=""><span>Lead tracker</span></a>
      </header>

      <main class="app-main" id="main" tabindex="-1">
        <div class="page-header">
          <div>
            <h1>${page.title}</h1>
            <p class="page-note">${page.note}</p>
          </div>
        </div>

${body}
      </main>
    </div>
  </div>

  <div class="toast" id="toast" role="status" hidden></div>

  <script src="../assets/js/shared/data.js"></script>
  <script src="../assets/js/shared/app.js"></script>
  <script src="../assets/js/shared/lines.js"></script>
  <script src="../assets/js/shared/views.js"></script>
  <script src="../assets/js/shared/charts.js"></script>
  <script src="../assets/js/shared/leads.js"></script>
  <script src="../assets/js/pages/${page.script}.js"></script>
</body>
</html>
`;

// The body of each page: the markup the page script fills in.
const BODIES = {
  actions: `        <div class="start-here" id="start-here"></div>

${filters()}

        <p class="panel-note" id="lead-note"></p>

        <section class="tiles tiles-four" id="lead-tiles" aria-label="Totals"></section>

        <div class="grid">
          <section class="panel span-7" aria-labelledby="ages-title">
            <div class="panel-head">
              <h2 id="ages-title">How long leads have been waiting</h2>
              <a class="text-link" href="waiting.html">Open the waiting list</a>
            </div>
            <div id="age-chart"></div>
            <p class="panel-note">Counted from the day the form was submitted to today, for leads with nothing recorded against them.</p>
          </section>

          <section class="panel span-5" aria-labelledby="evidence-title">
            <div class="panel-head">
              <h2 id="evidence-title">What evidence there is</h2>
            </div>
            <div class="ring-row" id="evidence-rings"></div>
            <p class="panel-note">A status with a date beside it is the only kind that can be checked afterwards. None of it proves the person was reached.</p>
          </section>

          <section class="panel span-12" aria-labelledby="questions-title">
            <div class="panel-head">
              <h2 id="questions-title">Four questions, in order</h2>
            </div>
            <ul class="decision-list" id="question-list"></ul>
          </section>

          <section class="panel span-7" aria-labelledby="status-title">
            <div class="panel-head">
              <h2 id="status-title">What people recorded</h2>
              <a class="text-link" href="notes.html">Open the notes</a>
            </div>
            <div id="status-chart"></div>
            <p class="panel-note">The latest status on each lead in this selection. A blank status does not prove nothing was done.</p>
          </section>

          <section class="panel span-5" aria-labelledby="supply-title">
            <div class="panel-head">
              <h2 id="supply-title">Leads arriving by day</h2>
            </div>
            <div id="supply-chart"></div>
            <p class="panel-note">Every submission the board holds, counted on the day it came in.</p>
          </section>
        </div>`,

  team: `${filters()}

        <p class="panel-note" id="team-note"></p>

        <section class="tiles tiles-four" id="team-tiles" aria-label="Totals"></section>

        <section class="panel" aria-labelledby="team-title" id="team-panel">
          <div class="panel-head">
            <h2 id="team-title">Every salesperson in this selection</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="team-table"></table>
          </div>
          <p class="panel-note">Leads given is what the sheet allocated. Recorded is what came back on those leads, not what was done.</p>
        </section>

        <section id="person-view" aria-labelledby="person-title" hidden>
          <div class="category-head">
            <nav class="trail" id="person-trail" aria-label="Where you are"></nav>
            <div class="category-heading">
              <h2 id="person-title" tabindex="-1"></h2>
              <p class="panel-note" id="person-note"></p>
            </div>
          </div>
          <section class="tiles tiles-four" id="person-tiles" aria-label="This person"></section>
          <section class="panel">
            <div class="table-wrap">
              <table class="results" id="person-table"></table>
            </div>
          </section>
        </section>`,

  waiting: `${filters(true)}

        <p class="panel-note" id="waiting-note"></p>

        <section class="open-section" aria-labelledby="band-grid-title">
          <h2 class="sr-only" id="band-grid-title">Choose how long they have waited</h2>
          <div class="status-grid" id="band-grid"></div>
        </section>

        <section class="panel" aria-labelledby="waiting-title" id="waiting-panel" hidden>
          <div class="panel-head">
            <h2 id="waiting-title">Leads with nothing recorded</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="waiting-table"></table>
          </div>
          <p class="panel-note">Oldest first. Waiting is counted from the submission date to today; it does not say nobody phoned.</p>
        </section>`,

  notes: `${filters()}

        <p class="panel-note" id="notes-note"></p>

        <section class="open-section" aria-labelledby="weight-grid-title">
          <h2 class="sr-only" id="weight-grid-title">Choose a kind of note</h2>
          <div class="category-grid" id="weight-grid"></div>
        </section>

        <section id="weight-view" aria-labelledby="weight-title" hidden>
          <div class="category-head">
            <nav class="trail" id="notes-trail" aria-label="Where you are"></nav>
            <div class="category-heading">
              <h2 id="weight-title" tabindex="-1"></h2>
              <p class="panel-note" id="weight-note"></p>
            </div>
          </div>
          <p class="panel-note" id="weight-detail"></p>
          <section class="panel">
            <ul class="note-list" id="note-list"></ul>
          </section>
        </section>`,

  forms: `        <p class="notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>
          <span>These checks look at the form register and where each form writes. They do not open the form, and they do not prove a lead was lost.</span>
        </p>

        <div class="controls">
          <label class="sr-only" for="form-college">College</label>
          <select class="select" id="form-college"></select>
          <label class="sr-only" for="form-search">Search the forms</label>
          <input class="search" id="form-search" type="search" placeholder="Search a form or an owner" autocomplete="off">
          <div class="views" id="saved-views"></div>
          <button class="button button-secondary button-inline" id="forms-clear" type="button" hidden>Show every form</button>
        </div>

        <p class="panel-note" id="forms-note"></p>

        <section class="open-section" aria-labelledby="finding-grid-title">
          <h2 class="sr-only" id="finding-grid-title">Choose a kind of finding</h2>
          <div class="category-grid" id="finding-grid"></div>
        </section>

        <section id="finding-view" aria-labelledby="finding-title" hidden>
          <div class="category-head">
            <nav class="trail" id="forms-trail" aria-label="Where you are"></nav>
            <div class="category-heading">
              <h2 id="finding-title" tabindex="-1"></h2>
              <p class="panel-note" id="finding-note"></p>
            </div>
          </div>
          <p class="panel-note" id="finding-detail"></p>
          <section class="panel">
            <div class="table-wrap">
              <table class="results" id="finding-table"></table>
            </div>
          </section>
        </section>

        <section class="panel" aria-labelledby="register-title">
          <div class="panel-head">
            <h2 id="register-title">The whole form register</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="form-table"></table>
          </div>
        </section>`,

  repairs: `        <div class="controls">
          <label class="sr-only" for="repair-search">Search the repairs</label>
          <input class="search" id="repair-search" type="search" placeholder="Search a form, a finding or an owner" autocomplete="off">
          <div class="views" id="saved-views"></div>
          <button class="button button-secondary button-inline" id="repairs-clear" type="button" hidden>Show every repair</button>
        </div>

        <p class="panel-note" id="repairs-note"></p>

        <section class="open-section" aria-labelledby="state-grid-title">
          <h2 class="sr-only" id="state-grid-title">Choose a state</h2>
          <div class="status-grid" id="state-grid"></div>
        </section>

        <section id="state-view" aria-labelledby="state-title" hidden>
          <div class="category-head">
            <nav class="trail" id="repairs-trail" aria-label="Where you are"></nav>
            <div class="category-heading">
              <h2 id="state-title" tabindex="-1"></h2>
              <p class="panel-note" id="state-note"></p>
            </div>
          </div>
          <p class="panel-note" id="state-detail"></p>
          <ul class="decision-list" id="repair-list"></ul>
        </section>`,

  sources: `        <section class="panel" aria-labelledby="read-title">
          <div class="panel-head">
            <h2 id="read-title">What this board reads</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="source-table"></table>
          </div>
          <p class="panel-note">Read-only. Nothing on this board writes to a source workbook.</p>
        </section>

        <div class="grid">
          <section class="panel span-6" aria-labelledby="counting-title">
            <div class="panel-head">
              <h2 id="counting-title">How the figures are counted</h2>
            </div>
            <dl class="figure-list" id="counting-list"></dl>
          </section>

          <section class="panel span-6" aria-labelledby="gaps-title">
            <div class="panel-head">
              <h2 id="gaps-title">What is not joined up</h2>
            </div>
            <ul class="decision-list" id="gap-list"></ul>
          </section>
        </div>`
};

function filters(withoutRange) {
  const range = withoutRange ? '' : `          <div class="segmented segmented-four" id="range-picker" role="group" aria-label="Period"></div>
`;
  return `        <div class="controls">
${range}          <label class="sr-only" for="college-filter">College</label>
          <select class="select" id="college-filter"></select>
          <label class="sr-only" for="person-filter">Salesperson</label>
          <select class="select" id="person-filter"></select>
          <label class="sr-only" for="lead-search">Search the leads</label>
          <input class="search" id="lead-search" type="search" placeholder="Search a person, a form or a lead" autocomplete="off">
          <div class="views" id="saved-views"></div>
          <button class="button button-secondary button-inline" id="filters-clear" type="button" hidden>Show everything</button>
        </div>`;
}

PAGES.forEach((page) => {
  const body = BODIES[page.script];
  if (!body) throw new Error('no body for ' + page.script);
  fs.writeFileSync(path.join(root, 'pages', page.file), shell(page, body));
});

console.log(`built ${PAGES.length} pages`);
