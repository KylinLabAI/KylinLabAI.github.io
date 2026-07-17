---
layout: demo-article
title: "RecXia — AI-Powered Mock Interview Recording Management"
date: 2026-07-16
category: development
lang: en
slug: recxia
logo: /assets/resources/recxia/logo_256.png
permalink: /demos/recxia.html
tags: ["AI", "Education", "Interview", "Recording"]
description: "RecXia is an AI-powered mock interview recording management system for training institutions, enabling schedule-simulate-record-analyze-feedback closed loop."
demo_link: "#"
status: release
---

[中文介绍](/zh/demos/recxia.html)

# RecXia — AI-Powered Mock Interview Recording Management

![RecXia Logo](/assets/resources/recxia/logo_256.png)

**AI-powered mock interview recording management system for training institutions.**

## Problem

College entrance interview training institutions face challenges in managing mock interview sessions, recording student performances, providing timely feedback, and keeping parents informed. Traditional methods rely on manual note-taking and fragmented communication, leading to inconsistent training quality and poor parent engagement.

## Solution

RecXia provides a complete digital solution that covers the entire mock interview training workflow — from scheduling and recording to AI-powered analysis and parent feedback — all in one integrated platform.

## Core Value

- **Complete teaching closed loop**: Schedule → Simulate → Record → AI Analyze → Annotate → Distribute → Feedback → Improve
- **Multi-platform accessibility**: Web, desktop, Android, and mini-programs for every role
- **AI-enhanced feedback**: Automatic speech-to-text and intelligent evaluation accelerate feedback delivery

## Features

### Multi-Role Support

Five distinct roles with tailored interfaces: Administrator, Academic Affairs, Teacher, Student, and Parent.

### Cross-Platform Recording

Teachers can record mock interviews using desktop applications or Android apps, with automatic upload to the cloud.

### AI Analysis Pipeline

Videos are automatically processed by whisper.cpp for speech-to-text and Qwen API for intelligent content evaluation.

### Video Annotation

Teachers can add timeline annotations during or after recording, with visibility controls (public for parents, internal for teachers).

### Parent Mini-Programs

Parents receive notifications via WeChat or DingTalk and can view videos, AI transcripts, and teacher annotations.

## Quick Start

1. Install RecXia server and configure storage
2. Create administrator account and import users via Excel
3. Teachers download desktop or Android recording app
4. Parents access videos via WeChat mini-program

## Download

Visit the [App Release Page](https://gitee.com/KylinLab/RecXia-App/releases/latest) for the latest installers.

## Privacy

RecXia processes video and audio data for training purposes only. All data is stored according to the institution's chosen storage policy. Parent access is secured via signed URLs.

## Status

**Current Status:** Release — actively maintained and deployed in production.

## Links

- [App Releases](https://gitee.com/KylinLab/RecXia-App)
- [Contact](https://kylinlabai.github.io)
