---
layout: knowledge-article
title: Script-First：把重复决策固化成脚本，省下 AI 临场推理的 token
subtitle: 用「脚本层 + 调度层」两层划分，把固定流程交给确定性脚本、AI 只在异常时介入，同时拿到任务一致性与省 reasoning token 两份收益
platform: github-pages
language: zh-CN
lang: zh
date: 2026-08-28T00:00:00.000Z
slug: script-first-token-saving
description: >-
  固定步骤反复让 AI 临场推理是 reasoning token 的主要浪费源。本文给出脚本层 + 调度层划分、四条设计规则，以及用 summary.sh
  固化输出模板的实战写法，让重复任务的降本立竿见影。
keywords:
  - Script-First
  - AI 省 token
  - reasoning token
  - 脚本化
  - Agent 协作
tags:
  - AI 工程
  - 脚本化
  - 降本提效
  - Agent 协作
category: Tech
word_count: 1900
author: kylinlab.tech
permalink: ''
published: true
excerpt: >-
  固定步骤交给脚本，AI 只做异常调度——一致性提升、reasoning token 骤降。Script-First
  的本质是「确定性逻辑固化、临场推理只用于异常」。
toc: true
ghp_canonical_url: ''
ghp_series: AI 高性价比使用策略
ghp_disqus_shortname: ''
---

# Script-First：把重复决策固化成脚本，省下 AI 临场推理的 token

![Script-First：把重复决策固化成脚本，省下 AI 临场推理的 token](/assets/resources/20260828-script-first-token-saving/cover-zh.jpg)

> 一个最贴近钱包的原则：**能写成确定性脚本的，绝不让 AI 临场推理。** 固定流程交给脚本，AI 只做异常调度——一致性提升、reasoning token 骤降。

## 问题与背景：为什么每轮都在白烧 token

很多任务的**步骤是固定的**，但每次你都让 AI 重新理解、重新规划、重新推理——这部分 reasoning token 是纯浪费。你付的钱里，相当比例是"它又想了一遍本来不用想的东西"。

例如每次发版前要做的"检查未提交文件 + 跑 lint + 生成 changelog"，步骤永远一样，AI 却每轮从头推。这就是最该先优化的地方。

## 方案总览：脚本层 + 调度层

- **脚本层**：shell / py 脚本，覆盖固定步骤与确定逻辑（检查、格式化、跑测试）。
- **调度层**：AI，只在"异常 / 需要判断"时介入，如 lint 报错怎么修。
- **任务一致性**：脚本每次跑得一样，不会今天漏一步、明天多一步。
- **省 reasoning token**：AI 不再每轮重推流程，只处理脚本反馈的异常，账单 reasoning 占比骤降。

```
  固定任务/重复流程
        │
        ▼
  ┌──────────────┐
  │  脚本层(确定性) │  检查 · lint · changelog · 填模板
  └──────┬───────┘
         │ 结构化反馈 + 异常
         ▼
  ┌──────────────┐
  │  调度层(AI)    │  只消费反馈、只在异常时介入
  └──────────────┘
```

### 选型对比

| 选项 | 优点 | 缺点 | 适合 |
|------|------|------|------|
| 每次让 AI 从头推理 | 零脚本成本 | 每轮烧 reasoning token、步骤易漏 | 一次性任务 |
| 脚本层 + 调度层 | 一致、省 token | 需先写一次脚本 | 重复固定流程 |
| 全自动化（无 AI） | 最省 | 灵活度低，异常难处理 | 完全确定流程 |

## 四条设计规则

- **规则一**：能写成确定性脚本的固定步骤，绝不让 AI 临场推理。
- **规则二**：脚本负责确定性逻辑，AI 只在异常时介入，职责不重叠。
- **规则三**：新流程先固化脚本，再让 AI 以"跑脚本 + 修复报错"方式调度。
- **规则四（skill-creator 必加）**：写 skill 时把"Script-First"作为一条硬指南写进 SKILL.md——默认优先调用脚本/命令，而不是每次都让模型临场推理。

## 实战示例：用脚本固化"输出模板"

最能体现 Script-First 收益的两个场景：

**1. 用脚本生成 skill 的工作摘要（summary）。** 每次 skill 跑完要汇报"做了什么"，别让 AI 临场组织语言——它每轮措辞、结构、信息取舍都不一样，既烧 reasoning 又不统一。写一个 `summary.sh`：读结构化产物（改了哪些文件、跑了哪些命令、结果如何），按固定模板拼出摘要。AI 只负责调用它，输出格式与信息维度每次都一致。

**2. 用脚本定义"修复模板（fix template）"，别靠 AI 推理。** 同类问题（如 lint 报错、格式修正）的修复说明，若每次让 AI 推理怎么写，内容会漂移、前后不一致。改用脚本固化模板：定义好字段（文件、行号、原因、改法），再用脚本从工具输出自动填模板生成。结果就是固定格式的摘要 + 稳定一致的信息。

> 关键：模板由脚本生成，而非由 AI 临场总结。脚本保证"格式固定 + 信息一致"，把这部分推理彻底从账单里拿掉。

## 复现要点

- [ ] 挑一个常跑的重复固定流程，列出它的固定步骤。
- [ ] 把固定步骤写成脚本（如 `pre-publish.sh`，检查 + lint + changelog）。
- [ ] 让 AI 改为"跑脚本 + 只修复报错"，而非每次重新规划。
- [ ] 跑几次真实任务，对比 reasoning 占比与任务耗时。
- [ ] 记录一次"脚本 vs 纯对话"的账单差异。

## 总结与延伸阅读

1. 固定步骤交给脚本，AI 只做异常调度——一致性提升、reasoning token 骤降。
2. Script-First 的本质是"确定性逻辑固化、临场推理只用于异常"。
3. 从一行命令起步即可，让重复任务的省钱立竿见影。

完整打点清单与需求模板放在同系列草稿中；下一篇准备写《独立 Code Review 把质量成本前置》。喜欢的话可以通过 RSS 关注更新 📡。
