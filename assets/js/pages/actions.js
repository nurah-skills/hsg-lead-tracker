setUpShell();

// The four questions, in the order they can honestly be answered.
// Each one says what it can see and what it cannot, then offers the way in.
function questions(rows) {
  const totals = totalsFor(rows);
  const openForms = FORMS.filter(([, , , , state]) => state !== 'live');
  const unchecked = REPAIRS.filter((repair) => repair.state !== 'passed');

  return [
    {
      title: 'Did every lead arrive?',
      state: openForms.length ? { tone: 'changed', text: 'Not settled' } : { tone: 'good', text: 'Nothing open' },
      detail: `${formatNumber(COVERAGE.forms)} forms are in the register and ${formatNumber(openForms.length)} of them have a finding against them. Nothing here compares submission numbers against what landed in a sheet, so a missing lead would not show up.`,
      action: 'Settle the findings on the forms first. Until a form is confirmed, its leads cannot be counted with any confidence.',
      link: ['forms.html', 'Open forms and alerts']
    },
    {
      title: 'Who owns it?',
      state: { tone: 'waiting', text: `${formatNumber(totals.people)} people in view` },
      detail: `${formatNumber(totals.leads)} lead records in this selection sit with ${formatNumber(totals.people)} salespeople across ${formatNumber(totals.forms)} forms. Two forms have nobody recorded against them at all.`,
      action: 'Give every form one named owner. Two owners is the same as none.',
      link: ['forms.html#no-owner', 'Open the forms with no owner']
    },
    {
      title: 'What happened next?',
      state: totals.workedRate < 0.25 ? { tone: 'changed', text: 'Thin' } : { tone: 'good', text: 'Recorded' },
      detail: `${formatNumber(totals.worked)} of ${formatNumber(totals.leads)} records carry a status, and ${formatNumber(totals.dated)} of those also carry a date. A blank row does not prove nobody phoned — it proves nobody wrote it down.`,
      action: 'Agree that a status and a date go on the row at the time, not at the end of the week.',
      link: ['waiting.html', 'Open the waiting list']
    },
    {
      title: 'Did it become a sale?',
      state: { tone: 'info', text: 'Not joined up' },
      detail: 'Registrations are not matched to the original submissions anywhere on this board. A row marked Sale is what the salesperson recorded, and nothing has checked it.',
      action: 'Match registrations to submission numbers before anyone quotes a conversion rate. This board will not work one out until then.',
      link: ['sources.html', 'Open sources and coverage']
    },
    {
      title: 'Were the repairs checked?',
      state: unchecked.length ? { tone: 'waiting', text: `${formatNumber(unchecked.length)} unchecked` } : { tone: 'good', text: 'All checked' },
      detail: `${formatNumber(REPAIRS.length)} repairs are on the register. ${formatNumber(REPAIRS.filter((r) => r.state === 'passed').length)} were tested after the fix with the evidence written down.`,
      action: 'A repair is not finished until someone submits a test entry and writes down where it landed.',
      link: ['repairs.html#fixed', 'Open the repairs waiting on a check']
    }
  ];
}

function showStartHere(rows) {
  const totals = totalsFor(rows);
  const items = [
    { count: totals.stale, one: 'lead waiting over a week', many: 'leads waiting over a week', href: 'waiting.html', tone: 'is-stop' },
    { count: FORMS.filter(([, , , , state]) => state !== 'live').length, one: 'form with a finding', many: 'forms with a finding', href: 'forms.html', tone: 'is-hold' },
    { count: REPAIRS.filter((repair) => repair.state === 'fixed').length, one: 'repair waiting on a check', many: 'repairs waiting on a check', href: 'repairs.html#fixed', tone: 'is-hold' },
    { count: NOTES.filter((note) => noteWeight(note.text) === 'thin').length, one: 'one-word note', many: 'one-word notes', href: 'notes.html#thin', tone: 'is-hold' }
  ].filter((item) => item.count);

  // The same items, said as one sentence with the figure in it.
  const holder = document.getElementById('start-here');
  holder.replaceChildren(buildBanner(items, {
    action: 'Open the waiting list',
    calmTitle: 'Nothing is waiting on a manager.',
    calmNote: 'Every lead in this selection has something recorded against it.'
  }));
}

