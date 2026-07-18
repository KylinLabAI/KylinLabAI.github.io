---
layout: knowledge-article
title: >-
  TRAE Sandbox File System Isolation: Why Your AI Assistant's Changes Never Hit
  the Disk
subtitle: >-
  A complete walkthrough of TRAE Work's VM sandbox architecture, three
  real-world debugging cases, and the clean division-of-labor workflow that
  actually works
platform: github-pages
language: en-US
lang: en
date: 2026-07-18T00:00:00.000Z
slug: trae-sandbox-file-system-isolation
description: >-
  TRAE Work runs inside a lightweight VM — only explicitly selected workspace
  folders sync to real disk. Everything else (configs, hooks, databases) stays
  trapped in the sandbox. Here's the architecture, the diagnostic playbook, and
  the fix.
keywords:
  - TRAE sandbox
  - file system isolation
  - AI coding assistant
  - VM architecture
  - Claude Code hooks
  - Copilot hooks
  - sandbox debugging
tags:
  - TRAE
  - AI Coding Assistant
  - Sandbox
  - Claude Code
  - Copilot
  - File System
  - Debugging
category: Tech
word_count: 0
author: kylinlab.tech
permalink: /knowledge/trae-sandbox-file-system-isolation.html
published: true
excerpt: >-
  TRAE Work runs in a lightweight VM where only workspace folders sync to real
  disk. AI tools always report sandbox state, making them useless for verifying
  real changes. Learn the architecture behind the isolation, a four-step
  diagnostic playbook, and the 'AI generates, you execute' workflow that
  prevents ghost changes.
image: ''
toc: true
ghp_canonical_url: 'https://kylinlab.tech/knowledge/trae-sandbox-file-system-isolation.html'
ghp_series: ''
ghp_disqus_shortname: ''
---

# TRAE Sandbox File System Isolation: Why Your AI Assistant's Changes Never Hit the Disk

> I asked my AI assistant to install a Copilot hook. It said "success." The Read tool confirmed the config was perfect. Then I opened the file on my real machine — and nothing had changed. This is the story of how I debugged it, what I learned about TRAE Work's VM architecture, and how to stop fighting the sandbox.

## Background: What I Was Building

I'm developing **JinJinXia** — an AI Coding Agent conversation collection and analytics platform. The architecture is straightforward: a client captures conversations through Claude Code and Copilot hooks, uploads them to a FastAPI server, and the server runs intelligent analysis.

My daily workflow with TRAE Work's AI assistant involved:

- Modifying the FastAPI server code (Python)
- Installing client hook configurations (`~/.claude/settings.json`, `~/.copilot/hooks/jinjinxia.json`)
- Restarting the uvicorn server
- Modifying the SQLite database (resetting user passwords)
- Running tests

