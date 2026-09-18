setUpShell();

const state = { band: null };

// Only leads with nothing recorded can be "waiting" — a status closes the question
const waitingRows = () => leadRows().filter((lead) => !lead.status);

const inBand = (band) => waitingRows().filter((lead) => bandOf(lead.waitingDays) === band);

function showBands() {
  const grid = document.getElementById('band-grid');
  grid.replaceChildren();

  let drawn = 0;
  [...AGE_BANDS].reverse().forEach(([key, label]) => {
    const group = inBand(key);
    if (!group.length) return;
    drawn += 1;

    const tile = create('button', 'status-tile');
    tile.type = 'button';
    tile.dataset.focus = `band:${key}`;

    const top = create('div', 'status-top');
    top.append(create('b', '', formatNumber(group.length)), create('span', '', group.length === 1 ? 'lead' : 'leads'));

    const tone = key === '15+' || key === '8-14' ? 'changed' : key === '4-7' ? 'waiting' : 'good';
    const chip = statusChip({ tone, text: label });

    const people = new Set(group.map((lead) => lead.person)).size;
    tile.append(top, chip, create('p', '', `${formatNumber(people)} ${people === 1 ? 'salesperson' : 'salespeople'}`));
    tile.addEventListener('click', () => {
      Trail.go([key]);
      readUrl(true);
    });
    grid.append(tile);
  });

  if (!drawn) grid.append(create('p', 'empty', 'Every lead in this selection has something recorded against it.'));
}

function showBand() {
  const band = AGE_BANDS.find(([key]) => key === state.band);
  const rows = [...inBand(state.band)].sort((a, b) => b.waitingDays - a.waitingDays);

  const panel = document.getElementById('waiting-panel');
  panel.hidden = false;
  document.getElementById('waiting-title').textContent = `Waiting ${band[1].toLowerCase()}`;

  const table = document.getElementById('waiting-table');
  table.replaceChildren();
  picker.keepOnly(rows.map((lead) => lead.id));

  const head = create('thead');
  const headRow = create('tr');
  headRow.append(picker.headCell());
  ['Lead', 'Form', 'Salesperson', 'Came in', 'Waiting'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  if (!rows.length) {
    const line = create('tr');
    const cell = create('td', 'is-empty', 'Nothing in this band matches the filters above.');
    cell.colSpan = 6;
    line.append(cell);
    body.append(line);
  }

  rows.slice(0, 200).forEach((lead) => {
    const line = create('tr');
    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', lead.id), create('small', '', COLLEGE_NAMES[lead.college]));
    const waited = create('td', 'cell-cash');
    waited.append(statusChip({ tone: lead.waitingDays >= 8 ? 'changed' : lead.waitingDays >= 4 ? 'waiting' : 'good', text: waitingWords(lead.waitingDays) }));
    line.append(
      picker.cell(lead.id, lead.id),
      first,
      create('td', '', formName(lead.form)),
      create('td', '', lead.person),
      create('td', '', readable(lead.date)),
      waited
    );
    body.append(line);
  });
  table.append(head, body);
  labelCells(table);
  showPicked();

  const note = document.getElementById('waiting-note');
  note.textContent = rows.length > 200
    ? `${formatNumber(rows.length)} leads waiting ${band[1].toLowerCase()} · showing the 200 that have waited longest`
    : `${formatNumber(rows.length)} ${rows.length === 1 ? 'lead' : 'leads'} waiting ${band[1].toLowerCase()}`;
}

const picker = rowPicker(() => showPicked());

function showPicked() {
  const button = document.getElementById('waiting-export');
  if (!button) return;
  button.querySelector('span').textContent = picker.size
    ? `Export the ${formatNumber(picker.size)} you picked`
    : 'Export these rows';
}

function render() {
  const waiting = waitingRows();
  document.getElementById('waiting-panel').hidden = !state.band;
  document.querySelector('.open-section').hidden = Boolean(state.band);

  if (state.band) {
    showBand();
    return;
  }

  showBands();
  const note = document.getElementById('waiting-note');
  const people = new Set(waiting.map((lead) => lead.person)).size;
  note.textContent = waiting.length
    ? `${formatNumber(waiting.length)} leads with nothing recorded, across ${formatNumber(people)} ${people === 1 ? 'salesperson' : 'salespeople'}. Choose how long they have waited.`
    : 'Nothing is waiting in this selection.';
}

function readUrl(moveFocus) {
  const was = state.band;
  const [key] = Trail.path();
  state.band = AGE_BANDS.some(([name]) => name === key) ? key : null;
  render();
  if (!moveFocus || state.band === was) return;
  if (state.band) document.getElementById('waiting-title').focus();
  else {
    const tile = document.querySelector(`[data-focus="band:${was}"]`);
    if (tile) tile.focus();
  }
}

const exportRows = exportButton('Export these rows', () => {
  const rows = [...inBand(state.band)].sort((a, b) => b.waitingDays - a.waitingDays);
  const chosen = picker.size ? rows.filter((lead) => picker.has(lead.id)) : rows;
  downloadRows(
    'leads-waiting',
    ['Lead', 'Form', 'Form name', 'College', 'Salesperson', 'Came in', 'Days waiting'],
    chosen.map((lead) => [lead.id, lead.form, formName(lead.form), COLLEGE_NAMES[lead.college], lead.person, lead.date, lead.waitingDays])
  );
});
exportRows.id = 'waiting-export';
document.getElementById('waiting-panel').querySelector('.panel-head').append(exportRows);

setUpLeadFilters(() => readUrl(false));
Trail.watch(() => readUrl(true));
readUrl(false);
