---
layout: demo-article
title: "录匣 Recxia — AI 模拟面试录制管理系统"
date: 2026-07-16
category: development
lang: zh
slug: recxia
permalink: /zh/demos/recxia.html
tags: ["AI", "教育", "面试", "录制"]
description: "录匣 Recxia 是面向培训机构的 AI 驱动模拟面试录制管理系统，实现排序-模拟-录制-AI分析-反馈的完整教学闭环。"
demo_link: "#"
status: release
---

[English](/demos/recxia.html)

<div align="center">

# 录匣 Recxia — AI 模拟面试录制管理系统

![录匣 Logo](/assets/resources/recxia/logo_256.png)

**面向培训机构的 AI 驱动模拟面试录制管理系统。**

</div>

## 问题

高考面试培训机构在管理模拟面试场次、录制学员表现、提供及时反馈以及与家长沟通方面面临诸多挑战。传统方式依赖人工记录和碎片化沟通，导致培训质量不一致、家长参与度低。

## 解决方案

录匣提供完整的数字化解决方案，覆盖模拟面试培训的全流程——从排课、录制到 AI 智能分析和家长反馈——全部集成在一个平台中。

## 核心价值

- **完整教学闭环**：排序 → 模拟 → 录制 → AI 分析 → 批注 → 分发 → 反馈 → 改进
- **多平台覆盖**：Web、桌面端、Android、小程序，满足各角色需求
- **AI 增强反馈**：自动语音转文本与智能评测，加速反馈交付

## 功能特性

### 多角色支持

五大角色配备专属界面：管理员、教务、教师、学员、家长。

### 跨平台录制

教师可使用桌面应用或 Android App 录制模拟面试，视频自动上传云端。

### AI 分析流水线

视频自动经由 whisper.cpp 语音转文本，并通过 Qwen API 进行智能内容评测。

### 视频批注

教师可在录制中或录制后添加时间轴批注，支持可见性控制（家长可见或仅教师内部）。

### 家长小程序

家长通过微信或钉钉接收通知，可查看视频、AI 转录文本及教师批注。

## 快速开始

1. 安装录匣服务端并配置存储
2. 创建管理员账号，通过 Excel 导入用户
3. 教师下载桌面或 Android 录制应用
4. 家长通过微信小程序查看视频

## 下载

访问 [应用发布页](https://gitee.com/KylinLab/RecXia-App/releases/latest) 获取最新安装包。

## 隐私

录匣仅将视频和音频数据处理用于培训目的。所有数据按照机构选择的存储策略进行存储。家长访问通过签名 URL 保障安全。

## 状态

**当前状态：** Release — actively maintained and deployed in production.

## 相关链接

- [应用发布](https://gitee.com/KylinLab/RecXia-App)
- [联系我们](https://kylinlabai.github.io)
