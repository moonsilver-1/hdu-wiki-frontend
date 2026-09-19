---
title: "MCP"
date: "2026-09-20"
author: "洛洛"
excerpt: "适合：查文档（Context7、OpenAI Docs）、操作浏览器（Playwright、Chrome DevTools）、读设计稿（Figma）、查错误监控（Sentry）、管 Issue / PR（GitHub、Linear）。"
tags: ["luoluo", "迁移"]
---

**MCP（Model Context Protocol）** 让 Codex 连接仓库之外的工具和数据：文档库、浏览器、设计稿、Issue 系统、内部 API。Codex 0.147.0 支持 2026-07-28 版协议。

## 什么时候需要 MCP

适合：查文档（Context7、OpenAI Docs）、操作浏览器（Playwright、Chrome DevTools）、读设计稿（Figma）、查错误监控（Sentry）、管 Issue / PR（GitHub、Linear）。

不适合：一次性 shell 命令、读写项目文件、固定的项目规范——这些分别交给 `!`、沙箱内工具和 `AGENTS.md`。

官方建议：**先接一两个高价值的，别一次全上**。每个 MCP 的工具描述都会占上下文。

## 用命令添加

```bash
## stdio（本地子进程）
codex mcp add context7 -- npx -y @upstash/context7-mcp
codex mcp add github --env GITHUB_TOKEN=xxx -- npx -y @modelcontextprotocol/server-github

## streamable HTTP（远程）
codex mcp add figma --url https://mcp.figma.com/mcp --bearer-token-env-var FIGMA_TOKEN

codex mcp list
codex mcp get context7
codex mcp remove context7
codex mcp login figma      # 支持 OAuth 的 HTTP server
codex mcp logout figma
```

交互界面里 `/mcp` 看已连接的 server，`/mcp verbose` 看诊断信息。

## 写进 config.toml

Codex **只认 `[mcp_servers.]`**（不是 `[mcp.servers.x]`，那是别的工具的写法）。

stdio：

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
cwd = "/some/dir"

[mcp_servers.context7.env]
MY_ENV_VAR = "value"
```

HTTP：

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
auth = "oauth"                    # oauth（默认）| chatgpt
scopes = ["read"]

[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
required = false                  # true 时它起不来整个 Codex 就起不来
enabled_tools = ["open", "screenshot"]
disabled_tools = []
default_tools_approval_mode = "prompt"   # auto | prompt | writes | approve
startup_timeout_sec = 20
tool_timeout_sec = 45

[mcp_servers.chrome_devtools.tools.open]
approval_mode = "approve"         # 单个工具级别覆盖
```

`default_tools_approval_mode` 是 Codex 特有的细粒度控制：`auto` 全自动，`prompt` 每次问，`writes` 只对写操作问，`approve` 需要显式批准。

## OAuth

HTTP server 支持 OAuth，Codex 会自动处理客户端注册（CIMD 或 DCR，默认 `auto`）。回调端口和地址可调：

```toml
mcp_oauth_callback_port = 8765
mcp_oauth_credentials_store = "keyring"
```

## 官方推荐的常用 server

OpenAI Docs（`https://developers.openai.com/mcp`）、Context7、Figma、Playwright、Chrome DevTools、Sentry、GitHub。

## 把 Codex 暴露为 MCP server

反过来，别的 Agent（比如 OpenAI Agents SDK 编排的流水线、甚至 Claude Code）可以把 Codex 当工具用：

```bash
codex mcp-server                                   # stdio
npx @modelcontextprotocol/inspector codex mcp-server   # 调试
```

暴露两个工具：

* `codex`：入参 `prompt`（必填）、`sandbox`、`approval-policy`、`model`、`cwd`、`developer-instructions`、`config` 等
* `codex-reply`：入参 `prompt` 与 `threadId`，接着上一次继续

返回值里带 `structuredContent.threadId`。官方给了用 Agents SDK 编排"多个 Codex 分别负责前端 / 后端 / 测试"的完整示例。选型上：只是想跑一个以代码为中心的线程 → 用 [Codex SDK](/tech/codex/codex-sdk)；Codex 是更大编排里的一个专家 → 用 `codex mcp-server`。

## 子代理专属 MCP

子代理的配置文件里可以单独挂 MCP，比如给"文档研究员"挂文档 server，主线程不受影响。见 [子代理与并行](/tech/codex/codex-multi-agent)。

## 排查

* 起不来：`/mcp verbose` 看错误；调大 `startup_timeout_sec`
* 工具太多占上下文：用 `enabled_tools` 只留需要的
* `codex exec` 直接失败：检查是否有 `required = true` 的 server 没起来

## 参考来源

* MCP：[https://learn.chatgpt.com/docs/extend/mcp](https://learn.chatgpt.com/docs/extend/mcp)
* Codex 作为 MCP server：[https://learn.chatgpt.com/docs/mcp-server](https://learn.chatgpt.com/docs/mcp-server)
* 配置参考（`mcp_servers` 全部键）：[https://learn.chatgpt.com/docs/config-file/config-reference](https://learn.chatgpt.com/docs/config-file/config-reference)
* 0.147.0 发布说明（MCP 2026-07-28 协议）：[https://github.com/openai/codex/releases/tag/rust-v0.147.0](https://github.com/openai/codex/releases/tag/rust-v0.147.0)
