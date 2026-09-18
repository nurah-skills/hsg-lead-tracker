setUpShell();

const state = {
  finding: null,
  college: Params.get('college', 'All'),
  search: Params.get('search', '')
};

function formsShown() {
  const search = state.search.trim().toLowerCase();
  return FORMS.filter(([code, name, college, owner]) =>
    (state.college === 'All' || college === state.college)
    && (!search || `${code} ${name} ${owner || ''}`.toLowerCase().includes(search)));
}

const withFinding = (key) => formsShown().filter(([, , , , found]) => found === key);

function activeFilters() {
  return [
    state.college !== 'All' ? COLLEGE_NAMES[state.college] : null,
    state.search.trim() ? `“${state.search.trim()}”` : null
  ].filter(Boolean);
}

function showNote() {
  const rows = formsShown();
  const filters = activeFilters();
  const open = rows.filter(([, , , , found]) => found !== 'live').length;
  document.getElementById('forms-note').textContent = filters.length
    ? `${formatNumber(rows.length)} of ${formatNumber(FORMS.length)} forms, filtered by ${filters.join(' and ')} · ${formatNumber(open)} with a finding`
    : `${formatNumber(FORMS.length)} forms in the register · ${formatNumber(open)} with a finding against them`;
  document.getElementById('forms-clear').hidden = !filters.length;
}

function clearFilters() {
  state.college = 'All';
  state.search = '';
  Params.set({ college: '', search: '' });
  document.getElementById('form-college').value = 'All';
  document.getElementById('form-search').value = '';
  render();
  document.getElementById('form-college').focus();
}

function showFindings() {
  const grid = document.getElementById('finding-grid');
  grid.replaceChildren();

  let drawn = 0;
  FORM_FINDINGS.forEach(([key, label, detail]) => {
    const group = withFinding(key);
    if (!group.length) return;
    drawn += 1;

    const tile = create('button', 'category-tile');
    tile.type = 'button';
    tile.dataset.focus = `finding:${key}`;

    const art = create('span', 'card-art');
    art.append(create('b', '', formatNumber(group.length)), create('span', '', group.length === 1 ? 'form' : 'forms'));

    const body = create('span', 'category-body');
    body.append(create('b', '', label), create('small', '', detail));

    tile.append(art, body);
    tile.addEventListener('click', () => {
      Trail.go([key]);
      readUrl(true);
    });
    grid.append(tile);
  });

  if (!drawn) grid.append(create('p', 'empty', 'No finding is open against a form in this selection.'));
}

function formRow(entry, withFindingColumn) {
  const [code, name, college, owner, found] = entry;
  const row = create('tr');
  const first = create('th', 'cell-name');
  first.scope = 'row';
  first.append(create('b', '', name), create('small', '', `${code} · ${COLLEGE_NAMES[college]}`));

  const person = create('td');
  if (owner) person.append(create('b', '', owner));
  else person.append(statusChip({ tone: 'changed', text: 'Nobody recorded' }));

  const cells = [first, person];
  if (withFindingColumn) {
    const finding = create('td', 'cell-status');
    finding.append(found === 'live'
      ? statusChip({ tone: 'good', text: 'Nothing open' })
      : statusChip({ tone: 'changed', text: FINDING_NAMES[found] }));
    cells.push(finding);
  }

  const leads = LEADS.filter((lead) => lead.form === code).length;
  cells.push(create('td', 'cell-cash', formatNumber(leads)));

  row.append(...cells);
  return row;
}

function showFinding() {
  const finding = FORM_FINDINGS.find(([key]) => key === state.finding);
  const rows = withFinding(state.finding);

  buildTrail(document.getElementById('forms-trail'), [{ label: 'Forms and alerts', path: [] }], (path) => Trail.back(path, () => readUrl(true)));
  document.getElementById('finding-title').textContent = finding[1];
  document.getElementById('finding-note').textContent = `${formatNumber(rows.length)} ${rows.length === 1 ? 'form' : 'forms'}`;
  document.getElementById('finding-detail').textContent = finding[2];

  const table = document.getElementById('finding-table');
  table.replaceChildren();
  const head = create('thead');
  const headRow = create('tr');
  ['Form', 'Recorded owner', 'Leads on the sheet'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  if (!rows.length) {
    const line = create('tr');
    const cell = create('td', 'is-empty', 'No form of this kind matches the filters above.');
    cell.colSpan = 3;
    line.append(cell);
    body.append(line);
  }
  rows.forEach((entry) => body.append(formRow(entry, false)));
  table.append(head, body);
  labelCells(table);
}

function showRegister() {
  const table = document.getElementById('form-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Form', 'Recorded owner', 'What a check found', 'Leads on the sheet'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const rows = formsShown();
  const body = create('tbody');
  if (!rows.length) {
    const line = create('tr');
    const cell = create('td', 'is-empty', 'No form matches this selection.');
    cell.colSpan = 4;
    line.append(cell);
    body.append(line);
  }
  rows.forEach((entry) => body.append(formRow(entry, true)));
  table.append(head, body);
  labelCells(table);
}

function render() {
  showNote();
  document.querySelector('.open-section').hidden = Boolean(state.finding);
  document.getElementById('finding-view').hidden = !state.finding;
  if (state.finding) showFinding();
  else showFindings();
  showRegister();
}

function readUrl(moveFocus) {
  const was = state.finding;
  const [key] = Trail.path();
  state.finding = FORM_FINDINGS.some(([name]) => name === key) ? key : null;
  render();
  if (!moveFocus || state.finding === was) return;
  if (state.finding) document.getElementById('finding-title').focus();
  else {
    const tile = document.querySelector(`[data-focus="finding:${was}"]`);
    if (tile) tile.focus();
  }
}

const college = document.getElementById('form-college');
college.replaceChildren(new Option('All colleges', 'All'), ...COLLEGES.map((key) => new Option(COLLEGE_NAMES[key], key)));
college.value = state.college;
college.addEventListener('change', (event) => {
  state.college = event.target.value;
  Params.set({ college: state.college });
  render();
});

const search = document.getElementById('form-search');
search.value = state.search;
search.addEventListener('input', (event) => {
  state.search = event.target.value;
  Params.set({ search: state.search });
  render();
});

document.getElementById('forms-clear').addEventListener('click', clearFilters);

Trail.watch(() => readUrl(true));
readUrl(false);
