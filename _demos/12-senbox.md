---
layout: demo-article
title: "SenBox — Stream Events to Any Notification Channel"
date: 2026-09-02
category: development
lang: en
slug: senbox
permalink: /demos/senbox.html
tags: ["notifications", "cli", "streaming", "devtools", "alerting"]
description: "SenBox: a streaming multi-channel notification gateway. One event format, one command, every destination — pipe a stream of events into Feishu alerts, exactly like grep."
demo_link: "https://github.com/KylinLabAI/SenBox-App"
status: release
logo: /assets/resources/senbox/logo_256.png
---

[中文介绍](/zh/demos/senbox.html)

# SenBox — Stream Events to Any Notification Channel

![SenBox Logo](/assets/resources/senbox/logo_256.png)

**Describe what happened once, in one vocabulary. SenBox decides how to deliver it to each destination, hides every per-channel difference, and answers with a single predictable result.**

---

## The Problem

Notification code is written once per team, per service and per channel. Feishu, WeChat Work, SMS, voice calls and WhatsApp each expect a different message shape, a different way to authenticate, and a different way to report failure. So every service, every operations script and every AI agent carries its own copy of "how to notify" — with the channel secret usually pasted in next to it.

And none of it composes. You can filter logs with `grep` and move files with `mv`, but you cannot pipe a stream of events into an alert the same way. Batch alerting, pipeline-triggered notification and unattended agent alerting all turn into custom programs.

## The Solution

**SenBox** is a Unix-native notification gateway that behaves like the tools already in your pipeline: one static binary, no runtime, no configuration file required, no interactive prompt — and it reads a stream on stdin, one event per line, dispatching as events arrive.

Core idea: **one event format → per-channel drivers → dispatch**

- Write the alert once; change only the destination name
- Pipe monitoring output, log lines or JSON events straight into notifications
- Secrets stay in the operating system's protected credential store — never in argv, never in env, never in files in your repo

---

## Core Value

| What You Get | How It Works |
|---|---|
| **One event format for every channel** | Write the alert once; change only the destination name |
| **Streaming by design** | `tail -f app.log \| sendx stream --channel feishu` dispatches as events arrive, exactly like `grep` |
| **Secrets stay in the OS keystore** | Read only from macOS Keychain, Windows Credential Manager, Linux Secret Service — never from the environment or repo files |
| **Built for unattended use** | No prompts, no windows, distinct exit codes and a machine-readable run summary, so CI jobs and AI agents can branch on the result |
| **Two forms, one core** | Use the `sendx` CLI, or embed the same core through a language-neutral C ABI (`libsenbox` + `senbox.h`) |
| **Cheap to extend** | A new destination is a self-contained driver; the event format, routing and result contract stay untouched |

---

## Key Features

### 1. One-Line Send

`sendx send --channel feishu "message"` — text or rich formatted output to any channel.

### 2. Streaming Dispatch

`... | sendx stream --channel feishu` — one event per line, plain text or JSON, dispatched as it arrives.

### 3. Unified Event Model

Severity, source, title, body, timestamp and labels — the same fields for every destination.

### 4. Severity Filtering

`--min-severity warn` drops everything below the threshold before dispatch.

### 5. Routing Rules

Declare once which severities and sources go where; callers stop repeating routing decisions. Fan-out sends one event to several destinations with one combined answer.

### 6. Faithful Dry Run

`--dry-run` parses, filters and routes without delivering — safe to validate rules in production.

### 7. Feishu Channel

Group robot delivery, text and interactive card, signature computed automatically when the robot requires one. Retry with exponential back-off on transient failures, a hard time limit per attempt.

### 8. Result Contract

Distinct exit codes for full success, partial success and total failure, plus a `senbox.run_summary/v1` JSON record on every run.

### 9. Self-Check

`sendx doctor` verifies destination address, secret availability and reachability without messaging a real group.

### 10. Embeddable Core

C ABI library (`libsenbox`) with a stable `senbox.h` header for embedding in any language.

---

## Quick Start

```bash
# 1. Point SenBox at your Feishu group robot (non-secret, so env is fine)
export SENDX_FEISHU_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/xxxx"

# 2. Store the robot's sign secret once, in the OS keystore (never in a file)
sendx secret set feishu_bot_secret

# 3. Send
sendx send --channel feishu --severity error \
  --source payment-api "Checkout latency above SLO"

# 4. Or stream — dispatch every warning-or-worse line as it appears
tail -f /var/log/app.log | sendx stream --channel feishu --min-severity warn

# 5. Verify wiring without messaging anyone
sendx doctor --channel feishu
```

---

## Download

| Platform | Download | Requirements |
|----------|----------|--------------|
| Windows | [Latest Release](https://github.com/KylinLabAI/SenBox-App/releases/latest) | Windows 10+ (x64) |
| macOS | [Latest Release](https://github.com/KylinLabAI/SenBox-App/releases/latest) | macOS 11+ (Intel & Apple Silicon) |
| Linux | [Latest Release](https://github.com/KylinLabAI/SenBox-App/releases/latest) | Ubuntu 20.04+ (x64) |

> Chinese users can download from [Gitee Releases](https://gitee.com/KylinLab/SenBox-App/releases/latest).

Each release ships static `senbox-<target>-<os>.tar.gz` archives. Download one file, unpack, run — no dependencies, no install steps.

---

## Privacy

- **No telemetry, no analytics** — SenBox talks to exactly one place: the notification channel you name
- **Secrets never leave the keystore** — channel secrets are read from the OS protected credential store and never written to disk, never placed in the environment, and never printed — not in logs, not in errors, not in the JSON summary
- **Memory only for delivery** — event content is held in memory only as long as delivery takes; SenBox keeps no local history in V1.0

---

## Status

v1.0.0 Released — core engine, `sendx` CLI, and `senbox-ffi` C SDK are feature-complete, hardened (10 security tests, full E2E suite), and release-tested across Linux, macOS and Windows.
