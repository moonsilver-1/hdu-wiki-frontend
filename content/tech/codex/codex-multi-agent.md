---
title: "子代理与并行"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "默认开启（[features].multi_agent = true）。工具名是 spawn_agent，交互界面里 /agent（别名 /subagents）或 Alt+A 打开面板。"
tags: ["洛洛", "转载"]
---

Codex 可以在一个会话里派生多个**子代理（subagent）**并行工作，也可以在桌面 App 里用 worktree 隔离多个线程，或者把任务扔到云端并行跑。

## 子代理

默认开启（`[features].multi_agent = true`）。工具名是 `spawn_agent`，交互界面里 `/agent`（别名 `/subagents`）或 `Alt+A` 打开面板。

### 内置代理

* `default`：通用
* `worker`：负责实现与执行
* `explorer`：只读探索

自定义同名会覆盖内置。

### 怎么触发

只能靠自然语言（或 `AGENTS.md` / Skill 里的指令）：

```
对当前分支相对 main 的改动做审查。为下面每一点各开一个子代理，
等全部完成后按点汇总：
1. 安全 2. 代码质量 3. Bug 4. 竞态 5. 测试脆弱性 6. 可维护性
```

```
把 src/services 下 5 个模块的单元测试补齐，每个模块一个子代理并行做，互不改对方文件
```

### 什么任务适合并行

官方的判断：**读多的任务适合并行**（探索、审查、分类、摘要），**写多的任务并行容易冲突**。子代理比单代理消耗更多 token，别为了并行而并行。

## 自定义子代理

每个代理一个 TOML 文件，放 `~/.codex/agents/`（个人）或 `/.codex/agents/`（项目）。`name`、`description`、`developer_instructions` 必填，其余可以是任何 `config.toml` 键：

```toml
## .codex/agents/reviewer.toml
name = "reviewer"
description = "PR 审查员，关注正确性、安全与缺失的测试"
model = "gpt-5.6-terra"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
developer_instructions = """
像代码所有者一样审查。
优先级：正确性 > 安全 > 行为回归 > 测试覆盖。
只报 P0/P1，每条给出文件与行号。
"""
```

```toml
## .codex/agents/docs-researcher.toml
name = "docs_researcher"
description = "文档研究员，用文档 MCP 核对 API 用法"
model = "gpt-5.6-luna"
sandbox_mode = "read-only"
developer_instructions = "先查文档 MCP 再回答，不确定就说不确定。"

[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"
```

识别以文件里的 `name` 为准，不是文件名。

### 全局设置

```toml
[agents]
max_concurrent_threads_per_session = 8
default_subagent_model = "gpt-5.6-terra"
default_subagent_reasoning_effort = "high"
interrupt_message = true
```

模型优先级：代理文件 > 派生时显式指定 > `[agents]` 默认 > 父会话。沙箱、MCP、Skills 未指定时继承父会话；父会话运行时的权限改动（`/permissions`、`--yolo`）会重新施加到子代理上。

## fork 与侧聊

* `codex fork --last` / `/fork`：从当前状态分叉出新会话，适合"两个方案各跑一支"
* `/side`：临时侧聊，不污染主线
* 详见 [上下文与会话管理](/tech/codex/codex-context)

## Git worktree

多个 Agent 同时改同一个工作目录必然踩脚。**worktree** 让每个线程拥有独立的工作副本（共享 `.git`，独立 HEAD 与索引）。

* **桌面 App**：内置 `/worktree`，每开一个线程或定时任务可自动创建 worktree；Handoff 功能负责在本地目录和 worktree 之间搬运会话与代码
* **CLI**：没有内置 worktree 命令，手工创建后分别启动：

```bash
git worktree add ../wiki-feature-a -b feature-a
git worktree add ../wiki-feature-b -b feature-b
(cd ../wiki-feature-a && codex "实现方案 A")
(cd ../wiki-feature-b && codex "实现方案 B")
```

## 云端并行

Codex cloud 在隔离容器里跑任务，天然并行。CLI 侧的入口目前是实验特性：

```bash
codex cloud                                   # 交互式选择器
codex cloud exec --env  --attempts 3 "修复 issue #42"
codex cloud list --json
codex apply <TASK_ID>                         # 把云端任务的 diff 打回本地
```

`--attempts` 让同一任务跑 1 到 4 次，挑最好的一版。云端并行的最佳实践：按包、模块、Issue、测试目标切分，**避免两个任务改同一批文件**。详见 [IDE、Cloud、GitHub 与手机](/tech/codex/codex-ide-cloud)。

## Ultra 推理档

模型选择器里的 **Ultra** 档本质上就是让 Codex 自动拆任务给子代理并行，适合超大重构；消耗也是最高的。桌面 App 需要在设置里打开"Ultra in model picker slider"。

## 并行的三条纪律

1. 每个 Agent 只做一件事，写清边界文件
2. 合并前跑测试，不要靠肉眼 diff
3. 全部完成后让主线程统一汇总，别让子代理各自往 `AGENTS.md` 写东西

## 参考来源

* 子代理：[https://learn.chatgpt.com/docs/agent-configuration/subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
* Git worktree：[https://learn.chatgpt.com/docs/environments/git-worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)
* Cloud：[https://learn.chatgpt.com/docs/cloud](https://learn.chatgpt.com/docs/cloud)
* 命令参考（`codex cloud` / `codex apply` / `codex fork`）：[https://learn.chatgpt.com/docs/developer-commands?surface=cli](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
