# **Feedback \- Product Scope**

# **Feedback \- Product Scope & Docs**

## **Introduction**

This document outlines the product requirements for the Feedback in Traverse Studio, covering feedback configuration, generation, sharing and candidate experience.

---

## **What happens where**

1. **Feedback Generation Settings → Test Settings Page**  
   The author of the test adjusts the feedback settings to determine if they want feedback, what feedback to generate & display as well as setting the feedback tone. The author can also add a custom prompt to override our standard tone settings and additional context to feedback generation. 

2. **Admin Feedback View & Edit → Individual Submission**  
   The author or moderator can view the generated feedback on an individual submission. The author can choose to edit the feedback. Once edited the author must save the edit. The original and edited version of the feedback must be stored with audit log data.      
     
3. **Feedback Sharing or Export (as a subset of Results sharing) → All Submissions Page**  
   The author / moderator can choose to share the results with students via a number of channels.  
- Export / Download CSV of all and or selected submission   
- Export / Download PDF of selected submission   
- Send an email with unique URL to results \+ feedback candidate page (Candidate can download a pdf)  
  - Future requirement \- candidate logs a grading query  
- Send an email attached PDF of results & feedback   
- Send results & feedback to an external system (eg: moodle) 


4. **Results & Feedback View Page (Candidate)**  
   The candidate can view results & feedback on a unique url if the admin chooses to enable this. What data & how the candidate can interact with the page depends on what has been enabled by the admin. The options include.  
- Static Text with varying levels of details. (Summary feedback & or category level feedback)   
- Dynamic Feedback (Static Feedback that can then be queried via an LLM chat type interface) 

## **Feedback View Types**

### **1\. Static Feedback (Isolated Test & Multiple Test Assessment)**

**Description:** Single assessment with corresponding feedback event

**Characteristics:**

* Feedback (text only) is read-only (non-interactive)  
* Feedback (text only) should be exportable to PDF, Markdown, CSV

**User Flow:**

1. Learner completes assessment (written response, file upload, video, etc.)  
2. System grades submission against rubric  
3. Learner navigates to separate "View Feedback" event  
   * Navigation could be in an external system (e.g., iframe)  
4. Feedback displays in text format  
5. Learner can export feedback

### **2\. Queryable Feedback (Isolated Test & Multiple Test Assessment)**

**Description:** The ability to query feedback with conversational capability (Chat with feedback)

**Characteristics:**

* Similar to Static Feedback, but feedback is interactive  
* Chat-based interface for learner questions  
* Display the feedback with an LLM-type interface to chat about the feedback

**Example User Interactions:**

* "Can you explain what you meant by X?"  
* "I think you mean this. Is that correct?"  
* "Can you give me more details on Y?"

**Guardrails:**

* Questions must relate to the submission and feedback only  
* Consider using a set of pre-built questions  
* No general-purpose chatbot functionality  
* Must have a conversation thread limit

### **3\. Sequence-Based Feedback Usage (Feedback Event)**

**Description:** Feedback within narrative sequences, combining elements of Use Cases 1 and 2

**Characteristics:**

* Feedback events linked within sequence structure  
* Example sequence: Email Sim → Chat Sim → Feedback to User → Submit File → Feedback to User (Summative)

**Two Feedback Types:**

1. **In-narrative feedback:**  
   * Specific to an assessment/simulation event  
   * 1:1 relationship  
   * Directly related to the chat sim a user just completed in the sequence

2. **Summative feedback:**  
   * Assessment-level feedback at sequence completion  
   * Summary of the user's performance across the sequence

---

## **Feedback Generation**

### 

### **The Trigger to Generate Feedback**

* **Automatically triggered** when an assessment is graded against a rubric if feedback generation has been enabled by the author of the test   
* Runs **asynchronously** (does not block grading process)

### **Input Sources**

* Learner submission content  
* Rubric criteria and scoring  
* Grading results/scores  
* Admin-configured feedback parameters  
* Custom Prompt by admin 

### **Output**

* Text-based feedback content  
* Structured format (introduction, criterion-by-criterion feedback or summary)  
* Stored in database associated with submission ID

### **Processing**

* Queue-based system to handle volume  
* Retry logic for failed generations  
* Status tracking (pending, generating, complete, failed)

---

## **Feedback Review (Submissions Page)**

**Purpose:** Enable authors to review, edit, and approve AI-generated feedback before it is released to students. This is a human-in-the-loop requirement — the AI does not get the final say. This is optional \- authors can just accept the generated feedback by default. 

### **Core Principle**

**No feedback reaches candidates without author review and approval.** All AI-generated feedback must pass through a review workflow where qualified authors can read, modify, improve, or completely rewrite feedback before student release.

### **Review Workflow**

#### **1\. Feedback Generation Phase**

* Assessment is graded against rubric  
* AI generates initial feedback based on:  
  * Rubric criteria and scoring  
  * Submission content  
  * Admin-configured parameters (tone, length, detail level)  
* Feedback status: **Draft** (not visible to students)

