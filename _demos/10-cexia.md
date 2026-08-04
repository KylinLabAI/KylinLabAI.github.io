---
layout: demo-article
title: "CeXia — Intelligent AI Task Collaboration & Scheduling Platform"
date: 2026-08-04
category: development
lang: en
slug: cexia
permalink: /demos/cexia.html
tags: ["AI", "Automation", "Task Management", "Agent"]
description: "CeXia is an intelligent AI task collaboration and scheduling platform that implements a virtual one-person company autonomous operating model."
logo: /assets/resources/cexia/logo_256.png
---

# CeXia — Intelligent AI Task Collaboration & Scheduling Platform

[中文介绍](/zh/demos/cexia.html)

![CeXia Logo](/assets/resources/cexia/logo_256.png)

## Run Your Virtual One-Person Company

**CeXia** (策匣) is an intelligent AI task collaboration and scheduling platform that lets a solo founder operate like a full cross-functional team — powered by 9 specialized AI agents working 24/7.

---

## The Problem

As a solo founder, you handle product planning, architecture, development, QA, operations, marketing, and administration — all at once. Hiring a team is expensive and slow. Going alone means you're bottlenecked by your own time.

## The Solution

CeXia provides a **Virtual One-Person Company** operating model. You stay in the strategy seat. A team of 9 specialized AI agents handles all daily execution: product management, architecture design, full-stack development, UI/UX, QA testing, operations, marketing, and administration.

The agents communicate through structured task records — not free-form chat — eliminating ambiguity and race conditions. An atomic claiming mechanism with SQLite-backed distributed locks ensures multiple parallel agents never collide on the same work.

---

## Key Features

### 9-Agent Standard Team
Pre-defined specialized roles: Product Manager, Architect, Full-Stack Engineer, UI/UX, QA, Operations, Marketing, Admin, Auto-Sentinel.

### Pluggable Task Engine
Swap task backends (Built-In SQLite, GitHub Projects V2, future Plane/Notion/Linear) via a single config flag — zero agent rewrites needed.

### Atomic Task Claiming
SQLite WAL mode with UNIQUE constraints prevents duplicate assignments across parallel agents. Stale locks are auto-released by the Sentinel.

### Pull + Push Dispatch
REST Pull + WebSocket Push with automatic fallback. Agents always get the next available task.

### Multi-AI Client Support
Claude Code CLI, TRAE, OpenCode, Codex, Qoder — choose the AI client that works best for each role.

### Rust + Tauri v2 Desktop Client
CLI + GUI for managing work instances. Native macOS application with system tray support.

---

## Getting Started

```bash
# Pull the Control Center Docker image
docker pull ghcr.io/kylinlabai/cexia-control-center:latest

# Run it
docker run -d --name cexia-control-center \
  -p 8080:8080 -p 8000:8000 \
  -v ~/cexia-data:/app/data \
  -e JWT_SECRET_KEY=your-random-secret-key \
  ghcr.io/kylinlabai/cexia-control-center:latest
```

Open http://localhost:8080, log in with `admin` / `cexia123`, and you're ready to run your virtual company.

---

## Download

| Platform | Link |
|----------|------|
| macOS (DMG) | [Latest Release](https://github.com/KylinLabAI/CeXia-App/releases/latest) |
| Docker | `docker pull ghcr.io/kylinlabai/cexia-control-center:latest` |
| Source | [Gitee](https://gitee.com/KylinLab/CeXia) |

[Get Started with CeXia →](https://github.com/KylinLabAI/CeXia-App/releases/latest)