---
layout: knowledge-article
title: 多平台发文不加班：用 AI 技能串一条发布流水线
subtitle: 把写作规则沉淀成技能，让起草、封面、平台化、发布四步各交给一个 AI 组件：一篇草稿自动展开为 12 个平台原生文件加一对双语封面。
platform: github-pages
language: zh-CN
lang: zh
date: 2026-10-21T00:00:00.000Z
slug: ai-multiplatform-publishing-workflow
description: 把写作规则沉淀成技能，起草、封面、平台化、发布四步各交给一个 AI 组件：一篇草稿自动展开为 12 个平台原生文件加一对双语封面，发布收敛成一次点击。
keywords:
  - 多平台发布
  - AI 技能
  - Agent 工作流
  - 博客流水线
  - FaXia
tags:
  - AI写作
  - 多平台发布
  - 效率工具
  - 博客流水线
  - Agent
category: Tech
word_count: 3120
author: kylinlab.tech
permalink: /knowledge/ai-multiplatform-publishing-workflow.html
published: true
excerpt: >-
  把写作规则沉淀成技能，让起草、封面、平台化、发布四步各交给一个 AI 组件：一篇草稿自动展开为 12
  个平台原生文件加一对双语封面，发布收敛成一次点击。搬运的活儿不再属于你。
image: /assets/img/covers/ai-multiplatform-publishing-workflow.png
toc: true
ghp_canonical_url: >-
  https://kylinlabai.github.io/zh/knowledge/ai-multiplatform-publishing-workflow.html
ghp_series: ''
ghp_disqus_shortname: ''
---

# 多平台发文不加班：用 AI 技能串一条发布流水线

![封面图：AI 博客发布流水线——从一份 Markdown 草稿到 12 个原生平台文件](/assets/resources/20261021-ai-multiplatform-publishing-workflow/cover-zh.jpg)

写博客的核心目标是把知识送到读者手里，而不是把自己困在每天重复的搬运里。我们此前实测过：手写完一篇，再逐个平台复制粘贴、调格式、重传图片、翻译改写，纯手动发完一篇约需 **一个半小时**——比很多人想象的都长。本文用一次真实演示，讲清楚怎么把这四个环节拆成四步、每步交给一个 AI 组件。

## 为什么值得看：搬比写更累

同时维护中文平台（头条号、微信公众号、知乎、微博、掘金）和英文渠道（Twitter、LinkedIn、Facebook、Reddit、Medium），外加一个中英双语的 GitHub Pages 站点，是多平台写作者的常态。多平台分发的成本不在「写」，而在「搬」：

- **重复劳动**：同一篇要在 5–9 个平台重复粘贴、调排版、重传图片，每篇一小时起步。
- **格式与图片**：各平台编辑器口味不同，本地图片逐个上传，漏一张就挂一张图。
- **双语压力**：中文和英文是两套内容，硬翻译读着别扭，逐篇重写又太贵。
- **改文噩梦**：发出去发现有错别字，意味着每个平台再登录一次、再改一遍。

目标很朴素：**草稿只写一份，其余全部自动**——每个平台拿到为它原生写就的那一版，而不是同一份文本的 9 次复制。

## 我们构建了什么：四步 + 文件契约

四个 AI 组件，各管一段，中间用文件契约衔接：

- **起草技能**（自定义 Skill + AI Agent）：把简要说明与素材变成结构化草稿，自动落入编号槽位，封面只放占位注释。
- **豆包**：读草稿正文，逐篇产出一对双语封面图，存进该篇的 `resources/`。
- **平台化技能**（自定义 Skill + AI Agent）：把一篇草稿展开成 12 个平台原生文件 + 元数据 + 自包含的图片拷贝。
- **FaXia**：桌面端「目录模式」，按文件名对号入座，一次发布到所有勾选平台。

