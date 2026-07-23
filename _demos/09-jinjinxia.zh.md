---
layout: demo-article
title: "JinJinXia 精进匣 — 自我修复的 AI 技能"
date: 2026-07-19
category: development
lang: zh
slug: jinjinxia
logo: /assets/resources/jinjinxia/logo_256.png
permalink: /zh/demos/jinjinxia.html
tags: ["AI", "技能管理", "DevOps", "自动化"]
description: "JinJinXia 是一个自托管服务，通过检测修正信号并生成改进 PR，自动让团队的 AI 技能变得更好。"
demo_link: "#"
status: release
---

[English](/demos/jinjinxia.html)

# JinJinXia 精进匣 — 自我修复的 AI 技能

![JinJinXia Logo](/assets/resources/jinjinxia/logo_256.png)

**团队的 AI 技能每次被使用都会自动变得更好 —— 无需任何额外操作。**

## 问题

您的团队构建了一套 AI 技能库 —— 可复用的提示模板或代理工作流，用于代码审查、文档生成、SQL 分析等数十项任务。每个人都使用相同的技能，一致性很高。

但现实是：边界情况让技能失效，用户在对话中纠正 AI，每个人独立解决相同问题，没有路径将这些修复反馈到共享技能中。技能保持破损，技能应该如何工作与实际如何工作之间的差距不断扩大。

## 解决方案

JinJinXia 在 AI 代理的原生钩子系统中插入一个透明的观察层。它捕获对话消息，上传到自托管服务器，通过智能分析识别技能问题，跨用户聚类，并生成改进 Pull Request —— 无需修改任何技能代码。

您照常工作，技能自动变得更好。

## 核心价值

- **无需提交 Bug 即可改进技能** — JinJinXia 挂钩 AI 代理的原生事件系统，自动检测修正信号
- **团队无需改变工作流程** — 用户照常与 AI 对话，检测完全透明
- **准备合并的 PR，而非模糊报告** — 当 3+ 用户遇到同一问题时，JinJinXia 生成包含修复、根因和证据的 Draft PR
- **数据留在您的网络中** — 自托管服务器；可选本地 LLM 和嵌入，支持隔离部署

## 功能特性

### 零侵入检测

JinJinXia 使用每个 AI 平台的原生钩子系统 —— 无需修改技能代码、无需包装器、无需中间件。

### 支持的平台

JinJinXia 支持八种代理客户端：

| 代理 | 钩子位置 | 钩子类型 |
|-------|---------------|-----------|
| Claude Code | `~/.claude/hooks.json` | JSON 钩子 |
| Copilot CLI | `~/.copilot/hooks/jinjinxia.json` | JSON 钩子 |
| Codex | `~/.codex/hooks.json` | 与 Claude Code 兼容的 JSON 钩子 |
| Qoder | `~/.qoder/settings.json` | 与 Claude Code 兼容的 JSON 钩子 |
| TRAE | `~/.trae-cn/hooks.json` | 与 Claude Code 兼容的 JSON 钩子 |
| TRAE Work | `~/.trae-cn/hooks.json`（与 TRAE 共享） | 与 Claude Code 兼容的 JSON 钩子 |
| CodeBuddy | `~/.codebuddy/settings.json` | 与 Claude Code 兼容的 JSON 钩子 |
| OpenCode | `~/.config/opencode/plugins/jinjinxia.js` | JS 插件 |

Qoder Work 和 WorkBuddy 不受支持（无公开钩子系统）。

### 透明消息捕获

客户端是一个简单的消息上传器 —— 增量上传、非阻塞。所有智能都在服务器端。

### 离线缓冲

当服务器不可访问时，上传失败的消息会保存到本地离线缓冲区 `~/.jinjinxia/pending/{session_id}.json`。在下一次成功上传时，会先刷新待处理消息（与新消息合并），然后删除待处理文件 —— 服务器宕机期间不会丢失任何对话数据。

### 双路径分析

支持云端 LLM（默认）或服务器端 CLI Agent 模式进行会话分析。CLI 模式下，在服务器上安装 Copilot 或 Claude —— 分析代理可直接读取技能仓库，生成更贴合团队 AI 工具的解决方案。

### 智能聚类

使用嵌入向量相似度自动将不同用户的相似问题分组，防止重复 PR。

### 自动 PR 生成

当聚类达到证据阈值（默认：3 个用户）时，JinJinXia 生成包含修复、根因和证据的 Draft PR。

### 最佳实践知识库

每个已解决的问题都是一次学习机会 —— 自动捕获为 BestPractice 记录，包含修复前后摘录。

### 多仓库技能注册表

一台 JinJinXia 服务器可管理多个 Git 仓库中的所有技能，支持从仓库扫描。

### 标签式 Web UI

内置 Dashboard、最佳实践和设置页面 —— 无需外部前端框架。

## 快速开始

1. 启动服务器：`docker-compose up -d`
2. 安装客户端：`pip install jinjinxia-client`
3. 为您的 AI 平台安装钩子
4. 在 `http://<服务器>:8080/admin` 配置设置
5. 照常使用 AI 技能 —— 改进自动发生

## 隐私

- **所有数据留在您的基础设施内** — 自托管服务器、本地数据库、无云依赖
- **无需账户** — 无需注册、无需 SaaS、无需订阅
- **会话数据在会话结束时流式传输到服务器** — 仅当服务器不可访问时使用临时离线缓冲区，连接恢复后立即刷新
- **LLM 调用保持内部** — 配置您自己的 LLM 端点

## 状态

**当前状态：** v0.2.1 — 核心功能已发布。PyPI 客户端包和 Docker 服务端镜像可用。

## 链接

- [应用发布](https://gitee.com/KylinLab/JinJinXia-App)
- [演示文档](../demo/demo.zh.md)
- [联系我们](https://kylinlabai.github.io)
