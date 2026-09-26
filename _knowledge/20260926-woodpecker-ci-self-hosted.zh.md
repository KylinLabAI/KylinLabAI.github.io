---
layout: knowledge-article
title: 用旧笔记本自建 Woodpecker CI：从选型到 Gitee 适配
subtitle: 一台退役 ThinkPad T410 跑起零成本、网络稳定的私有 CI——架构设计、Agent 标签路由、Gitee SCM 补丁与迁移前后对比。
platform: github-pages
language: zh-CN
lang: zh
date: 2026-09-26T00:00:00.000Z
slug: woodpecker-ci-self-hosted
description: 在 4 核 8GB 退役笔记本上用 Woodpecker 搭建零成本私有 CI：选型对比、构建/发布分离架构、内网脚本触发、Gitee 补丁与基准对比。
keywords:
  - Woodpecker
  - CI/CD
  - 自托管
  - Gitee
  - 旧硬件
  - 私有 CI
tags:
  - Woodpecker
  - CI/CD
  - 自托管
  - Gitee
  - DevOps
  - Tech
category: Tech
word_count: 2300
author: kylinlab.tech
permalink: /zh/knowledge/woodpecker-ci-self-hosted.html
published: true
excerpt: >-
  用一台退役 ThinkPad T410 跑 Woodpecker，把私有 CI 成本降到 0 元：构建与发布分离的架构、内网脚本触发、Gitee SCM
  补丁，以及迁移前后基准对比。
image: /assets/img/covers/woodpecker-ci-self-hosted.png
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/zh/knowledge/woodpecker-ci-self-hosted.html'
ghp_series: ''
ghp_disqus_shortname: ''
---

# 用旧笔记本自建 Woodpecker CI：从选型到 Gitee 适配

![封面图：旧 T410 笔记本运行 Woodpecker CI 的私有 CI 架构](/assets/resources/20260926-woodpecker-ci-self-hosted/cover-zh.jpg)

私有仓库的 CI 一旦提交频繁，GitHub Actions 的算力时间和存储配额就会见底，而从中国大陆访问 GitHub 还经常超时。本文用一台退役的 ThinkPad T410（4 核 CPU、8GB 内存）跑起 Woodpecker，把月度 CI 成本降到 0 元，并彻底摆脱网络依赖。你会看到完整的选型、架构、Gitee 适配补丁与迁移前后对比。

## 一、为什么是 Woodpecker，不是 Jenkins

GitHub Actions 对开源慷慨，但私有仓库受算力时间和存储配额双重限制；自托管 Runner 又依赖从国内连 GitHub，网络不稳随时瘫痪。国内没有免费云 CI 替代，要么付费要么自建。Jenkins 功能全但太重，老笔记本带不动。

横向对比四种方案：

| 方案 | 优点 | 缺点 | 适合 |
|---|---|---|---|
| GitHub Actions 云 Runner | 免维护、全球节点 | 私有收费、国内网络不稳 | 海外团队、开源 |
| GitHub 自托管 Runner | 可控、免费 | 需网络隧道、连 GitHub 不稳 | 有稳定海外服务器 |
| Jenkins | 功能全、生态大 | 内存大、Java 重 | 大型团队、有运维 |
| Woodpecker 自托管 | 极轻量、Go 单二进制、低资源 | 社区版精简、Gitee 需补丁 | 旧硬件、个人/小团队 |

T410 这种老设备，Jenkins 连启动都吃力；Woodpecker 的 Server 是 Go 单二进制，内存通常 <100MB，刚好压在运行门槛上。

## 二、架构：构建与发布分离

四个角色：

- **Woodpecker Server（T410）**：拉取 Gitee 代码、调度任务、管理流水线状态。
- **构建 Agent（Windows / macOS）**：执行编译。Windows 覆盖 Windows、OHOS、Linux（WSL2）；macOS 覆盖 macOS、iOS、Android、WASM。
- **Linux Agent**：只把构建产物打包发布，不编译。
- **Gitee 源头 + GitHub 镜像**：Gitee 是真相源，GitHub 仅同步副本。

