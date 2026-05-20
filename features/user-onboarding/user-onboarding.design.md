# User onboarding

**Status:** Draft
**Last updated:** 2026-05-20
**Author:** handover-documenter
**Reviewed by:** —
**Linear project:** Users & Permissions
**Linear issue:** [TRV-876](https://linear.app/traverse-engineering/issue/TRV-876/user-onboarding)
**Linear sub-issues:** [TRV-877](https://linear.app/traverse-engineering/issue/TRV-877/user-onboarding-frontend-new-user-flow), [TRV-878](https://linear.app/traverse-engineering/issue/TRV-878/user-onboarding-frontend-existing-user-flow), [TRV-879](https://linear.app/traverse-engineering/issue/TRV-879/user-onboarding-oauth2-callback-and-session-handling), [TRV-880](https://linear.app/traverse-engineering/issue/TRV-880/user-onboarding-email-password-sign-up-and-verification-email), [TRV-881](https://linear.app/traverse-engineering/issue/TRV-881/user-onboarding-invite-error-states), [TRV-882](https://linear.app/traverse-engineering/issue/TRV-882/user-onboarding-profile-form-split-name-fields), [TRV-883](https://linear.app/traverse-engineering/issue/TRV-883/user-onboarding-welcome-variant-handoff), [TRV-884](https://linear.app/traverse-engineering/issue/TRV-884/user-onboarding-invitation-email-template)

---

> ### IMPORTANT — Invite email steps are NOT buildable app screens
>
> `data-step="1"` (new-user invite email) and `data-step="ex-1"` (existing-user invite email)
> exist in the prototype **only to define the structure and content of the invitation email**.
> They are reference material for the email template build, not screens to be built as part of
> the web application. Do not implement these as application routes or views.
>
> Every reference to Step 1 and ex-1 in this document carries this same caveat.

---

## Where this lives in the repo

- **Prototype:** `prototypes/user-onboarding/index.html` — full file; no `data-screen` anchor (this prototype is its own standalone file, not a section inside the dashboard prototype)
- **PRD:** `product-requirement-documents/Users and Permissions V2.md` §2 (User Onboarding, lines ~211–283) and §6.2 (Onboarding UX / welcome screen)
- **UI change log:** `ui-change-logs/User Onboarding.md` (8 entries, 2026-05-13 to 2026-05-20)
- **Design system refs:** `design-system/traverse-design-system.md` §9.1 (auth shell / dotted background), §7.1 (Button), §7.6 (Input), §7.7 (Textarea), §7.5 (Avatar), §8.12 (Upload dropzone); `design-system/colors_and_type.css`
- **Related features:** `features/workspace-admin/workspace-admin.design.md` (workspace shell the user lands in after onboarding); `features/adding-user/adding-user.design.md` (admin side of the invite flow that triggers this feature)

---

## How to navigate through prototypes

**The point of the prototype is to click through it as a real user would** — start at Step 1, follow the CTAs, see how the flow actually feels. The sticky `.devbar` at the bottom of `prototypes/user-onboarding/index.html` is a **shortcut for reviewers**: use it to jump straight to a specific state, flow, or role variant without having to walk the whole journey each time. Controls are grouped into dropdown menus at runtime by a JavaScript IIFE (same converter pattern used in `prototypes/dashboard/index.html` and `prototypes/test-journey/index.html`). The two trailing standalone buttons (Reset state / Prefill all) remain as buttons outside the dropdowns. (ui-change-logs 2026-05-19)

### Flow group

Controls which parallel flow is active. Sets `activeFlow`, shows/hides the correct set of step buttons.

| Button label | `data-flow` value | What it does |
|---|---|---|
| New user (5-step) | `new-user` | Activates the new-user flow. Shows steps: 1 · Invite, 2 · Loading, 3 · OAuth, 4 · Verify, 5 · Profile. Hides all existing-user steps and the Auth state group. |
| Existing user joining workspace | `existing-user` | Activates the existing-user flow. Hides new-user steps. Shows existing-user steps and the Auth state group. |

### Auth state group (existing-user flow only)

Visible only when the existing-user flow is active. Controls the `loading-ex` branch.

| Button label | `data-auth-state` value | What it does |
|---|---|---|
| Signed in | `signed-in` | `loading-ex` auto-advances to `ex-welcome`. The "3 · Login OAuth" step button is hidden. |
| Not signed in | `not-signed-in` | `loading-ex` auto-advances to `ex-login`. The "3 · Login OAuth" step button becomes visible. |

### Step group (new-user flow)

Visible only when the new-user flow is active. Each button jumps directly to that step without requiring previous steps to be completed.

| Button label | Target | Notes |
|---|---|---|
| 1 · Invite | `data-step="1"` | Shows the invite email reference card. **Email template reference only — not an app screen.** |
| 2 · Loading | `data-step="loading-new"` | Shows the loading transition; auto-advances to Step 3 · OAuth after 1.4s. Tap the loading area to skip immediately. |
| 3 · OAuth | `data-step="2"` | Shows the OAuth / sign-up card (Step 2 in the wizard). |
| 4 · Verify | `data-step="3"` | Shows the email verification card (Step 3). Only reached via email+password path in production. |
| 5 · Profile | `data-step="4"` | Shows the profile setup card (Step 4). This is the final step — CTA navigates to the dashboard. |

### Step group (existing-user flow)

Visible only when the existing-user flow is active. Menu items for steps hidden by auth state are filtered out on menu-open.

| Button label | Target | Notes |
|---|---|---|
| 1 · Invite | `data-step="ex-1"` | Shows the existing-user invite email reference card. **Email template reference only.** |
| 2 · Loading | `data-step="loading-ex"` | Shows the loading/auth-check transition. Branches on auth state. |
| 3 · Login OAuth | `data-step="ex-login"` | Visible only when Auth state = Not signed in. Shows the login card. |
| 4 · Welcome | `data-step="ex-welcome"` | Shows the welcome handoff card — final screen of the existing-user flow. |

### Welcome variant group

Active for both flows. Sets the role shown in the invite email and the role label on the existing-user welcome step, and determines the `role` query param passed to the dashboard.

| Button label | `data-welcome-variant` | Role in invite email | Dashboard `role` param | Context surfaced |
|---|---|---|---|---|
| Member | `standard` | "Member" | `standard` | Full workspace access copy |
| Moderator (unassigned) | `moderator` | "Moderator" | `moderator` | Empty state: awaiting submission group assignment |
| Viewer (unassigned) | `viewer` | "Viewer" | `viewer` | Empty state: awaiting asset assignment |
| Empty workspace | `empty` | "Member" (empty is a workspace state, not a role) | `empty` | No content in workspace yet |

Switching the Welcome variant also updates the invite email's role token and helper sentence (`data-invite-role-new`, `data-invite-helper-new`, `data-invite-role-ex`, `data-invite-helper-ex`) so the full prototype tells one coherent story from invite email through to dashboard handoff. (ui-change-logs 2026-05-19)

For the new-user flow, switching the variant also jumps to Step 5 · Profile. For the existing-user flow, it jumps to Step 4 · Welcome.

### Standalone buttons

| Button label | `data-action` | What it does |
|---|---|---|
| Reset state | `reset` | Clears all form values (password, code boxes, profile fields), clears the avatar preview, resets doneSteps, returns to new-user flow Step 1 · Invite. Resets Welcome variant to Member. |
| Prefill all | `prefill-all` | Fills the OAuth password field (value: `Password1!`) and ticks the terms checkbox so the Step 2 sign-up "Continue" button enables immediately. Also fills pr-first, pr-last, and pr-job in the Profile step so the Step 5 "Complete sign up" button enables. Useful for quickly reaching the handoff without re-entering data every review session. |

### Walk-throughs

- **New-user golden path (Member):** Flow → New user (5-step). Welcome variant → Member. Step group → 1 · Invite (read), 2 · Loading, 3 · OAuth. Card shows square Traverse Studio mark at top, no back link. Sign-up is the default view; Google SSO appears at the bottom of the card. Click "Continue with Google" to fast-track (skips Verify), or fill password + tick terms and click "Continue" to walk the email+password path through 4 · Verify. Finish at 5 · Profile → click "Complete sign up" — lands on dashboard with `?welcome=1&role=standard`.
- **New-user email+password fallback:** Flow → New user. Click Prefill all (fills password field and ticks terms — no confirm field). Walk steps 2 → 3 → 4 → 5 (verification step is visited). "Continue" on Step 3 · OAuth enables as soon as password ≥8 chars and terms are checked.
- **New user clicks "Log in" from inside the sign-up card:** Flow → New user. Step group → 3 · OAuth. Click the "Log in" link in the card → view swaps to log-in form. Fill password (or click Prefill all) → click "Log in" → routes straight to dashboard with `?welcome=1&role=<variant>`, skipping Verify and Profile.
- **Existing-user (signed in):** Flow → Existing user. Auth state → Signed in. Step group → 1 · Invite, 2 · Loading, 4 · Welcome (Step 3 hidden).
- **Existing-user (not signed in):** Flow → Existing user. Auth state → Not signed in. Step group → 1 · Invite, 2 · Loading, 3 · Login OAuth, 4 · Welcome.
- **Role-variant welcome handoffs:** With either flow active, cycle Welcome variant through Member → Moderator → Viewer → Empty workspace and observe how the role token in Step 1 (invite email reference) and the role label on Step 4 · Welcome both update in lock-step.

---

## 1. Intent

> ### IMPORTANT — Invite email steps are NOT buildable app screens
> See callout at the top of this document. `data-step="1"` and `data-step="ex-1"` define the
> invitation email structure only.

User onboarding is the multi-step flow that takes an invited user from clicking the invitation link in their email through account creation (or authentication) and profile setup, then routes them to the workspace dashboard in the correct welcome state for their role. A parallel shorter flow handles existing Traverse users who have been added to a new workspace.

**User goal:** Complete account setup and land in the right workspace with enough context to know what they can do.
**Product goal:** Activate invited users reliably, capture their profile data on first sign-in, and route them to a role-appropriate first experience without manual admin intervention. (PRD §2, §6.2)

---

## 2. Scope

### In scope

- New-user flow: loading transition → OAuth / sign-up screen (Google SSO or email+password fallback, with an in-card toggle to a log-in view for users who already have an account) → email verification (email+password path only) → profile setup → dashboard handoff with `?welcome=1&role=<variant>`
- Existing-user flow: loading transition → auth check → either direct dashboard handoff (signed-in path) or login OAuth screen → dashboard handoff
- Role-variant welcome handoff: four contexts — Member, Moderator (unassigned), Viewer (unassigned), empty workspace (PRD §6.2)
- Profile data capture: first name, last name, job title (required); department, bio, profile photo (optional)
- Background shell and wordmark matching the workspace-picker / login-launch screen (dotted grid, fixed Traverse Studio wordmark top-left)
- No progress stepper required for this flow; may revisit later if necessary.
- Devbar prototype controls for all flows and variants (documented in §13 of this file)

### Out of scope

- **Invite email steps (`data-step="1"` / `data-step="ex-1"`) as buildable application screens.** These exist in the prototype as email-template reference only. Do not build them as routes in the web app.
- Invite error states (expired / cancelled / already-a-member) — screens not yet designed, backend architecture unclear. Flagged as ⚠️ NEEDS INPUT in §10.
- Admin-side invitation UI (that is `features/adding-user`)
- Post-onboarding workspace welcome banner rendered inside the dashboard (that belongs to the `dashboard` feature, receiving `?welcome=1&role=<variant>`)
- Account closure flow (PRD §7.5, deferred from this sprint)
- Role chip in the workspace shell (covered by the workspace-admin / user-profile features once authored)
- Onboarding for Super Admin users

---

## 3. Surface and placement

| Field | Value |
|---|---|
| Route / screen anchor | **Suggested:** `/join`. Final decision sits with the implementing developer based on backend/router constraints. Standalone file at `prototypes/user-onboarding/index.html`. |
| Surface type | Full-page wizard (standalone, unauthenticated shell) |
| Triggered by | User clicks the unique invitation link in their email |
| Position in layout | Full-bleed auth shell: dotted grid background + fixed Traverse Studio wordmark top-left + centred card column, max-width 480px |

**Shell pattern:** DS §9.1 auth shell. Background: `radial-gradient(circle, var(--surface-200) 1px, transparent 1.2px)` at `18px 18px` over `var(--surface-50)`. Wordmark: `public/logo/studio_full_light.svg`, `position: fixed; top: 20px; left: 24px; height: 24px`. (ui-change-logs/User Onboarding.md 2026-05-19)

---

## 4. Anatomy

The feature comprises two parallel flows. Each flow uses the same shell and card component. Steps are shown one at a time via `.step.is-active`.

### New-user flow (4 numeric steps + 1 loading transition)

```
New-user flow
├── Loading transition (data-step="loading-new")
│   ├── Spinner: 48px rotating arc (primary-100 / primary-600)
│   └── Copy: "Setting up your invitation…"
│       Auto-advances to Step 2 after 1.4s; tap anywhere to skip.
│
├── Step 1 — Invite email reference (data-step="1")
│   ⚠️ NOT AN APP SCREEN — email template reference only
│   ├── Email card shell (.email-card)
│   │   ├── Header: primary-600 bar + Studio wordmark (white)
│   │   ├── Body: greeting, role-token (data-invite-role-new), helper sentence (data-invite-helper-new)
│   │   ├── Invite block: building-2 icon + workspace name + inviter name/role
│   │   ├── CTA: "Accept invitation" (primary btn) → advances to loading-new
│   │   ├── "Already have an account? Log in instead" link → same as CTA
│   │   └── Footer: expiry notice, unsubscribe, privacy policy
│   └── (role content driven by welcome-variant devbar selection)
│
├── Step 2 — OAuth / Sign-up + Log-in (data-step="2")
│   Two views inside the same card, toggled by in-card links.
│   Default view: auth-view=signup. Switching view resets the leaving form.
│
│   ├── Sign-up view (data-auth-view="signup") — DEFAULT
│   │   ├── Square mark: public/logo/studio_square_light.svg (100×100), centred above title
│   │   ├── Card title: "Set up your account"
│   │   ├── Sub: "Sign up to Traverse Studio to continue to [Workspace]."
│   │   ├── Email input: pre-filled from invitation, read-only
│   │   ├── Password field: eye-toggle + strength meter (hidden until typing begins)
│   │   ├── Terms checkbox (accent-color: var(--primary-600))
│   │   ├── "Continue" button: disabled until password ≥8 chars + terms checked
│   │   ├── "Already have an account? Log in" link → setAuthView('login')
│   │   ├── OR divider
│   │   └── "Continue with Google" button (Google SVG mark + label) → fast-tracks to Step 4
│   │       SSO bypasses Step 3 entirely.
│   │
│   └── Log-in view (data-auth-view="login") — hidden by default
│       ├── Square mark: public/logo/studio_square_light.svg (100×100), centred above title
│       ├── Card title: "Log in to your account"
│       ├── Sub: "Log in to Traverse Studio to continue to [Workspace]."
│       ├── Email input: pre-filled from invitation, read-only
│       ├── Password field: eye-toggle (no strength meter, no confirm field, no terms)
│       ├── "Log in" button (margin-top: 18px): disabled until password has content
│       │   Submit routes to ../dashboard/index.html?welcome=1&role=<variant>
│       │   — skips Step 3 (Verify) and Step 4 (Profile) entirely.
│       ├── "Don't have an account? Sign up" link → setAuthView('signup')
│       ├── OR divider
│       └── "Continue with Google" button → fast-tracks to Step 4
│
├── Step 3 — Email verification (data-step="3") — email+password path only
│   ├── Back link → Step 2
│   ├── verify-icon: mail icon in primary-100 circle
│   ├── Card title: "Check your inbox"
│   ├── Sub: email address displayed (data-verify-email)
│   ├── 6 code boxes (.code-box): inputmode="numeric", auto-advance, paste-to-fill
│   │   Filled state: primary-100 background, primary-400 border, primary-800 text
│   ├── "Didn't receive it? Resend code" link: transiently disabled 2.5s after click
│   └── "Verify and continue" button: disabled until all 6 boxes filled
│
└── Step 4 — Profile setup (data-step="4") — FINAL STEP
    ├── Card title: "Tell us about yourself"
    ├── Sub: "Help your teammates know who you are."
    ├── Avatar upload: 88px dashed circle (primary-50 / primary-200), camera icon
    │   On file pick: image preview replaces icon, border becomes solid primary-400
    │   "Choose photo" link triggers hidden file input (accept="image/*")
    ├── Name row: two-column grid
    │   ├── First name (#pr-first, required)
    │   └── Last name (#pr-last, required)
    ├── Job title (#pr-job, required)
    ├── Department (#pr-dept, optional)
    ├── Bio (#pr-bio, textarea, optional, `maxlength="300"`, live `N / 300` counter below field)
    └── "Complete sign up" button
        Navigates to ../dashboard/index.html?welcome=1&role=<variant>
        Disabled until pr-first, pr-last, pr-job all filled.
```

### Existing-user flow (3 screen steps + 1 loading transition)

```
Existing-user flow
├── Step ex-1 — Existing-user invite email reference (data-step="ex-1")
│   ⚠️ NOT AN APP SCREEN — email template reference only
│   ├── Email card shell (same structure as new-user Step 1)
│   ├── Role token (data-invite-role-ex) + helper (data-invite-helper-ex)
│   ├── Info block: "You already have a Traverse Studio account. Sign-in continues with [email]."
│   └── CTA: "Go to [Workspace]" → advances to loading-ex
│
├── Loading transition (data-step="loading-ex")
│   ├── Spinner + "Checking your account…"
│   ├── Auto-advances after 1.4s; tap anywhere to skip
│   └── Branch: signed-in → ex-welcome | not-signed-in → ex-login
│
├── ex-login — Login OAuth (data-step="ex-login") — not-signed-in path only
│   ├── Back link → ex-1
│   ├── Card title: "Log in to continue"
│   ├── Sub: "Sign in to your Traverse Studio account to join [Workspace]."
│   ├── "Continue with Google" button → ex-welcome
│   ├── OR divider
│   ├── Email input: pre-filled from invitation, read-only
│   ├── Password field: eye-toggle (no strength meter, no confirm field, no terms)
│   └── "Log in" button: disabled until password has content
│
└── ex-welcome — Welcome handoff (data-step="ex-welcome") — FINAL STEP
    ├── check-circle icon (success-100 / success-600)
    ├── Card title: "You're in, [First Name]"
    ├── Sub: "Taking you to [Workspace] now."
    ├── Role hint pill (#ex-welcome-role-hint): "Joining as [role] · Cross-workspace"
    └── "Go to your workspace" button + arrow-right icon
        Navigates to ../dashboard/index.html?welcome=1&role=<variant>
```

**Design-system components used:**
- Button (DS §7.1) — primary and secondary variants
- Input (DS §7.6) — text, password (with eye-toggle), email (read-only)
- Textarea (DS §7.7) — bio field
- Avatar / upload dropzone (DS §7.5, §8.12) — profile photo circle

---

## 5. States

| State | Visual / behaviour | Notes |
|---|---|---|
| Default | Each step card visible; only `.step.is-active` shown | One step at a time via CSS |
| Loading (OAuth call in flight) | `loading-new` / `loading-ex`: full-card spinner + copy, auto-advance 1.4s | Represents the backend OAuth2.0 call; tap-to-skip available |
| Loading (action) | "Continue" / "Log in" / "Verify and continue" button: disabled while submitting | Spinner state on button ⚠️ NEEDS INPUT — not currently in prototype |
| Disabled CTA | Button `aria-disabled="true"` + `disabled` attribute | "Continue" gate: Step 2 sign-up view requires password (≥8 chars) + terms checked; Step 2 log-in view requires password has content; Step 4 requires pr-first, pr-last, pr-job; Step 3 requires all 6 code boxes filled |
| Field error | `var(--error-500)` border on input, 12px error copy below in `var(--error-600)` | Client-side validation on blur; PRD §2.1 / DS §7.6 |
| Password strength — weak | pw-fill width ~33%, `var(--error-500)` fill, label "Weak" in error-500 | Live as user types |
| Password strength — medium | pw-fill width ~66%, `var(--warn-500)` fill, label "Medium" in warn-600 | Live as user types |
| Password strength — strong | pw-fill width 100%, `var(--success-500)` fill, label "Strong" in success-600 | Live as user types |
| Code box — filled | `var(--primary-100)` background, `var(--primary-400)` border, `var(--primary-800)` text | Step 3; toggles `.is-filled` |
| Resend code — cooling down | "Resend code" link transiently disabled ~2.5s, text becomes "Code resent" | Step 3 |
| Avatar — image loaded | Dashed border becomes solid `var(--primary-400)`; icon replaced by image preview | Step 4 |
| Bio counter — at limit | Live `N / 300` counter below bio field switches text colour to `var(--error-500)` when character count reaches or exceeds 300; `maxlength="300"` prevents further input. "Complete sign up" remains enabled — server-side truncation at 300 on save. | Step 4 |
| Success / handoff | Profile CTA navigates to `../dashboard/index.html?welcome=1&role=<variant>` | Backend reads `role` param to render the correct welcome hero |

---

## 6. Behaviour

### OAuth2 is the authentication mechanism

The primary sign-up and login path is **OAuth2, currently Google only**. Clicking "Continue with Google" on Step 2 (or `ex-login`) initiates the OAuth flow; the loading screens (`loading-new`, `loading-ex`) represent the OAuth2 backend call in flight. The email + password form on Step 2 is a **real backend fallback**, not prototype scaffolding — it exists for users who cannot use Google SSO. Email + password requires Step 3 (verification); SSO bypasses Step 3 entirely. Sign-up view validation: password ≥8 characters + terms checkbox checked. Confirm-password field is absent — match validation was removed when the Step 2 card was restructured.

### Interactions

- **User clicks "Accept invitation" (Step 1 email)** → navigates to `loading-new` → auto-advances to Step 2 (OAuth)
- **User toggles auth view inside Step 2** → in-card links trigger `setAuthView('signup' | 'login')` via `[data-action="show-login"]` / `[data-action="show-signup"]`; switching resets all field values on the leaving view. Sign-up is the default view.
- **User clicks "Log in" (Step 2 log-in view)** → routes directly to `../dashboard/index.html?welcome=1&role=<variant>`; Steps 3 (Verify) and 4 (Profile) are skipped entirely. Enabled as soon as password field has any content.
- **User clicks "Continue with Google" (Step 2)** → initiates OAuth; if successful, marks Steps 2 + 3 as done → jumps to Step 4 (Profile); Step 3 is skipped entirely for SSO
- **User completes email+password form (Step 2 sign-up view)** → Step 3 (verify); Step 3 "Verify and continue" → Step 4
- **User completes profile (Step 4)** → navigates to `../dashboard/index.html?welcome=1&role=<variant>`; this is the final step — there is no separate welcome screen in the onboarding flow. The role variant is not surfaced visually on the Profile step; it is carried solely by the `role` query param on the handoff URL. (ui-change-logs 2026-05-20)
- **Existing user clicks "Go to [Workspace]" (ex-1 email)** → `loading-ex` → branches: signed-in → `ex-welcome`; not-signed-in → `ex-login` → `ex-welcome`
- **Existing user on `ex-welcome` clicks "Go to your workspace"** → navigates to `../dashboard/index.html?welcome=1&role=<variant>`

### Role-variant welcome handoff

The `role` query parameter passed to the dashboard determines the welcome banner variant. Four variants (PRD §6.2, ui-change-logs 2026-05-19):

| Variant | `role` param | Dashboard banner context |
|---|---|---|
| Member | `standard` | "Welcome to [Workspace]. You have Member access — you can author, edit, and moderate any content." |
| Moderator (unassigned) | `moderator` | Empty state with admin contact; "Your workspace admin will assign you to submission groups." |
| Viewer (unassigned) | `viewer` | Empty state with admin contact; "Your workspace admin will assign you to content." |
| Empty workspace | `empty` | "It looks like there is no content here yet." |

Display copy uses "Member" (not "Standard User"). Internal `role` param key remains `'standard'` to preserve existing JS/backend identifiers. (project memory: roles-v2-terminology)

### Flow

- **Enters from:** User clicks unique invitation link in email (deep-linked with invite token, workspace ID, and pre-filled email address)
- **Exits to:** `../dashboard/index.html?welcome=1&role=<variant>` → dashboard renders welcome hero for the user's role

### Progressive disclosure

- **Always visible:** current step card, wordmark
- **Revealed on Google SSO:** Step 3 (verify) is skipped entirely for SSO users
- **Conditional on path:** `loading-ex` branches to `ex-login` only when auth state is not-signed-in; otherwise routes directly to `ex-welcome`

---

## 7. Design tokens

### Colours

| Role | Token |
|---|---|
| Page background | `var(--surface-50)` |
| Dotted grid dots | `var(--surface-200)` |
| Card background | `#fff` (explicit; no token alias for pure white cards in this shell) |
| Card border | `var(--surface-200)` |
| Primary action button | `var(--primary-600)` fill; hover `var(--primary-700)` |
| Secondary button border | `var(--surface-200)`; hover `var(--surface-300)` |
| Input border (default) | `var(--surface-200)` |
| Input border (focus) | `var(--primary-400)` + `var(--primary-100)` ring |
| Input border (error) | `var(--error-500)` |
| Input (read-only) bg | `var(--surface-50)` |
| Code box — filled bg | `var(--primary-100)` |
| Code box — filled border | `var(--primary-400)` |
| Code box — filled text | `var(--primary-800)` |
| Avatar upload circle (default) | `var(--primary-50)` bg, `var(--primary-200)` dashed border |
| Avatar upload circle (has image) | `var(--primary-400)` solid border |
| Strength meter — weak | `var(--error-500)` |
| Strength meter — medium | `var(--warn-500)` |
| Strength meter — strong | `var(--success-500)` |
| Email invite header bar | `var(--primary-600)` |
| Info block bg | `var(--surface-50)` |
| Info block border | `var(--surface-200)` |
| Welcome check circle | `var(--success-100)` bg, `var(--success-500)` border, `var(--success-600)` icon |
| Role hint pill bg | `var(--surface-100)` |
| Role hint pill border | `var(--surface-200)` |
| Required asterisk | `var(--error-500)` |
| Optional label | `var(--surface-400)` |

### Typography

| Element | Family | Size | Weight |
|---|---|---|---|
| Card title | Inter | 22px | 600 |
| Card subtitle | Inter | 14px | 400 |
| Field label | Inter | 13px | 600 |
| Field hint / error | Inter | 12px | 400 |
| Input text | Inter | 14px | 400 |
| Loading copy | Inter | 14px | 400 |
| Email greeting | Inter | 22px | 600 |
| Email body | Inter | 14px | 400 |
| Email footer | Inter | 11px | 400 |

### Spacing

| Location | Value |
|---|---|
| Shell vertical padding | 48px top, 88px bottom (leaves room for devbar) |
| Card padding | 32px |
| Between card elements (field groups) | 14px |
| Name row gap | 10px |
| Between card subtitle and first field | 24px |
| Avatar + link gap | 10px |

### Motion

| Interaction | Duration | Easing |
|---|---|---|
| Step transition (show/hide) | Immediate (CSS display toggle) | — |
| Spinner rotation | 0.9s | linear infinite |
| Input border / focus ring | 120ms | ease (default) |
| Button hover | 120ms | ease (default) |
| Code box fill state | 120ms | ease (default) |
| Strength meter bar | 200ms | ease (default) |

### Component references

- Button — DS §7.1
- Input + password eye-toggle — DS §7.6
- Textarea — DS §7.7
- Avatar upload dropzone — DS §7.5 / §8.12

---

## 8. Edge cases

| # | Edge case | Expected behaviour |
|---|---|---|
| 1 | User opens an expired invitation link | Redirect to an error screen or show error state on load. Screen designs and backend handoff architecture not yet specified — ⚠️ NEEDS INPUT (see §10 Q1). |
| 2 | User opens a cancelled invitation link | Same as expired. ⚠️ NEEDS INPUT. |
| 3 | User is already a member of the workspace and clicks an old invite link | Show "already a member" state. Screen designs and backend handoff architecture not yet specified — ⚠️ NEEDS INPUT (see §10 Q1). |
| 4 | SSO (Google) fails or is rejected | User must fall back to the email+password form. Show a dismissible error: "Google sign-in failed. Please try again or use email and password." above the Google button. No navigation away. |
| 5 | Email+password sign-up with an email already registered | Show inline error on the email field: "An account with this email already exists. Log in instead." with a link to the login path. |
| 6 | Log-in view inside new-user flow: wrong password / non-existent account | ⚠️ NEEDS INPUT — designs and backend response (inline error vs. redirect to a dedicated error screen) not yet specified. |
| 7 | Verification code is wrong or expired | Show inline error below the 6-box group: "Incorrect code. Please try again." If expired: "This code has expired. Resend a new one." |
| 8 | User types a very long job title or bio | Job title input: truncates visually at input boundary; stored as entered. Bio textarea: `resize: vertical; min-height: 88px`; **soft limit 300 characters with a live `N / 300` counter below the field** (`maxlength="300"` enforced). Counter switches to error-500 once the limit is exceeded; implemented in prototype (change log 2026-05-20). |
| 9 | User uploads a non-image file to avatar | `accept="image/*"` on the file input; show browser-native rejection. If the backend further validates: show: "Please upload an image file (JPEG, PNG, or WebP)." |
| 10 | Slow network (>3s) during OAuth call | Loading screens (`loading-new`, `loading-ex`) are shown during the OAuth call; they communicate that the system is working. If the call fails after the user reaches Step 2/`ex-login`, show an actionable error. |
| 11 | User navigates away mid-profile (refreshes or closes tab) | Profile data is not yet persisted; user must re-enter. There is no draft save. Consider a `beforeunload` warning if fields are partially filled. |
| 12 | Existing user (signed-in path) — auth check succeeds but workspace join fails | `loading-ex` shows "Checking your account…"; if workspace join fails server-side, route to an error state rather than silently advancing to `ex-welcome`. ⚠️ NEEDS INPUT on error handling for this path. |
| 13 | Very long workspace or organisation name in email invite block | Invite block `.email-invite-name` truncates with `overflow: hidden` or wraps; currently no explicit truncation in prototype. Developer to confirm. |

---

## 9. Decision rationale

| Decision | Choice | Why | Alternatives rejected |
|---|---|---|---|
| Welcome step removed from new-user flow | Profile is the final step; hands off directly to the dashboard with `?welcome=1&role=<variant>` | Kept the user journey lean — a dedicated "You're in" screen inside the onboarding wizard added a step without meaningful content that the dashboard welcome banner can't provide. Dashboard receives the role variant via query param and renders contextually. | Retained dedicated Step 5 welcome card (removed 2026-05-20, per ui-change-logs). |
| Name fields moved from OAuth step to Profile step | First + last name captured at Profile (Step 4), not at Sign-up (Step 2) | OAuth restructure on 2026-05-19: Step 2 became the OAuth screen, which should minimise friction. Profile is the natural place for identity data. Backend receives split first/last fields (`pr-first` / `pr-last`). | Single "Full name" field (rejected — backend uses split fields per PRD §2.1). Name at sign-up step (reverted 2026-05-19). |
| Email+password form is a real fallback, not prototype scaffolding | Both SSO and email+password paths must be built | Google SSO is the primary path. Email+password exists for users who cannot or will not use Google. Builds resilience. | SSO-only implementation. |

---

## 10. Open questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Invite error states: what screens are shown when a user arrives with an expired, cancelled, or already-used invite link? Three separate states exist conceptually (PRD §2.3); designs have not been done and the backend handoff (dedicated error route vs query-param redirect vs error card on the same route) is not decided. | Lara / Dev | Open |
| 2 | Onboarding route: suggested `/join`; final decision with implementing developer based on backend/router constraints. Affects deep-link structure in invitation emails. | Dev | Resolved (2026-05-20) — suggest `/join`, dev to confirm |
| 3 | Bio character limit: soft limit 300 characters with a live counter; soft enforcement client-side, hard truncation server-side at 300. | Lara | Resolved (2026-05-20) |
| 4 | Existing-user workspace join failure: if the auth check succeeds but workspace membership write fails, what error does the user see at `loading-ex`? | Dev | Open |
| 5 | Default invite role contradiction in PRD (§1.3 says Viewer, §P3 says Member). **Resolved: default = Member.** Source PRD still needs the §1.3 / §P3 contradiction fixed at origin — flagging as a separate doc-fix follow-up. | Lara | Resolved (2026-05-20) — default is Member; PRD source needs reconciling separately |

---

## 11. Accessibility notes

- **Keyboard:** Tab order follows DOM order within each card. "Continue" and step-advance buttons are the natural final focusable element. Step 3 code boxes auto-advance focus on input and reverse on Backspace into an empty box. Back links are above the card title and in tab order.
- **Screen reader:** Each step section carries `aria-labelledby` pointing to its `card-title` H1. The `ob-shell` has no ARIA role (it is a plain div). Code box group: `role="group" aria-label="Verification code"` with per-box `aria-label="Digit N"`. "Verify and continue" and "Continue" buttons use `aria-disabled` in addition to `disabled`. Existing-user welcome role pill (`#ex-welcome-role-hint`): `aria-live="polite"` so role changes driven by devbar announce themselves.
- **Contrast:** Primary-600 on white (CTA button) passes WCAG AA. Error-500 on white for asterisks and strength meter labels — verify AA.
- **Motion:** Respect `prefers-reduced-motion`: suppress spinner animation. Loading screens should still show static copy even if the spinner is suppressed.
- **Focus management:** On step advance, move focus to the new step's H1 or the first focusable element. Smooth scroll-to-top on step change (already implemented in prototype).

---

## 12. Dev notes & Linear ticket breakdown

### House rules (assumed; flag exceptions only)

Lucide icons (no emoji). Sentence case. Second person. Verbs lead CTAs. No gradients, glassmorphism, rounded-left accent cards, coloured/inner shadows. Demo or scenario controls live exclusively in the bottom `.devbar`, never on the prototype surface.

### Files likely affected

- New route file (Vue page component) — suggested path `/join`; final decision with implementing developer
- `components/OAuthSignUp.vue` or equivalent
- `components/EmailVerification.vue`
- `components/OnboardingProfile.vue`
- `pages/signup.vue` (existing — may be refactored into the new wizard)
- Dashboard page — existing `renderWelcome(role)` logic reading `?welcome=1&role=` already built

### Dependencies

- Backend: OAuth2 callback URL + workspace membership write on activation
- `features/adding-user` — admin side sends the invite token this flow consumes
- Dashboard welcome hero — receives `?welcome=1&role=<variant>`; implementation is in the `dashboard` feature

### Known constraints

- OAuth2 redirect may wipe in-page JS state; this does not affect flow progression as there is no progress indicator to restore.
- Invite email steps (`data-step="1"` / `data-step="ex-1"`) are **not application routes** — they are email-template references. Do not create Vue routes or pages for these.

### Do not

- Do not implement `data-step="1"` or `data-step="ex-1"` as application screens, routes, or views. They are email-template design references only.
- Do not invent a custom email+password form as the primary auth path — Google OAuth is primary; email+password is the backend fallback.
- Do not add a step between Profile and the dashboard handoff. The welcome screen was deliberately removed from the wizard (see §9); the dashboard banner handles role-contextual welcome messaging.

### Linear breakdown

Linear hierarchy for this work:
**Project** → **Issue** → **Sub-issues**

- **Project:** Users & Permissions
- **Issue:** [TRV-876](https://linear.app/traverse-engineering/issue/TRV-876/user-onboarding) — User onboarding
- **Sub-issues:** See table below.

| # | Sub-issue title | Scope (one line) | Layer | Linear |
|---|---|---|---|---|
| 1 | User onboarding — Frontend (new-user flow) | Build the new-user wizard: loading-new → OAuth screen (Step 2, sign-up + in-card log-in toggle) → email verification step (Step 3) → profile setup (Step 4) → dashboard handoff. **Explicitly excludes** `data-step="1"` invite email (reference only, not an app screen). | Frontend | [TRV-877](https://linear.app/traverse-engineering/issue/TRV-877/user-onboarding-frontend-new-user-flow) |
| 2 | User onboarding — Frontend (existing-user flow) | Build the existing-user mini-flow: loading-ex → auth check branch → ex-login (not-signed-in path) → ex-welcome handoff. | Frontend | [TRV-878](https://linear.app/traverse-engineering/issue/TRV-878/user-onboarding-frontend-existing-user-flow) |
| 3a | User onboarding — OAuth2 callback and session handling | Google SSO path: OAuth2 callback + session handling across redirect; workspace membership write on activation. | Backend | [TRV-879](https://linear.app/traverse-engineering/issue/TRV-879/user-onboarding-oauth2-callback-and-session-handling) |
| 3b | User onboarding — Email + password sign-up and verification email | Email+password fallback path: backend account creation, 6-digit verification email dispatch and code validation. | Backend | [TRV-880](https://linear.app/traverse-engineering/issue/TRV-880/user-onboarding-email-password-sign-up-and-verification-email) |
| 4 | User onboarding — Invite error states | Design and build error screens for expired / cancelled / already-a-member invite links. **Blocked until §10 Q1 is resolved** (screen designs + backend handoff architecture not decided). | Frontend + Backend | [TRV-881](https://linear.app/traverse-engineering/issue/TRV-881/user-onboarding-invite-error-states) |
| 5 | User onboarding — Profile form (split name fields) | Persist first + last name (split, per backend schema), job title, department, bio (300-char soft limit), profile photo from Step 4 to user record. | Backend / Data | [TRV-882](https://linear.app/traverse-engineering/issue/TRV-882/user-onboarding-profile-form-split-name-fields) |
| 6 | User onboarding — Welcome variant handoff | Ensure `?welcome=1&role=<variant>` routing is correct for all four contexts (Member / Moderator unassigned / Viewer unassigned / empty workspace); coordinate with dashboard welcome-hero implementation. | Frontend | [TRV-883](https://linear.app/traverse-engineering/issue/TRV-883/user-onboarding-welcome-variant-handoff) |
| 8 | User onboarding — Invitation email template | Define and build the HTML email template(s) using the `data-step="1"` / `data-step="ex-1"` prototype screens as structural reference. Role token and helper sentence must be dynamically populated per invite. **This is the only sub-issue that uses Step 1 / ex-1 content.** | Copy / Backend | [TRV-884](https://linear.app/traverse-engineering/issue/TRV-884/user-onboarding-invitation-email-template) |

<!-- Sync log -->
- 2026-05-20 (sync run 2): Absorbed from change log 2026-05-20 — all progress steppers removed from prototype. Swept stepper references from §2 Scope, §3 Surface (design system refs), §4 Anatomy intro, §4 Progress steppers subsection (removed entirely), §4 Component references, §5 States (role hint pill row also removed), §6 Progressive disclosure, §7 Colours (7 stepper token rows removed), §7 Typography (stepper labels row removed), §7 Spacing (2 stepper rows removed), §7 Motion (stepper row removed), §7 Component references (Stepper — DS §8.9 removed), §9 Decisions (stepper decision row removed), §10 Open questions (Q3 stepper feasibility removed; Q4–Q6 renumbered Q3–Q5), §11 Accessibility (stepper contrast note removed), §12 Known constraints (stepper constraint reworded). §12 sub-issue 7 (Progress stepper) flagged for user approval to remove — not auto-written.
- 2026-05-20 (sync run 2): Absorbed from change log 2026-05-20 — §2 new-user flow bullet updated to reflect in-card login toggle. Approved by user.
- 2026-05-20 (sync run 3): Absorbed: §12 sub-issue 7 (Progress stepper) removed; out of scope per change log 2026-05-20.
- 2026-05-20 (sync run 4): Absorbed: §6 — clarified that role variant survives via handoff query param only after profile-step role chip was removed (change log 2026-05-20).
- 2026-05-20 (sync run 5): Absorbed: 'How to navigate' walk-throughs — moved role-hint-pill mention from new-user Profile to existing-user Welcome (change log 2026-05-20, profile-chip removal).
- 2026-05-20 (sync run 6): Absorbed: devbar Prefill-all row description — CTA copy 'Complete and go to dashboard' → 'Complete sign up'; step ref aligned with devbar button label '5 · Profile' (change log 2026-05-20).
- 2026-05-20 (sync run 7): Absorbed: 'New-user golden path' walk-through — CTA copy 'Complete and go to dashboard' → 'Complete sign up' (change log 2026-05-20).
- 2026-05-20 (sync run 8): Absorbed: §4 Anatomy — Step 2 restructured into two auth views (sign-up + log-in) inside one card; back link removed; square logo added; confirm-password field removed; Google moved from top to bottom; log-in submit routes directly to dashboard (change log 2026-05-20).
- 2026-05-20 (sync run 9): Absorbed: §5 States — Disabled CTA row distinguishes Step 2 sign-up vs log-in view gates (change log 2026-05-20, Step 2 restructure).
- 2026-05-20 (sync run 10): Absorbed: §6 Behaviour — documented Step 2 auth-view toggle, log-in skip path to dashboard, and updated sign-up validation; disambiguated existing email+password bullet to 'sign-up view' (change log 2026-05-20).
- 2026-05-20 (sync run 11): Absorbed: §'How to navigate' walk-throughs — updated golden-path and email+password fallback to reflect Step 2 restructure (logo, no back link, no confirm, Google at bottom); added new bullet for in-card 'Log in' → direct-to-dashboard shortcut (change log 2026-05-20).
- 2026-05-20 (sync run 11): Absorbed: §8 — added ⚠️ NEEDS INPUT row (new row 6) for log-in view wrong-password / non-existent-account handling; renumbered former rows 6–12 to 7–13 (change log 2026-05-20, Step 2 log-in view added). Also promoted row 8 (bio) from spec/decision framing to 'implemented in prototype' and added maxlength="300" reference.
- 2026-05-20 (sync run 11): Absorbed: bio character counter — §4 anatomy tightened to include maxlength="300" attribute reference; §5 States — added bio counter at-limit row (error-500 colour + maxlength enforcement); §8 row 8 promoted to 'implemented'; §10 Q3 verified after renumbering — no structural edit needed (change log 2026-05-20).
- 2026-05-20 (sync run 11): Absorbed: 'How to navigate' final pass — Reset state and Prefill all devbar rows corrected to remove confirm-field references (confirm field removed in Step 2 restructure); no other residual mismatches found (change log 2026-05-20).
- Linear tickets created 2026-05-20: 9 tickets (1 parent + 8 sub-issues) in project Users & Permissions. Sub-issue 3 split into 3a (OAuth2 callback) + 3b (email+password); project name corrected from "Users & Permissions V2" to "Users & Permissions" per user decision.

