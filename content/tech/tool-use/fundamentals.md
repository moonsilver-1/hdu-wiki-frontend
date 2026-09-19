---
title: "默会知识"
date: "2026-09-20"
author: "洛洛"
excerpt: "建议按以下顺序阅读，每篇都是独立的，但知识是层层递进的："
tags: ["luoluo", "迁移"]
---

**默会知识（Tacit Knowledge）** 是指那些专家认为理所当然、从不解释，但新手如果没人告诉就完全不懂的知识。就像骑自行车——会骑的人觉得"不就是骑嘛"，但新手不知道该怎么保持平衡。

程序员在教人使用 Claude Code、Codex 这类 AI 编程工具时，总会被**知识的诅咒**所困扰：他们不自觉地跳过了大量"常识"，而这些"常识"对非技术人员来说根本不是常识。

本系列文档把使用 AI 编程工具时涉及的默会知识拆分为 8 个主题（例子多以 Claude Code 为主，概念对 Codex 同样适用），从最基础的终端概念到高级的配置体系，帮助完全不懂开发的人建立完整的认知框架。

## 阅读路线

建议按以下顺序阅读，每篇都是独立的，但知识是层层递进的：

1. **[终端与 Shell](/tech/tool-use/fundamentals-terminal-and-shell)** — Claude Code 运行的环境是什么？什么是终端、Shell、路径、环境变量、进程？
2. **[Git 版本控制](/tech/tool-use/fundamentals-git-version-control)** — 为什么 Claude Code 总在关注 git？什么是仓库、提交、分支、合并冲突？
3. **[项目结构与包管理](/tech/tool-use/fundamentals-project-structure)** — 现代开发项目是怎么组织的？package.json、node\_modules、编译构建是什么？
4. **[AI 模型与 Token](/tech/tool-use/fundamentals-ai-models-and-tokens)** — Claude Code 背后的 AI 引擎是怎么工作的？什么是 Token、上下文窗口、幻觉？
5. **[对话与记忆管理](/tech/tool-use/fundamentals-conversation-and-memory)** — 对话历史去哪了？怎么恢复？CLAUDE.md 和 Memory 有什么区别？
6. **[权限与安全机制](/tech/tool-use/fundamentals-permissions-and-security)** — 为什么要弹确认框？沙盒是什么？为什么 push 是危险操作？
7. **[工具与工作流](/tech/tool-use/fundamentals-tools-and-workflow)** — Claude Code 有哪些工具？斜杠命令、Plan 模式、子代理、Hooks 是什么？
8. **[配置与个性化](/tech/tool-use/fundamentals-configuration)** — 设置存在哪里？怎么自定义？多层配置的优先级是什么？

## 这些知识为什么重要？

不理解这些背景知识，使用 Claude Code 时你会：

* 不知道为什么"换了个文件夹就找不到之前的对话了"（→ 对话隔离机制）
* 不知道为什么"Claude 突然忘了我之前说的话"（→ 上下文窗口和自动压缩）
* 不知道为什么"有的操作要确认，有的不用"（→ 权限模型）
* 不知道为什么"同一个问题每次回答不一样"（→ 温度参数）
* 不知道为什么"Claude 说的函数根本不存在"（→ 幻觉现象）

理解了这些，你就能预判 Claude Code 的行为，更高效地使用它。

## 参考来源

* Claude Code 官方文档：[https://code.claude.com/docs（查阅于](https://code.claude.com/docs（查阅于) 2026-09-14）
* OpenAI Codex 官方文档：[https://developers.openai.com/codex（查阅于](https://developers.openai.com/codex（查阅于) 2026-09-14）
