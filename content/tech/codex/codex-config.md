---
title: "config.toml 配置详解"
date: "2026-09-20"
author: "洛洛"
excerpt: "1. 命令行参数与 -c key=value 临时覆盖"
tags: ["luoluo", "迁移"]
---

Codex 的所有行为都能在 TOML 里配。配置文件默认在 `~/.codex/config.toml`（目录可用 `CODEX_HOME` 改）。

## 配置分层与优先级

从高到低：

1. 命令行参数与 `-c key=value` 临时覆盖
2. **项目配置** `/.codex/config.toml`（只在项目被信任时加载，越靠近当前目录越优先）
3. **Profile 文件** `~/.codex/.config.toml`（`--profile name` 选中时叠加）
4. 用户配置 `~/.codex/config.toml`
5. 系统配置 `/etc/codex/config.toml`
6. 内置默认值

企业环境还有管理员的 `requirements.toml`，作为不可覆盖的硬约束层。

出于安全考虑，**项目配置里这些键会被忽略并告警**：`openai_base_url`、`chatgpt_base_url`、`model_provider`、`model_providers`、`notify`、`profile`、`profiles`、`otel` 等——防止仓库里的配置把你的请求导到别处。

## 常用键速查

```toml
## ── 模型 ──────────────────────────────
model = "gpt-5.6"
model_reasoning_effort = "medium"      # minimal | low | medium | high | xhigh
plan_mode_reasoning_effort = "high"    # 计划模式单独设
review_model = "gpt-5.6"               # /review 用的模型
model_reasoning_summary = "auto"       # auto | concise | detailed | none
personality = "pragmatic"              # none | friendly | pragmatic
web_search = "live"                    # 联网搜索

## ── 审批与沙箱 ────────────────────────
approval_policy = "on-request"         # untrusted | on-request | never
sandbox_mode = "workspace-write"       # read-only | workspace-write | danger-full-access
approvals_reviewer = "user"            # user | auto_review

[sandbox_workspace_write]
network_access = false
writable_roots = []

## ── 上下文 ────────────────────────────
model_context_window = 272000
model_auto_compact_token_limit = 200000
project_doc_max_bytes = 32768

## ── 输出与界面 ────────────────────────
hide_agent_reasoning = false
file_opener = "vscode"                 # vscode | cursor | windsurf | none
notify = ["python3", "/path/to/notify.py"]

[tui]
notifications = ["agent-turn-complete", "approval-requested"]
notification_condition = "unfocused"
status_line = ["model", "context-remaining", "git-branch"]
theme = "catppuccin-mocha"
alternate_screen = "auto"              # never 可保留终端滚动历史
resume_cwd = "session"

## ── 特性开关 ──────────────────────────
[features]
hooks = true
multi_agent = true
memories = false                       # 实验特性
fast_mode = true

## ── shell 环境 ────────────────────────
[shell_environment_policy]
inherit = "core"                       # core | all | none
set = { CI = "1" }

[shell_environment_policy.filters]
"AWS_*" = "exclude"

## ── 历史与项目信任 ────────────────────
[history]
persistence = "save-all"               # save-all | none

[projects."/Users/me/work/wiki"]
trust_level = "trusted"
```

任何键都能用 `-c` 单次覆盖：

```bash
codex -c model_reasoning_effort=high -c 'sandbox_workspace_write.network_access=true'
```

特性开关也可以用 `codex --enable ` 临时开、`codex features enable ` 持久开。`codex features list` 列出全部。

## Profile：一套配置多套预设

**旧写法已经废弃**：自 0.134.0 起 `config.toml` 里的 `[profiles.xxx]` 和顶层 `profile = "xxx"` 都不再生效。新写法是**每个 profile 一个独立文件**，文件名就是 profile 名，键写在顶层：

```toml
## ~/.codex/deep-review.config.toml
model = "gpt-5.6-sol"
model_reasoning_effort = "xhigh"
approval_policy = "on-request"
```

```bash
codex --profile deep-review
codex exec --profile ci "review this change"
```

Profile 层夹在用户配置之上、项目配置之下，只需写差异值。

## 接第三方模型

`openai`、`ollama`、`lmstudio` 是保留 ID 不能覆盖；要改官方接口地址用顶层 `openai_base_url`。自定义供应商写 `[model_providers.]`，只支持 Responses API 协议（`wire_api = "chat"` 已不支持）：

