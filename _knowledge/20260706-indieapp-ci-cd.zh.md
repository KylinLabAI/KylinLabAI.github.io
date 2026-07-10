---
title: 独立开发者的低成本 CI/CD 方案
platform: github-pages
language: zh-CN
lang: zh
date: '2026-07-06'
slug: indieapp-ci-cd
description: 用 Gitee + GitHub Actions 搭建零成本 CI/CD 流水线，打 tag 自动触发构建和发版
keywords:
  - CI/CD
  - GitHub Actions
  - Gitee
  - 独立开发
  - 自动化发布
tags:
  - CI/CD
  - GitHub Actions
  - Gitee
  - 独立开发
  - 自动化发布
category: IndieDev
word_count: 1500
author: kylinlab.tech
layout: knowledge-article
permalink: /zh/knowledge/indieapp-ci-cd.html
published: true
excerpt: >-
  独立开发者做 App 要不要早期就上 CI/CD？要，但不用花大钱。用 Gitee 管日常代码（国内访问快），GitHub Actions
  跑流水线（免费额度足），仓库镜像自动同步，打一个 tag 自动触发构建、测试、发布包，整套流程零成本、低维护。
image: ''
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/zh/knowledge/indieapp-ci-cd.html'
ghp_series: IndieDev 工具链
---

# 独立开发者的低成本 CI/CD 方案

用 Gitee + GitHub Actions 搭建零成本 CI/CD 流水线，打 tag 自动触发构建和发版。

---

## 为什么早期就要上 CI/CD

做 App 开发，CI/CD 不是"等做大了再考虑"的事——越早搭越好。

早期预算有限，自托管方案需要服务器和持续维护，成本不低也没必要。免费云方案更合适，项目长大了再升级也不迟。

---

## 免费方案怎么选

市面上常见的免费 CI/CD 方案：

| 服务 | 免费额度 | 生态 | 国内访问 |
|------|----------|------|----------|
| GitHub Actions | 公共仓库无限 | 极好 | 不稳定 |
| GitLab CI/CD | 每月 400 分钟 | 好 | 一般 |
| Gitee Go | 每月 500 分钟 | 一般 | 极好 |

从免费使用时长来看，**GitHub Actions 是最强的选择**。

---

## 为什么选 Gitee + GitHub

问题来了：GitHub Actions 这么好，但国内访问 GitHub 不稳定，日常开发用起来不方便。

折中方案：**两个平台组合用**。

- **Gitee**：日常代码管理，国内访问快，提交代码不用等
- **GitHub**：CI/CD 和发版自动化，免费额度足，生态好

通过仓库镜像自动同步，两边各取所长，零成本搞定。

---

## 流水线设计

整套 CI/CD 流水线的流程：

```
Gitee 仓库 → 镜像推送 → GitHub 仓库 → GitHub Actions → GitHub Release
```

触发条件：**打 tag 推送**。每次打一个 `v*` 格式的 tag，自动触发整个流水线。

### Workflow 配置核心

```yaml
on:
  push:
    tags:
      - 'v*'
```

### 发版命令

```sh
git tag -a v1.0.0 -m "version 1.0"
git push origin v1.0.0
```

Gitee 会自动把 tag 镜像到 GitHub，GitHub Actions 检测到 tag 推送，自动触发流水线：构建 → 测试 → 打包 → 发布 Release。

---

## 流水线和发版产物

整个工作流过程：

![workflow](/assets/resources/workflow.png)

发布出来的包：

![release packages](/assets/resources/app-release.png)

可以直接在这里看实际的发布页面：
[DouXia-App v1.0.0 Release](https://github.com/KylinLabAI/DouXia-App/releases/tag/v1.0.0)

---

## 这套方案的好处

1. **零成本**：Gitee 和 GitHub 公共仓库都免费，Actions 额度完全够用
2. **低维护**：不用自己搭服务器，不用管 Jenkins 升级，不用维护
3. **自动发版**：打个 tag 就自动构建、测试、打包、发布，全程不用管
4. **各取所长**：Gitee 管日常开发快，GitHub 跑 CI/CD 强，两边都不耽误
5. **可扩展**：项目长大了随时可以加更多步骤，比如自动部署、自动测试覆盖率等

---

## 总结

独立开发者早期上 CI/CD 不用搞复杂，**Gitee + GitHub Actions 的组合就够了**。

- Gitee 管日常代码，国内访问快
- GitHub Actions 跑流水线，免费额度足
- 仓库镜像自动同步，打 tag 自动发版
- 零成本、低维护，适合早期项目

建议从最小配置开始，先把自动发版跑通，再逐步完善。
