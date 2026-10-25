---
layout: knowledge-article
title: 'Why AI Ships Great Work Sometimes: A Nine-Step Flow for Consistent Output'
subtitle: >-
  Numbered steps, guidelines routed by task type, scripts for every
  deterministic action, and a review loop that re-reviews any change — how we
  made agent-driven engineering work boringly consistent
platform: github-pages
language: en-US
lang: en
date: 2026-10-26T00:00:00.000Z
slug: ai-task-implementation-consistency
description: >-
  AI task quality varies run to run because the execution path is never written
  down. This article details a reusable four-layer structure — a nine-step
  workflow, type-routed guidelines, deterministic scripts, and an independent
  review loop with a code-change-mandates-re-review exit rule — plus a reusable
  checklist.
keywords:
  - AI task consistency
  - nine-step workflow
  - routed guidelines
  - independent review loop
  - AI engineering
tags:
  - AI Agents
  - Software Engineering
  - DevOps
  - Automation
category: Tech
word_count: 882
author: kylinlab.tech
permalink: /knowledge/ai-task-implementation-consistency.html
published: true
excerpt: >-
  AI-driven engineering work varies run to run because the execution path is
  uncodified. This article shows the four-layer structure that removes that
  variance: a nine-step numbered workflow, guidelines routed by task type,
  scripts for deterministic sequences, and an independent review loop whose exit
  rule is "any code change mandates another round" — with six invariants, an
  orchestration prompt, and a copyable checklist.
image: resources/cover-en.jpg
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/ai-task-implementation-consistency.html'
ghp_series: ''
---

# Why AI Ships Great Work Sometimes: A Nine-Step Flow for Consistent Output

![A fluffy dragon cub taking notes at a laptop under a desk lamp at night, with coffee and books nearby](/assets/resources/20261026-ai-task-implementation-consistency/cover-en.jpg)

> **Consistent quality from AI agents comes from codified process, not from better prompts.** The same task, the same model, two very different results — because the execution path gets re-decided on every run. This article shows how to write that path down.

## The problem: three blanks filled at random

Run the same engineering task twice. Once the agent reads the design doc, writes tests, and requests an independent review. Next time it writes code immediately, touches three unrelated files, and reports "tests pass."

Three decisions were never written down, so they get re-rolled every run:

- **Do I read the design doc and repo conventions first?**
- **Do I run the tests before declaring done?**
- **If the design looks wrong, is that my job to flag?**

