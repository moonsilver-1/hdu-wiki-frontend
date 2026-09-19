---
title: "AGENTS.md 最佳实践"
date: "2026-09-20"
author: "洛洛"
excerpt: "Codex 每次启动会构建一条”指令链”："
tags: ["luoluo", "迁移"]
---

`AGENTS.md` 是给 Codex 看的项目说明书，作用相当于 Claude Code 的 `CLAUDE.md`。它不是 Codex 私有格式——`agents.md` 是一个跨工具的开放约定，Cursor、Gemini CLI 等也读它，所以一份文件多处受益。

## 加载层级

Codex 每次启动会构建一条"指令链"：

1. **全局层**：`~/.codex/AGENTS.md`（先找 `AGENTS.override.md`，没有才用 `AGENTS.md`），只取一个文件
2. **项目层**：从项目根（一般是 Git 根）向下走到当前目录，**每一级目录**依次找 `AGENTS.override.md` → `AGENTS.md` → 你在 `project_doc_fallback_filenames` 里配置的备用名，每级最多取一个
3. **合并**：从根往下用空行拼接。越靠近当前目录的文件排得越靠后，**后面的覆盖前面的**

所以子目录里的 `AGENTS.md` 是"追加并优先"，而不是替换根目录那份。

其他规则：空文件跳过；累计超过 `project_doc_max_bytes`（默认 32 KiB）后不再追加；没有缓存，重启即重建。

## `AGENTS.override.md`

同一目录里如果存在 `AGENTS.override.md`，就忽略同目录的 `AGENTS.md`。适合"临时改规则但不动基线文件"，删掉即恢复。

## 相关配置

```toml
## ~/.codex/config.toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
project_doc_max_bytes = 65536
project_root_markers = [".git", ".hg"]     # 设为 [] 则把当前目录当项目根
```

## 生成脚手架

```
/init
```

会在当前目录生成一份 `AGENTS.md` 模板。之后手工修，然后提交进仓库。

## 该写什么

官方的定位是"给 Agent 看的 README"，**保持短小**。一份好的 `AGENTS.md` 像项目交接卡：

```markdown
## 项目速览
- Next.js 16 + Fumadocs 的知识站，包管理器用 bun
- 文档在 content/docs/，AI 聊天在 src/app/api/chat/route.ts

## 命令
- bun run dev / bun run build / bun run lint / bun run types:check
- 提交前必须 lint 与 types:check 通过

## 规范
- TypeScript strict，2 空格缩进，Biome 负责格式
- 中文注释；文档正文中文，术语保留英文原名

## 边界
- 不要手改 .source/ 与 drizzle/ 下的迁移 SQL（生成物）
- 不要 commit / push，改完告诉我
- 密钥只从环境变量读，不写进仓库
```

## 不该写什么

* 能靠 linter、类型检查、pre-commit hook 强制的东西——机械规则交给工具，`AGENTS.md` 只写工具管不了的判断
* 长篇架构说明——放到 `docs/` 里，`AGENTS.md` 只写"去哪看"
* 会过时的具体数字（版本号、模型名）

## 什么时候该更新

官方给了四个信号：

1. Codex 反复犯同一个错
2. Codex 读了太多无关文件（说明缺路由指引，比如"鉴权逻辑在 src/lib/auth"）
3. 同一条 PR 反馈你说过两次
4. GitHub 上可以直接评论 `@codex add this to AGENTS.md`

一个省事的闭环：模型犯错 → 你纠正 → 让它自己把纠正写回 `AGENTS.md`。

## Code Review Rules

在离被管代码最近的 `AGENTS.md` 里加一节 `## Code Review Rules`，GitHub 上的 `@codex review` 会读取。只写"有后果、仓库特有"的规则，比如"所有数据库迁移必须可回滚"，别写"注意代码风格"。详见 [代码审查](/tech/codex/codex-review)。

## 调试：Codex 到底读了哪些文件？

```bash
codex --ask-for-approval never "列出你加载的所有指令来源"
codex --cd services/payments -a never "总结当前生效的指令"
codex debug prompt-input        # 打印模型实际看到的完整输入
```

## 和 CLAUDE.md 共存

同一个仓库要同时服务两个工具时，常见做法是把规范写在 `AGENTS.md`，然后 `CLAUDE.md` 里只留一行 `@AGENTS.md` 引用；或者反过来。Codex 的 `/import` 也能直接把 Claude Code 的配置搬过来。

## 参考来源

* AGENTS.md 官方文档：[https://learn.chatgpt.com/docs/agent-configuration/agents-md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
* 开放规范：[https://agents.md](https://agents.md)
* 最佳实践：[https://learn.chatgpt.com/guides/best-practices](https://learn.chatgpt.com/guides/best-practices)
