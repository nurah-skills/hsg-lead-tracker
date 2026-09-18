setUpShell();

const state = { weight: null };

// A note belongs to the selection its lead belongs to
function notesShown() {
  const ids = new Set(leadRows().map((lead) => lead.id));
  return NOTES.filter((note) => ids.has(note.id));
}

const inWeight = (key) => notesShown().filter((note) => noteWeight(note.text) === key);

function showWeights() {
  const grid = document.getElementById('weight-grid');
  grid.replaceChildren();

  let drawn = 0;
  NOTE_WEIGHTS.forEach(([key, label, detail]) => {
    const group = inWeight(key);
    if (!group.length) return;
    drawn += 1;

    const tile = create('button', 'category-tile');
    tile.type = 'button';
    tile.dataset.focus = `weight:${key}`;

    const art = create('span', 'card-art');
    art.append(create('b', '', formatNumber(group.length)), create('span', '', group.length === 1 ? 'note' : 'notes'));

    const body = create('span', 'category-body');
    body.append(create('b', '', label), create('small', '', detail));

    tile.append(art, body);
    tile.addEventListener('click', () => {
      Trail.go([key]);
      readUrl(true);
    });
    grid.append(tile);
  });

  if (!drawn) grid.append(create('p', 'empty', 'Nobody wrote a note against a lead in this selection.'));
}

function showWeight() {
  const weight = NOTE_WEIGHTS.find(([key]) => key === state.weight);
  const rows = inWeight(state.weight);

  buildTrail(document.getElementById('notes-trail'), [{ label: 'Note quality', path: [] }], (path) => Trail.back(path, () => readUrl(true)));
  document.getElementById('weight-title').textContent = weight[1];
  document.getElementById('weight-note').textContent = `${formatNumber(rows.length)} ${rows.length === 1 ? 'note' : 'notes'}`;
  document.getElementById('weight-detail').textContent = weight[2];

  const list = document.getElementById('note-list');
  list.replaceChildren();

  if (!rows.length) {
    list.append(create('li', 'empty', 'No note of this kind matches the filters above.'));
    return;
  }

  rows.slice(0, 120).forEach((note) => {
    const item = create('li');
    const top = create('div', 'decision-top');
    top.append(create('h3', '', note.person), statusChip({
      tone: (LEAD_STATUSES.find(([name]) => name === note.status) || [, 'info'])[1],
      text: note.status || 'No status'
    }));
    item.append(top);
    item.append(create('p', 'note-text', `“${note.text}”`));
    item.append(create('small', '', `${formName(note.form)} · row ${note.row} · ${readable(note.date)} · lead ${note.id}`));
    list.append(item);
  });

  if (rows.length > 120) {
    list.append(create('li', 'empty', `${formatNumber(rows.length - 120)} more notes of this kind. Narrow the filters above to see them.`));
  }
}

function render() {
  const rows = notesShown();
  document.querySelector('.open-section').hidden = Boolean(state.weight);
  document.getElementById('weight-view').hidden = !state.weight;

  const note = document.getElementById('notes-note');
  const leads = leadRows();
  note.textContent = `${formatNumber(rows.length)} notes against ${formatNumber(leads.length)} lead records. A note is judged on its length only — whether the next person could pick the lead up. Nothing here judges the work.`;

  if (state.weight) showWeight();
  else showWeights();
}

function readUrl(moveFocus) {
  const was = state.weight;
  const [key] = Trail.path();
  state.weight = NOTE_WEIGHTS.some(([name]) => name === key) ? key : null;
  render();
  if (!moveFocus || state.weight === was) return;
  if (state.weight) document.getElementById('weight-title').focus();
  else {
    const tile = document.querySelector(`[data-focus="weight:${was}"]`);
    if (tile) tile.focus();
  }
}

setUpLeadFilters(() => readUrl(false));
Trail.watch(() => readUrl(true));
readUrl(false);
