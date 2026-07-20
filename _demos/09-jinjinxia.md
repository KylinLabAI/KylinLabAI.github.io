---
layout: demo-article
title: "JinJinXia — Self-Healing AI Skills"
date: 2026-07-19
category: development
lang: en
slug: jinjinxia
logo: /assets/resources/jinjinxia/logo_256.png
permalink: /demos/jinjinxia.html
tags: ["AI", "Skill Management", "DevOps", "Automation"]
description: "JinJinXia is a self-hosted service that automatically improves your team's AI skills by detecting correction signals and generating improvement PRs."
demo_link: "#"
status: release
---

[中文介绍](/zh/demos/jinjinxia.html)

# JinJinXia — Self-Healing AI Skills

![JinJinXia Logo](/assets/resources/jinjinxia/logo_256.png)

**Your team's AI skills get better every time someone uses them — automatically, with zero extra effort.**

## Problem

Your team built a library of AI skills — reusable prompt templates or agent workflows for code review, doc generation, SQL analysis, and dozens of other tasks. Everyone uses the same skills. Consistency is high. Life is good.

Then reality kicks in: edge cases trip skills up, users correct the AI mid-conversation, each person solves the same problem independently, and there's no path to feed those fixes back into the shared skill. The skill stays broken, widening the gap between how skills should work and how they actually work.

## Solution

JinJinXia inserts a transparent observation layer into your AI agent's native hook system. It captures conversation messages, uploads them to a self-hosted server, and performs intelligent analysis to identify skill issues, cluster them across users, and generate improvement Pull Requests — without modifying any skill code.

You just keep working. The skills get better on their own.

## Core Value

- **Skills improve without anyone filing a bug** — JinJinXia hooks into your AI agent's native event system and detects correction signals automatically
- **No workflow changes for your team** — Users keep chatting with AI as usual — detection is completely invisible
- **Ready-to-merge PRs, not vague reports** — When 3+ users hit the same issue, JinJinXia generates a Draft PR with the fix, root cause, and evidence
- **Your data stays on your network** — Self-hosted server; optional local LLM and embedding for air-gapped deployments

## Features

### Zero-Intrusion Detection

JinJinXia uses each AI platform's native hook system — no skill code changes, no wrappers, no middleware.

### Transparent Message Capture

The client is a dumb message uploader — incremental uploads, non-blocking, no local disk storage. All intelligence lives on the server.

### Two-Path Analysis

Choose between cloud LLM (default) or server-side CLI agent mode for session analysis. In CLI mode, install Copilot or Claude on the server — the analysis agent reads skill repos directly, producing solutions aligned with your team's AI tool.

### Smart Clustering

Similar issues from different users are grouped automatically using embedding-based similarity to prevent duplicate PRs.

### Automatic PR Generation

When a cluster reaches the evidence threshold (default: 3 users), JinJinXia generates a Draft PR with the fix, root cause, and evidence.

### Best Practice Knowledge Base

Every resolved issue represents a learning opportunity — automatically captured as a BestPractice record with before/after excerpts.

### Multi-Repo Skill Registry

One JinJinXia server handles all skills across different Git repos with scan-from-repo capability.

### Tab-Based Web UI

Built-in Dashboard, Best Practices, and Settings pages — no external frontend framework.

## Quick Start

1. Start the server: `docker-compose up -d`
2. Install the client: `pip install jinjinxia-client`
3. Install hooks for your AI platforms
4. Configure settings at `http://<server>:8080/admin`
5. Use your AI skills as usual — improvements happen automatically

## Privacy

- **All data stays on your infrastructure** — self-hosted server, local database, no cloud dependency
- **No account required** — no sign-up, no SaaS, no subscription
- **Session data is never stored on disk** by the client — streamed to the server on session end
- **LLM calls stay internal** — configure your own LLM endpoint

## Status

**Current Status:** v0.2.1 — Core functionality released. PyPI client package and Docker server image available.

## Links

- [App Releases](https://github.com/KylinLabAI/JinJinXia-App)
- [Demo Documentation](../demo/demo.md)
- [Contact](https://kylinlabai.github.io)