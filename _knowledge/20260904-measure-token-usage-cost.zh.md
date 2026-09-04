---
layout: knowledge-article
title: 算清你的 AI 用量与成本：本地日志 + 平台账单两种实测法
subtitle: 用两个开源 skill 把真实 token 用量与成本测出来：本地日志出构成明细，平台账单出真实扣费，并避开跨平台比价的单位陷阱
platform: github-pages
language: zh-CN
lang: zh
date: 2026-09-04T00:00:00.000Z
slug: measure-token-usage-cost
description: >-
  定价只是单价，不等于你被扣了多少。本文给出两条可复现实测路线：扫本地 session 日志出 per-agent / per-model
  明细，抓平台账单出真实扣费，并讲清积分与人民币的单位陷阱。
keywords:
  - AI 用量统计
  - token 成本
  - ai-token-usage
  - ai-usage-report
  - BYOK
  - 单位折算
tags:
  - AI 工程
  - 成本度量
  - 开源 Skill
category: Tech
word_count: 2700
author: kylinlab.tech
permalink: /zh/knowledge/measure-token-usage-cost.html
published: true
excerpt: >-
  定价只是单价，不是你被扣了多少。两个开源 skill 从本地日志与平台账单两侧把真实 token 用量与成本测出来：本地有 session
  日志的扫日志出构成明细，服务端记账的抓平台账单出真实扣费，BYOK 与粗账平台需要两块拼。跨平台比价前必须统一折算单位，积分与人民币不能直接相加。
image: /assets/img/covers/measure-token-usage-cost.png
toc: true
ghp_canonical_url: 'https://kylinlab.pages.dev/zh/knowledge/measure-token-usage-cost.html'
ghp_series: AI 高性价比使用策略
ghp_disqus_shortname: ''
---

# 算清你的 AI 用量与成本：本地日志 + 平台账单两种实测法

![封面图：算清你的 AI 用量与成本——本地日志与平台账单两条实测路线](/assets/resources/20260904-measure-token-usage-cost/cover-zh.jpg)

很多人算 AI 账，只算到「这个模型每千 token 多少钱」。可你真正花了多少，从来没被亲眼看见过：你以为贵在模型，其实是某个客户端每天悄悄烧掉的上下文；你以为省钱了，其实 Top 模型占比早变了，只是你没测。定价是**单价**，不等于你被扣了多少——这篇给出两条能立刻跑通的实测路线。

## 一、选路的分界：数据在哪、细不细

两条路线不是按「客户端 vs 平台」二分的。同一笔消耗，可能账记在平台、明细只在本地；也可能本地根本没留记录。判断标准是两件事：**数据存在哪、细到什么程度**。

| 场景 | 代表工具 | 数据在哪 | 粒度 | 该走哪条 |
|------|----------|----------|------|----------|
| 服务端记账，本地无 token 明细 | Qoder、CodeBuddy、TRAE、CloudCode | 平台服务端 | 只有平台账单 | `ai-usage-report`（唯一来源） |
| 本地有完整 session 日志 | Copilot、Codex、Claude Code、OpenCode | 本机 JSONL / SQLite | per-agent / model / session / 天 | `ai-token-usage`（离线明细） |
| 平台有账单但只有粗汇总 | DeepSeek 控制台 + 本地客户端 | 扣费在平台，明细在本地 | 平台按天，本地到会话 | 两块拼着看 |

三种情况对号入座：

- **只泡 IDE 平台**：本地没有任何可读的 token 记录，平台账单是唯一来源；
- **本地客户端 + 自配 API（BYOK，Bring Your Own Key）**：客户端厂商的账单页没有你的数据，API 厂商只有按天汇总，本机日志是唯一能把钱归到 agent 和会话的来源；
- **平台账太粗（如 DeepSeek）**：平台账单回答「真实扣了多少」，本地日志回答「花在哪」，两块都要。

## 二、路线一：扫本地日志（`ai-token-usage`）

读本机 session 日志，离线算出用量与成本估算，不用登录任何后台。它把各家字段统一成 `input_tokens` / `output_tokens`，按 agent、model、天汇总，也能显示当前会话的上下文占用。

![ai-token-usage 报告摘要：8 月范围，总 1.4B token / 14,700 turns / 204 sessions / 估约 ¥813.16](/assets/resources/20260904-measure-token-usage-cost/route1-ai-token-usage-summary.png)

> 成本口径：摘要里的估费按**标准 token 单价**折算，不是真实支出——免费额度的用量也按官方标准价计入合计。例如 deepseek-v4-flash 在 OpenCode 上免费，这部分 token 仍按 DeepSeek 官方定价计入了 ¥813.16，因此该数字读作「按标准价折算的用量成本」，会高于实际被扣金额。

