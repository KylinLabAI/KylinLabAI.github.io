---
title: 'Docs as Executable Assets: Writing Specifications Agents Can Run Verbatim'
subtitle: >-
  Two execution paths, five doc bug classes, and the five writing disciplines
  that keep AI agents from misreading your handoff docs.
platform: github-pages
language: en-US
lang: en
date: 2026-10-25T00:00:00.000Z
slug: docs-as-executable
description: >-
  AI agents consume handoff docs 24/7: on an artifact chain they implement your
  words literally, and at runtime your docs are injected into an eight-segment
  context prompt. Five doc bug classes and the writing disciplines that keep
  specifications unambiguous.
keywords:
  - AI agents
  - documentation
  - handoff docs
  - artifact chain
  - context prompt
  - writing disciplines
tags:
  - Artificial Intelligence
  - Software Engineering
  - Documentation
  - AI Agents
category: Tech
word_count: 1131
author: kylinlab.tech
layout: knowledge-article
permalink: /knowledge/docs-as-executable.html
published: true
excerpt: >-
  Human readers patch ambiguity with common sense; agents execute it. In an
  agent-run delivery system, handoff docs are implemented literally on an
  artifact chain and injected verbatim into an eight-segment runtime context
  prompt. This article presents docs as executable assets, walks through five
  doc bug classes — ambiguous specs, placeholders, restated principles,
  terminology drift, and missing docs — pairs each with one writing discipline,
  and closes with a five-question self-check for your key handoff documents.
image: resources/cover-en.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/docs-as-executable.html'
ghp_series: Idea-to-Production
---

# Docs as Executable Assets: Writing Specifications Agents Can Run Verbatim

![Cover image: a robotic hand peeling a yellow TODO note off a glowing Markdown document that unrolls into a code ribbon feeding a gear-driven production line](/assets/resources/20261025-docs-as-executable/cover-en.png)

> Series: Idea-to-Production · Practice. Companion pieces in this series: *Human Out of the Loop: A Conceptual Contract for an AI-Native Delivery Organization* and *Thirteen Stages and Their Artifacts*.

Human documentation has always relied on an invisible error-correction layer: the reader. A colleague fills gaps with team conventions, routes around a TODO, and ignores a stale paragraph. Agents have no such buffer. In a delivery system where AI agents hand work to each other, this is the most underestimated layer of engineering: however strong the model is, the quality ceiling of your system equals **the unambiguity of your handoff documents**.

This article is about accepting one setting we were forced into — **documentation is an executable asset**: it has typed interfaces, it can hide bugs, and real agents run it 24/7 in production — and the five writing disciplines that follow from it. These are not prompt tricks; they are the upstream craft of making "writing docs" itself an engineering activity. Every discipline below came out of a real postmortem.

## What you will take away

1. **Review every delivered doc like a public API.** Its input assumptions, output contract, and term definitions deserve the same scrutiny as a function signature.
2. **A TODO in a delivered doc is runnable dead code.** Humans route around placeholders; agents execute them.
3. **Copying is forking.** The moment a principle is written into a second document, you own two truths that will drift apart on their own.

## How a document gets "run": two paths

In this system a document is not reference material. It has two real execution paths.

### Path 1: the artifact chain

Stages hand work to each other through named documents — `requirement.md`, `solution.md`, `tech_design.md`, `plan.md` — and the downstream agent deep-reads each one and produces its output from it. An architecture document with any ambiguity gets implemented **literally** by the next stage.

### Path 2: runtime assembly

When a work instance takes a task, it assembles the knowledge-layer resources into one structured context prompt and hands it to the AI CLI — a fixed eight-segment shape, order never changing:

```text
1 General rules   2 Project context   3 Role rules   4 Workflow
5 Knowledge resources   6 Available tools   7 Skills   8 Task definition
```

