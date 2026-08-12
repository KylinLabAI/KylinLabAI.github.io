---
layout: knowledge-article
title: "Multimodality Is Not a Bonus: A Single IDE Screenshot Test of DeepSeek vs kimi-k2.7"
subtitle: "One IDE backend Credits screenshot contrasts ClaudeCode + DeepSeek's OCR degradation with CodeBuddy + kimi-k2.7's native multimodal understanding — and why multimodality is the hard gate for getting the task done."
platform: github-pages
language: en-US
lang: en
date: 2026-08-12
slug: "multimodal-ai-model-comparison"
description: "A hands-on test with one IDE screenshot compares DeepSeek (ClaudeCode / CodeBuddy) and kimi-k2.7 on image understanding, exposing how OCR degrades context and why native multimodality is the real gate."
keywords: ["multimodal", "DeepSeek", "kimi-k2.7", "OCR", "ClaudeCode", "CodeBuddy", "model comparison"]
tags: ["Multimodal", "LLM", "AI Evaluation"]
category: "Tech"
word_count: 0
author: "kylinlab.tech"
permalink: "/knowledge/20260812-multimodal-ai-model-comparison.html"
published: true
excerpt: "One IDE screenshot test: ClaudeCode + DeepSeek fails via OCR (misreads '30 days' as $30K) while CodeBuddy + kimi-k2.7 reads UI hierarchy natively. Multimodality is a hard gate, not a bonus."
image: "/assets/resources/20260812-multimodal-ai-model-comparison/cover.en.png"
toc: true
ghp_canonical_url: "https://kylinlabai.github.io/knowledge/20260812-multimodal-ai-model-comparison.html"
ghp_series: ""
ghp_disqus_shortname: ""
---

# Multimodality Is Not a Bonus: A Single IDE Screenshot Test of DeepSeek vs kimi-k2.7

![Cover: a dark IDE credits-usage page with a time-filter dropdown and model usage table](/assets/resources/20260812-multimodal-ai-model-comparison/cover.en.png)

I've always used DeepSeek as my primary workhorse model — it's cost-effective and covers the vast majority of my daily tasks. But the moment a task requires *reading an image*, DeepSeek falls flat, and that's when I switch to another model.

For this test I picked the most ordinary engineering scenario: ask an AI to read an IDE's backend "Credits usage" screenshot, understand the time filter, the table columns, and the billing meaning, then answer follow-up questions. The main comparison is two paths:

- **ClaudeCode + DeepSeek**: attaching the image directly errors out; giving a file path "works" but is really propped up by OCR.
- **CodeBuddy + kimi-k2.7**: truly understands the image natively and spots the time-range contradiction the screenshot never states out loud.

And finally a supplementary path — **CodeBuddy + DeepSeek**: it *does* "read" the image, but my test only went as far as "read and describe"; the real test is doing a concrete task *after* reading, and that's exactly where the text-description path breaks down.

If you're also choosing models or IDEs, this one screenshot shows the chasm between "can accept an image" and "can understand an image."

## The test scenario: one very ordinary backend screenshot

My test material is a Qoder IDE backend "Credits" page screenshot: at the top is a time-range filter dropdown (Today / Last 7 days / Last 30 days / Custom, currently expanded and covering part of the table columns), below is the usage-record table. The most telling detail — "Last 30 days" is selected, the range shows "Jul 12 – Aug 11", yet the earliest actual record in the table is only Jul 28.

![Test screenshot: the Credits page](/assets/resources/20260812-multimodal-ai-model-comparison/snapshot-ui-layout.png)

Seemingly simple, but to answer well the AI must simultaneously understand:

- The dropdown is expanded and covers columns 4–5, and the dropdown items themselves are part of the page state.
- The real meaning of the table columns (time, duration, source, action, model tier).
- The semantic relationship between the "7/12 – 8/11" range and the "Last 30 days" option, and its contradiction with the table's data boundary.

Let's look at the three paths.

## Scenario 1: ClaudeCode + DeepSeek

### Drag the image into chat: hard error

I sent the screenshot as a direct attachment to ClaudeCode (model: DeepSeek) and got:

> "I'm sorry, but I'm unable to read the snapshot images you've attached — they're showing as '[Unsupported Image]' in this conversation..."

The model told me plainly: this environment doesn't support this image format or attachment method, suggesting I paste it, describe it in text, or save it to the working directory and use the `Read` tool.

![ClaudeCode attachment error](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-attach-images.png)

### Switch to a file path: runs, but quality is shaky

So I tried another path: sent the local file path of the screenshot to ClaudeCode. This time it called the `Read` tool to read the file, then *thought* it had produced a summary.

But reading its "thinking process," the problem is obvious: after realizing it can't read the image, it probed for available OCR tools, finally called `tesseract` to do OCR, and hand-assembled the table from the OCR result.

