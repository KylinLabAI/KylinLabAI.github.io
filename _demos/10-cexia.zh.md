---
layout: demo-article
title: "策匣 CeXia — 智能 AI 任务协同调度平台"
date: 2026-08-04
category: development
lang: zh
slug: cexia
permalink: /zh/demos/cexia.html
tags: ["AI", "自动化", "任务管理", "Agent"]
description: "策匣 CeXia 是一个智能 AI 任务协同调度平台，实现虚拟一人公司的自主运营系统。"
logo: /assets/resources/cexia/logo_256.png
---

# 策匣 CeXia — 智能 AI 任务协同调度平台

[English](/demos/cexia.html)

![CeXia Logo](/assets/resources/cexia/logo_256.png)

## 运营你的虚拟一人公司

**策匣 CeXia** 是一个智能 AI 任务协同调度平台，让独立创始人以完整跨职能团队的方式运营 — 由 9 个专业化 AI Agent 7×24 小时驱动。

---

## 痛点

作为独立创始人，你需要同时处理产品规划、架构设计、开发、测试、运维、营销和行政工作。组建团队成本高、周期长。独自承担意味着你的时间成为瓶颈。

## 解决方案

CeXia 提供**虚拟一人公司**运营模式。你负责战略决策，一支由 9 个专业化 AI Agent 组成的团队处理所有日常执行工作：产品管理、架构设计、全栈开发、UI/UX、QA 测试、运维、营销和行政。

Agent 通过结构化任务记录通信 — 而非自由聊天 — 消除歧义和竞态条件。基于 SQLite 分布式锁的原子认领机制确保多个并行 Agent 永不会抢夺同一任务。

---

## 核心功能

### 9 人标准团队
预定义专业化角色：产品经理、架构师、全栈工程师、UI/UX、QA、运维、市场营销、行政、自动巡检哨兵。

### 可插拔任务引擎
通过单一配置切换任务后端（内置 SQLite、GitHub Projects V2、未来 Plane/Notion/Linear）— 无需重写 Agent 逻辑。

### 原子化任务认领
SQLite WAL 模式 + UNIQUE 约束防止并行 Agent 重复认领。巡检哨兵自动释放过期锁。

### Pull + Push 双模调度
REST Pull + WebSocket Push，自动降级。Agent 始终能获取下一个可用任务。

### 多 AI 客户端支持
Claude Code CLI、TRAE、OpenCode、Codex、Qoder — 为每个角色选择最佳 AI 客户端。

### Rust + Tauri v2 桌面客户端
CLI + GUI 管理工作实例。原生 macOS 应用，支持系统托盘。

---

## 快速开始

```bash
# 拉取控制中心 Docker 镜像
docker pull crpi-5w5kegfxurclu2lz.cn-hangzhou.personal.cr.aliyuncs.com/kylinlab2026/cexia-control-center:latest

# 运行
docker run -d --name cexia-control-center \
  -p 8080:8080 -p 8000:8000 \
  -v ~/cexia-data:/app/data \
  -e JWT_SECRET_KEY=your-random-secret-key \
  crpi-5w5kegfxurclu2lz.cn-hangzhou.personal.cr.aliyuncs.com/kylinlab2026/cexia-control-center:latest
```

打开 http://localhost:8080，使用 `admin` / `cexia123` 登录，即可开始运营你的虚拟公司。

---

## 下载

| 平台 | 链接 |
|------|------|
| macOS (DMG) | [最新版本](https://gitee.com/KylinLab/CeXia-App/releases/latest) |
| Docker | `docker pull crpi-5w5kegfxurclu2lz.cn-hangzhou.personal.cr.aliyuncs.com/kylinlab2026/cexia-control-center:latest` |
| 源码 | [Gitee](https://gitee.com/KylinLab/CeXia) |

[立即开始使用 CeXia →](https://gitee.com/KylinLab/CeXia-App/releases/latest)