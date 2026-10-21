---
title: >-
  Agent Artifact Contracts: A 13-Stage Lifecycle Type System for Multi-Agent
  Work
subtitle: >-
  Named artifacts, claim-time dependency gating, and two-bat dispatch — the
  mechanism that turns 'it didn't read the doc' from an incident into a type
  error
platform: github-pages
language: en-US
date: 2026-10-22T00:00:00.000Z
slug: lifecycle-artifact-contract
description: >-
  Multi-agent handoffs are a type problem. This article presents the full
  Idea-to-Production mechanism: the A–M artifact chain across thirteen stages,
  dependency enforcement at the claim lock (P3 rule), two-bat dispatch at
  artifact boundaries, doc-first discipline, and the two gates that keep an
  unattended chain trustworthy.
keywords:
  - agent handoffs
  - artifact contract
  - multi-agent lifecycle
  - dependency gating
  - type system
  - multi-agent
tags:
  - Artificial Intelligence
  - AI Agents
  - Software Engineering
  - Architecture
category: Tech
word_count: 1186
author: kylinlab.tech
layout: knowledge-article
lang: en
permalink: /knowledge/lifecycle-artifact-contract.html
published: true
excerpt: >-
  Nine agents share one delivery pipeline, and the hard part was never the work
  — it was the handoffs. This post formalizes agent-to-agent handoffs as a type
  system: named artifacts are the types, Depends On edges are compile-time
  checks, and claim-time gating is runtime enforcement. It walks through the
  thirteen-stage artifact chain, the four structural decisions, the two-bat
  dispatch design, doc-first discipline, and the two review gates.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/lifecycle-artifact-contract.html'
ghp_series: Idea-to-Production
---

# Agent Artifact Contracts: A 13-Stage Lifecycle Type System for Multi-Agent Work

![A vertical assembly line of 13 stations with robotic arms passing document artifacts between stages](/assets/resources/20261022-lifecycle-artifact-contract/cover-en.png)

> Series: Idea-to-Production · Mechanism
> Also in this series: *No Human in the Loop: The Conceptual Contract of an AI-Native Delivery Organization* (concepts), *How Nine Roles Take Over a Whole Company* (organization map), *Three Mechanisms of Unattended Scheduling* (scheduling mechanics)

Let nine agents collaborate on one delivery pipeline, and the hard part is never getting them to work — it is getting them to **hand off**. The architecture agent writes a plan, the implementation agent reads the first three paragraphs, and the QA agent never learns the document exists. If you have seen two agents "reference" each other's output, that disaster is familiar. The fix presented here is to make the handoff **formal**: named artifacts, explicit dependencies, and two-bat dispatch. In essence, this writes a **type system** for collaboration between agents — a pattern unrelated to any specific product that you can lift into your own pipeline.

Three takeaways carry through the whole article: **define stages on artifacts, not activities** ("do the design" cannot be verified; "`tech_design.md` exists and was consumed downstream" can); **enforce the dependency graph at claim time, not after the fact** (a task whose predecessors are not all Done is invisible to the executor); and **slice a very long workflow into one file per stage** (the loading unit determines context quality — an agent loads its own hop, not one encyclopedia).

## Skeleton: 13 stages + 3 dispatch lines = 16 lines

The full lifecycle is thirteen stages, A through M, plus the two dispatch bats and the pre-release check — sixteen lines of orchestration in total. First, memorize the main artifact chain:

```text
idea ──► requirement.md ──┬─► solution.md ─► core_module_design.md
                          │        │
                          ├─► ui_design.md ─┐
                          │                 ▼
                          │            tech_design.md ─► ta_solution.md ─► ta_plan.md
                          │                 │                  │
                          └─► repo skeleton ┴──► plan.md ◄─────┘
                                                    ▼
                                        code + unit/integration tests
                                                    ▼
                                     E2E cases & reports ──► release ──► report backflow
```

### Four structural decisions worth noting

- **Architecture (B) and UI design (C) run in parallel on purpose**: both consume only `requirement.md` and wait on each other not at all; detailed design (D) is where the two lines merge.
- **Test strategy comes before implementation planning** (E→F), not after: the implementation plan must bake in the conventions of the E2E gate, or "finish it first, figure out testing later" systematically drops testability.
- **D and F share the full-stack role but are never merged**: one produces `tech_design.md` (interface contracts, DDL, state machines), the other produces `plan.md` (2–4 hour task granularity per feature). Design is "what is"; plan is "how it is scheduled" — mix the two cognitive artifacts and QA and implementers each pick the half they like.
- **Repo scaffolding (H) depends on B, not F**: directory structure and API skeleton grow out of the solution and module contracts, and F may only start once the scaffold exists — the plan must land on a repository that actually exists.

