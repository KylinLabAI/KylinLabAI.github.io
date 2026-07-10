---
title: Zero-Cost User Feedback System for Indie Developers
platform: github-pages
language: en-US
lang: en
date: '2026-07-05'
slug: user-feedback-solution-for-indie-dev
description: >-
  How to build a free, globally accessible user feedback pipeline using Tally,
  Cloudflare Workers, and GitHub Issues
keywords:
  - user feedback
  - indie developer
  - cloudflare
  - github
  - serverless
tags:
  - user feedback
  - indie developer
  - cloudflare
  - github
  - serverless
category: IndieDev
word_count: 2000
author: kylinlab.tech
layout: knowledge-article
permalink: /knowledge/user-feedback-solution-for-indie-dev.html
published: true
excerpt: >-
  Indie developers face three challenges when building user feedback systems:
  cost, global coverage, and disconnected R&D workflows. This article presents a
  zero-cost solution using Tally forms, Cloudflare Workers, and GitHub Issues
  that solves all three problems.
image: ''
toc: true
ghp_canonical_url: >-
  https://kylinlabai.github.io/knowledge/user-feedback-solution-for-indie-dev.html
ghp_series: IndieDev Toolchain
---

# Zero-Cost User Feedback System for Indie Developers

How to build a free, globally accessible user feedback pipeline using Tally, Cloudflare Workers, and GitHub Issues.

---

## Introduction

User feedback is the lifeblood of product iteration for indie developers. But building a reliable feedback system often presents three significant challenges:

1. **Cost Pressure**: Professional tools have restrictive free tiers or expensive paid plans
2. **Global Coverage**: Tools accessible in China often fail overseas and vice versa
3. **R&D Disconnect**: Feedback data siloed in third-party platforms requires manual syncing

I solved all three with a **zero-cost, globally accessible solution** that integrates directly with GitHub workflows.

---

## Why This Solution Matters

### The Status Quo

| Solution | Cost | China Accessible | Overseas Accessible | R&D Integration |
|----------|------|------------------|---------------------|-----------------|
| Paid Feedback Tools | High | Mixed | Mixed | Good |
| Google Forms | Free | No | Yes | Poor |
| Tencent Tools | Limited Free | Yes | No | Poor |
| Custom Backend | High | Yes | Yes | Best |

### The Better Way

My solution combines three free tools that together create a production-ready feedback pipeline:

- **Tally**: Unlimited submissions, global CDN
- **Cloudflare Workers**: 100K requests/day free
- **GitHub Issues**: Free for public repos, native developer workflow

---

## Architecture Overview

```
App Feedback Button → Tally Form (WebView) → Webhook → Cloudflare Worker → GitHub Issues
```

### Core Components

1. **Tally Form**: Customizable feedback collection with hidden fields for device metadata
2. **Cloudflare Worker**: Serverless function that receives webhooks and creates GitHub Issues
3. **GitHub Issues**: Structured feedback tracking with full developer workflow integration

### Design Principles

- **No Vendor Lock-In**: Only generic tools; easy to migrate
- **Async-First**: Webhooks don't block user experience
- **Traceable**: Each feedback gets a unique ID for tracking
- **Privacy-First**: Device info is hashed; no PII collected

---

## Implementation

### App Integration

```typescript
const feedbackId = generateUUID()
const params = new URLSearchParams({
  device_id: hashDeviceInfo(),
  os_type: getOS(),
  app_type: 'desktop',
  feedback_id: feedbackId
})
const url = `https://tally.so/r/your-form-id?${params.toString()}`
openWebView(url)
```

### Cloudflare Worker

**Lookup Route** (`/lookup`):
```typescript
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  const feedbackId = url.searchParams.get('feedback_id')
  const html = `
    <h1>Feedback Received!</h1>
    <p>Your feedback ID: ${feedbackId}</p>
    <a href="https://github.com/repo/issues?q=FeedbackID:${feedbackId}">
      Track your feedback
    </a>
  `
  event.respondWith(new Response(html, { headers: { 'Content-Type': 'text/html' } }))
})
```

**Webhook Route** (`/webhook`):
```typescript
async function handleWebhook(request) {
  const data = await request.json()
  await fetch(`https://api.github.com/repos/repo/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: `Feedback: ${data.feedback_id}`,
      body: `Device: ${data.os_type}\nDescription: ${data.description}`
    })
  })
  return new Response('OK', { status: 200 })
}
```

---

## Key Technical Considerations

### Async Race Condition

**Problem**: Tally webhooks are asynchronous. Page redirects happen faster than GitHub Issue creation.

**Solution**: Use static GitHub search links instead of real-time queries. The Issue will exist when users click the link.

### Hidden Field Persistence

**Problem**: Tally hidden fields only read URL params on first load.

**Solution**: Disable refresh in WebView. Use `Referer` header as fallback.

### Webhook Limitations

**Problem**: Can't control Tally via webhook responses.

**Solution**: Use Tally's built-in redirect feature.

---

## Results

| Metric | Before | After |
|--------|--------|-------|
| Development Time | 2+ days | 1-2 hours |
| Monthly Cost | $50+ | $0 |
| Feedback Response | Hours | Real-time |
| Global Coverage | Partial | Full |

---

## Getting Started

1. Register Tally account and create feedback form
2. Deploy Cloudflare Worker with `/lookup` and `/webhook` routes
3. Configure Worker environment variables (`GITHUB_TOKEN`, `GITHUB_REPO`)
4. Set Tally webhook and redirect URLs
5. Integrate feedback button in your app

---

## Conclusion

This zero-cost feedback system solves the three biggest challenges indie developers face: cost, global accessibility, and R&D integration. It's production-ready, requires minimal maintenance, and integrates seamlessly with GitHub workflows.

The system is currently running for [DouXia](https://github.com/KylinLabAI/DouXia-App). Give it a try for your next project!
