/* ============================================================
   User-onboarding journeys — shared source of truth.
   Read by:
     - journeys.html (renders the index card list)
     - index.html    (loads a preset via ?journey=<id> and powers
                      the JourneyHUD's next-click hints + switcher)

   Adding a journey: append one entry below. Both surfaces pick it up.
   Each entry's `preset` is set via the existing setters in index.html
   (setActiveFlow, setInviteVariant, setAuthState, setWelcomeVariant,
   setInviteErrorState). `steps` is an ordered list of data-step values
   the user is expected to pass through, each paired with a next-click
   hint shown in the top HUD bar.
   ============================================================ */
window.JOURNEYS = [

  /* === NEW USER === */
  {
    id: 'N1',
    group: 'New user',
    name: 'Workspace invite · email sign-up',
    description: 'No Traverse account yet. Accept the workspace invite, sign up with email + password, verify the 6-digit code, fill in the profile, land on the dashboard.',
    preset: {
      flow: 'new-user',
      variant: 'workspace',
      authState: 'signed-in',
      welcomeVariant: 'standard',
      startAt: '1'
    },
    steps: [
      { step: '1',           hint: 'Read the invite email, then click "Accept invitation".' },
      { step: 'loading-new', hint: 'Setting up your invitation… (auto-advances, or tap to skip).' },
      { step: '2',           hint: 'Enter any password, tick the terms checkbox, click Continue.' },
      { step: '3',           hint: 'Enter any 6-digit code, click "Verify and continue".' },
      { step: '4',           hint: 'Fill in name + job title, click "Complete sign up".' }
    ]
  },
  {
    id: 'N2',
    group: 'New user',
    name: 'Workspace invite · Google SSO',
    description: 'No Traverse account yet. Accept workspace invite, continue with Google (skips the verify-code step), fill profile, dashboard.',
    preset: { flow: 'new-user', variant: 'workspace', authState: 'signed-in', welcomeVariant: 'standard', startAt: '1' },
    steps: [
      { step: '1',           hint: 'Click "Accept invitation".' },
      { step: 'loading-new', hint: 'Setting up your invitation…' },
      { step: '2',           hint: 'Click "Continue with Google" at the bottom (skips verify).' },
      { step: '4',           hint: 'Fill in name + job title, click "Complete sign up".' }
    ]
  },
  {
    id: 'N3',
    group: 'New user',
    name: 'Org Admin invite · email sign-up',
    description: 'No Traverse account yet. Accept an Organisation Admin invite, sign up with email + password, verify, profile, dashboard.',
    preset: { flow: 'new-user', variant: 'org-admin', authState: 'signed-in', welcomeVariant: 'standard', startAt: '1' },
    steps: [
      { step: '1',           hint: 'Org Admin invite to Acme Org. Click "Accept invitation".' },
      { step: 'loading-new', hint: 'Setting up your invitation…' },
      { step: '2',           hint: 'Enter password, accept terms, Continue.' },
      { step: '3',           hint: 'Enter any 6 digits, "Verify and continue".' },
      { step: '4',           hint: 'Complete sign up.' }
    ]
  },
  {
    id: 'N4',
    group: 'New user',
    name: 'Org Admin invite · Google SSO',
    description: 'No Traverse account yet. Accept org-admin invite, Google SSO (skips verify), profile.',
    preset: { flow: 'new-user', variant: 'org-admin', authState: 'signed-in', welcomeVariant: 'standard', startAt: '1' },
    steps: [
      { step: '1',           hint: 'Click "Accept invitation".' },
      { step: 'loading-new', hint: 'Setting up your invitation…' },
      { step: '2',           hint: 'Click "Continue with Google".' },
      { step: '4',           hint: 'Complete sign up.' }
    ]
  },

  /* === EXISTING USER === */
  {
    id: 'E1',
    group: 'Existing user',
    name: 'Workspace invite · signed in',
    description: 'Already has a Traverse account and is signed in to the correct one. Accept, brief check, land on welcome.',
    preset: { flow: 'existing-user', variant: 'workspace', authState: 'signed-in', welcomeVariant: 'standard', startAt: 'ex-1' },
    steps: [
      { step: 'ex-1',       hint: 'Sarah is signed in. Click "Go to Sales Training".' },
      { step: 'loading-ex', hint: 'Checking your account…' },
      { step: 'ex-welcome', hint: 'Welcome! Click "Go to your workspace".' }
    ]
  },
  {
    id: 'E2',
    group: 'Existing user',
    name: 'Workspace invite · not signed in',
    description: 'Has an account but is logged out. Invite leads to login (email pre-filled), then welcome.',
    preset: { flow: 'existing-user', variant: 'workspace', authState: 'not-signed-in', welcomeVariant: 'standard', startAt: 'ex-1' },
    steps: [
      { step: 'ex-1',       hint: 'Click "Go to Sales Training".' },
      { step: 'loading-ex', hint: 'Checking your account…' },
      { step: 'ex-login',   hint: 'Enter any password and click Log in (or Continue with Google).' },
      { step: 'ex-welcome', hint: 'Welcome!' }
    ]
  },
  {
    id: 'E3',
    group: 'Existing user',
    name: 'Workspace invite · wrong account',
    description: 'Signed in to a different account from the invite. Log out, log in with the right email (pre-filled), welcome.',
    preset: { flow: 'existing-user', variant: 'workspace', authState: 'wrong-account', welcomeVariant: 'standard', startAt: 'ex-1' },
    steps: [
      { step: 'ex-1',             hint: 'Click "Go to Sales Training".' },
      { step: 'loading-ex',       hint: 'Checking your account…' },
      { step: 'ex-wrong-account', hint: "You're signed in to the wrong account. Click \"Log out and sign in as sarah@acmecorp.com\"." },
      { step: 'ex-login',         hint: 'Email is pre-filled with the right address. Enter password, Log in.' },
      { step: 'ex-welcome',       hint: 'Welcome!' }
    ]
  },
  {
    id: 'E4',
    group: 'Existing user',
    name: 'Org Admin promotion · signed in',
    description: 'Existing user promoted to Organisation Admin while signed in correctly. Welcome.',
    preset: { flow: 'existing-user', variant: 'org-admin', authState: 'signed-in', welcomeVariant: 'standard', startAt: 'ex-1' },
    steps: [
      { step: 'ex-1',       hint: 'Sarah is now Org Admin for Acme Org. Click "Go to Acme Org".' },
      { step: 'loading-ex', hint: 'Checking your account…' },
      { step: 'ex-welcome', hint: 'Welcome!' }
    ]
  },
  {
    id: 'E5',
    group: 'Existing user',
    name: 'Org Admin promotion · not signed in',
    description: 'Existing user promoted to Org Admin but currently logged out. Log in, welcome.',
    preset: { flow: 'existing-user', variant: 'org-admin', authState: 'not-signed-in', welcomeVariant: 'standard', startAt: 'ex-1' },
    steps: [
      { step: 'ex-1',       hint: 'Click "Go to Acme Org".' },
      { step: 'loading-ex', hint: 'Checking your account…' },
      { step: 'ex-login',   hint: 'Enter password, Log in.' },
      { step: 'ex-welcome', hint: 'Welcome!' }
    ]
  },
  {
    id: 'E6',
    group: 'Existing user',
    name: 'Org Admin promotion · wrong account',
    description: 'Org-admin invite opened while signed in to the wrong account. Log out, log in with the right email, welcome.',
    preset: { flow: 'existing-user', variant: 'org-admin', authState: 'wrong-account', welcomeVariant: 'standard', startAt: 'ex-1' },
    steps: [
      { step: 'ex-1',             hint: 'Click "Go to Acme Org".' },
      { step: 'loading-ex',       hint: 'Checking your account…' },
      { step: 'ex-wrong-account', hint: 'Click "Log out and sign in as sarah@acmecorp.com".' },
      { step: 'ex-login',         hint: 'Enter password, Log in.' },
      { step: 'ex-welcome',       hint: 'Welcome!' }
    ]
  },

  /* === ERROR STATES (flow-agnostic) === */
  {
    id: 'X1',
    group: 'Error states',
    name: 'Invite expired',
    description: 'Invite token has expired. Error screen with a "Request a new invite" CTA that reveals an inline note + a secondary "Log in" link.',
    preset: { flow: 'new-user', variant: 'workspace', authState: 'signed-in', welcomeVariant: 'standard', inviteError: 'expired', startAt: 'invite-error' },
    steps: [
      { step: 'invite-error', hint: 'Click "Request a new invite" to reveal the inline note, OR the secondary link to log in.' }
    ]
  },
  {
    id: 'X2',
    group: 'Error states',
    name: 'Invite cancelled',
    description: 'Inviter cancelled the invitation before it was accepted.',
    preset: { flow: 'new-user', variant: 'workspace', authState: 'signed-in', welcomeVariant: 'standard', inviteError: 'cancelled', startAt: 'invite-error' },
    steps: [
      { step: 'invite-error', hint: 'Follow the primary CTA, or use the secondary link to log in.' }
    ]
  },
  {
    id: 'X3',
    group: 'Error states',
    name: 'Invite invalid',
    description: 'Invite token is malformed or never existed (e.g. tampered link).',
    preset: { flow: 'new-user', variant: 'workspace', authState: 'signed-in', welcomeVariant: 'standard', inviteError: 'invalid', startAt: 'invite-error' },
    steps: [
      { step: 'invite-error', hint: 'Follow the primary CTA, or use the secondary link to log in.' }
    ]
  }
];
