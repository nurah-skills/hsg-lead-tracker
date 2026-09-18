// There are no real accounts yet. The demo sign-in just remembers a sample person in this browser.
const SESSION_KEY = 'hsg-leads-session';

// Two sample accounts, because a manager and a salesperson are shown different things
const DEMO_USERS = {
  manager: {
    name: 'Refiloe Sibanda',
    role: 'Sales manager',
    team: 'HSG sales',
    manager: true,
    person: null
  },
  salesperson: {
    name: 'Lerato Mokoena',
    role: 'Salesperson',
    team: 'Skills Academy',
    manager: false,
    person: 'Lerato Mokoena'
  }
};

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function startSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return true;
  } catch {
    return false;
  }
}

const startDemoSession = (kind) => startSession(DEMO_USERS[kind] || DEMO_USERS.salesperson);

function endSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear if storage is blocked.
  }
}

// Runs in the <head> so people never see a flash of the wrong page.
const pageType = document.documentElement.dataset.page;
const signedIn = readSession();
// The signed-in pages live in pages/, so the way back out is one level up
const SIGN_IN_PAGE = '../index.html';
const HOME_PAGE = pageType === 'app' ? 'actions.html' : 'pages/actions.html';

if (pageType === 'app' && !signedIn) location.replace(SIGN_IN_PAGE);
if (pageType === 'auth' && signedIn) location.replace(HOME_PAGE);
// Recording a decision is a manager's job, so those pages send a salesperson back
if (document.documentElement.dataset.access === 'manager' && signedIn && !signedIn.manager) location.replace('actions.html');