Of the eight segments, only *task definition* is **always** present; *general rules*, once bound, never disappear — an empty segment renders rather than silently vanishing; the remaining segments appear or are omitted depending on the resources bound to the instance. In other words: **every word you write in the knowledge layer enters the model's context in that exact textual form and is executed as an operating instruction.** From this point on, writing documentation is not support work — it is programming work.

## Five doc bug classes, each paired with one discipline

### 1. Ambiguous spec → hallucinated subsystem

"Add basic auth." A human teammate assumes the team's conventions; an agent hands back a freestyle login universe. Most so-called "agent hallucination" actually happens at this moment: **the model merely executed your ambiguity.**

→ **Discipline: doc-first.** The spec changes before the implementation that fulfills it; writing to the precision where "the next role doesn't need to ask" is the minimum bar for a stage handoff. When doc and code disagree, it enters the bug queue — it is not shelved as chores.

### 2. Placeholder → runnable dead code

Drafts leave unclear parts as TODOs. In a human world, the note lies quietly; in an agent's world, the downstream stage implements "TODO: add rate limiting" as a requirement — or, worse, produces "none" from the empty part. Humans route around placeholders; agents execute them.

→ **Discipline: zero placeholders in delivered docs.** A part that isn't thought through should not enter delivery; send one fewer doc rather than one with holes in it.

### 3. Restated principles → two diverging truths

Copying the same rule into a second document "for readability" is where everything starts. Three months later, each copy has been edited a round on its own, two agents quote one copy each, behavior splits — and nothing errors anywhere.

→ **Discipline: single source of truth, link instead of copying.** A principle is defined in exactly one place; other locations may only carry a link to it. This discipline is cheap to keep and expensive to break.

### 4. Terminology drift → silent routing failure

Role IDs, stage letters, and task-type vocabulary each have one spelling in the content layer and another in the runtime. Fixing place A and forgetting place B produces a symptom of "that class of tasks mysteriously never gets picked up again" — no exception, only backlog.

→ **Discipline: naming is fixed once; renames are cross-repo sweeps.** Treat namespaces as a public API (see *How Nine Roles Share a Company: An Agent Org Chart That Won't Drift*).

### 5. Missing docs → degraded execution

The process requires a workflow file per stage. Without it, the agent "improvises": it substitutes generic knowledge for project conventions — every time, and differently every time. That is how variance enters the pipeline.

→ **Discipline: the execution surface needs doc backing** — one one-page work instruction per stage, loaded on demand. Thirteen precise one-pagers beat one tome nobody finishes.

## Self-check

Pull out the critical handoff documents in your repository and ask, one by one:

- [ ] Are its input assumptions written down (which upstream files it depends on, what happens when they are missing)?
- [ ] Is its "definition of done" decidable, or is it phrased like "well designed" — something only a human can smooth over?
- [ ] Search the whole file for TODO / TBD / placeholders — are any inside the deliverable?
- [ ] Do the principles cited here have a second "translated version" anywhere else?
- [ ] Are the terms spelled identically across both systems, guarded by a mapping table?

If you cannot answer any one of the five, that document is running in production with an unfixed bug.

## Conclusion

1. **"Docs are executable" is not a metaphor**: they are either implemented literally in the artifact chain or injected as-is into the eight-segment context. Your docs are already running — the only difference is whether a human or an agent runs them.
2. **The five disciplines share one essence: bring software engineering into writing** — interfaces must be defined, placeholders may not ship, there is only one truth, naming is managed as an API, and execution must be doc-backed.
3. **Start from the smallest action**: pick your most important handoff doc, fix it once against the self-check list, then observe whether the variance in the next run shrinks — the cheapest, fastest-feedback experiment in this series.

Further reading in this series: *Human Out of the Loop: A Conceptual Contract for an AI-Native Delivery Organization*, *Thirteen Stages and Their Artifacts*, and *How Nine Roles Share a Company: An Agent Org Chart That Won't Drift*.
