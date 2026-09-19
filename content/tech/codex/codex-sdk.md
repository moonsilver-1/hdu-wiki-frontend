---
title: "Codex SDK"
date: "2026-09-20"
author: "洛洛"
excerpt: "npm install @openai/codex-sdk"
tags: ["luoluo", "迁移"]
---

Codex SDK 让你在自己的服务或脚本里以编程方式启动、续接、监控 Codex 线程。它是对本地 Codex 引擎（app-server）的封装，行为与 CLI 一致，也读同一份 `~/.codex/config.toml`。

## TypeScript

Node 18+，服务端使用。

```bash
npm install @openai/codex-sdk
```

```ts
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();

const result = await thread.run("制定一份诊断并修复 CI 失败的计划");
console.log(result.finalResponse);

await thread.run("执行这份计划");                 // 同一线程继续
const old = codex.resumeThread("");    // 恢复历史线程
```

仓库：[https://github.com/openai/codex/tree/main/sdk/typescript](https://github.com/openai/codex/tree/main/sdk/typescript)

## Python

Python 3.10+，已是稳定版，通过 JSON-RPC 驱动本地 app-server。

```bash
pip install openai-codex
```

```python
from openai_codex import Codex, Sandbox

with Codex() as codex:
    thread = codex.thread_start(
        model="gpt-5.6-terra",
        sandbox=Sandbox.workspace_write,
    )
    result = thread.run("制定一份诊断并修复 CI 失败的计划")
    print(result.final_response)

    review = thread.run("只审查 diff，不要改文件", sandbox=Sandbox.read_only)
```

* 另有 `AsyncCodex`
* 沙箱预设：`Sandbox.read_only` / `workspace_write` / `full_access`；传给 `run()` 的沙箱对该轮及之后生效

仓库：[https://github.com/openai/codex/tree/main/sdk/python](https://github.com/openai/codex/tree/main/sdk/python)

## 结构化输出

SDK 底层就是 `codex exec`，所以 `--output-schema` 的能力可以透传：让 Codex 返回严格 JSON，方便下游程序消费。GitHub Action 里通过 `codex-args` 透传同一参数。

## 鉴权

SDK 复用 CLI 的登录态（`codex login`），CI 里用 `CODEX_API_KEY` 内联在命令上。

## 典型用法

* **自动修 CI**：CI 失败 → 触发脚本 → SDK 起线程分析日志并产出 patch → 另一个步骤开 PR
* **内部工具**：给非技术同事一个网页，背后用 SDK 跑 Codex 生成报表 / 查代码
* **多阶段流水线**：计划 → 实现 → 审查，每一步一个 `thread.run`，共享上下文

## SDK 还是 MCP server？

官方的选型建议：

| 需求                                         | 用                                           |
| ------------------------------------------ | ------------------------------------------- |
| 以代码为中心、需要一个持续的 Codex 线程                    | Codex SDK                                   |
| Codex 只是更大编排（Agents SDK、别的 Agent 框架）里的一个专家 | `codex mcp-server`，见 [MCP](/tech/codex/codex-mcp) |

## Codex Security SDK

另有一个 Beta 阶段的 TypeScript SDK 用于仓库 / 变更的安全扫描，返回结构化安全发现：[https://learn.chatgpt.com/docs/security/sdk](https://learn.chatgpt.com/docs/security/sdk)

## 参考来源

* Codex SDK：[https://learn.chatgpt.com/docs/codex-sdk](https://learn.chatgpt.com/docs/codex-sdk)
* 非交互模式（SDK 的底座）：[https://learn.chatgpt.com/docs/non-interactive-mode](https://learn.chatgpt.com/docs/non-interactive-mode)
* Codex 作为 MCP server：[https://learn.chatgpt.com/docs/mcp-server](https://learn.chatgpt.com/docs/mcp-server)
