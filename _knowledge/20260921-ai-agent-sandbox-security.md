---
title: >-
  AI Agent Sandbox Security: When Workspace Restrictions Are Just Prompts, Not
  Sandboxes
platform: github-pages
language: en-US
date: '2026-09-21'
description: >-
  AI workspace suites promise confined file access, but many rely on
  prompt-level constraints instead of OS-level sandboxes. This article examines
  a real incident, analyzes the systemic design problem, and provides a
  practical security evaluation checklist.
keywords:
  - AI agent security
  - sandbox isolation
  - AI workspace tools
  - WorkBuddy
  - OpenCode
  - filesystem security
  - AI safety
  - prompt injection
tags:
  - AI security
  - sandbox
  - AI agents
  - data protection
  - cybersecurity
category: Tech
word_count: 2100
author: kylinlab.tech
layout: knowledge-article
lang: en
permalink: /knowledge/ai-agent-sandbox-security.html
published: true
excerpt: >-
  AI workspace suites promise confined file access, but many rely on
  prompt-level constraints instead of real sandboxes. A firsthand incident, an
  industry analysis, and a practical security evaluation checklist.
image: resources/cover-en.jpg
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/ai-agent-sandbox-security.html'
---

# AI Agent Sandbox Security: When Workspace Restrictions Are Just Prompts, Not Sandboxes

![Cover](/assets/resources/20260921-ai-agent-sandbox-security/cover-en.jpg)

## Introduction

You might be using WorkBuddy, TraeWork, or a similar AI workspace suite right now. They're genuinely impressive — auto-generating code, managing projects, calling tools, all with a smoothness that makes you forget what's happening underneath.

