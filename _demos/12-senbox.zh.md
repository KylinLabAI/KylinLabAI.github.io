---
layout: demo-article
title: "讯匣 SenBox — 把事件流分发到任意通知渠道"
date: 2026-09-02
category: development
lang: zh
slug: senbox
permalink: /zh/demos/senbox.html
tags: ["通知", "CLI", "流式", "开发者工具", "告警"]
description: "讯匣 SenBox：流式多渠道通知分发网关。一套事件格式、一条命令、任意目的地——像 grep 一样把事件流管道化地推送为飞书告警。"
demo_link: "https://gitee.com/KylinLab/SenBox-App"
status: release
logo: /assets/resources/senbox/logo_256.png
---

[English](/demos/senbox.html)

# 讯匣 SenBox — 把事件流分发到任意通知渠道

![SenBox Logo](/assets/resources/senbox/logo_256.png)

**你只需描述一次"发生了什么"，SenBox 负责决定"如何送达"到每个目的地，隐藏所有渠道差异，并返回一个可预期的统一结果。**

---

## 问题背景

通知代码在每个团队、每个服务、每个渠道都要重写一遍。飞书、企业微信、短信、电话、WhatsApp 各有各的消息格式、认证方式和失败反馈。于是每个服务、每个运维脚本、每个 AI 智能体都各自维护一份"怎么发通知"的拷贝——渠道密钥通常就写在旁边。

而这些都无法组合。你可以用 `grep` 过滤日志、用 `mv` 移动文件，却不能像这样把事件流直接管道进告警。批量告警、流水线触发通知、无人值守的智能体告警，最后都退化成定制程序。

## 解决方案

**讯匣 SenBox** 是一个 Unix 原生通知网关，行为与你流水线里的既有工具一致：单个静态二进制、无需运行时、无需配置文件、无交互弹窗——它从 stdin 读取流，一行一个事件，随到随发。

核心思路：**一套事件格式 → 渠道驱动 → 分发**

- 告警只写一次，换目的地只改名称
- 把监控输出、日志行或 JSON 事件直接管道化为通知
- 密钥保存在操作系统受保护的凭据存储中——绝不出现在 argv、环境变量或仓库文件里

---

## 核心价值

| 你能得到 | 实现方式 |
|---|---|
| **一套事件格式，适配所有渠道** | 告警只写一次，换目的地只改名称 |
| **天生流式** | `tail -f app.log \| sendx stream --channel feishu` 随到随发，体验与 grep 一致 |
| **密钥留在系统钥匙串** | 只从 macOS 钥匙串、Windows 凭据管理器、Linux Secret Service 读取——绝不来自环境变量或仓库文件 |
| **为无人值守而生** | 无弹窗、无界面，差异化退出码 + 机器可读运行摘要，CI 任务与 AI 智能体可据此分支 |
| **两种形态，同一内核** | 使用 `sendx` CLI，或通过语言无关的 C ABI（`libsenbox` + `senbox.h`）内嵌同一内核 |
| **扩展成本低** | 新目的地就是一个自包含驱动；事件格式、路由与结果契约保持不变 |

---

## 功能特性

### 1. 一键发送

`sendx send --channel feishu "message"` — 文本或富文本输出，直达任意渠道。

### 2. 流式分发

`... | sendx stream --channel feishu` — 一行一个事件，纯文本或 JSON，随到随发。

### 3. 统一事件模型

严重级别、来源、标题、正文、时间戳与标签——所有目的地共用同一套字段。

### 4. 严重级别过滤

`--min-severity warn` 在分发前丢弃低于阈值的所有事件。

### 5. 路由规则

一次性声明哪些严重级别与来源发往何处；调用方无需重复决策。Fan-out 把一个事件分发到多个目的地，返回一份合并结果。

### 6. 可靠的演练

`--dry-run` 只解析、过滤、路由而不实际送达——可在生产环境安全校验规则。

### 7. 飞书渠道

群机器人投递，文本与交互卡片，机器人要求签名时自动计算。瞬时失败指数退避重试，每次尝试有硬性时限。

### 8. 结果契约

成功、部分成功、整体失败使用差异化退出码，并在每次运行输出 `senbox.run_summary/v1` JSON 记录。

### 9. 自检

`sendx doctor` 在不打扰真实群聊的前提下，验证目的地地址、密钥可用性与可达性。

### 10. 可内嵌内核

提供 C ABI 库（`libsenbox`）与稳定头文件 `senbox.h`，支持在任意语言中内嵌。

---

## 快速开始

```bash
# 1. 让 SenBox 指向你的飞书群机器人（非机密，可用环境变量）
export SENDX_FEISHU_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/xxxx"

# 2. 把机器人签名密钥一次性存入系统钥匙串（绝不落盘）
sendx secret set feishu_bot_secret

# 3. 发送
sendx send --channel feishu --severity error \
  --source payment-api "Checkout latency above SLO"

# 4. 或流式分发 —— 每出现一行 warn 及以上级别即推送
tail -f /var/log/app.log | sendx stream --channel feishu --min-severity warn

# 5. 不打扰任何人，校验接线是否正确
sendx doctor --channel feishu
```

---

## 下载

| 平台 | 下载 | 系统要求 |
|------|------|----------|
| Windows | [最新版本](https://gitee.com/KylinLab/SenBox-App/releases/latest) | Windows 10+（x64） |
| macOS | [最新版本](https://gitee.com/KylinLab/SenBox-App/releases/latest) | macOS 11+（Intel 与 Apple Silicon） |
| Linux | [最新版本](https://gitee.com/KylinLab/SenBox-App/releases/latest) | Ubuntu 20.04+（x64） |

> 海外用户可从 [GitHub Releases](https://github.com/KylinLabAI/SenBox-App/releases/latest) 下载。

每个版本提供静态 `senbox-<target>-<os>.tar.gz` 归档。下载一个文件，解压即用——零依赖、零安装步骤。

---

## 隐私

- **无遥测、无分析** — SenBox 只与一个地方通信：你指定的通知渠道
- **密钥绝不离开钥匙串** — 渠道密钥从操作系统受保护凭据存储读取，绝不写盘、绝不进环境变量、绝不打印——日志、错误、JSON 摘要中都没有
- **仅在投递期间驻留内存** — 事件内容只在投递期间保留在内存中；V1.0 不保留任何本地历史

---

## 状态

v1.0.0 已发布 — 核心引擎、`sendx` CLI 与 `senbox-ffi` C SDK 功能完备，已完成安全加固（10 项安全测试、完整 E2E 套件），并在 Linux、macOS、Windows 上通过发布测试。
