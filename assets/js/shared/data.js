// Every figure on this board is made up. No real person, form, lead or sheet is in here.
// The shapes match what the real trackers hold, so the counting rules can be read and argued with.

const SNAPSHOT = {
  leadsRead: '18 September 2026 at 06:40 SAST',
  leadsReadShort: '18 Sep, 06:40',
  formsRead: '17 September 2026 at 21:01 SAST',
  repairsRead: '17 September 2026 at 21:01 SAST',
  today: '2026-09-18'
};

const COLLEGES = ['SA', 'MC', 'BV'];
const COLLEGE_NAMES = { SA: 'Skills Academy', MC: 'Matric College', BV: 'Bellview' };

// Each college is drawn in the colour it uses on its own material
const COLLEGE_COLOURS = {
  SA: 'var(--college-sa)',
  MC: 'var(--college-mc)',
  BV: 'var(--college-bv)'
};

// The people who work leads in this sample
const PEOPLE = [
  ['Lerato Mokoena', 'SA'], ['Sipho Dlamini', 'SA'], ['Ayesha Patel', 'SA'], ['Johan van Wyk', 'SA'],
  ['Nomsa Khumalo', 'SA'], ['Thandeka Zulu', 'SA'], ['Megan Fourie', 'SA'], ['Karabo Radebe', 'SA'],
  ['Naledi Sithole', 'MC'], ['Craig Jacobs', 'MC'], ['Zanele Ndlovu', 'MC'], ['Pieter Marais', 'MC'],
  ['Fatima Adams', 'MC'], ['Tebogo Mahlangu', 'MC'], ['Chantel du Toit', 'MC'], ['Bongani Nkosi', 'MC'],
  ['Kagiso Tau', 'BV'], ['Chloe Naidoo', 'BV'], ['Margaret Mthembu', 'BV'], ['Ruan Steyn', 'BV'],
  ['Zinhle Mabaso', 'BV'], ['Elton Pillay', 'BV'], ['Palesa Motaung', 'BV'], ['Marli Erasmus', 'BV'],
  ['Refilwe Seleka', 'SA'], ['Hendrik Coetzee', 'MC'], ['Nandi Dube', 'BV'], ['Imran Ismail', 'SA'],
  ['Lindiwe Maseko', 'MC'], ['Riaan Nel', 'BV'], ['Boitumelo Phiri', 'SA'], ['Jade Williams', 'MC'],
  ['Sibusiso Gumede', 'BV']
];

const PERSON_NAMES = PEOPLE.map(([name]) => name);
const COLLEGE_OF = Object.fromEntries(PEOPLE);

