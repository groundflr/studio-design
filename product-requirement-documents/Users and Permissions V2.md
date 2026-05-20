# **Users & Permissions**

**Traverse Studio · Product Requirements** **Version 2.0 · May 2026**

---

## **Document Purpose**

This document defines the user roles, permissions, onboarding flow, and access architecture for Traverse Studio. 

---

## **0\. System Architecture Overview**

### **0.1 Hierarchy**

Traverse Studio operates with a clear hierarchical structure:

**Platform → Organisation → Workspace → Collection → Content**

### **0.2 Organisations**

**An organisation** represents a single customer entity in Traverse Studio. It is the top-level container for all of that customer's workspaces, users, and content. Examples: University of Cape Town; a corporate L\&D function; an accreditation body.

#### **Organisation vs Workspace**

* **Organisation** — billing boundary, account ownership, global user pool.  
* **Workspace** — operational boundary for a team or department, content container, day-to-day authoring and assessment work.

#### **Organisation settings**

* Billing and subscription  
* Cross-workspace user management  
* Organisation branding (logo and colours cascade to all workspaces)  
* Workspace creation, renaming, and deletion  
  * Adding users to Workspaces

#### **User pool**

All users within an organisation belong to a shared user pool. A single user account can be assigned to multiple workspaces within the same organisation, with different roles in each workspace. A user cannot access workspaces in a different organisation without a separate account in that organisation.

#### **Multi-workspace scenarios**

* **University:** Separate workspaces for the School of Medicine, the School of Business, and the School of Engineering — all under the University of Cape Town organisation.  
* **Corporate:** Separate workspaces for Sales Training, Leadership Development, and Graduate Hiring — all under the main organisation account.

---

## **1\. User Roles**

Traverse Studio operates with a hierarchical, role-based access control (RBAC) model. Access is determined entirely by role. There are no collection-level access controls or user groups — see Section 3\.

### **1.1 Role structure**

There are two layers of role:

* **Organisation-level:** Org Owner and Org Admin. These roles operate above any single workspace.  
* **Workspace-level:** Workspace Admin, Standard User, Moderator, Viewer. These roles operate within a specific workspace.

**Cascading capabilities.** Workspace roles cascade. A Workspace Admin can do everything a Standard User can do, plus workspace administration. A Standard User can do everything a Moderator can do, plus content authoring. Viewer is a separate read-only role and does not sit on the same cascade.

**Super Admin (internal only)**

Super Admin is a Traverse-employee construct, not a customer-facing role. Super Admins do not appear in any customer organisation's user list. They have multi-organisation navigation, manage platform-wide templates. Super Admins are bound by a principle of least privilege and do not routinely access customer content without explicit request.

### **1.2 Role Definitions**

![][image1]

#### **Org Owner**

**Scope:** Entire organisation. Billing authority. **Who:** The person ultimately accountable for the organisation's Traverse account. Exactly one per organisation; transferable to another user.

Org Owner has everything an Org Admin has, plus exclusive control over billing and the ability to transfer ownership.

**Additional capabilities (beyond Org Admin):**

* Manage billing details, payment methods, and subscription  
* View and download invoices  
* Transfer the Org Owner role to another user in the organisation  
* Close or cancel the organisation account

**Transfer rules:** Only the current Org Owner can initiate a transfer. The receiving user must accept the transfer. Upon acceptance, the previous Org Owner is automatically demoted to Org Admin.

#### **Organisation Admin**

**Scope:** Entire organisation, excluding billing. **Who:** Administrators managing the organisation account on behalf of the Org Owner.

Org Admins have authority across all workspaces within their organisation. They manage organisation-wide settings, create and delete workspaces, and have Workspace Admin privileges in every workspace in the organisation.

**Core capabilities:**

* Create, rename, and delete workspaces within the organisation  
* Assign Workspace Admins to specific workspaces  
* Configure organisation-wide SSO and authentication  
* Set organisation-level branding  
* Manage cross-workspace user assignments  
* Full Workspace Admin privileges in every workspace in the organisation  
* Access organisation-wide analytics and reporting

**Org Admins cannot:**

* Manage billing or transfer Org Owner (Org Owner only)  
* Access workspaces outside their organisation  
* Designate workspaces as global (Super Admin only)

#### **Workspace Admin**

**Scope:** A single workspace. Full administrative control.

Workspace Admins have complete control within their assigned workspace. They have all Standard User capabilities, plus the ability to manage users and configure the workspace.

**Additional capabilities (beyond Standard User):**

* Invite users, assign workspace roles, deactivate or remove users  
* Configure workspace settings and branding  
* Manage workspace-level integrations and LMS connections  
* Configure workspace defaults (feedback, grading, environments)  
* Access all reporting and analytics within the workspace

**Workspace Admins cannot:**

