---
layout: knowledge-article
title: 没有 Deadline 的独立开发如何不跑偏：跨平台任务管理实战
subtitle: >-
  独立开发者时间自由却易陷入技术递归耽误主线。本文分享 OpenTodoList + Syncthing + 坚果云 WebDAV
  搭建的跨平台任务管理体系，覆盖 Mac/Win/NAS/Android 多端同步，助你锚定目标高效交付。
platform: github-pages
language: zh-CN
lang: zh
date: 2026-06-30T00:00:00.000Z
slug: indiedev-project-management-toolchain
description: 独立开发者跨平台项目管理实战，基于 OpenTodoList、Syncthing 与坚果云 WebDAV 搭建四端同步任务系统，数据可控高效交付。
keywords:
  - 独立开发者
  - 项目管理
  - 任务管理
  - 跨平台同步
  - Syncthing
  - OpenTodoList
  - WebDAV
  - 效率工具
tags:
  - 独立开发
  - Syncthing
  - 任务管理
  - DevOps
  - 效率
category: IndieDev
word_count: 2366
author: kylinlab.tech
permalink: /zh/knowledge/indiedev-project-management-toolchain.html
published: true
excerpt: >-
  独立开发者的好奇心常导致技术递归，耽误主线交付。本文用 OpenTodoList + Syncthing + 坚果云 WebDAV 搭建了一套跨
  Mac/Windows/NAS/Android 四端同步的项目管理工具链，帮助锚定目标、按时交付。
image: ''
toc: true
ghp_canonical_url: >-
  https://kylinlabai.github.io/zh/knowledge/indiedev-project-management-toolchain.html
ghp_series: IndieDev 独立开发系列
ghp_disqus_shortname: ''
---

# 没有 Deadline 的独立开发如何不跑偏：跨平台任务管理实战

> 作为独立开发者，缺少外部节奏（Deadline/站会/同事）时，好奇心驱动的「递归式钻牛角尖」会在不知不觉中吞掉大半天，导致主线交付长期推迟。本文从问题→选型→架构→落地→踩坑全链路，给出一套数据可控、四端同步的任务管理实现与生产建议。

## 背景与问题

### 好奇心是成长动力，也是效率毒药

好奇心对软件工程师来说当然是正面品质——追问「为什么」、查源码、读 RFC、跑 benchmark，这几乎是我们涨经验的核心路径。但当工作环境从「有项目经理 + 迭代 Deadline + 每日站会」的公司切换到「时间完全自己说了算」的独立开发时，同一份好奇心会悄悄变成陷阱：

```
我今天的目标 → 写登录模块
   ↓ 写着写着对 JWT 某个 claim 的底层实现好奇
   ↓ 查 RFC 7519 → 跳到 OpenID Connect 的一篇博客
   ↓ 看到作者推荐的另一个鉴权方案 → 拉源码看
   ↓ 回过神：下午 3 点，登录模块还没写完
```

AI 工具让「查找-理解」循环提速了 3–5 倍，讽刺的是这让递归陷阱更容易触发——以前钻进去需要翻书、编译，现在点两下链接就到下一层了。

我需要的不是「时间管理法」，而是一套 **能记录我要做什么、我做了什么、而且跨所有工作设备都能随时读写** 的系统。

## 运行版本 / 依赖 / 实验环境

本文所有步骤都在以下配置中验证通过：

| 组件 | 版本 | 部署位置 | 说明 |
|------|------|---------|------|
| OpenTodoList | 3.45.0 (Flatpak / Win Store / Android Play) | Mac / Windows / Android | 只用到「本地数据目录」特性，不依赖任何云同步 |
| Syncthing | 1.27.0 (官方 release) | Mac (x86_64+ARM) / Windows / NAS (FreeBSD jail) | 三台设备互相同步，不设中心节点 |
| 坚果云 WebDAV | — (SaaS 服务) | 服务端 | 仅提供移动端 WebDAV 挂载点；国内延迟 < 50ms |
| rsync | 3.2.7 (NAS 自带) | NAS (桥接节点) | Syncthing 目录 ↔ WebDAV 目录双向同步，用 `--backup --backup-dir` 保存冲突版本 |
| 硬件设备 | MacBook Pro (M1) / Windows PC (x86) / 自研 NAS (FreeBSD 13) / Pixel 手机 | — | 均在同一局域网下，NAS 7×24 开机 |

## 工具选型与对比（为什么是这三件，而不是市面上的 SaaS）

我先列了自己的 **硬约束**，不符合的直接淘汰：

1. **数据永远在我手上**（不能接受 Todoist/Notion 这类「某天关服导出成问题」）
2. **桌面 + 移动端同时访问同一份任务**（手机通勤快速加一条，电脑上立刻能看到）
3. **移动端体验不能是垃圾**（Org-mode 我用了五年，但移动端真的劝退）
4. **运维成本要低**（不做自搭 Nextcloud+数据库——家里的服务已经够多了）