// The forms leads come in on. A form belongs to a college and, usually, to one person.
const FORMS = [
  ['F-101', 'Adult matric readiness check', 'SA', 'Lerato Mokoena', 'live'],
  ['F-102', 'Career direction quiz', 'SA', 'Sipho Dlamini', 'live'],
  ['F-103', 'Study without matric — what are my options?', 'SA', 'Ayesha Patel', 'live'],
  ['F-104', 'Can my employer pay for my studies?', 'SA', 'Johan van Wyk', 'broken-link'],
  ['F-105', 'ICB course finder', 'SA', 'Nomsa Khumalo', 'live'],
  ['F-106', 'Bookkeeping starter check', 'SA', 'Thandeka Zulu', 'live'],
  ['F-107', 'Afrikaans matriek opname', 'SA', 'Megan Fourie', 'live'],
  ['F-108', 'R390 offer — matric courses', 'SA', 'Karabo Radebe', 'live'],
  ['F-201', 'Matric rewrite readiness', 'MC', 'Naledi Sithole', 'live'],
  ['F-202', 'Which matric route suits me?', 'MC', 'Craig Jacobs', 'live'],
  ['F-203', 'Second chance matric enquiry', 'MC', 'Zanele Ndlovu', 'no-connection'],
  ['F-204', 'Matric subject chooser', 'MC', 'Pieter Marais', 'live'],
  ['F-205', 'Adult matric — evening classes', 'MC', 'Fatima Adams', 'live'],
  ['F-206', 'R450 offer — matric support', 'MC', 'Tebogo Mahlangu', 'live'],
  ['F-207', 'Matric results help', 'MC', 'Chantel du Toit', 'redirect-conflict'],
  ['F-301', 'ECD practitioner — is it for me?', 'BV', 'Kagiso Tau', 'live'],
  ['F-302', 'Childcare course finder', 'BV', 'Chloe Naidoo', 'live'],
  ['F-303', 'Occupational health and safety check', 'BV', 'Margaret Mthembu', 'live'],
  ['F-304', 'Employer funded study enquiry', 'BV', 'Ruan Steyn', 'redirect-conflict'],
  ['F-305', 'Beauty therapy course quiz', 'BV', 'Zinhle Mabaso', 'live'],
  ['F-306', 'Find the right study path', 'BV', 'Elton Pillay', 'live'],
  ['F-307', 'Bellview general enquiry', 'BV', null, 'no-owner'],
  ['F-308', 'Skills top-up — short courses', 'BV', 'Palesa Motaung', 'duplicate'],
  ['F-401', 'Reactivation — old enquiries', 'SA', null, 'no-owner'],
  ['F-402', 'Free course interest check', 'MC', 'Lindiwe Maseko', 'needs-review'],
  ['F-403', 'Funding options quiz', 'BV', 'Riaan Nel', 'needs-review'],
  ['F-404', 'Multi-college course matcher', 'SA', 'Imran Ismail', 'two-owners'],
  ['F-405', 'Weekend classes enquiry', 'MC', 'Jade Williams', 'needs-review'],
  ['F-406', 'Bursary interest form', 'BV', 'Sibusiso Gumede', 'destination-unclear'],
  ['F-407', 'Course brochure request', 'SA', 'Boitumelo Phiri', 'live']
];

// What a check on a form can find. The key is what the address bar uses.
const FORM_FINDINGS = [
  ['redirect-conflict', 'Points at the wrong person', 'The form sends its submissions to a salesperson other than the one recorded against it. The count is of forms, not of messages that went astray.'],
  ['no-connection', 'No visible sheet connection', 'The form is published but nothing shows it writing to a response sheet. It may be retired, or the connection may be hidden from us.'],
  ['needs-review', 'Purpose not confirmed', 'Nobody has confirmed whether this form is still used for sales. A published form is not proof that it is.'],
  ['no-owner', 'No salesperson recorded', 'Submissions arrive with nobody named to work them.'],
  ['two-owners', 'More than one owner recorded', 'Two people are recorded against the same form, so neither is accountable for it.'],
  ['destination-unclear', 'Destination needs checking', 'The response sheet it writes to could not be matched to a workbook we read.'],
  ['duplicate', 'Listed twice in the inventory', 'The same form appears under two entries, so its leads may be counted twice.'],
  ['broken-link', 'Public link returns an error', 'The published address returns an error, so anyone following it reaches nothing.']
];

const FINDING_NAMES = Object.fromEntries(FORM_FINDINGS.map(([key, label]) => [key, label]));

// Same seed gives the same figures on every visit
function seededRandom(text) {
  let seed = 0;
  for (const character of text) seed = (seed * 31 + character.charCodeAt(0)) | 0;
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

const shiftDays = (date, days) => new Date(Date.parse(date + 'T00:00:00Z') + days * 86400000).toISOString().slice(0, 10);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const readable = (date) => `${Number(date.slice(8))} ${MONTHS[Number(date.slice(5, 7)) - 1]}`;
const readableShort = (date) => `${Number(date.slice(8))} ${MONTHS[Number(date.slice(5, 7)) - 1].slice(0, 3)}`;
const daysBetween = (from, to) => Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000);

// What a salesperson can record against a lead. These are the words the sheet allows.
const LEAD_STATUSES = [
  ['Workable', 'good', 'Worth working. Contact has been made or is under way.'],
  ['Appointment', 'good', 'A time has been agreed with the person.'],
  ['Sale', 'good', 'Recorded as a sale by the salesperson. Self-reported until a registration is matched.'],
  ['Voicemail', 'waiting', 'A message was left. Nothing says it was heard.'],
  ['WhatsApp', 'waiting', 'A WhatsApp was sent. Delivery is not proof of a reply.'],
  ['SMS', 'waiting', 'An SMS was sent.'],
  ['Dud', 'changed', 'Marked as not worth working: wrong number, no interest or a test entry.'],
  ['', 'info', 'Nothing recorded yet.']
];

