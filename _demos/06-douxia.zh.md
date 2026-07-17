---
layout: demo-article
title: "豆匣 DouXia — 掌控你的 AI 对话"
date: 2026-07-16
category: development
lang: zh
slug: douxia
logo: /assets/resources/douxia/logo_256.png
permalink: /zh/demos/douxia.html
tags: ["AI", "知识管理", "效率工具", "桌面应用"]
description: "豆匣 DouXia 是一款桌面应用，将散落的 AI 对话整理为有序、可搜索、可导出的知识，所有数据保存在本地。"
demo_link: "#"
status: release
---

[English](/demos/douxia.html)

# 豆匣 DouXia — 掌控你的 AI 对话

![豆匣 Logo](/assets/resources/douxia/logo_256.png)

**将散落的 AI 对话整理为有序、可搜索、可导出知识的桌面应用。**

## 问题

您每天都在向 AI 助手提问几十个问题——编程难题、研究深挖、写作草稿、生活建议。几个月下来，您在豆包、元宝、DeepSeek、ChatGPT 等平台积累了数百条有价值的对话。但这些知识都被困住了：找不到、导不出、整理不了、清理不掉、也无法复用。AI 用得越多，情况越糟——您最有价值的见解散落在您无法掌控的各个平台。

## 解决方案

豆匣将 AI 平台直接内嵌于原生桌面应用中。您照常对话，豆匣悄然将每一条对话在本地捕获、存储并整理。可跨所有平台一键搜索、借助 AI 打标签与分类、导出为 Markdown 或 PDF，并在数秒内清理数百条对话。

## 核心价值

- **永不丢失对话** — 自动捕获实时将每条对话保存到本地 SQLite 数据库
- **瞬时找到任意内容** — 跨所有平台、所有 AI 对话的全文搜索（FTS5）
- **规模化整理** — AI 打标签、话题聚类与知识图谱可视化
- **离线可用** — 所有数据保存在本机，搜索、浏览、导出无需联网

## 功能特性

### 内嵌 AI 对话 + 自动捕获

在豆匣中直接使用豆包、元宝、DeepSeek 或 ChatGPT——体验与浏览器中使用完全一致。每条对话都会被自动捕获并本地存储。

### 统一对话管理

在一处浏览、搜索与筛选所有 AI 对话，不受来源平台限制。全文搜索（FTS5）可找到深藏于长对话中的答案。

### 智能整理

AI 自动打标签、话题聚类、知识图谱可视化及自定义标签管理，帮助您规模化整理对话。

### AI 知识抽取

通过 AI 摘要、知识卡片与智能清理推荐，将碎片化的问答转化为结构化知识。

### 灵活导出与分享

一键导出为 Markdown、HTML 或 PDF，并支持局域网分享，让同一网络内的其他设备通过浏览器浏览您的知识库。

### 多平台支持

支持豆包、元宝、DeepSeek、ChatGPT 的对话捕获与永久删除。

## 快速开始

1. 从 GitHub Releases 下载安装包
2. 运行安装程序并按提示操作
3. 启动豆匣
4. 选择偏好的 AI 平台并登录
5. 开始对话——默认自动捕获对话内容
6. 在“知识”标签页中搜索、筛选与整理

## 下载

访问 [应用发布页](https://github.com/KylinLabAI/DouXia-App/releases/latest) 获取最新安装包。

| 平台 | 下载 | 要求 |
|------|------|------|
| Windows (x64) | [最新版本](https://github.com/KylinLabAI/DouXia-App/releases/latest) | Windows 10+ |
| macOS (Apple Silicon) | [最新版本](https://github.com/KylinLabAI/DouXia-App/releases/latest) | macOS 11+ (M1/M2/M3/M4) |
| macOS (Intel) | [最新版本](https://github.com/KylinLabAI/DouXia-App/releases/latest) | macOS 11+ (Intel) |

## 隐私

您的数据始终留在本机。所有对话均以 SQLite 本地存储——绝不会上传到任何服务器。无需注册账号。智能功能（打标签、摘要、聚类）使用您自己的 API Key，由您决定使用哪个 AI 服务商以及何时使用。核心功能无需联网即可使用。

## 状态

**当前状态：** Release — 豆匣 v1.0.0 已稳定，支持 Windows 与 macOS。

## 相关链接

- [应用发布](https://github.com/KylinLabAI/DouXia-App)
- [联系我们](https://kylinlabai.github.io)