* Designate a workspace as global (Super Admin only)  
* Access other workspaces unless explicitly assigned  
* Manage organisation-level billing or branding  
* Create a new workspace

#### **Standard User**

**Scope:** A single workspace. Full content authoring and moderation.

*Note: Standard User replaces the role previously called "Author".*

Standard Users are the primary content creators in Traverse Studio. They can author, edit, and moderate any content in the workspace they belong to. They have full Moderator capabilities, plus authoring.

**Core capabilities:**

* Create, edit, duplicate, archive, and delete simulations (all types)  
* Create, edit, duplicate, archive, and delete tests  
* Build and manage sequences  
* Build and manage rubrics, feedback scorecards, and grading criteria  
* Create, edit, and publish sequence environments (no admin approval step)  
* Create and manage content items  
* Create collections  
* Save personal templates and publish workspace templates  
* Use AI co-authoring tools  
* Access reporting and analytics across the workspace

**Standard Users cannot:**

* Invite users, assign roles, or remove users  
* Modify workspace settings or integrations

#### **Moderator**

**Scope:** A single workspace. Submission grading and review. Read-only on the tests and simulations being moderated.

Moderators review, grade, and provide feedback on candidate submissions. They cannot author content but can read the tests and simulations whose submissions they are moderating, so they have the context needed to grade fairly.

**Core capabilities:**

* View all submissions and results in the workspace  
* Grade submissions and edit feedback  
* Override AI-generated grades where human judgement is required  
* Read-only access to the tests, simulations, and rubrics being moderated (to understand grading context)  
* Add notes and comments to submissions \- new feature  
* Access reporting and analytics for content they moderate

**Moderators cannot:**

* Create or edit simulations, tests, rubrics, or any authored content  
* Modify test or simulation configuration (grading criteria, success criteria, rubrics)  
* Access workspace settings or user management  
* Invite users or change roles  
* Create collections, sequences, test, assessment, simulations, or content items

**UI behaviour:** Moderators see a streamlined interface focused on review and grading. Authoring tools are hidden. When opening a test or simulation, the interface displays it in read-only mode with a clear visual indicator.

#### **Viewer**

**Scope:** A single workspace. Read-only across *all* submissions linked to a single asset.

Viewers see test content and submissions but cannot modify anything. This role is appropriate for stakeholders, observers, or auditors who need visibility without operational access.

**Core capabilities:**

* View simulations, tests, sequences, environments, rubrics, and content items  
* View candidate submissions and results across the workspace  
* Access reporting and analytics (read-only)

**Viewers cannot:**

* Create, edit, or delete any content  
* Grade submissions or modify feedback  
* Export results (unless an Admin grants the export permission)  
* Invite users, change roles, or modify any settings

**UI behaviour:** All edit, create, and delete actions are hidden. The interface is strictly read-only across the workspace.

### **1.3 Role assignment rules**

* **Roles are workspace-scoped.** A user can have different roles in different workspaces within the same organisation.  
* **Roles are assigned by Workspace Admins, Org Admins, or the Org Owner.** No other role can change role assignments.  
* **Least privilege by default.** If no role is explicitly selected when inviting, the default is Viewer.  
* **Real-time application.** Role changes take effect immediately. The user's interface updates on their next action or page refresh.  
* **No self-escalation.** Users cannot change their own role.  
* **Super Admin cannot be assigned through any customer interface.** Only Traverse internal systems can grant Super Admin status.

---

## **2\. User Onboarding**

User onboarding is the process by which new users are invited into a workspace, complete their account setup, and become active in the workspace.

### **2.1 Invitation flow**

#### **Step 1 — Admin initiates an invitation**

A Workspace Admin (or Org Admin, or Org Owner) navigates to the workspace user management section and clicks "Invite Member".

#### **Step 2 — Admin selects an invitation method**

**Method A: Direct email invitation**

* Admin enters one email address  
* Admin selects the workspace that the user is member of   
* Admin selects the workspace role for the invitee(s)  
* System sends an email to each invitee with a unique invitation link

#### **Step 3 — Invitee receives notification**

**Direct email:** the invitee receives an email with a welcome message, the organisation name and workspace name, their assigned role, and a unique link to complete onboarding.

#### **Step 4 — Sign up**

Clicking the invitation link routes the invitee to the standard Traverse sign-in page, with a sign-up option below it.

* **If the user does not have a Traverse account:** they click "Sign up", create their account (email pre-filled if invited by email), and verify their email address. The invitation is applied on the first successful sign-in.

#### **Step 5 — Onboarding profile**

New Traverse users (without an existing account) complete a one-time onboarding form on first sign-in. This profile is global to the Traverse account, not per-workspace.

**Required fields:**

* Full name  
* Email address (pre-filled)  
* Job title or role (freeform text)

**Optional fields:**

* Department  
* Profile photo  
* Bio or introduction

