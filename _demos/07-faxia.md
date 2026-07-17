---
layout: demo-article
title: "FaXia — Publish Once, Reach Everywhere"
date: 2026-07-10
category: development
lang: en
slug: faxia
permalink: /demos/faxia.html
tags: ["blog", "publishing", "markdown", "cross-platform", "automation", "content-creator"]
description: "Write once in Markdown, publish to 11+ blogging platforms simultaneously. Open-source, local-first desktop app and CLI tool for content creators."
demo_link: "https://github.com/KylinLabAI/FaXia-App"
status: prototype
---

[中文介绍](/zh/demos/faxia.html)

# FaXia — Publish Once, Reach Everywhere

![FaXia Logo](/assets/resources/faxia/logo_256.png)

**Write once in Markdown, then publish to 11+ blogging platforms simultaneously — no more copying, pasting, and reformatting per site.**

---

## The Problem

You've just finished writing a great technical article. It's well-researched, the code samples are tested, and you're ready to share it with the world. But here's what happens next:

- You open **11 different browser tabs** — one for each platform you want to post on
- You manually **copy-paste** your article into each editor, adjusting formatting every time
- Images need to be **re-uploaded** to each platform separately — and you have to fix broken links
- **Chinese platforms need a Chinese version**, English platforms need an English version — you juggle two copies
- After an hour of clicking, you realize you **forgot one platform** and start the cycle again

The result? You either skip platforms and limit your reach, or you burn hours on busywork that should take seconds.

## The Solution

**FaXia** takes your single Markdown file and publishes it to every platform you've configured — all at once, in parallel. You focus on writing good content. FaXia handles the upload, the formatting conversions, the image hosting, and the platform-specific quirks.

Choose a comfortable workflow: run it from the terminal as a CLI tool, or point-and-click through the cross-platform desktop app. Either way, one action replaces hours of repetition.

---

## Core Value

| What You Get | How It Works |
|---|---|
| **Hours back every week** | Concurrent publishing to 11+ platforms in one command — what used to take an hour takes seconds |
| **Reach readers everywhere** | Native adapters for GitHub Pages, WeChat, Zhihu, Juejin, Toutiao, Weibo, Reddit, X/Twitter, Medium, Facebook, and LinkedIn |
| **Images Just Work™** | Automatic image upload per platform and URL rewriting — no broken images, no manual uploads |
| **Correct formatting, every time** | Smart Markdown-to-HTML conversion with syntax highlighting, tuned for each platform's editor quirks |
| **Safe preview before you commit** | Dry-run mode lets you validate credentials and preview behavior before anything goes live |
| **Your content, under your control** | Open-source, local-only tool. No cloud service, no account needed, no tracking |

---

## Key Features

### 1. Eleven Platforms, One Command

Publish to **GitHub Pages**, **WeChat Official Account**, **Zhihu**, **Juejin**, **Toutiao**, **Weibo**, **Reddit**, **X / Twitter**, **Medium**, **Facebook**, and **LinkedIn** — or pick just the ones you want with a simple flag. Each platform uses its native API (or a robust Playwright-based adapter when no official publish API exists).

<!-- Screenshot: Multi-platform publishing dashboard with platform toggles and progress indicators -->

### 2. Intelligent Image Handling

Local images in your Markdown are automatically uploaded to each platform's image hosting, then all image URLs in your article are rewritten to point to the correct host. Your code screenshots and diagrams look correct on every site — zero manual work.

<!-- Screenshot: Image upload pipeline with auto URL rewriting status -->

### 3. Smart Updates, Not Duplicates

FaXia remembers where each article was published. Re-run the publish command on an updated article, and it will **update the existing post** (on supported platforms) instead of creating a duplicate. Perfect for fixing typos and iterating.

### 4. Two Interfaces, One Engine

Prefer the command line? The `faxia` CLI gives you scripting, CI integration, and maximum control. Prefer a GUI? The Electron desktop app has a visual platform selector, credential manager, and live article preview. Both use the same shared publishing core under the hood.

<!-- Screenshot: Desktop app main interface showing platform selector and article preview -->

### 5. Platform-Specific Article Files

Different audiences need different tones and lengths. Point FaXia at an article directory with a `zhihu.zh.md` for Zhihu, a `medium.md` for Medium, a `wechat-official-account.zh.md` for WeChat — and each platform gets exactly the version you wrote for it.

### 6. Dry Run & Credential Check

Run `faxia check` to verify every platform credential is still valid before you publish. Use `--dry-run` to walk through the entire pipeline without actually posting anything. No surprises, no half-published articles.

---

## Quick Start

1. **Download** the installer for your platform or install via npm: `npm install -g faxia`
2. **Configure** your credentials: use the desktop app Settings panel, or create `~/.faxia/config.json`
3. **Prepare** your article: write in Markdown with optional frontmatter (title, tags, cover_image, summary)
4. **Publish** with one command: `faxia publish my-article.md` — or launch the desktop app and select your file
5. **Review results** — every platform shows a success/failure status with a direct link to the published post

---

## Download

| Platform | Download | Requirements |
|----------|----------|--------------|
| Windows | [Latest Release](https://github.com/KylinLabAI/FaXia-App/releases/latest) | Windows 10+ (x64) · Node.js 20+ (for CLI) |
| macOS | [Latest Release](https://github.com/KylinLabAI/FaXia-App/releases/latest) | macOS 11+ (Intel & Apple Silicon) · Node.js 20+ (for CLI) |
| Linux | [Latest Release](https://github.com/KylinLabAI/FaXia-App/releases/latest) | Ubuntu 20.04+ / Fedora 36+ (x64) · Node.js 20+ (for CLI) |

> Download links are available on the [GitHub Releases](https://github.com/KylinLabAI/FaXia-App/releases/latest) page. CLI usage works today via `npm install -g faxia`.

---

## Privacy & Data

- **Your credentials stay on your device** — tokens and cookies are stored in a local `.env` file or a local JSON config, never sent anywhere except directly to each platform's API
- **No cloud, no account, no tracking** — FaXia is a fully local tool. There is no server, no telemetry, and no analytics
- **Open source** — inspect, audit, and modify the code freely. MIT Licensed

---

## Roadmap

- [x] Publish to all 11 platforms (GitHub Pages, WeChat, Zhihu, Juejin, Toutiao, Weibo, Reddit, X/Twitter, Medium, Facebook, LinkedIn)
- [x] CLI interface (`faxia publish`, `faxia check`, `faxia login`)
- [x] Electron desktop app with platform selector and publish results
- [x] Concurrent publishing with per-platform error isolation
- [x] Publish history and auto-update of existing posts
- [x] Dry-run mode and credential validation
- [x] Article directory mode (platform-specific article files)
- [x] Automatic image upload and URL rewriting
- [x] Markdown to HTML with syntax highlighting
- [ ] Scheduled publishing (queue articles for a specific date/time)
- [ ] Article analytics dashboard (read counts across platforms)
- [ ] Templates & batch article management
- [ ] Plugin system for custom platform adapters
- [ ] Signed & notarized macOS/Windows binaries

---

## Community & Support

- [GitHub Repository](https://github.com/KylinLabAI/FaXia-App)
- [Report an Issue](https://github.com/KylinLabAI/FaXia-App/issues)
- [Platform Setup Guide](https://github.com/KylinLabAI/FaXia-App)