![ClaudeCode reading the file path](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-image-file-path.png)

![ClaudeCode OCR driver](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-image-file-path-ocr-driver.png)

![ClaudeCode OCR loop](/assets/resources/20260812-multimodal-ai-model-comparison/request-claudecode-deepseek-image-file-path-ocr-process.png)

Eventually it produced a summary:

![ClaudeCode final answer](/assets/resources/20260812-multimodal-ai-model-comparison/response-claudecode-deepseek-image-file-path.png)

### The fundamental flaw of the OCR route

This "summary" is **almost entirely wrong**, and there's one telling misread. Because OCR itself **doesn't support Chinese**, it misread most of the Chinese backend text; the most critical one: the dropdown's "Last **30 days**" was misrecognized by OCR, and because it has no concept of hierarchy, it mixed the dropdown item into the first table row, so "30 days" got inserted into the first row and wrongly became "**$30K**". The model, handed this garbled text, even *guessed* it was a $30K charge (guessing it's $30K) — but the real screenshot has no such amount at all.

More broadly, ClaudeCode didn't even understand these basic structures:

- There's an **expanded dropdown** covering columns 4–5, yet the dropdown items "Today / Last 7 days / Last 30 days / Custom" are themselves part of the page state.
- The table columns aren't simply "Record ID / Duration / Cost / Source / Model" but the Chinese backend's "时间 / 时长 / 来源 / 操作 / 模型分级" (time / duration / source / action / model tier).

The biggest problem with OCR isn't recognition rate — it's the **lack of hierarchy and position awareness**. It jumbles the dropdown text with the table text, flattening UI upper-layer elements and body content into the same line of text. By the time the model gets this blob of text, it's impossible to reconstruct "what the image was trying to express."

That explains why so many "can read images" tasks end up low quality: it's not that the model isn't trying, it's that the input was already corrupted once.

## Scenario 2: CodeBuddy + kimi-k2.7

### Reading the same test screenshot: native multimodality sees the hierarchy at a glance

Finally I sent the same screenshot to CodeBuddy — I selected **Auto** in the model picker (not kimi-k2.7 directly), and the CodeBuddy platform showed it was actually calling **kimi-k2.7**. The answer quality is clearly different.

It points out a detail an OCR route could almost never catch:

> "The dropdown shows 'Today / Last 7 days / Last 30 days / Custom', column 5 shows Qwen3.7-Max, but column 4 (source) and column 5 (action) are covered by the dropdown."

![CodeBuddy + kimi-k2.7 answer](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-k27.png)

### A real work analysis: done in a separate chat session

The image below is *not* the above controlled test — it's a **real work analysis I completed in a separate chat session using the same Auto config (CodeBuddy again showed kimi-k2.7)**: I asked it to do a concrete analysis task based on this screenshot, not just "read and describe." In the real task, kimi-k2.7 infers from the "Last 30 days" dropdown selection and the "Jul 12 – Aug 11" display that the actual earliest data is only Jul 28, and points out the contradiction between "API returns earliest only 7/28" and "Last 30 days should start from 7/13".

![CodeBuddy + kimi-k2.7 real work analysis](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-k27-with-question-context.png)

This reasoning requires:

- Recognizing the dropdown is **expanded**.
- Understanding the dropdown text and table content are **not on the same hierarchy**.
- Associating the "Last 30 days" option with the "7/12 – 8/11" range semantically.
- Then comparing against the actual table data boundary.

This isn't easily done after OCR, because it depends on understanding the **page's spatial structure and UI semantics** — exactly the kind of capability a real work task truly needs.

## Supplementary scenario: CodeBuddy + DeepSeek ("read" the image, but the test was incomplete)

The two above are the main comparison. Here's one more path: in CodeBuddy, send the same screenshot to DeepSeek. It **did "read" the image** — at least on the surface it gave a structured, correct-looking answer, correctly identifying the two tabs, the secondary tab, the time filter, and the table columns.

![CodeBuddy + DeepSeek answer](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-deepseek.png)

But strictly speaking, my test was **incomplete**: I only asked it to "read the image and describe it", not to "complete a concrete task after reading." Once you enter the "do something after reading" step, the gap shows.

Its answer is key:

> "Although I myself (the DeepSeek series) genuinely lack native multimodal vision capability, the detailed summary you see is because the IDE (CodeBuddy) did a layer of preprocessing in between."

The flow:

1. User sends image → image arrives at the IDE/client first.
2. The IDE **silently switches/borrows a multimodal vision model** to preprocess, extracting the image's text and rough content description into text.
3. The processed text is injected into DeepSeek's context.
4. DeepSeek summarizes based on this text version of the description.

![CodeBuddy + DeepSeek explains preprocessing](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-deepseek-reason.png)