*Users with an existing Traverse account skip this step — their global profile is reused when they join any new workspace.*

#### **Step 6 — Email confirmation**

* The user needs to confirm their email by entering a unique code sent to the email address. 

#### **Step 6 — Email Activation**

* The user is marked as Active in the workspace  
* The inviting Admin receives a notification  
* The user sees a welcome screen confirming their role and the workspace name  
* The user is routed to the workspace home view

### **2.2 Access on day one**

Because access is now workspace-wide (no collection-level ACL), once a user joins a workspace they immediately have access to all content in that workspace at the level their role permits. There is no separate "assign to collection" step.

### **2.3 Invitation states**

Direct email invitations move through a defined set of states:

| State | Description | Admin actions available |
| ----- | ----- | ----- |
| **Pending** | Invitation sent, user has not yet clicked the link or completed onboarding. | Resend invitation, Cancel invitation |
| **Expired** | The invitation link expired before the user clicked it. | Resend invitation with a new link | Cancel the invitation |
| **Cancelled** | Admin cancelled the invitation before the user accepted it. | Re-invite user (creates a new invitation) |

---

## **3\. Workspaces & Collections**

### **3.1 Workspaces**

A workspace is the operational container for a team's content and activity. All authoring, assessment, grading, and reporting happens within a workspace.

**Multi-workspace membership.** Users can belong to multiple workspaces within the same organisation. Each workspace maintains its own role for that user. A user switches context when navigating between workspaces. The Org Owner and Org Admins effectively have Workspace Admin access in every workspace in their organisation.

### **3.2 Collections**

A collection is a grouping of related content within a workspace. Collections organise simulations, tests, sequences, content items, and related artefacts by programme, cohort, or initiative.

**Example collections:**

* "Graduate Hiring Programme 2026"  
* "Leadership Development — Cohort 5"  
* "Intro to Accounting — Fall 2026"  
* "Customer Service Onboarding"

### **3.3 Access model**

**Collections do not gate access.**

Any standard user with workspace access has access to every collection in that workspace, at the level their role permits. Collections are an organisational construct — they shape navigation and reporting, not permissions.

We will have a  hybrid RBAC \+ ACL model. Content access restrictions will apply to only viewer and moderator roles. 

**What this means in practice:**

* A Standard User in a workspace can author and edit any content in any collection in that workspace.  
* Moderators can only see and grade / moderate in test submission GROUPS (or lists) they've been assigned to.  
  * A Moderator should have view only access to a test details / config rubric etc. so that they have context for grading.   
* Viewers can only view tests/sims/etc  (incl submissions) they are assigned to  
* Being added as moderator or viewer in the WS gets you in , but you still need to be assigned to either the group / list of submissions (moderator) or the asset (viewer)  
* If finer-grained access becomes necessary in future for std users, it will be re-evaluated. 

### **3.4 Creating and managing collections**

**Who can create collections:** Workspace Admins, Org Admins, the Org Owner, and Standard Users.

**Who can delete collections:** Workspace Admins, Org Admins, and the Org Owner. (Standard Users can archive collections they created, but cannot delete them, to prevent accidental loss of broader content.)

---

## **4\. Permission Matrix**

This matrix summarises what each role can do across key platform actions. Super Admin is omitted because it is an internal-only role that operates outside the customer permission model.

| Action | Org Owner | Org Admin | Workspace Admin | Standard User | Moderator | Viewer |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| **Organisation Management** |  |  |  |  |  |  |
| Manage billing & subscription | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Transfer Org Owner role | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Create / delete workspaces | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Configure org-wide SSO | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Assign Organisation Admins | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Set org-wide branding | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View org-wide analytics | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Workspace & User Management** |  |  |  |  |  |  |
| Manage workspace settings | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Invite users to workspace | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Assign workspace roles | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Deactivate / remove users | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Configure integrations / LMS | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage workspace environments | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Asset Authoring** |  |  |  |  |  |  |
| Create collections | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create / edit simulations | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create / edit tests | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create / edit sequences | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create / edit rubrics | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create content items | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create / publish environments | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Use AI co-authoring tools | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Templates** |  |  |  |  |  |  |
| Save personal templates | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Publish workspace templates | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Manage global templates | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Grading & Feedback** |  |  |  |  |  |  |
| View submissions | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Grade / override AI grades | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Edit feedback | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Read tests/sims being moderated | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Reporting & Analytics** |  |  |  |  |  |  |
| View workspace analytics | ✓ | ✓ | ✓ | ✓ | ✓ (own) | ✓ |
| Export  / Sync results | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |

**Legend:** ✓ \= allowed. ✗ \= not allowed. "(own)" \= scoped to content the user is moderating.

*Manage global templates is shown as ✗ for all customer roles because it is reserved for Super Admins, who are not represented in this matrix.*

---