const WORKED_STATUSES = LEAD_STATUSES.map(([name]) => name).filter(Boolean);

// The leads themselves: one row per submission, the way the sheet holds them
function buildLeads() {
  const random = seededRandom('hsg tally leads 2026');
  const live = FORMS.filter(([, , , , state]) => state !== 'no-connection');
  const rows = [];
  let id = 1000;

  for (let back = 0; back < 45; back += 1) {
    const date = shiftDays(SNAPSHOT.today, -back);
    const weekday = new Date(date + 'T00:00:00Z').getUTCDay();
    const perDay = weekday === 0 || weekday === 6 ? 14 + Math.floor(random() * 14) : 55 + Math.floor(random() * 45);

    for (let n = 0; n < perDay; n += 1) {
      const form = live[Math.floor(random() * live.length)];
      const [formId, , college, owner] = form;
      const person = owner || PERSON_NAMES[Math.floor(random() * PERSON_NAMES.length)];
      id += 1;

      // Older leads are more likely to have been worked; the newest often have nothing yet
      const chance = back < 2 ? 0.05 : back < 8 ? 0.12 : 0.24;
      const worked = random() < chance;
      const status = worked ? WORKED_STATUSES[Math.floor(random() * WORKED_STATUSES.length)] : '';
      // Some rows carry a status with no date beside it, which is weaker evidence than both
      const dated = worked && random() < 0.72;
      const repliedAfter = dated ? Math.floor(random() * Math.min(back + 1, 9)) : null;

      rows.push({
        id: `TS-${id}`,
        date,
        form: formId,
        college,
        person,
        status,
        firstEvidence: repliedAfter === null ? null : shiftDays(date, repliedAfter),
        waitingDays: daysBetween(date, SNAPSHOT.today)
      });
    }
  }
  return rows;
}

const LEADS = buildLeads();

// The notes people actually wrote. Short, plain, and sometimes not much use — that is the point.
const NOTE_TEXTS = [
  'Left a voice message and sent a mail',
  'She will call me back on Thursday',
  'Sent a WhatsApp asking for a good time to call',
  'No answer, tried twice',
  'Wrong number on the form',
  'Wants the fee sheet before deciding',
  'Asked for the brochure, sending today',
  'Not interested, already registered elsewhere',
  'Will send payslips for the funding check',
  'Phone off, will try again Monday',
  'Booked for a campus visit on the 24th',
  'Says the form was filled in by mistake',
  'Sent the application link',
  'Asked to be called after five',
  'Following up next week',
  'Sale',
  'Dud',
  'Called'
];

// A note belongs to a lead that has been worked. Quality is judged by length and what it says,
// never by a machine — the board only counts and shows.
function buildNotes() {
  const random = seededRandom('hsg tally notes');
  return LEADS
    .filter((lead) => lead.status && random() < 0.45)
    .map((lead, index) => ({
      ...lead,
      text: NOTE_TEXTS[Math.floor(random() * NOTE_TEXTS.length)],
      row: 2 + index
    }));
}

const NOTES = buildNotes();

// A note that is one word says almost nothing. This is a length rule, not a judgement of the work.
const noteWeight = (text) => {
  const words = text.trim().split(/\s+/).length;
  if (words <= 1) return 'thin';
  if (words <= 4) return 'short';
  return 'full';
};

const NOTE_WEIGHTS = [
  ['full', 'Says what happened', 'Five words or more. Enough for someone else to pick the lead up.'],
  ['short', 'Barely a note', 'Two to four words. It records that something happened, not what.'],
  ['thin', 'One word', 'A single word such as “Called” or “Dud”. It cannot be checked or handed over.']
];

// The evidence a lead has, in the order the board trusts it
function evidenceOf(lead) {
  if (lead.status && lead.firstEvidence) return 'recorded';
  if (lead.status) return 'status-only';
  return 'none';
}

const EVIDENCE_KINDS = [
  ['recorded', 'Status and a date', 'good'],
  ['status-only', 'A status, no date', 'waiting'],
  ['none', 'Nothing recorded', 'changed']
];

