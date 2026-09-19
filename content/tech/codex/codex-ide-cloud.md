---
title: "IDE、Cloud、GitHub 与手机"
date: "2026-09-20"
author: "洛洛"
excerpt: "* 扩展 ID：openai.chatgpt（VS Code Marketplace 发布者 openai）"
tags: ["luoluo", "迁移"]
---

除了 CLI 和桌面 App，Codex 还有四类入口。它们共用同一个 ChatGPT 账号和同一套 `AGENTS.md`。

## IDE 扩展

* 扩展 ID：`openai.chatgpt`（VS Code Marketplace 发布者 `openai`）
* 支持 **VS Code 及其分支**（Cursor、Windsurf）、**JetBrains 全家桶**（IntelliJ IDEA、PyCharm、WebStorm、Rider 等，2025.3 起原生集成）、**Xcode**（26.3 起）

```bash
code --install-extension openai.chatgpt
```

能力：

* 编辑器里直接引用打开的文件、选中代码、最近会话（这一点 CLI 没有，CLI 要手动 `@`）
* 改动在源码旁**内联审阅**后再应用
* 可以把任务一键委派到 Codex cloud
* 与 CLI 共享登录态和 `~/.codex/` 配置

登录方式：ChatGPT 账号、API key，JetBrains 用户还可以用 JetBrains AI 订阅。IDE 扩展目前**不支持 Plugins**。

## Codex cloud

在 OpenAI 托管的**隔离容器**里跑任务，可以并行、可以关电脑走人。

上手：

1. chatgpt.com 登录，进入 Codex
2. 连接 GitHub，选仓库
3. 配置云端环境：依赖、setup 脚本、环境变量、secrets、联网权限
4. 描述任务
5. 审阅结果：summary + diff，可以要求修改，也可以直接转成 PR

入口不止网页：GitHub、Linear、Slack 都能发起云端任务。CLI 侧的 `codex cloud` / `codex apply` 见 [子代理与并行](/tech/codex/codex-multi-agent)。

云端任务的模型目前是 `gpt-5.6-sol`；本地会话与云端任务**共用同一个 5 小时额度窗口**。

并行原则：按包、模块、Issue、测试目标切分任务，避免两个任务改同一批文件。

## GitHub

* **代码审查**：PR 里评论 `@codex review`，或开启自动审查；规则写在 `AGENTS.md` 的 `## Code Review Rules`。详见 [代码审查](/tech/codex/codex-review)
* **修问题**：`@codex fix the P1 issue`
* **开任务**：其他 `@codex` 提及都会以 PR 为上下文开一个云端会话
* **GitHub Action**：`openai/codex-action@v1`，见 [非交互模式与 CI](/tech/codex/codex-exec-ci)

前提是仓库已在 Codex cloud 里启用环境。

## Slack

在频道或帖子里 `@Codex` + 需求，它读取上下文、起一个云端任务、回帖给结果链接。Slack Marketplace 里搜 "OpenAI Codex"。Plus / Pro / Business / Edu / Enterprise 可用。

## 手机：Codex Remote

ChatGPT 手机 App（iOS / Android）作为跑在 Mac / Windows 上的 Codex 的实时控制台：

* 看活跃线程、终端输出、截图、diff、测试结果
* 切线程、审阅、**批准命令**、切模型、起新任务
* 一对一扫码配对

2026-05-14 以预览形式推出，所有计划（含 Free）可用；后续转正并支持 Windows 宿主。

## Sign in with ChatGPT

2026-07 起，Airtable、GitLab、HubSpot、Notion、Supabase、Vercel 等第三方开发平台支持"用 ChatGPT 登录"，让 Codex 直接接入这些服务（Beta）。

## 一张图理清入口

| 入口     | 运行在哪      | 适合                                 |
| ------ | --------- | ---------------------------------- |
| CLI    | 你的终端      | 脚本、CI、精细控制、SSH                     |
| 桌面 App | 你的电脑      | 并行线程、审阅队列、Automations、Computer Use |
| IDE 扩展 | 你的编辑器     | 边写边问、内联审阅                          |
| Cloud  | OpenAI 容器 | 关电脑走人、大批量并行、从 GitHub / Slack 发起    |
| GitHub | PR        | 代码审查、修 Issue                       |
| 手机     | 控制你的电脑    | 路上批准、看进度                           |

## 参考来源

* IDE 扩展：[https://learn.chatgpt.com/docs/codex/ide](https://learn.chatgpt.com/docs/codex/ide)
* JetBrains 集成：[https://blog.jetbrains.com/ai/2026/01/codex-in-jetbrains-ides/](https://blog.jetbrains.com/ai/2026/01/codex-in-jetbrains-ides/) （2026-01）
* Codex cloud：[https://learn.chatgpt.com/docs/cloud](https://learn.chatgpt.com/docs/cloud)
* GitHub 集成：[https://learn.chatgpt.com/docs/third-party/github](https://learn.chatgpt.com/docs/third-party/github)
* Codex GA 公告（Slack 集成、SDK）：[https://openai.com/index/codex-now-generally-available/](https://openai.com/index/codex-now-generally-available/) （2025-10-06）
* Codex Remote：[https://openai.com/index/work-with-codex-from-anywhere/](https://openai.com/index/work-with-codex-from-anywhere/) （2026-05-14）
