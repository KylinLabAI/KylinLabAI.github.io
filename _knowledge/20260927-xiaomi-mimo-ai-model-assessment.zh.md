---
layout: knowledge-article
title: 小米 MiMo 大模型 v2.6 实测：两个工程任务评估
subtitle: 用 v2.6 Flash 跑通端到端功能与应用发布两个真实任务，记录成本、结果与仍待调优的局限
platform: github-pages
language: zh-CN
lang: zh
date: 2026-09-27T00:00:00.000Z
slug: xiaomi-mimo-ai-model-assessment
description: >-
  基于两个耗时数小时的真实工程任务实测小米 MiMo v2.6 Flash：成本（¥1.96/239 次/27.9M tokens 与 ¥0.68/83
  次/9.3M tokens）、结果，以及免费额度中途耗尽、自动审查残留次要问题等局限。
keywords:
  - 小米 MiMo
  - MiMo v2.6
  - AI 编程
  - 大模型实测
  - 工程实践
tags:
  - 小米 MiMo
  - 大模型
  - AI 编程
  - 工程实践
category: Tech
word_count: 1700
author: kylinlab.tech
permalink: /zh/knowledge/xiaomi-mimo-ai-model-assessment.html
published: true
excerpt: >-
  用小米 MiMo v2.6 Flash
  跑了端到端功能与应用发布两个真实工程任务，以可接受成本交付主要需求，但长任务会遇到免费额度当日耗尽，且自动审查会残留少量次要问题。
image: resources/cover-zh.jpg
toc: true
ghp_canonical_url: 'https://kylinlab.pages.dev/zh/knowledge/xiaomi-mimo-ai-model-assessment.html'
ghp_series: ''
ghp_disqus_shortname: ''
---

# 小米 MiMo 大模型 v2.6 实测：两个工程任务评估

![封面图：小米 MiMo 大模型——介绍与实测评估](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/cover-zh.jpg)

小米 MiMo 是一款大模型，我通过 **OpenCode** 智能体或**小米开放平台 API** 调用它。此前长期用免费 **OpenCode/MiMo v2.5** 生成博客初稿，连续数月稳定；v2.6 发布后试用免费 **v2.6 Flash** 并购买付费 API 额度。为做真实评估，我用 **OpenCode/MiMo-V2.6-flash** 跑了两个耗时数小时的工程任务。

## 任务一：端到端功能任务

主要功能完成，人工功能测试无功能性问题；3 轮自动代码审查后仍残留 **4 个 minor 问题**（审查上限设 3 轮，通常能清空，这次没有）。

![端到端功能任务最终报告：构建内容（DB 迁移、IPC 分组同步、抓取、UI 分组筛选、测试）+ 验证表全绿 + R1–R3 审查日志](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/e2e-feature-summary-1.jpg)

![端到端功能任务合规清单：3 轮审查处停止、PR 按规则未合并、披露 master 历史遗留失败](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/e2e-feature-summary-2.jpg)

![端到端功能任务人工测试指引：真实库运行 + 分步检查项](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/e2e-feature-summary-3.jpg)

成本：总消耗 **¥1.96**、**239 次**请求、**27,925,352 tokens**（mimo-v2.6-flash）。

![端到端功能任务用量明细：当期总消耗 ¥1.96](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/e2e-feature-cost-1.png)

![端到端功能任务请求次数：239 次，全部 mimo-v2.6-flash](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/e2e-feature-cost-2.png)

![端到端功能任务 Token 用量：27,925,352 tokens（mimo-v2.6-flash）](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/e2e-feature-cost-3.png)

## 任务二：应用发布任务

主要需求完成，唯一失误是**发布说明文本出问题**。

![应用发布任务 CI 结果：pipeline #7 全绿、release-* 因 -rc 正确跳过、6 产物 + tag v0.1.0-rc2 已交付](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/app-release-summary-1.png)

![应用发布任务发布说明事故复盘：git tag 完好但下游未读回，store 正文丢说明，3 轮审查未抓到](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/app-release-summary-2.jpg)

成本：总消耗 **¥0.68**、**83 次**请求（mimo-v2.6-flash 为主，少量 mimo-v2.6-pro）、**9,331,424 tokens**。

![应用发布任务用量明细：总消耗 ¥0.68](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/app-release-cost-1.png)

![应用发布任务请求次数：83 次（mimo-v2.6-flash 为主，少量 mimo-v2.6-pro）](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/app-release-cost-2.png)

![应用发布任务 Token 用量：9,331,424 tokens](/assets/resources/20260927-xiaomi-mimo-ai-model-assessment/app-release-cost-3.png)

## 评估结论

1. **MiMo 能扛住耗时数小时的大型工程任务**——端到端功能与应用发布基本完成。
2. **免费版可起步，但长任务有风险**——免费额度当日上限会让数小时任务中途“用量耗尽”而中断；繁重任务要付费 API。
3. **仍需调优 prompt、skill 与工作流**——自动审查残留的次要问题（含发布说明失误）说明配置有待调优，而非仅靠人工收尾。

两个任务均以**可接受成本**完成，残留次要问题仍需继续评估。