```text
简要说明 + 素材文件夹
      │ ① 起草技能（Qoder Agent）
      ▼
草稿：下一篇-编号-<slug>/article.md   ← 唯一事实源，封面只有占位注释
      │ ② 豆包读正文出图：cover-zh / cover-en → resources/
      ▼
封面占位注释 → 真实「封面与背景图」章节
      │ ③ 平台化技能（OpenCode Agent）
      ▼
发布目录 YYYYMMDD-<slug>/
  ├─ _meta.md
  ├─ 12 个平台原生文件（中文 6 + 英文 6）
  └─ resources/（自包含图片拷贝，不回链草稿）
      │ ④ FaXia 桌面端：目录模式 → Dry Run → Update
      ▼
中文 5 平台 + GitHub Pages 双语 · 英文 Twitter/LinkedIn/Facebook/Reddit/Medium
```

### 第①步：起草——一段说明换一篇结构化草稿

在 Qoder 里对 Agent 说「用起草技能写一篇草稿，参考这些素材文件夹」，Agent 就按技能规则产出草稿。素材给得足够，第一稿就合格。主题太大一篇装不下时，起草技能本就有一条指引：**复杂到一篇放不下时，建议拆成系列**。第二条消息照这条指引重来一次，一个 9 篇的系列就此定形。

![Qoder 输入框：一段说明 + 4 个素材目录触发起草技能](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step1-draft-prompt.png)

![第二条消息：按技能的系列指引，把这篇重出为系列草稿](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step1-series-refinement.png)

值得说的是，这两次调用的技能并未注册到 Agent 的技能加载器——Agent 直接读技能的 `SKILL.md` 并手工执行了整个工作流。**`SKILL.md` 本身就是可执行契约**：触发条件、产出文件、质量清单都写在里面，换个 Agent、换个模型都能跑出同样结果。

### 第②步：封面——豆包出双语图，规则比画法更重要

把整个系列目录丢给豆包，开一个 "Create blog cover images" 对话，提示词三条：**先读正文理解这篇在讲什么；为本篇出一张中文封面；英文版参照刚出的中文版，只把图里的中文换成英文、其余一律不动**。

![豆包封面提示词：先读正文 → 出中文封面 → 只换文字出英文封面](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step2-doubao-cover-prompt.png)

「只换文字」是双语封面不跑偏的关键——英文版不是重新画一张，而是同一张构图的换字版。交付时豆包主动报了硬指标：逐篇两张图落在该篇 `resources/`，**全部 1280×720、单张 1MB 以内**，深蓝底 + 青色光效风格统一：

![9 篇 × 中英两版封面的交付汇总：逐篇清单 + 尺寸与风格核验](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step2-doubao-covers-summary.png)

出图后还有一步容易被忽略：草稿里原本是封面占位注释，要换成真实引用，后续平台化技能才能识别并嵌到每篇标题之后。这一步在同一场对话里补一句话就完成，全程约 **1 分钟**：

![替换封面引用：带上格式示例下达指令，9 篇一次改完（约 1 分钟）](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step2-cover-reference-update.png)

### 第③步：平台化——一篇草稿变 12 个平台原生文件

换到 OpenCode 里做——构建模式 auto、模型 MiMo-V2.6-Flash Free，一条指令对整个系列文件夹调用平台化技能。它为每篇产出 12 个平台原生文件（中文 `.zh.md` × 6、英文 `.md` × 6）、一个 `_meta.md` 元数据文件，以及一份自包含的 `resources/` 图片拷贝——所有图片链接都在输出目录内解析，绝不回链草稿。

![OpenCode 输入框：一条指令对整个系列目录调用平台化技能](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-opencode-invocation.png)

![平台化技能跑完 9 篇后的输出汇总](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-polish-skill-output.png)

![一篇草稿展开后的 12 个平台文件 + _meta.md + resources/](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-platform-files-tree.png)

系列的「排期」是一句话的事：第一版把 9 篇全排在同一天，补一句「改期」，让 Agent 把 9 个发布目录的日期前缀重排成连续 9 天，目录名本身就是排期表：

![重排结果：Oct 18 → Oct 26 一天一篇、系列顺序 A1→C3](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-reschedule-schedule.png)

### 第④步：发布——FaXia 目录模式，Dry Run 之后一键 Update