#### **2\. Author Review Phase**

* Author access feedback review interface  
* View all generated feedback for a test/assessment  
* Review feedback at individual submission level or in bulk  
* Feedback remains in **Draft** status until approved

#### **3\. Editing Capabilities**

Authors must be able to:

* **View AI-generated feedback** alongside the original submission and rubric scores  
* **Edit feedback inline** with rich text editing capabilities  
* **Modify any part of the feedback**  
* **Completely rewrite feedback** if AI output is inadequate

#### **4\. Version Control**

* **Original AI version preserved** for comparison and quality improvement  
* **Edited version tracked** with editor identity and timestamp  
* **Edit history maintained** for audit trail  
* Ability to **revert to AI-generated version** if needed

#### **5\. Approval and Release**

* Authors explicitly **approve feedback for release**  
* Approval can be:  
  * **Individual:** Per submission/student  
  * **Bulk:** For multiple submissions meeting quality threshold  
* **Publication controls:**  
  * Immediate release upon approval  
  * Scheduled release at specified date/time  
  * Conditional release (e.g., after all assessments in sequence complete)

### **Review Interface Requirements**

#### **Feedback Review Dashboard**

* **Filter and sort** submissions by:  
  * Feedback status (Draft, Approved, Released)  
  * Grading category performance  
  * Variability flags (from dual-grading system)  
  * Student cohort/group  
* **Bulk actions:**  
  * Select multiple submissions for review  
  * Approve multiple feedback items simultaneously  
  * Export feedback for offline review  
* **Search functionality** to find specific students or submissions

#### **Individual Feedback Editor**

* **Split-screen view:**  
  * Left: Original submission \+ rubric scores  
  * Right: AI-generated feedback (editable)  
* **Formatting toolbar** for rich text editing  
* **Character/word count** to maintain consistency with length settings  
* **Tone indicator** showing configured vs. actual tone  
* **Save draft** functionality for partial edits  
* **Approve and next** workflow for efficient batch review

### **Quality Assurance Features**

#### **Pre-Release Checks**

Before feedback can be released, the system should validate:

* Feedback has been reviewed (viewed by an author)  
* Feedback aligns with configured parameters (length, tone, detail level)  
* No placeholder text or obvious AI errors remain  
* Feedback references correct rubric criteria  
* No sensitive or inappropriate content included

#### **Feedback Quality Indicators**

Help author prioritize review effort:

* **AI confidence score** (if available from generation)  
* **Variability flag** from dual-grading system  
* **Complexity indicator** (e.g., borderline cases)  
* **Review priority** (high-stakes assessments flagged)

### **Permissions and Roles**

#### **Who Can Review and Edit Feedback?**

* **Test Author/Owner:** Full edit and approval rights  
* **Course Moderator:** Full edit and approval rights  
* **Teaching Assistant:** View and suggest edits (pending senior approval)  
* **Administrator:** Override and bulk approve (use with caution)

#### **Workspace-Level Controls**

* **Mandatory review toggle:** Enforce human review for all feedback  
* **Auto-approve threshold:** Allow auto-release only for high-confidence feedback (if enabled)  
* **Review deadline:** Set timeframe for author review before auto-escalation

### **Integration with Existing Workflows**

#### **Grading Variability Detection**

* Submissions flagged with **high variability** automatically prioritized for feedback review  
* Authors can see both Run 1 and Run 2 grades alongside feedback  
* Feedback editor can reference discrepancies to improve feedback quality

#### **Feedback Calibration (Workbench)**

* Sample submissions reviewed during calibration phase  
* Authors edit and refine AI-generated feedback on samples  
* **Preferred edits inform future feedback generation** (future enhancement)  
* Calibration provides benchmark for acceptable feedback quality

### **Export and Collaboration**

#### **Export for Offline Review**

* Export feedback drafts to **Word/PDF** for offline editing  
* **Re-import edited feedback** via CSV/spreadsheet  
* Maintains version control and audit trail

#### **Collaborative Review**

* **Comment/annotation system** for multi-reviewer workflows  
* **Assignment of review tasks** to specific authors  
* **Review status tracking** (Not Started, In Progress, Completed)

### **Audit and Compliance**

#### **Audit Trail Requirements**

For accreditation and quality assurance purposes, system must log:

* Who generated the feedback (AI system \+ configuration used)  
* Who reviewed the feedback (authors identity \+ timestamp)  
* What edits were made (diff/change log)  
* When feedback was approved for release  
* When feedback was delivered to student

#### **Reporting for Compliance**

* **Feedback review completion rates** (% reviewed before release)  
* **Edit frequency** (how often AI feedback is modified)  
* **Review time metrics** (time from generation to approval)  
* **Quality improvement trends** (AI feedback improving over time)

---

## **Feedback Calibration (Workbench)**

**Purpose:** Allow admins to preview and refine feedback before making tests live to learners.

### **Early Thinking on User Process**

