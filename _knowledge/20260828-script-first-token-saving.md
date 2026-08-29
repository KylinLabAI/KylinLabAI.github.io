---
layout: knowledge-article
title: >-
  Script-First: Move Fixed Decisions Into a Script and Stop Paying the AI to
  Re-Reason Them
subtitle: >-
  A two-layer pattern — deterministic script plus AI-as-exception-handler — that
  cuts reasoning-token spend while making repetitive workflows consistent and
  trustworthy.
platform: github-pages
language: en-US
lang: en
date: 2026-08-28T00:00:00.000Z
slug: script-first-token-saving
description: >-
  Fixed workflows shouldn't be re-reasoned by the AI every run. Script-First
  moves deterministic steps into a script and lets the AI handle only
  exceptions, cutting reasoning tokens while improving consistency.
keywords:
  - Script-First
  - AI cost
  - reasoning tokens
  - scripting
  - agent design
tags:
  - AI Engineering
  - Cost Optimization
  - Automation
  - Agent Design
category: Tech
word_count: 1350
author: kylinlab.tech
permalink: ''
published: true
excerpt: >-
  Fixed steps belong in a script; the AI should handle only exceptions.
  Script-First raises consistency and drops reasoning-token spend on repetitive
  workflows.
image: /assets/img/covers/script-first-token-saving.png
toc: true
ghp_canonical_url: ''
ghp_series: AI Cost-Effective Usage
ghp_disqus_shortname: ''
---

# Script-First: Move Fixed Decisions Into a Script and Stop Paying the AI to Re-Reason Them

![Script-First: Move Fixed Decisions Into a Script and Stop Paying the AI to Re-Reason Them](/assets/resources/20260828-script-first-token-saving/cover-en.jpg)

> The cheapest reasoning token is the one you never spend. If a step is deterministic, put it in a script and let the AI handle only the exceptions.

## Background / Problem

Most teams treat the AI like a junior engineer that re-plans every task from scratch. For one-off work that's acceptable. But for repetitive, fixed-step routines — pre-publish checks, lint, changelog — the re-reasoning is pure cost. The model re-derives a flow it already knows, occasionally drops a step, and bills you for the thinking every time.

## Approach / Two-Layer Split

- **Script layer** (shell / Python) owns the deterministic steps: checks, formatting, tests. It runs identically every run.
- **Scheduling layer** (the AI) intervenes only on exceptions, e.g. deciding how to fix a lint error the script flagged.

```text
  repetitive / fixed flow
        │
        ▼
  ┌──────────────────┐
  │  Script layer      │  check · lint · changelog · fill template
  │  (deterministic)   │  no reasoning spent; emits result / exceptions
  └─────────┬─────────┘
            │ structured feedback + exceptions
            ▼
  ┌──────────────────┐
  │  Scheduling (AI)  │  consumes feedback; reasons only on exceptions
  └──────────────────┘
```

### Option comparison

| Option | Pros | Cons | Use when |
|--------|------|------|----------|
| AI reasons live every time | Zero script cost | Burns reasoning tokens, steps slip | One-off tasks |
| Script layer + scheduler | Consistent, cheap | Write the script once | Repetitive fixed flows |
| Fully automated (no AI) | Cheapest | Low flexibility, weak on exceptions | Fully deterministic flows |

## Four rules

1. If a step can be a deterministic script, never let the AI reason it live.
2. Script = deterministic logic; AI = exceptions only — no overlap.
3. Solidify the script first, then have the AI "run it and fix errors."
4. Skill-creators: bake "Script-First" into SKILL.md as a hard guideline — prefer calling a script, reason only as fallback.

## Result validation

Observed (qualitative) improvements after applying the pattern:

- **Consistency:** from "steps sometimes missing" to identical every run.
- **Reasoning share:** the model no longer re-derives the flow; the bill's reasoning portion drops noticeably.
- **Interaction:** from "help me prepare the release" (model reasons) to "run pre-publish.sh, fix only errors" (model barely reasons).

Track two metrics if you adopt it: reasoning-token share per task, and time spent on repetitive tasks.

## Mistakes, tradeoffs, alternatives

- **Don't over-script one-off work.** The script itself has a cost; apply Script-First where the flow repeats.
- **Keep the AI for judgment.** Scripts are bad at ambiguous exceptions — that's exactly where the model earns its token.
- **Skill authors:** the biggest lever is the default. A skill that "looks for a script first" quietly saves tokens across every invocation.

---

## Conclusion & further reading

1. Fixed steps belong in a script; the AI handles exceptions — consistency up, tokens down.
2. Script-First = deterministic logic固化, reasoning only for exceptions.
3. Start with one line: `pre-publish.sh` plus "run it, fix only errors."

Related on this site: the companion piece on independent code review as upfront quality cost. Next up: moving quality gates earlier in the loop. Did a fixed workflow trip you up when scripting it? Drop it in the comments — I reply to every one.
