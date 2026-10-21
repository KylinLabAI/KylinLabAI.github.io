---
layout: knowledge-article
title: 'Stop Copy-Pasting: An AI Pipeline That Publishes to 11 Platforms'
subtitle: >-
  Codify your writing rules into Skills, then let four AI components own
  drafting, covers, platform adaptation, and publishing — one draft expands into
  12 native platform files plus a bilingual cover pair.
platform: github-pages
language: en-US
lang: en
date: 2026-10-21T00:00:00.000Z
slug: ai-multiplatform-publishing-workflow
description: >-
  Codify your writing rules into Skills, then let four AI components own the
  pipeline: one draft expands into 12 native platform files plus a bilingual
  cover pair, and publishing collapses to a single click.
keywords:
  - multi-platform publishing
  - AI Skills
  - Agent workflow
  - blog pipeline
  - FaXia
tags:
  - AIWriting
  - ContentStrategy
  - Automation
  - Blogging
  - AgentWorkflow
category: Tech
word_count: 2850
author: kylinlab.tech
permalink: /knowledge/ai-multiplatform-publishing-workflow.html
published: true
excerpt: >-
  Codify your writing rules into Skills, then let four AI components own the
  pipeline — drafting, covers, platform adaptation, and publishing. One draft
  expands into 12 native platform files plus a bilingual cover pair, and
  publishing collapses to a single click.
image: /assets/img/covers/ai-multiplatform-publishing-workflow.png
toc: true
ghp_canonical_url: >-
  https://kylinlabai.github.io/knowledge/ai-multiplatform-publishing-workflow.html
ghp_series: ''
ghp_disqus_shortname: ''
---

# Stop Copy-Pasting: An AI Pipeline That Publishes to 11 Platforms

![Cover image: AI blog publishing pipeline — from one Markdown draft to 12 native platform files](/assets/resources/20261021-ai-multiplatform-publishing-workflow/cover-en.jpg)

The point of blogging is to get knowledge into readers' hands, not to trap yourself in the same manual busywork every day. We timed it: after writing one article, copying it across platforms, reformatting, re-uploading images, and rewriting for another language takes about **an hour and a half** end to end — longer than many people expect. This post walks through a real run of a pipeline that splits those four jobs into four steps, each owned by one AI component.

## Why this is worth your time

Maintaining Chinese platforms (Toutiao, WeChat Official Account, Zhihu, Weibo, Juejin) and English channels (Twitter, LinkedIn, Facebook, Reddit, Medium) plus a bilingual GitHub Pages site is the norm for many technical writers. The cost of multi-platform distribution is not in *writing* — it is in *moving*:

- **Repetition**: the same article pasted, reformatted, and re-imaged across 5–9 platforms, an hour per post minimum.
- **Formatting & images**: each platform's editor has its own quirks; local images upload one by one, and one missing file breaks a layout.
- **Bilingual pressure**: Chinese and English are two separate bodies of work; literal translation reads awkwardly, and rewriting each from scratch is expensive.
- **Edit nightmares**: a typo after publishing means logging into every platform again to fix it.

The goal is plain: **write the draft once, automate everything else** — each platform gets a version written natively for it, not the same text copied nine times.

## What we built: four steps + a file contract

Four AI components, each owning one stage, stitched together by a file contract:

- **Drafting Skill** (custom Skill + AI Agent): turns a brief and source material into a structured draft, dropped into a numbered slot; the cover is only a placeholder comment.
- **Doubao**: reads the draft body and produces a bilingual cover pair per article, saved into that article's `resources/`.
- **Platform-adaptation Skill** (custom Skill + AI Agent): expands one draft into 12 native platform files + metadata + a self-contained image copy.
- **FaXia**: a desktop "directory mode" that matches files by name and publishes to every checked platform at once.

