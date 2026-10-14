---
title: 'Why OpenCode Subagents Feel Slower: A Four-Platform Architecture Comparison'
platform: github-pages
language: en-US
date: 2026-10-14T00:00:00.000Z
description: >-
  A side-by-side reading of OpenCode, Claude Code, CodeBuddy, and TRAE subagent
  documentation: session boundaries, permission inheritance, startup context,
  and quotas — plus a risk-based recommendation.
keywords:
  - AI agents
  - subagents
  - OpenCode
  - Claude Code
  - multi-agent workflows
  - architecture
tags:
  - AI Agents
  - Software Engineering
  - Developer Tools
  - Artificial Intelligence
category: Tech
word_count: 1720
author: kylinlab.tech
layout: knowledge-article
lang: en
permalink: /knowledge/opencode-subagent-comparison.html
published: true
excerpt: >-
  Every task in my workflow runs a local subagent code review before merge and
  push, and OpenCode consistently took longer than Claude Code, CodeBuddy, and
  TRAE. I never benchmarked it — but reading all four official docs side by
  side, the difference collapsed into one architectural question: does a
  subagent run in a fresh child session, or in a context window inside the main
  session? This post walks through all four answers, the latency cost every
  vendor documents, and a risk-based recommendation.
image: resources/cover-en.jpg
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/knowledge/opencode-subagent-comparison.html'
---

# Why OpenCode Subagents Feel Slower: A Four-Platform Architecture Comparison

![Cover image: four AI coding agents racing on the same track — OpenCode runs in heavy armor with mode: subagent, Claude Code sprints in a light suit for lightweight subtasks, CodeBuddy carries a derivation budget toolbox, TRAE holds fixed-workflow documents; a balance scale tips between low latency and strong isolation](/assets/resources/20261014-opencode-subagent-comparison/cover-en.jpg)

## Background

Every task in my workflow runs a local subagent code review before merge and push. After a few hundred iterations of that loop, one pattern became impossible to ignore: the same review delegation took noticeably longer on OpenCode than on Claude Code, CodeBuddy, or TRAE.

The limits of that observation matter, so let me state them up front. I never ran a timing harness. I could not identify which step was slow. What I had was a consistent impression — which is a question, not a conclusion.

The only honest way forward was to read all four platforms' official subagent documentation side by side and line the definitions up.

## The architectural question

Does a subagent run in a **fresh child session**, or in a **context window inside the main session**?

Nearly everything else — startup cost, isolation strength, permission model — follows from how each vendor answered this one question.

## OpenCode: a new session every time

An agent declared `mode: subagent` runs only in a child session, invoked through the `subagent` tool, with fresh context.

The permission model is where this choice is committed. From the permissions documentation: a custom subagent uses **its own** permissions, *"not a subset of its parent's."* The parent separately requires an explicit `subagent` permission before it can launch anything.

```jsonc
{
  "agents": {
    "orchestrator": {
      "permissions": [
        { "action": "subagent", "resource": "*", "effect": "deny" },
        { "action": "subagent", "resource": "general", "effect": "allow" }
      ]
    },
    "auditor": {
      "mode": "subagent",
      "permissions": [{ "action": "edit", "resource": "*", "effect": "deny" }]
    }
  }
}
```

Permission rules are ordered and the **last matching rule wins**, so a broad deny followed by a narrow allow is the idiomatic shape.

Two details worth knowing: V2 ships only `general` and `explore` as subagent-mode built-ins — the documentation specifically notes there is no built-in `scout` in V2 — and `general` ships with launching subagents denied.

## Claude Code: same session, separate context

The documentation is unusually direct: **"Subagents work within a single session."** Each subagent still gets its own context window and its own system prompt, but no new session is opened.

Permissions inherit the parent conversation by default; hard repository isolation is opt-in via `isolation: worktree`.

It also trims the startup path deliberately. The built-in `Explore` and `Plan` agents skip CLAUDE.md files and the git status snapshot by default.

There is a trap worth flagging: `omitClaudeMd` disables CLAUDE.md, but it does **not** disable the git snapshot. The docs are unambiguous — *"You can't change which subagents receive git status. Only Explore and Plan skip it."*

Quotas are documented too: nesting defaults to 3 layers (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`), and 20 concurrent subagents per session (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`), with no cap on total spawns within a session.

## CodeBuddy: separate context, explicit quotas

An independent context window, with the most precisely documented limits of the four:

| Limit | Default | Environment variable |
|---|---|---|
| Nesting depth | 5 levels | not configurable |
| Concurrent subagents | 20 per session tree | `CODEBUDDY_CODE_MAX_CONCURRENT_SUBAGENTS` |
| Spawns per session | 200 | `CODEBUDDY_CODE_MAX_SUBAGENTS_PER_SESSION` |

