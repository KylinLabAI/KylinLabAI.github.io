---
title: 'Nine AI Agent Roles Running a Full Software Company: A Production Walkthrough'
subtitle: >-
  One idea in, one product out — three repositories, four document invariants,
  thirteen stages, and the two-bat dispatch that keeps a human-out-of-the-loop
  pipeline honest
platform: github-pages
language: en-US
lang: en
date: 2026-10-28T00:00:00.000Z
slug: production-walkthrough
description: >-
  A full walkthrough of an unattended software company: nine AI agent roles,
  three repositories, four document invariants, thirteen stages, two-bat task
  dispatch, and the recurring loops that keep a shipped product alive — with
  real screenshots of the running system.
keywords:
  - AI agents
  - unattended delivery
  - human out of the loop
  - agent workflow
  - Idea-to-Production
tags:
  - AI Agents
  - Software Engineering
  - Automation
  - Idea-to-Production
category: Tech
word_count: 1837
author: kylinlab.tech
layout: knowledge-article
permalink: /knowledge/production-walkthrough.html
published: true
excerpt: >-
  One human supplies an idea; the system delivers it to production — org chart,
  runbooks, and audit trails all live in git, and not a single step waits for
  human approval. This post walks the whole loop: task creation, requirements,
  architecture, implementation, tests, release, and the recurring operations
  loops after launch, with real screenshots of the running system and four
  honest caveats about what unattended delivery costs.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/production-walkthrough.html'
ghp_series: Idea-to-Production
---

# Nine AI Agent Roles Running a Full Software Company: A Production Walkthrough

![An idea box entering an assembly line, nine robotic arms collaborating, an app box with a rocket badge exiting](/assets/resources/20261028-production-walkthrough/cover-en.png)

> Series: Idea-to-Production · Practice. Companion pieces in the series: "Human Out of the Loop" (the concept), "Thirteen Stages and Their Artifacts" (the mechanics), and "Documents as Executable Assets" (the methodology). For layering background see "Why Split Into Three Repositories"; for the scheduling machinery see "Three Mechanisms of Unattended Scheduling".

One human supplies an idea, and the system delivers it to production — org chart, runbooks, and audit trails all live in git. This post walks the entire path: it starts from a single human-written task and moves through requirements, architecture, implementation, testing, and release, until the product is live and tended by recurring loops — with not one step waiting for human approval.

## Why this is worth your attention

Every "AI builds my app" demo stops at the same place: the human is still driving. Someone still has to review the PR, click deploy, write the release notes, and watch error logs at night. The genuinely interesting question is not "can an agent write one function" — it is **whether a whole delivery organization can run unattended**.

Our answer in one sentence: **the human supplies the idea, the system delivers to production, the human is not in the loop.** This piece covers the motivation, the single hardest pitfall, and the architecture that makes it hold — plus the real interface of the system while it runs. Model selection, prompt engineering, and cost engineering are other stories.

## Three things you will take away

1. **Replace approval gates with machine gates.** A loop that waits on human signatures is not an autonomous loop. Quality is enforced by automatic checkpoints — per-deliverable reviews, an integration-surface review gate, and end-to-end tests — not by meetings.
2. **Dispatch work in two bats, cut at artifact boundaries.** Do not generate the whole task list at once. Design tasks are dispatched once the requirement exists; build, test, and release tasks are dispatched only after the implementation plan exists — so every task is self-sufficient and executable from the moment it is created.
3. **Never let an agent schedule itself.** A role may run as several concurrent instances; whichever instance re-arms its own next trigger is producing duplicates. Ownership of recurring work belongs to the central scheduler, which pushes to exactly one online instance.

## Motivation: why the human has to leave the loop at all

It starts with the one-person-company dream: the founder does strategy, and everything else — product planning, architecture, design, engineering, QA, release, operations, growth, governance — gets actually **done**, not "assisted".

Why is "the human is not in the loop" a precise claim rather than marketing? Because it forces you to solve three things that semi-automated systems never have to solve:

- **Nobody signs off.** No PRD approvals, no release go/no-go, no human rollback decisions. Quality is either machine-enforceable or it does not exist.
- **Nobody unblocks you.** Notification channels to humans are escalation paths only — record it, notify, then continue or stop cleanly. The loop never waits for a reply.
- **Nobody watches the pipeline.** So the system must ship its own audit trail and health reporting; observability is a design input, not an after-the-fact patch.

