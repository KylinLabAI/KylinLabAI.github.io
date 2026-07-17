---
layout: demo-article
title: "DouJia — Own Your AI Conversations"
date: 2026-06-09
category: development
lang: en
slug: doujia
logo: /assets/resources/douxia/logo_256.png
permalink: /demos/doujia.html
tags: ["Electron", "Vue", "AI", "Desktop"]
description: "A desktop app that turns your AI chat history into organized, searchable, exportable knowledge. Embed AI platforms, auto-capture conversations, and own your data."
demo_link: "#"
status: prototype
---

<div align="center">

# 🫛 DouJia — Own Your AI Conversations

**The desktop app that turns your AI chat history into organized, searchable, exportable knowledge.**

</div>

---

## The Problem

You've had hundreds of valuable conversations with AI assistants like Doubao and Qwen. But those insights are **trapped** inside the platform — you can't search across them, can't export them, can't organize them, and they could disappear at any time.

## The Solution

**DouJia** embeds your AI platform directly inside a native desktop app, captures every conversation automatically, and gives you full ownership of your knowledge.

---

## Core Value

| What You Get | How It Works |
|---|---|
| **Never lose a conversation** | Auto-capture saves every chat as you go |
| **Find anything instantly** | Full-text search across all your AI conversations |
| **Organize at scale** | Tags, AI-powered classification, topic clustering |
| **Export freely** | Markdown, HTML, PDF — your data, your format |
| **Extract knowledge** | AI summarization and knowledge card extraction |
| **Works offline** | All data stored locally in SQLite — no cloud dependency |

---

## Key Features

### 1. Embedded AI Chat + Auto-Capture

Use Doubao (or Qwen) directly inside DouJia. Every conversation is automatically captured and stored locally — no manual copying.

### 2. Full Conversation Management

Browse, search, filter, and manage all your conversations in one place. Filter by date, platform, status, or tags.

### 3. Smart Organization

- **AI Classification** — Automatically tag conversations by topic
- **Topic Clustering** — Group related conversations together
- **Knowledge Graph** — Visualize connections between topics

### 4. AI-Powered Knowledge Extraction

- **AI Summary** — Generate a concise summary of any conversation
- **Knowledge Cards** — Extract structured notes from one or multiple conversations
- **Smart Cleanup** — AI suggests which conversations to archive or delete

### 5. Export & Share

- Export as **Markdown**, **HTML**, or **PDF**
- Set a default export directory for one-click export
- **LAN Sharing** — Share your knowledge base with devices on the same network

### 6. Multi-Language Support

Full English and Chinese interface. Switch languages in Settings.

---

## Quick Start

1. **Download** the installer for your platform
2. **Install and launch** DouJia
3. **Start chatting** — your AI platform loads inside the app
4. **Click capture** (or enable auto-capture) to save conversations
5. **Browse, search, and organize** in the Knowledge Management tab

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop | Electron 33 |
| Frontend | Vue 3 + Element Plus |
| Database | SQLite (better-sqlite3) |
| AI Engine | Doubao API / Qwen API |
| Build | electron-vite + electron-builder |

---

## Privacy & Security

- **All data stored locally** — conversations never leave your machine
- **No telemetry** — the app doesn't phone home
- **Your API key, your control** — bring your own AI API key for smart features

---

<div align="center">

**Built with ❤️ for AI power users who value their knowledge.**

</div>