Its built-in `Explore` agent ships with a `lite` model tier, and MCP tools default to deferred loading — the model discovers tools via `ToolSearch` before invoking them.

One footgun: omitting the `tools` field inherits **every** tool available to the main thread, MCP tools included. Minimum privilege requires an explicit allowlist.

MCP declarations come in two forms, and the difference is real: a **string reference** borrows an already-connected global server and does not close it, while an **inline definition** is created for that subagent's session only and closed when it finishes.

## TRAE: separate context, least freedom

Also an independent context window, defined in Markdown, with intermediate reasoning kept out of the main Agent's conversation history.

Two constraints stand out: **only the built-in "Agent" can invoke Subagents**, and the `model` field accepts **only TRAE's built-in models**.

## Side-by-side

| Dimension | OpenCode | Claude Code | CodeBuddy | TRAE |
|---|---|---|---|---|
| Runtime model | Fresh child session | Context window in main session | Separate context window | Separate context window |
| Permissions | Fully independent, not a parent subset | Inherits parent, `permissionMode` overrides | Inherits all tools if `tools` omitted | `tools`/`disallowedTools` allowlist |
| Startup context | Fresh context + own permissions and tools | System prompt + CLAUDE.md + git snapshot | System prompt; `MEMORY.md` if memory enabled | System prompt |
| Context switches | None (child session is always fresh) | `omitClaudeMd` (cannot disable git snapshot) | None | None |
| Nesting limit | `general` cannot relaunch subagents | 3 layers by default | 5 layers max | Not documented separately |
| Concurrency / budget | Not documented separately | 20 concurrent, no total cap | 20 concurrent / 200 spawns | Not documented separately |
| Forced light path | Command `subagent: false` | Light by default | Built-in light `Explore` | None |

"Not documented separately" means the vendor's documentation has no dedicated entry — not that the capability is absent.

## The latency cost every vendor documents

The genuinely surprising finding was that **all four vendors acknowledge this cost**. I had assumed I was describing an OpenCode quirk; I was describing the category.

Claude Code, in its guidance on when to prefer the main conversation:

> Latency matters. A subagent that isn't a fork starts fresh and may need time to gather context.

CodeBuddy, under Performance Considerations:

> Sub-agents start from a clean state each invocation and may add latency as they gather context needed to work effectively.

Starting from a clean state on every invocation is the shared design. OpenCode simply defaults to the heavier end of the spectrum.

One documented path is cheaper than a fresh subagent: **Claude Code's fork**. A fork inherits the whole conversation, and because its system prompt and tool definitions are identical to the parent's, its first request reuses the parent's prompt cache — the documentation states that *"a fork costs less than a fresh subagent"* for tasks needing the same context.

## The `subagent` tri-state

OpenCode's `subagent` field on a command is frequently misread as a performance flag. It is the opposite.

| Value | Behaviour |
|---|---|
| `true` | Always spawn a child session |
| `false` | Always stay in the current session |
| omitted | Spawn a child only if the selected agent is `mode: subagent` |

The gap between `true` and `false` is exactly the cost of full session creation. Background execution removes blocking — it does not make startup cheaper.

## Recommendation

Classify by task risk rather than migrating tools.

**Low-risk, read-only work** — grep, summaries, quick lookups — gains nothing from a hard isolation boundary. Use `subagent: false` and skip the child session.

**Privileged work** — untrusted repositories, risky file operations, anything needing an independent audit trail — genuinely benefits from what OpenCode is paying for. Keep the default.

Several additional levers are documented: trim the tool pool per agent (MCP tools themselves consume context), assign cheaper models to exploration tasks, prefer built-in lightweight agents over custom ones, and consider Claude Code's fork when a task needs the same background repeatedly.

## What I still don't know

I have no timing data, and any number I invented would be fiction. Two gaps stood out:

**MCP connection cost** is described only in scattered fragments across all four docs. CodeBuddy's private inline MCP servers are created on subagent start and closed on finish — that appears expensive per invocation, but it is unmeasured.

**Behaviour under CI** is unaddressed here. Interactive sessions surface permission prompts as they arise; automated contexts cannot answer them, and I did not work through how these models degrade when nobody is available to approve.

## References

- [OpenCode Agents](https://opencode.ai/v2/docs/agents/)
- [OpenCode Commands](https://opencode.ai/v2/docs/commands/)
- [OpenCode Permissions](https://opencode.ai/v2/docs/permissions/)
- [OpenCode MCP servers](https://opencode.ai/v2/docs/mcp-servers/)
- [Claude Code Subagents](https://code.claude.com/docs/en/sub-agents)
- [CodeBuddy Sub-Agents](https://www.codebuddy.ai/docs/cli/sub-agents)
- [TRAE Subagents](https://docs.trae.cn/ide_subagents)
