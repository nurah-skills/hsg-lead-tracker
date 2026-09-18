setUpShell();

function showSources() {
  const table = document.getElementById('source-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Workbook', 'Tabs read', 'Last read', 'What it holds'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  SOURCES.forEach((source) => {
    const row = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', source.name));

    const read = create('td', 'cell-status');
    read.append(source.read === 'Not connected'
      ? statusChip({ tone: 'changed', text: 'Not connected' })
      : statusChip({ tone: 'good', text: source.read }));

    row.append(first, create('td', 'cell-best', formatNumber(source.tabs)), read, create('td', '', source.holds));
    body.append(row);
  });

  table.append(head, body);
  labelCells(table);
}

function showCounting() {
  const rows = [
    ['A lead record', 'One row per submission on a salesperson’s tab. Counted once, even where the same person filled in two forms.'],
    ['Something recorded', 'A status, a note or a worked marker is on the row. It does not prove the person was reached.'],
    ['Days to first evidence', 'From the submission date to the first date written against the row. Only rows carrying both can be measured.'],
    ['Waiting', 'From the submission date to today, for rows with nothing recorded. It does not prove nobody phoned.'],
    ['A form with a finding', 'A check on the register found something: no owner, two owners, a destination we cannot match, a link that errors.'],
    ['A repair that passed', 'Somebody submitted a test entry after the fix and wrote down where it landed.']
  ];

  const holder = document.getElementById('counting-list');
  holder.replaceChildren();
  rows.forEach(([term, value]) => {
    const row = create('div');
    row.append(create('dt', '', term), create('dd', '', value));
    holder.append(row);
  });
}

function showGaps() {
  const gaps = [
    {
      title: 'Submissions are not reconciled',
      detail: 'Nothing compares the submission numbers a form issued against the rows that reached a sheet. A lead that never arrived would not appear anywhere on this board, so no figure here can be read as “every lead”.',
      action: 'Reconcile submission numbers to sheet rows before anyone treats a total as complete.'
    },
    {
      title: 'Registrations are not matched to submissions',
      detail: 'A row marked Sale is what the salesperson wrote. No registration has been matched back to the submission that started it.',
      action: 'Match registrations to submission numbers. Until then this board works out no conversion rate at all, and neither should anyone reading it.'
    },
    {
      title: 'A form is discovered, not listed',
      detail: 'The register holds the forms somebody told us about. A form built elsewhere and never reported is invisible to every count here.',
      action: 'Agree one place where a new form is registered on the day it is built.'
    },
    {
      title: 'Nothing here judges the work',
      detail: 'Note quality is measured on length alone — whether the next person could pick the lead up. It says nothing about whether the call was any good.',
      action: 'Keep it that way. A board that scores people on their notes gets better notes, not better follow-up.'
    }
  ];

  const holder = document.getElementById('gap-list');
  holder.replaceChildren();
  gaps.forEach((gap) => {
    const item = create('li');
    const top = create('div', 'decision-top');
    top.append(create('h3', '', gap.title), statusChip({ tone: 'info', text: 'Not joined up' }));
    item.append(top, create('p', '', gap.detail), create('p', 'panel-note', gap.action));
    holder.append(item);
  });
}

showSources();
showCounting();
showGaps();