// How long a lead has been waiting, in bands a person can act on
const AGE_BANDS = [
  ['same-day', 'Same day', 0, 0],
  ['1-3', '1 to 3 days', 1, 3],
  ['4-7', '4 to 7 days', 4, 7],
  ['8-14', '8 to 14 days', 8, 14],
  ['15+', '15 days or more', 15, 9999]
];

const bandOf = (days) => (AGE_BANDS.find(([, , from, to]) => days >= from && days <= to) || AGE_BANDS[AGE_BANDS.length - 1])[0];

// The repair register: a problem found on a form, what was done and whether anyone checked it
const REPAIR_STATES = [
  ['needs-repair', 'Needs repair', 'changed', 'Reported and not yet fixed.'],
  ['fixed', 'Fixed, waiting on a check', 'waiting', 'Someone says it is fixed. Nobody has tested it yet.'],
  ['passed', 'Checked and passed', 'good', 'Tested after the fix, with the evidence written down.']
];

const REPAIRS = [
  {
    id: 'R-01', form: 'F-104', priority: 'P0', state: 'needs-repair',
    found: '2026-09-17', owner: 'Not assigned',
    problem: 'The public link on the employer funding form returns an error, so anyone following it reaches nothing.',
    reported: 'Not started.',
    check: 'Not checked.',
    lesson: 'Confirm the intended replacement address before changing a live form.'
  },
  {
    id: 'R-02', form: 'F-207', priority: 'P0', state: 'needs-repair',
    found: '2026-09-17', owner: 'Not assigned',
    problem: 'Submissions from the matric results form reach a salesperson other than the one recorded against it.',
    reported: 'Not started.',
    check: 'Not checked.',
    lesson: 'A form pointing at the wrong person is a routing fault, not a count of messages that went astray.'
  },
  {
    id: 'R-03', form: 'F-304', priority: 'P1', state: 'fixed',
    found: '2026-09-15', owner: 'Chantel du Toit',
    problem: 'The employer funded form wrote to a second person as well as its owner, so two people worked the same leads.',
    reported: 'The second destination was removed on 16 September.',
    check: 'Not checked. Nobody has submitted a test entry since the change.',
    lesson: 'A change to a destination is not finished until a test submission lands where it should.'
  },
  {
    id: 'R-04', form: 'F-203', priority: 'P1', state: 'fixed',
    found: '2026-09-14', owner: 'Zanele Ndlovu',
    problem: 'The second chance matric form showed no connection to a response sheet.',
    reported: 'A sheet was connected on 15 September.',
    check: 'Not checked.',
    lesson: 'A published form with no readable connection is not proof that leads were lost, only that we cannot see them.'
  },
  {
    id: 'R-05', form: 'F-308', priority: 'P2', state: 'fixed',
    found: '2026-09-12', owner: 'Palesa Motaung',
    problem: 'The short courses form appears twice in the inventory, so its leads can be counted twice.',
    reported: 'One entry was marked as the duplicate on 13 September.',
    check: 'Not checked.',
    lesson: 'Count by submission number, not by inventory row.'
  },
  {
    id: 'R-06', form: 'F-307', priority: 'P1', state: 'passed',
    found: '2026-09-08', owner: 'Elton Pillay',
    problem: 'The general enquiry form had nobody recorded to work its submissions.',
    reported: 'An owner was recorded on 9 September.',
    check: 'A test entry on 10 September reached the recorded owner and was worked the same day.',
    lesson: 'Name an owner when the form is built, not after the first complaint.'
  },
  {
    id: 'R-07', form: 'F-401', priority: 'P2', state: 'needs-repair',
    found: '2026-09-16', owner: 'Not assigned',
    problem: 'The reactivation form has nobody recorded against it and is still collecting entries.',
    reported: 'Not started.',
    check: 'Not checked.',
    lesson: 'An old campaign form keeps working long after the campaign stops.'
  },
  {
    id: 'R-08', form: 'F-406', priority: 'P2', state: 'needs-repair',
    found: '2026-09-16', owner: 'Not assigned',
    problem: 'The bursary form writes to a sheet that could not be matched to any workbook we read.',
    reported: 'Not started.',
    check: 'Not checked.',
    lesson: 'A destination nobody can open is the same as no destination, for anyone trying to work the lead.'
  },
  {
    id: 'R-09', form: 'F-404', priority: 'P1', state: 'fixed',
    found: '2026-09-11', owner: 'Imran Ismail',
    problem: 'Two people were recorded as the owner of the course matcher, so neither followed up.',
    reported: 'One owner was recorded on 12 September and the other told.',
    check: 'Not checked.',
    lesson: 'Two owners is the same as none.'
  },
  {
    id: 'R-10', form: 'F-402', priority: 'P2', state: 'passed',
    found: '2026-09-05', owner: 'Lindiwe Maseko',
    problem: 'Nobody could say whether the free course form was still used for sales.',
    reported: 'Confirmed still in use on 6 September and recorded as such.',
    check: 'A test entry on 8 September arrived, was routed correctly and was worked within a day.',
    lesson: 'Write down the answer when a form is confirmed, or the same question gets asked next month.'
  }
];

