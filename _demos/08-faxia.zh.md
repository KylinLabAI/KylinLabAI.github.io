---
layout: demo-article
title: "发匣 FaXia — 写一次，全网分发"
date: 2026-07-10
category: development
lang: zh
slug: faxia
permalink: /zh/demos/faxia.html
tags: ["博客", "发布", "Markdown", "跨平台", "自动化", "内容创作"]
description: "写一份 Markdown，同时发布到 11+ 个内容平台。开源、本地优先的桌面应用和 CLI 工具，为内容创作者而生。"
demo_link: "https://github.com/KylinLabAI/FaXia-App"
status: prototype
logo: /assets/resources/faxia/logo_256.png
---

[English](/demos/faxia.html)

# 发匣 FaXia — 写一次，全网分发

![发匣 Logo](/assets/resources/faxia/logo_256.png)

**只写一份 Markdown，同时发布到 11+ 个内容平台。再也不用一个个站点复制粘贴、调格式、传图片了。**

---

## 你遇到过这些问题吗？

你花了一个周末写完一篇技术长文。代码跑过了，配图也做好了，准备发出去让更多人看到。结果接下来发生的事情让你头大：

- 你打开 **11 个浏览器标签页**，每个平台一个，每个都要重新登录一次
- 文章内容要 **一段段复制**，表格、代码块、引用，每个编辑器的格式都不一样，手调半小时
- 本地图片要 **一张张重新上传**，外链地址一个一个替换，经常漏个一两张
- **中文平台要中文版、英文平台要英文版**，两个文件来回切、改了这边忘那边
- 折腾一小时准备收工，结果发现 **漏发了一个平台**，又要从头再来一遍

最后要么索性少发几个平台、少了曝光；要么硬生生把本该写文章的时间耗在了搬运工的活上。

## 解决方案

**发匣 FaXia** 让你只需准备一份 Markdown，它就能同时——真的是并行、不是串行——发布到所有你配置好的平台。你只管把文章写好，上传、转格式、传图、适配各个平台的奇葩规则，它全包了。

习惯命令行？用 `tdp` 终端命令一条搞定。喜欢点鼠标？打开跨平台桌面应用，拖文件、选平台、点发布就行。两种方式用的是同一套稳定的发布内核，选你顺手的。

---

## 核心价值

| 你得到什么 | 怎么做到的 |
|---|---|
| **每周多出几个小时写作** | 11+ 平台并发发布，原来一小时的搬运工活，几秒钟干完 |
| **读者在哪里都能看到你** | 原生适配 GitHub Pages、微信公众号、知乎、掘金、头条、微博、Reddit、X/Twitter、Medium、Facebook、LinkedIn |
| **图片再也不挂了** | 自动上传本地图片到每个平台的图床，URL 自动替换，发布即所见 |
| **格式每次都对** | 智能 Markdown 转 HTML + 代码高亮，针对每个平台的编辑器做过适配调优 |
| **发之前先确认，不出意外** | dry-run 模式和凭证检查，确认一切正常再真正发文，杜绝半拉子发布 |
| **内容和凭证都在你手里** | 完全开源、纯本地工具。没有云端账号，没有数据上传，没有埋点跟踪 |

---

## 核心功能

### 1. 十一大平台，一次搞定

支持 **GitHub Pages**、**微信公众号**、**知乎**、**掘金**、**头条**、**微博**、**Reddit**、**X / Twitter**、**Medium**、**Facebook**、**LinkedIn**。用 `-p` 参数挑几个发也行，全部一起发也行。有官方 API 用官方 API，没有的就用 Playwright 模拟真实浏览器操作——稳。

<!-- 截图：多平台发布面板，含平台开关和进度指示 -->

### 2. 图片自动上传 + 地址替换

你 Markdown 里插的本地图片，发匣 FaXia 会自动上传到对应平台的图床，然后把文章里的链接全部换成正确的线上地址。截图、架构图、示意图，在每个平台都能正常显示——一张都不用你手动管。

<!-- 截图：图片上传流水线，显示自动 URL 替换状态 -->

### 3. 智能更新，不重复造帖