```text
Brief + source-material folder
      │ ① Drafting Skill (Qoder Agent)
      ▼
Draft: next-<number>-<slug>/article.md   ← single source of truth; cover is a placeholder comment
      │ ② Doubao reads body → cover-zh / cover-en → resources/
      ▼
Cover placeholder comment → real "Cover & Background" section
      │ ③ Platform-adaptation Skill (OpenCode Agent)
      ▼
Publish dir YYYYMMDD-<slug>/
  ├─ _meta.md
  ├─ 12 native platform files (6 zh + 6 en)
  └─ resources/ (self-contained image copy, no link back to draft)
      │ ④ FaXia desktop: directory mode → Dry Run → Update
      ▼
Chinese 5 + bilingual GitHub Pages · English Twitter/LinkedIn/Facebook/Reddit/Medium
```

### Step ①: Drafting — one brief becomes one structured draft

In Qoder, tell the Agent "use the drafting skill to write a draft, referencing these source folders" and it produces a draft per the skill's rules. With enough source material, the first draft is already usable. The catch was scope — the topic was too big for one post, and the drafting skill already carries a guideline: **when it's too complex for one post, split into a series**. So the second message didn't complain about the first draft; it followed that guideline and re-ran, scoping to concept, mechanism, and methodology — and a 9-part series was born.

![Qoder input box: a brief + 4 source folders triggers the drafting skill](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step1-draft-prompt.png)

