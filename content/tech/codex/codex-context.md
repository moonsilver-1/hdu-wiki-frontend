---
title: "上下文与会话管理"
date: "2026-09-20"
author: "洛洛"
excerpt: "会显示当前模型、审批策略、可写目录和剩余上下文容量。状态栏也可以常驻显示（[tui].status_line = [”model”, ”context-remaining”, ”git-branch”]）。"
tags: ["luoluo", "迁移"]
---

Codex 的每次对话都受模型上下文窗口限制。管好上下文，是让长任务不跑偏、不烧额度的关键。

## 看当前用了多少

```
/status
```

会显示当前模型、审批策略、可写目录和**剩余上下文容量**。状态栏也可以常驻显示（`[tui].status_line = ["model", "context-remaining", "git-branch"]`）。

GPT-5.6 在 Codex 里的上下文窗口按 0.144.6 版本的修正为 272K token；API 侧的 1M 上下文口径不适用于 Codex 会话，别混用。

## 压缩

```
/compact
```

手动把历史摘要成一段，释放空间。Codex 也会在接近阈值时**自动压缩**，阈值由这几个键控制：

```toml
model_context_window = 272000
model_auto_compact_token_limit = 200000
model_auto_compact_token_limit_scope = "total"   # total | body_after_prefix
```

压缩会触发 `PreCompact` / `PostCompact` Hook，可以在那里把关键信息落盘（见 [Hooks](/tech/codex/codex-hooks)）。

压缩前先自己做一件事：把这一阶段的结论、待办、决策让 Codex 写进一个文件（比如 `NOTES.md` 或 `AGENTS.md`）。摘要会丢细节，文件不会。

## 会话恢复

会话记录以 JSONL 存在 `~/.codex/sessions/YYYY/MM/DD/`。

```bash
codex resume                 # 选择器，默认只列当前目录
codex resume --last
codex resume <SESSION_ID 或名字>
codex resume --all           # 跨目录
codex resume --include-non-interactive   # 把 exec 会话也列出来
```

交互界面里 `/resume`、`/rename`（给会话起名以便日后找）、`/archive`、`/delete`。

目录不一致时 Codex 会问你用哪个 cwd，可以用 `[tui].resume_cwd = "session"` 固定。

## 分叉与侧聊

* `codex fork --last` 或 `/fork`：从当前状态分叉出新会话，原会话不动。适合"想试另一个方案但不想污染主线"
* `/side`（别名 `/btw`）：临时侧聊，问个问题、查个东西，记录和主线分开；不能在侧聊里再开侧聊
* 空输入框连按两次 `Esc`：回到上一条用户消息处编辑并从那里分叉，等于"撤回重说"

## 一条会话该做多少事？

经验法则：**一个会话一个目标**。原因是上下文里的旧信息会拖累模型判断（官方文档引用了 Chroma 的 context rot 研究）。

* 换一个不相关的任务 → `/new` 或 `/clear`
* 同一任务的分支探索 → `/fork`
* 顺手问一句 → `/side`

## 计划模式

```
/plan 把鉴权从 session 迁移到 JWT
```

计划模式下 Codex 先只读分析、产出步骤，你确认后再执行。推理强度可以单独设高一点：

```toml
plan_mode_reasoning_effort = "high"
```

复杂任务的常见套路：先 `/plan`，让 Codex 反过来"面试"你补齐需求，把计划写进 `PLANS.md`，再开始改。

## 目标模式

```
/goal set 让 pnpm test 全部通过并保持 lint 干净
/goal pause
/goal resume
/goal clear
```

Goal 是跨多轮持续生效的目标（上限 4000 字符），Codex 会在每轮结束时对照它检查是否完成，适合"跑到绿为止"这类长任务。Goal 模式在 2026-05 从实验状态转正。

## 记忆

`/memories` 管理跨会话记忆，目前是实验特性，需要 `[features].memories = true`。它记的是偏好和事实，不是代码，别把项目规范放这里——那是 `AGENTS.md` 的活。

## 长任务的操作清单

1. 开新会话，`/plan` 出步骤
2. 用 `/goal set` 锁定完成标准
3. 每完成一个里程碑让它把进度写进文件
4. 上下文剩 20% 左右时 `/compact`
5. 结束前 `/review` 一遍改动
6. 需要平行探索时 `/fork`，不要在主线上来回横跳

## 参考来源

* 配置参考（上下文与压缩键）：[https://learn.chatgpt.com/docs/config-file/config-reference](https://learn.chatgpt.com/docs/config-file/config-reference)
* 命令参考（resume / fork / side / plan / goal）：[https://learn.chatgpt.com/docs/developer-commands?surface=cli](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
* 子代理文档中的 context rot 讨论：[https://learn.chatgpt.com/docs/agent-configuration/subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
* 更新日志（GPT-5.6 上下文 272K 修正，2026-07-19）：[https://learn.chatgpt.com/docs/changelog](https://learn.chatgpt.com/docs/changelog)
