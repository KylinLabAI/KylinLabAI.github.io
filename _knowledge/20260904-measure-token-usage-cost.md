---
layout: knowledge-article
title: 'Measure Your Real AI Token Usage and Cost: Local Logs vs Platform Bills'
subtitle: >-
  Two open-source skills that turn scattered session logs and platform invoices
  into one honest picture of what your AI actually costs
platform: github-pages
language: en-US
lang: en
date: 2026-09-04T00:00:00.000Z
slug: measure-token-usage-cost
description: >-
  List price is not your invoice. Measure real AI token usage and cost with two
  routes — parse local session logs for per-agent detail, pull platform bills
  for actual charges — and avoid the credit-vs-currency trap.
keywords:
  - AI token usage
  - token cost measurement
  - local session logs
  - platform bills
  - BYOK
  - unit conversion
tags:
  - AI Tooling
  - Cost Measurement
  - Open Source
category: Tech
word_count: 1900
author: kylinlab.tech
permalink: /knowledge/measure-token-usage-cost.html
published: true
excerpt: >-
  List price is not what you were charged. Two open-source skills measure real
  AI usage: one parses local session logs for per-agent and per-model detail,
  the other normalises platform bills into what you were actually charged.
  Choose the route by where the data lives and how granular it is, never add
  credits to currency raw, and delegate the whole run to an AI agent for about
  nine cents.
image: /assets/img/covers/measure-token-usage-cost.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/measure-token-usage-cost.html'
ghp_series: AI Cost-Effective Usage
ghp_disqus_shortname: ''
---

# Measure Your Real AI Token Usage and Cost: Local Logs vs Platform Bills

![Cover image: measuring AI token usage and cost — local logs versus platform bills](/assets/resources/20260904-measure-token-usage-cost/cover-en.jpg)

Most people measure AI cost by multiplying a price table by a guess. That produces a unit price, not an invoice. What you were actually charged depends on cache hit rates, context growth, and models quietly re-routed behind the interface — none of which a price table can see. This guide gives you two routes that measure it for real.

## Choose the route by data location and granularity

The dividing line is not "client versus platform". The same unit of spend can be billed on a server while its detail sits on your disk, or leave no local trace at all. Ask two questions of every tool: **where is the data stored, and how granular is it?**

| Case | Tools | Where the data lives | Granularity | Route |
|------|-------|----------------------|-------------|-------|
| Server-side billing, no local tokens | Qoder, CodeBuddy, TRAE, CloudCode | Provider servers | Bill only | `ai-usage-report` (only source) |
| Complete local session logs | Copilot, Codex, Claude Code, OpenCode | Local JSONL / SQLite | Per agent / model / session / day | `ai-token-usage` (offline detail) |
| Bill exists but is coarse | DeepSeek console + a local client | Charges on platform, detail local | Platform per day, local per session | Use both |

Three situations worth naming explicitly:

- **IDE platforms only** — no readable local records exist, so the platform bill is the only source.
- **Local client with your own API key (BYOK — bring your own key)** — the client vendor's billing page has no record of you and the API vendor shows only daily totals, so local logs are the only way to attribute spend to an agent or a session.
- **Coarse platform bills** — the bill answers "what was I really charged", the logs answer "where did it go". You need both.

## Route 1 — Parse local session logs (`ai-token-usage`)

This skill reads the logs your clients already write, unifies each vendor's field names into `input_tokens` / `output_tokens`, and aggregates by agent, model, session and day. It also reports how much of the current session's context window remains.

My August result: 1.4B tokens (1,378M input, 12M output), 14,700 turns, 204 sessions, roughly ¥813.16 estimated.

![ai-token-usage report summary: August range, 1.4B tokens / 14,700 turns / 204 sessions / ~¥813.16 estimated](/assets/resources/20260904-measure-token-usage-cost/route1-ai-token-usage-summary.png)

> Pricing caveat: that figure is costed at **standard token prices**, not real incurred spend — free-tier usage is priced at the vendor's official rate and counted in the total. deepseek-v4-flash is free on OpenCode, yet those tokens are still costed at DeepSeek's official pricing inside the ¥813.16 figure. Read it as usage costed at list price: higher than what you were actually charged.

![Token usage by agent: claudecode 58% / opencode 42% / others 0%](/assets/resources/20260904-measure-token-usage-cost/route1-agent-breakdown.png)

Cost here is an **estimate**, not an invoice. It prices the real input / output / cache-read split rather than a blended rate — important, because cache reads are orders of magnitude cheaper than output tokens. Cache reads use the cache rate while the price table stores standard list rates.

> Hard limit: Qoder, CodeBuddy, TRAE and CloudCode write no parseable local token logs. This route reports zero for them — expected behaviour, not a bug.

## Route 2 — Normalise platform bills (`ai-usage-report`)

This skill turns each platform's bill into one record shape — `date / model / cost / free / prompt / platform` — and produces reports with charts plus a cross-platform overview. Data enters three ways: official exports, direct REST calls, or a real browser session that keeps you logged in.

![Converted cost (RMB) by platform: CodeBuddy 117.1 (59.7%), DeepSeek 45.4 (23.1%), Qoder 31.3 (16.0%), TRAE 2.3 (1.2%)](/assets/resources/20260904-measure-token-usage-cost/route2-platform-cost-share.png)

Granularity follows the platform: CodeBuddy exports per request, DeepSeek only per day. Two guardrails protect the result — abort if scraping missed more than 50% of the requested days, and drop records an API returned outside the requested window so they cannot backfill gaps into the wrong month.

## The unit trap: credits are not currency

Qoder and DeepSeek bill in RMB. TRAE and CodeBuddy bill in **credits**. Adding them raw produces a number that looks authoritative and means nothing. Convert credits to a common currency first using the configurable rates, then treat the converted total as a reference — promotions and bonus credits skew it. For genuine cross-platform comparison, use dimensionless metrics: request count, active days, model mix.

## Delegating the measurement

Both are AI skills, so you describe what you want in plain English instead of memorising flags. A full audit across both skills took four requests, three minutes and 3.80 credits — about ¥0.09.

![Real bill screenshot: the credit cost of having an AI agent run both skills](/assets/resources/20260904-measure-token-usage-cost/ask-ai-to-generate-report.png)

Here is what that run measured — a month of real daily spend, peaking at ¥26.80, with most days under ¥10:

![Daily cost across platforms in August: spiky, peak ¥26.8, most days below ¥10](/assets/resources/20260904-measure-token-usage-cost/route2-daily-cost.png)

Measuring cost two orders of magnitude less than the thing being measured. One caveat from that same bill: I had explicitly selected hy3-x, yet deepseek-v4-pro also appeared — the IDE routes some sub-steps to a different model. The model you think you are paying for is not always the model you are paying for.

## Reproduction checklist

1. For each tool, record three facts: are there readable local logs, where is the bill, and how granular is it?
2. Run the log scan for per-agent and per-model splits; run the bill pull for actual charges; use both when the bill is coarse.
3. Convert units before any cross-platform total, and treat converted totals as reference only.
4. Repeat monthly and archive the output — usage is a trend, not a snapshot.

## References

- [`ai-token-usage` manual](https://github.com/KylinLabAI/kylinlab.tech.skills/blob/master/docs/ai-token-usage.md) — install, options, report and data-store layout
- [`ai-usage-report` manual](https://github.com/KylinLabAI/kylinlab.tech.skills/blob/master/docs/ai-usage-report.md) — data paths, validation guardrails, unit conversion config
- Source repository: https://github.com/KylinLabAI/kylinlab.tech.skills

Stop estimating. Measure once and you will never read a price table the same way again.