The costs are threefold: quality is random, the run is **unauditable** (you can't reconstruct which steps happened), and supervision **doesn't scale** — fine for one task, impossible for ten.

Adding "please also run the tests" to a prompt doesn't hold, because nothing detects the skip.

## Options considered

| Option | Pros | Cons | Fit |
|---|---|---|---|
| Rely on model discipline, one detailed prompt | Fast start, no infra | Path drifts every run | One-off small tasks |
| Human supervision throughout | Quality controlled | AI downgraded to a typist | High-risk changes |
| Codified process: numbered flow + routed guidelines + scripts + hard-constrained orchestration | Stable, auditable, repeatable | Up-front docs and scripts | Frequent, enumerable engineering tasks |

We chose the third, on one judgment: **engineering work is highly patterned, patterns can be standardized, and standardized sequences are exactly what AI reproduces most reliably.**

## The structure: four layers plus a nine-step spine

```text
Role definition → Mode switch → Routed guidelines → Deterministic scripts
     (who)           (mode)      (rules by type)     (fixed sequences)
                                        ↓
                            nine-step workflow spine
```

- **Role definition** — the agent is an engineer accountable for one task end to end: understand, implement, verify, update status. Small and safe beats clever and large.
- **Mode switch** — detect once per task whether a human is present or the run is unattended automation; record it in the task's progress log. In unattended mode, no branch blocks waiting for a reply.
- **Routed guidelines** — *common rules loaded for every task* (respect the approved design, scope discipline, tests as a gate, review and commit discipline, never commit secrets) plus a checklist per task type: **feature** (scope creep, end-to-end coverage), **bug fix** (confirm the root cause first; if unknown, redirect to diagnosis rather than investigating inside a delivery task), **improvement** (green baseline first; regression is the main risk).
- **Deterministic scripts** — worktree creation, commit, push, PR, cloud merge, cleanup are cross-platform scripts; the agent supplies parameters, not commands.

```text
1 Load context      task + design docs + repo conventions + load guidelines
2 Plan              files to change, approach per file, tests to add, smallest safe sequence
3 Implement         isolated worktree + exclusive branch; verify the gate runs before coding
4 Self-verify       build / lint / test + agent-side checks for uncovered criteria; ≤3 retries
5 Review loop       independent regression review; any code change ⇒ new round
6 Summary once      one artifact reused by PR body, status update, and report
7 Push & PR         cloud merge only — never merge locally into the default branch
8 Update status     merged ⇒ done; blockers ⇒ blocked, PR left unmerged
9 Cleanup           remove the worktree, confirm the folder is gone, verify branch == upstream
```

## The two gates

**Self-verify, with a cap.** Build, lint, test — then verify whatever the suite doesn't cover with real agent-side checks: hit the endpoint, query the database, read the build output. Assume nothing passes. Retry the same failure at most three times.

**Independent review, with an exit rule.** After implementation and green tests, an independent reviewer inspects only: regressions, correctness against acceptance criteria, local security hot-spots, whether tests assert real behavior, logging/desensitization, and scope discipline. What turns it into a gate:

> **Any code change after a review round — even a one-line touch-up — mandates another round. The loop exits only when a round is followed by no code changes.**

The reviewer must verify findings against source and design on its own; it must never rubber-stamp the implementer's triage. Cap it at three rounds; unresolved blockers mean stop, record, and leave the PR unmerged.

## Six invariants

```text
1. Never work on the default branch — task branch + isolated worktree
2. Never merge locally — the cloud PR merge is the only entry into the default branch
3. Tests are a gate — every acceptance criterion asserts real behavior; red suite ⇒ no review
4. Change code after review ⇒ review again — there is no "it was only one line"
5. Judgment to the agent, sequences to scripts — prompts keep only judgment calls
6. Never fabricate verification results — unreachable ⇒ blocker or pending human check
```

## Orchestrating more than one task

Single-task discipline erodes by the third task. The fix isn't another reminder — it's pricing the violation:

```text
Execute these tasks one by one, no human intervention:
- <task-1> / <task-2> / <task-3>

1. Goal: one at a time, finished completely before the next. No batching, merging, or parallelism.
2. Role & skill binding: only the specified role definition and the specified skill.
3. Pre-execution compliance: read the full workflow and rules.
   Violation, omission, or skipped step = redo the whole task.
4. Mandatory pre-read: org guidelines, agent instructions, repo root convention files.
5. Output: summary + a per-task workflow compliance checklist; any missing step triggers a redo.
```

Each line does one job: isolated context per task, a locked rule set, "read the workflow" as step one, conventions loaded before coding, acceptance by ticking boxes. **A compliance rule without a real cost is decoration.**

## Results and honest revisions

What we certainly gained is **auditability** — mode decisions, plans, review rounds, and blockers are all recorded, so any run can be replayed.

Numbers aren't collected yet; three signals are registered: average rework rounds per task, first-round clean review rate, and how often an orchestrated run is redone for violations. One observation (in our case; mileage varies): extracting scripts paid off most — once fixed sequences left the prompt, prompts got shorter and behavior got steadier.

Three things we'd change:

1. **Don't let the model improvise fixed sequences.** Commit shape and branch creation as "guidance text" produced per-run variance; scripts collapsed it to zero.
2. **"Fix what's found" is not enough.** Without "re-review after fixing," review becomes a ceremony.
3. **Don't underestimate orchestration.** Chains skip steps until "violation ⇒ redo" becomes a hard constraint.

## Reusable checklist

- [ ] Every task states objective, explicit scope IN/OUT, and acceptance criteria
- [ ] Opening three actions are non-negotiable: read task + design docs, read repo conventions, detect run mode and record it
- [ ] Load common rules always; add the type-specific checklist
- [ ] Script every deterministic sequence; leave only judgment calls in prompts
- [ ] Every acceptance criterion has a test that asserts real behavior; green suite gates review
- [ ] Review states dimensions and exit condition: code change ⇒ new round, rounds capped
- [ ] Generate the summary once; reuse it for PR body, status, and report
- [ ] Orchestration: one task at a time, bound role and skill, mandatory pre-read, per-task compliance checklist
- [ ] Missing one step means redoing the whole task

Start with the task type you run most often. Write its nine steps, extract one script, add the re-review rule — and measure the difference next week.