用这四条筛下来最终的对比表：

| 方案 | 本地文件存储 | 跨平台一致性 | 移动端体验 | 运维量 | 最终入选？ |
|------|-------------|-------------|-----------|-------|----------|
| Todoist / Things 3 | ❌ 云私有格式 | ✅ 好 | ✅ 优秀 | 0 | ❌ 不满足约束 1 |
| Org-mode + git 同步 | ✅ 纯文本 | ✅ 好但要手动 pull/push | ❌ 查改都卡顿 | 中 | ❌ 不满足约束 3 |
| Nextcloud 全家桶自搭 | ✅ 数据库 + 文件 | ✅ 好 | ✅ OK | 高（DB+缓存+反向代理+升级） | ❌ 不满足约束 4 |
| **OpenTodoList + Syncthing + WebDAV** | ✅ 结构化本地文件 | ✅ 秒级自动 | ✅ 原生 APP + WebDAV | **极低**（3 个标准组件） | **✅ 入选** |

选 OpenTodoList 的决定性理由：**每条任务的底层是结构化 JSON 普通文件**，不是任何私有数据库。我直接 `tar` 打包就是完整备份、用 `git diff` 能看到每天改了哪些任务、写 20 行 Python 就能做每个项目的任务量完成率统计。这些能力在独立开发者维度上，远超过一个「UI 好看的云 TODO」。

## 同步架构与数据流：桥接节点的设计原理

工具分别选完后出现一个分裂问题：桌面 3 台设备走 Syncthing（P2P，效率高），手机端走 WebDAV（稳定通用）。两条通路如何连接到 **同一份数据源**？

架构设计：

```
┌──────────────┐
│ MacBook Pro  │───┐
└──────────────┘    │ Syncthing P2P
┌──────────────┐    │ (多副本，抗故障)
│ Windows PC   │───┤
└──────────────┘    │
┌──────────────┐    │             ┌───────────────────────┐        ┌────────────────┐
│    NAS       │────┘────────────▶│  桥接节点 (NAS)        │        │  坚果云 WebDAV  │
│ (常开 / 7×24)│                  │  Syncthing 目录        │──rsync─▶│  同一份 todo 文件 │
└──────────────┘                  │  ↔ WebDAV 挂载目录     │◀─rsync─▶│  (全球 + 国内节点)│
                                  └───────────────────────┘        └────────┬───────┘
                                                                             │
                                                                             │ WebDAV 协议
                                                                             ▼
                                                                   ┌────────────────┐
                                                                   │ Android 手机   │
                                                                   │ (通勤/碎片访问)│
                                                                   └────────────────┘
```

**桥接节点的设计原理**：选一台常开设备（这里是 NAS；若读者没有 NAS，长期不关机的 Windows PC 也完全可以），让它同时出现在 Syncthing 网络里、又挂载坚果云的 WebDAV 目录，然后在两个本地目录之间做 rsync 双向同步。

NAS 端的实际同步任务脚本（crontab 每 10 分钟一次）：

```bash
# /root/scripts/sync-todo-bridge.sh
# 让 Syncthing 共享目录 <-> 坚果云 WebDAV 挂载点保持一致
# 关键点：--backup + --backup-dir，把冲突版本单独落盘，不直接覆盖

SRC_SYNCTHING="/tank/syncthing-share/OpenTodoList"
DST_WEBDAV="/mnt/jianguoyun-webdav/OpenTodoList"
BACKUP_ROOT="/tank/sync-conflicts/OpenTodoList"
STAMP="$(date +%Y%m%d-%H%M%S)"

# 方向1: Syncthing → WebDAV
rsync -av --delete \
  --backup --backup-dir="${BACKUP_ROOT}/syncthing-side/${STAMP}" \
  "${SRC_SYNCTHING}/"  "${DST_WEBDAV}/"

# 方向2: WebDAV → Syncthing (手机端的新增/修改回流)
rsync -av --delete \
  --backup --backup-dir="${BACKUP_ROOT}/webdav-side/${STAMP}" \
  "${DST_WEBDAV}/"  "${SRC_SYNCTHING}/"

# 冲突版本保留 30 天后自动清理
find "${BACKUP_ROOT}" -type f -mtime +30 -delete
```

> 提示：如果对一致性要求很高，可以用 `unison`（双向同步原生算法）替代 rsync 两次，代价是 CPU 和 IO 成本更高。对任务清单这种「冲突率极低、每 10 分钟一次」的场景，rsync 两遍 + 备份目录已经足够用了。

## 核心取舍：为什么不用「一个 Syncthing 通吃所有设备」

我一开始试过在 Android 上直接装 Syncthing APP。能用，但体验有 3 个硬伤：

1. **后台杀进程**：国产 Android 系统对常驻后台 P2P 同步非常不友好，通勤 1 小时加的任务，回家后还没同步——因为进程被杀了。
2. **流量与耗电**：Syncthing 要维护多台设备 discovery + keepalive，轻度使用时 1 天多耗 10–15% 电。
3. **多网络切换**：4G → 公司 WiFi → 家里 WiFi，每次切换都要重新握手，响应速度远不如「走 WebDAV HTTPS 单点请求」来得快。

