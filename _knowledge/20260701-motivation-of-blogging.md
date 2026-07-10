---
layout: knowledge-article
title: Why I Started a Blog After One Month as an Indie Developer
subtitle: >-
  A concrete breakdown of five categories of work shipped in month one —
  infrastructure, AI workflow, two V1 products, PM tooling, and deep learning —
  and the boring public writing habit I'm adopting to keep month two
  accountable.
platform: github-pages
language: en-US
lang: en
date: 2026-07-01T00:00:00.000Z
slug: motivation-of-blogging
description: >-
  After one month as a solo indie developer, I couldn't name what I'd shipped.
  Here's the full itemized breakdown of real work, why losing corporate
  accountability is the hardest transition, and the two-cadence public dev log
  I'm starting now.
keywords:
  - Indie Hackers
  - Productivity
  - Startups
  - Software Development
  - Solo Founder
  - Accountability
  - Dev Journal
  - Blogging
  - AI
tags:
  - IndieDev
  - Productivity
  - Startup
  - SoloFounder
  - Accountability
category: IndieDev
word_count: 1804
author: kylinlab.tech
permalink: /knowledge/motivation-of-blogging.html
published: true
excerpt: >-
  After one month as a solo indie developer, I discovered the standups and
  status reports I hated weren't holding me back — they were holding me
  together. Here's the full itemized list of what I actually shipped in 30 days,
  and the boring public dev log habit I'm committing to for month two.
image: ''
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/motivation-of-blogging.html'
ghp_series: Indie Dev Solo Founder Journal
ghp_disqus_shortname: ''
---

# Why I Started a Blog After One Month as an Indie Developer

June 1st I closed my laptop on my last external contract, poured a celebratory coffee, and looked at my calendar. It was empty. Perfectly, gloriously empty.

No standups. No design reviews. No weekly reporting template due Friday at 5pm. No Slack pings, no release branch cutoffs, no teammate pinging me "hey your PR is blocking my work." Just me, a runway measured in months, and an ambitious-but-not-crazy roadmap for a small SaaS + tooling product.

June 30th I looked up from my desk at 6:42 pm and had a realization that genuinely shocked me.

I couldn't name what I'd shipped that month.

Not that I'd shipped nothing. I'd worked long days. I was tired. The git history was non-empty. I'd closed browser tabs numbered in the thousands. But the honest answer to "what did you actually deliver in June?" was a shoulder shrug and the word "infrastructure."

That's when I understood. Every one of those annoyances I'd spent six years complaining about — the standup, the weekly report, the arbitrary release date on the calendar that always seemed too aggressive — they weren't overhead. They were an invisible scaffold. And when you take the scaffold away, even a competent builder starts wandering.

> The single hardest transition for a new indie developer is not the tech. It's losing the low-overhead accountability system that was keeping your curiosity in check the entire time you were in a corporate job.

This is the story of that first month. What I actually built when I forced myself to write every line item down, the three accountability fixes I tried and rejected, and the boring, unglamorous habit I'm committing to for month two.

---

## The 30 minutes that changed everything: forcing myself to itemize

I opened a blank document and made a rule: only concrete, verifiable outputs. No "researched," no "evaluated," no "looked into." If I couldn't point at a git commit, a running server, an approved filing, a working binary, or a deployed endpoint, it didn't go on the list.

Thirty minutes later I had the list below. It was simultaneously more than I'd thought and way more scattered than I'd realized. This is the full list, lightly edited.

### Infrastructure (the China edition)

I live in Shanghai and I'm building for both domestic and international audiences. This makes infrastructure a specific, non-negotiable category of work that most indie-hacker writeups simply skip:

- **Alibaba Cloud server provisioned and hardened.** Not just "I spun up an instance" — security group rules audited line by line, SSH key-only auth, fail2ban, automated security updates on. Past me learned this lesson the expensive way.
- **Domain, website, HTTPS, DNS.** Bought kylinlab.tech, built and deployed a personal site, issued a wildcard cert, properly split subdomains for the blog, the product pages, and the API endpoints.
- **ICP filing + public-security filing, both fully approved.** If you've never launched a public-facing website inside mainland China: every single one requires two government filings, with the first (MIIT / ICP) taking 7–20 working days and commonly being rejected 2–3 times. Mine was rejected twice. Total elapsed time 18 working days. I wrote down every rejection reason and every fix I made, because this will be post #2 on this blog.
- **GitHub Pages + Gitee Pages dual static hosting.** Overseas traffic hits GitHub Pages. Domestic CN traffic hits Gitee Pages. Solves the classic "my GitHub Pages site takes 15 seconds to load in Shanghai" problem that nobody warns you about until you try to share your work with a local friend.

### AI workflow: the thing that actually multiplied my output

One decision I got right early: I treated AI tooling as a first-class infrastructure concern, not a "I'll try whatever's free this weekend" thing.

- **Full cross-platform, cross-model comparison run.** Multiple AI coding assistants evaluated side by side, multiple API models scored, cost-per-100k-tokens calculated for every common task type, loop-stability tested on refactor tasks over ~5k line codebases. (I wrote this up as a standalone post last week if you want the specific numbers.)
- **Final locked-in stack: ClaudeCode + DeepSeek-V4-Pro.** ClaudeCode lives in VS Code as my AI coding assistant — code understanding and long-context refactors are what sold me. DeepSeek-V4-Pro is my pay-as-you-go model for general reasoning and documentation.
- The principle: **decouple client from model. No per-product subscriptions.** I won't pay $20/month to 5 different AI tools. One good client, then buy tokens from whoever has the best price/performance ratio this quarter. Saved roughly $120/month on paper, and probably another $120/month in future switching costs.

