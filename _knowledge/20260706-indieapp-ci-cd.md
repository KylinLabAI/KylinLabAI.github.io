---
title: A Low-Cost CI/CD Approach for Indie Apps
platform: github-pages
language: en-US
lang: en
date: '2026-07-06'
slug: indieapp-ci-cd
description: >-
  How to set up a zero-cost CI/CD pipeline for indie apps using Gitee + GitHub
  Actions
keywords:
  - CI/CD
  - GitHub Actions
  - Gitee
  - indie developer
  - automation
tags:
  - CI/CD
  - GitHub Actions
  - Gitee
  - indie developer
  - automation
category: IndieDev
word_count: 1500
author: kylinlab.tech
layout: knowledge-article
permalink: /knowledge/indieapp-ci-cd.html
published: true
excerpt: >-
  Indie developers often skip CI/CD early on because it feels expensive or
  complicated. But you can set up a fully automated release pipeline for zero
  cost using a combination of Gitee and GitHub Actions, with repository
  mirroring keeping both platforms in sync.
image: ''
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/indieapp-ci-cd.html'
ghp_series: IndieDev Toolchain
---

# A Low-Cost CI/CD Approach for Indie Apps

How to set up a zero-cost CI/CD pipeline for indie apps using Gitee + GitHub Actions.

---

## Why CI/CD Matters Early

When developing an app, it's important to think about CI/CD early. In the initial stage, we want to keep costs low, so we start with free solutions. Self-hosted options require servers and ongoing maintenance, which are not cheap or necessary at the beginning. A free cloud-based solution is a better fit and can be upgraded later if the project grows.

---

## Free Options to Consider

There are several free options available:

| Service | Free Tier | Ecosystem |
|---------|-----------|-----------|
| GitHub Actions | Unlimited for public repos | Excellent |
| GitLab CI/CD | 400 minutes/month | Good |
| Gitee Go | 500 minutes/month | Moderate |

From the perspective of free usage minutes, GitHub Actions is the strongest choice.

---

## Why Gitee + GitHub

In China, accessing GitHub from local networks can be unstable, which is inconvenient for daily work. For everyday source code management, Gitee is more practical.

The solution: combine both platforms.

- **Gitee** for daily source code management (fast access)
- **GitHub** for CI/CD and release automation (generous free tier)

This setup is especially useful for publishing releases on a weekly or monthly basis.

---

## CI/CD Pipeline Design

The pipeline works as follows:

```
Gitee repository → mirror push → GitHub repository → GitHub Actions → GitHub Release
```

The workflow is triggered by a tag push.

### Workflow Configuration

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Release Command

```sh
git tag -a v1.0.0 -m "version 1.0"
git push origin v1.0.0
```

Because Gitee mirrors the tag to GitHub, the workflow is triggered automatically. The pipeline then builds, tests, and publishes the release package.

---

## Workflow and Release Artifacts

The workflow process looks like this:

![workflow](/assets/resources/workflow.png)

The published release packages are shown below:

![release packages](/assets/resources/app-release.png)

You can also view the release directly here:

[GitHub release link](https://github.com/KylinLabAI/DouXia-App/releases/tag/v1.0.0)

---

## Benefits

1. **Zero cost**: Both platforms offer generous free tiers for public repositories
2. **Low maintenance**: No servers to manage, no Jenkins to upgrade
3. **Automated releases**: One tag push triggers the entire pipeline
4. **Best of both worlds**: Fast daily development + powerful CI/CD
5. **Scalable**: Add more steps as the project grows

---

## Summary

This approach keeps the initial setup simple and affordable while still providing a reliable release workflow. It is a practical solution for indie developers who want automation without a large upfront investment.

Start with the minimal setup — just automated builds and releases — then expand with testing, deployments, and other features as your project grows.