In other words, **it's not DeepSeek that truly read the image, but a hidden vision model CodeBuddy called in the backend**. The backend request log shows the model is `deepseek-v4-pro` with extremely low cost — but that's only the "organize text" step; the vision understanding already happened silently on the client side.

![CodeBuddy backend request record](/assets/resources/20260812-multimodal-ai-model-comparison/response-codebuddy-deepseek-backend-data.png)

### Why "can read" ≠ "can do the task well"

The key is to see two essentially different pipelines:

- **Multimodal model**: `image → AI model → target task`. The model encodes the image directly, carrying complete spatial, hierarchical, and state information into the downstream task.
- **Non-multimodal model** (like DeepSeek here, patched by the client): `image → other tool/multimodal model → text description of image → AI model guesses the image from the text description → target task`.

In the second pipeline, DeepSeek **never directly saw the image** — it only got a "text description of the image", then *guessed* what the image looked like from that description, then did the task.

And the problem lies precisely in the "text description of the image" step — it **cannot reconstruct much of the image's information, especially position**. For example, the screenshot has an error somewhere, but *which region the error appears in, which input area it belongs to, what module is next to it* — none of that is in the text description. You only have a pile of flattened characters, unable to reconstruct "what the image actually looked like."

Once you reach the concrete problem-solving step ("what to do after reading"), the model **lacks the critical context** and can't do the task well: it doesn't know the spatial relationships between elements, doesn't know which state is active, and naturally can't produce high-quality answers that require understanding those details. In other words, however accurate the text description, it's only a shadow of the image; the quality ceiling of the downstream task was already locked at this first step.

So CodeBuddy + DeepSeek did "read" the image, but that read went through a hidden multimodal model switch, and the downstream task only got "the text description of the image" rather than the image itself. Whether this patch holds up depends on how much the task relies on the image's original context — the more it needs position, hierarchy, and state details, the more likely it cracks under drill-down.

## Comparison summary

| Dimension | ClaudeCode + DeepSeek (attach) | ClaudeCode + DeepSeek (file path) | CodeBuddy + kimi-k2.7 | CodeBuddy + DeepSeek (supp.) |
|---|---|---|---|---|
| Direct image upload | ❌ No | ✅ via Read tool | ✅ Yes | ✅ Yes |
| Vision method | None | Local OCR + text injection | Native multimodal | Hidden backend vision-model preprocess + DeepSeek summary |
| Keeps position/hierarchy | ❌ None | ❌ None | ✅ Good | ❌ Loses position, occlusion, state |
| Detects dropdown occlusion | ❌ No | ❌ No | ✅ Yes | ⚠️ May miss |
| Time-range reasoning | ❌ No | ⚠️ Weak | ✅ Yes | ⚠️ Medium (depends on preprocess) |
| Answer confidence | Low | Low (hallucinates on fragments) | High | Medium (context lost, details crack) |

## What this means

### 1. "Cheap model" ≠ "cheap task"

DeepSeek's token cost is indeed low, but if your task needs to read images and the model has no native multimodal capability, then:

- Either the client does a layer of preprocessing for you, with uncontrolled quality.
- Or you build your own OCR + post-processing pipeline, whose dev and maintenance cost eats the model's price advantage.

### 2. Client-side multimodal patching is a stopgap, not a replacement

CodeBuddy + DeepSeek's approach is clever: the client silently switches a vision model to read the image, then feeds the text to DeepSeek. It works for simple scenarios, but it moves the "vision understanding" black box from the model side to the client side — and you can't even see that switch. It's hard to know:

- Which vision model did the backend actually switch to, and why is the call invisible?
- How much of the complex UI's hierarchy and position info was preserved?
- Will it mistake dropdown text for table content, or silently erase key info like "which region the error appeared in"?

For tasks needing precise image understanding, native multimodality is still the more reliable choice.

### 3. Ask one more question when choosing: "can accept images" or "can read images"?

Many products advertise "image input support", but under the hood it may just be OCR-to-text. What really decides the experience:

- Does the model natively support vision encoding?
- After uploading an image, can it understand spatial position, visual hierarchy, UI state?
- Can it reason from the image content, not just recite the text in it?

## Conclusion

1. **Multimodality is a capability, not an interface**: uploading an image is only step one; whether it can understand the image's hierarchy, position, and state decides if the task gets done well.
2. **OCR is text搬运, not visual understanding**: OCR flattens UI upper/lower elements into lines of text; the lost context derails downstream reasoning.
3. **Client preprocessing patches temporarily but can't produce native capability**: CodeBuddy + DeepSeek fits simple image+text; for complex UI, still prefer a native multimodal model.

If you have a screenshot right now that you "want to throw at the AI", ask yourself: is the info in this image mostly expressible in text, or does it require understanding what it looks like? The answer tells you which model to pick.