### Two products actually at usable V1

This is the category I was most pleased to see written down, because I genuinely didn't realize I'd gotten both this far:

- **"豆匣 DouXia"** (rough translation: BeanBox) — AI Chat management tool. Multi-model conversation history, searchable archives, prompt template library. Now my most-opened tool before my browser.
- **"录匣 Recxia"** (Recording Box) — Training and workshop screen-recording tool. Built for corporate training sessions and technical meetup talks. V1 feature set = stable high-quality screen + audio capture, slide deck management. Roadmap: automatic timestamping tied to slide transitions + AI-generated captions and transcript summaries.

Plus the distribution and operations plumbing around them:
- WeChat Mini-Program + WeChat Official Account fully set up and approved (another one of those China-specific things that's easy to underestimate)
- GitHub Actions release pipeline fully automated: push to main → build → package → publish across platforms, no manual steps
- User feedback system designed and implemented: in-app entry → ticket creation → triage → tracking. Early feedback on a V1 is gold; I don't want to lose a single submission to a forgotten screenshot on my desktop.

### PM / accountability toolchain (attempt #1)

Before the blog I built a cross-platform task management stack across my MacBook, my Windows test rig, my home NAS, and my Android phone. The short version: OpenTodoList (plain structured JSON files on disk), Syncthing (P2P sync across the three desktop-class machines), a WebDAV bridge through a domestic cloud provider for the Android side, and a NAS as the always-on bridge node keeping the two sync worlds consistent.

Full write-up in my previous post if you want the exact scripts and the three real mistakes that cost me setup time. The TL;DR is that I can `grep` completed tasks per project label and it's changed how I think about my week already.

### Deep technical learning

Easy to dismiss as "not real work." Actually critical for not making stupid expensive decisions later:

- LLM fundamentals refresh: tokenization algorithms (BPE vs WordPiece vs Unigram), attention math, inference quantization schemes (GPTQ / AWQ at a practical rather than theoretical level)
- Hands-on deployment + benchmarking of 5+ open-source LLMs locally
- Quick prototyping of 3+ open-source agent frameworks, specifically to understand their failure modes instead of just their demo reels.

---

## The three accountability schemes I rejected (and the boring one I picked)

I wanted a fix for the "busy but empty" problem before I started month two. Here's what I tried or seriously considered:

**1. Private local journal (Obsidian / Markdown)**

❌ Rejected. I've started this exact habit four times. Every single time I stopped between day 11 and day 18. For personality types like mine — reasonably high social conscientiousness, reasonably low pure self-discipline — a document nobody else will ever read lacks the gravity to survive a bad night's sleep or a deadline crunch. I know this about myself. Denying it is just procrastinating.

**2. Fancy productivity SaaS**

❌ Rejected. The #1 problem isn't "I don't have a sufficiently beautiful kanban view." The #1 problem is "I don't write things down at all." Adding a more beautiful tool doesn't solve that. Also, see my AI principle above: I'm trying to reduce recurring subscriptions, not add them.

**3. Accountability buddy / mastermind group**

⚠️ Deferred. I'll probably do this eventually. But specifically not as my only mechanism. I wanted something that works on days when my buddy is traveling, or when I'm traveling, or when we're both just having a bad week and forget. A system that depends on another human's consistency is not a system.

### What I chose: public dev log, two cadences

**Daily — 10 minutes, three bullets, zero rewriting:**
1. What I shipped today (one sentence)
2. What broke today (one sentence or the word "none")
3. Tomorrow's top three (hard cap of three. If you list more, you have none)

No editing. No worrying about whether it's "good." No audience building. The entire purpose is a timestamped paper trail that I can grep next month.

**Weekly — one real post on Sunday or Monday:**
1. What I planned to ship vs. what I actually shipped (forced confrontation with the gap)
2. The top three recurring problems that week. If the same failure mode appears twice, I have to propose a concrete avoidance strategy, not just "I'll be more careful."
3. One proper technical write-up of the week's deepest curiosity rabbit hole. Turns those unproductive half-days into, at minimum, something I can reference later.

> Why public? Because the cheapest, most reliable accountability mechanism I've ever found for myself is: say it out loud to people. The tiny, low-stakes social weight of "I told people I'd write here daily" is the exact amount of gravity I need to keep writing on day 19, when my private journal would already be closed.

---

## What I'd change if I could restart month one

One thing and one thing only: I would have started this log on June 1st, not June 30th. The single most useful 30 minutes of the entire month was the 30 minutes I spent writing down the full itemized list above. I would trade at least two of the random curiosity afternoons for having that record from day zero.

If you're reading this and you're in week one or week two of your own indie-hacker journey: stop, open a text file, and write the three bullet version of today right now. Don't wait until the end of the month to find out what you actually did.

---

If this resonated — if you've also stared at a blank commit log at the end of a Tuesday wondering where twelve hours went — try the simplest possible version of this tonight. No blog, no website, no platform. A text file named `2026-07-01.md`. Three bullets. Save it somewhere.

That's it. That's the whole habit. Everything else I built on top is just making that easier to sustain.

**Up next in the Indie Dev Solo Founder Journal:** the full, unvarnished walkthrough of the Chinese ICP + public-security filing process, including the exact rejection notices I got twice and the fixes that finally worked. Bookmark this site or subscribe via RSS if you don't want to miss it.

If you're walking the solo-dev path, subscribe via RSS or follow the series links. Drop your own accountability hack in the comments. I reply to every one.
