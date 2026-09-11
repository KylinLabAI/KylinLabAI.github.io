---
layout: knowledge-article
title: AI Skill拆分原则——何时该把一个Skill拆成两个
subtitle: 3条铁律判断该不该拆，告别臃肿提示词
platform: github-pages
language: zh-CN
lang: zh
date: 2026-09-10T00:00:00.000Z
slug: ai-skill-splitting-principles
description: >
  Skill越写越臃肿？用3条铁律（职责单一、演进独立、加载干净）判断AI Skill该不该拆， 附反例分析、6条工程铁律与Skill vs
  Workflow分工指南。
keywords:
  - AI Skill拆分
  - 职责单一
  - 演进独立
  - 加载干净
  - 提示词工程
  - Agent工程
tags:
  - Skill设计
  - AI开发
  - 提示词工程
category: Tech
word_count: 3200
author: kylinlab.tech
permalink: /zh/knowledge/ai-skill-splitting-principles.html
published: true
excerpt: >
  Skill越写越臃肿，问题不在内容多少，而在结构设计。本文用3条铁律（职责单一、演进独立、 加载干净）帮你判断AI
  Skill是否需要拆分，附反例分析、6条工程铁律与Skill vs Workflow分工指南。
image: resources/cover-zh.jpg
toc: true
ghp_canonical_url: 'https://kylinlab.pages.dev/zh/knowledge/ai-skill-splitting-principles.html'
ghp_series: AI Skill 设计系列
---

# AI Skill拆分原则——何时该把一个Skill拆成两个

![封面图：AI Skill 拆分原则](/assets/resources/20260910-ai-skill-splitting-principles/cover-zh.jpg)

Skill越写越臃肿，是几乎所有把经验沉淀成AI技能的人都会撞上的墙。塞得越多，Agent加载时被无关信息干扰得越狠，改动一个地方还要连带改动另一个。

本篇教你把"该不该拆"变成一个可判断的决策，而不是拍脑袋。核心资产是一棵3条铁律的拆分决策树，外加一条从实战到沉淀的具体路径。

---

## 为什么一个Skill会越写越臃肿

一个架构类Skill同时产出技术栈方案（横向/策略层）和UI功能拆解（纵向/per-feature层）。职责混淆、演进耦合、可读性差，Agent加载时还会收到一堆无关信息干扰。

这就是典型的"把两类产物塞进同一个Skill"。

---

## 拆分决策框架：3条铁律

| 维度 | 问题 | 决策 |
|------|------|------|
| 职责是否单一 | 这个Skill是否只回答一类问题？ | 否 → 拆 |
| 演进是否独立 | 修改一方是否必然牵动另一方？ | 是 → 拆 |
| 加载是否干净 | Agent加载时会收到无关信息吗？ | 是 → 拆 |

**设计规则：** 职责单一、演进独立、加载干净，三者任一命中就拆；拆出来的Skill各回答一类问题。

下图是AI辅助完成一次Skill拆分决策的完整推理过程：

![AI辅助进行Skill拆分决策的完整推理过程](/assets/resources/20260910-ai-skill-splitting-principles/AI-Summary.png)

---

## 正例与反例对比

### 反例——把两个关注点不同的产物塞进同一个Skill

一个架构类Skill同时产出技术栈方案和UI功能拆解。问题：职责混淆、演进耦合、可读性差、加载时引入无关信息干扰。

### 正例——按关注点拆分为独立Skill

- **方案Skill（保持现状）：** 只回答framework / tech stack / execution strategy / quality gate这类策略问题。
- **新建规划Skill：** 深入设计稿，把功能拆成独立功能切片，引用方案Skill的策略来写用例。

**反例比正例更值钱**——看懂"塞两类产物"的坏处，就懂了拆分动机。

---

## 从零散经验到可复用Skill的路径

1. 连续3次以上向AI解释同一件事 → 标记为候选Skill
2. 把口头的约定写成markdown模板
3. 通过skill-manager或IDE配置注入到Agent运行时
4. 每次发现AI理解偏差 → 更新Skill而非临时补丁

---

## 6条工程铁律

| # | 铁律 | 落到你的Skill里 |
|---|------|-----------------|
| 1 | **触发描述要明确** | 在Skill开头写明"何时主动用"，否则AI不会触发 |
| 2 | **先建baseline再优化** | 改Skill前留一份旧效果数据，证明改后有收益 |
| 3 | **用断言验收而非形容词** | Skill末尾附3~5条可勾选断言，AI交付前自检 |
| 4 | **通用化避免过拟合** | 去掉项目专有名词，留"例外场景"，换项目也能用 |
| 5 | **能脚本化的别让AI推理** | 固定步骤写成脚本，AI只调度，省reasoning token |
| 6 | **单一事实源 + 渐进披露** | 通用规则只在一处定义，长文档用"参见X"折叠，别把全量塞进一个文件 |

背后是"单一事实源"原则：通用规则只在一处定义，Skill越臃肿越难维护——这条同样适用于你自己的文档组织。

---

## Skill与Workflow的分工

同样是为了减少复杂度、提高输出稳定性，但拆分的落点分两种资产，别混为一谈：

| | Skill | Workflow |
|---|---|---|
| 任务粒度 | 完成单一任务 | 组合多个Skill完成一个复杂的大任务 |
| 收益 | 控制粒度好、持续优化、减少复杂度、输出稳定 | 提高输出质量与稳定性 |
| 固化方式 | 本身即固化 | 同样要固化，才能持续优化 |

- **Skill**：只干一件事。粒度小才好控制、好持续优化，复杂度低、输出自然稳定。
- **Workflow**：把多个Skill组合起来打一场大仗——每个Skill各干各的活，组合顺序、交接、验收标准由Workflow固化。**Workflow本身也必须固化**，否则每次都是现场编排，质量和稳定性只能靠运气；固化之后，它和Skill一样可以持续优化。

一句话：**Skill管"单个动作稳"，Workflow管"整套流程稳"**——两者都要固化，也都要持续迭代。

---

## 复现要点

- [ ] 连续 3 次以上向 AI 解释同一件事 → 标记为候选 Skill
- [ ] 把口头的约定写成 markdown 模板
- [ ] 通过 skill-manager 或 IDE 配置注入到 Agent 运行时
- [ ] 每次发现 AI 理解偏差 → 更新 Skill 而非临时补丁
- [ ] 用 3 条铁律自查：我的每个 Skill 是否只回答一类问题？
- [ ] 复杂大任务 → 把多个 Skill 编排成 Workflow，并像 Skill 一样固化、持续优化

---

## 总结

1. **拆不拆有明确判据**——职责单一、演进独立、加载干净，命中即拆。
2. **反例比正例更值钱**——看懂"塞两类产物"的坏处，就懂了拆分动机。
3. **沉淀Skill有固定路径**——识别重复 → 提取模板 → 注入运行时 → 持续迭代。

下次你的Skill开始"什么都管"时，先拿3条铁律过一遍，多半就知道该动手拆了。
