---
title: "Hooks"
date: "2026-09-20"
author: "洛洛"
excerpt: "* ~/.codex/hooks.json 或 ~/.codex/config.toml 里的 [hooks]"
tags: ["luoluo", "迁移"]
---

Hooks 让你在 Codex 的关键时刻自动跑脚本：会话开始时注入上下文、工具调用前拦截危险命令、每轮结束后自动格式化、任务停止时决定要不要继续。Codex 的 Hooks 在 2026-05 转正（GA），默认开启。

## 放在哪里

* `~/.codex/hooks.json` 或 `~/.codex/config.toml` 里的 `[hooks]`
* `/.codex/hooks.json` 或 `/.codex/config.toml`
* 插件自带的 `hooks/hooks.json`

多个来源里匹配的钩子**全部执行**，高层不会覆盖低层。项目级钩子只在项目被信任时加载。

## 信任机制

这是 Codex 和别家最大的差别：**非管理员下发的命令型钩子必须先在 `/hooks` 里审阅并信任才会运行**。信任按钩子定义的哈希记录，改一个字就要重新信任。一次性绕过用 `--dangerously-bypass-hook-trust`，只该在你完全清楚钩子内容时用。

企业管理员通过 `requirements.toml` 下发的钩子自动受信，用户不能禁用。

## 事件

| 时机  | 事件                                             |
| --- | ---------------------------------------------- |
| 会话  | `SessionStart`、`SessionEnd`                    |
| 每轮  | `UserPromptSubmit`、`Stop`                      |
| 工具  | `PreToolUse`、`PermissionRequest`、`PostToolUse` |
| 压缩  | `PreCompact`、`PostCompact`                     |
| 子代理 | `SubagentStart`、`SubagentStop`                 |

## 配置格式

三层结构：事件 → matcher 组 → handler 列表。

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.codex/hooks/session_start.py",
            "statusMessage": "加载会话笔记",
            "additionalContextLimit": 5000
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/guard.py\"",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

等价的 TOML：

```toml
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = 'python3 "$(git rev-parse --show-toplevel)/.codex/hooks/guard.py"'
timeout = 30
```

handler 字段：

* `type`：目前只有 `command` 会真正执行（`prompt`、`agent` 会被解析但跳过）
* `command` / `commandWindows`：命令，后者是 Windows 覆盖
* `timeout`：秒，默认 600；`SessionEnd` 默认 1 秒、上限 3 秒
* `statusMessage`：运行时在界面显示的文字
* `additionalContextLimit`：注入上下文上限（默认约 2500 token），超出部分写到临时文件只给模型头尾预览
* `async`：后台运行不阻塞

命令的工作目录是会话 cwd。仓库内的钩子路径请用 `$(git rev-parse --show-toplevel)` 解析，不要写相对路径。

## matcher 能过滤什么

| 事件                                                 | matcher 匹配                                                                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `PreToolUse` / `PostToolUse` / `PermissionRequest` | 工具名：`Bash`、`apply_patch`（也匹配 `Edit` / `Write`）、`mcp__server__tool`、`update_plan`、`spawn_agent`（也匹配 `Agent`） |
| `PreCompact` / `PostCompact`                       | `manual` / `auto`                                                                                           |
| `SessionStart`                                     | `startup` / `resume` / `clear` / `compact`                                                                  |
| `SubagentStart` / `SubagentStop`                   | 子代理类型                                                                                                       |
| `UserPromptSubmit` / `Stop` / `SessionEnd`         | 不支持 matcher                                                                                                 |

托管工具（如 `WebSearch`）不经过本地钩子，所以钩子**不是完整的安全边界**，真正的边界还是沙箱与审批。

## 输入与输出

钩子从 stdin 收到一个 JSON，公共字段：`session_id`、`transcript_path`、`cwd`、`hook_event_name`、`model`，多数事件另有 `turn_id`、`permission_mode`。

通用输出：

```json
{ "continue": true, "stopReason": "可选", "systemMessage": "可选" }
```

### 拦截命令（`PreToolUse`）

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "禁止 rm -rf 出现在工作区外"
  }
}
```

也可以退出码 `2` + stderr 写原因。`permissionDecision: "allow"` 搭配 `updatedInput` 可以改写命令；`"ask"` 目前尚未支持。

### 自动继续（`Stop`）

`Stop` 事件里返回 `{"decision": "block", "reason": "..."}` **不是拒绝**，而是让 Codex 把 `reason` 当成新的用户输入接着跑。这是做"跑到测试全绿为止"之类自动验收的关键机制。

## 三个实用例子

**1. 会话开始注入项目状态**

```bash
#!/usr/bin/env bash
## .codex/hooks/session_start.sh
echo "当前分支：$(git branch --show-current)"
echo "未提交改动：$(git status --short | wc -l) 个文件"
```

**2. 写文件后自动格式化（`PostToolUse`，matcher `apply_patch`）**

```bash
#!/usr/bin/env bash
pnpm biome format --write . >/dev/null 2>&1 || true
```

**3. 拦截危险 git 操作（`PreToolUse`，matcher `Bash`）**

```python
import json, sys
data = json.load(sys.stdin)
cmd = data.get("tool_input", {}).get("command", "")
if "git push --force" in cmd or "reset --hard" in cmd:
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": "强推与硬重置需要人工执行"}}))
```

## 关闭钩子

```toml
[features]
hooks = false
```

## `notify`：只想收个通知

如果你只想在 Codex 完成一轮时收到桌面通知或打个 webhook，不需要 Hooks，用更轻的 `notify`：

```toml
notify = ["python3", "/path/to/notify.py"]
```

脚本收到**一个 JSON 字符串参数**（`sys.argv[1]`），字段有 `type`（目前只有 `agent-turn-complete`）、`thread-id`、`turn-id`、`cwd`、`input-messages`、`last-assistant-message`。

终端内建通知则用 `[tui].notifications`，可按事件过滤，不需要写脚本。

## 参考来源

* Hooks：[https://learn.chatgpt.com/docs/hooks](https://learn.chatgpt.com/docs/hooks)
* 通知（notify 与 tui.notifications）：[https://learn.chatgpt.com/docs/config-file/config-advanced](https://learn.chatgpt.com/docs/config-file/config-advanced)
* 每周更新（Hooks GA，2026-05-11 至 05-15）：[https://learn.chatgpt.com/docs/whats-new](https://learn.chatgpt.com/docs/whats-new)
