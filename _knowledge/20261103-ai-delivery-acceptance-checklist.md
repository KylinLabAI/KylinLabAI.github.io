---
layout: knowledge-article
title: 'How to Verify AI Deliverables: An Acceptance Checklist for Five Types'
subtitle: >-
  A language model generates; it does not verify. Grade acceptance depth by
  consequence, then apply a per-type checklist for code, bug fixes,
  architecture, design and docs.
platform: github-pages
language: en-US
lang: en
date: 2026-11-03T00:00:00.000Z
slug: ai-delivery-acceptance-checklist
description: >-
  AI fluency is not evidence. A framework for grading acceptance depth by
  consequence and verifying five types of AI deliverables, plus the three-step
  closed loop.
keywords:
  - AI acceptance
  - code review
  - software quality
  - engineering practice
  - AI collaboration
tags:
  - AI
  - CodeReview
  - SoftwareEngineering
  - Quality
  - BestPractices
category: Tech
word_count: 1980
author: kylinlab.tech
permalink: /knowledge/ai-delivery-acceptance-checklist.html
published: true
excerpt: >-
  A language model does not maintain facts, run verification or own mistakes —
  it only generates. Grade acceptance depth by consequence, then verify each
  deliverable type on its own terms: code, bug fixes, architecture, design and
  documentation.
image: /assets/img/covers/ai-delivery-acceptance-checklist.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/ai-delivery-acceptance-checklist.html'
ghp_series: AI Delivery Quality
ghp_disqus_shortname: ''
---

# How to Verify AI Deliverables: An Acceptance Checklist for Five Types

<!-- Cover image: first figure in the body, immediately after the H1 and before the opening paragraph -->

![Cover image: a dark-blue infographic titled "How to Accept Five Types of AI Deliverables Item by Item", subtitled "Grade by Risk: Turn 'Looks Right' into 'Verified Right'"; a vertical "Error Consequences" scale with three tiers on the left, five cards on the right for Code (Verify Self-Report and Boundaries), Bug Fix (Reproduce First, Then Fix Root Cause), Architecture Proposal (Verify Assumptions and Tradeoffs), Design (Test Exception Paths) and Documentation (Spot-Check Key Facts), plus a bottom flow chaining Localize, Cross-Check and Add to Checklist under "Prevent Recurrence"](/assets/resources/20261103-ai-delivery-acceptance-checklist/cover-en.jpg)

Every day now, code, bug fixes, architecture proposals, designs and documents arrive from a machine in minutes — with explanations so fluent they feel like evidence.

That feeling is the problem. A language model does not maintain facts, does not run verification, and does not own the consequences of being wrong. It only generates. **The confidence in its prose is uncorrelated with correctness.**

This piece answers one practical question: for each of five deliverable types, what exactly should you check?

## The core principle

Treat AI output as a deliverable to be accepted, not an answer to be believed.

> "Looks right" is a clue. "Verified right" is a conclusion.

Three rules make that operational:

1. **Anything a machine can decide, let the machine decide.** Tests, commands, reproduceable cases — human attention belongs on what tests cannot settle.
2. **Anything traceable to the original requirement, don't trust memory.** The object of acceptance is "does this satisfy *this* task," not "is this well made."
3. **Anything with a counterexample, don't stop at the happy path.** A passing happy path proves the happy path.

## Grading acceptance depth by consequence

Neither full rework nor total exemption works. Depth follows consequence:

| Consequence | Example | Acceptance depth |
|---|---|---|
| Bleeds immediately | payment logic, permissions, migrations, production config | item-by-item + canary + rollback plan |
| Caught downstream | internal tools, non-core features | full tests + key-path walkthrough |
| Cheap to be wrong | draft notes, prototype scripts | spot-check key conclusions |

This table does more than it appears to. **Reviewing everything is unsustainable**, which means it silently becomes reviewing nothing. Grading removes the moral weight from the decision — you are not lazy for spot-checking a prototype script; you are allocating attention where a mistake would actually cost something.

## 1. Code: audit the change summary before the code

A readable diff is not a correct diff. Fluency is the generator's strength; correctness is not. So the first move is not to read the code — it is to demand a written summary and treat it as a clue:

```markdown
## Change summary (attached at delivery)
- Requirements addressed: <list one by one>
- Scope: <which modules, which callers>
- Boundaries: <null / concurrency / timeout / permissions>
- Tests: <commands run, results>
- Uncovered risks: <honestly state what was not verified>
```

The summary was generated too, so the order is **summary first, then code**:

- Run the tests it claims it ran. Anything it honestly lists as uncovered is your highest-priority target.
- Run the full suite including boundaries and exceptions. "Tests unfinished" is not a completion state.
- Map each claimed requirement back to the original one-to-one. Unmapped changes are either cut or justified.
- Make it explain the critical section: why written this way, what breaks otherwise. Inability to explain is a sign of assembly.
- Probe boundaries directly: null, concurrency, timeout, privilege escalation, oversized payloads.
- Check scope and side effects: unrelated edits, unnecessary dependencies, changes to public signatures, global state, implicit behaviour.