// The workbooks the board reads
const SOURCES = [
  { name: 'Salespeople master', tabs: 33, read: '18 September 2026 at 06:40 SAST', holds: 'One tab per salesperson, holding the leads allocated to them and whatever they recorded against each one.' },
  { name: 'Form inventory', tabs: 4, read: '17 September 2026 at 21:01 SAST', holds: 'Every form we know about, who owns it, where it writes and when it was last confirmed.' },
  { name: 'Repair tracker', tabs: 2, read: '17 September 2026 at 21:01 SAST', holds: 'Problems found on forms, what was done about them and whether anyone checked afterwards.' },
  { name: 'Registrations', tabs: 1, read: 'Not connected', holds: 'Would say which leads became registrations. Not joined to submissions, so no conversion rate is worked out anywhere on this board.' }
];

const COVERAGE = {
  forms: FORMS.length,
  formsLive: FORMS.filter(([, , , , state]) => state === 'live').length,
  people: PERSON_NAMES.length,
  leads: LEADS.length,
  notJoined: 'Registrations are not matched to submissions, so nothing here says a lead became a sale.'
};

// Filtering, in one place so every page counts the same way
function leadsIn({ from, to, college = 'All', person = 'All', form = 'All' } = {}) {
  return LEADS.filter((lead) =>
    (!from || lead.date >= from)
    && (!to || lead.date <= to)
    && (college === 'All' || lead.college === college)
    && (person === 'All' || lead.person === person)
    && (form === 'All' || lead.form === form));
}

const RANGES = [
  ['today', 'Today', 0],
  ['week', 'Last 7 days', 6],
  ['month', 'Last 30 days', 29],
  ['all', 'Everything read', 44]
];

const rangeFrom = (key) => {
  const found = RANGES.find(([name]) => name === key) || RANGES[1];
  return shiftDays(SNAPSHOT.today, -found[2]);
};

function totalsFor(rows) {
  const worked = rows.filter((lead) => lead.status);
  const dated = rows.filter((lead) => lead.firstEvidence);
  const stale = rows.filter((lead) => !lead.status && lead.waitingDays >= 7);
  return {
    leads: rows.length,
    worked: worked.length,
    dated: dated.length,
    stale: stale.length,
    workedRate: rows.length ? worked.length / rows.length : 0,
    people: new Set(rows.map((lead) => lead.person)).size,
    forms: new Set(rows.map((lead) => lead.form)).size
  };
}

// How quickly evidence appeared, for the rows where there is a date to measure
function speedOf(rows) {
  const dated = rows.filter((lead) => lead.firstEvidence);
  if (!dated.length) return null;
  const days = dated.map((lead) => daysBetween(lead.date, lead.firstEvidence)).sort((a, b) => a - b);
  return {
    count: dated.length,
    middle: days[Math.floor(days.length / 2)],
    sameDay: days.filter((d) => d === 0).length
  };
}

const formName = (id) => (FORMS.find(([code]) => code === id) || [null, id])[1];
const formState = (id) => (FORMS.find(([code]) => code === id) || [null, null, null, null, 'live'])[4];

const formatNumber = (value) => Math.round(value).toLocaleString('en-ZA').replace(/,/g, ' ');
const formatPercent = (value, places = 1) => `${(value * 100).toFixed(places)}%`;
