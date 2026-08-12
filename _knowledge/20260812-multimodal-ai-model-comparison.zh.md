---
layout: knowledge-article
title: "多模态不是附加功能：一张 IDE 截图实测 DeepSeek 与 kimi-k2.7 的读图能力"
subtitle: "用一张 IDE 后台 Credits 用量截图，对比 ClaudeCode+DeepSeek 的 OCR 退化与 CodeBuddy+kimi-k2.7 的原生多模态理解，揭示多模态为何是任务完成的硬门槛。"
platform: github-pages
language: zh-CN
lang: zh
date: 2026-08-12
slug: "multimodal-ai-model-comparison"
description: "用一张 IDE 后台截图实测 DeepSeek 与 kimi-k2.7 的读图能力，对比 OCR 退化与多模态原生理解的差异，说明多模态是任务完成的硬门槛。"
keywords: ["多模态", "DeepSeek", "kimi-k2.7", "OCR", "ClaudeCode", "CodeBuddy", "模型评测"]
tags: ["多模态", "大模型", "AI 评测"]
category: "Tech"
word_count: 0
author: "kylinlab.tech"
permalink: "/zh/knowledge/20260812-multimodal-ai-model-comparison.html"
published: true
excerpt: "用一张 IDE 后台截图实测：ClaudeCode+DeepSeek 靠 OCR 几乎全错（把"30天"误读成 $30K），CodeBuddy+kimi-k2.7 原生读懂 UI 层级与遮挡。多模态不是附加功能，而是任务完成的硬门槛。"
image: "/assets/resources/20260812-multimodal-ai-model-comparison/cover.zh.png"
toc: true
ghp_canonical_url: "https://kylinlabai.github.io/zh/knowledge/20260812-multimodal-ai-model-comparison.html"
ghp_series: ""
ghp_disqus_shortname: ""
---

# 多模态不是附加功能：一张 IDE 截图实测 DeepSeek 与 kimi-k2.7 的读图能力

![封面图：深色 IDE 后台的 Credits 用量记录界面，展示时间筛选下拉与模型用量表格](/assets/resources/20260812-multimodal-ai-model-comparison/cover.zh.png)

我一直以来都把 DeepSeek 作为日常工作的主力模型——性价比高，足够覆盖绝大多数任务。但一旦碰到需要"读懂一张图"的任务，它就不行了，这类场景我会改用别的模型。

这次我用一个最常见的工程场景做测试：让 AI 读取一张 IDE 后台的 Credits 用量截图，理解截图里的时间筛选器、表格字段和账单含义，再回答后续问题。主对比是两条路径：

- **ClaudeCode + DeepSeek**：直接附件报错；给文件路径后能跑，但本质是靠 OCR 硬撑。
- **CodeBuddy + kimi-k2.7**：真正原生理解图像，能指出截图上下文里没有明说的时间范围矛盾。

最后再补充一条路径——**CodeBuddy + DeepSeek**：它确实"读懂了"图，但我的测试只到"读懂并描述"为止；真正考验在于读懂之后去完成具体任务，而这一步恰恰暴露了文本描述路径的短板。

如果你也在选模型、选 IDE，这张图足以说明："能处理图片"和"能理解图片"之间，隔着一条多模态能力的鸿沟。

## 测试场景：一张很常见的后台截图

我用的测试素材是 Qoder IDE 后台的 "Credits 记录" 页面截图：顶部是时间范围筛选下拉（今天 / 最近 7 天 / 最近 30 天 / 自定义，当前展开遮挡了部分表格列），下方是用量记录表格。最关键的一个细节是——当前选中 "最近 30 天"，时间范围显示 "7 月 12 日 ~ 8 月 11 日"，但表格里实际最早只有 7 月 28 日的记录。

![测试用截图：Credits 记录页面](/assets/resources/20260812-multimodal-ai-model-comparison/snapshot-ui-layout.png)

这张图看似简单，但要答好，AI 需要同时理解：