所以最终接受「桌面 P2P + 移动端 HTTPS」的折中，用桥接节点把两个世界连接起来，**每个协议只做它最擅长的场景**。

## 实际运行结果与数据（1 个月量化）

我对 OpenTodoList 的 JSON 数据写了一个 20 行的脚本，导出以下指标对比「装系统前 2 周」和「稳定运行后 2 周」：

| 指标 | 系统上线前 2 周 | 系统上线后 2 周 | 变化幅度 |
|------|---------------|---------------|---------|
| 每日首个任务开工时间（从坐下到第一行提交） | 14.7 分钟 | 42 秒 | ↓ 95% |
| 「低优先级研究任务」被拖入主线打断次数（每日） | 3.2 次 | 1.3 次 | ↓ 59% |
| 周末产出的纯研究类任务完成率 | 4/17 | 11/16 | ↑ 181%（因为从「打断主线」变成「安排在周末」）|
| 每周能清晰回答「这周我交付了什么」 | 0/2（全靠回忆） | 2/2（看完成列表） | 质变 |

下面是运行中的 3 张真实截图：

任务清单主界面：

![OpenTodoList 主界面，展示每日任务分层视图](/assets/resources/todo-list.png)

任务数据的文件存储结构（平的文件目录，不是黑盒）：

![OpenTodoList 文件存储结构，展示 JSON 任务文件的目录布局](/assets/resources/todo-list-file-storage.png)

单条任务在底层的 JSON 结构：

![OpenTodoList 单条任务 JSON 详情，展示结构化字段](/assets/resources/todo-list-item-detail.png)

## 生产落地建议

综合这 1 个月的踩坑，给想照抄这套系统的朋友列 6 条「真的会遇到」的建议：

1. **先决定桥接节点，再动其他设备**。桥接节点是整个架构的逻辑单点。7×24 开机的机器优先，其次是工作日白天总开机的台式机。
2. **坚果云必须用应用专用密码**。别为了方便用主密码。WebDAV 场景下主密码泄露 = 你整个坚果云盘泄露。在坚果云后台 → 安全 → 应用管理里给 OpenTodoList 单独开一个。
3. **Syncthing 的 Introducer 只设 1 个**。不要每个设备都是 Introducer，否则会在你每次加新设备时产生难以排查的设备环问题。让 NAS 做唯一 Introducer 就够了。
4. **双向同步 + --backup-dir 是标配**。本文脚本里已经用了；千万别直接 `rsync --delete` 两遍不加备份，一个目录清空的误操作会双向把另一边也清空到渣都不剩。
5. **移动端不要做批量编辑**。WebDAV 通道是为「看 5 秒 + 加一条」优化的，不适合批量改 50 条任务——真要批量操作请回到桌面 Syncthing 侧。
6. **每个月检查一次冲突备份目录**。如果 `${BACKUP_ROOT}` 下出现大量文件，说明同步频率调得太高 / 两台设备同时写同一任务，需要拉长 rsync 间隔（15 或 20 分钟）或者在 OpenTodoList 里加个 5 秒的文件 flush 延迟。

## 总结与延伸阅读

- **独立开发者的效率问题，80% 不是「懒」，是「没有反馈回路」**。一套随手能记、随手能看、跨设备一致的任务系统，本质就是把反馈回路装上仪表盘，让你看见自己在做什么、没做什么。
- **开源开放工具组合的价值**：我选的三件都不是「最热门的那个」，但它们的接口是标准的、数据是我自己的。明年我把 NAS 换成 TrueNAS、或者把手机换成 iPhone、或者把 APP 换掉，这套同步链路 90% 不用动——这在商业 SaaS 里是不可想象的。
- 下一步我打算把同一套同步链路复用到：日记（Markdown 文件）、工作日志、项目文档（Obsidian vault）。本质都是「结构化本地文件 + Syncthing + WebDAV 桥接」。

**延伸参考**：
- Syncthing 官方文档中关于 Introducer 和 Ignore Patterns 的章节（强烈建议读一遍，能省大量排错时间）
- 坚果云 WebDAV 帮助中心：「应用专用密码」和「第三方客户端速率限制」
- OpenTodoList 作者博客：关于 Data model 和 JSON schema 的设计决策

---

> 本文属于 **IndieDev 独立开发系列**，前一篇讨论了独立开发者的收入结构设计，下一篇计划分享同一套同步链路如何复用到 Obsidian Vault 与工作日志，不想错过可通过 RSS 订阅本站更新 📡。

如果你也在搭建自己的跨设备任务系统，或者有「一旦用上就回不去」的同步组合，欢迎在评论区留下你的方案和配置——好奇大家都用什么奇怪的组合打自己的好奇心陷阱 🙌。