The human's fixed role moves up a layer: work **on** the system — read the weekly governance report, improve the agents, skills, workflows, and knowledge behind it — instead of being a per-task gatekeeper **inside** it.

## The hardest challenge: agents execute documents literally

Many problems exist, but one outweighs all others: **the handoffs between stages are documents, and agents execute those documents verbatim — ambiguities included.**

When an "architecture doc written for human readers" becomes the next agent's input, the tuition we paid looks like this:

- A vague phrase a human colleague would silently fill in ("add basic auth") turns into an entire hallucinated subsystem.
- A TODO or placeholder in a delivered document **will** be executed by the downstream agent. That is runnable dead code.
- The same rule phrased slightly differently in two documents forks the pipeline, and the agent picks one at random — silently.

What settled out of this is four non-negotiable invariants:

| Invariant | What it enforces |
|---|---|
| **Documents first** | The document changes before the implementation that fulfils it; drift between docs and code is a bug, not chores |
| **Terms defined once** | Role IDs, stage letters, and task vocabulary are defined in exactly one place; renames are swept across all repositories |
| **A named artifact contract per stage** | Every stage consumes and produces named artifacts (`requirement.md` → `solution.md` → `plan.md` → code → release) — these are the APIs between agents |
| **Append-only audit** | Every claim, release, expiry, and job run is recorded and never rewritten — the loop must stay answerable after the fact |

The universal lesson for anyone building an agent pipeline: **treat documents like code. They have typed interfaces, they hide bugs, and someone really does run them in production.** In our case that someone runs them 24 hours a day, 7 days a week.

## How it works

### Three repositories, three responsibilities

The system is cut by **speed of change** and **ownership**:

| Repository | Essence | Company analogy |
|---|---|---|
| **Knowledge** | Role definitions, skills, stage workflows, domain knowledge — pure content, client-independent | The employee handbook |
| **Scheduling** | The control center (projects, tasks, atomic claim locks, job runner, audit) plus worker-instance clients (pull task → assemble prompt → launch an AI CLI) | The office and its ticketing system |
| **Archive** | Development drafts, released-app documentation, run reports, task templates | The archive and the showroom |

The knowledge layer says "what to do next", the scheduling layer says "which instance, when, and exactly one worker", and the archive layer stores "what got made" and feeds it downstream.

### Nine roles, one task board

The founder sits in the strategy seat. Above that sit nine specialist agent roles: product and project management, engineering architecture, full-stack engineering, UI/UX and copy, QA and release, service and data operations, marketing and growth, and administration and finance — plus a platform-side watchdog sentinel that reclaims locks and marks lost instances. Each role runs as one or more **worker instances**, bound per role to an agent, skills, workflows, and knowledge base (symlinked, never copied, so changes take effect immediately); which AI CLI sits behind it is your configuration choice.

### Lifecycle: thirteen stages from idea to production

Work flows through stages A–M: requirement → architecture and UI design (in parallel) → detailed design → test strategy → implementation planning → repository scaffolding → implementation → end-to-end testing → release → operations and growth reporting. Each stage has exactly one document artifact and its own workflow file.

With no human present, two mechanisms keep the loop honest:

- **Per-deliverable review checkpoints** — a task is not Done without a sub-agent review PASS record; unrecoverable failures go through "diagnosis → bounded retries → a new escalation task", not a phone call to a human.
- **A release review gate** — the handoff from implementation to testing requires passing an integration-surface review over the aggregate diff; a BLOCK verdict stops the transition outright.

### Two-bat dispatch: the move that makes "one human task" enough

A human writes exactly **one** task. The project-management agent then dispatches everything else in two bats:

```text
Human ──► [Stage-A task] ──► requirement.md
                                   │
                     ┌── Bat 1: dispatch design & scaffolding ──┐
                     │   B ∥ C → D → E → H → F                  │
                     └──────────────────┬───────────────────────┘
                                        │ plan.md + repo skeleton ready
                     ┌── Bat 2 (with dependencies) ─────────────┐
                     │  I impl tasks (per feature, from plan.md) │
                     │  J E2E tasks (per feature, Depends On I)  │
                     │  K release tasks (Depends On I + J)       │
                     └──────────────────┬───────────────────────┘
                                        ▼
                                 End users (production)
```

