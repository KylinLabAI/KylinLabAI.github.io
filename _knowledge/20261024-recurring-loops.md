---
title: 'Recurring Loops: How an Unattended System Keeps Itself Running'
subtitle: >-
  The eight loops that take over after launch — with their exact cadences — and
  the three design rules that keep scheduled agents reliable
platform: github-pages
language: en-US
date: 2026-10-24T00:00:00.000Z
slug: recurring-loops
description: >-
  A catalogue of the eight recurring loops that keep a launched, unattended
  system alive — daily triage and PR review, biweekly releases and reports, a
  weekly governance report, and a resident sentinel — plus three design rules:
  separate loop from schedule, keep jobs off the task board, and close loops in
  two phases.
keywords:
  - recurring loops
  - scheduled jobs
  - AI agent automation
  - two-phase close
  - job scheduler design
tags:
  - Software Architecture
  - DevOps
  - AI Agents
  - Automation
category: Tech
word_count: 1315
author: kylinlab.tech
layout: knowledge-article
lang: en
permalink: /knowledge/recurring-loops.html
published: true
excerpt: >-
  Release is not the finish line — it is where the loops begin. This post
  catalogs the eight recurring loops that take over after launch (daily issue
  triage and PR review, an off-peak E2E gate, releases on the 1st and 15th,
  biweekly ops and growth reports, a weekly governance report, and an always-on
  sentinel with no schedule row), then explains the three design rules that keep
  them reliable: separate the loop from the schedule, keep jobs off the task
  board, and close loops in two phases.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/recurring-loops.html'
ghp_series: Idea-to-Production
---

# Recurring Loops: How an Unattended System Keeps Itself Running

![A glowing circular city at night: a brightly lit control tower at the center, nine light points cruising along ring orbits](/assets/resources/20261024-recurring-loops/cover-en.png)

> Part of the Idea-to-Production series (mechanism track). Companion pieces: *The Three Mechanisms of Unattended Scheduling* (how a job gets triggered) and *Thirteen Stages and Their Artifacts* (the artifact chain).

Release is not the finish line. It is the starting line of a second project nobody puts on a roadmap: the loops that keep the system alive once humans stop watching it. This post is a catalogue you can check your own setup against — the eight recurring loops that take over after launch, their cadences, and three design rules: separate the loop from the schedule, keep jobs off the task board, and close loops in two phases.

One-off tasks are easy to operate. Recurring tasks are where automation quietly rots: multiple instances trigger the same job, failures break the chain silently, and after enough time nobody remembers what the job was supposed to produce.

## What you will learn

1. **A loop and a schedule are two different things.** The loop lives in the knowledge layer and defines *what to do*; the schedule is one row in the scheduling layer defining *who runs it and when*. Once separated, scaling and rewriting stop interfering with each other.
2. **Closed loops use a two-phase close to prevent fake fixes.** A fix commit only attaches a label; the issue closes when a release carrying that fix actually ships.
3. **A loop's input data must stay honest.** Report loops are forbidden from inventing metrics — unreachable data is labelled as such. Ugly beats fictional.

## Catalogue: the eight recurring loops

Each loop corresponds to one static row in the control center's `scheduled_jobs` table, pushed by a job runner on its cadence to exactly one online instance (the triggering mechanics belong to *The Three Mechanisms of Unattended Scheduling*):

| Loop | Owner role | Cadence | Job name |
|---|---|---|---|
| Customer issue triage | PM | Daily 09:00 | `issue_triage@all` |
| PR quality review | Architecture | Daily 09:00 | `pr_review@all` |
| E2E gate | QA | Daily, off-peak (runs only if code changed in the last 24h) | `e2e_daily@all` |
| Release | QA | 1st and 15th of each month | `app_release@all` |
| Four ops reports (usage, subscriptions, health, funnel) | Operations | Biweekly dispatch, 7-day window, one row per app | `ops-<skill>@<App>` |
| Four growth reports (social, cost, content, competitors) | Growth | Biweekly dispatch, 7-day window, one row per app | `growth-<skill>@<App>` |
| Governance report | Admin | Every Monday 09:00 | `admin-report@KylinLab` |
| End-to-end watch (sentinel) | Platform | Always on + weekly quality scorecard + monthly process review | — (no schedule row) |

