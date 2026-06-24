# **PRD: Points-Based Grading Pipeline**

* **Product area:** Traverse Studio — Grading Infrastructure   
* **Status:** Draft   
* **Related PRD:** Grading Engine — Points-Based Grading Rubric

---

## **1\. Problem / Opportunity**

Points-Based Grading requires a separate pipeline from the existing Competency Rubric pipeline. The LLM call structure is different, and both the input data sent to the LLM and the output it returns need to be processed differently. The existing pipeline cannot accommodate this without compromising both systems.

---

## **2\. Goals**

* Route points-based grading submissions through a separate pipeline from the existing Competency Rubric pipeline  
* Design an LLM call structure suited to per-statement, criterion-referenced scoring  
* Return grading results at the statement level — points awarded per statement, rolled up to question and test totals  
* Follow the same reliability patterns as the existing pipeline: queue-backed, retryable, with error status propagation  
* Keep the new pipeline independent so it can be iterated on without affecting existing grading behaviour

---

## 

## **3\. How the Existing Pipeline Works (Reference)**

The existing grading pipeline works as follows: a submission is received by the API, the file is converted to Markdown, and a grading message is queued. A Lambda picks up the job, grades the submission against the rubric via LLM, and posts the results back to the API in a single callback. The API then persists the grades and marks the job as complete.

Two pipelines currently exist: **standard** (single LLM run) and **enhanced** (dual LLM run with variability detection). The new points-based pipeline follows the same infrastructure pattern — queue, Lambda, callback — but requires a different data structure and a different approach to the LLM call.

---

## **4\. How the Points-Based Pipeline Differs**

The fundamental difference is what the LLM is being asked to do.

In the Competency Rubric pipeline, the LLM evaluates a candidate's response holistically against performance level descriptors and returns a level and rationale per rubric category. It is making a quality judgement.

In the Points-Based pipeline, the LLM is working through a checklist. For each question, it receives a set of specific grading statements — each worth a fixed number of points — and determines whether the candidate's response met each one. It is not making a quality judgement; it is checking whether specific criteria were satisfied.

|  | Competency Rubric Pipeline | Points-Based Pipeline |
| ----- | ----- | ----- |
| Grading unit | Rubric category | Grading statement |
| LLM task | Judge quality against level descriptors | Check if each criterion was met |
| Input to LLM | Category title, level descriptors, grading statements | Question text, marking guide, grading statements with point values |
| Output from LLM | Level, rationale, feedback per category | Met / not met, points awarded, rationale per statement |
| Results structure | Grade per category | Points per statement → total per question → test total |
| Feedback | Yes | TBD (see Open Questions) |
| Variability detection | Enhanced pipeline only | Not in v1 |

---

## **5\. What the Pipeline Needs to Do**

### **5.1 Routing**

When a grading job is triggered for a test using the Points-Based Grading Rubric, the API needs to detect this and route the job to the new pipeline rather than the existing one. The routing should use the existing SNS/SQS infrastructure — a new queue is needed, but no new SNS topic.

### **5.2 Data passed to the Lambda**

The Lambda needs to receive the full question and statement structure for the test, alongside the candidate's submission. Specifically, for each question and sub-question it needs:

* The question text and type (Text, Table, MCQ, True/False, Formula)  
* All grading statements for that question, each with their text and point value  
* The marking guide if one exists (model answer and common mistakes) — this is passed to the LLM as reference context, not graded against

A question has either direct statements or sub-questions, not both. When sub-questions exist, the statements belong to the sub-questions.

### **5.3 How the LLM is called**

The LLM grades at the question level — all statements for a question are included in a single call. This keeps each criterion in context with the others and avoids grading statements in isolation.

For each question, the LLM receives:

* A clear instruction explaining what it is doing  
* The question text and type  
* The marking guide (if available)  
* The list of grading statements with their point values  
* The relevant section of the candidate's submission

The LLM returns a result for each statement: whether it was met, how many points to award, and a short rationale explaining the decision. In v1, a statement is either fully met or not — no partial credit.

Where possible, the submission content passed to the LLM should be scoped to the relevant question rather than passing the entire document for every call. This is particularly important for longer submissions.

### **5.4 Results and callback**

Once grading is complete, the Lambda sends a single callback to the API with the full results. The results are structured at the statement level, with point totals rolled up per question and for the test overall.

The API receives and persists the results, then marks the grading job as complete.

### **5.5 Error handling and retries**

The pipeline should follow the same reliability patterns as the existing pipeline. If the LLM returns an unexpected or invalid response, the Lambda should retry. If retries are exhausted, the affected question should be flagged so a human marker can review it. The overall grading status should reflect any errors so they are visible in the platform.

---

## **6\. Grading Status Lifecycle**

The status lifecycle is the same as the existing pipeline:

**Pending → Queued → In Progress → Complete**

Any step can transition to **Error**.

Status updates are surfaced to workspace members in real time, the same way as the existing pipeline.

---

## **7\. Out of Scope (v1)**

* Dual-run variability detection  
* Partial credit — statements are binary (met / not met)  
* Regrading or override workflow for individual statements

---

## 

## 

## 

## **8\. Open Questions**

| \# | Question |
| ----- | ----- |
| 1 | Should the pipeline generate summary feedback for the candidate after grading, as the existing pipeline does? If so, what should it be based on? |
| 2 | Should the rationale per statement be visible to the candidate, or is it for internal marker review only in v1? |
| 3 | How should submission scoping work for the Points-Based pipeline — using the existing extraction mechanism or a new approach based on the question text? |
| 4 | Are we allowing questions to be rolled up into grading categories?So Grading Category \-\> Question \-\> Grading Statements |