Implementation tasks **cannot be meaningfully written before `plan.md` exists** — and `plan.md` in turn depends on all upstream design being finished. Cutting dispatch at the `requirement.md` / `plan.md` artifact boundary guarantees every task is born self-sufficient. Each feature's E2E task unlocks the moment that feature's real UI is done — QA never waits for the whole application to be built.

### Release is not the finish line

After Initial Launch, recurring loops take over — all pushed by the center, none re-arming themselves:

| Loop | Cadence | Owner role |
|---|---|---|
| Customer issue triage → tasks | Daily | Project management |
| PR quality patrol | Daily | Architecture |
| E2E gate (only when code changed) | Daily | QA |
| Iteration release (skipped automatically when nothing changed) | 1st and 15th of each month | QA |
| Operations / growth / health report | Biweekly dispatch, 7-day window | Operations and growth |
| Governance report | Weekly | Administration |
| Incident response and autonomous rollback | On severe-violation trigger | QA |

A bug a customer reports on day 3 ships with the day-15 release. Issue closure is two-stage — the fix commit only applies the `fix-applied` label, and the real closure happens when the release carrying that fix completes: a customer is never told "fixed" about something they still cannot download.

## Screenshots: the concepts inside the running system

Setup is a one-time investment per workstation: create an instance per role, bind its resources, register it — after that the fleet picks up work by role on its own.

![A multi-role instance fleet on one workstation, each role running its own agent](/assets/resources/20261028-production-walkthrough/multi-instance-fleet.png)

The human's entire contribution: first, create the project —

![Creating a project in the control center](/assets/resources/20261028-production-walkthrough/create-project.png)

Then write the single "idea-to-requirement" task:

![Writing the one human task: idea to requirement](/assets/resources/20261028-production-walkthrough/create-task-idea-to-requirement.png)

From there the board fills itself:

![The task board filling itself as agents dispatch and advance work](/assets/resources/20261028-production-walkthrough/task-board-in-progress.png)

You can watch an agent's worksite live — tool calls and process status in real time:

![Live status stream during a task run: tool calls and process state visible in real time](/assets/resources/20261028-production-walkthrough/task-status-live.png)

On completion, a run summary lands automatically — duration, files written, final report:

![The run summary after a task completes: duration, files written, and the final report](/assets/resources/20261028-production-walkthrough/task-run-summary.png)

The control-center dashboard shows the state of every loop at a glance — tasks by status and role, online instances, locks expiring today:

![Control-center dashboard: tasks by status and role, online instances, and today's expiring locks at a glance](/assets/resources/20261028-production-walkthrough/control-center-dashboard.png)

And one flow animation replays the first hop — idea to requirement — end to end:

![End-to-end replay of the idea-to-requirement hop, from the human-written task to the produced requirement.md](/assets/resources/20261028-production-walkthrough/idea-to-requirement-loop.svg)

## Trade-offs and the honest boundaries

- **Autonomy demands a stronger quality machine than a human team does.** Every human gate you delete must be replaced, one-for-one, by a machine check — review checkpoints, the release review gate, daily E2E. Weak gates plus high autonomy = errors amplified at machine speed.
- **Stages hand off through document artifacts, not code APIs.** What you gain is an inspectable "company" (org chart, runbooks, audit all in git) and client independence; what you pay is that the discipline described above must stay online permanently.
- **Escalation paths exist, but are deliberately stripped of authority.** When credentials are missing or criteria are genuinely ambiguous, humans are notified, then the loop continues or stops per the documented branch — it never blocks waiting for a reply. This is a philosophical choice: delivery availability outranks certainty in each individual decision.
- **"Working" is defined as one complete closed loop, not per-project proof.** The framework's pass line: one real project travels unattended from a human idea to a released, documented, observable product — and the whole pattern is certified. Results on your stack and at your team size will vary.

## Conclusion

1. **Taking the human out of the loop is not the goal — it is the forcing function.** Once nobody can sign off, quality is forced to become machine-enforced, scheduling forced to centralize, and observability forced to be built in. Those three are the real winnings.
2. **The principle most worth lifting directly is "documents as executable assets".** When agents consume your specs literally, ambiguity is a production defect — give your documents a typed interface and fix drift like a bug.
3. **The question worth asking about your own workflow:** which single human action, if written well enough, could the whole pipeline grow out of? Automate the dispatch that follows it first, then, at every place you today stop to wait for approval, add a machine gate one by one.
