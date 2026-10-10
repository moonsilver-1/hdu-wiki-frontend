---
title: "代码审查"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "* 对比基线分支（比如当前分支 vs main）"
tags: ["洛洛", "转载"]
---

代码审查是 Codex 打磨得最成熟的工作流之一，本地和 GitHub 两侧都有入口。

## 本地：`/review`

在交互界面里：

```
/review
```

会让你选审查范围：

* **对比基线分支**（比如当前分支 vs `main`）
* **未提交的改动**（包含 staged、unstaged、untracked）
* **指定 commit**
* **自定义指令**（比如"只看并发安全"）

审查用当前会话的模型；想固定用更强的模型审查，设：

```toml
review_model = "gpt-5.6-sol"
```

## 非交互：`codex review`

```bash
codex review --uncommitted
codex review --base main
codex review --commit abc123 --title "限流补丁"
codex review "只检查 SQL 注入和鉴权绕过"
```

四种范围互斥。适合放进 pre-push 脚本或 CI。

## GitHub：`@codex review`

前提：先在 Codex cloud 里为仓库启用云端环境（需要仓库的 push 或 admin 权限）。

在 PR 评论里：

```
@codex review
@codex review for issues in the database migration
@codex security review
@codex fix the P1 issue
```

Codex 会先给评论点个 👀，然后以标准 GitHub review 的形式回帖。其他 `@codex` 提及会以该 PR 为上下文开一个云端会话。

**自动审查**：在 Codex 设置里打开 Automatic reviews，之后每个新 PR（或新 push）自动跑一遍。

Codex 的审查策略是**只报 P0 / P1**，减少噪音；想要更深的安全分析用 `@codex security review`。2026-07 起还支持跨多个仓库的联合审查。

## 自定义审查规则

在离被管代码最近的 `AGENTS.md` 里加一节：

```markdown
## Code Review Rules
- 数据库迁移必须可回滚，并附带 down 脚本
- 任何改动 src/app/api/chat 的 PR 都要说明对 token 成本的影响
- 不允许在客户端组件里读环境变量
```

写"有后果、仓库特有"的规则，格式和风格交给 lint。

## 用子代理做多维度审查

审查天然适合并行，因为它是只读的：

```
对当前分支相对 main 的改动做审查。为下面每一点各开一个子代理，等全部完成后按点汇总：
1. 安全 2. 正确性 3. 竞态 4. 测试覆盖 5. 可维护性
```

详见 [子代理与并行](/tech/codex/codex-multi-agent)。

## 审查结果怎么用

* 让 Codex 直接修：`把刚才 review 里的 P1 都修掉，P2 先列出来不动`
* 只想要意见不想它动手：先切 `/permissions` 到 Read Only 再 `/review`
* 结论要留档：`codex review --base main > review.md`（stdout 只有最终报告）

## 参考来源

* 代码审查：[https://learn.chatgpt.com/docs/code-review](https://learn.chatgpt.com/docs/code-review)
* GitHub 集成：[https://learn.chatgpt.com/docs/third-party/github](https://learn.chatgpt.com/docs/third-party/github)
* 命令参考（`codex review` 参数）：[https://learn.chatgpt.com/docs/developer-commands?surface=cli](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