- 下拉菜单是展开状态，遮挡了部分表格列，而下拉项本身就是页面状态的一部分。
- 表格列的真实含义（时间、时长、来源、操作、模型分级）。
- 时间范围 "7/12 ~ 8/11" 与下拉项 "最近 30 天" 的语义关系，以及它和表格数据边界的矛盾。

下面分别看三条路径的表现。

## 场景一：ClaudeCode + DeepSeek

### 直接拖图片进聊天：直接报错

我把截图直接作为附件发给 ClaudeCode（底层模型 DeepSeek），结果收到：

> "I'm sorry, but I'm unable to read the snapshot images you've attached — they're showing as '[Unsupported Image]' in this conversation..."

模型明确告诉我：当前环境不支持这种图片格式或附件方式，建议我直接粘贴、文字描述，或者把图片存到工作目录用 `Read` 工具读取。

![ClaudeCode 直接附件报错](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-attach-images.png)

### 改用文件路径：能跑，但质量堪忧

于是我换了一条路径：把截图的本地文件路径发给 ClaudeCode。这次它调用了 `Read` 工具读取文件，然后"以为"自己给出了总结。

但仔细看它的"思考过程"，问题很明显：它发现自己读不懂图后，转而探测系统里有哪些 OCR 工具可用，最后调用了 `tesseract` 做 OCR，再基于 OCR 结果手动拼凑表格。

![ClaudeCode 读取文件路径](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-image-file-path.png)

![ClaudeCode OCR 主导者](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-image-file-path-ocr-driver.png)

![ClaudeCode OCR 处理循环](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-image-file-path-ocr-process.png)

最终它给出了一份总结：

![ClaudeCode 最终回答](/assets/resources/20260812-multimodal-ai-model-comparison/response-claudecode-deepseek-image-file-path.png)

### OCR 路线的根本缺陷

这份"总结"其实**几乎全错**，而且有一个很能说明问题的关键误解。由于 OCR 本身**不支持中文**，它把中文后台的文字大量误读；其中最关键的一处是：下拉菜单里的 "最近 **30 天**" 被 OCR 误认，又因为它没有层级概念、把下拉项和表格第一行混在了一起，于是 "30 天" 被插进了表格第一行，错误地拼成了 "**$30K**"。模型拿到这团错乱文字后，竟据此"猜测"那是一笔 30K 的费用（猜想是 $30K），但真实截图里根本没有这个金额。

更普遍地看，这套链路连这些最基本的结构都没理解——问题不在 ClaudeCode（它只是一个 AI agent），而在前面的 OCR 和真正处理文字的 AI 模型：

- 顶部有一个**展开的下拉菜单**，遮挡了第 4、5 列，但下拉项 "今天 / 最近 7 天 / 最近 30 天 / 自定义" 本身也是页面状态的一部分。
- 表格列不是简单的 "Record ID / Duration / Cost / Source / Model"，而是中文后台的 "时间 / 时长 / 来源 / 操作 / 模型分级"。

OCR 最大的问题不是识别率，而是**没有层级和位置的概念**。它会把下拉菜单里的文字和表格里的文字混在一起，把 UI 上层元素和主体内容 flatten 成同一行文字。等模型拿到这团文字后，已经不可能还原出"图片原本想表达什么"。

这就解释了为什么很多"能读图"的任务，最终完成质量很差：不是模型不努力，而是输入本身已经被破坏过一次。

## 场景二：CodeBuddy + kimi-k2.7

### 读同一张测试截图：原生多模态一眼看穿层级

最后我把同样的截图发给 CodeBuddy——我在模型选择里选的是 **Auto**（并没有直接指定 kimi-k2.7），CodeBuddy 平台显示它实际调用的是 **kimi-k2.7**。这一次的回答质量明显不同。

它能指出一个 OCR 路线几乎不可能发现的细节：

> "下拉菜单显示 '今天 / 最近 7 天 / 最近 30 天 / 自定义'，第 5 列显示 Qwen3.7-Max，但第 4 列（来源）和第 5 列（操作）被 dropdown 挡住了。"

![CodeBuddy + kimi-k2.7 的回答](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-k27.png)