1. Upload or input sample submissions  
2. Grade samples against rubric  
3. Generate scores & feedback for each sample  
4. Admin user verifies rubric & feedback quality  
5. Edit feedback parameters and regenerate  
6. Compare feedback across different settings  
7. Save preferred configuration

## ---

## **Feedback Event**

**Description:** Appears as a distinct event type in Traverse Studio

**Properties:**

* Links to a specific assessment/test event  
* Can be placed as a separate item in a sequence  
* Has its own configuration panel in Studio  
* Associated assessment ID (which test/submission/rubric this feedback relates to)  
* Display title/name  
* Instructions or introductory text  
* Feedback content (AI-generated, populated after grading)  
* Publication status  
* Availability timing (immediate after grading)

---

## **Admin Configuration**

### **Feedback Content Control**

Admins can configure:

#### **Tone Settings**

* **Supportive/Coaching:** Guides learner toward understanding without direct answers  
* **Direct:** Provides clear explanations and correct answers  
* **Default:** Balanced approach (recommended starting point)

#### **Length Settings**

* **Brief:** Key points only, 100-200 words  
* **Standard:** Comprehensive feedback, 200-400 words (default)  
* **Detailed:** In-depth analysis, 400-600 words

#### **Detail Level Settings**

* **Guidance-focused:** Questions and prompts to help learner reflect  
* **Balanced:** Mix of guidance and specific feedback (default)  
* **Answer-focused:** Explicit corrections and explanations

**Default Behavior:** All feedback events inherit system defaults unless explicitly configured otherwise.

#### **Feedback Event Type Configuration**

* Per Assessment vs Summative

---

## **Feedback Delivery Methods to User**

### **1\. LMS iFrame (eg: AI Certified)**

* Embedded in learning management system  
* "View Feedback" button launches feedback display  
* Feedback event renders as iFrame within LMS  
* Similar presentation to current simulation/test events  
* Consistent navigation and styling

**User Experience:**

* Learner completes assessment on one screen/tab  
* Navigates to "View Feedback" or "Feedback" screen/tab  
* Clicks "View Feedback" button  
* Feedback displays in scrollable text area  
* Export button available at bottom

### **2\. Grade Book Integration (Universities/Traditional LMS) \- Via API / LTI**

* Feedback pushed to LMS grade book (Group of assessment results \+ Feedback)  
* Associated with specific grade book item/assignment  
* Example platforms: Moodle

### **3\. Spreadsheet Export (UCT Use Case)**

* CSV export of feedback data  
* Custom template for import  
* No LMS viewing required

### **4\. Direct Access URL (Studio URL)**

* Magic link for direct Traverse Studio access (no Auth)  
* Custom URL per learner  
* Bypasses LMS entirely  
* Student can view their results and feedback on a Traverse-hosted URL

---

## **Data Flow**

1. Learner completes assessment event  
2. Submission sent for grading  
3. Rubric scoring generates feedback  
4. Feedback stored and associated with submission  
5. Feedback event becomes available to learner  
6. Delivery via configured method (iframe, API, File export)

---

## **Feedback Display**

**Initial format:** Text-based

**Interactive format:** Chat interface (with conversation history)

**Export options:** 

* Individual submission \- PDF  
* All submissions \- CSV export (We will need to cater for single file export of all results & feedback for a group of users on an assignment.)

---

## **Feedback Editing**

(Section to be detailed)

---

## **External Integration Requirements**

* LMS platforms (various)

---

## **Feedback Settings**

## **Open Questions / Future Considerations**

1. What should be our default feedback setting:

   * Feedback by rubric grading category

   * Summative feedback by test

2. Should feedback be versioned if rubrics are updated?

3. How do we handle feedback for partially completed sequences?

4. What analytics should we track for feedback engagement?

5. Should learners be able to request feedback regeneration?

6. How do we handle feedback in multi-language contexts? (future)

7. What is the UX of having to review / moderate feedback & results a large number of submissions

---

## 

# **Eduvos Requirements**

## Eduvos Requirements

### **What They Want: AI-generated feedback that users can review and edit before students see it.**

#### **The Core Requirements:**

1. **Rubric-aligned feedback**: The AI must generate feedback that directly relates to the specific grading criteria (rubric) used to assess the student's work. So if your rubric has categories like "Quality of Analysis" or "Communication Skills," the feedback must address those specific categories.

2. **Editable by authors**: Before any student sees their feedback, a teacher/professor must be able to read it, modify it, improve it, or completely rewrite it if needed. This is a **human-in-the-loop** requirement — the AI doesn't get the final say.

3. **Tone and consistency controls**: Admins need to be able to set how the feedback sounds (supportive vs. direct) and ensure it's consistent across all students. 

---

### **What They DON'T Want**

The requirement explicitly excludes two things:

* **Personalised academic advising**: They don't want the AI giving students career advice, study recommendations, or guidance beyond the specific assignment ("You should consider switching majors" or "Based on your performance, you should...")

* **Automated student interventions**: They don't want the system automatically taking actions like flagging at-risk students, sending emails to students, or triggering support services without human approval.

