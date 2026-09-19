---
title: "Codex 桌面 App"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "* 2026-02-02：Codex app for macOS 独立发布（Apple Silicon，macOS 14+）"
tags: ["洛洛", "转载"]
---

Codex 桌面 App 是 CLI 之外最主要的入口。它把 CLI 的全部能力包成图形界面，再加上 CLI 没有的东西：自动 worktree、定时自动化、审阅队列、Computer Use、内置浏览器。

## 先弄清一个断代

* **2026-02-02**：Codex app for macOS 独立发布（Apple Silicon，macOS 14+）
* **2026-03-04**：Windows 版发布
* **2026-07-09**：Codex app **并入 ChatGPT 桌面 App**，成为与 Chat、Work 并列的一个模式；旧 ChatGPT 桌面版改名 ChatGPT Classic
* **2026-08-11**：Linux 桌面预览版（Ubuntu / Debian 的 `.deb`、Fedora 的 `.rpm`，x64 与 ARM64）

所以 2026-07 之前的截图和教程说的"Codex app"，现在对应的是 **ChatGPT 桌面 App → Codex 标签**。功能一脉相承，入口变了。

## 安装

* macOS / Windows：从 chatgpt.com 下载 ChatGPT 桌面 App，登录后切到 Codex 标签
* Linux：预览版，暂无 Computer Use
* 所有 ChatGPT 计划（含 Free）都能进入 Codex 模式，额度不同

桌面 App 与 CLI **共享配置**：`~/.codex/config.toml`、`AGENTS.md`、Skills、MCP、Hooks 都通用。

## 核心能力

### 多线程与 worktree

每个任务是一个 thread。开新 thread 时可以选在本地目录直接改，或让 App 自动创建一个 **Git worktree**（共享 `.git`，独立工作副本），多个 thread 互不干扰。`/worktree` 命令、Handoff（在本地与 worktree 之间搬运会话和代码）都是桌面独有。默认 worktree 处于 detached HEAD，用"Create branch here"转成分支。

### 审阅队列

所有 thread 的产出汇总到一个结构化队列，逐个 diff 审阅：接受、修改、拒绝。2026-07 起可以**直接在 diff 里内联编辑**，侧栏还能审 GitHub PR。

### Automations

定时（cron）、Webhook 或手动触发的无人值守任务，可选跑在本地目录或专用后台 worktree 上。典型用法：每天早上跑一遍依赖更新检查、每次 CI 失败自动分析、每周整理 TODO。

### 权限模式

三档：**Ask for approval**（默认）、**Approve for me**（设置里叫 Auto-review，沙箱不变，越界审批交给自动审查 Agent）、**Full access**。语义和 CLI 的 [沙箱与审批](/tech/codex/codex-sandbox-approvals) 一致。

### Computer Use 与内置浏览器

* **Computer Use**（2026-04 起）：Codex 在后台操作你的电脑（有自己的光标），验证 UI、跑手工流程
* **内置浏览器**：可以直接在页面上圈选批注下指令；2026-07 起支持浏览器历史搜索
* **Chrome 扩展**（2026-05 起）：Codex 在你真实的浏览器会话里工作，不只是沙箱

### 图片与语音

内置 gpt-image-1.5 出图与图片编辑；GPT-Live 语音模式（2026-07）。

### 多文件夹项目

一个 project 可以包含多个本地文件夹并指定主文件夹（2026-07-23 起），适合前后端分仓的项目。

### 从 Claude Code / Cursor 导入

Settings → Import 可以把 Claude Code、Claude Cowork、Cursor 的指令、设置、Skills、插件、项目和近期会话导进来，并可开启自动同步（2026-08-11 起）。CLI 对应 `/import`。

### Computer History（可选）

macOS 上把你在各应用和网站的活动整理成可检索的时间线，供 ChatGPT 和 Codex 使用。默认关闭，只记事件不截图不录音，可选择哪些应用参与、随时暂停或删除。Pro / Business / Enterprise 可用，欧盟、瑞士、英国暂不开放。

## 手机端：Codex Remote

ChatGPT 手机 App（iOS / Android）可以作为跑在 Mac / Windows 上的 Codex 的实时控制台：看进度、看 diff、批准命令、切模型、起新任务。一对一扫码配对。详见 [IDE、Cloud、GitHub 与手机](/tech/codex/codex-ide-cloud)。

## 桌面 vs CLI 怎么选

| 想要                      | 用                |
| ----------------------- | ---------------- |
| 并行多个任务、可视化审阅            | 桌面               |
| 定时自动化不写脚本               | 桌面 Automations   |
| 需要 Computer Use / 浏览器批注 | 桌面               |
| 脚本、CI、SSH 到服务器上用        | CLI              |
| 精细控制沙箱、Hooks、Rules      | CLI（桌面读同一份配置）    |
| 手边只有手机                  | Codex Remote 连桌面 |

两者不是二选一：很多人在桌面里开 thread，用 CLI 做 `codex exec` 自动化，用同一份 `~/.codex/config.toml`。

## 参考来源

* Codex app 发布：[https://openai.com/index/introducing-the-codex-app/](https://openai.com/index/introducing-the-codex-app/) （2026-02-02）
* GPT-5.6 与桌面合并公告：[https://openai.com/index/gpt-5-6/](https://openai.com/index/gpt-5-6/) （2026-07-09）
* 每周新功能（Linux 预览、导入、Computer History）：[https://learn.chatgpt.com/docs/whats-new](https://learn.chatgpt.com/docs/whats-new)
* 更新日志：[https://learn.chatgpt.com/docs/changelog](https://learn.chatgpt.com/docs/changelog)
* Git worktree：[https://learn.chatgpt.com/docs/environments/git-worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)
* 权限模式：[https://learn.chatgpt.com/docs/permission-modes](https://learn.chatgpt.com/docs/permission-modes)
* Codex Remote：[https://openai.com/index/work-with-codex-from-anywhere/](https://openai.com/index/work-with-codex-from-anywhere/) （2026-05-14）
