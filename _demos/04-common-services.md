---
layout: demo-article
title: "CommonServices — One Backend for All Your Apps"
date: 2026-06-11
category: development
lang: en
slug: common-services
permalink: /demos/common-services.html
tags: ["Rust", "Axum", "PostgreSQL", "Vue", "Backend Platform", "Multi-Tenant", "Self-Hosted"]
description: "A self-hosted backend platform that gives every app you build user auth, licensing, feedback collection, file storage, and managed upgrades — out of the box."
demo_link: "#"
status: prototype
---

# 🛠️ CommonServices — One Backend for All Your Apps

**Stop rebuilding user login, licensing, and file storage for every project. Deploy once, connect everything.**

[Get Started](#quick-start) · [中文版](/zh/demos/common-services.html)

---

## The Problem

You're building your third side project this year, and you're writing the same backend code — again. User registration, password reset, JWT tokens, role-based permissions. Then file uploads, notification emails, license key management. Each project gets its own database, its own auth module, its own admin panel.

- **Wasted weekends** rebuilding login flows and permission systems you've already written before
- **Inconsistent security** because each project takes a slightly different shortcut on password hashing or token expiry
- **No visibility** across your apps — user data, feedback, and license keys scattered in separate databases with no unified view
- **Upgrade headaches** — when you release a new version, there's no built-in way to notify users or manage rollouts

You end up spending more time on infrastructure plumbing than on the features that make your app unique.

## The Solution

**CommonServices** is a self-hosted backend platform that provides the foundational services every app needs — authentication, licensing, feedback, file storage, notifications, and managed upgrades — through a single, unified API. You deploy it once on your own server, register each of your apps, and immediately get production-ready backend capabilities without writing another line of boilerplate.

---

## Core Value

| What You Get | How It Works |
|---|---|
| **One identity system for all your apps** | Users register once and access any app you build. OAuth with GitHub and WeChat is built in. |
| **License key management without third-party services** | Generate activation keys, bind to devices, set trial periods, and track usage — all from your own server. |
| **Customer feedback in one place** | Pull feedback from GitHub Issues, Gitee, and WeChat into a single dashboard with auto-reply and AI-powered duplicate detection. |
| **Managed app upgrades with staged rollouts** | Publish new versions, set rollout percentages, and let clients auto-check for updates — no custom update server needed. |
| **Per-app file storage and databases** | Each app gets isolated storage with quota management, provisioned automatically. |
| **Full audit trail** | Every action is logged with who, what, when, and where — time-partitioned for fast queries. |

---

## Key Features

### 1. Unified Authentication & User Management

One login system for all your apps. Users register with email/password or sign in with GitHub or WeChat. JWT-based sessions, Argon2 password hashing, personal access tokens with scoped permissions, and configurable refresh token expiry — all handled for you.

### 2. Software Licensing & Activation

Sell or distribute your apps with a built-in licensing engine. Define pricing plans, generate activation keys in bulk, bind licenses to specific machines, set trial periods (with offline grace), and manage the full lifecycle — trial, active, suspended, revoked — from the admin console or CLI.

### 3. Multi-Channel Feedback Collection

Connect GitHub Issues, Gitee, or WeChat Official Account as feedback channels. All feedback flows into one unified inbox where you can classify, reply, set up auto-reply rules (keyword, regex, or AI-based), and use AI aggregation to detect duplicate reports.

### 4. App Upgrade & Release Management

Create releases with version numbers, release notes, and per-platform packages (Windows, macOS, Linux, Android, iOS). Control rollout speed with percentage-based staged deployment. Clients call a single endpoint to check for updates — force-upgrade support included.

### 5. Multi-Tenant App Management

Register each app with its own slug, API credentials, team members, and role-based access (user, developer, admin). Each app gets isolated quotas for users, database storage, and file storage. Suspend, resume, or rotate credentials at any time.

### 6. Admin Console & CLI

A Vue 3 web console gives you dashboards, user management, license key generation, feedback triage, config editing, and audit log browsing — all in one place. The `csctl` CLI tool covers the same operations for scripting and automation.

---

## Quick Start

1. **Clone the repository** and copy `.env.example` to `.env`
2. **Start the infrastructure** — run `docker compose up -d postgres caddy` to launch PostgreSQL and Caddy
3. **Run database migrations** — execute `sqlx migrate run` to set up all schemas
4. **Start the API server** — run `cargo run -p server` to launch on port 8000
5. **Open the admin console** — `cd admin-console && npm install && npm run dev`, then register your first user and create an app

---

## Download

| Component | How to Get It | Requirements |
|-----------|--------------|--------------|
| API Server | [Source Code](#) | Rust stable, PostgreSQL 17 |
| Admin Console | [Source Code](#) | Node.js 18+ |
| CLI Tool | `cargo install --path crates/csctl` | Rust stable |
| Docker | `docker compose up` | Docker 24+, Docker Compose v2 |

> CommonServices is self-hosted. Clone the repository and deploy on your own server.

---

## Privacy & Data

- **Your data stays on your server** — CommonServices runs entirely on your own infrastructure. No external telemetry, no cloud dependencies.
- **No account required** — the platform itself requires no registration with any third-party service.
- **Full database control** — PostgreSQL with per-app schema isolation. You own every byte.

---

## Roadmap

CommonServices is currently in **prototype** stage.

**What's available now:**
- User authentication with JWT and OAuth (GitHub, WeChat)
- Multi-tenant app registration and management
- Software licensing with activation keys and device binding
- Multi-channel feedback collection and auto-reply
- App upgrade management with staged rollouts
- Certificate Authority (CA) and certificate lifecycle management
- Notification system (email, SMS, WeChat, in-app)
- Configuration management with feature flags
- Audit logging with time-partitioned storage
- Observability integration (Prometheus, Loki, Grafana)
- Admin console (Vue 3) and CLI tool (csctl)

**Coming soon:**
- Production deployment guides and Helm charts
- Plugin system for custom service modules
- SDK libraries for common client languages
- Enhanced analytics dashboards

---

## Community & Support

- [Report an issue](#)
- [Read the documentation](#)

---

**Ready to stop rebuilding backend infrastructure?** [Get Started](#quick-start)
