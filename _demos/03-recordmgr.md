---
layout: demo-article
title: "RecordMgr — Mock Interview Recording & Feedback Platform"
date: 2026-06-11
category: education
lang: en
slug: recordmgr
permalink: /demos/recordmgr.html
tags: ["Education", "Video Recording", "AI", "Vue", "Spring Boot", "Docker"]
description: "A mock interview recording platform for college entrance exam prep. Record, AI-analyze, annotate, and securely distribute videos to parents."
demo_link: "#"
status: prototype
---

# 🎬 RecordMgr — Mock Interview Recording & Feedback Platform

**From scheduling to feedback — one platform for the complete mock interview workflow.**

[Download for PC](#download) · [Download for Android](#download) · [中文版](/zh/demos/recordmgr.html)

---

## The Problem

You run a training center that prepares high school students for college entrance exam interviews. Mock interviews are the heart of your program — students practice, teachers correct, parents track progress. But the logistics are wearing you down:

- **No systematic recording** — interviews happen in classrooms with phones propped up on desks. Teachers juggle between teaching and managing recordings.
- **Videos pile up with no structure** — after a day of mock interviews, you have dozens of video files with cryptic names. Finding a specific student's recording from last month takes longer than watching it.
- **Parents are left in the dark** — they want to see their child's progress, but sharing videos means uploading to generic cloud drives, copying links, and hoping the right parent sees the right video — without accidentally exposing another student's recording.
- **Feedback doesn't stick** — teachers give verbal feedback during the session, but students forget half of it by the time they get home. There's no way to tie feedback to specific moments in the recording.
- **No insight from all that video** — every recording contains valuable data about speaking pace, logical structure, and content quality, but manually analyzing each one is impossible at scale.

---

## The Solution

**RecordMgr** turns the chaotic mock interview workflow into a streamlined, end-to-end pipeline: schedule sessions → record → get AI-powered analysis → annotate → distribute to parents — all from one platform.

Teachers record with a dedicated desktop app or Android phone. Videos upload automatically. AI transcribes the speech and generates structured feedback on pronunciation, logic, and content quality. Teachers add time-stamped annotations. Parents receive a secure link via WeChat or DingTalk and watch their child's video — with teacher notes and AI insights — right in their browser. No extra apps, no confusing file shares.

---

## Core Value

| What You Get | How It Works |
|---|---|
| **A complete teaching loop** | Schedule sessions, record in order, annotate, distribute, and get parent feedback — every step connected, nothing falls through the cracks. |
| **AI that saves teachers hours** | Automatic speech-to-text and multi-dimension analysis (pacing, logic, content quality, improvement suggestions) for every recording. |
| **Privacy by design** | Parents can only see their own child's videos. Each shared link is cryptographically signed and time-limited. |
| **Works everywhere that matters** | Teachers use a PC desktop app or Android phone. Parents just tap a WeChat or DingTalk link — works in a browser, no install needed. |
| **One-click deployment** | The entire platform ships as Docker containers. Deploy to a single cloud server in minutes. |
| **Grows with your business** | Start with local disk storage (zero extra cost). When you scale, switch to cloud object storage with a config change — no code rewrite. |

---

## Key Features

### 1. Smart Session Scheduling

Create a mock interview session for any class. Drag and drop to arrange the student order, or randomize with one click. Track progress at a glance — "5 of 20 completed." If a student is late or absent, skip or reorder on the fly without restarting the session.

### 2. Reliable Recording (PC + Android)

Record with a purpose-built desktop app (Windows/macOS) for stable, high-quality classroom capture, or use the Android app for flexibility on the go. Pause, resume, or cancel anytime. Videos upload in the background — finish one recording and move straight to the next student with zero wait.

### 3. AI-Powered Analysis

Once a video uploads, the AI pipeline kicks in automatically: extract audio → transcribe speech to text (with subtitles) → analyze pacing, logical structure, content quality, and generate specific improvement suggestions. Teachers review, edit, or remove AI annotations before sharing with parents.

### 4. Timeline Annotations

Teachers add time-stamped text or voice notes directly on the video timeline — during the mock interview or afterward. Mark each annotation as "public" (visible to parents) or "internal" (teacher-only). Parents see exactly which feedback applies to which moment in the recording.

### 5. Secure Distribution to Parents

When a video is ready and annotated, the teacher approves and triggers distribution. The system matches the student to their parent's account, generates a signed, time-limited access URL, and sends it via WeChat or DingTalk. Parents tap the link, verify their identity, and watch — with teacher annotations, AI insights, and optional subtitles. They can also download the video for offline viewing.

### 6. Batch Data Import

Getting started with hundreds of students? Upload an Excel spreadsheet with users, classes, students, and parents. Preview and validate before importing — everything goes in as one atomic transaction, or nothing does. Download a blank template from the admin panel to get the format right.

---

## Quick Start

1. **Deploy the platform** — `docker-compose up -d` on your cloud server and you're live in minutes
2. **Create accounts** — add teachers and registrars, or batch-import from an Excel spreadsheet
3. **Set up classes and students** — registrars create classes, enroll students, and link parent contacts
4. **Run a mock interview session** — teachers create a session, arrange the student order, and start recording with the desktop or Android app
5. **Annotate and distribute** — after recording, teachers review AI insights, add their own notes, and send the video to parents with one click

---

## Download

| Platform | Download | Requirements |
|----------|----------|--------------|
| Windows (Desktop App) | [RecordMgr-Setup.exe](#) | Windows 10+ (x64) |
| macOS (Desktop App) | [RecordMgr.dmg](#) | macOS 11+ (Intel & Apple Silicon) |
| Android (Teacher App) | [Download APK](#) | Android 10+ |
| Web (Management) | [Open Admin Panel](#) | Modern browser (Chrome, Edge, Safari) |
| Parents (H5 / Mini Program) | Via WeChat or DingTalk link | Any modern mobile browser |

> Download links will be available after the first release build.

---

## Privacy & Data

- **Your data stays on your server** — all videos, transcripts, and annotations are stored on the infrastructure you control. No third-party cloud services required for storage.
- **Strict access isolation** — parents can only view videos linked to their own child. Every distribution link is cryptographically signed with an expiration time.
- **On-server AI processing** — speech-to-text conversion runs locally on your server. Voice data never leaves your machine. Only the transcribed text (a few kilobytes) is sent for content analysis — the audio stays private.
- **No parent accounts required** — parents access videos through secure one-time links. No registration, no password to remember.

---

## Roadmap

RecordMgr is currently in **prototype** stage — actively being developed toward an MVP release.

**What's available now:**
- Core platform backend with secure user authentication
- Teacher web management interface (classes, students, sessions, video management)
- Parent H5 video player
- Desktop recording application for Windows and macOS
- One-click deployment to any cloud server

**Coming in MVP (Phase 1):**
- Android teacher recording app
- Session ordering with drag-and-drop
- Video upload and local storage
- Parent self-registration (phone / WeChat / DingTalk)
- Registrar management (enrollment, payment status, class assignment)

**Coming in Phase 2:**
- AI-powered annotation pipeline (automatic speech analysis and feedback)
- Teacher timeline annotations on video
- Secure video distribution with signed, time-limited URLs
- Multi-channel parent notifications (WeChat and DingTalk)

**Coming later:**
- AI annotation quality improvements
- Storage upgrade path to cloud object storage for larger scale
- Parent viewing analytics
- Session data export and review reports

---

## Community & Support

- [Report an issue](https://gitee.com/KylinLab) — Found a bug or have a feature request?
- [Read the documentation](./) — Full technical design, API reference, and user manual.
- [Join the discussion](https://gitee.com/KylinLab) — Questions, feedback, or want to contribute?

---

**Ready to streamline your mock interview workflow?**

[Download Now](#download)
