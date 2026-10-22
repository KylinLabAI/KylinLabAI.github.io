---
layout: knowledge-article
title: >-
  The Machinery Behind Unattended Scheduling: Claim Locks, Central Push,
  Idempotency Keys
subtitle: >-
  Nobody in the loop reduces to three classical distributed-systems problems —
  atomic claim locks, centrally pushed jobs, and idempotency contracts make the
  scheduler hold
platform: github-pages
language: en-US
lang: en
date: 2026-10-23T00:00:00.000Z
slug: autonomy-machinery
description: >-
  A deep dive into the three mechanics of unattended scheduling: an atomic claim
  lock keyed by task ID with five protocol rules, a watchdog that sweeps every
  60 seconds and recovers in about 3 minutes, centrally owned job dispatch, and
  an idempotency contract that keeps reruns from doubling output.
keywords:
  - unattended scheduling
  - claim lock
  - idempotency key
  - multi-agent systems
  - watchdog
  - job scheduling
tags:
  - Multi-Agent Systems
  - Distributed Systems
  - Job Scheduling
  - Software Architecture
  - Idea-to-Production
category: Tech
word_count: 1579
author: kylinlab.tech
permalink: /knowledge/autonomy-machinery.html
published: true
excerpt: >-
  "Nobody is in the loop" is, in engineering terms, three very classical
  distributed-systems problems: one task must never be worked by two workers,
  one periodic job must never be triggered twice, and one rerun must never
  produce two copies. This article breaks down the three mechanics of the
  scheduling layer — the atomic claim lock, the centrally pushed job runner, and
  the idempotency contract — including the five claim protocol rules, watchdog
  parameters (7200-second lock window, 60-second sweep, roughly 3-minute
  recovery), the double-triage failure story, and dedup keys for six stages.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/autonomy-machinery.html'
ghp_series: Idea-to-Production
---

# The Machinery Behind Unattended Scheduling: Claim Locks, Central Push, Idempotency Keys

![Three unattended-scheduling machinery parts: a claim padlock, a central distribution wheel, and a fingerprint key](/assets/resources/20261023-autonomy-machinery/cover-en.png)

> Series: Idea-to-Production · Mechanism. Companion pieces in this series: "Human out of the Loop: A Conceptual Contract for an AI Self-Delivering Organisation" (the conceptual contract) and "Why Split into Three Repositories: The Separation of Knowledge, Scheduling, and Archives" (the layering background).

"Nobody is in the loop" reduces, in engineering terms, to three very classical distributed-systems problems: **the same task must never be worked by two workers, the same periodic job must never be triggered twice, and the same rerun must never produce two copies of the result.** This article covers the three mechanics of the scheduling layer — the atomic claim lock, the centrally pushed job runner, and the idempotency contract — plus the details inside each one that will absolutely break you if you never write them down.

## Why this matters

Most multi-agent systems paper over their scheduling problems with "conversation": there is only one worker anyway, and a failed run can just be re-run. Once one role runs several instances, and once cyclic work lands on a schedule, all three problems surface immediately. The value of this piece is not a product tour — it is **three mechanics that no unattended scheduler can avoid**, with the design details included, so you can check your own system against them line by line.

## Three things you will take away

1. **Mutual exclusion for concurrent execution needs the "atomic claim + watchdog recovery" double insurance.** No lock? Skip to the next task and never block; an expired lock is reclaimed automatically by the sweep, with an upper bound of about three minutes to recovery — instead of "wait for a human to come rescue it".
2. **Periodic work must be owned by the centre.** Once a role is multi-instance, any agent that "schedules its own next run" will do the same thing twice over. The platform holds the trigger; instances are passive receivers only.
3. **Every loop must declare its own dedup key.** Reruns not doubling output is not luck — it is an explicit "check-before-create" convention.

## Mechanism 1 — the atomic claim lock: one task, one worker

The premise: one role (a PM, say) can be running several instances at the same time. Before executing any task, an instance must first **win** the claim lock on that task; once the INSERT lands, the task is claimed by exactly one holder.

The lock lifecycle of a single task:

```text
Pull candidates (role match + executable state + priority)
  -> dependency gate: every prerequisite task must be Done, else no claim
  -> atomic INSERT into the lock table (task ID is the primary key -> physically room for exactly one holder)
  -> work (must renew before exceeding the lock window)
  -> status report = release (transition check + lock deletion complete in the same operation)
  \- forgot to renew? watchdog sweep -> forced back to Backlog -> someone else can claim it
```

The five protocol rules are worth savoring one by one:

| Rule | Content | Why it is designed this way |
|---|---|---|
| P1 | Never work unless the claim succeeded | The lock-table record **is** the dispatch itself; the local lock is the authority, platform sync is best-effort only |
| P2 | A failed claim = skip, never a retry storm | An instance that did not get the lock simply sees "no tasks"; it does not poll the lock table or wait for release |
| P3 | Dependency gating happens at claim time | A task whose prerequisites are not Done is invisible to executors — no half-finished work ever starts |
| P4 | Tasks that might exceed the window must renew | The lock window defaults to 7200 s (2 h); long tasks renew roughly every 30 minutes |
| P5 | Release only via status report | Not the holder reporting? HTTP 409, never force-write — the holder's report always wins |

