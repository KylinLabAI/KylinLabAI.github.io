---
title: >-
  Single Source of Truth: What Keeps You Consistent When AI Does Most of the
  Work
platform: github-pages
language: en-US
date: 2026-09-17T00:00:00.000Z
description: >-
  Most tasks are done by AI without human involvement, so drift happens
  silently. A simple, read-only, human-maintained source of truth document on
  Day 1 is the only anchor that keeps all downstream artifacts aligned.
keywords:
  - single source of truth
  - AI-assisted development
  - AI drift
  - consistency
  - knowledge document
  - AI workflow
tags:
  - AI Engineering
  - Software Development
  - Workflow
  - Consistency
category: Tech
word_count: 2200
author: kylinlab.tech
layout: knowledge-article
lang: en
permalink: /knowledge/single-source-of-truth.html
published: true
excerpt: >-
  Most tasks are done by AI without human involvement, so drift happens
  silently. A simple, read-only, human-maintained source of truth document on
  Day 1 is the only anchor that keeps all downstream artifacts aligned.
image: /assets/img/covers/single-source-of-truth-en.jpg
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/single-source-of-truth.html'
ghp_series: AI Cost-Effective Usage Strategy
---

# Single Source of Truth: What Keeps You Consistent When AI Does Most of the Work

![Cover image: Single Source of Truth in AI-assisted development](/assets/resources/20260917-single-source-of-truth/cover-en.jpg)

Most tasks are now delegated to AI. You describe what you want, AI generates the code, the config, the script. But you are not present during execution — so when drift happens, you cannot feel it.

The fix is deceptively simple: **create a source-of-truth document on Day 1 of any task** — a document you maintain, that is simple, read-only, and serves as the single anchor for everything AI produces downstream.

## The Problem: Silent Drift

The workflow looks like this: you submit a requirement, AI writes code, generates config, creates a script. Project A is done. Project B is done. Project C is done. Each project was "completed to your specifications." But when you look back — three projects have contradictory logic for the same feature, inconsistent naming, and different configs.

Your first instinct is "AI output is unreliable." But the issue is not quality per call. It is a subtler fact: **most tasks are done by AI, and you as a human do not participate in the execution process. Drift happens when you are absent, so you cannot perceive it.**

Worse, when you finally notice the drift, it may have been accumulating for months. Three months ago, in one session, AI changed a rule — you did not catch it. Everything built on that rule since then grew on a wrong foundation. When you eventually hit a problem in a project and trace it back, you discover: the root cause is three months old, and every project in between was affected. Without a source-of-truth document, you cannot even determine what the original correct version was. You rely on memory and guesswork to roll back.

In Session A, you agreed on a rule with AI. By Session B and C, AI may have "forgotten" or "misinterpreted" it. You lack the ability and time to audit every output line by line. Drift accumulates silently. By the time you notice, rules across multiple projects are severely inconsistent, and rollback costs are enormous.

Traditional approaches — "verbal agreements" and "rewriting rules in every prompt" — cannot solve this. Multiple copies inevitably drift. Verbal agreements have no reference point. You need something you control, something simple, something singular, to lock down the behavior of all downstream artifacts.

## Approaches We Considered

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| Rewrite rules in every prompt | Easy at the moment | Multiple copies inevitably drift, hard to sync | One-off tasks |
| Verbal agreements, no doc | Zero cost | No reference point whatsoever, easiest to lose | Trivial temporary agreements |
| Maintain one rule file, reference everywhere | Single source of truth, change once apply everywhere | Requires creating the file, building the habit of referencing | Long-term projects, frequently changing preferences |

"Maintain one file, reference everywhere" is the floor. But the core issue is not *where* it lives — it is that **this file must be maintained by you, must be simple, and AI must not be able to modify it on its own**.

## Core Principle: Build the Source of Truth on Day 1

This is the single most important action in this entire article: **on Day 1 of any task, before you ask AI to do anything, create a simple source-of-truth document that states your core rules and constraints for the task.**

Not after problems appear. Not after the project is done and you write documentation retroactively. On Day 1. Before the first time AI helps you with the task. Because you are absent from Day 1, and drift starts on Day 1.

This document has four key characteristics:

1. **You are the sole author.** Every rule, every constraint is a decision you explicitly made. AI should not modify it on its own.
2. **It must be simple.** Simple things are easy to execute fully. If the document is complex from the start, AI is more likely to "simplify" your intent and skip details during implementation.
3. **It is read-only.** Any change must be confirmed and approved by you. Once AI modifies this document without your knowledge, all downstream artifacts silently deviate from your intent.
4. **It applies to any task.** Not just code. Any task assisted by AI — generating config, creating documentation, processing data — should have a corresponding simple source-of-truth document on Day 1.

**Why? Because AI does most of the work, and you are not present.** The rule you set in Session A may be "optimized away" by Session B. You cannot audit every output line by line. So you need an anchor — a document you wrote yourself, that is simple, that AI does not dare touch — to ensure all downstream artifacts ultimately align with your intent.

Without this anchor, drift is untraceable. You notice a project behaves unexpectedly, but you do not know which session started the deviation, which projects were affected in between, or what the original correct version was. With this source-of-truth document, at least you have a definitive baseline to compare against — anything that does not match this document is worth investigating.

## A Concrete Example: Knowledge → Skill → Script

This is one implementation pattern among many, but it demonstrates the principle clearly.

**Three-layer structure:**

| Layer | What It Is | Responsibility |
|-------|-----------|----------------|
| **Knowledge** | The source-of-truth document you maintain | Defines "what it is" — specs, constraints, design principles |
| **Skill** | AI's instruction file | Defines "how to do it" — references Knowledge, provides implementation steps |
| **Script** | AI's generated output | Defines "what to do" — calls Skill to complete a specific task |

**Control flow:**

```
Knowledge → Skill → Script
(you control)  (AI writes)  (AI generates)
```

Suppose your team has multiple projects that need to create release repos. You define a Knowledge document:

```markdown
# Release Repo Spec
- visibility: public (mandatory)
- Must enable Issues
- Disable wiki and discussions
- Description source: publish_stage_0 text from config.yaml
```

Then you write a Skill that references this Knowledge and follows steps to create and configure the repo. Project A and Project B both call the same Skill, producing consistent results.

When Project A finishes and you find that `info.yaml` and `config.yaml` descriptions are inconsistent — you do not go edit Project A's script. You revise the Skill to unify the source to `config.yaml`. When revising, you check against the Knowledge document: if Knowledge already defined it, the Skill implementation was imprecise; if Knowledge did not specify clearly, you update Knowledge first, then fix the Skill.

Special requirements for different projects (e.g., one project needs a private repo) are handled as branch logic in the Skill layer. **Knowledge remains the single source of truth at all times.**

## Why Not the Other Way Around

Some might ask: can we start with AI's output, extract rules from it, and inductively build a source of truth?

In theory, maybe. In practice, this path does not work:

- Generated artifacts are concrete and one-off, mixing business logic and generic logic.
- Extracting common patterns from multiple artifacts means finding commonalities across multiple copies — it will naturally miss things.
- A source of truth must be proactively defined, not retroactively归纳.

The correct direction is always: **first the source of truth you define, then AI's implementation, then AI's generated artifacts.**

## Reusable Checklist

- [ ] **Build the source-of-truth document on Day 1** — before any task starts, before the first time AI does work for you, write this simple source-of-truth document.
- [ ] In AI's instructions, state explicitly: the source-of-truth document is read-only, AI must not modify it, any changes require human confirmation.
- [ ] Have AI reference the source-of-truth document during implementation — do not inline the full rule text.
- [ ] When artifacts have problems, first check whether AI's implementation needs revision, then check whether the source of truth needs updating.
- [ ] Special requirements for different projects or scenarios: handle them as parameterization or branch logic in the implementation layer — do not modify the generated artifacts directly.
- [ ] Periodically review the source-of-truth document to ensure it is current, complete, and unambiguous.

## Key Takeaways

1. **Build the source-of-truth document on Day 1.** Before any task starts, before the first time AI works for you, write this simple source of truth. Drift starts on Day 1 — you cannot wait until problems appear to write it.
2. **This source of truth is the only thing you can control.** It is simple, read-only, and maintained by you personally. All AI artifacts align back to this document — anything that does not match is worth inspecting.
3. **The source of truth is read-only.** AI must not modify it on its own. Any change must be confirmed and approved by a human. Otherwise, drift happens silently.

Next time you start any task, build this document on Day 1 — write your single most important rule into it, keep it simple, keep it read-only, and let all AI artifacts align back to it.