### 真实工作里的分析：另一个 chat session 中完成的任务

而下面这张图，并不是上面的对照测试，而是我在**另一个 chat session 里、用同一套 Auto 配置（CodeBuddy 同样显示为 kimi-k2.7）真正完成的一项工作分析**——我要它基于这张截图去做具体的分析任务，而不只是"读懂并描述"。在真实任务中，kimi-k2.7 能基于图片中 "最近 30 天" 的下拉选择和 "7 月 12 日 ~ 8 月 11 日" 的显示，推断出实际数据最早只到 7 月 28 日，并指出 "API 返回的最早只有 7/28" 与 "最近 30 天应该从 7/13 开始" 之间的矛盾。

![CodeBuddy + kimi-k2.7 真实工作分析](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-k27-with-question-context.png)

这种推理需要：

- 识别下拉菜单是**展开状态**。
- 理解菜单文字和表格内容**不在同一层级**。
- 把 "最近 30 天" 这个选项与 "7/12 ~ 8/11" 的时间范围做语义关联。
- 再与实际表格数据的时间边界做比较。

这不是 OCR 后能轻松做到的，因为它依赖对**页面空间结构和 UI 语义**的理解——而这恰恰是真实工作任务里真正需要的那种能力。

## 补充场景：CodeBuddy + DeepSeek（"读懂"了，但测试并不完整）

前面两条是主对比。这里再补一条路径：在 CodeBuddy 里把同一张截图发给 DeepSeek。它**确实"读懂"了**——至少表面上看，它给出了结构清晰、还正确的回答，能识别出 "Credits 记录" 页的两个 Tab、二级 Tab、时间筛选下拉，以及表格字段。

![CodeBuddy + DeepSeek 的回答](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-deepseek.png)

但严格说，我这个测试本身**并不完整**：我只是让它"读懂图并描述出来"，并没有让它"读懂图之后再去完成一个具体任务"。一旦进入"读懂后要做事"这一步，差距就显出来了。

它的回答很关键：

> "虽然我本身（DeepSeek 系列模型）确实不具备原生的多模态视觉能力，但你能看到那个详细的总结，是因为 IDE（CodeBuddy）在中间做了一层预处理。"

整个流程是：

1. 用户发送图片 → 图片先到达 IDE/客户端。
2. IDE 在后台**切换/借用一个多模态视觉模型**做预处理，把图片中的文字和大致内容描述提取成文本。
3. 处理后的文本被注入到 DeepSeek 的上下文里。
4. DeepSeek 基于这些文字版描述做总结。

![CodeBuddy + DeepSeek 解释预处理流程](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-deepseek-reason.png)

也就是说，**真正读懂图的并不是 DeepSeek，而是 CodeBuddy 后台那个被隐藏调用的视觉模型**。后台请求日志虽然显示模型是 `deepseek-v4-pro`、消耗极低，但这其实只是"整理文字"的那一步——视觉理解早已在客户端侧静默完成。

![CodeBuddy 后台请求记录](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-deepseek-backend-data.png)

### 为什么"能读懂"不等于"能把任务做好"

关键要先看清两条本质不同的链路：

- **多模态模型**：`图 → AI 模型 → 目标任务`。模型直接对图像做编码，带着空间、层级、状态等完整信息去完成下游任务。
- **非多模态模型**（如这里的 DeepSeek，靠客户端补能力）：`图 → 其它工具/多模态模型 → 图的文本描述 → AI 模型用文本描述"猜"图 → 目标任务`。

第二条链路里，DeepSeek 全程**没有直接见过图**，它只拿到了一段"图的文本描述"，然后基于这段描述去**猜测**图原本的样子，再去做任务。

而问题恰恰出在"图的文本描述"这一步——它**没法还原出图的很多信息，尤其是位置**。比如截图里某处有一个报错，但报错"出现在哪个区域、属于哪个输入区、旁边是什么模块"，这些在文字描述里全都没有。你手里只是一堆被拍平的字符，根本无法还原出"图到底长什么样"。

