---
title: 'Building a Global Static Site on a Budget: Jekyll + Dual Mirror Deployment'
platform: github-pages
language: en-US
lang: en
date: '2026-07-05'
slug: jekyll-cloudflare-pages-deploy
description: >-
  A three-layer architecture using Jekyll, GitHub Pages, and Cloudflare Pages
  for indie developers
keywords:
  - jekyll
  - github pages
  - cloudflare
  - ecs
  - devops
tags:
  - jekyll
  - github pages
  - cloudflare
  - ecs
  - devops
category: Tech
word_count: 2000
author: kylinlab.tech
layout: knowledge-article
permalink: /knowledge/jekyll-cloudflare-pages-deploy.html
published: true
excerpt: >-
  Indie developers often face a dilemma: they need a stable website for
  business, but also want to publish content frequently. This article presents a
  three-layer architecture that separates stable website from frequent content,
  deploying to both GitHub Pages (international) and Cloudflare Pages (China)
  from a single Jekyll build.
image: ''
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/jekyll-cloudflare-pages-deploy.html'
ghp_series: DevOps Toolchain
---

# Building a Global Static Site on a Budget: Jekyll + Dual Mirror Deployment

A three-layer architecture using Jekyll, GitHub Pages, and Cloudflare Pages for indie developers.

---

## Introduction

Indie developers often face a dilemma: they need a stable website for business partners and clients, but also want to publish blogs, demos, and knowledge base articles frequently. The tension between "keep it stable" and "ship content fast" can seem impossible to reconcile.

This article presents a three-layer architecture that solves both problems simultaneously.

---

## The Problem

Two common traps for indie developers:

1. **Monolithic Server**: Everything on one ECS instance. Every content update risks breaking the entire site.

2. **Over-Engineering**: CDN, WAF, multi-region clusters before product-market fit. Monthly bills exceed revenue.

Plus the global access challenge:
- GitHub Pages works great overseas but is unreliable in China
- Chinese CDNs work great domestically but are slow overseas

---

## The Architecture

### Three Layers

```
Layer 1: Content Repository (Jekyll)
    │  git push
    ▼
Layer 2: GitHub Actions (build once, deploy twice)
    │
    ├──▶ GitHub Pages (International)
    │
    └──▶ Sync Repo → Cloudflare Pages (China)

Layer 3: ECS Stable Site (Pure Static HTML)
    ├── Homepage / Product / About
    └── Featured Cards → Links to mirrors
```

### Design Rules

1. **ECS never contains full content lists**—only featured cards + CTAs
2. **Jekyll content never copied back to ECS repo**—mirrors are single source of truth
3. **English → GitHub Pages, Chinese → Cloudflare Pages**—hardcoded in ECS HTML

---

## Implementation

### GitHub Actions Workflow

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

### Cloudflare Pages Configuration

- Connect to sync repo
- Build command: empty
- Output directory: empty
- Branch: main
- SSL: Full (strict)

---

## Results

| Metric | Before | After |
|--------|--------|-------|
| ECS Deployments | Per blog post | Once per quarter |
| Content Publishing | Manual multi-step | Single `git push` |
| Additional Cost | Potential CDN fees | $0 |
| Global Access | Partial | Full coverage |

---

## Conclusion

This three-layer architecture offers an optimal balance for indie developers:

- **Stability**: Stable website separated from frequent content
- **Simplicity**: One build, dual deployment
- **Cost**: All tools operate within free tiers
- **Global Access**: Both China and overseas users get reliable access

Ready to implement? Start with the minimal configuration and expand as needed.
