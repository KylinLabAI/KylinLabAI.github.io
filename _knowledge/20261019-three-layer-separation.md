---
layout: knowledge-article
title: 'Three-Layer Separation for AI Systems: Knowledge, Dispatch, and Archive'
subtitle: >-
  Two criterion questions, three repositories, and four boundary disciplines
  that stop an AI delivery system from layer-mixing
platform: github-pages
language: en-US
lang: en
date: 2026-10-19T00:00:00.000Z
slug: three-layer-separation
description: >-
  Layer an AI delivery system by change rate and ownership: a knowledge layer, a
  dispatch layer, and an archive layer, each in its own repo, held together by
  four disciplines and symlink-bound resources.
keywords:
  - three-layer separation
  - AI agents
  - knowledge layer
  - dispatch layer
  - archive layer
  - symlinks
tags:
  - AI Agent
  - Software Architecture
  - Software Engineering
  - Idea-to-Production
category: Tech
word_count: 1083
author: kylinlab.tech
permalink: /knowledge/three-layer-separation.html
published: true
excerpt: >-
  The hardest part of a working AI delivery system is not the prompts — it is
  deciding what belongs where. This post lays out a two-dimension criterion
  (rate of change and who may change a file) that splits the system into a
  knowledge layer, a dispatch layer, and an archive layer, each with its own
  repository. It includes both criterion tables, the four non-negotiable
  boundary disciplines, the symlink-based binding that makes
  single-source-of-truth physical, and a one-question audit for layer-mixing.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/three-layer-separation.html'
ghp_series: Idea-to-Production
---

# Three-Layer Separation for AI Systems: Knowledge, Dispatch, and Archive

![Three block towers labeled knowledge, dispatch, and archive, chained together by symlinks](/assets/resources/20261019-three-layer-separation/cover-en.png)

> Part of the Idea-to-Production series (concept piece). Companion reads: "No Human in the Loop: A Concept Contract for an AI Self-Delivering Organization" and "How Nine Roles Take Over a Company: An Agent Org Chart That Never Drifts". For the mechanism-level deep dive, see "The Three Mechanisms of Unattended Dispatch: Claim Locks, Central Push, and Idempotency Keys".

The hardest thing to maintain in a working AI delivery system is not the agents' prompts. It is the question of what belongs where. Improving one role's skill list should not require redeploying the dispatch service, and editing a prompt should never depend on which machine happens to hold a stale copy.

> One-sentence takeaway: **layer by rate of change, not by function** — content that changes daily and infrastructure that changes quarterly must never live in the same deployment.

## Why layer-mixing hurts

Most Agent frameworks look coherent in the demo: role definitions, dispatch service, task data, and document outputs share one repository, and the first walkthrough takes minutes. Long-term evolution is where the cost appears:

- Optimizing a role's skill list means the commit must pass the dispatch service's regression suite before anyone dares merge it.
- Upgrading the scheduler pins every role definition to the old runtime.
- Two worker machines hold their own copies of the same resources, so one role behaves differently per instance — half a day of debugging later, one machine simply had not been synced.

These are not bugs in a particular framework; they are what layer-mixing produces. Root cause: **the change rate of content and the change rate of infrastructure are welded into one deployment.**

## What you will get from this post

1. **Layer by rate of change, not by function.** What changes daily ("how to work") and what changes every few months ("who dispatches") must be physically separated.
2. **Bind resources with symlinks, never copies.** Copying means drift; symlinks are the only mechanism in a multi-instance system that guarantees a change is live once made.
3. **Cross repositories through configuration only.** Layer boundaries are maintained by convention, not by "it happens to be on the same machine".

## The criterion: two dimensions, three layers

| Dimension 1: rate of change | Dimension 2: who may change it |
|---|---|
| Knowledge layer (how each role works) — changes almost daily | Evolved by the framework's authors, shared across projects |
| Archive layer (what got produced) — grows with every project | Written automatically by delivery, curated by humans |
| Dispatch layer (who runs what, when) — moves once every few months | Implemented by the platform; built for stability, changed as little as possible |

Stack the two dimensions and the system falls apart in exactly the way you want — into three repositories:

| Repo | Company analogy | Essence |
|---|---|---|
| **Knowledge layer** | Employee handbook | Pure content, client-agnostic (no dependency on any specific AI CLI): role definitions, skills, workflows, domain knowledge |
| **Dispatch layer** | Office and ticketing system | Executable platform: control center (projects, tasks, claim locks, job runners, audit) + worker-instance clients (pull task → assemble prompt → launch the AI CLI) |
| **Archive layer** | Records room and showcase | Document store: development drafts, shipped app docs, run reports, task templates |

Each layer answers exactly one question: **knowledge says what to do next; dispatch says which instance, when, and that exactly one worker does it; archive stores what got built and feeds it downstream.** Remove one layer and the other two immediately lose their meaning.

In practice the criterion is two questions per file: how often does it change, and who is allowed to change it? The answers place the file in exactly one layer, and each layer evolves at its own pace without dragging the others.

## Four disciplines hold the boundary

Splitting is easy; staying split is the work. The boundary is written as non-negotiable invariants:

1. **Never put skills, workflows, or Agent definitions into the dispatch or archive repository.** Content always lives in the knowledge layer.
2. **Never hardcode machine-specific paths or cross-repo absolute paths in runtime logic.** Everything resolves through configuration — this is also why the knowledge layer stays client-agnostic.
3. **Worker instances bind knowledge-layer resources through symlinks, never copies.** Changes take effect immediately across every instance; the possibility of copy drift is physically eliminated.
4. **One commit never spans two repositories.** The top-level working directory is not a repository — each of the three layers keeps its own git history, which is itself a daily reminder that the layers exist.

Plus one meta-rule: **the same principle may exist in exactly one document.** Restating it forks it; when you need to reference it, link to the source of truth.

## What it looks like in the product

In the dispatch layer's desktop client, creating a worker instance takes a single action: pick a role. Everything that role binds in the knowledge layer — agent, skills, workflows, knowledge base — appears in the instance workspace as symlinks, automatically:

![Creating a worker instance: picking a role auto-binds that role's knowledge-layer resources — agent, skills, workflows, knowledge base — as symlinks in the instance workspace](/assets/resources/20261019-three-layer-separation/instance-resources-bindings.png)

One glance shows how an "employee handbook" is handed to the "office" for duty. That screen is also the physical realization of disciplines 2 and 3: resources are resolved through configuration and bound by symlink, so no manual synchronization exists — and no second copy exists to drift.

---

## Conclusion and further reading

- **The criterion transfers to any Agent system.** Ask "how often does this file change, and who may change it" before deciding which layer it belongs to; layers then evolve without slowing each other down.
- **Symlinks are the physical implementation of single source of truth.** When multiple instances share resources, a copy-based approach is architecturally wrong, not merely "good enough for now".
- **Audit your own system now:** does editing one prompt require redeploying the dispatch service? If the answer is yes, your system is layer-mixing, and the failure-mode list above is your checklist.

Series: this piece is part of *Idea-to-Production*. Companion reads on this site: *No Human in the Loop: A Concept Contract for an AI Self-Delivering Organization* and *How Nine Roles Take Over a Company: An Agent Org Chart That Never Drifts*; the mechanism-level deep dive is *The Three Mechanisms of Unattended Dispatch: Claim Locks, Central Push, and Idempotency Keys*.

If your team has drawn these boundaries differently — a monorepo with enforced rules, submodules, or a package registry instead of symlinks — I would like to hear where the tradeoffs landed. Drop it in the comments and I will reply to every one.