**The watchdog backstops the protocol.** The sweep runs one round every 60 seconds: an expired lock is always released with an `expired` marker, the task is forced back to `Backlog`, and an `EXPIRE` audit entry may be recorded; a holder that exceeds its heartbeat timeout is recovered the same way, and its instance is marked `OFFLINE`. An abandoned task therefore recovers within roughly `min(lock window, heartbeat timeout) + sweep interval ≈ 3 minutes` — not "wait until a human notices the next morning".

One detail that is easy to miss: **expiry recovery puts the task back in Backlog but does not roll back any half-finished work.** A re-claiming instance must treat the task as "possibly half done" and verify before continuing. In unattended systems, failure semantics written to this level are what "deterministic" actually means.

Every CLAIM / RELEASE / EXPIRE goes into an append-only audit log — a pipeline nobody watches must still be answerable after the fact.

## Mechanism 2 — centrally pushed jobs: agents may not schedule themselves

Start with the failure story, and the rule will sound obvious. Suppose instances schedule their own "daily customer-issue triage":

> The PM role ran two instances today. After finishing triage, instance A casually scheduled "run again tomorrow at the same time"; instance B, unaware of A's schedule, kept a copy for itself. **Tomorrow, the same customer issue is triaged twice and generates twice the tasks.**

So the iron rule: **every piece of periodic work is a Job record in the control center**, and instances never self-schedule or self-renew. The running model is almost boringly plain:

- The job runner ticks every 60 seconds, scanning Jobs that are `enabled` with `next_run_at <= now`;
- when one comes due, it resolves **exactly one** online target-role instance for that Job and pushes a `job_trigger` over the existing WebSocket channel;
- after the push it advances `next_run_at`, and the same static record keeps triggering indefinitely.

Two key properties: **instances are passive receivers** — they never poll, enumerate, or claim any schedule; and **jobs never enter the task board and never take the claim lock** — periodic tasks and one-off tasks are two different models, and mixing them is where most "scheduled agents" start failing. Daily and weekly report loops rely on this model to guarantee "exactly once a day", whether one or ten worker machines are running.

## Mechanism 3 — the idempotency contract: reruns do not double

Unattended operation means reruns are the normal case (failed renewals, instance restarts, re-claims after watchdog recovery). The defense against "duplicate output" is not luck but one global convention: **every loop declares its dedup key, and checks for duplicates before acting (check-before-create).**

| Stage | Dedup key / idempotency mechanism |
|---|---|
| Task creation | The API accepts an `idempotency_key`; a duplicate request within a 5-minute window returns the cached result and never creates a second task |
| Status report | Re-reporting the same transition inside the idempotency window is harmless |
| Daily PR patrol | The `pr-reviewed` label is the dedup key: an already-reviewed PR is skipped outright |
| Periodic reports | Filenames carry the ISO week number (e.g. `usage-report-2026-W36.md`); a rerun in the same window overwrites instead of appending |
| Releases | An immutable `v*` tag **is** the idempotency key: tag present = already released, never publish twice |
| Biweekly release | Check `git diff <last tag>..HEAD` first; zero changes means skip outright and record an audit entry |

Note the taste required when choosing a dedup key: **prefer something that is already unique in the external world** (labels, week numbers, git tags, diffs) over inventing a runtime "already processed" state table — the former can be verified by a human at any time, while the latter needs someone (or yet another agent) to keep its correctness alive.

## What the three mechanics look like on screen

The control center dashboard spreads the scheduler's health wide open: online instances, this week's completions, and **today's expired locks** — that small expired-locks card is the visible trace of Mechanism 1's watchdog doing its job; the per-role distribution exposes "which role's queue is backed up":

![Control center dashboard: tasks by status and role distribution, online instances, this week's completions, and today's expired locks](/assets/resources/20261023-autonomy-machinery/control-center-dashboard.png)

---

## Conclusion

1. **The claim lock is a combination of three things: mutual exclusion, a time limit, and fallback recovery.** Atomicity comes from the primary-key constraint, liveness from renewal plus the sweep, and the recovery semantics from "back to Backlog + verify the half-finished work" — remove any one of the three and "unattended" collapses.
2. **Ownership of periodic work belongs to the platform** — the first theorem of a multi-instance system: any design that lets an agent schedule itself turns into a duplicate-output machine on the day the role scales out.
3. **Go count how many places in your system would double on a rerun.** Every one of them should have a dedup key you can write down on paper. If you cannot write it down, there is no real design yet.

For the conceptual contract behind this system, see the previous piece in this series, "Human out of the Loop: A Conceptual Contract for an AI Self-Delivering Organisation"; the earlier "Why Split into Three Repositories: The Separation of Knowledge, Scheduling, and Archives" covers the layering background. Reading them in order is recommended.