发布过的文章 发匣 FaXia 都记着。你改了内容再发一次，它会 **更新原文**（支持的平台）而不是再发一篇新的。改个错别字、补段说明，轻松搞定。

### 4. 命令行 & 桌面端，随意切换

爱折腾的：`faxia` CLI 支持脚本化、CI 集成，批量化生产力拉满。想省事的：Electron 桌面端有可视化平台选择、凭证管理、实时预览。两边共用一套发布引擎，怎么顺手怎么来。

<!-- 截图：桌面端主界面，含平台选择器和文章预览 -->

### 5. 按平台定制不同版本

不同平台读者口味不一样。把文章放到一个目录里，`zhihu.zh.md` 专门写给知乎，`medium.md` 写给 Medium，`wechat-official-account.zh.md` 给微信公众号加个开头结尾。发匣 FaXia 按文件对号入座，每个平台收到的就是你专门给它写的那一版。

### 6. 先演练，再上场

`faxia check` 可以逐个校验每个平台的凭证有没有过期、能不能连上。`--dry-run` 把整个流程跑完但就是不真正发布。提前踩雷，杜绝发一半失败的尴尬。

---

## 快速上手

1. **下载** 对应系统的安装包，或者直接用 npm：`npm install -g faxia`
2. **配置凭证**：用桌面端设置面板，或者创建 `~/.faxia/config.json`
3. **写文章**：用 Markdown，加个 YAML frontmatter 填标题、标签、封面图、摘要（可选）
4. **一键发布**：`faxia publish 我的文章.md`，或者打开桌面端拖文件进去点按钮
5. **看结果**：每个平台返回成功/失败状态和直达链接，点一下就能看到你的大作

---

## 下载

| 平台 | 下载链接 | 系统要求 |
|------|----------|----------|
| Windows | [最新版本](https://gitee.com/KylinLab/FaXia-App/releases/latest) | Windows 10+（x64）· CLI 用户需 Node.js 20+ |
| macOS | [最新版本](https://gitee.com/KylinLab/FaXia-App/releases/latest) | macOS 11+（Intel 与 Apple Silicon 均支持）· CLI 用户需 Node.js 20+ |
| Linux | [最新版本](https://gitee.com/KylinLab/FaXia-App/releases/latest) | Ubuntu 20.04+ / Fedora 36+（x64）· CLI 用户需 Node.js 20+ |

> 下载链接在 [Gitee Releases](https://gitee.com/KylinLab/FaXia-App/releases/latest) 页面。CLI 版本现在就可以用 `npm install -g faxia` 安装使用。

---

## 隐私与数据

- **凭证只保存在你本地**：Token 和 Cookie 存在本地 `.env` 文件或本地 JSON 配置里，除了直接调用各平台 API，绝不会发到任何其他地方
- **无云端、无账号、无埋点**：纯本地工具，没有任何后端服务，没有用户统计，没有行为分析
- **开源可审计**：代码完全开放，MIT 协议，随意查看、修改、二次开发

---

## 路线图

- [x] 11 平台发布（GitHub Pages、微信公众号、知乎、掘金、头条、微博、Reddit、X/Twitter、Medium、Facebook、LinkedIn）
- [x] CLI 命令：`faxia publish`、`faxia check`、`faxia login`
- [x] Electron 桌面端：平台选择器、发布结果面板
- [x] 并发发布 + 各平台错误隔离
- [x] 发布历史记录 + 已发布文章自动更新
- [x] dry-run 演练模式 + 凭证有效性检查
- [x] 目录模式（不同平台不同文件版本）
- [x] 图片自动上传 + URL 替换
- [x] Markdown 转 HTML + 代码高亮
- [ ] 定时发布（指定日期/时间排期发布）
- [ ] 数据看板（各平台阅读数、互动数汇总）
- [ ] 模板与文章批量管理
- [ ] 自定义平台插件机制
- [ ] macOS / Windows 签名和公证

---

## 社区与支持

- [GitHub 仓库](https://github.com/KylinLabAI/发匣 FaXia-App)
- [提交 Issue](https://github.com/KylinLabAI/发匣 FaXia-App/issues)
- [平台配置指南](https://github.com/KylinLabAI/发匣 FaXia-App)
