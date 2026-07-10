---
layout: demo-article
title: "SkillLoop — 让 AI 技能自我进化"
date: 2026-06-11
category: development
lang: zh
slug: skillloop
permalink: /zh/demos/skillloop.html
tags: ["Python", "FastAPI", "AI", "开发工具", "Agent", "自动化"]
description: "自托管服务，自动从用户对话中发现 AI 技能问题，聚类分析后生成改进 PR。零侵入、零打扰、零摩擦。"
demo_link: "#"
status: prototype
---

<div align="center">

# 🔄 SkillLoop — 让 AI 技能自我进化

**团队每一次使用 AI 技能，都在让它变得更好——全自动，零额外操作。**

[快速上手](#快速上手) · [下载安装](#下载安装) · [English](/demos/skillloop.html)

</div>

---

## 痛点

团队精心打造了一套共享 AI 技能库——代码审查、文档生成、SQL 分析……所有人用同一套 Skill，输出质量统一，效率显著提升。

然后现实来了：

- 某个 Skill 在常见场景下表现良好，但**边缘场景**频频翻车。用户不得不在对话中反复纠正 AI。
- 每个人都在**各自的聊天记录里**独立解决同一个问题——彼此看不见，更谈不上共享。
- 这些修复**没有路径**回流到共享技能库。
- 技能一直"坏"着。新人踩同样的坑，老人每次都要重新解释同一个 workaround。

结果就是：技能"应该怎样工作"和"实际怎样工作"之间的差距越拉越大——而且是悄无声息地拉大的。

## 解决方案

**SkillLoop** 透明地观察你的 AI 对话，检测到你纠正技能的行为后，自动提取问题上下文。当足够多的人遇到同一个问题时，SkillLoop 直接生成一个改进 PR——你只管继续工作，技能会自己变好。

---

## 核心价值

| 你得到什么 | 怎么做到的 |
|---|---|
| **技能自动改进，不用任何人提 Bug** | SkillLoop 接入 AI 平台的原生 Hook 机制，自动检测纠错信号 |
| **团队工作流零改变** | 用户照常和 AI 聊天，检测完全无感 |
| **直接收到可合并的 PR，不是模糊的报告** | 当 3 位以上用户遇到同一问题时，SkillLoop 生成包含修复、根因和证据的 Draft PR |
| **数据完全留在内网** | 自托管服务，本地数据库、本地 LLM 调用，不依赖任何云服务 |
| **一个服务管理所有技能** | 多仓库技能注册表，统一管理不同 Git 仓库中的技能、插件和 Agent |

---

## 主要功能

### 1. 零侵入检测

SkillLoop 利用每个 AI 平台的**原生 Hook 系统**——不改技能代码，不加包装层，不加中间件。装一次适配器，所有对话自动被透明观察。

### 2. 双路径分析

检测到纠错后，SkillLoop 优先在**本地分析**——在你的电脑上启动一个后台 AI Agent（Claude Code 或 Copilot CLI）。如果本地没有 CLI，则回退到服务器处理。无论哪条路径，结果一样。

### 3. 智能聚类

来自不同用户的相似问题自动聚合，使用向量嵌入计算语义相似度。同一根因不会产生重复 PR——技能维护者只看到一个清晰的改进建议，而不是一堆噪音。

### 4. 自动生成 PR

当某个聚类的证据数量达到阈值，SkillLoop 拉取当前技能文件，生成改进版本，创建 Draft PR，附带问题模式、根因分析、变更说明和证据数量。

### 5. Web 管理后台

内置管理页面，可直接在浏览器中管理技能注册表、服务器配置、纠错检测模式和信号监控——不需要进容器改配置文件。

---

## 快速上手

1. **启动服务器** — `docker-compose up -d`（一条命令，一次搞定）
2. **安装适配器** — `pip install skillloop-client && skillloop-client install copilot --url http://your-server:8080`
3. **照常使用 AI 技能** — 工作流完全不变
4. **SkillLoop 自动捕获纠错** — 当你说"不对"、"应该是"、"再来一次"时，信号被自动采集
5. **审阅 PR** — 证据积累到阈值后，技能仓库中出现 Draft PR

---

## 下载安装

| 组件 | 安装方式 | 要求 |
|------|----------|------|
| 服务端 | `docker-compose up -d` | Docker，500 MB 内存 |
| 客户端（pip） | `pip install skillloop-client` | Python 3.10+ |
| 客户端（pipx） | `pipx install skillloop-client` | Python 3.10+ |

> 客户端 **零外部依赖** — 纯 Python 标准库。

### 支持的 AI 平台

| 平台 | 状态 | Hook 机制 |
|------|------|-----------|
| Claude Code | ✅ 已支持 | `~/.claude/settings.json` → Stop hook |
| Copilot CLI | ✅ 已支持 | `~/.copilot/hooks/` → agentStop |
| VS Code Copilot Chat | ✅ 已支持 | 与 Copilot CLI 共享配置 |
| Codex CLI | 📋 计划中 | Phase 2 |
| Cursor | 📋 计划中 | Phase 2 |

---

## 隐私与数据

- **所有数据留在你的基础设施内** — 自托管服务器、本地数据库、无云端依赖
- **无需注册账号** — 没有注册、没有 SaaS、没有订阅
- **客户端不在本地存储会话数据** — 会话结束后流式上报服务器
- **LLM 调用留在内网** — 配置你自己的 LLM 端点（DashScope、OpenAI 兼容接口或本地模型）

---

## 路线图

SkillLoop 目前处于 **原型** 阶段。

**已实现：**
- Claude Code、Copilot CLI 和 VS Code Copilot Chat 零侵入 Hook
- 双路径架构（本地 Agent + 服务器回退）
- 可配置的纠错检测模式（中文 + 英文正则）
- LLM + 向量嵌入的问题提取和聚类
- Web 看板和管理后台
- 多仓库技能注册表，支持从仓库自动扫描注册

**即将到来：**
- Codex CLI、Cursor、Cline 适配器（Phase 2）
- 基于证据的自动 PR 生成
- 高置信度修复的自动合并模式
- GitLab 和 Gitea 支持

---

## 社区与支持

- [提交 Issue](https://github.com/KylinLabAI/kylin-skills/issues)
- [查看文档](docs/)
- [查看源码](https://github.com/KylinLabAI/kylin-skills)

---

<div align="center">

**准备好让你的 AI 技能自我进化了吗？**

[立即开始](#快速上手)

</div>
