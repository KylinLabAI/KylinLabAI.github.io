---
layout: demo-article
title: "ZhiXia — One Command for Every AI Agent CLI"
date: 2026-09-02
category: development
lang: en
slug: zhixia
permalink: /demos/zhixia.html
tags: ["ai", "cli", "automation", "devtools", "proxy"]
description: "ZhiXia: a lightweight AI-Agent CLI proxy bridge that drives all major AI CLIs with one unified set of parameters, in forced non-interactive mode."
demo_link: "https://github.com/KylinLabAI/ZhiXia-App"
status: release
logo: /assets/resources/zhixia/logo_256.png
---

[中文介绍](/zh/demos/zhixia.html)

# ZhiXia — One Command for Every AI Agent CLI

![ZhiXia Logo](/assets/resources/zhixia/logo_256.png)

**Describe a task once with one set of unified parameters — ZhiXia translates it into the native invocation of your AI CLI and runs it fully unattended in forced non-interactive mode.**

---

## The Problem

Every code AI agent CLI has its own argument system, its own interaction model, and its own silent-run configuration. ClaudeCode-CLI, TRAE-CLI, OpenCode-CLI, Codex-CLI, Qoder-CLI, CodeBuddy-CLI — they all differ.

For developers who need automation and batch scheduling, this means:

- No single generic command can drive different AI tools
- AI capabilities can't be wired into CI/CD pipelines
- Every new tool means re-learning parameters and rewriting scripts
- Automation cost grows linearly with the number of tools

## The Solution

**ZhiXia** acts as a lightweight proxy bridge layer that gives every AI Agent CLI a unified input standard. You learn one command; ZhiXia internally translates it into each tool's native parameters for fully automatic, non-interactive execution.

Core idea: **unified abstraction → driver mapping → verbatim passthrough**

- Upward: clean, consistent task instruction parameters
- Downward: adapts to each vendor CLI's differentiated implementation
- Complete passthrough of stdin/stdout and exit codes — transparent behavior

---

## Core Value

| What You Get | How It Works |
|---|---|
| **Zero learning cost** | One set of command parameters covers all major AI CLIs — no more per-tool documentation |
| **Automation-friendly** | Forced non-interactive mode disables all human prompts; embed directly in CI/CD, batch scheduling, and smart pipelines |
| **Out of the box** | Single static binary, zero config, zero dependencies — feels like a system tool (`grep`, `cp`) |

---

## Key Features

### 1. Unified Parameter Abstraction

Encapsulates common task description, working directory, model selection, timeout, and read/write permissions into one consistent set of parameters — write once, run everywhere.

### 2. Multi-Driver Adaptation

Built-in driver mappings for ClaudeCode-CLI, TRAE-CLI, OpenCode-CLI, Codex-CLI, Qoder-CLI, and CodeBuddy-CLI, automatically translated to each tool's native arguments.

### 3. Forced Non-Interactive Mode

Automatically sets each CLI's silent-run environment variables and flags (e.g. `CLAUDE_CODE_NON_INTERACTIVE=1`, `TRAE_HEADLESS=true`) so tasks run 100% unattended in automation scenarios.

### 4. Raw Argument Passthrough

When the unified abstraction can't cover a tool's special features, pass native arguments directly with `--raw-args` — compatible with all edge cases.

### 5. Standard Stream & Exit-Code Passthrough

stdin/stdout/stderr are passed through completely and exit codes are inherited unchanged, so upstream scheduling systems can reliably judge task results.

---

## Quick Start

1. Install at least one target AI CLI (ClaudeCode-CLI, TRAE-CLI, OpenCode-CLI, Codex-CLI, Qoder-CLI, or CodeBuddy-CLI)
2. Download the `zhixia-*` binary for your platform from the release page
3. Put it on your `$PATH` and rename it to `zhixia`
4. Run:

```bash
zhixia --tool claude --prompt "重构 src/auth 登录逻辑"
zhixia --tool codex --model gpt-4o --prompt "生成单元测试" --work-dir ./src
```

---

## Download

| Platform | Download | Requirements |
|----------|----------|--------------|
| Windows | [Latest Release](https://github.com/KylinLabAI/ZhiXia-App/releases/latest) | Windows 10+ (x64) |
| macOS | [Latest Release](https://github.com/KylinLabAI/ZhiXia-App/releases/latest) | macOS 11+ (Intel & Apple Silicon) |
| Linux | [Latest Release](https://github.com/KylinLabAI/ZhiXia-App/releases/latest) | Ubuntu 20.04+ / Fedora 36+ (x64) |

> Chinese users can download from [Gitee Releases](https://gitee.com/KylinLab/ZhiXia-App/releases/latest).

---

## Privacy

- **Fully local** — ZhiXia does not collect or upload any user data
- **No network** — all AI tasks run in your local environment with the tool you choose; ZhiXia itself never accesses the network or sends data to any third-party service

---

## Status

v0.1.0 Released — production-ready and actively maintained.