![按 agent 拆 token：claudecode 58% / opencode 42% / 其他 0%](/assets/resources/20260904-measure-token-usage-cost/route1-agent-breakdown.png)

成本估算来自内置离线价表，按真实的 input / output / cache-read 三分量分别计价——缓存读比输出便宜两个数量级，混合单价会严重失真。它**完全离线、跑得快**，但只是估算：缓存读按 cache 费率计而价表存的是标准 list 价，当「接近真实、不是发票」。

> 关键限制：Qoder / CodeBuddy / TRAE / CloudCode 在本地没有任何 token 记录，这条路线对它们恒为 0 —— 这是预期，不是 bug。

## 三、路线二：抓平台账单（`ai-usage-report`）

负责「本地没有日志可读」那一半，回答**真实扣费**：把各平台账单统一成同一形态的记录，产出带图的 Markdown 报告与跨平台总览。数据有三条入口——官方导出、接口直取、浏览器抓取。

![各平台折算费用(RMB) 占比：CodeBuddy 117.1 (59.7%)、DeepSeek 45.4 (23.1%)、Qoder 31.3 (16.0%)、TRAE 2.3 (1.2%)](/assets/resources/20260904-measure-token-usage-cost/route2-platform-cost-share.png)

粒度随平台而异：CodeBuddy 的导出能细到每条请求，DeepSeek 的只有按天汇总——**平台给多细，报告就多细**，给不出的那层明细要靠路线一补。它内置两道防坑护栏：抓取漏掉区间内超 50% 的天数就中止；API 无视日期范围返回的「窗口外」记录直接丢弃，免得污染月份、假填缺口。

## 四、铁律：积分不是人民币

归一化后 Qoder / DeepSeek 的 `cost` 是人民币，TRAE / CodeBuddy 是**积分**，混着加必错。要比钱，先按可改的折算率（TRAE≈89 元/4000 积分、CodeBuddy≈99 元/4000 积分）统一折算成 RMB——但折算合计只是**参考估算**（促销、赠送积分会偏移），不是发票。最稳的跨平台比较，仍是请求数、活跃天数、模型构成这类无量纲指标。

## 五、把度量成本压到可忽略：让 AI 代跑

两个 skill 装进 agent（CodeBuddy / Claude Code 这类）后，直接用自然语言下指令即可，抓数、校验、出报告、存归档全自动。实测一次完整审计：4 次请求、3 分钟跑完、3.80 积分 ≈ 0.094 元。

![真实账单截图：在 CodeBuddyIDE 中让 AI 代跑两个 skill 的积分消耗记录](/assets/resources/20260904-measure-token-usage-cost/ask-ai-to-generate-report.png)

对比它量出来的真实扣费曲线——日费波动不小，单日峰值 ¥26.8，多数日子低于 ¥10：

![8 月各平台每日费用趋势：日费波动大，单日峰值 ¥26.8，多数日子低于 ¥10](/assets/resources/20260904-measure-token-usage-cost/route2-daily-cost.png)

**让 AI 代你跑量账的开销，比你量出来的账还便宜。** 另一个值得记的观察：我明确选的是 `hy3-x`，账单里却同时出现 `deepseek-v4-pro`——IDE 会把部分子步骤改派到别的模型，真正花钱的未必是你以为在用的那个。

## 六、复现清单

1. 逐个工具问三件事：本地有没有可读的 session 日志？账单在平台哪里？平台账够不够细？
2. 本地有日志的扫日志看按 agent / model 拆分；服务端记账的抓账单看真实扣费；账太粗的两块拼。
3. 跨平台对比前统一折算单位，折算值只当参考。
4. 每月固定跑一次并归档，记录总 token、成本估算与 Top 模型——用量是趋势，不是单点。

## 参考与延伸

- [`ai-token-usage` 使用手册](https://gitee.com/KylinLab/kylinlab.tech.skills/blob/master/docs/ai-token-usage.md) — 安装、参数、报告与存档说明
- [`ai-usage-report` 使用手册](https://gitee.com/KylinLab/kylinlab.tech.skills/blob/master/docs/ai-usage-report.md) — 三条数据入口、校验护栏、单位折算配置
- 开源仓库（中文入口）：https://gitee.com/KylinLab/kylinlab.tech.skills

别再靠「单价 × 想象」猜你花了多少。今天按三种场景对号入座，跑一遍，你会第一次真正看见：你的 token 到底花在了哪。