![Second message: per the skill's series guideline, re-run as a series draft](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step1-series-refinement.png)

Notably, neither call had the skill registered in the Agent's loader — the Agent read the `SKILL.md` directly and executed the whole workflow by hand. **The `SKILL.md` is itself an executable contract**: trigger conditions, output files, and a quality checklist are all written down, so a different Agent or model still produces the same result.

### Step ②: Covers — Doubao produces bilingual images; rules matter more than drawing

Drop the whole series folder into Doubao, open a "Create blog cover images" chat, and give it three instructions: **read the body to understand the post; make a Chinese cover; the English version copies the Chinese layout and only swaps the Chinese text for English, nothing else**.

![Doubao cover prompt: read body → Chinese cover → English version swaps text only](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step2-doubao-cover-prompt.png)

"Swap text only" is what keeps the bilingual covers from drifting — the English version isn't redrawn, it's the same composition with substituted words. On delivery Doubao volunteered the hard numbers: two images per post into that post's `resources/`, **all 1280×720, under 1 MB each**, with a unified deep-blue + cyan-glow style. Nine posts side by side read as a set, not nine drifting images.

![Delivery summary of 9 posts × zh/en covers: per-post checklist + size and style verification](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step2-doubao-covers-summary.png)

One easily missed step follows: the draft held a cover placeholder comment, which must become a real reference so the later platform-adaptation skill can detect and embed it after each title. That step is also one line in the same chat — give the target format example and the Agent rewrites all 9 placeholders at once, **about 1 minute**:

![Cover reference swap: send the format example and all 9 are fixed in ~1 minute](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step2-cover-reference-update.png)

### Step ③: Platform adaptation — one draft becomes 12 native files

This moves to OpenCode — build mode `auto`, model `MiMo-V2.6-Flash Free`, working directory at the repo root — one instruction invokes the adaptation skill across the whole series folder. Per article it produces 12 native platform files (6 Chinese `.zh.md`, 6 English `.md`), one `_meta.md` metadata file, and a self-contained `resources/` image copy — every image link resolves inside the output directory, never linking back to the draft.

![OpenCode input box: one instruction invokes the adaptation skill on the whole series folder](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-opencode-invocation.png)

![Adaptation skill output summary after running all 9 posts](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-polish-skill-output.png)

![One draft expanded into 12 platform files + _meta.md + resources/](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-platform-files-tree.png)

Scheduling the series is also one sentence: the first version put all 9 posts on the same day — can't publish everything at once — so a "reschedule" line told the Agent to renumber the 9 publish directories into 9 consecutive days; the directory name *is* the schedule:

![Reschedule result: Oct 18 → Oct 26, one per day, series order A1→C3](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step3-reschedule-schedule.png)

### Step ④: Publishing — FaXia directory mode, Dry Run then one-click Update

FaXia is a fully local, open-source multi-platform publishing tool (both CLI and desktop, sharing one engine). In the desktop app, switch to **Directory (Multi-Platform)** mode, select a publish directory, and it auto-matches by filename: `tou-tiao.zh.md` → Toutiao, `wechat-official-account.zh.md` → WeChat… Local images auto-upload to each platform's image host and links are replaced; already-published articles get **updated in place** rather than reposted.

![FaXia desktop directory mode: select a folder and it recognizes all 12 platform files](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step4-faxia-directory-mode.png)

Check only the targets you want — this run checked GitHub Pages (zh + en) and the 5 Chinese platforms, 7 targets total, leaving Facebook, LinkedIn, Reddit for later; the pipeline doesn't change. Run **Dry Run** first (full flow, no real post), then click **Update**. The result: 7 targets, **6 success, 1 pending**:

![Publish result: 6/7 platforms succeeded, per-platform status and direct links](/assets/resources/20261021-ai-multiplatform-publishing-workflow/step4-faxia-publish-results.png)

| Platform | Result | Note |
|---|---|---|
| GitHub Pages (on Gitee Pages) | ✓ Success | Both zh and en returned direct links |
| Toutiao | ✓ Success | Success signal detected; post may still be "under review" and not yet public |
| Zhihu | ✓ Success | Browser-automation publish |
| Juejin | ✓ Success | Returned a direct article link |
| Weibo | ✓ Success | Playwright browser-automation publish |
| WeChat Official Account | ⏳ In draft box | Auto-publish not allowed; manual QR scan confirmation required in the backend; API also reported unauthorized (errcode 48001), post stuck in drafts |

## Five rules that will outlast the tooling

1. **The draft directory is the single source of truth; the publish directory is a "build artifact."** To change something, edit the draft and re-run the skill — never hand-edit publish files.
2. **The platform filename is the contract.** 12 fixed filenames (e.g. `zhihu.zh.md`, `medium.md`) — the publisher matches by name; don't invent variant spellings or it won't recognize them.
3. **Cover hard constraints**: file ≤ 1 MB and ≤ 1280×720; the English cover swaps text only, not composition.
4. **Dry Run before Update; isolate single-platform failures.** One expired credential doesn't block the others.
5. **The date prefix in the directory name = the schedule.** A "one post per day" series is just 9 consecutive dated directory names — no extra scheduler.

> **The only thing that blocks auto-publishing is "must be done by a human."** Of the 7 targets, 6 published fully automatically; the only exception was WeChat Official Account, which the platform forbids auto-publishing and requires a manual QR scan in the backend. Anything the platform doesn't artificially restrict goes through in one shot. Toutiao's "success but under review" is platform review latency, still a success.

## Next step: close the loop into one app

The stages still hand off manually: the two skills fire separately in Qoder and OpenCode, covers need a separate Doubao request, and publishing switches to FaXia. We've written this "collapse into one app" as an implementation plan — let FaXia grow from "publish only" into a closed loop covering the whole content lifecycle: write → cover → review → publish → comment → reply → commit. Two red lines hold: **no auto-publish and no auto-commit by default**; **the model never certifies itself** — the gate always runs independently inside the app.

---

## Conclusion

1. **Codify your writing rules into a Skill asset**; AI Agents draft and adapt per the rules — write the rules once, reuse them for every post, with stable, predictable output.
2. **Four pipeline stages, each with one job, joined by a file contract**: one draft auto-expands into 12 native platform files plus a bilingual cover pair, and publishing collapses to a single click.
3. **Always Dry Run before publishing, and isolate failures**: one platform's limit or review delay shouldn't stall the batch; edits go through in-place updates, not reposts.

Full configs and the series live in the knowledge base: [https://kylinlab.pages.dev/knowledge](https://kylinlab.pages.dev/knowledge). If you've hit similar snags building a multi-platform publishing pipeline, drop them in the comments.
