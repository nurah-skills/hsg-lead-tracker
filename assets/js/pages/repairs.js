setUpShell();

// viewer comes from leads.js, which every page loads
const state = { view: null, search: Params.get('search', '') };

function repairsShown() {
  const search = state.search.trim().toLowerCase();
  return REPAIRS.filter((repair) => !search
    || `${repair.id} ${repair.priority} ${repair.owner} ${repair.problem} ${formName(repair.form)}`.toLowerCase().includes(search));
}

const inState = (key) => repairsShown().filter((repair) => repair.state === key);

function showNote() {
  const rows = repairsShown();
  const filtering = Boolean(state.search.trim());
  document.getElementById('repairs-note').textContent = filtering
    ? `${formatNumber(rows.length)} of ${formatNumber(REPAIRS.length)} repairs, matching “${state.search.trim()}”`
    : `${formatNumber(REPAIRS.length)} repairs on the register · read from the repair tracker at ${SNAPSHOT.repairsRead}`;
  document.getElementById('repairs-clear').hidden = !filtering;
}

function showStates() {
  const grid = document.getElementById('state-grid');
  grid.replaceChildren();

  let drawn = 0;
  REPAIR_STATES.forEach(([key, label, tone, detail]) => {
    const group = inState(key);
    if (!group.length) return;
    drawn += 1;

    const tile = create('button', 'status-tile');
    tile.type = 'button';
    tile.dataset.focus = `state:${key}`;

    const top = create('div', 'status-top');
    top.append(create('b', '', formatNumber(group.length)), create('span', '', group.length === 1 ? 'repair' : 'repairs'));

    tile.append(top, statusChip({ tone, text: label }), create('p', '', detail));
    tile.addEventListener('click', () => {
      Trail.go([key]);
      readUrl(true);
    });
    grid.append(tile);
  });

  if (!drawn) grid.append(create('p', 'empty', 'No repair matches that search.'));
}

function repairCard(repair) {
  const item = create('li');
  const top = create('div', 'decision-top');
  top.append(
    create('h3', '', formName(repair.form)),
    statusChip({ tone: repair.priority === 'P0' ? 'changed' : repair.priority === 'P1' ? 'waiting' : 'info', text: repair.priority })
  );

  const lines = create('dl', 'figure-list');
  [
    ['What was found', repair.problem],
    ['What was done', repair.reported],
    ['What checked it', repair.check],
    ['What to carry forward', repair.lesson]
  ].forEach(([term, value]) => {
    const row = create('div');
    row.append(create('dt', '', term), create('dd', '', value));
    lines.append(row);
  });

  const foot = create('p', 'panel-note', `${repair.id} · ${formName(repair.form)} · found ${readable(repair.found)} · ${repair.owner === 'Not assigned' ? 'nobody assigned' : repair.owner}`);

  item.append(top, lines, foot);

  // Recording a decision is a manager's job. A salesperson sees the entry and not the button.
  if (viewer.manager && repair.state !== 'passed') {
    const button = create('button', 'button button-secondary button-inline');
    button.type = 'button';
    button.append(icon(ICONS.check, 16), document.createTextNode(repair.state === 'needs-repair' ? 'Mark as fixed' : 'Record a passed check'));
    button.addEventListener('click', () => showToast('Sample figures, so nothing is saved. On the real board this would write to the repair tracker and ask for the evidence.'));
    item.append(button);
  }

  return item;
}

function showState() {
  const found = REPAIR_STATES.find(([key]) => key === state.view);
  const rows = inState(state.view);

  buildTrail(document.getElementById('repairs-trail'), [{ label: 'Repairs and checks', path: [] }], (path) => Trail.back(path, () => readUrl(true)));
  document.getElementById('state-title').textContent = found[1];
  document.getElementById('state-note').textContent = `${formatNumber(rows.length)} ${rows.length === 1 ? 'repair' : 'repairs'}`;
  document.getElementById('state-detail').textContent = found[3];

  const list = document.getElementById('repair-list');
  list.replaceChildren();
  if (!rows.length) list.append(create('li', 'empty', 'No repair in this state matches that search.'));
  rows.forEach((repair) => list.append(repairCard(repair)));
}

function render() {
  showNote();
  document.querySelector('.open-section').hidden = Boolean(state.view);
  document.getElementById('state-view').hidden = !state.view;
  if (state.view) showState();
  else showStates();
}

function readUrl(moveFocus) {
  const was = state.view;
  const [key] = Trail.path();
  state.view = REPAIR_STATES.some(([name]) => name === key) ? key : null;
  render();
  if (!moveFocus || state.view === was) return;
  if (state.view) document.getElementById('state-title').focus();
  else {
    const tile = document.querySelector(`[data-focus="state:${was}"]`);
    if (tile) tile.focus();
  }
}

const search = document.getElementById('repair-search');
search.value = state.search;
search.addEventListener('input', (event) => {
  state.search = event.target.value;
  Params.set({ search: state.search });
  render();
});

document.getElementById('repairs-clear').addEventListener('click', () => {
  state.search = '';
  Params.set({ search: '' });
  search.value = '';
  render();
  search.focus();
});

Trail.watch(() => readUrl(true));
readUrl(false);
