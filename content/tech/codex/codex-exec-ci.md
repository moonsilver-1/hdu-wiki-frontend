---
title: "非交互模式与 CI"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "codex exec ”总结这个仓库的结构，列出 5 个最有风险的模块”"
tags: ["洛洛", "转载"]
---

`codex exec`（别名 `codex e`）是 Codex 的非交互入口：跑完一个任务就退出，不弹审批。它是脚本、CI、定时任务和 SDK 的底座。

## 基本用法

```bash
codex exec "总结这个仓库的结构，列出 5 个最有风险的模块"
```

关键行为：

* **默认只读沙箱**。要改文件必须显式 `--sandbox workspace-write`
* 进度写 **stderr**，最终回答写 **stdout**，管道友好
* 默认要求在 Git 仓库内，否则加 `--skip-git-repo-check`
* **没有 `-a/--ask-for-approval` 参数**，审批策略只能用 `-c approval_policy=never` 之类覆盖

## 常用参数

| 参数                                 | 说明                                          |
| ---------------------------------- | ------------------------------------------- |
| `--json`                           | stdout 变成 JSONL 事件流                         |
| `-o, --output-last-message ` | 把最终回答另存到文件（stdout 仍会打印）                     |
| `--output-schema <schema.json>`    | 用 JSON Schema 约束最终回答结构                      |
| `-s, --sandbox `             | 沙箱模式                                        |
| `-m, --model`                      | 模型                                          |
| `-p, --profile `             | 叠加 profile                                  |
| `-c key=value`                     | 单次配置覆盖                                      |
| `-i, --image`                      | 附图                                          |
| `--ephemeral`                      | 不落盘会话记录                                     |
| `--ignore-user-config`             | 不读 `~/.codex/config.toml`                   |
| `--ignore-rules`                   | 不读 Rules                                    |
| `-C, --cd `                   | 工作目录                                        |
| `--full-auto`                      | 已废弃的兼容参数，会告警；改用 `--sandbox workspace-write` |

## stdin 的两种语义

给了 prompt 又有管道输入 → 管道内容作为上下文附加：

```bash
pnpm test 2>&1 | codex exec "总结失败的测试并给出最小修复方案"
```

只有管道、没有 prompt（或显式用 `-`）→ 管道内容就是 prompt：

```bash
cat prompt.txt | codex exec -
generate_prompt.sh | codex exec - --json > result.jsonl
```

## JSONL 事件流

```bash
codex exec --json "检查 TODO 注释" | jq -c 'select(.type == "item.completed")'
```

事件类型：`thread.started`、`turn.started`、`turn.completed`（含 token 用量）、`turn.failed`、`item.*`（消息、命令执行、文件变更、MCP 调用、搜索、计划更新）、`error`。

```jsonl
{"type":"thread.started","thread_id":"0199a213-81c0-7800-8aa1-bbab2a035a53"}
{"type":"item.completed","item":{"id":"item_3","type":"agent_message","text":"..."}}
{"type":"turn.completed","usage":{"input_tokens":24763,"cached_input_tokens":24448,"output_tokens":122}}
```

## 结构化输出

```bash
codex exec "提取项目元数据" --output-schema ./schema.json -o ./metadata.json
```

Codex 会校验最终回答符合 schema，适合把 Codex 当成"能读代码的函数"嵌进流水线。

## 多轮：`codex exec resume`

```bash
codex exec "审查这个改动的竞态问题"
codex exec resume --last "把你发现的竞态修掉"
codex exec resume <SESSION_ID> "..."
```

## CI 里的鉴权

用 `CODEX_API_KEY`（**只有 `codex exec` 认这个变量**），而且官方明确建议**内联在单条命令上**，不要设成 job 级环境变量，减少泄露面：

```bash
CODEX_API_KEY="$OPENAI_KEY" codex exec --json "..."
```

## 官方 GitHub Action

`openai/codex-action@v1` 做三件事：安装 CLI、在你给了 API key 时启动一个 Responses API 代理（key 不暴露给仓库代码）、按指定权限跑 `codex exec`。

```yaml
name: codex-review
on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: openai/codex-action@v1
        id: codex
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          prompt: "审查这个 PR 的改动，只报 P0/P1，输出 Markdown"
          sandbox: read-only
          effort: high
          output-file: review.md
      - uses: actions/upload-artifact@v4
        with:
          name: review
          path: review.md
```

常用输入：`prompt` / `prompt-file`、`model`、`effort`、`sandbox`、`codex-args`（透传其他 CLI 参数，如 `["--ephemeral"]`）、`output-file`、`safety-strategy`（默认 `drop-sudo`，还有 `unprivileged-user` / `read-only` / `unsafe`；Windows runner 必须 `unsafe`）、`allow-users` / `allow-bots`。输出 `final-message`。

**推荐的安全模式**：Codex 的 job 只给 `contents: read`，产出 patch 作为 artifact；另起一个**不拿 API key** 的 job 用 `contents: write` + `pull-requests: write` 打补丁开 PR。官方在"Autofix CI failures"里给了完整 YAML。

## 本地脚本例子

```bash
#!/usr/bin/env bash
## 每天早上给昨天的提交写一份变更摘要
set -euo pipefail
git log --since=yesterday --stat \
  | codex exec -s read-only -c approval_policy=never \
      "根据这段 git log 写一份给非技术同事看的变更摘要，中文，200 字以内" \
      -o /tmp/daily-summary.md
```

## 什么时候不该用 exec

* 任务需要你中途拍板（选方案、确认删文件）→ 用交互模式或 `/plan`
* 要改的东西在工作区外或要联网 → 先在配置里放开，或换 Cloud 环境
* 单次任务超长且失败代价高 → 用 SDK 拿事件流做监控，别裸跑

## 参考来源

* 非交互模式：[https://learn.chatgpt.com/docs/non-interactive-mode](https://learn.chatgpt.com/docs/non-interactive-mode)
* GitHub Action：[https://learn.chatgpt.com/docs/github-action](https://learn.chatgpt.com/docs/github-action) 、[https://github.com/openai/codex-action](https://github.com/openai/codex-action)
* Action 安全清单：[https://github.com/openai/codex-action/blob/main/docs/security.md](https://github.com/openai/codex-action/blob/main/docs/security.md)
* 命令参考（exec 参数）：[https://learn.chatgpt.com/docs/developer-commands?surface=cli](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