## **5\. Access Control Principles**

#### **P1. Pure RBAC**

Permissions are determined entirely by role. There are no collection-level access controls, team-based permissions, or per-asset sharing. Workspace membership equals workspace access.

#### **P2. Roles cascade (with one exception)**

Workspace Admin contains Standard User contains Moderator contains Viewer. A higher role can always do everything a lower role can do, plus more. 

#### **P3. Default access role**

When inviting a user, the default role (Std User) is selected.

#### **P4. Real-time permission updates**

Role changes take effect immediately. The user's interface updates on their next action or page refresh. There is no batch processing of permission changes.

#### **P5. Auditability**

All role and access changes — invitations, role assignments, deactivations, ownership transfers — are logged with a timestamp and the actor who made the change. The audit trail is accessible to Workspace Admins and above.

#### **P6. No self-escalation**

Users cannot change their own role. Only Admins (workspace or organisation) can modify roles. The Org Owner role is the only role that can transfer itself, and the transfer requires the receiving user to accept.

#### **P7. Separation of billing from administration**

Only the Org Owner can manage billing. Even Org Admins are deliberately excluded from financial controls, so administrative authority and financial authority can be held by different people if needed.

---

## **6\. Implementation Notes**

### **6.1 UI considerations**

#### **Navigation adapts to role for Moderators & Viewers**

The primary navigation and available actions adapt based on the user's role. Standard Users do not see user management or workspace settings. Moderators see a streamlined interface focused on grading and results. Viewers see read-only views of content and reports.

#### **Disabled vs hidden**

For high-frequency administrative actions (user management, workspace settings), unavailable controls are hidden from non-admins to reduce cognitive load. For lower-frequency actions where discoverability matters (e.g. publishing a template), unavailable controls remain visible but disabled, with a tooltip explaining who can perform the action. This is a deliberate trade-off: hidden UI is cleaner; disabled UI answers the "why can't I do this?" question more gracefully.

#### **Role and ownership indicators**

When viewing a user's profile or the user list, Admins see:

* The user's current role in this workspace  
* Other workspaces in the organisation the user belongs to, and their role in each  
* Org Owner / Org Admin status, where applicable

### **6.2 Onboarding UX**

**Welcome screen.** After completing onboarding, users see a tailored welcome screen confirming their role and workspace access.

### **6.3 Bulk operations**

Workspace Admins can perform the following in bulk:

* Select multiple invitees and assign the same role to all of them  
* Select multiple users and deactivate them in one action  
* Select multiple users and change their role in one action

### **6.4 Deactivating and removing users**

**Deactivation.** Admins can deactivate a user without permanently deleting their account. Deactivated users cannot sign in, do not appear in user lists or search, and retain ownership of any content they created. They can be reactivated later by an Admin.

**Permanent deletion.** Admins can permanently delete a user. Their account is removed from the workspace. Content they created is reassigned to the Admin who deleted them (or to a designated "workspace content" owner). Submission history is retained for auditability, anonymised as "Deleted user".

**Why deactivation exists.** Deactivation is the safer default for users who leave an organisation or no longer need access. It preserves content ownership and allows easy reactivation if the user returns.

---

## **7\. Edge Cases and Constraints**

### **7.1 Cross-workspace access within an organisation**

Users can belong to multiple workspaces within the same organisation. Each workspace maintains its own role for that user. A user who is a Workspace Admin in Workspace A and a Standard User in Workspace B switches context when navigating between workspaces.

Users cannot access workspaces in a different organisation without a separate account in that organisation. Only Super Admins have cross-organisation navigation.

### **7.2 Global workspaces and global templates**

Super Admins can designate a workspace as a "global workspace". Global workspaces manage global templates — content that can be inherited by other workspaces. Only Super Admins can create, modify, or delete global templates. See the Templates section of the High-Level Product Strategy for the full template model.

### **7.3 Invitation expiry and re-invites**

If an invitation link expires before the user clicks it, the Admin can resend the invitation. The system generates a new unique link with a fresh expiry date. The original invitation is marked as Expired and cannot be used.

### **7.4 Role changes for users mid-task**

If an Admin changes a user's role while they are actively working in the workspace, the change takes effect immediately. The user's next action will respect the new role's permissions. If the new role does not permit an action they were about to take (for example, editing content after being demoted to Viewer), the system blocks the action and displays a message explaining that their permissions have changed.

### **7.5 Org Owner transfer and account closure**

**Transfer:** Only the current Org Owner can initiate a transfer. The receiving user (who must already be in the organisation) accepts via an in-product confirmation. On acceptance, the previous Org Owner is demoted to Org Admin and the new Org Owner takes over billing authority.

**Account closure:** Only the Org Owner can close or cancel the organisation account. This action requires re-authentication and a confirmation step.

## 

[image1]: <data:image/png;base64,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>