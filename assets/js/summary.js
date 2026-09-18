// What this board would tell someone looking at all three at once.
// The hub reads this rather than keeping its own copy of the figures, so the two can never disagree.
// It is loaded by summary.html, which the hub opens in a hidden frame.

const recent = leadsIn({ from: rangeFrom('month'), to: SNAPSHOT.today });
const totals = totalsFor(recent);
const openForms = FORMS.filter(([, , , , found]) => found !== 'live');
const unchecked = REPAIRS.filter((repair) => repair.state === 'fixed');
const unowned = FORMS.filter(([, , , owner, found]) => !owner || found === 'two-owners');

const SUMMARY = {
  board: 'leads',
  name: 'Lead tracker',
  what: 'Where the survey leads went, how long they waited, and what was recorded.',
  home: 'pages/actions.html',
  read: SNAPSHOT.leadsRead,
  needs: [
    {
      count: unowned.length,
      one: 'form needs an owner named', many: 'forms need an owner named',
      href: 'pages/forms.html#no-owner', tone: 'stop'
    },
    {
      count: totals.stale,
      one: 'lead waiting over a week', many: 'leads waiting over a week',
      href: 'pages/waiting.html', tone: 'hold'
    },
    {
      count: openForms.length,
      one: 'form with a finding', many: 'forms with a finding',
      href: 'pages/forms.html', tone: 'hold'
    },
    {
      count: unchecked.length,
      one: 'repair waiting on a check', many: 'repairs waiting on a check',
      href: 'pages/repairs.html#fixed', tone: 'hold'
    }
  ],
  figures: [
    { label: 'Lead records', value: formatNumber(totals.leads), note: 'the last 30 days' },
    { label: 'Something recorded', value: formatPercent(totals.workedRate), note: `${formatNumber(totals.worked)} of ${formatNumber(totals.leads)} records` }
  ]
};

parent.postMessage({ hsgSummary: SUMMARY }, location.origin);
