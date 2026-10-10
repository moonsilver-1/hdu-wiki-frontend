---
title: "沙箱与审批"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "workspace-write 的”工作区”包括当前目录和 /tmp 之类的临时目录，但工作区内的 .git、.agents、.codex 三个目录始终只读，防止 Codex 改掉自己的配置或破坏版本库。"
tags: ["洛洛", "转载"]
---

Codex 的权限模型由两个正交的开关组成：

* **沙箱模式（sandbox mode）**：Codex 执行的命令**能碰到什么**——能不能写文件、写哪里、能不能联网
* **审批策略（approval policy）**：Codex 在做越界的事之前**要不要先问你**

理解这两个开关，比记住某个版本的弹窗文案更重要。

## 三种沙箱模式

| 值                    | 语义                                   |
| -------------------- | ------------------------------------ |
| `read-only`          | 只能读文件；改文件、跑会改状态的命令都要审批               |
| `workspace-write`    | 可读、可写工作区、可跑常规本地命令；**默认关网络**。这是日常默认模式 |
| `danger-full-access` | 无文件系统与网络边界，只在隔离环境里用                  |

`workspace-write` 的"工作区"包括当前目录和 `/tmp` 之类的临时目录，但工作区内的 `.git`、`.agents`、`.codex` 三个目录始终只读，防止 Codex 改掉自己的配置或破坏版本库。

需要额外的可写目录，优先用 `--add-dir`，而不是直接升到 `danger-full-access`：

```bash
codex --add-dir ../shared-lib
```

## 三种审批策略

| 值            | 语义                                |
| ------------ | --------------------------------- |
| `untrusted`  | 只自动执行已知安全的只读操作，其他一律问你             |
| `on-request` | 在沙箱内自主工作，需要越界（联网、写外部目录、沙箱里跑不了）时才问 |
| `never`      | 从不弹审批；失败直接回传给模型，由它换方案             |

旧版本里的 `on-failure` 已经删除。另外还有一种**细粒度表**写法，可以按类别决定"问我"还是"自动拒绝"：

```toml
approval_policy = { granular = {
  sandbox_approval = true,
  rules = true,
  mcp_elicitations = true,
  request_permissions = false,   # 这一类自动拒绝
  skill_approval = false
} }
```

## 默认值

* 目录在 Git 管理下 → **Auto 预设** = `workspace-write` + `on-request`
* 目录不在版本控制下 → `read-only`
* 首次进入一个目录会先问你是否信任它；不信任的项目不加载 `.codex/` 里的配置、Hooks 和 Rules

## `/permissions` 里的三个选项

交互界面里 `/permissions` 弹窗提供三档，对应关系：

| 选项                   | 等价于                                  |
| -------------------- | ------------------------------------ |
| **Read Only**        | `read-only`                          |
| **Ask for approval** | `workspace-write` + `on-request`（默认） |
| **Full Access**      | `danger-full-access`                 |

桌面 App 与 IDE 里还多一个 **Approve for me**（设置里叫 Auto-review）：沙箱边界不变，只是把越界审批交给一个自动审查 Agent 代你判断。CLI 对应的是 `approvals_reviewer = "auto_review"`，或新加的 `--approve-for-me` 参数。

## 命令行参数

```bash
codex --sandbox workspace-write --ask-for-approval on-request   # 等于默认
codex -s read-only -a on-request                                # 安全浏览陌生仓库
codex -s workspace-write -a untrusted                           # 自动改文件，但未知命令要批
codex -s workspace-write -a on-request -c approvals_reviewer=auto_review  # 自动复核
codex --dangerously-bypass-approvals-and-sandbox                # 别名 --yolo，只在隔离环境用
```

`codex exec` 默认 `read-only`，而且**没有** `-a` 参数，要调审批策略只能用 `-c approval_policy=never`。

## 写进配置

```toml
## ~/.codex/config.toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"
approvals_reviewer = "user"          # 或 "auto_review"

[sandbox_workspace_write]
network_access = false               # 需要 pnpm install 之类联网操作时改 true
writable_roots = ["/Users/me/.pyenv/shims"]
```

## 各平台的沙箱实现

| 平台           | 实现                                                                  |
| ------------ | ------------------------------------------------------------------- |
| macOS        | Apple **Seatbelt**，开箱即用                                             |
| Linux / WSL2 | **bubblewrap**（`bwrap`），需先安装；旧文档里的 Landlock + seccomp 是 0.115 之前的方案 |
| Windows 原生   | 两档：`elevated`（推荐，专用低权限用户 + 防火墙规则）和 `unelevated`（受限 token，强度较弱）      |

```toml
[windows]
sandbox = "elevated"
```

想验证沙箱到底拦不拦某条命令，用 Codex 自己的沙箱跑一遍：

```bash
codex sandbox macos --log-denials -- npm install
codex sandbox linux -- curl https://example.com
```

## Rules：沙箱外命令的白名单

`workspace-write` 里跑不了的命令（比如 `gh pr view` 需要联网）每次都问会很烦。Rules 让你预先声明"这类命令允许 / 要问 / 禁止"：

```python
## ~/.codex/rules/default.rules
prefix_rule(
    pattern = ["gh", "pr", "view"],
    decision = "prompt",           # allow | prompt | forbidden
    justification = "看 PR 需要联网，允许但先问",
    match = ["gh pr view 7888"],
    not_match = ["gh pr --repo openai/codex view 7888"],
)
```

多条规则命中时取最严的那条。在交互界面里选"总是允许"时，Codex 也是把规则写进这个文件。项目级规则放 `/.codex/rules/*.rules`。这个特性目前标记为实验性。

## 一份实用的姿态建议

| 场景             | 建议                                                                   |
| -------------- | -------------------------------------------------------------------- |
| 自己的项目、日常开发     | 默认 Auto，别动                                                           |
| 第一次打开陌生仓库      | `-s read-only`，先让它讲清楚再放开                                             |
| 需要装依赖、跑 `curl` | 临时 `[sandbox_workspace_write].network_access = true`，或用 Rules 放行特定命令 |
| CI / 脚本        | `codex exec -s read-only -c approval_policy=never`，产出 patch 由另一个步骤应用 |
| 容器 / 一次性虚拟机    | 才考虑 `--yolo`                                                         |

无论哪种姿态，密钥不进上下文、commit 和 push 由人确认这两条不要放。

## 参考来源

* 沙箱：[https://learn.chatgpt.com/docs/sandboxing](https://learn.chatgpt.com/docs/sandboxing)
* 审批与安全：[https://learn.chatgpt.com/docs/agent-approvals-security](https://learn.chatgpt.com/docs/agent-approvals-security)
* 权限模式：[https://learn.chatgpt.com/docs/permission-modes](https://learn.chatgpt.com/docs/permission-modes)
* Rules：[https://learn.chatgpt.com/docs/agent-configuration/rules](https://learn.chatgpt.com/docs/agent-configuration/rules)
* Windows 沙箱：[https://learn.chatgpt.com/docs/windows/windows-sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox)
