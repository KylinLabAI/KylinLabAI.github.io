---
title: 'Nine Roles, One Org Chart: Decision Ownership for Multi-Agent Systems'
subtitle: >-
  How we turned agent roles from prompt personas into a permission-and-artifact
  ownership scheme — the nine-role table, three mechanism-level designs, and two
  anti-drift disciplines
platform: github-pages
language: en-US
date: 2026-10-20T00:00:00.000Z
slug: nine-role-org-chart
description: >-
  A working nine-role agent org chart where every role owns exactly one block of
  decision rights: dispatch authority has a single source, quality is dissolved
  into checkpoints and release gates, rollbacks follow written-down standards,
  and a 1:1 vocabulary discipline keeps naming from drifting.
keywords:
  - multi-agent org chart
  - agent roles
  - decision ownership
  - vocabulary discipline
  - resource binding
tags:
  - Artificial Intelligence
  - Multi-Agent Systems
  - Software Engineering
category: Tech
word_count: 1199
author: kylinlab.tech
layout: knowledge-article
lang: en
permalink: /knowledge/nine-role-org-chart.html
published: true
excerpt: >-
  Most multi-agent "roles" are prompt personas, and they fall apart the moment
  two agents disagree over the same artifact. This post presents a nine-role org
  chart where each role owns exactly one block of decision rights: PM is the
  only source of batch task dispatch, quality is not a role but two mechanisms,
  rollbacks execute written-down standards, and content-folder names map 1:1 to
  runtime IDs so renaming cannot silently break routing. Roles double as the
  unit of resource binding and scaling.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/nine-role-org-chart.html'
ghp_series: Idea-to-Production
---

# Nine Roles, One Org Chart: Decision Ownership for Multi-Agent Systems

![A 3x3 wall of robot ID badges: nine agent roles, one per cell, with the human appearing only in the strategy cell](/assets/resources/20261020-nine-role-org-chart/cover-en.png)

> Series: Idea-to-Production · Concept Framing

Naming your agents is easy; drawing their **decision boundaries** is hard. The moment two agents both "feel" they should edit the same architecture document, role-play collapses. This post covers the real engineering problems behind a nine-role org chart: which decisions belong to whom, how vocabulary is kept from drifting, and why a "role" must be the unit of resource binding rather than a persona in a prompt.

## Why this matters

In most multi-agent systems, "roles" stop at role-play: the same model with a different system prompt, playing product manager, playing engineer. Such roles fail the moment a conflict appears — both roles "feel" entitled to edit the architecture document, and nobody can say who wins, because "who may edit which document" was never written down.

Our org chart is not a cast list. It is a **scheme for distributing permissions and artifact ownership**: what each role decides, what documents it produces, and which loops it runs are all written into its definition — policed by a cross-repo vocabulary discipline that keeps the whole thing from rotting.

## The three things you will learn

1. **A role = decision ownership + artifact ownership + standing loops.** Missing any one and it is just a persona. When you divide labor among agents, first divide "who may edit which document".
2. **One vocabulary, two spellings.** A role's content-folder name and its runtime ID map 1:1; renaming requires a whole-repo sweep, or job routing silently breaks.
3. **Platform duties must not masquerade as roles.** Mechanical responsibilities like lock reclamation and marking lost instances belong to platform watchdogs and documented standards — that is more honest than inventing a "supervisor agent".

## The org chart: who owns which decisions

Nine roles, each with the same answer: **one exclusive block of decision rights**.

| Role | Owns these decisions | Standing loops |
|---|---|---|
| Product & Program Management | Strategy, requirement definition, task dispatch (two batons), daily issue triage | Triage daily at 09:00 |
| Engineering Architecture | Solution & core-module design, repo scaffolding, design-task adjudication, daily PR review | PR sweep daily at 09:00 |
| Full-Stack Engineering | Detailed design, implementation planning, per-feature implementation with unit/integration tests | Follows the task queue |
| UI/UX & Copy | Interface design, interaction flows, product copy, published-app documentation | Follows the task queue |
| QA & Release | E2E strategy & execution, CI/CD, releases, incident rollback | E2E daily gate; releases on the 1st and 15th |
| Service & Data Operations | Four report families: usage, subscription, health, funnel | Biweekly dispatch, 7-day window |
| Marketing & Growth | Social content, growth & competitor reports, feeding demand back | Biweekly dispatch, 7-day window |
| Admin & Finance | Weekly company-governance report in three chapters: efficiency & cost (including token usage), iteration cadence, quality signals | Mondays at 09:00 |
| Autonomous Iteration Sentinel | **Platform side**: lock reclamation, marking lost instances; quality review dissolved into checkpoints and the release gate | Always-on tending, no schedule |

