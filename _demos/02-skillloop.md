---
layout: demo-article
title: "SkillLoop — Self-Healing AI Skills"
date: 2026-06-11
category: development
lang: en
slug: skillloop
permalink: /demos/skillloop.html
tags: ["Python", "FastAPI", "AI", "DevTools", "Agent", "Automation"]
description: "A self-hosted service that detects AI skill issues from user conversations, clusters them, and generates improvement PRs automatically. Zero friction."
demo_link: "#"
status: prototype
---

<div align="center">

# 🔄 SkillLoop — Self-Healing AI Skills

**Your team's AI skills get better every time someone uses them — automatically, with zero extra effort.**

[Quick Start](#quick-start) · [Download](#download) · [中文版](/zh/demos/skillloop.html)

</div>

---

## The Problem

Your team built a library of AI skills — prompt templates for code review, doc generation, SQL analysis, and dozens of other tasks. Everyone uses the same skills. Consistency is high. Life is good.

Then reality kicks in:

- A skill works for common cases, but **edge cases** trip it up. Users correct the AI mid-conversation to get the right output.
- Each person solves the same problem **independently** — in their own chat history, invisible to everyone else.
- There is **no path** to feed those individual fixes back into the shared skill.
- The skill stays broken. New team members hit the same wall. Veteran users waste time re-explaining the same fix.

The result? A growing gap between how your skills *should* work and how they *actually* work — widening silently with every conversation.

## The Solution

**SkillLoop** watches your AI conversations transparently, detects when you correct a skill, extracts the issue, and — when enough people hit the same problem — generates a ready-to-review Pull Request that fixes the skill. You just keep working. The skills get better on their own.

---

## Core Value

| What You Get | How It Works |
|---|---|
| **Skills improve without anyone filing a bug** | SkillLoop hooks into your AI agent's native event system and detects correction signals automatically |
| **No workflow changes for your team** | Users keep chatting with AI as usual — detection is completely invisible |
| **Ready-to-merge PRs, not vague reports** | When 3+ users hit the same issue, SkillLoop generates a Draft PR with the fix, root cause, and evidence |
| **Your data stays on your network** | Self-hosted server with local LLM and embedding — nothing leaves your infrastructure |
| **One service for all your skills** | Multi-repo skill registry handles skills, plugins, and agents across different Git repos |

---

## Key Features

### 1. Zero-Intrusion Detection

SkillLoop uses each AI platform's **native hook system** — no skill code changes, no wrappers, no middleware. Install the adapter once, and every conversation is observed transparently.

### 2. Two-Path Analysis

When a correction is detected, SkillLoop prefers **local analysis** — spawning a background AI agent (Claude Code or Copilot CLI) on your machine. If no local CLI is available, it falls back to the server. Either way, you get the same result.

### 3. Smart Clustering

Similar issues from different users are grouped automatically using sentence embeddings. Duplicate PRs for the same underlying problem are prevented — the skill owner sees one clear PR, not a flood of noise.

### 4. Automatic PR Generation

When a cluster reaches the evidence threshold, SkillLoop fetches the current skill file, generates an improved version, and opens a Draft PR with the problem pattern, root cause, proposed diff, and evidence count.

### 5. Web Admin Dashboard

A built-in admin page for managing skill registries, server settings, correction patterns, and monitoring signals — no config files to edit inside containers.

---

## Quick Start

1. **Start the server** — `docker-compose up -d` (one command, one time)
2. **Install the adapter** — `pip install skillloop-client && skillloop-client install copilot --url http://your-server:8080`
3. **Use your AI skills as usual** — no changes to your workflow
4. **SkillLoop detects corrections** — when you say "no, that's wrong" or "try again", it captures the signal
5. **Review the PR** — when enough evidence accumulates, a Draft PR appears in your skill repo

---

## Download

| Component | Install | Requirements |
|-----------|---------|-------------|
| Server | `docker-compose up -d` | Docker, 500 MB RAM |
| Client (pip) | `pip install skillloop-client` | Python 3.10+ |
| Client (pipx) | `pipx install skillloop-client` | Python 3.10+ |

> The client package has **zero external dependencies** — pure Python stdlib.

### Supported AI Platforms

| Platform | Status | Hook Mechanism |
|----------|--------|----------------|
| Claude Code | ✅ Supported | `~/.claude/settings.json` → Stop hook |
| Copilot CLI | ✅ Supported | `~/.copilot/hooks/` → agentStop |
| VS Code Copilot Chat | ✅ Supported | Same config as Copilot CLI |
| Codex CLI | 📋 Planned | Phase 2 |
| Cursor | 📋 Planned | Phase 2 |

---

## Privacy & Data

- **All data stays on your infrastructure** — self-hosted server, local database, no cloud dependency
- **No account required** — no sign-up, no SaaS, no subscription
- **Session data is never stored on disk** by the client — streamed to the server on session end
- **LLM calls stay internal** — configure your own LLM endpoint (DashScope, OpenAI-compatible, or local model)

---

## Roadmap

SkillLoop is currently in **prototype** stage.

**What's available now:**
- Zero-intrusion hooks for Claude Code, Copilot CLI, and VS Code Copilot Chat
- Two-path architecture (local agent + server fallback)
- Correction detection with configurable regex patterns (Chinese + English)
- Issue extraction and clustering via LLM + embeddings
- Web dashboard and admin UI
- Multi-repo skill registry with scan-from-repo

**Coming soon:**
- Codex CLI, Cursor, and Cline adapters (Phase 2)
- Automatic PR generation with evidence-based diffs
- Auto-merge mode for high-confidence fixes
- GitLab and Gitea provider support

---

## Community & Support

- [Report an issue](https://github.com/KylinLabAI/kylin-skills/issues)
- [Read the documentation](docs/)
- [View the source code](https://github.com/KylinLabAI/kylin-skills)

---

<div align="center">

**Ready to let your skills heal themselves?**

[Get Started](#quick-start)

</div>