```toml
model = "gpt-5.6-terra"
model_provider = "proxy"

[model_providers.proxy]
name = "公司内网代理"
base_url = "https://proxy.example.com/v1"
env_key = "OPENAI_API_KEY"
request_max_retries = 4
stream_idle_timeout_ms = 300000
```

### Azure OpenAI

```toml
[model_providers.azure]
name = "Azure"
base_url = "https://YOUR_PROJECT.openai.azure.com/openai"
env_key = "AZURE_OPENAI_API_KEY"
query_params = { api-version = "2025-04-01-preview" }
```

### Amazon Bedrock（内置，2026-06 起）

```toml
model_provider = "amazon-bedrock"
model = ""

[model_providers.amazon-bedrock.aws]
profile = "default"
region = "eu-central-1"
```

### 命令式取 token

内网网关要短期 token 时，可以让 Codex 定期跑一个命令拿：

```toml
[model_providers.proxy.auth]
command = "/usr/local/bin/fetch-codex-token"
args = ["--audience", "codex"]
refresh_interval_ms = 300000
```

不能与 `env_key` 同时用。

### 本地开源模型

```toml
oss_provider = "ollama"     # 或 lmstudio
```

```bash
codex --oss -m gpt-oss:20b
codex --local-provider lmstudio
```

社区常用 `ollama pull gpt-oss:20b` 配合；具体默认模型以 `codex --oss --help` 实测为准。

## `~/.codex/` 里都有什么

| 路径                            | 内容                |
| ----------------------------- | ----------------- |
| `config.toml`                 | 用户配置              |
| `.config.toml`          | Profile           |
| `auth.json`                   | 登录凭据（也可改存钥匙串）     |
| `AGENTS.md`                   | 全局指令              |
| `sessions/YYYY/MM/DD/*.jsonl` | 会话记录              |
| `archived_sessions/`          | 归档会话              |
| `history.jsonl`               | 输入历史              |
| `hooks.json`                  | Hooks             |
| `rules/*.rules`               | 命令白名单规则           |
| `agents/*.toml`               | 自定义子代理            |
| `themes/`                     | 自定义主题             |
| `log/`                        | 日志                |
| `plugins/cache/`              | 插件缓存              |
| `prompts/*.md`                | 旧的自定义 prompt（已废弃） |

项目级对应 `/.codex/`：`config.toml`、`hooks.json`、`rules/`、`agents/`。

## 环境变量

| 变量                     | 说明                                |
| ---------------------- | --------------------------------- |
| `CODEX_HOME`           | 配置目录，默认 `~/.codex`（目录必须已存在）       |
| `CODEX_API_KEY`        | **仅 `codex exec` 支持**的运行时 API key |
| `CODEX_ACCESS_TOKEN`   | 企业访问令牌                            |
| `CODEX_CA_CERTIFICATE` | 企业 TLS 代理证书                       |
| `RUST_LOG`             | 日志级别                              |

## 已废弃的写法

| 旧                                | 新                           |
| -------------------------------- | --------------------------- |
| `[profiles.x]` + `profile = "x"` | `~/.codex/x.config.toml`    |
| `wire_api = "chat"`              | 只剩 `responses`              |
| `approval_policy = "on-failure"` | `on-request` / `never`      |
| `[features].codex_hooks`         | `[features].hooks`          |
| `[mcp.servers.x]`（其他工具的写法）       | Codex 只认 `[mcp_servers.x]`  |
| `~/.codex/prompts/`              | Skills                      |
| `~/.codex/skills/`               | `~/.agents/skills/`（旧路径仍兼容） |

## 参考来源

* 配置基础：[https://learn.chatgpt.com/docs/config-file/config-basic](https://learn.chatgpt.com/docs/config-file/config-basic)
* 配置进阶（Profile、供应商、通知）：[https://learn.chatgpt.com/docs/config-file/config-advanced](https://learn.chatgpt.com/docs/config-file/config-advanced)
* 完整键参考：[https://learn.chatgpt.com/docs/config-file/config-reference](https://learn.chatgpt.com/docs/config-file/config-reference)
* 示例配置：[https://learn.chatgpt.com/docs/config-file/config-sample](https://learn.chatgpt.com/docs/config-file/config-sample)
* 环境变量：[https://learn.chatgpt.com/docs/config-file/environment-variables](https://learn.chatgpt.com/docs/config-file/environment-variables)
* Amazon Bedrock：[https://learn.chatgpt.com/docs/amazon-bedrock](https://learn.chatgpt.com/docs/amazon-bedrock)