Three observations matter more than the table itself.

### Dispatch authority has exactly one source

Only the PM role may batch-create and dispatch tasks (the "two batons": creating the batch and dispatching it). Other roles may **open a single task** — say, file a bug for full-stack — but may not re-plan. This prevents "anyone can interleave work" from rotting the dependency graph.

### Quality is not a role; it is a mechanism

Earlier versions of the sentinel role were a "full inspector". In the end we dissolved its review function into two rules: a per-deliverable review checkpoint (no PASS, not Done) and an integration-surface release gate (any BLOCK halts the release). The remaining mechanical duty — reclaiming expired locks — belongs in platform code anyway. **Having an agent patrol the lock table amounts to bolting a nondeterministic executor onto a deterministic mechanism.**

### Rollbacks need no person, but they need written-down standards

The QA role's incident rollback is not an on-the-spot judgment; it is a documented decision standard: a deployment regression inside the observation window, a Sev-1, or an exhausted error budget with a positive regression signal — only then do you roll back. A rollback means re-running the deployment chain from the last healthy tag; after that, the bug still goes through the two-phase closure and back into the requirements loop.

## Vocabulary discipline: two spellings, one source of truth

The same role has two names in the system: the **content folder** in the knowledge layer (e.g. `agents/product-program-manager/`) and the **runtime ID** in the scheduling layer (e.g. `agent-pm`). They map 1:1, and we treat that mapping as a non-negotiable invariant:

- Terms — role IDs, stage letters, task vocabulary — are **defined exactly once**;
- Renaming means a cross-repo sweep; miss one spot and you get a silent routing break: work is pushed to a role that does not exist and is never claimed;
- The same principle is **never restated in a second document**; link to the source of truth instead.

The discipline costs almost nothing (one sweep), and the payoff shows up in the failure mode: vocabulary drift does not raise errors or logs. Its symptom is "some class of tasks mysteriously goes unclaimed" — no exception, no log line, just silent backlog on the board.

> Maintainability for an agent system starts with its namespace.

## Roles as the unit of resource binding

The org chart is not just a document structure; it is a **deployment unit**. When a work instance is created, the only required field is the role; every resource bound to that role — agent definition, skills, workflows, domain knowledge — automatically enters the instance workspace. Compare the architect and PM roles: their bound skills and workflows barely overlap:

- Architect: `solution-architect` for solution design, `repo-skeleton-creator` for scaffolding, `pr-reviewer` for reviews…
- PM: `requirement-writer` for specs, `task-batch-creator/publisher` for dispatch, `issue-triage-daily` for triage…

![Resource bindings of two role instances on one workstation: the architect binds solution-design, scaffolding and review skills, while PM binds requirement, dispatch and triage workflows — barely overlapping](/assets/resources/20261020-nine-role-org-chart/pm-role-resources.png)

This yields a very practical corollary: **to improve a role's capability, edit the role's folder in the knowledge layer, and every instance of that role picks it up instantly** (via symlinks — see the sibling instalment *Why Split Into Three Repositories: The Separation Rule of Knowledge, Scheduling, and Archives*); **to scale a role's throughput, simply start more instances** without changing any definition. Capability evolution and capacity scaling decouple along the same role boundary.

---

## Conclusion

1. **When you draw your agent org chart, write the "decision & artifact ownership table" first** — who may edit which document, who may create tasks, whose standard triggers a rollback — and only then write role bios. Reverse the order and you get a crowd of chat personas stepping on each other's toes.
2. **Manage role names like a public API**: 1:1 mapping, single-point definition, renames go through a sweep. Namespace discipline is the cheapest observability in a multi-repo agent system.
3. **Check whether your "QA / supervisor" role is machinery in disguise**: any duty demanding determinism, periodicity, or idempotence (reclaiming locks, sweeping expirations, deduplication) should live in platform code — not be entrusted to an LLM seat.

The sibling instalment *Human Out of the Loop: The Concept Contract of an Autonomous Delivery Org* covers the concept layer behind this org chart.