所有主机在内网、无公网暴露。Gitee Webhook 无法反向访问内网，所以 CI 触发**不靠 Webhook，而靠内部脚本定时轮询 Gitee 变更，再调用 Woodpecker API 主动触发流水线**。

![Woodpecker Agents 按标签路由构建任务](/assets/resources/20260926-woodpecker-ci-self-hosted/wookpecker-agents.png)

四条设计原则：内网部署、构建与发布分离、敏感信息全走 Secrets、Gitee 为源头 GitHub 为镜像。

## 三、关键配置：Secrets、Job 与 Agent 路由

Secrets 在仓库设置界面添加，运行时注入，可按分支/标签做变量级权限控制，避免 PR 泄露令牌。

![Woodpecker Secrets 配置界面](/assets/resources/20260926-woodpecker-ci-self-hosted/wookpecker-secrets.png)

Job 支持矩阵构建与缓存加速：构建阶段由 Windows / macOS Agent 并行，打包发布由 Linux Agent 汇总。

![Woodpecker Job 多平台构建配置](/assets/resources/20260926-woodpecker-ci-self-hosted/wookpecker-job.png)

![Woodpecker 仓库状态与触发器配置](/assets/resources/20260926-woodpecker-ci-self-hosted/wookpecker-repos-status.png)

Agent 用标签路由：`windows` 接 Windows/OHOS/Linux 构建，`macos` 接 macOS/iOS/Android/WASM 构建，`linux` 只做打包发布。

## 四、让 Woodpecker 支持 Gitee

社区版原生只支持 GitHub、GitLab、Bitbucket。我们基于官方仓库打了补丁，新增 Gitee 作为 SCM：注册 OAuth2 回调与 Webhook 解析、适配 Gitee 的 Push / Pull Request 事件格式、修正镜像同步时的分支标签结构。补丁已开源在 [KylinLabAI/woodpecker](https://github.com/KylinLabAI/woodpecker)。

部署五步：拉取镜像或源码编译 → 配置 Gitee OAuth2（Client ID / Secret）→ 添加 Gitee 仓库授权 → 编写内部触发脚本 → 补全 Secrets。

## 五、收益：最贵的是确定性

| 指标 | GitHub Actions | Woodpecker 自托管 |
|---|---|---|
| 月度成本 | 私有仓库按分钟计费 | 0 元 |
| 网络稳定性 | 国内频繁超时 | 内网拉取 <50ms |
| 单次构建 | 平均 8 分钟 | 构建 3–4 分钟 + 发布 1 分钟 |
| 存储焦虑 | 频繁清理 | 本地按需管理 |

省下的钱是次要的，**真正值钱的是确定性**——CI 不再因 GitHub 网络波动失败，也不再因配额耗尽中断发布。

## 六、避坑提醒

- 并行 >2 时 T410 CPU 吃紧，建议 Agent 分散到更多设备，或并发限制在 1–2；任务增长可加一台轻量 VPS。
- 内网轮询间隔 30–60 秒：太短加重 Gitee 负载，太长引入延迟；脚本需高可用，避免单点故障阻塞流水线。
- 构建产物要在构建 Agent 与 Linux Agent 间可靠传递（共享存储或 Artifact），否则发布节点找不到产物。

---

## 总结与延伸阅读

- 旧硬件 + Woodpecker = 可用的私有 CI 方案，资源占用远低于 Jenkins。
- Gitee 补丁 + 内网脚本触发 + 多平台 Agent，让国内开发者无需翻墙无缝接入。
- 自托管 CI 的核心价值是确定性。

完整补丁与示例配置见 [KylinLabAI/woodpecker](https://github.com/KylinLabAI/woodpecker)。如果你在旧硬件上跑 CI 踩过坑，欢迎在评论区聊聊。