FaXia 是一个纯本地、开源的多平台发布工具（CLI 与桌面端双形态，共用一套发布引擎）。桌面端切到 **Directory (Multi-Platform)** 模式，选中一个发布目录，它会按文件名自动对号入座：`tou-tiao.zh.md` 给头条、`wechat-official-account.zh.md` 给公众号……本地图片自动上传到各平台图床并替换链接，已发布过的文章会**原地更新**而不是重复发一篇。

![FaXia 桌面端目录模式：选目录即自动识别 12 个平台文件](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step4-faxia-directory-mode.png)

发布目标按需勾选——本次只勾了 GitHub Pages（中英两版）与 5 个中文平台共 7 个目标，Facebook、LinkedIn、Reddit 等英文渠道留着以后发。先 **Dry Run** 演练一遍（流程全跑、就是不真发），确认无误再点 **Update**。本次结果是 7 个目标 **6 成功、1 待处理**：

![发布结果：6/7 平台成功，逐平台状态与直达链接](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step4-faxia-publish-results.png)

| 平台 | 结果 | 说明 |
|---|---|---|
| GitHub Pages（Gitee Pages 承载） | ✓ 成功 | 中英两篇各返回直达链接 |
| 头条号 | ✓ 成功 | 已检测到成功信号；文章可能仍在「审核中」暂不外显 |
| 知乎 | ✓ 成功 | 浏览器自动化发布 |
| 掘金 | ✓ 成功 | 返回文章直达链接 |
| 微博 | ✓ 成功 | Playwright 浏览器自动化发布 |
| 微信公众号 | ⏳ 落在草稿箱 | 不允许自动发布，须在公众号后台手工扫码确认；本次 API 另报未授权（errcode 48001），文章停在草稿箱 |

## 五条经得起未来的规则

1. **草稿目录是唯一事实源，发布目录是「编译产物」。** 要改就回去改草稿重跑技能，绝不手改发布文件。
2. **平台文件名就是契约。** 12 个固定文件名（如 `zhihu.zh.md`、`medium.md`），发布工具靠文件名对号入座。
3. **封面双硬约束**：单文件 ≤ 1MB 且 ≤ 1280×720；英文封面只换文字、不换构图。
4. **先 Dry Run 再 Update，单平台失败自动隔离。** 一个平台凭证过期不影响其他平台照常发布。
5. **目录日期前缀 = 排期表。** 系列「一天一篇」靠把目录名排成连续日期实现，不需要额外调度系统。

> **挡住自动发布的，只有「必须人工」这一种情况。** 本次 7 个目标里 6 个全自动发布成功，唯一的例外是微信公众号——它不允许自动发布，必须在后台手工扫码确认；凡是没有人手工限制的平台，都是一把梭自动成功。头条「成功但仍在审核中」是平台审核时延，照样算成功。

## 下一步：把这条流水线收进一个闭环

步骤之间目前仍靠手工衔接：两个技能要分别在 Qoder 和 OpenCode 里触发，封面要另开豆包，发布要切到 FaXia。我们已把「收成一个 App」写成了实施计划，让 FaXia 从「只管发布」变成覆盖整条内容生命周期的闭环——写 → 封面 → 审 → 发布 → 评论 → 回复 → 提交。两条底线不动摇：**默认不自动发布、不自动提交**；**模型不自我认证**，门禁始终在 App 里独立执行。

---

## 总结

1. **把写作规则沉淀成技能资产**，AI Agent 按规则起草与平台化——规则写一次，每篇文章复用，产出稳定可预期。
2. **四步流水线各司其职，用文件契约衔接**：一篇草稿自动展开为 12 个平台原生文件加一对双语封面，发布收敛成一次点击。
3. **发布永远先 Dry Run、失败要隔离**：单个平台的限制或审核问题不该拖累整批，改文走原地更新而不是重复发帖。

完整配置与系列文章见知识库：[https://kylinlab.pages.dev/zh/knowledge](https://kylinlab.pages.dev/zh/knowledge)。如果你在搭建多平台发布流水线时踩过类似的坑，欢迎在评论区聊聊。
