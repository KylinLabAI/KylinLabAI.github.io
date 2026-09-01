---
layout: knowledge-article
title: 一个真相源养 Skill：不成熟、天天改，也不怕改崩
subtitle: >-
  用 skill-manager 把 install 也 symlink 到 repo，编辑一次，repo 与 8 个 Agent 运行时同时更新，彻底消灭
  repo↔install 的复制来回
platform: github-pages
language: zh-CN
lang: zh
date: 2026-09-01T00:00:00.000Z
slug: single-source-skill-sync
description: >-
  把 Skill 的 install 也做成指向 repo 的符号链接，你只在 repo 改一次，repo 与 8 个 Agent
  运行时同时更新，复制税与漂移同时归零，卸载只删链接不碰源。
keywords:
  - Skill 管理
  - 符号链接
  - 单一真相源
  - AI Agent
  - skill-manager
tags:
  - Skill 管理
  - AI Agent
  - 效率工具
  - AI 工程
category: Tech
word_count: 1500
author: kylinlab.tech
permalink: /zh/knowledge/single-source-skill-sync.html
published: true
excerpt: >-
  把 Skill 的 install 也做成指向 repo 的符号链接，你只在 repo 改一次，repo 与 8 个 Agent 运行时同时更新，彻底消灭
  repo↔install 的复制来回，复制税与漂移同时归零。
toc: true
ghp_canonical_url: 'https://kylinlabai.github.io/zh/knowledge/single-source-skill-sync.html'
ghp_series: AI 高性价比使用策略
ghp_disqus_shortname: ''
---

# 一个真相源养 Skill：不成熟、天天改，也不怕改崩

![封面图：一个真相源养 Skill——不成熟、天天改，也不怕改崩](/assets/resources/20260901-single-source-skill-sync/cover-zh.png)

> 把经验沉淀成 Skill 的人，都会熬过一段「Skill 还没成熟、每天都在改」的日子。真正磨人的不是「装到好几个 Agent」——那开源安装器早解决了——而是 repo 与「已安装目录」之间的那次手工复制。把 install 也做成指向 repo 的符号链接，你只在 repo 改一次，repo 与所有运行时同时更新。

## 真痛点在哪：repo 与 install 的复制来回

开源安装器（如 `npx skills`）把 Skill 装到某运行时目录（如 `~/.agents/skills`），其它 Agent 再 symlink 过去，多 Agent 看同一份，这部分很漂亮。但它没解决的是 **repo 与「已安装目录」之间的复制**：

- 你在 Agent 里改进了 Skill，改动只落在已安装目录，想并回 repo（唯一真相源）得手动复制一次；
- 反过来在 repo 里改好，又得重新 install 才能回 Agent 验证。

Skill 越不成熟、改得越勤，这趟手工复制越频繁、越烦。

## 方案：install 即链接到 repo

`skill-manager` 把 install 也 symlink 到 repo：真实 Skill 目录是唯一真相源，它在 8 种 Agent 运行时（`~/.trae-cn`、`~/.claude`、`~/.codebuddy`、`~/.qoder`、`~/.qoder-cn`、`~/.lingma`、`~/.zcode`、`~/.agents`）下各建一个符号链接。你只改真实目录，所有 Agent 下次加载即生效，**无需重装**。

```bash
# 把本地 Skill 链进所有 Agent 运行时（只建符号链接，不复制）
python <skill-path>/scripts/manage.py add /path/to/local/skill

# 不再用时，只删链接、保留源
python <skill-path>/scripts/manage.py remove <skill-name>
```

关键区别：开源安装器的 install 是 repo 的一份**副本**（改进落点有两个）；`skill-manager` 的 install 是 repo 的一个**链接**，repo 与 install 是同一份文件的两个名字，改进落点只有一个。

## 为什么敢天天改：三条自我保护

- **绝不覆盖已有内容**：目标已有真实文件/目录则跳过并报错；只可能替换一个已有的符号链接，绝不动真实文件。
- **名字带校验**：skill 名只允许字母、数字、`-`、`_`、`.`（不含路径分隔符），从根上杜绝路径穿越。
- **没有 update 命令**：本地 Skill 改完即生效，不需要 update；需要 update 的是外部 Skill，那属于 `npx skills` 的活。

## 收益：把「复制来回」归零

| 维度 | 复制方案 | 链接方案 |
|------|---------|---------|
| repo↔install 复制税 | 每次都有 | 0 |
| 漂移风险 | 高 | 0 |
| 改完再 install 往返 | 常有 | 消失 |
| 卸载安全 | 怕误删源 | 只删链接 |

## 复现要点

- 先把 `skill-manager` 本身链进你的 Agent，再由它去链别的 Skill。
- 确认本地 Skill 目录含 `SKILL.md` 且 frontmatter 合法。
- 运行链接命令，把它链进所有 Agent 运行时。
- 随便改一行源目录里的 `SKILL.md`，在该 Agent 里直接验证已生效（无需重装）。
- 用 `ls -l` 确认某 Agent 运行时里是符号链接而非副本。
- 外部、跨仓库的成熟 Skill 用 `npx skills add` 安装——别用链接。

## 总结与延伸

本地演进期用 skill-manager（install 即链接），外部稳定 Skill 用 `npx skills`（install 即副本）——两者分工，不是替代。下次 Skill 进入「天天改」期，先链成单一真相源再迭代，因为 install 就是 repo 的链接，改一次，repo 和所有 Agent 一起更新，根本没有第二份会和你脱节。

工具已开源：

- `skill-manager`：https://github.com/KylinLabAI/kylinlab.tech.skills/tree/master/skills/skill-manager
- 同仓库（放你自己的本地 Skill）：https://github.com/KylinLabAI/kylinlab.tech.skills
- 外部稳定 Skill 清单（`npx skills add`）：https://github.com/KylinLabAI/kylinlab.tech.skills/tree/master/external-skills