## Mechanism 1: dependencies are enforced at the claim moment

Every edge in the task graph is `Depends On`, and the enforcement point is the **moment the claim lock is taken** (the P3 rule from *Three Mechanisms of Unattended Scheduling*): unless every predecessor task is Done, the task **cannot be claimed** — the engine skips it outright, and the executor never even sees it.

This design downgrades "starting work on a half-baked task" from a process problem to an impossibility. Compare the anti-pattern: many human teams express blocking as "status = in progress, but waiting", so boards fill with zombie cards. In a machine-executed dependency graph, the correct expression of blocking is **fundamentally undispatchable**.

## Mechanism 2: two-bat dispatch, cut at artifact boundaries

A human writes only the single stage-A task. After that, the PM role runs two bats:

- **Bat one** (after `requirement.md` is produced): dispatch the B/C/D/E/F/H design line;
- **Bat two** (once `plan.md` and the repo skeleton are ready): dispatch implementation tasks (I) per feature, dispatch E2E tasks (J) per `ta_plan.md` feature by feature (each `Depends On` the matching feature's I task), and finally attach the release task (K).

Why not one bat? **Implementation tasks cannot be meaningfully written before `plan.md` exists** — and `plan.md` depends on the entire design line finishing. Cutting at the artifact boundary guarantees that every task is self-sufficient at birth: all the context its claimant needs sits in the files it consumes. The elegance of J: the task is **defined** back at stage E (depending only on `ta_plan.md`), but its **execution** is pushed by dependency gating to after the matching feature's code is complete — E2E is always written against the real UI and never waits for the whole application to be built.

## Mechanism 3: documents first, drift is a bug

Every "contract" in the lifecycle is a document artifact, so the stage-to-stage advancement rules inherit the discipline of the methodology layer directly: **documents change before the implementation that fulfills them**; a document inconsistent with the code is handled as a bug (see *Documents as Executable Assets: When Agents Consume Your Spec Verbatim*). Each stage also has its own workflow file (`stage-x.md`), and a claiming agent loads only "its own hop" — for thirteen stages, one encyclopedia is far worse than thirteen single-page work instructions.

## Two gates: keeping an unattended chain trustworthy

- **Per-deliverable review checkpoints**: any task's Done must be predicated on a sub-agent review PASS record; failures go through "diagnosis → limited retry → new escalation task" and never through "wait for a human to look".
- **Integration-face release gate (I→J transition)**: after all I tasks complete, one focused review covers the aggregate diff — cross-task interfaces, shared modules, dependency and configuration changes, security-sensitive paths (no line-by-line re-review of task-internal code). A **BLOCK verdict halts the transition** directly, and findings flow back to implementation. This is the only gate between implementation and testing or production.

Test ownership is split to match: full-stack roles own unit and integration tests (E2E only as a local aid), while the QA role runs only **true end-to-end** — from the final user's perspective, against the real UI, in a production-simulated environment. Both sides know exactly what they should not run, so the quality signal is never filled with duplication and vacuum at the same time.

## Conclusion

1. **Designing handoffs for an agent pipeline means designing a type system**: named artifacts are the types, `Depends On` is the compile-time check, and claim gating is the runtime enforcement — with all three in place, "it didn't read that doc" failures change from incidents into type errors.
2. **Cut dispatch at artifact boundaries** (one bat after the requirement, one after the plan), so every task is self-sufficient at birth — this is the mechanical reason "a human writes a single task" actually holds up.
3. **The smallest step you can take now**: give your next-stage handoff a **file name**, and write the downstream start condition as "this file exists and has passed review" — one artifact contract is one stage's starting line.

This article is the mechanism instalment of the Idea-to-Production series; for the conceptual background see *No Human in the Loop: The Conceptual Contract of an AI-Native Delivery Organization*, for the organization map see *How Nine Roles Take Over a Whole Company*, and for the scheduling mechanics see *Three Mechanisms of Unattended Scheduling*.
