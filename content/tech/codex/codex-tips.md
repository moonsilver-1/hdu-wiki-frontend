---
title: "实用技巧"
date: "2026-09-20"
author: "洛洛"
excerpt: "先 AGENTS.md，再 Skill / Plugin，再 MCP，最后才是子代理。每一层都比上一层贵，别一上来就全开。"
tags: ["luoluo", "迁移"]
---

## 1. 官方推荐的搭建顺序

先 `AGENTS.md`，再 Skill / Plugin，再 MCP，最后才是子代理。每一层都比上一层贵，别一上来就全开。

## 2. 写好 prompt 的四要素

目标、上下文、约束、完成标准。写清"怎样算完成"比写长背景有用得多。难任务先 `/plan`，再 `/goal set` 锁定目标。

## 3. 让 Codex 自己维护 AGENTS.md

它犯错 → 你纠正 → 让它把纠正写回 `AGENTS.md`。GitHub 上直接评论 `@codex add this to AGENTS.md`。

## 4. 沙箱姿态

日常默认 Auto 就好。陌生仓库先 `-s read-only`。要联网就临时开 `[sandbox_workspace_write].network_access = true`，或者用 Rules 只放行 `gh`、`curl` 这类特定命令，别一步跳到 `--yolo`。

## 5. 一个会话一个目标

不相关的任务 `/new`；分支探索 `/fork`；顺手问一句 `/side`。上下文越长模型越容易被旧信息带偏。

## 6. 长任务先落盘

`/compact` 之前让 Codex 把结论和待办写进文件。摘要会丢细节，文件不会。

## 7. `Esc` 两下

空输入框连按两次 `Esc`，回到上一条消息编辑并从那里分叉。等于"撤回重说"，比重开会话省 token。

## 8. 排队指令

任务运行中输入指令后按 `Tab`，排到下一轮；`Enter` 则立刻插入。想中断按 `Esc`。

## 9. 用 Profile 分场景

```toml
## ~/.codex/ci.config.toml
sandbox_mode = "read-only"
approval_policy = "never"
model = "gpt-5.6-terra"
hide_agent_reasoning = true
```

`codex exec --profile ci "..."`。注意旧的 `[profiles.x]` 写法已经废弃。

## 10. 状态栏常驻上下文余量

```toml
[tui]
status_line = ["model", "context-remaining", "git-branch"]
notifications = ["agent-turn-complete", "approval-requested"]
```

## 11. 审查用更强的模型

```toml
review_model = "gpt-5.6-sol"
```

日常用 Terra 干活，`/review` 时自动换 Sol。

## 12. `codex doctor` 与 `codex debug prompt-input`

前者一键诊断安装 / 登录 / 配置；后者打印模型实际看到的完整输入，是排查"它为什么没读到我的 AGENTS.md"的利器。

## 13. 从 Claude Code 迁移

Codex 0.147 起有 `/import`，能把 Claude Code / Cursor 的指令、设置、Skills、插件、项目和近 30 天最多 50 个会话导进来；桌面 App 还能自动同步。手动对照表：

| Claude Code                           | Codex                                              |
| ------------------------------------- | -------------------------------------------------- |
| `CLAUDE.md`                           | `AGENTS.md`（层级合并规则类似）                              |
| `.claude/settings.json` 的 permissions | 沙箱模式 + 审批策略 + Rules                                |
| `.claude/hooks`                       | `.codex/hooks.json`（多一步 `/hooks` 信任）               |
| `.claude/skills` / 自定义命令              | `.agents/skills/`，用 `$name` 触发                     |
| `claude mcp add`                      | `codex mcp add`，配置键 `[mcp_servers.x]`              |
| `claude -p`                           | `codex exec`（默认只读，注意加 `--sandbox workspace-write`） |
| Plan mode                             | `/plan`                                            |
| Subagents                             | `.codex/agents/*.toml`                             |
| `/compact`                            | `/compact`                                         |

两个工具可以共存：同一仓库里 `AGENTS.md` 写规范，`CLAUDE.md` 只放一行 `@AGENTS.md`。

## 14. 常见坑

* **`codex exec` 改不了文件**：默认只读，加 `--sandbox workspace-write`
* **`codex exec` 报"不在 Git 仓库"**：加 `--skip-git-repo-check`
* **Hook 不跑**：没在 `/hooks` 里信任
* **项目 `.codex/config.toml` 不生效**：项目未被信任，或写了被禁用的键（`model_provider`、`notify` 等）
* **`--full-auto` 报警告**：已废弃，改用 `--sandbox workspace-write`
* **`codex login --api-key` 直接退出**：改用 `printenv OPENAI_API_KEY | codex login --with-api-key`
* **Linux 沙箱起不来**：装 `bubblewrap`；Ubuntu 24.04 加载 `bwrap-userns-restrict`
* **Skill 不触发**：放错目录（应为 `.agents/skills`），或 `description` 没写清触发条件
* **`gpt-5.4` 突然没了**：2026-08-31 退役，换 `gpt-5.6-terra`

## 15. 别写死的东西

模型名、额度数字、窗口时长、版本号——都别写进团队规范。写"当前推荐的默认模型""以账号内显示的额度为准"。这套教程里凡是带日期的数字，也请以那个日期为准。

## 参考来源

* 最佳实践：[https://learn.chatgpt.com/guides/best-practices](https://learn.chatgpt.com/guides/best-practices)
* Prompt 写法：[https://learn.chatgpt.com/docs/prompting](https://learn.chatgpt.com/docs/prompting)
* 定制总览：[https://learn.chatgpt.com/docs/customization/overview](https://learn.chatgpt.com/docs/customization/overview)
* 导入（Claude Code / Cursor）：[https://learn.chatgpt.com/docs/import](https://learn.chatgpt.com/docs/import)