一旦到了处理具体问题的环节（"读懂之后要做什么"），模型就因为**缺失了关键上下文**而无法把任务完成好：它不知道元素之间的空间关系，不知道哪个状态是激活的，自然也做不出需要理解这些细节的高质量回答。换句话说，文本描述再准，也只是图的一个残缺影子，下游任务的质量上限早就在这第一步被锁死了。

换句话说，CodeBuddy + DeepSeek 确实"读懂了图"，但那次读懂经过了一次隐藏的多模态模型切换，且下游任务拿到的只是"图的文本描述"而非图本身。这个补齐能不能撑住，取决于任务有多依赖图的原始上下文——越需要位置、层级、状态的细节，越容易在下钻时露馅。

## 对比总结

| 维度 | ClaudeCode + DeepSeek（附录） | ClaudeCode + DeepSeek（文件路径） | CodeBuddy + kimi-k2.7 | CodeBuddy + DeepSeek（补充） |
|---|---|---|---|---|
| 是否支持直接上传图片 | ❌ 不支持 | ✅ 通过 Read 工具读取 | ✅ 支持 | ✅ 支持 |
| 视觉理解方式 | 无 | 本地 OCR + 文字注入 | 原生多模态理解 | 后台隐藏切换视觉模型预处理（OCR/描述）+ DeepSeek 总结 |
| 是否保留位置/层级信息 | ❌ 无 | ❌ 无 | ✅ 较好 | ❌ 丢失位置、遮挡、视觉状态 |
| 能否识别下拉遮挡 | ❌ 不能 | ❌ 不能 | ✅ 能指出 | ⚠️ 可能遗漏 |
| 能否做时间范围推理 | ❌ 不能 | ⚠️ 弱 | ✅ 能 | ⚠️ 中等（依赖预处理质量） |
| 回答置信度/可追问性 | 低 | 低（容易基于碎片文字 hallucinate） | 高 | 中（上下文已丢失，细节易露馅） |

## 这意味着什么？

### 1. "模型便宜"不等于"任务便宜"

DeepSeek 的 token 成本确实低，但如果你的任务需要看图，而模型本身没有原生多模态能力，那么：

- 要么客户端帮你做一层预处理，质量不可控。
- 要么你自己搭 OCR + 后处理流水线，开发和维护成本会吃掉模型差价。

### 2. 客户端的多模态补齐是权宜之计，不是替代方案

CodeBuddy + DeepSeek 的做法很聪明：客户端先在后台静默切换一个视觉模型读懂图，再把文字喂给 DeepSeek。这种方式对简单场景很有效，但它把"视觉理解"的黑箱从模型端移到了客户端，而且你还看不到那次切换。你很难知道：

- 后台到底切到了哪个视觉模型、为什么看不到它的调用？
- 复杂 UI 的层级关系、位置信息被保留了多少？
- 会不会把菜单文字误当成表格内容，或把"报错出现在哪个区域"这类关键信息直接抹掉？

对于需要精确理解图片的任务，原生多模态仍然是更可靠的选择。

### 3. 选型时多问一句：是"能传图"，还是"能看图"？

很多产品宣传"支持图片输入"，但底层可能只是 OCR 转文字。真正决定体验的是：

- 模型是否原生支持视觉编码？
- 输入图片后，能否理解空间位置、视觉层级、UI 状态？
- 能否基于图片内容做推理，而不是只复述图中文字？

## 总结

1. **多模态是能力，不是接口**：能上传图片只是第一步，能不能理解图片里的层级、位置、状态，才决定任务能不能做好。
2. **OCR 是文字搬运，不是视觉理解**：OCR 会把 UI 上下层元素 flatten 成一行行文字，丢失的上下文会让后续推理走样。
3. **客户端预处理能补一时之需，但补不出原生能力**：CodeBuddy + DeepSeek 的方案适合简单图文，复杂 UI 场景仍建议选原生多模态模型。

如果你现在手边正好有一张"想丢给 AI 看"的截图，不妨先问自己：这张图里的信息，是主要靠文字就能表达，还是需要同时理解它长什么样？答案会帮你选对模型。