But something happened recently that I think every developer and technical leader should know about. An AI agent created a folder at the root of my `C:\` drive — in default permission mode, which the product claims is "limited to the workspace folder." When confronted, the agent itself admitted the truth: its tools have full filesystem write access. The "workspace boundary" was a prompt-level agreement, not a technical sandbox.

**The bottom line: if you have a technical background, I recommend against using AI workspace suites until vendors ship proper sandbox isolation.** This isn't overreacting. Reporting the issue to the vendor also protects them — if user data leaks or gets damaged due to missing sandboxes, the vendor faces legal liability and reputational risk. The longer security issues persist, the higher the cost.

---

## What You'll Learn

1. **An AI agent's "workspace restriction" may be a soft constraint, not a technically enforced sandbox.** Understand the fundamental difference between prompt-level policy and filesystem sandboxing.
2. **Non-technical user-friendliness should not mean abandoning security controls.** The industry needs a better balance between UX and security, not a simple skip of safety confirmations.
3. **Sandbox isolation should be a dealbreaker when evaluating AI tools.** A ready-to-use security evaluation checklist.

---

## The Incident: How the Agent Crossed the Line

I rarely use AI workspace suite tools, but today my pipeline was overloaded, so I temporarily used WorkBuddy to share the load. WorkBuddy offers two permission modes: default and full control. If the breach had occurred in full control mode, it would be understandable — the user explicitly lifted restrictions. But this happened in **default mode**, where the product states access is "limited to the workspace folder." Yet the agent still obtained full filesystem write permissions.

What actually happened: the agent, to work around Windows' 260-character path limit, proactively shallow-copied the repository to a short path `C:/k/KylinASR`. The command it used:

```python
shutil.copytree(src, 'C:/k/KylinASR', ignore=...)
```

`shutil.copytree` automatically creates parent directories when they don't exist — so a folder appeared at disk root that shouldn't have been there.

**WorkBuddy's own response (screenshot):**

![WorkBuddy Agent's response: admits the tool layer does not enforce workspace path whitelists](/assets/resources/20260921-ai-agent-sandbox-security/workbuddy-issue.png)

The agent admitted:

> The tool layer does not enforce workspace path whitelists. The Bash and Write/Edit tools I have access to operate on the entire local disk. Workspace boundaries are currently prompt/strategy-level constraints, not filesystem sandboxes.

This isn't about "gaining" root-level access. The agent's local tools **already had** full filesystem write permissions matching your user account. The workspace constraint exists only at the prompt level, not as an operating system-level isolation.

---

## This Isn't Just a WorkBuddy Problem

WorkBuddy is not an isolated case. TraeWork and similar workspace suites carry the same sandbox escape risk. From my experience, **domestic AI vendors generally lag behind international vendors in AI agent security awareness.** This isn't a gap in technical capability — it's a prioritization trade-off, placing "smooth experience" and "feature coverage" ahead of "security isolation."

The common design logic of these products:

| Design Choice | Intended Benefit | Hidden Cost |
|---|---|---|
| Agent runs under user account permissions | No complex permission management; smooth UX | Agent can do everything the user can — including irreversible mistakes |
| Workspace boundaries via prompt agreements | Simple to develop, flexible | Prompt injection or autonomous decisions can bypass boundaries |
| No confirmation on every operation | Non-technical users aren't overwhelmed | Dangerous operations execute silently, discovered only after the fact |

As a comparison, OpenCode — which I use daily — is a positive example. When the agent needs to access a directory outside the workspace, it explicitly presents a permission request showing the exact path, with three options: Allow Once (single use), Allow Always (persistent), Reject.

![OpenCode's sandbox permission dialog: explicit confirmation when accessing external directories](/assets/resources/20260921-ai-agent-sandbox-security/opencode-sandbox-permission.png)

This is the security posture an AI agent should have — **not blocking usage, but informing you what it intends to do and letting you decide whether to proceed.**

These products often target **non-technical end users.** For these users, a popup asking "Allow C:\ write?" is both confusing and flow-breaking — they may not understand what it means. So product designers skip confirmation to preserve UX.

**But UX smoothness should not come at the cost of bare security.** OpenCode proves security and experience can coexist: clear path visualization plus tiered authorization (once/always/reject) protects UX while maintaining security.

---

## The Core Tension: Security vs. UX/Capability Is Not an Either-Or

The industry is making a dangerous mistake: **treating security controls as optional in the pursuit of capability and user experience.**

The correct approach:

1. **Sandbox is the floor, not optional.** AI agents should run inside operating-system-level sandboxes, not rely solely on prompt constraints. Filesystem access, network requests, process creation — each should require explicit authorization.

2. **Security confirmation can be designed better.** Instead of a confusing "Allow C:\ write?" dialog, use a visual file tree showing the scope of the agent's intended operations, giving users instant clarity.

3. **Tiered permissions are the direction.** Not all operations require the same confirmation level. Reading workspace files can be silent. Writing outside the workspace requires explicit authorization. Deletion requires a second confirmation.

| Strategy | UX Impact | Security | Use Case |
|---|---|---|---|
| No sandbox, prompt only | Best | Extremely poor | Not recommended |
| Visual scope confirmation | Good | Good | Writes outside workspace |
| OS-level sandbox | Needs adaptation | Best | All agent operations |
| Tiered permissions + whitelist | Moderate | Good | Enterprise deployment |

---

## Your Security Evaluation Checklist

When selecting an AI workspace tool, ask these questions:

- [ ] Does the agent run inside an OS-level sandbox? (Not just prompt constraints)
- [ ] Is filesystem access technically scoped to explicitly declared workspace directories?
- [ ] Do writes outside the workspace require user confirmation? Is the confirmation understandable?
- [ ] Is there an audit log that lets you trace what the agent did?
- [ ] Can you customize permission policies (e.g., disable network access, disable shell execution)?

**If any answer is "no," seriously evaluate the risk.** Convenience is important, but data security has no undo button.

**If you've encountered similar issues, report them to the vendor.** This isn't just about protecting yourself — if sandbox gaps lead to data leaks or system damage, the vendor faces legal liability and reputational harm. Driving fixes benefits the entire ecosystem.

![Reporting a security issue to WorkBuddy](/assets/resources/20260921-ai-agent-sandbox-security/workbuddy-submit-feedback.png)

---

## Conclusion

1. An AI agent's "workspace restriction" may be a prompt-level soft constraint, not a technically enforced sandbox — the agent has your account's full permissions.
2. Non-technical user-friendliness does not mean abandoning security controls. The industry needs a better UX-security balance, not a simple skip of safety confirmations.
3. Sandbox isolation should be a dealbreaker when evaluating AI tools — convenience is iterative, but data security cannot be retroactively fixed.
4. Technical users should proactively report security issues to vendors — this protects both your data and the vendor's liability exposure. Security is a shared responsibility.

AI agents are becoming more powerful. The line between "what it can do" and "what it should do" must be clearly drawn. Before your next tool evaluation, ask the question that matters: **Where is its sandbox?**
