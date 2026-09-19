---
title: "三大 AI 编程工具对比"
date: "2026-09-20"
author: "洛洛"
excerpt: "不要把模型名写死在团队规范里。更推荐写成“默认用当前供应商推荐的编码模型；复杂架构/大重构再升到更强模型”。"
tags: ["luoluo", "迁移"]
---

终端编程代理变化很快，不适合只按“谁的模型分数最高”来选。更稳的判断方式是：**你要它接管多大范围、能否接受它改文件、是否需要沙箱、团队是否已有订阅和治理要求**。

这页按 2026-08-18 的状态整理。Codex 的完整用法见 [Codex 教程](/docs/codex)。

## 当前状态

| 维度     | Claude Code              | Codex CLI                                                             | Gemini CLI / Antigravity                       |
| ------ | ------------------------ | --------------------------------------------------------------------- | ---------------------------------------------- |
| 开发商    | Anthropic                | OpenAI                                                                | Google                                         |
| 主要定位   | 工程级编码代理                  | 开源终端编码代理                                                              | Google 生态终端代理                                  |
| 开源     | 否（CLI 本体闭源）              | 是（Apache-2.0，Rust）                                                    | Gemini CLI 开源，Antigravity CLI 另行确认             |
| 常用配置文件 | `CLAUDE.md` / `.claude/` | `AGENTS.md` / `~/.codex/`                                             | `GEMINI.md` 或 Antigravity 新配置                  |
| 个人用户入口 | Claude 订阅或 API           | ChatGPT 登录（Free 到 Pro 均可）或 API                                        | Gemini CLI 个人入口已迁移到 Antigravity                |
| 企业入口   | Team / Enterprise / API  | ChatGPT Enterprise / Edu / API（2026-06-24 起新 Business 计划不再含 Codex 席位） | Google Code Assist Standard / Enterprise / API |
| MCP    | 支持                       | 支持                                                                    | 支持，但迁移时要核对格式                                   |

## 模型与上下文

| 维度    | Claude Code                           | Codex CLI                                              | Gemini / Antigravity         |
| ----- | ------------------------------------- | ------------------------------------------------------ | ---------------------------- |
| 模型来源  | Claude 系列                             | GPT-5.6 Sol / Terra / Luna（2026-07 起不再有 `-codex` 后缀模型） | Gemini 系列                    |
| 选择策略  | 可按任务切 Opus / Sonnet / Haiku / Fable 等 | 以 OpenAI 当前推荐编码模型为准                                    | 以 Google 当前 Gemini 模型和订阅权益为准 |
| 上下文特点 | 适合长会话工程协作，自动压缩成熟                      | 适合终端原生工作流和沙箱执行                                         | 长上下文是核心优势                    |
| 风险点   | 成本和权限治理要管好                            | 第三方模型/兼容 API 要自己验证                                     | Gemini CLI 个人链路已经退役，迁移成本要算进去 |

不要把模型名写死在团队规范里。更推荐写成“默认用当前供应商推荐的编码模型；复杂架构/大重构再升到更强模型”。

## 价格与访问

| 场景                                       | 推荐判断                           |
| ---------------------------------------- | ------------------------------ |
| 个人稳定使用                                   | Claude Code 或 Codex CLI 更直接    |
| 已买 ChatGPT / OpenAI 企业服务                 | 优先试 Codex CLI                  |
| 已买 Claude Pro / Max / Team               | 优先试 Claude Code                |
| 已在 Google Cloud / Code Assist Enterprise | 再评估 Antigravity 或企业 Gemini CLI |
| 只想找“免费大额度”                               | 不要再按旧版 Gemini CLI 的免费额度做决策     |

旧版“Gemini CLI 每天免费 60 次”的说法已经不适合作为 2026-06-18 之后的个人用户建议。

## 安全与权限

| 维度   | Claude Code                           | Codex CLI                                          | Gemini / Antigravity             |
| ---- | ------------------------------------- | -------------------------------------------------- | -------------------------------- |
| 默认姿态 | 功能强，依赖权限配置和人工确认                       | 沙箱（Seatbelt / bubblewrap / Windows 原生）+ 审批策略，默认关网络 | 取决于当前 CLI 与账号层级                  |
| 适合场景 | 大型功能开发、跨文件重构、长期项目协作                   | 安全审查、CI、一次性批处理、陌生仓库探索                              | 大上下文阅读、Google Search、Google 生态任务 |
| 重点治理 | `settings.json`、permissions、hooks、MCP | sandbox、approval mode、AGENTS.md                    | 登录权限、API key、MCP、企业策略            |

如果你让代理处理生产仓库，至少要保证：

* 密钥不进上下文和 git
* destructive shell 命令需要人工确认
* 提交和 push 由人明确授权
* CI 里跑类型、lint、build 或测试
* 重要改动有可回滚的 commit 边界

## Agent 能力

| 维度             | Claude Code                     | Codex CLI                                                     | Gemini / Antigravity |
| -------------- | ------------------------------- | ------------------------------------------------------------- | -------------------- |
| Plan-first 工作流 | 强                               | `/plan` 计划模式 + `/goal` 目标模式                                   | 取决于 CLI              |
| 多代理/子任务        | 成熟                              | 内置子代理（`.codex/agents/*.toml`）、桌面 App worktree、Cloud 并行        | 需按当前工具能力验证           |
| 项目记忆           | `CLAUDE.md`、memory、skills 等生态丰富 | `AGENTS.md`、Skills、Plugins、实验性 memories                       | `GEMINI.md` 或新配置     |
| 自动化            | Headless、SDK、hooks              | `codex exec`、Hooks、GitHub Action、TS/Python SDK、桌面 Automations | Google 生态自动化         |

## 怎么选？

### 选 Claude Code 如果

* 你要的是长期工程协作，而不是一次性问答
* 项目里有明确规范、上下文和多阶段任务
* 你需要 Plan 模式、hooks、skills、IDE 集成
* 团队愿意为更成熟的工程体验付费

### 选 Codex CLI 如果

* 你重视开源、可审计和沙箱边界
* 你经常在陌生仓库、CI 或脚本环境里跑代理
* 你已经在 OpenAI / ChatGPT 生态里
* 你希望 `AGENTS.md` 这种轻量项目规范文件足够好用

### 选 Antigravity / Gemini 路线如果

* 你的团队已经在 Google Cloud / Code Assist 生态中
* 你确实需要 Gemini 的长上下文和 Google Search
* 你能接受从 Gemini CLI 到 Antigravity CLI 的迁移成本
* 你愿意对登录、配额、MCP 和 CI 行为做一次重新验收

## 实战组合

很多团队最后不是三选一，而是分工使用：

* **日常开发**：Claude Code
* **安全边界强的自动化任务**：Codex CLI
* **大代码库阅读 / Google 生态查询**：Antigravity 或企业 Gemini CLI

真正重要的不是“哪个工具赢了”，而是把工具放在正确边界里：读代码、改代码、跑测试、提交、部署，每一步都要知道责任归谁。