## 2. Bug fixes: reproduce first, then fix

The characteristic failure mode is **treating the symptom, not the root cause** — swallowing an exception, raising a timeout, adding a retry, bumping a constant. The symptom disappears, the cause survives, and it returns wearing a different costume.

So the acceptance order must be inverted:

1. **Reproduce before starting.** A problem you cannot reproduce is a problem you cannot verify.
2. **Force the root-cause distinction.** Which line addresses the cause? Delete it — what should come back, and how? Why didn't it trigger before? Where else could this cause appear with a different symptom?
3. **Re-run the original reproduction** and confirm the symptom was not merely *hidden* — swallowed exceptions, silent degradation, adjusted thresholds are all hiding.
4. **Regression-test the related surface**, and treat its list of "possibly affected callers" as leads to verify, not conclusions to trust.
5. **Land the prevention.** Reproduction steps + root cause + verification case become a regression test. **The end state of a bug fix is a case in the suite**, not a local green run.

## 3. Architecture and proposals: audit assumptions, not layout

The trap is that **the more professional the layout, the more likely verification gets skipped.** Whether a proposal holds is entirely in its assumptions, independent of how the diagram looks.

- **Extract the assumption list** — data volume, QPS, budget, team size, compliance constraints. **One assumption that doesn't match reality voids the whole proposal**; the details below it don't matter.
- **Measure against real constraints.** Compare against current system numbers, mark the mismatches, then ask "what happens if this constraint grows 10x" and watch whether it changes its answer.
- **Demand costs and death modes.** The three biggest costs, the three most likely ways it dies, and the degradation path. A proposal without downsides is incomplete and does not pass.
- **Demand a simpler baseline.** Compare against a "cut everything optional" version. Complexity that buys no identifiable benefit is showing off.
- **POC the riskiest assumption.** Validate the highest-risk "should be fine" minimally. Paper-plausible is not plausible.

## 4. Design: walk key paths, then the exception world

The trap is a **perfect happy path with a naked exception world.**

- **Walk one core use case** end to end — input, output, state and failure action defined at every step. A missing step is a hole.
- **Walk the exception paths** — network failure, downstream timeout, retry idempotency, concurrent conflict, partial success. For each, ask "what state is the system in now?"
- **Attack it from the caller's seat.** Have it play the least well-behaved caller: "how is this interface most easily misused, and what follows?" Then add fool-proofing.
- **Check consistency with reality.** Do naming and claimed integrations match the team's conventions and the actual systems? List every deviation and confirm each is deliberate.
- **Confirm observability.** "After launch, what log, metric or alert tells you it's healthy?" **A design without an acceptance instrument does not pass acceptance.**

## 5. Documentation: audit facts, not prose

The trap is that **fluency manufactures the illusion of credibility**, and the most expensive documentation error is a factual one, because the next person inherits it as fact.

- **Spot-check key facts.** Version numbers, commands, paths, config keys, figures — take 3–5 to the real environment.
- **Run the examples.** Do the snippets compile, run, and produce the claimed result? A block that doesn't run makes the whole passage suspect.
- **Read against the implementation.** Especially note whether the doc describes design intent or current behaviour; when they disagree, write to actual behaviour.
- **Ask for the source.** Every quantified conclusion: "what's the evidence, where from?" Without one, either supply it or mark it as opinion.
- **Mark the expiry.** State the applicable version and date; for content that evolves, note "authoritative is X."

## The closed loop when acceptance fails

Failing acceptance is not the problem; having only "send it back" as a response is. Three moves:

1. **Locate it yourself.** Reproduce and observe before handing it back. Outsourcing forensics to the accused is not a strategy.
2. **Make two proposals refute each other.** Demand a second version, then have the two attack each other. Only what survives both goes to implementation.
3. **Convert the lesson into a mechanism.** This round's finding becomes next round's checklist entry, regression case, or template. **Prevention is a mechanism, not memory.** People get tired, rotate and forget; checklists don't.

## Summary

- **AI is a generator, not a verifier.** Downgrade "looks right" to a clue and upgrade "verified right" to a conclusion, and grade depth by consequence.
- **Five deliverable types, five sets of actions.** Code: summary before code. Bug fixes: reproduce before fixing. Proposals: assumptions before details. Design: exception paths first. Docs: facts before prose.
- **When acceptance fails, run the three-step loop.** Locate it yourself, refute two versions, land the lesson in a checklist — the same mistake should not appear twice.

Next time AI hands you work, don't start with the conclusion. Take the single most consequential line of the delivery, run it, reproduce it, find the counterexample. **That is the entire starting point of acceptance.**
