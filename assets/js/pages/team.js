setUpShell();

const state = { person: null };

function rowsFor(person) {
  return leadRows().filter((lead) => lead.person === person);
}

function personSummary(rows) {
  const totals = totalsFor(rows);
  const speed = speedOf(rows);
  const days = Math.max(1, [...new Set(rows.map((lead) => lead.date))].length);
  return {
    leads: totals.leads,
    perDay: totals.leads / days,
    worked: totals.worked,
    workedRate: totals.workedRate,
    stale: totals.stale,
    middle: speed ? speed.middle : null,
    dated: speed ? speed.count : 0
  };
}

function showTiles(rows) {
  const totals = totalsFor(rows);
  const people = [...new Set(rows.map((lead) => lead.person))];
  const busiest = people
    .map((person) => ({ person, count: rows.filter((lead) => lead.person === person).length }))
    .sort((a, b) => b.count - a.count)[0];
  const nothing = people.filter((person) => !rows.some((lead) => lead.person === person && lead.status)).length;

  const tiles = [
    {
      label: 'Salespeople in view', icon: ICONS.person, tone: 'is-info',
      value: formatNumber(people.length),
      note: `${formatNumber(PERSON_NAMES.length)} on the sheet altogether`,
      about: 'People with at least one lead in this selection. Somebody with no leads in the period will not appear.'
    },
    {
      label: 'Leads each', icon: ICONS.rows, tone: '',
      value: people.length ? formatNumber(totals.leads / people.length) : '0',
      note: busiest ? `most is ${formatNumber(busiest.count)}, ${busiest.person}` : 'nothing in this selection',
      about: 'The plain average. Leads are not shared out evenly, so read the table rather than this one figure.'
    },
    {
      label: 'Something recorded', icon: ICONS.check, tone: 'is-good',
      value: formatPercent(totals.workedRate),
      note: `${formatNumber(totals.worked)} of ${formatNumber(totals.leads)} records`,
      about: 'Across everyone in view. A person with ten leads and a person with four hundred both count once per record here.'
    },
    {
      label: 'Nobody recorded anything', icon: ICONS.alert, tone: 'is-warn',
      value: formatNumber(nothing),
      note: 'people with no status on any lead in view',
      about: 'It may mean the work was not written down rather than not done. Ask before acting on it.'
    }
  ];

  document.getElementById('team-tiles').replaceChildren(...tiles.map(statTile));
}

function showTable(rows) {
  const table = document.getElementById('team-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Salesperson', 'Leads given', 'A day', 'Recorded', 'Days to first evidence', 'Waiting over a week'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const people = [...new Set(rows.map((lead) => lead.person))]
    .map((person) => ({ person, ...personSummary(rows.filter((lead) => lead.person === person)) }))
    .sort((a, b) => b.leads - a.leads);

  const body = create('tbody');
  if (!people.length) {
    const line = create('tr');
    const cell = create('td', 'is-empty', 'Nobody has a lead in this selection.');
    cell.colSpan = 6;
    line.append(cell);
    body.append(line);
  }

  people.forEach((row) => {
    const line = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    const open = create('button', 'text-link', row.person);
    open.type = 'button';
    open.dataset.focus = `person:${row.person}`;
    open.addEventListener('click', () => {
      Trail.go([row.person]);
      readUrl(true);
    });
    first.append(open, create('small', '', COLLEGE_NAMES[COLLEGE_OF[row.person]]));

    const recorded = create('td', 'cell-status');
    recorded.append(statusChip({
      tone: row.workedRate >= 0.3 ? 'good' : row.workedRate >= 0.15 ? 'waiting' : 'changed',
      text: `${formatPercent(row.workedRate)}`
    }));

    line.append(
      first,
      create('td', 'cell-best', formatNumber(row.leads)),
      create('td', 'cell-best', row.perDay.toFixed(1)),
      recorded,
      create('td', 'cell-best', row.middle === null ? '—' : formatNumber(row.middle)),
      create('td', 'cell-cash', formatNumber(row.stale))
    );
    body.append(line);
  });

  table.append(head, body);
  labelCells(table);
}

function showPerson() {
  const rows = rowsFor(state.person);
  const summary = personSummary(rows);
  buildTrail(document.getElementById('person-trail'), [{ label: 'By salesperson', path: [] }], (path) => Trail.back(path, () => readUrl(true)));
  document.getElementById('person-title').textContent = state.person;
  // The college only: how many leads they were given is the first figure below
  document.getElementById('person-note').textContent = COLLEGE_NAMES[COLLEGE_OF[state.person]];

  const tiles = [
    { label: 'Leads given', value: formatNumber(summary.leads), note: `${summary.perDay.toFixed(1)} a day`, icon: ICONS.rows, tone: 'is-info' },
    { label: 'Something recorded', value: formatPercent(summary.workedRate), note: `${formatNumber(summary.worked)} records`, icon: ICONS.check, tone: 'is-good' },
    { label: 'Days to first evidence', value: summary.middle === null ? '—' : formatNumber(summary.middle), note: `${formatNumber(summary.dated)} dated records`, icon: ICONS.clock, tone: '' },
    { label: 'Waiting over a week', value: formatNumber(summary.stale), note: 'nothing recorded yet', icon: ICONS.alert, tone: 'is-warn' }
  ];
  document.getElementById('person-tiles').replaceChildren(...tiles.map(statTile));

  const table = document.getElementById('person-table');
  table.replaceChildren();
  const head = create('thead');
  const headRow = create('tr');
  ['Lead', 'Form', 'Came in', 'Waiting', 'Recorded'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  [...rows].sort((a, b) => b.waitingDays - a.waitingDays).slice(0, 60).forEach((lead) => {
    const line = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', lead.id), create('small', '', COLLEGE_NAMES[lead.college]));
    const recorded = create('td', 'cell-status');
    recorded.append(lead.status ? statusChip({ tone: (LEAD_STATUSES.find(([name]) => name === lead.status) || [, 'info'])[1], text: lead.status }) : evidenceChip(lead));
    line.append(
      first,
      create('td', '', formName(lead.form)),
      create('td', '', readable(lead.date)),
      create('td', 'cell-cash', waitingWords(lead.waitingDays)),
      recorded
    );
    body.append(line);
  });
  table.append(head, body);
  labelCells(table);

  if (rows.length > 60) {
    document.getElementById('person-note').textContent += ' · showing the 60 that have waited longest';
  }
}

function render() {
  const rows = leadRows();
  document.getElementById('team-panel').hidden = Boolean(state.person);
  document.getElementById('person-view').hidden = !state.person;
  showLeadNote('team-note', rows);
  document.querySelector('.tiles').hidden = Boolean(state.person);

  if (state.person) showPerson();
  else {
    showTiles(rows);
    showTable(rows);
  }
}

// The address bar decides whose leads are on screen
function readUrl(moveFocus) {
  const was = state.person;
  const [name] = Trail.path();
  state.person = PERSON_NAMES.includes(name) ? name : null;
  render();
  if (!moveFocus || state.person === was) return;
  if (state.person) document.getElementById('person-title').focus();
  else {
    const button = document.querySelector(`[data-focus="person:${was}"]`);
    if (button) button.focus();
  }
}

setUpLeadFilters(() => readUrl(false));
Trail.watch(() => readUrl(true));
readUrl(false);
