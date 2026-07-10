---
title: 一台廉价 ECS + 双镜像站：三层静态拆分方案
platform: github-pages
language: zh-CN
lang: zh
date: '2026-07-05'
slug: jekyll-cloudflare-pages-deploy
description: 用 Jekyll + GitHub Pages + Cloudflare Pages 搭建双镜像部署方案，解决独立开发者的稳定官网和高频内容发布问题
keywords:
  - Jekyll
  - GitHub Pages
  - Cloudflare
  - ECS
  - CI/CD
tags:
  - Jekyll
  - GitHub Pages
  - Cloudflare
  - ECS
  - CI/CD
category: Tech
word_count: 2000
author: kylinlab.tech
layout: knowledge-article
permalink: /zh/knowledge/jekyll-cloudflare-pages-deploy.html
published: true
excerpt: >-
  独立开发者在早期容易陷入两个极端：把所有东西堆在一台 ECS
  上导致频繁部署不稳定，或者过度配置导致成本过高。本文分享一套折中方案——将稳定官网和高频内容拆分到两个独立仓库，用一次 Jekyll 构建同时部署到
  GitHub Pages（海外入口）和 Cloudflare Pages（国内入口）。
image: ''
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/zh/knowledge/jekyll-cloudflare-pages-deploy.html'
ghp_series: DevOps 工具链
---

# 一台廉价 ECS + 双镜像站：三层静态拆分方案

用 Jekyll + GitHub Pages + Cloudflare Pages 搭建双镜像部署方案，解决独立开发者的稳定官网和高频内容发布问题。

---

## 引言

独立开发者早期容易陷入两个极端：

1. **过度集中**：把官网、博客、Demo 都堆在一台 ECS 上，每次改博客都要重新部署整站
2. **过度配置**：还没想清楚业务就上 CDN、WAF、多地域集群，月账单过高

加上访问地理分布问题：国内用户访问 ECS 没问题，但海外用户打开慢；海外用户访问 GitHub Pages 流畅，但国内用户时断时续。

本文分享一套在生产环境稳定运行的折中方案。

---

## 架构总览

### 三层架构

```
Layer 1: 内容仓库 (Jekyll)
    │  git push
    ▼
Layer 2: GitHub Actions (一次构建，双镜部署)
    │
    ├──▶ GitHub Pages (海外入口)
    │
    └──▶ 同步仓库 → Cloudflare Pages (国内入口)

Layer 3: ECS 稳定官网 (纯静态 HTML)
    ├── 首页 / 产品介绍 / 关于
    └── 精选卡片 → 指向两个镜像站
```

### 设计规则

1. **ECS 站绝不包含完整的博客/演示列表页**：只展示 3–4 个封面 + "更多→镜像" CTA
2. **Jekyll 内容仓库里写过的内容，绝不复制粘贴回 ECS 仓库**：镜像站就是唯一的全文载体
3. **中文详情链接一律指向 Cloudflare Pages，英文详情链接一律指向 GitHub Pages**

---

## 代码实现

### GitHub Actions 流水线

```yaml
name: Build & Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
      - run: bundle install
      - run: bundle exec jekyll build
      - uses: actions/upload-artifact@v4
        with: { name: _site, path: _site }

  deploy-github-pages:
    needs: build
    runs-on: ubuntu-latest
    permissions: { pages: write, id-token: write }
    steps:
      - uses: actions/download-artifact@v4
      - uses: actions/deploy-pages@v4

  deploy-pages-repo:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
      - name: Push to sync repo
        env: { GH_PAT: ${{ secrets.GH_PAT }} }
        run: |
          REPO_URL="https://user:${GH_PAT}@github.com/user/sync-repo.git"
          git clone "$REPO_URL" sync && cd sync
          rm -rf ./* && cp -r ../_site/* .
          git add -A && git commit -m "Deploy" && git push --force
```

### Cloudflare Pages 配置

- 绑定专用同步仓库
- 构建命令：留空
- 输出目录：留空
- 分支：main
- SSL：Full (strict)

---

## 效果对比

| 指标 | 实施前 | 实施后 |
|---|---|---|
| ECS 部署频率 | 每发博客可能重部署 | 一两个季度动一次 |
| 内容发布时间 | 需要手动部署到多个地方 | `git push` 一次，1–2 分钟后两个镜像站同步 |
| 额外成本 | 可能有 CDN 费用 | 零额外成本 |
| 访问体验 | 国内或海外必有一方差 | 两边都在可用线以上 |

---

## 复现步骤

1. 准备两个 GitHub 仓库：内容 Jekyll 仓库、专用 Pages 同步仓库
2. 内容仓 Secrets 配置：`GH_PAT`、`GH_USERNAME`、`GH_EMAIL`
3. Actions 写 `build` job 产出 `_site` artifact，两个并行部署 job
4. Cloudflare Pages 绑定专用同步仓库，构建命令和输出目录留空
5. ECS 静态官网：把中文/英文分类链接写死到镜像域名

---

## 总结

这套方案的核心价值在于：

1. **拆分职责**：稳定官网和高频内容分离，互不影响
2. **一次构建，双镜输出**：GitHub Pages + Cloudflare Pages 同时部署
3. **零额外成本**：全部利用免费额度

已在生产环境稳定运行，建议独立开发者从这个最小配置开始尝试。
