// Four pages narrow the same lead records the same way, so the filter bar lives here.
// A salesperson only ever sees their own leads: the filter is set for them and locked.

const viewer = readSession() || {};

const leadState = {
  range: RANGES.some(([key]) => key === Params.get('range', '')) ? Params.get('range', '') : 'month',
  college: Params.get('college', 'All'),
  person: viewer.person || Params.get('person', 'All'),
  search: Params.get('search', '')
};

const rangeLabel = () => (RANGES.find(([key]) => key === leadState.range) || RANGES[2])[1];

function leadRows() {
  const search = leadState.search.trim().toLowerCase();
  return leadsIn({
    from: rangeFrom(leadState.range),
    to: SNAPSHOT.today,
    college: leadState.college,
    person: leadState.person
  }).filter((lead) => !search
    || `${lead.id} ${lead.person} ${lead.form} ${formName(lead.form)} ${lead.status}`.toLowerCase().includes(search));
}

function activeLeadFilters() {
  return [
    leadState.college !== 'All' ? COLLEGE_NAMES[leadState.college] : null,
    leadState.person !== 'All' && !viewer.person ? leadState.person : null,
    leadState.search.trim() ? `“${leadState.search.trim()}”` : null
  ].filter(Boolean);
}

// Something other than the usual thirty days, every college and everyone, is on screen
const leadsFiltered = () => activeLeadFilters().length > 0 || leadState.range !== 'month';

// One line under the filters saying what is on screen and what is filtering it. With
// nothing filtered the figures already say how many they count, so the line only shows
// when it says something the page does not.
function showLeadNote(id, rows) {
  const holder = document.getElementById(id);
  if (!holder) return;
  const filters = activeLeadFilters();
  const period = leadState.range === 'all' ? 'every day the board has read'
    : leadState.range === 'today' ? `today, ${readable(SNAPSHOT.today)}`
      : `the last ${rangeLabel().toLowerCase()} to ${readable(SNAPSHOT.today)}`;
  holder.textContent = `Showing ${formatNumber(rows.length)} lead records · ${period}`
    + (filters.length ? ` · filtered by ${filters.join(' and ')}` : '');
  holder.hidden = !leadsFiltered();
}

// The state of the filter row itself, redrawn whenever a filter moves: whether
// "Show everything" has anything to undo, and what "More filters" is holding.
function showFilterState() {
  const clear = document.getElementById('filters-clear');
  if (clear) clear.hidden = !leadsFiltered();
  showMoreFilters();
}

// The salesperson and saved views live behind "More filters". A filter that is set is
// never out of sight: the button opens by itself on arrival and says how many are on.
let moreFiltersOpen = null;
function showMoreFilters() {
  const button = document.getElementById('more-filters');
  const set = document.getElementById('more-filter-set');
  if (!button || !set) return;
  const on = leadState.person !== 'All' && !viewer.person ? 1 : 0;
  // Opens by itself on arrival when one of its filters is already set (a shared link, a
  // saved view); after that it stays however it was left.
  if (moreFiltersOpen === null) moreFiltersOpen = on > 0;
  set.hidden = !moreFiltersOpen;
  button.setAttribute('aria-expanded', String(moreFiltersOpen));
  button.textContent = moreFiltersOpen ? 'Fewer filters' : on ? `More filters · ${on}` : 'More filters';
}

function clearLeadFilters(redraw) {
  leadState.range = 'month';
  leadState.college = 'All';
  if (!viewer.person) leadState.person = 'All';
  leadState.search = '';
  Params.set({ range: '', college: '', person: '', search: '' });
  const college = document.getElementById('college-filter');
  const person = document.getElementById('person-filter');
  if (college) college.value = 'All';
  if (person && !viewer.person) person.value = 'All';
  const search = document.getElementById('lead-search');
  if (search) search.value = '';
  buildRangePicker(redraw);
  redraw();
  if (college) college.focus();
}

function buildRangePicker(redraw) {
  const holder = document.getElementById('range-picker');
  if (!holder) return;
  buildSegmented(holder, RANGES.map(([key, label]) => [key, label]), leadState.range, (value) => {
    leadState.range = value;
    Params.set({ range: value === 'month' ? '' : value });
    redraw();
  });
}

function fillLeadSelect(id, label, options, value, onChange) {
  const select = document.getElementById(id);
  if (!select) return;
  select.replaceChildren(new Option(label, 'All'), ...options.map(([key, name]) => new Option(name, key)));
  select.value = value;
  select.addEventListener('change', (event) => onChange(event.target.value));
}

// Wires up whichever of the four controls the page actually has
function setUpLeadFilters(draw) {
  const redraw = () => { draw(); showFilterState(); };
  buildRangePicker(redraw);

  fillLeadSelect('college-filter', 'All colleges', COLLEGES.map((key) => [key, COLLEGE_NAMES[key]]), leadState.college, (value) => {
    leadState.college = value;
    Params.set({ college: value });
    redraw();
  });

  const person = document.getElementById('person-filter');
  if (person) {
    if (viewer.person) {
      // A salesperson sees their own leads and nothing else, so the control says so and stays put
      person.replaceChildren(new Option(viewer.person, viewer.person));
      person.value = viewer.person;
      person.disabled = true;
      person.title = 'You are seeing the leads allocated to you.';
    } else {
      fillLeadSelect('person-filter', 'All salespeople', [...PERSON_NAMES].sort().map((name) => [name, name]), leadState.person, (value) => {
        leadState.person = value;
        Params.set({ person: value });
        redraw();
      });
    }
  }

  const search = document.getElementById('lead-search');
  if (search) {
    search.value = leadState.search;
    search.addEventListener('input', (event) => {
      leadState.search = event.target.value;
      Params.set({ search: leadState.search });
      redraw();
    });
  }

  const clear = document.getElementById('filters-clear');
  if (clear) clear.addEventListener('click', () => clearLeadFilters(redraw));

  const more = document.getElementById('more-filters');
  if (more) {
    more.addEventListener('click', () => {
      moreFiltersOpen = !moreFiltersOpen;
      showMoreFilters();
      if (moreFiltersOpen) document.getElementById('person-filter')?.focus();
    });
  }
  showFilterState();
}

// The words a lead's evidence gets, wherever it is shown
function evidenceChip(lead) {
  const kind = EVIDENCE_KINDS.find(([key]) => key === evidenceOf(lead));
  return statusChip({ tone: kind[2], text: kind[1] });
}

const waitingWords = (days) => (days === 0 ? 'Today' : days === 1 ? '1 day' : `${formatNumber(days)} days`);