The project lives at `C:\Users\kylin\dev\Workspace\JinJinXia\`, opened as the TRAE workspace. Everything appeared normal — until the first anomaly hit.

## The Problem: AI Said Success, But Nothing Changed

The first anomaly surfaced during hook installation. I asked the AI to run:

```bash
jinjinxia-client install copilot --url http://localhost:8080 --key jjx_xxx
```

It returned `Installed successfully`. The AI used its `Read` tool on `~/.copilot/hooks/jinjinxia.json` and displayed the content — `JINJINXIA_KEY` was present, the full exe path was there. Everything looked correct.

But when I opened the same file in VS Code, I saw the **old version** — no `JINJINXIA_KEY`, the hook command was a bare name instead of a full path.

My first thought: the `Read` tool must have a cache. I told the AI to "re-read without cache." Same result, of course.

Then more anomalies piled up:

### Anomaly 1: User Management Page Data Loss

I opened the JinJinXia Users page in my browser — the user list displayed correctly. I switched to the About page, then back to Users. The list was empty. The AI had modified the code (inside the workspace, so sync worked fine) and restarted the server to fix it. But the database password resets were never actually taking effect — because the AI was modifying a sandbox copy of the SQLite file, not the one the real server was reading.

### Anomaly 2: Claude Code Hook Configuration Went Missing

The AI ran `jinjinxia-client install claude-code` multiple times. Each time, `Read` showed hooks in `~/.claude/settings.json`. But when I typed `/hooks` in Claude Code — nothing. The root cause: Claude Code reads from a model-specific config file at `~/.claude/settings_json/deepseek/settings_deepseek.json`, which sits entirely outside the sandbox's reach. The AI was faithfully writing to a file Claude Code wasn't even using.

### Anomaly 3: Copilot Hook Command Not Found

The AI read `~/.copilot/hooks/jinjinxia.json` and displayed a powershell field with a full exe path. But VS Code's Copilot extension threw `jinjinxia-hook-copilot is not recognized`. Because VS Code reads from the real disk, where the file still contained the old bare command name.

## Diagnosis: How to Identify a Sandbox Problem

When you encounter an "AI says it changed but it didn't take effect" situation, follow this sequence:

1. **Open the same file in a real terminal** — run `type <path>` in PowerShell or open it with Notepad
2. **Compare content and modification time** — if the AI says "just wrote this" but the file timestamp is hours old, sandbox isolation is likely
3. **Check whether the path is inside the workspace** — files under `~/.claude/`, `~/.copilot/`, `AppData/`, database directories, etc. are outside the sync boundary
4. **Run the same command in a real terminal** — if the output differs or the file actually changes this time, the AI was only operating inside the sandbox

> The most critical insight: **The AI's Read and RunCommand tools always return "correct" results — because they read from the sandbox copy. Only verification in your real environment can reveal the discrepancy.**

## Root Cause: TRAE's Sandbox File System Isolation

TRAE Work operates inside a lightweight VM with its own file system:

```
Real disk:   C:\Users\kylin\.claude\settings.json
Sandbox VM:  C:\Users\kylin\AppData\Roaming\TRAE SOLO CN\VMCache\
             main-TRAE_SOLO-Yinli\drive\C\Users\kylin\.claude\settings.json
```

Only your selected **workspace folder** syncs to real disk through a sharing mechanism. All other paths are independent copies inside the sandbox.

| Path Scope | Synced to Real Disk? | Concrete Case |
|---|---|---|
| Project workspace (selected folder) | Yes | JinJinXia Python source changes synced normally |
| User config directory | No | `~/.claude/settings.json` — different content on each side |
| Agent platform hook directory | No | `~/.copilot/hooks/jinjinxia.json` — changes never landed |
| SQLite database | No | Password reset worked in sandbox but real server was unaffected |
| Python package install directory | No | `pip install` went to sandbox Python, not system Python |

## Solution: Clean Division of Labor

Once you understand the isolation mechanism, the workflow becomes clear:

**Let the AI handle (inside workspace):**

- Reading, writing, refactoring, and fixing project source code
- Running tests
- Starting the dev server (ports map to the host)
- Code search and static analysis

**Handle yourself (outside workspace):**

- Installing CLI tools (`pip install`, `npm install -g`)
- Modifying agent platform configs (Claude Code, Copilot hooks)
- Database operations (SQLite, Redis)
- Environment variables and system configuration

**Best practice: let the AI generate, you execute.** For example, have the AI produce the complete hook JSON config or installation command — then copy and run it in your own terminal. This leverages the AI's code generation ability while ensuring changes actually land on disk.

## How to Avoid the Trap

- **Open all folders the AI needs to modify as TRAE workspaces** — I later added `KylinContent` to the workspace, and blog drafts synced normally after that
- **When an operation targets a path outside the workspace, ask the AI to output the full command/config** — then paste and run it in your real terminal
- **Never use the AI's Read tool to "verify" changes outside the workspace** — it only verifies the sandbox copy
- **Document sandbox boundaries in your project README** — help teammates avoid the same confusion

## Summary

1. TRAE's sandbox VM only syncs **workspace folders** to real disk — all other paths are isolated inside the VM
2. When you encounter "AI says success but nothing changed," verify file content and modification time in a real terminal to quickly narrow down the cause
3. Clean division of labor: AI handles code changes inside the workspace, you handle configuration and installation operations outside it

This isolation mechanism isn't a bug — it's a clear architectural boundary. Once you understand the simple rule of "workspace folders sync, everything else is sandboxed," it stops being mysterious. The productivity gains from TRAE Work come not just from what you let the AI do, but from knowing exactly when to take the wheel back yourself.

What sandbox-related surprises have you encountered with AI coding assistants? Share your experience in the comments — I'd love to hear how you solved it.
