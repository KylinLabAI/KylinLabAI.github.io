---
title: 'Weekly Governance Reports and Meta-Review: Humans Above the Autonomous System'
subtitle: >-
  How removing every task-level approval works in practice: a hard-coded
  three-chapter report, a five-step weekly meta-review, and the discipline of
  reading notifications as news
platform: github-pages
language: en-US
date: 2026-10-27T00:00:00.000Z
description: >-
  After removing all human approvals from an AI-agent system, drift is handled
  by a weekly governance report and a five-step meta-review. This post covers
  the three report chapters, the three hard rules, the four editable system
  assets, and the notification discipline that keeps humans out of the task
  loop.
keywords:
  - AI agents
  - meta-review
  - governance report
  - autonomous delivery
  - human job
tags:
  - Artificial Intelligence
  - AI Agents
  - Software Engineering
  - Automation
category: Tech
word_count: 1167
author: kylinlab.tech
layout: knowledge-article
lang: en
permalink: /knowledge/meta-review-loop.html
published: true
excerpt: >-
  "Humans out of the loop" does not mean humans out of work — the job demands
  more of humans, not less. This post documents how our fourth contract claim
  works in practice: a governance job writes a company-level weekly report every
  Monday 09:00 with a hard-coded three-chapter structure (efficiency, cost,
  stability / iteration rhythm / quality signals), and the human runs a
  five-step meta-review in fifteen minutes — pick one anomaly signal, map it to
  one of four system assets, edit it, watch the signal. The report may only
  state measured data, may never touch the claim-lock table, and only writes
  files — never git.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/meta-review-loop.html'
ghp_series: Idea-to-Production
---

# Weekly Governance Reports and Meta-Review: Humans Above the Autonomous System

![At night, a person sits before a large screen showing an automated production line; an arrow points to a wrench icon labeled Improve Machine instead of stepping onto the line](/assets/resources/20261027-meta-review-loop/cover-en.png)

> Series: Idea-to-Production · Practice

"Humans out of the loop" is routinely misread as "humans out of work." The opposite is true: the job demands **more** of humans, not less. This instalment covers how the contract's fourth claim works in practice — what the weekly governance report contains, how the meta-review runs, and why improving the system beats approving tasks.

## Why this matters

Once you remove every human approval, a sharp question surfaces: **what catches the system when it drifts?**

Our answer is not another safety switch but a different intervention layer. Humans do not brake task by task; humans read the instruments weekly and edit the machine. Two artifacts carry this: a fixed report structure and a repeatable five-step meta-review loop. Even if your system is nowhere near autonomous, both are usable today. The series instalment "Humans Out of the Loop: A Concept Contract for an AI Self-Delivering Organization" defines the contract and its prohibition list; "How the System Keeps Living After Launch" catalogs the loops.

## Three things you will take away

1. **The three-chapter report structure is worth copying**: efficiency and stability (facts), iteration rhythm (tempo), quality signals (variance) — three orthogonal faces; miss one and you are blind in that direction.
2. **Meta-review output is always "change the system", never "approve a task"**: the objects are four asset classes — agent definitions, skill docs, workflow docs, domain knowledge — not any single ticket.
3. **The escalation channel is deliberately kept but powerless**: the system notifies you when it oversteps, but a notification is not a request. Separating "what to know" from "what to decide" is the core discipline of this job.

## Monday 09:00: the report grows itself

The admin-and-finance role's governance loop (Job: `admin-report@KylinLab`) generates a company-level weekly report every Monday at 09:00 and drops it into the archive layer. The structure is hard-coded into three chapters:

| Chapter | What it watches | The question it answers |
|---|---|---|
| **Efficiency · Cost · Stability** | instance uptime, job run history (completed/failed/skipped), task throughput, error rate, token usage and cost | Is the machine running steady, and at what price? |
| **Iteration Rhythm** | per-app 7-day completion counts, stage/type distribution, improvement-task frequency, whether L/M reports land on time | Is delivery still keeping a pulse? |
| **Quality Signals** | retry and failure rates, escalation events (human-notification records), bug-fix counts, sub-agent review results | Is the variance growing? |

