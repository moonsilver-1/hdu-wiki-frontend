---
title: "Gemini CLI 与 Antigravity CLI"
date: "2026-09-20"
author: "洛洛"
excerpt: "截至 2026-06-28，Gemini CLI 已经不再适合作为个人用户的新装首选。"
tags: ["luoluo", "迁移"]
---

**Gemini CLI** 曾经是 Google 推出的开源终端 AI 编程代理，主打 Gemini 模型、长上下文和 Google Search 集成。

GitHub: `github.com/google-gemini/gemini-cli`

## 先看当前状态

截至 2026-06-28，Gemini CLI 已经不再适合作为个人用户的新装首选。

**截至 2026-09-14 的补充**：Gemini CLI 仓库仍以 Apache 2.0 开源并持续发版（最新 v0.59.0，2026-09-08）。Google 在迁移公告里表示会继续为企业用户提供新模型支持、bug 修复和安全补丁。Antigravity CLI 也仍在，命令名是 `agy`，属于 Antigravity 2.0 产品线。

Google 在 2026-05-19 宣布并已执行迁移：从 **2026-06-18** 开始，Gemini Code Assist for individuals、Google AI Pro、Google AI Ultra 这些消费级/个人层级不再通过 Gemini CLI 服务请求，也不能继续用 "Login with Google" 登录 Gemini CLI。个人用户应迁移到 **Antigravity CLI**。

仍可继续使用 Gemini CLI 的主要是：

* Gemini Code Assist Standard / Enterprise 订阅用户
* 使用付费 Gemini API 或 Gemini Enterprise Agent Platform API key 的组织或自动化环境
* 已明确接受企业支持边界的团队

所以这篇现在更适合当作**迁移判断页**，而不是推荐个人用户继续从零上手 Gemini CLI。

## 核心特点

* **开源历史包袱** — Gemini CLI 本体开源，但个人访问链路已经迁移
* **长上下文** — 适合大代码库探索，具体窗口取决于后端 Gemini 模型
* **Google Search** — 适合查最新文档和资料
* **MCP 支持** — 可接入外部工具和服务
* **企业可留用** — Standard / Enterprise 或付费 API key 场景仍可评估继续使用

## 个人用户怎么选？

如果你是个人开发者、Google AI Pro/Ultra 用户，或只是想找一个免费终端编程代理：

* 不要再把 Gemini CLI 当作主要入口
* 优先看 Antigravity CLI
* 如果你只想要稳定终端编程代理，可以同时评估 Claude Code 或 Codex CLI

如果你维护过旧脚本，重点排查这些地方：

* CI/CD 中直接调用 `gemini` 的步骤
* 文档里让用户 `npm install -g @google/gemini-cli` 的安装说明
* 依赖 Google 账号 OAuth 登录的自动化流程
* 默认假设“免费额度可用”的团队脚本

## 旧版安装方式

旧版 Gemini CLI 的安装方式通常是：

```bash
npm install -g @google/gemini-cli
```

但个人用户即使安装成功，也可能在登录或请求阶段遇到订阅/授权错误。企业或 API key 场景可以继续按 Google 当前文档配置。

API key 方式一般形如：

```bash
export GEMINI_API_KEY="AIzaSy..."
```

## 迁移到 Antigravity CLI 时看什么？

Antigravity CLI 不是 Gemini CLI 的简单改名。按官方文档，macOS / Linux 的安装命令是：

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

装好后用 `agy` 启动，默认用 Google 账号登录；也可以不登录、直接走 Gemini API key：在 `~/.gemini/antigravity-cli/settings.json` 里把 `modelProvider` 设为 `gemini`，再导出 `GEMINI_API_KEY`。

迁移时不要只替换命令名，要重新核对：

* 登录方式和订阅权益
* 配置文件位置
* MCP / 扩展配置格式
* CI 中的非交互执行方式
* 是否支持原来依赖的工具、Hooks、Subagents 或插件
* 额度是按天、按周还是按订阅层级计算

Google 官方也提示新 CLI 初期不一定 1:1 覆盖所有 Gemini CLI 行为（公告称会保留 Agent Skills、Hooks、Subagents、Extensions 这些关键能力），所以生产脚本要做一次真实跑通，而不是只读迁移说明。

## 旧版基本使用

在仍可访问 Gemini CLI 的环境中，基本入口仍然是：

```bash
gemini
```

```bash
gemini "解释这个项目的架构"
```

```bash
cat error.log | gemini "分析这个错误日志"
```

## 内置工具

| 工具            | 功能           |
| ------------- | ------------ |
| 文件读写          | 读取、创建、编辑项目文件 |
| Shell 执行      | 执行终端命令（需确认）  |
| 代码搜索          | 在代码库中搜索模式    |
| Google Search | 搜索最新网络信息     |
| 多模态输入         | 支持图片、截图分析    |

Google Search 是 Gemini CLI/Google 生态的强项，适合这种问题：

```
搜索一下 Next.js 16 的 Server Actions 最新用法
```

## GEMINI.md

类似 CLAUDE.md 和 AGENTS.md：

```markdown
## 项目说明
- 这是一个 Vue 3 + Vite 项目
- 使用 Pinia 做状态管理
- 测试用 Vitest

## 编码规范
- 组件用 Composition API
- 样式用 UnoCSS
```

## MCP 支持

Gemini CLI 支持 MCP，但迁移到 Antigravity CLI 时要重新核对配置格式。旧版 Gemini CLI 配置通常类似：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

## 长上下文优势

Gemini 系列模型的长上下文仍然是 Google 生态的重要优势。百万级上下文意味着：

| 内容            | 大约 token 数 |
| ------------- | ---------- |
| 1 个普通源码文件     | 500-2000   |
| 100 个文件的中型项目  | 50K-200K   |
| 1000 个文件的大型项目 | 500K-2M    |

这对“先读完整仓库再制定方案”的任务很有用。但上下文大不等于一定更准，真实工程任务仍要看工具执行、测试反馈和权限控制。

## 现在适合谁？

* **企业 Google 生态团队** — 有 Standard / Enterprise 或付费 API key，能接受 Google 的迁移路径
* **大代码库探索** — 需要长上下文和 Google Search
* **迁移期维护者** — 需要判断旧 `gemini` 脚本是否还可用
* **个人用户** — 优先评估 Antigravity CLI，而不是继续投入 Gemini CLI

## 参考来源

* Google Developers Blog《An important update: Transitioning Gemini CLI to Antigravity CLI》：[https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/（2026-05-19）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/（2026-05-19）)
* Gemini CLI 官方迁移公告（GitHub Discussion #27274）：[https://github.com/google-gemini/gemini-cli/discussions/27274（2026-05-19）](https://github.com/google-gemini/gemini-cli/discussions/27274（2026-05-19）)
* Gemini CLI Releases（v0.59.0，2026-09-08）：[https://github.com/google-gemini/gemini-cli/releases（查阅于](https://github.com/google-gemini/gemini-cli/releases（查阅于) 2026-09-14）
* Antigravity CLI 安装与认证文档：[https://antigravity.google/docs/cli/install/（查阅于](https://antigravity.google/docs/cli/install/（查阅于) 2026-09-14）
