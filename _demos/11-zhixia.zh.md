---
layout: demo-article
title: "ZhiXia（智匣）— 一套命令，适配所有 AI Agent CLI"
date: 2026-09-02
category: development
lang: zh
slug: zhixia
permalink: /zh/demos/zhixia.html
tags: ["AI", "CLI", "自动化", "开发者工具", "代理"]
description: "ZhiXia（智匣）：轻量化 AI-Agent 命令行代理网桥，一套统一参数驱动所有主流 AI CLI，强制无交互、无人值守执行。"
demo_link: "https://gitee.com/KylinLab/ZhiXia-App"
status: release
logo: /assets/resources/zhixia/logo_256.png
---

[English](/demos/zhixia.html)

# ZhiXia（智匣）— 一套命令，适配所有 AI Agent CLI

![ZhiXia Logo](/assets/resources/zhixia/logo_256.png)

**用一套统一参数描述任务，ZhiXia 自动翻译为目标 AI CLI 的原生调用，并以强制无交互模式全自动、无人值守执行。**

---

## 问题背景

每一款代码智能代理 CLI 都有自己的参数体系、交互逻辑和静默运行配置。ClaudeCode-CLI、TRAE-CLI、OpenCode-CLI、Codex-CLI、Qoder-CLI、CodeBuddy-CLI……各不相同。

对于需要自动化、批量调度的开发者来说，这意味着：

- 无法用一套通用命令驱动不同的 AI 工具
- 无法将 AI 能力接入 CI/CD 流水线
- 每接入一个新工具就要重新学习参数、修改脚本
- 自动化成本随工具数量线性增长

## 解决方案

**ZhiXia（智匣）** 作为一层轻量代理桥接层，为所有 AI Agent CLI 提供统一入参标准。你只需学会一套命令，ZhiXia 内部会自动翻译为对应工具的原生参数，实现全自动非交互执行。

核心思路：**统一抽象 → 驱动映射 → 原样透传**

- 向上提供简洁、一致的任务指令参数
- 向下适配各厂商 CLI 的差异化实现
- 完整透传标准输入输出和退出码，行为透明

---

## 核心价值

| 你能得到 | 实现方式 |
|---|---|
| **零学习成本** | 一套命令参数覆盖所有主流 AI CLI，不再需要查阅不同工具的文档 |
| **自动化友好** | 强制无交互模式关闭所有人机弹窗，可直接嵌入 CI/CD、批量调度、智能流水线 |
| **开箱即用** | 单静态二进制，零配置、零依赖，体验与 grep/cp 等系统工具一致 |

---

## 功能特性

### 1. 统一参数抽象

封装通用的任务描述、工作目录、模型选择、超时时间、读写权限等参数，一次编写，到处运行。

### 2. 多驱动适配

内置 ClaudeCode-CLI、TRAE-CLI、OpenCode-CLI、Codex-CLI、Qoder-CLI、CodeBuddy-CLI 等主流工具的驱动映射，自动翻译为对应原生参数。

### 3. 强制无交互

自动设置各 CLI 的静默运行环境变量与参数（如 `CLAUDE_CODE_NON_INTERACTIVE=1`、`TRAE_HEADLESS=true`），确保自动化场景下任务 100% 无人值守执行。

### 4. 原始参数透传

统一抽象无法覆盖某个工具的特殊功能时，通过 `--raw-args` 直接传递原生参数，兼容所有边缘场景。

### 5. 标准流与退出码透传

stdin/stdout/stderr 完整透传，退出码原样继承，让上层调度系统可以准确判断任务执行结果。

---

## 快速开始

1. 安装至少一款目标 AI CLI（ClaudeCode-CLI、TRAE-CLI、OpenCode-CLI、Codex-CLI、Qoder-CLI、CodeBuddy-CLI）
2. 从发布页下载对应平台的 `zhixia-*` 二进制
3. 将二进制放入 `$PATH` 并重命名为 `zhixia`
4. 开始使用：

```bash
zhixia --tool claude --prompt "重构 src/auth 登录逻辑"
zhixia --tool codex --model gpt-4o --prompt "生成单元测试" --work-dir ./src
```

---

## 下载

| 平台 | 下载 | 系统要求 |
|------|------|----------|
| Windows | [最新版本](https://gitee.com/KylinLab/ZhiXia-App/releases/latest) | Windows 10+（x64） |
| macOS | [最新版本](https://gitee.com/KylinLab/ZhiXia-App/releases/latest) | macOS 11+（Intel 与 Apple Silicon） |
| Linux | [最新版本](https://gitee.com/KylinLab/ZhiXia-App/releases/latest) | Ubuntu 20.04+ / Fedora 36+（x64） |

> 海外用户可从 [GitHub Releases](https://github.com/KylinLabAI/ZhiXia-App/releases/latest) 下载。

---

## 隐私

- **完全本地运行** — ZhiXia 不收集、不上传任何用户数据
- **不访问网络** — 所有 AI 任务均在用户本地环境与所选工具中执行，ZhiXia 本身不访问网络，亦不向任何第三方服务发送数据

---

## 状态

v0.1.0 已发布 — 生产可用，持续维护中。