Note the last row's special status: the sentinel is a **resident watchdog process**, not a scheduled job — which is exactly the division of labour the scheduling philosophy relies on: deterministic machinery lives in platform code, and the LLM is only responsible for the loops that need judgment.

## Design rule 1: separate the loop from the schedule

In one sentence: *what to do* is written in the knowledge layer; *who and when* is written in the scheduling layer.

A workflow document in the knowledge layer describes how triage works — which repository's issues to read, how to bucket them, who receives the resulting tasks. One `scheduled_jobs` row in the scheduling layer describes how the loop runs — which role, at what time, with what payload (`target_role`, `schedule_kind`, `timezone`, `payload`, `next_run_at`).

The separation pays off directly:

- **Rewriting logic never moves the schedule.** Improve triage by editing one knowledge-layer file; a symlink makes the change effective everywhere at once.
- **Scaling never moves the logic.** Give the PM role more instances and the job still fires exactly once a day.
- **Auditing never relies on memory.** Every run — completed, failed, or skipped — is written to the `scheduled_job_runs` history table, which the governance report uses as its data source.

One more key decision: **jobs never enter the task board and never take a claim lock.** A recurring task is not a card waiting in a backlog — it is an event pushed at its due time. It has no "done" state to check, only a run record. Mixing the two on one board is the most common architectural mistake in scheduled-agent systems.

> Give "done" to one-off tasks and "run records" to recurring ones. One board cannot hold two lifetimes.

## Design rule 2: close loops in two phases

Here is a customer issue's full journey, showing how three loops interlock:

```text
Customer files an issue on the public release repo
  -> Daily triage (PM): small fix -> 1 task; big change -> design + implementation twin tasks; duplicate -> comment and close
  -> Implementation (full-stack): fix commit -> comment "ships in v1.0.4" on the issue -> attach the fix-applied label
  ... fixes keep accumulating inside the two-week window ...
  -> Biweekly release (QA): build and release only if git diff has changes; after a successful release, sweep the open
    fix-applied issues -> close them one by one with the release tag
```

Why insist on two phases? Because **the customer cannot download the fix at commit time**. Closing the issue at the commit announces a "fixed" that has not been delivered yet — the term for it is *ghost close*. The release's completion is the moment the fact becomes true, so the fix commit only attaches the `fix-applied` label, and the issue closes when a release carrying that fix ships.

The same principle gives the biweekly release a **smart skip**: when `git diff <last tag>..HEAD` is empty, the release skips and writes an audit record — it never ships an empty version to fill a calendar slot. Every app keeps its own version line, its own skip decision, and its own configuration: one fleet, many apps, no entanglement.

## Design rule 3: loops wind themselves at launch

The eight report loops owned by Operations and Growth need nobody to remember to create their schedules — **the moment Initial Launch completes, the QA role batch-creates those `scheduled_jobs` rows for every managed app**. Reports also obey an honesty clause: only three states are allowed — **data online / reachable but unusable / data blocked**. Whatever was actually measured gets written down; inventing metrics is forbidden. Filenames carry the ISO week number, making them naturally idempotent.

Once written into the archive layer, reports flow back along the artifact chain: **operations and growth demand signals, health alerts (a serious violation raises a Critical INCIDENT task that triggers an autonomous rollback review), competitor moves, and content performance all return to the demand side** — idea → production → reports → new ideas. The system is a loop, not a one-way pipeline.

---

## Summary

1. **How you document recurring work decides whether it is still running three years later.** Loop logic in the knowledge layer, schedules in database rows, run history in an audit table — with all three in place, a loop can be handed over, scaled, and questioned.
2. **Leave "done" to one-off tasks and "run records" to recurring ones.** One board cannot hold two lifetimes; forcing it produces zombie cards and fake success.
3. **Check your scheduled agent now:** where is its next trigger stored? If the answer is "a prompt telling it to wake itself up tomorrow", the thing you are missing is this post's first rule.

Further reading: the companion pieces of this series — *The Three Mechanisms of Unattended Scheduling* (how a job gets triggered) and *Thirteen Stages and Their Artifacts* (the artifact chain).

If you run recurring loops of your own, share the design you settled on — and the failure mode that made you change it.
