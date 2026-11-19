---
layout: knowledge-article
title: 'Pay AI Only Once: Save Tokens with Scriptable Tasks'
subtitle: >-
  A reusable rule for the shrinking-credits era: ask AI for a reusable script on
  the first call, then run it yourself. A 51-repo sync shows zero tokens per run
  and a diff-able Markdown output.
platform: github-pages
language: en-US
lang: en
date: 2026-11-19T00:00:00.000Z
slug: scriptable-skill-save-tokens
description: >-
  Turn repeated AI tasks into scripts: the first-call rule, the decision
  boundary, and a 51-repo sync producing two Markdown reports at zero tokens per
  run.
keywords:
  - AI tokens
  - scriptable tasks
  - deterministic execution
  - git audit
  - automation
tags:
  - AI
  - Automation
  - Git
  - Software Engineering
  - Developer Tools
category: Tech
word_count: 1620
author: kylinlab.tech
permalink: /knowledge/scriptable-skill-save-tokens.html
published: true
excerpt: >-
  Free AI credits are shrinking, yet repeated fixed checklists still burn tokens
  on every run. The rule: ask AI for a reusable script on the first call, then
  run it yourself. A 51-repo sync script demonstrates the decision boundary, two
  Markdown reports, and zero token cost per run.
image: /assets/img/covers/scriptable-skill-save-tokens.png
toc: true
ghp_canonical_url: 'https://kylinlab.pages.dev/knowledge/scriptable-skill-save-tokens.html'
ghp_series: ''
ghp_disqus_shortname: ''
---

# Pay AI Only Once: Save Tokens with Scriptable Tasks

![Cover image: A laptop on a night desk showing code and the words "Deterministic Execution"; large text "Pay AI Only Once" at the top, a speech bubble saying "Write a reusable script" on the left, a "Today's Status" panel listing 51 repos scanned, 0 uncommitted changes, 0 unpushed commits and 5 repos with new code on the right, with "If the task doesn't change, the script stays reusable" at the bottom](/assets/resources/20261119-scriptable-skill-save-tokens/cover-en.jpg)

Free AI tokens and credits are shrinking, but repeated fixed checklists still consume a model call on every run. Paying reasoning tokens for an answer with an identical structure to yesterday's is the most avoidable waste in a modern engineering workflow.

This article gives one rule — the first AI call on a simple, repeated task should produce a reusable script, not a one-off result — and a real 51-repo sync that makes the rule concrete.

## The problem: reasoning repeating a checklist

We maintain dozens of git repos across several workspace trees and ask two questions constantly: is any repo dirty (untracked/uncommitted files, unpushed commits, unmerged branches, extra worktrees, pull errors)? And which TODO, project plan or discussion topic needs attention in each repo?

Both have fixed inputs and fixed output shapes. Invoking an AI skill to scan, compare and print exceptions worked, but cost a model call every time — daily, sometimes hourly. The task required no judgment; the reasoning layer was repeating a checklist.

## The rule and the decision boundary

1. **First call**: ask AI for a deterministic, re-runnable script with an explicit output format — not for the task result.
2. **Boundary**: can you specify the next step before starting? If yes, script it (scanning, comparing, counting, formatting). If no (judgment, unknowns, surprises), keep it in AI reasoning.
3. **Reuse**: store the script and its short spec in the repo; let a human run it; schedule it on cron or CI. Call AI again only when requirements change — regenerate the script, not the answer.

| Option | Upside | Downside | Fits |
|---|---|---|---|
| Call the AI skill every run | Zero setup | Tokens burned each run, slow | Rare checks with real uncertainty |
| AI writes a script once, human runs it | Pay once, free and diff-able later | Upfront authoring cost | High-frequency, rule-clear tasks |
| Script scans, AI reviews exceptions | Low token use, judgment only when needed | More moving parts | Noisy repos with frequent surprises |

We chose option 2: the common case — "everything clean" — should cost zero tokens.

## Implementation: one entry point, two reports

`repo_check_and_status_summary` walks the workspace and emits a git report plus an engineering status summary. After authoring, running it needs no model:

```bash
# Day 1: ask AI to write the script (one AI call)
# Day 2 onward: run it yourself — no model, no credits
python run.py | glow
```

Success signal: the terminal prints `[n/51] Checking <repo>` for each repo and two Markdown files appear. Failure signal: errors collect in the pull-error list and the "Attention Required" section.

![Terminal screenshot of the repo check and status summary script scanning 51 repositories across the KylinLab.Tech, KylinLab.OPC, and Workspace trees, printing each repo path as it is checked](/assets/resources/20261119-scriptable-skill-save-tokens/1-script-exec.png)

Three design invariants:

- The model's responsibility ends when the script exists; it is not on the runtime path.
- Output is plain Markdown, diff-able across runs, not a temporary chat answer.
- A human runs it and reviews; exceptions trigger further judgment.

## Results

| Metric | Result |
|---|---|
| Repos scanned | 51 |
| Uncommitted / unpushed changes | 0 / 0 |
| Behind remote / pull errors | 0 / 0 |
| Extra branches / worktrees | 0 / 0 |
| Repos with new code | 5 |
| TODO / project plans / active topics | 2 / 2 / 1 |
| Token cost per run after authoring | 0 |

![Rendered Git Repo Check Report showing 51 repos scanned, 0 uncommitted changes, 0 unpushed commits, 0 behind remote, 5 repos with new code, and a no-action-needed verdict](/assets/resources/20261119-scriptable-skill-save-tokens/2-repo-status.jpg)

![Rendered Engineering Status Summary with a TODO table listing DouXia TODO-031 and JinJinXia TODO-049, a project summary table with two cross-project entries, and a discussion topics table with one active topic](/assets/resources/20261119-scriptable-skill-save-tokens/3-project-status.png)

The same run surfaced two TODO items, two cross-project plans and one active discussion topic (KylinAgents org-agnostic migration) — no separate AI query.

## Mistakes, tradeoffs, alternatives

1. We kept asking AI to "check the repos" for weeks before noticing the answer shape never changed. The first request should have been "write a script."
2. Our first script tried to handle every git edge case in code; an exception list plus a human glance was enough.
3. Plain Markdown output beat an AI-skill-only flow — diffing between runs became trivial.

Not recommended when inputs are messy and each run needs fresh contextual understanding; that is exactly where reasoning pays for itself.

## Conclusion & further reading

- The boundary is "can the next step be specified before starting," not "is the task simple or complex."
- Our 51-repo sync now costs zero tokens per run and answers both "is anything wrong" and "what needs doing."
- Let exceptions — not the clean case — trigger any further AI reasoning.

More articles: https://kylinlab.pages.dev/knowledge

Did you hit a different gotcha while moving a repeated task off the AI call path? Drop it in the comments — I reply to every one.