function showTiles(rows) {
  const totals = totalsFor(rows);
  const speed = speedOf(rows);
  const days = [...new Set(rows.map((lead) => lead.date))].sort().slice(-10);

  const tiles = [
    {
      label: 'Lead records', icon: ICONS.rows, tone: 'is-info',
      value: formatNumber(totals.leads),
      note: `${formatNumber(totals.people)} salespeople · ${formatNumber(totals.forms)} forms`,
      spark: days.map((date) => rows.filter((lead) => lead.date === date).length),
      sparkLabel: 'Leads arriving on each of the last ten days',
      about: 'One row per submission, counted once. It is what the sheet holds, not what the forms sent — nothing here checks that every submission arrived.'
    },
    {
      label: 'Something recorded', icon: ICONS.check, tone: 'is-good',
      value: formatPercent(totals.workedRate),
      note: `${formatNumber(totals.worked)} of ${formatNumber(totals.leads)} records`,
      spark: WORKED_STATUSES.map((status) => rows.filter((lead) => lead.status === status).length),
      sparkLabel: 'How many carry each status', sparkMark: 'biggest',
      about: 'A status, a note or a worked marker is on the row. It does not prove the person was reached, or that the contact was any good.'
    },
    {
      label: 'Nothing after 7 days', icon: ICONS.alert, tone: 'is-warn',
      value: formatNumber(totals.stale),
      note: 'Counted from the submission date to today',
      spark: AGE_BANDS.map(([key]) => rows.filter((lead) => !lead.status && bandOf(lead.waitingDays) === key).length),
      sparkLabel: 'Leads with nothing recorded, by how long they have waited', sparkMark: 'biggest',
      about: 'Records with nothing written against them a week or more after the form was submitted. Check the sheet before judging anyone: the work may have happened and gone unrecorded.'
    },
    {
      label: 'Days to first evidence', icon: ICONS.clock, tone: '',
      value: speed ? formatNumber(speed.middle) : '—',
      note: speed ? `middle of ${formatNumber(speed.count)} dated records · ${formatNumber(speed.sameDay)} same day` : 'no dated records in this selection',
      about: 'The middle value, not the average, so one very old lead cannot drag it. Only records carrying both a status and a date can be measured at all.'
    }
  ];

  document.getElementById('lead-tiles').replaceChildren(...tiles.map(statTile));
}

function showAges(rows) {
  const waiting = rows.filter((lead) => !lead.status);
  const bars = AGE_BANDS.map(([key, label]) => ({
    label,
    value: waiting.filter((lead) => bandOf(lead.waitingDays) === key).length,
    note: key === 'same-day' ? 'came in today' : ''
  }));
  const holder = document.getElementById('age-chart');
  if (!waiting.length) holder.replaceChildren(create('p', 'empty', 'Every lead in this selection has something recorded against it.'));
  else holder.replaceChildren(barList(bars));
}

function showEvidence(rows) {
  const rings = EVIDENCE_KINDS.map(([key, label], index) => {
    const count = rows.filter((lead) => evidenceOf(lead) === key).length;
    const tone = ['good', 'warn', 'accent'][index] || 'accent';
    return ringChart(rows.length ? count / rows.length : 0, label, `${formatNumber(count)} of ${formatNumber(rows.length)} records`, tone);
  });
  document.getElementById('evidence-rings').replaceChildren(...rings);
}

function showQuestions(rows) {
  const holder = document.getElementById('question-list');
  holder.replaceChildren();
  questions(rows).forEach((item) => {
    const entry = create('li');
    const top = create('div', 'decision-top');
    top.append(create('h3', '', item.title), statusChip(item.state));
    const link = create('a', 'text-link', item.link[1]);
    link.href = item.link[0];
    entry.append(top, create('p', '', item.detail), create('p', 'panel-note', item.action), link);
    holder.append(entry);
  });
}

// Stop, hold and go, the same three colours a status carries everywhere else
const STATUS_COLOURS = {
  good: 'var(--green-ink)',
  waiting: 'var(--yellow-ink)',
  changed: 'var(--red-ink)',
  info: 'var(--field-line)'
};

function showStatuses(rows) {
  const bars = LEAD_STATUSES
    .filter(([name]) => name)
    .map(([name, tone]) => ({ label: name, value: rows.filter((lead) => lead.status === name).length, colour: STATUS_COLOURS[tone] }))
    .filter((row) => row.value)
    .sort((a, b) => b.value - a.value);
  const blank = rows.filter((lead) => !lead.status).length;
  bars.push({ label: 'Nothing recorded', value: blank, colour: 'var(--field-line)' });

  const holder = document.getElementById('status-chart');
  holder.replaceChildren(barList(bars.filter((row) => row.value)));
}

function showSupply(rows) {
  const days = [...new Set(rows.map((lead) => lead.date))].sort();
  const points = days.map((date) => ({ label: readableShort(date), value: rows.filter((lead) => lead.date === date).length }));
  const holder = document.getElementById('supply-chart');
  if (points.length < 2) holder.replaceChildren(create('p', 'empty', 'One day only — pick a longer period to see a shape.'));
  else holder.replaceChildren(areaChart(points, { label: 'Leads arriving by day', key: 'Leads arriving' }));
}

function render() {
  const rows = leadRows();
  showStartHere(rows);
  showLeadNote('lead-note', rows);
  showTiles(rows);
  showAges(rows);
  showEvidence(rows);
  showQuestions(rows);
  showStatuses(rows);
  showSupply(rows);
}

setUpLeadFilters(render);
render();
