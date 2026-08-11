# Improving the design → engineering handoff

**Author:** Lara
**Date:** 29 July 2026
**Follows:** Product + Engineering — Shaping, 29 July
**Decision needed by:** start of next cycle

---

## The problem

We agreed the handover process exists but isn't working well enough. Three symptoms, from the shaping session:

- It isn't clear what's ready for dev and what isn't.
- There's a gap between handover finishing and `/1-shape` starting that nothing owns.
- Features arrive too big. Users and roles was a good step but had to be split into four phases after the fact, and the point-based rubric shipped with more tabs, endpoints and fields than it needed.

Underneath all three is one root cause: **the handover artifact is trying to do a job that `/1-shape` already does, and not doing the job only design can do.**

---

## Evidence from the design repo

Two things in the current setup are causing the symptoms rather than describing them.

**1. We decompose by layer.** §12 of the current template breaks each feature into sub-issues tagged Frontend / Backend / Component / Data / Copy / QA. Layer slices are never independently shippable or independently reviewable — every one depends on its siblings to mean anything, and "is this done?" can't be answered until all of them land. Some of the interconnectedness we're feeling is manufactured by the decomposition axis, not inherent to the product.

**2. The template has no gears.** Five of eight `design.md` files are 230-byte stubs. Two are 33KB and 48KB — and one of those is *welcome banners*. A dashboard hero with role variants and a dismiss action currently gets the same twelve sections, the same mandatory devbar table and the same thirteen-row states matrix as the entire onboarding flow. That's a two-hour tax on a twenty-minute change, which is why five of eight were never paid. The distribution is the process telling us it's overhead.

---

## What the skill files change

Reading `/1-shape`, `/2-build` and `/3-review` settles most of the design of the fix.

**`/1-shape` already separates product decisions from engineering decisions** and stops to ask on the product ones. That defines what our handover artifact is actually for: it should pre-answer those questions so shaping runs clean. Everything else in the current template is either duplicating the prototype, duplicating the design system, or duplicating work Shape does better because it can read the codebase.

**`/1-shape` already produces the phased build plan** — "every phase leaves the system consistent and shippable, with tests green." That is vertical slicing, already owned, done with codebase knowledge design doesn't have. Our layer-based sub-issue table is a second, worse decomposition competing with it.

**`/2-build` treats the Linear issue as source of truth**, explicitly not any prior conversation. So anything that doesn't reach the issue during shaping is invisible to the build.

**`/1-shape` has no design input channel.** It loads the Linear issue, `/load-project`, `/load-linear-doc`, and then researches *the codebase*. Blast radius is mapped through code only. Nothing in the skill loads a design or a prototype. **This is the gap between handover and shaping, precisely located** — design currently reaches Shape only if a human remembers to paste it in.

---

## Proposed changes

### 1. Change the unit of handover

One `design.md` = one shippable **user-observable outcome** = one Linear issue = one `/1-shape` session. Not one feature area.

`features/system-admin/` stops holding one document and starts holding `add-organisation.design.md`, `system-summary.design.md`, and so on. Feature folder maps to Linear project; each document maps to one issue.

The sizing test is empirical rather than a judgment call: **if `/1-shape` chokes, thrashes, or returns more than about four build phases, it was too big.** Split by user outcome, never by layer. We find out within one cycle whether we've calibrated it right.

*Owner: Lara*

### 2. Delete the sub-issue table

§12's Frontend / Backend / Component / Copy / QA breakdown comes out entirely. `/1-shape`'s phased build plan replaces it.

*Owner: Lara*

### 3. Cut the template to what only design can answer

New template attached. Seven short sections instead of twelve long ones. Out: token tables, type tables, spacing tables, the full states matrix, the anatomy tree, the repeated house-rules block, the navigation reference — all of which duplicate the prototype, the design system or CLAUDE.md, and all of which go stale.

In: intent, scope with explicit **no-gos**, behaviour rules and permissions, edge cases, a decision record, open questions flagged as blocking or not, and an **appetite**.

Two additions worth calling out:

- **No-gos** — things that would be reasonable to build and must not be built in this issue. This is the guard that would have caught the rubric's extra tabs and endpoints before they were built rather than at review.
- **`[DECIDED]` / `[PROPOSED]` markers** — so shaping knows which parts of a design are settled and which are open to challenge. Without this, Shape has to treat the whole document as ratified and we lose the conversation where it's most useful.

*Owner: Lara*

### 4. Give `/1-shape` a design channel

**Ask for Dylan.** Add to `1-shape/SKILL.md`, in the context-loading section alongside `/load-project` and `/load-linear-doc`:

> If the issue references a `design.md` in the `studio-design` repo, load it and the prototype it points to. Treat the design as specified product behaviour: verify it against the codebase like any other claim, and surface conflicts rather than silently resolving them. Sections marked `[DECIDED]` are settled and should not be reopened; sections marked `[PROPOSED]` are open to challenge. Anything marked `⚠️ NEEDS INPUT` blocks shaping — stop and ask.

Link, not paste — so the design stays current in one place and Shape reads live state.

This is the smallest change on the list and the highest leverage. It closes the handover→shaping gap directly.

*Owner: Dylan*

### 5. Close the loop back to design

`/2-build` keeps a **DECISIONS MADE EN ROUTE** list and `/3-review` walks the user through it for ratification. Both land in the PR and the Linear issue. Neither reaches the design repo — which is exactly the "Meg wants to change the labels and it never flows back" problem, and how *collections* disappeared without a record.

Proposal: ride the documentation-agent rail we're already building. When a merged PR's en-route decisions touch a feature that has a `design.md`, the same agent opens a PR against that `design.md`. Lara reviews it. Same review moment, same mechanism, no new process.

*Owner: Dave + Dylan, as part of the documentation app requirements*

---

## Open questions for the team

1. **Who ratifies en-route decisions that change designed behaviour?** `/3-review` walks them through with whoever is testing — likely Dave. Options: pull Lara into that step, or accept async review via the doc PR in change 5. Recommend the second; it scales and doesn't block review.

2. **Should the build verify against the prototype?** `/2-build`'s gates are lint, full test suite, E2E and red-review — all code correctness. Nothing compares the built UI to the prototype, and we already have a headless browser in the verification toolkit. Not for this cycle, but it's the version where the design repo becomes load-bearing rather than documentation.

3. **What happens to the PRDs?** If `design.md` shrinks to product answers and Shape owns decomposition, it's worth deciding whether `product-requirement-documents/` still earns its place or folds into the design docs.

---

## What I need

- **Dylan:** the `/1-shape` amendment (change 4). One paragraph.
- **Dave:** change 5 folded into the documentation app requirements ticket.
- **Everyone:** agreement that a handover document should not contain a task breakdown.

I'll rewrite the template and re-cut `system-admin` into outcome-sized documents as the first test case, then we review how shaping goes on it before rolling it across the rest.
