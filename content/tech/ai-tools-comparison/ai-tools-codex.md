---
title: "OpenAI Codex 概览"
date: "2026-09-20"
author: "洛洛"
excerpt: "* 开源可审计：CLI 源码公开，沙箱、审批、配置逻辑都能看"
tags: ["luoluo", "迁移"]
---

**Codex** 是 OpenAI 的 AI 编程代理。它 2025-04 以开源终端工具 **Codex CLI**（Rust 编写，Apache-2.0）起步，如今是一整套产品：终端 CLI、ChatGPT 桌面版里的 Codex 模式、VS Code / JetBrains 扩展、云端任务、GitHub 代码审查、手机远程控制。

这一页只做概览。完整用法请看 **[Codex 教程](/docs/codex)**（19 篇，按 2026-08-18 状态整理）。

## 核心特点

* **开源可审计**：CLI 源码公开，沙箱、审批、配置逻辑都能看
* **沙箱优先**：macOS Seatbelt、Linux bubblewrap、Windows 原生沙箱；默认只写工作区、不联网
* **两个正交开关**：沙箱模式（能碰什么）× 审批策略（要不要问你），组合出从只读到全权的各种姿态
* **AGENTS.md**：跨工具的项目说明约定，层级合并
* **完整 Agent 能力**：Hooks、Skills、Plugins、MCP、子代理、`/plan`、`/goal`
* **自动化**：`codex exec`、GitHub Action、TypeScript / Python SDK、可作为 MCP server
* **一个账号多入口**：ChatGPT 订阅（Free 到 Pro）通用于 CLI、桌面、IDE、Cloud、手机

## 30 秒上手

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh   # 或 npm i -g @openai/codex
codex login                                             # 浏览器登录 ChatGPT 账号
cd your-project && codex                                # 进入交互模式
```

进去之后直接说人话。默认是 Auto 模式：工作区内自由改，越界才问你。

## 入口一览

| 入口     | 适合              | 教程                                                          |
| ------ | --------------- | ----------------------------------------------------------- |
| CLI    | 脚本、CI、精细控制      | [安装](/tech/codex/codex-install) → [基础用法](/tech/codex/codex-basic-usage) |
| 桌面 App | 并行线程、审阅队列、定时自动化 | [Codex 桌面 App](/tech/codex/codex-app)                             |
| IDE 扩展 | 边写边问            | [IDE、Cloud、GitHub 与手机](/tech/codex/codex-ide-cloud)               |
| Cloud  | 关电脑走人、大批量并行     | 同上                                                          |
| GitHub | `@codex review` | [代码审查](/tech/codex/codex-review)                                  |

## 与 Claude Code 的主要差别

| 维度   | Codex                           | Claude Code         |
| ---- | ------------------------------- | ------------------- |
| 开源   | CLI 开源                          | 闭源                  |
| 沙箱   | 内置多平台沙箱，默认关网                    | 依赖权限规则与人工确认，另有沙箱运行时 |
| 项目文件 | `AGENTS.md`（跨工具通用）              | `CLAUDE.md`         |
| 订阅   | 挂在 ChatGPT 计划下                  | Claude Pro / Max    |
| 云端   | Codex cloud 是一等公民               | 以本地为主               |
| 互通   | `/import` 可导入 Claude Code 配置与会话 | —                   |

更完整的三方对比见 [三大 AI 编程工具对比](/tech/ai-tools-comparison/ai-tools-comparison)。

## 已经过时的说法

网上很多 Codex 教程停留在 2025 年，下面这些都已经变了：

* `--full-auto`、`--approval-mode suggest/auto-edit`：已删除，现在是 `--sandbox` + `--ask-for-approval`
* 审批策略 `on-failure`：已删除
* `[mcp.servers.x]`：Codex 只认 `[mcp_servers.x]`
* `[profiles.x]`：改成独立文件 `~/.codex/x.config.toml`
* `~/.codex/prompts/`：改用 Skills（`.agents/skills/`）
* Linux 沙箱 Landlock + seccomp：已改为 bubblewrap
* Windows 必须 WSL2：已支持原生
* 模型 `gpt-5-codex` / `gpt-5.1-codex`：现在是 `gpt-5.6-sol` / `-terra` / `-luna`
* 文档站 `developers.openai.com/codex`：已迁到 `learn.chatgpt.com/docs`

## 官方链接

* 文档：[https://learn.chatgpt.com/docs](https://learn.chatgpt.com/docs)
* 源码：[https://github.com/openai/codex](https://github.com/openai/codex)
* 更新日志：[https://learn.chatgpt.com/docs/changelog](https://learn.chatgpt.com/docs/changelog)