The three chapters map to facts, tempo, and variance — mutually orthogonal observation faces. Watch only one or two and an entire direction stays invisible.

Three hard rules are worth copying verbatim:

- **Data state first.** The report may open with exactly one of three states: data online / reachable but unusable / data blocked. It states what was actually measured; **fabricating metrics is forbidden** — a fictional all-green weekly report is a hundred times more dangerous than no report.
- **Lock cleanup is not its job.** The report loop is explicitly forbidden from touching the claim-lock table — observation belongs to observation, operation to the machinery; the permission separation is written into the job description itself.
- **Files only, never git.** The report is complete once the file lands in the archive layer's directory; commits and archiving ride the established documentation flow. A "report-writing agent" never gains the power to commit the whole repository.

## Meta-review: what you do after reading

The report is input, not output. The human's weekly action loop:

```text
Read the governance report (15 min)
  → pick one anomaly signal (e.g. a task class whose retry rate rose 3 straight weeks)
  → map it to exactly one of the four system assets:
      Agent definition / skill docs / workflow docs / domain knowledge
  → edit it (this is writing, not clicking a button)
  → watch whether that signal falls back over the following weeks
```

The crux is step four's forced choice: **every problem must be translated into a modification of one of the four assets**, because symlinked bindings take effect across the whole fleet instantly (see the series instalment "Why Split into Three Repos: Knowledge, Scheduling, Archive"). Change one line of a workflow document and every instance executes the new rule the next second. The improvement loop is extremely short — that short loop is the real dividend an autonomous system pays its humans.

Conversely, two actions are explicitly forbidden:

- **Do not approve tasks on their behalf.** Hand-unblocking a stuck task punches a hole in the contract (see the prohibition list in "Humans Out of the Loop"). The correct move is to make that stuck state **stop recurring**: fill in the documentation, add a criterion, fix the dispatch rule.
- **Do not add a "pending my confirmation" field to the report.** The escalation notification channel records and continues; it needs no reply. Once you start replying, the fourth claim — humans out of the loop — is void in practice.

## Notification literacy: what to know is not what to decide

Three classes of events reach you proactively: credentials an agent cannot mint itself (for example, an expired API token), ambiguities that documented criteria cannot resolve (for example, two candidate rollback versions, both unhealthy), and **production-grade actions already executed autonomously that you must know about** (for example, a completed incident rollback).

The right way to read a notification is as **news**, not a to-do. The third class is the most counterintuitive: the rollback has already run and service has already recovered — nothing in the notification is waiting for your answer. Its only function is that you are never surprised by a state change of the system. Once enough of this "news" accumulates, it naturally becomes the topic of the next meta-review.

## Why this division of labor pays

Spend humanity's most expensive resource (strategic judgment) on the most leveraged act (changing rules), and the machine's cheapest resource (infinite attention) on the most repetitive work (executing and reporting). In a task-by-task approval world, human bandwidth is the pipeline's bottleneck. In a meta-review world, **human judgment is the pipeline's multiplier** — one improvement a week, multiplied by the next ten thousand tasks.

This is also part of the "gap-free" definition: once one complete closed loop (idea → ship → report → new idea) runs unattended, the human's entire job shrinks to a single sentence — read the report, improve the machine, read the report again.

---

## Conclusion

1. **Give your system a three-chapter weekly report first** (facts / tempo / variance), even if you assemble it by hand today — fixed observation surfaces are what give improvement a fixed target.
2. **Translate every intervention into one edit of one of the four assets** — agent definitions, skill docs, workflow docs, domain knowledge. Approving consumes; editing creates assets. What you should have at the end of a week is a diff, not a click trail.
3. **Start the clock next Monday**: 15 minutes reading the report, one topic picked, one asset edited — then watch that signal in the following reports. That is the whole job, and the whole reason it is worth paying for.

This is the practice instalment of the Idea-to-Production series; for the contract and the loop catalog, start from the series' concept-contract and after-launch instalments listed above.
