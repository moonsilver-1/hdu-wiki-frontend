---
title: "Claude Code 参考手册：速记、配置与实践"
date: "2026-08-09"
author: "TNHTH"
section: "vibecoding"
excerpt: "收录 Claude Code 的速记、配置和工程实践参考，方便查命令、查规则、查协作方法。"
tags: ["Claude Code", "参考", "CLAUDE.md", "AI编程"]
---

> 本文是 Claude Code 的参考资料篇，核心安装和上手请先看《Claude Code 完整上手教程》。
>
> 原始知识库入口：[AI编程快乐屋](https://my.feishu.cn/wiki/V5slwCIkUimnjKkyJuEcJiW0nuc)。

## 克劳德代码速记指南The Shorthand Guide to Everything Claude Code

](https://my.feishu.cn/wiki/L8nPwCC6EiX7sVk5X8bc0RObnPd)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

Here's my complete setup after 10 months of daily use: skills, hooks, subagents, MCPs, plugins, and what actually works.

这是我经过 10 个月的日常使用后的完整设置：技能、钩子、子代理、MCP、插件以及实际有效的功能。

Been an avid Claude Code user since the experimental rollout in Feb, and won the Anthropic x Forum Ventures hackathon with

completely using Claude Code.

自二月份实验性推出以来，我一直是 Claude Code 的忠实用户，并赢得了 Anthropic x Forum Ventures 黑客马拉松大赛。

#### Skills and Commands
技能和指令

Skills operate like rules, constricted to certain scopes and workflows. They're shorthand to prompts when you need to execute a particular workflow.

技能就像规则一样，只能在特定的范围和工作流程中使用。它们是执行特定工作流程时发出的提示的简写形式。

After a long session of coding with Opus 4.5, you want to clean out dead code and loose .md files?

使用 Opus 4.5 长时间编码后，您是否想要清理无用代码和丢失的 .md 文件？

Run /refactor-clean. Need testing? /tdd, /e2e, /test-coverage. Skills and commands can be chained together in a single prompt
运行 /refactor-clean 。需要测试？ /tdd 、 /e2e 、 /test-coverage 。可以在单个提示符中将技能和命令串联起来。

chaining commands together

将命令串联起来

I can make a skill that updates codemaps at checkpoints - a way for Claude to quickly navigate your codebase without burning context on exploration.

我可以创建一个技能，在检查点更新代码映射——这样 Claude 就可以快速浏览你的代码库，而不会在探索过程中丢失上下文信息。

~/.claude/skills/codemap-updater.md

Commands are skills executed via slash commands. They overlap but are stored differently:

命令是通过斜杠命令执行的技能。它们之间有重叠之处，但存储方式不同：

- Skills: ~/.claude/skills - broader workflow definitions
技能： ~/.claude/skills - 更广泛的工作流程定义

- Commands: ~/.claude/commands - quick executable prompts
命令： ~/.claude/commands - 快速执行提示

bash

狂欢

```text
## Example skill structure
~/.claude/skills/
  pmx-guidelines.md      # Project-specific patterns
  coding-standards.md    # Language best practices
  tdd-workflow/          # Multi-file skill with README.md
  security-review/       # Checklist-based skill
```

#### Hooks
钩子

Hooks are trigger-based automations that fire on specific events. Unlike skills, they're constricted to tool calls and lifecycle events.

钩子是基于触发器的自动化流程，会在特定事件发生时触发。与技能不同，它们仅限于工具调用和生命周期事件。

Hook Types
钩子类型

1. PreToolUse  - Before a tool executes (validation, reminders)
工具预使用  - 在工具执行之前（验证、提醒）

1. PostToolUse - After a tool finishes (formatting, feedback loops)
工具使用后 - 工具完成后（格式化、反馈循环）

1. UserPromptSubmit - When you send a message
用户提示提交 - 当您发送消息时

1. Stop - When Claude finishes responding
停止 ——当克劳德回答完毕时

1. PreCompact - Before context compaction
预压缩 - 上下文压缩之前

1. Notification - Permission requests
通知 - 权限请求

Example: tmux reminder before long-running commands
例如：tmux 在长时间运行命令之前发出提醒

json

```text
{
  "PreToolUse": [
    {
      "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm|pnpm|yarn|cargo|pytest)\"",
      "hooks": [
        {
          "type": "command",
          "command": "if [ -z \"$TMUX\" ]; then echo '[Hook] Consider tmux for session persistence' >&2; fi"
        }
      ]
    }
  ]
}
```

Example of what feedback you get in Claude Code, while running a PostToolUse hook

以下是在 Claude Code 中运行 PostToolUse 钩子时收到的反馈示例

Pro tip: Use the `hookify` plugin to create hooks conversationally instead of writing JSON manually. Run /hookify and describe what you want.
专业提示： 使用 `hookify` 插件可以以对话方式创建钩子，而无需手动编写 JSON 代码。运行 `/hookify` 命令并描述您的需求。

#### Subagents
次级代理商

Subagents are processes your orchestrator (main Claude) can delegate tasks to with limited scopes. They can run in background or foreground, freeing up context for the main agent.

子代理是编排器（主代理 Claude）可以委派任务的进程，它们拥有有限的权限范围。子代理可以在后台或前台运行，从而为主代理释放上下文资源。

Subagents work nicely with skills - a subagent capable of executing a subset of your skills can be delegated tasks and use those skills autonomously. They can also be sandboxed with specific tool permissions.

子代理与技能配合使用效果很好——能够执行部分技能的子代理可以被委派任务，并自主使用这些技能。它们还可以被隔离在沙盒环境中，并拥有特定的工具权限。

bash

狂欢

```text
## Example subagent structure
~/.claude/agents/
  planner.md           # Feature implementation planning
  architect.md         # System design decisions
  tdd-guide.md         # Test-driven development
  code-reviewer.md     # Quality/security review
  security-reviewer.md # Vulnerability analysis
  build-error-resolver.md
  e2e-runner.md
  refactor-cleaner.md
```

Configure allowed tools, MCPs, and permissions per subagent for proper scoping.

为每个子代理配置允许的工具、MCP 和权限，以实现正确的范围界定。

#### Rules and Memory
规则与记忆

Your `.rules` folder holds `.md` files with best practices Claude should ALWAYS follow. Two approaches:

您的 `.rules` 文件夹包含 `.md` 文件，其中列出了 Claude 应该始终遵循的最佳实践。有两种方法：

1. Single

1. CLAUDE.md

1. - Everything in one file (user or project level)
单身的

1. CLAUDE.md

1. - 所有内容都放在一个文件中（用户级别或项目级别）

1. Rules folder - Modular `.md` files grouped by concern
规则文件夹 - 按关注点分组的模块化 `.md` 文件

bash

狂欢

```text
~/.claude/rules/
  security.md      # No hardcoded secrets, validate inputs
  coding-style.md  # Immutability, file organization
  testing.md       # TDD workflow, 80% coverage
  git-workflow.md  # Commit format, PR process
  agents.md        # When to delegate to subagents
  performance.md   # Model selection, context management
```

Example rules: 
规则示例：

- No emojis in codebase
代码库中没有表情符号

- Refrain from purple hues in frontend
前端设计应避免使用紫色调。

- Always test code before deployment
部署前务必测试代码。

- Prioritize modular code over mega-files
优先考虑模块化代码，而不是大型文件。

- Never commit console.logs
永远不要提交 console.log 文件。

#### MCPs (Model Context Protocol)
MCP（模型上下文协议）

MCPs connect Claude to external services directly. Not a replacement for APIs - it's a prompt-driven wrapper around them, allowing more flexibility in navigating information.

MCP 将 Claude 直接连接到外部服务。它并非 API 的替代品，而是对 API 的一种提示驱动式封装，从而在信息导航方面提供了更大的灵活性。

Example: Supabase MCP lets Claude pull specific data, run SQL directly upstream without copy-paste. Same for databases, deployment platforms, etc.
例如 ：Supabase MCP 允许 Claude 提取特定数据，并直接向上游运行 SQL，无需复制粘贴。数据库、部署平台等也同样适用。

Example of the supabase mcp listing the tables within the public schema

示例：superbase mcp 列出公共模式中的表

Chrome in Claude: is a built-in plugin MCP that lets Claude autonomously control your browser - clicking around to see how things work.
Claude 中的 Chrome： 是一个内置插件 MCP，它可以让 Claude 自主控制你的浏览器——点击浏览以了解其工作原理。

CRITICAL: Context Window Management
关键：上下文窗口管理

Be picky with MCPs. I keep all MCPs in user config but disable everything unused. Navigate to /plugins and scroll down or run /mcp.
要谨慎选择 MCP。我把所有 MCP 都保留在用户配置中，但禁用所有未使用的 。导航到 /plugins 并向下滚动，或运行 /mcp 。

Your 200k context window before compacting might only be 70k with too many tools enabled. Performance degrades significantly.

压缩前 200k 的上下文窗口，如果启用了过多工具，可能只有 70k。性能会显著下降。

using /plugins to navigate to MCPs to see which ones are currently installed and their status

使用 /plugins 导航到 MCP，查看当前已安装的插件及其状态

Rule of thumb: Have 20-30 MCPs in config, but keep under 10 enabled / under 80 tools active.
经验法则： 配置中保留 20-30 个 MCP，但启用的 MCP 不超过 10 个，激活的 MCP 不超过 80 个。

#### Plugins
插件

Plugins package tools for easy installation instead of tedious manual setup. A plugin can be a skill + MCP combined, or hooks/tools bundled together.

插件将工具打包在一起，方便安装，无需繁琐的手动设置。一个插件可以是技能和 MCP 的组合，也可以是钩子/工具的捆绑。

Installing plugins: 
安装插件：

bash

狂欢

```text
## Add a marketplace
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep
## Open Claude, run /plugins, find new marketplace, install from there
```

displaying the newly installed Mixedbread-Grep marketplace

显示新安装的 Mixedbread-Grep 市场

LSP Plugins: are particularly useful if you run Claude Code outside editors frequently. Language Server Protocol gives Claude real-time type checking, go-to-definition, and intelligent completions without needing an IDE open.
LSP 插件： 如果您经常在编辑器之外运行 Claude Code，它们将特别有用。语言服务器协议（LSP）使 Claude 无需打开 IDE 即可实现实时类型检查、跳转到定义和智能代码补全。

bash

狂欢

```text
## Enabled plugins example
typescript-lsp@claude-plugins-official  # TypeScript intelligence
pyright-lsp@claude-plugins-official     # Python type checking
hookify@claude-plugins-official         # Create hooks conversationally
mgrep@Mixedbread-Grep                   # Better search than ripgrep
```

Same warning as MCPs - watch your context window.

与 MCP 相同的警告——请注意上下文窗口。

#### Tips and Tricks
技巧和窍门

Keyboard Shortcuts
键盘快捷键

- Ctrl+U - Delete entire line (faster than backspace spam)
Ctrl+U - 删除整行（比狂按退格键更快）

- ! - Quick bash command prefix
! - 快速 bash 命令前缀

- @ - Search for files
@ - 搜索文件

- / - Initiate slash commands
/ - 发起斜杠命令

- Shift+Enter - Multi-line input
Shift+Enter - 多行输入

- Tab - Toggle thinking display
标签页 - 切换思维显示

- Esc Esc - Interrupt Claude / restore code
Esc Esc - 中断 Claude / 恢复代码

Parallel Workflows
并行工作流程

/fork - Fork conversations to do non-overlapping tasks in parallel instead of spamming queued messages
/fork - 分支对话，以便并行执行不重叠的任务，而不是向队列中发送大量消息。

Git Worktrees - For overlapping parallel Claudes without conflicts. Each worktree is an independent checkout
Git 工作树 - 用于并行重叠且无冲突的 Claude 分支。每个工作树都是一个独立的检出。

bash

狂欢

```text
git worktree add ../feature-branch feature-branch
## Now run separate Claude instances in each worktree
```

tmux for Long-Running Commands: Stream and watch logs/bash processes Claude runs.
tmux 用于长时间运行的命令： 流式传输和监视 Claude 运行的日志/bash 进程。

letting claude code spin up the frontend and backend servers and monitoring the logs by attaching to the session using tmux

让 Claude Code 启动前端和后端服务器，并通过 tmux 连接到会话来监控日志。

bash

狂欢

```text
tmux new -s dev
## Claude runs commands here, you can detach and reattach
tmux attach -t dev
```

mgrep > grep: `mgrep` is a significant improvement from ripgrep/grep. Install via plugin marketplace, then use the /mgrep skill. Works with both local search and web search.
mgrep > grep： `mgrep` 是对 ripgrep/grep 的重大改进。通过插件市场安装，然后使用 /mgrep 技能。支持本地搜索和网络搜索。

bash

狂欢

```text
mgrep "function handleSubmit"  # Local search
mgrep --web "Next.js 15 app router changes"  # Web search
```

Other Useful Commands
其他实用命令

- /rewind - Go back to a previous state
/rewind - 返回到之前的状态

- /statusline - Customize with branch, context %, todos
/statusline - 可自定义分支、上下文、百分比、待办事项

- /checkpoints - File-level undo points
/checkpoints - 文件级撤销点

- /compact - Manually trigger context compaction
/compact - 手动触发上下文压缩

GitHub Actions CI/CD

Set up code review on your PRs with GitHub Actions. Claude can review PRs automatically when configured.

使用 GitHub Actions 为你的 PR 设置代码审查。配置完成后，Claude 可以自动审查 PR。

claude approving a bug fix PR

克劳德批准了修复漏洞的公关稿

Sandboxing
沙盒

Use sandbox mode for risky operations - Claude runs in restricted environment without affecting your actual system. (Use --dangerously-skip-permissions - to do the opposite of this and let claude roam free, this can be destructive if not careful.)

对于高风险操作，请使用沙盒模式——Claude 将在受限环境中运行，不会影响您的实际系统。（使用 `--dangerously-skip-permissions` 参数可以反其道而行之，让 Claude 自由运行，但如果不小心，这可能会造成破坏。）

#### On Editors
关于编辑

While an editor isn't needed it can positively or negatively impact your Claude Code workflow. While Claude Code works from any terminal, pairing it with a capable editor unlocks real-time file tracking, quick navigation, and integrated command execution.

虽然并非必须使用编辑器，但它会对你的 Claude Code 工作流程产生积极或消极的影响。Claude Code 可在任何终端运行，但搭配功能强大的编辑器使用，可以解锁实时文件跟踪、快速导航和集成命令执行等功能。

Zed (My Preference)
Zed（我的偏好）

I use

Zed

- a Rust-based editor that's lightweight, fast, and highly customizable.

我使用

泽德

- 一款基于 Rust 的编辑器，它轻量级、速度快、高度可定制。

Why Zed works well with Claude Code:
Zed 与 Claude Code 配合良好的原因：

- Agent Panel Integration - Zed's Claude integration lets you track file changes in real-time as Claude edits. Jump between files Claude references without leaving the editor
代理面板集成 - Zed 的 Claude 集成功能让您可以实时跟踪 Claude 编辑的文件更改。无需离开编辑器即可在 Claude 引用的文件之间跳转。

- Performance - Written in Rust, opens instantly and handles large codebases without lag
性能卓越 ——采用 Rust 编写，瞬间打开，即使处理大型代码库也毫无卡顿。

- CMD+Shift+R Command Palette - Quick access to all your custom slash commands, debuggers, and tools in a searchable UI. Even if you just want to run a quick command without switching to terminal
CMD+Shift+R 命令面板 - 通过可搜索的界面快速访问所有自定义斜杠命令、调试器和工具。即使您只想快速运行命令而无需切换到终端，也能轻松使用。

- Minimal Resource Usage - Won't compete with Claude for system resources during heavy operations
资源占用极低 ——在高负载运行时不会与克劳德争夺系统资源。

- Vim Mode - Full vim keybindings if that's your thing
Vim 模式 - 完整的 Vim 快捷键绑定，如果你喜欢的话

Zed Editor with custom commands dropdown using CMD+Shift+R.

使用 CMD+Shift+R 的 Zed 编辑器，可自定义命令下拉菜单。

Following mode shown as the bullseye in the bottom right.

跟随模式显示在右下角的靶心处。

1. Split your screen - Terminal with Claude Code on one side, editor on the other using 
将屏幕分成两半 ——一边是终端和 Claude Code，另一边是编辑器，使用以下方式：

1. Ctrl + G  - quickly open the file Claude is currently working on in Zed
Ctrl + G - 在 Zed 中快速打开 Claude 当前正在处理的文件

1. Auto-save - Enable autosave so Claude's file reads are always current
自动保存 - 启用自动保存功能，以便 Claude 读取的文件始终保持最新状态。

1. Git integration - Use editor's git features to review Claude's changes before committing
Git 集成 - 使用编辑器的 Git 功能在提交之前查看 Claude 的更改

1. File watchers - Most editors auto-reload changed files, verify this is enabled
文件监视器 - 大多数编辑器会自动重新加载已更改的文件，请确认此功能已启用。

VSCode / Cursor
VSCode / 光标

This is also a viable choice and works well with Claude Code. You can use it in either terminal format, with automatic sync with your editor using \ide enabling LSP functionality (somewhat redundant with plugins now). Or you can opt for the extension which is more integrated with the Editor and has a matching UI.
这也是一个可行的选择，并且与 Claude Code 兼容性很好。你可以在终端模式下使用它，并通过 `\ide` 命令启用 LSP 功能，实现与编辑器的自动同步（现在有了插件，这个功能有点多余）。或者，你也可以选择使用扩展程序，它与编辑器集成度更高，并且拥有匹配的用户界面。

from the docs directly at

https://code.claude.com/docs/en/vs-code

直接摘自文档

https://code.claude.com/docs/en/vs-code

#### My Setup
我的配置

Plugins
插件

Installed: (I usually only have 4-5 of these enabled at a time)

已安装：（我通常一次只启用其中 4-5 个）

markdown

标记化

```text
ralph-wiggum@claude-code-plugins       # Loop automation
frontend-design@claude-code-plugins    # UI/UX patterns
commit-commands@claude-code-plugins    # Git workflow
security-guidance@claude-code-plugins  # Security checks
pr-review-toolkit@claude-code-plugins  # PR automation
typescript-lsp@claude-plugins-official # TS intelligence
hookify@claude-plugins-official        # Hook creation
code-simplifier@claude-plugins-official
feature-dev@claude-code-plugins
explanatory-output-style@claude-code-plugins
code-review@claude-code-plugins
context7@claude-plugins-official       # Live documentation
pyright-lsp@claude-plugins-official    # Python types
mgrep@Mixedbread-Grep                  # Better search
```

MCP Servers
MCP 服务器

Configured (User Level):

已配置（用户级别）：

json

```text
{
  "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] },
  "firecrawl": { "command": "npx", "args": ["-y", "firecrawl-mcp"] },
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=YOUR_REF"]
  },
  "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  },
  "vercel": { "type": "http", "url": "https://mcp.vercel.com" },
  "railway": { "command": "npx", "args": ["-y", "@railway/mcp-server"] },
  "cloudflare-docs": { "type": "http", "url": "https://docs.mcp.cloudflare.com/mcp" },
  "cloudflare-workers-bindings": {
    "type": "http",
    "url": "https://bindings.mcp.cloudflare.com/mcp"
  },
  "cloudflare-workers-builds": { "type": "http", "url": "https://builds.mcp.cloudflare.com/mcp" },
  "cloudflare-observability": {
    "type": "http",
    "url": "https://observability.mcp.cloudflare.com/mcp"
  },
  "clickhouse": { "type": "http", "url": "https://mcp.clickhouse.cloud/mcp" },
  "AbletonMCP": { "command": "uvx", "args": ["ableton-mcp"] },
  "magic": { "command": "npx", "args": ["-y", "@magicuidesign/mcp@latest"] }
}
```

Disabled per project (context window management):

每个项目已禁用（上下文窗口管理）：

markdown

标记化

```text
## In ~/.claude.json under projects.[path].disabledMcpServers
disabledMcpServers: [
  "playwright",
  "cloudflare-workers-builds",
  "cloudflare-workers-bindings",
  "cloudflare-observability",
  "cloudflare-docs",
  "clickhouse",
  "AbletonMCP",
  "context7",
  "magic"
]
```

This is the key - I have 14 MCPs configured but only ~ 5-6 enabled per project. Keeps context window healthy.

关键在于——我配置了 14 个 MCP，但每个项目只启用 5-6 个。这样可以保持上下文窗口的良好运行。

Key Hooks
钥匙钩

json

```text
{
  "PreToolUse": [
    // tmux reminder for long-running commands
    { "matcher": "npm|pnpm|yarn|cargo|pytest", "hooks": ["tmux reminder"] },
    // Block unnecessary .md file creation
    { "matcher": "Write && .md file", "hooks": ["block unless README/CLAUDE"] },
    // Review before git push
    { "matcher": "git push", "hooks": ["open editor for review"] }
  ],
  "PostToolUse": [
    // Auto-format JS/TS with Prettier
    { "matcher": "Edit && .ts/.tsx/.js/.jsx", "hooks": ["prettier --write"] },
    // TypeScript check after edits
    { "matcher": "Edit && .ts/.tsx", "hooks": ["tsc --noEmit"] },
    // Warn about console.log
    { "matcher": "Edit", "hooks": ["grep console.log warning"] }
  ],
  "Stop": [
    // Audit for console.logs before session ends
    { "matcher": "*", "hooks": ["check modified files for console.log"] }
  ]
}
```

Custom Status Line
自定义状态行

Shows user, directory, git branch with dirty indicator, context remaining %, model, time, and todo count:

显示用户、目录、带有脏值指示器的 Git 分支、剩余上下文百分比、模型、时间和待办事项数量：

example statusline in my Mac root directory

我的 Mac 根目录中的示例状态行

Rules Structure
规则结构

markdown

标记化

```text
~/.claude/rules/
  security.md      # Mandatory security checks
  coding-style.md  # Immutability, file size limits
  testing.md       # TDD, 80% coverage
  git-workflow.md  # Conventional commits
  agents.md        # Subagent delegation rules
  patterns.md      # API response formats
  performance.md   # Model selection (Haiku vs Sonnet vs Opus)
  hooks.md         # Hook documentation
```

Subagents
次级代理商

markdown

标记化

```text
~/.claude/agents/
  planner.md           # Break down features
  architect.md         # System design
  tdd-guide.md         # Write tests first
  code-reviewer.md     # Quality review
  security-reviewer.md # Vulnerability scan
  build-error-resolver.md
  e2e-runner.md        # Playwright tests
  refactor-cleaner.md  # Dead code removal
  doc-updater.md       # Keep docs synced
```

#### Key Takeaways
要点总结

1. Don't overcomplicate - treat configuration like fine-tuning, not architecture
不要把事情复杂化——把配置看作是微调，而不是架构设计。

1. Context window is precious - disable unused MCPs and plugins
上下文窗口非常宝贵——禁用未使用的 MCP 和插件

1. Parallel execution - fork conversations, use git worktrees
并行执行——创建多个会话，使用 Git 工作树

1. Automate the repetitive - hooks for formatting, linting, reminders
自动化重复性任务——格式化、代码检查、提醒等钩子

1. Scope your subagents - limited tools = focused execution
明确你的子代理范围——工具有限=执行更高效。

#### References
参考

-

Plugins Reference

-

插件参考

-

Hooks Documentation

-

钩子文档

-

Checkpointing

-

检查点

-

Interactive Mode

-

交互模式

-

Memory System

-

内存系统

- [

Subagents

]

- [

次级代理商

]

- [

MCP Overview

]

- [

MCP 概述

]

## K 神的Claude编码体验 

A few random notes from claude coding quite a bit last few weeks.

克劳德最近几周一直在写代码，以下是他的一些零散笔记。

Coding workflow. Given the latest lift in LLM coding capability, like many others I rapidly went from about 80% manual+autocomplete coding and 20% agents in November to 80% agent coding and 20% edits+touchups in December. i.e. I really am mostly programming in English now, a bit sheepishly telling the LLM what code to write... in words. It hurts the ego a bit but the power to operate over software in large "code actions" is just too net useful, especially once you adapt to it, configure it, learn to use it, and wrap your head around what it can and cannot do. This is easily the biggest change to my basic coding workflow in ~2 decades of programming and it happened over the course of a few weeks. I'd expect something similar to be happening to well into double digit percent of engineers out there, while the awareness of it in the general population feels well into low single digit percent.

编码工作流程。鉴于 LLM 编码能力的最新提升，和许多人一样，我的编码工作量迅速从 11 月份的 80%手动+自动补全编码和 20%智能体编码，转变为 12 月份的 80%智能体编码和 20%编辑+润色。也就是说，我现在基本上是用英语编程，有点不好意思地用文字告诉 LLM 该写什么代码。这有点打击自尊心，但能够操控软件进行大规模的“代码操作”实在太有用了，尤其是在你适应它、配置它、学习使用它并理解它的功能和局限性之后。这绝对是我近 20 年编程生涯中，基本编码工作流程的最大变化，而且这一切只用了几周时间就发生了。我预计会有相当一部分工程师正在经历类似的转变，而普通大众对此的认知度似乎只有个位数。

IDEs/agent swarms/fallability. Both the "no need for IDE anymore" hype and the "agent swarm" hype is imo too much for right now. The models definitely still make mistakes and if you have any code you actually care about I would watch them like a hawk, in a nice large IDE on the side. The mistakes have changed a lot - they are not simple syntax errors anymore, they are subtle conceptual errors that a slightly sloppy, hasty junior dev might do. The most common category is that the models make wrong assumptions on your behalf and just run along with them without checking. They also don't manage their confusion, they don't seek clarifications, they don't surface inconsistencies, they don't present tradeoffs, they don't push back when they should, and they are still a little too sycophantic. Things get better in plan mode, but there is some need for a lightweight inline plan mode. They also really like to overcomplicate code and APIs, they bloat abstractions, they don't clean up dead code after themselves, etc. They will implement an inefficient, bloated, brittle construction over 1000 lines of code and it's up to you to be like "umm couldn't you just do this instead?" and they will be like "of course!" and immediately cut it down to 100 lines. They still sometimes change/remove comments and code they don't like or don't sufficiently understand as side effects, even if it is orthogonal to the task at hand. All of this happens despite a few simple attempts to fix it via instructions in CLAUDE . md. Despite all these issues, it is still a net huge improvement and it's very difficult to imagine going back to manual coding. TLDR everyone has their developing flow, my current is a small few CC sessions on the left in ghostty windows/tabs and an IDE on the right for viewing the code + manual edits.

IDE/智能体集群/易错性。在我看来，目前“不再需要 IDE”和“智能体集群”的炒作都有些过头了。模型肯定还会犯错，如果你有任何真正关心的代码，我建议你像老鹰一样紧盯它们，最好同时使用一个功能强大的 IDE。这些错误已经发生了很大的变化——它们不再是简单的语法错误，而是一些细微的概念性错误，即使是稍显粗心、草率的初级开发人员也可能犯。最常见的错误是模型替你做出了错误的假设，并且不加验证就照搬执行。它们也无法处理自身的困惑，不会寻求澄清，不会发现不一致之处，不会权衡利弊，不会在应该反驳的时候提出异议，而且它们仍然有点过于奉承。计划模式下情况有所改善，但仍然需要一个轻量级的内联计划模式。他们还特别喜欢把代码和 API 搞得过于复杂，抽象层臃肿不堪，而且他们自己写完代码后也不清理无用代码等等。他们会用上千行代码实现一个低效、臃肿、脆弱的结构，而你只能指望他们说“嗯，你们为什么不直接这么做呢？”，他们会说“当然可以！”然后立刻把代码精简到 100 行。他们有时还会因为不喜欢或者不理解而修改/删除一些注释和代码，即使这些修改和删除与当前任务无关。尽管在 CLAUDE.md 文件中已经有一些简单的修复方法，但这些问题依然存在。尽管存在这些问题，但总体来说，这仍然是一个巨大的进步，很难想象再回到手动编码的时代。 简而言之，每个人都有自己的开发流程，我目前的流程是在左侧的 Ghosty 窗口/标签页中进行几个 CC 会话，然后在右侧使用 IDE 查看代码并进行手动编辑。

Tenacity. It's so interesting to watch an agent relentlessly work at something. They never get tired, they never get demoralized, they just keep going and trying things where a person would have given up long ago to fight another day. It's a "feel the AGI" moment to watch it struggle with something for a long time just to come out victorious 30 minutes later. You realize that stamina is a core bottleneck to work and that with LLMs in hand it has been dramatically increased.

毅力。看着一个智能体孜孜不倦地努力工作，真是令人着迷。他们从不疲倦，从不气馁，总是坚持不懈地尝试，即使常人早已放弃，他们也会为了留得青山在，不怕没柴烧。看着智能体长时间苦苦挣扎，最终在 30 分钟后取得胜利，你会真切地感受到它的韧性。你会意识到，耐力是工作效率的核心瓶颈，而有了 LLM（智能体语言模型）之后，耐力得到了显著提升。

Speedups. It's not clear how to measure the "speedup" of LLM assistance. Certainly I feel net way faster at what I was going to do, but the main effect is that I do a lot more than I was going to do because 1) I can code up all kinds of things that just wouldn't have been worth coding before and 2) I can approach code that I couldn't work on before because of knowledge/skill issue. So certainly it's speedup, but it's possibly a lot more an expansion.

速度提升。LLM 辅助带来的“速度提升”难以衡量。当然，我感觉自己完成原本计划的工作速度快了很多，但主要影响在于我能完成的工作量远超预期，原因有二：1）我可以编写以前根本不可能编写的各种代码；2）我可以处理以前由于知识/技能不足而无法处理的代码。因此，速度确实提升了，但或许更多的是一种能力的扩展。

Leverage. LLMs are exceptionally good at looping until they meet specific goals and this is where most of the "feel the AGI" magic is to be found. Don't tell it what to do, give it success criteria and watch it go. Get it to write tests first and then pass them. Put it in the loop with a browser MCP. Write the naive algorithm that is very likely correct first, then ask it to optimize it while preserving correctness. Change your approach from imperative to declarative to get the agents looping longer and gain leverage.

利用杠杆效应。LLM（生命周期管理）非常擅长循环执行直至达成特定目标，而这正是“感受通用人工智能”魔力的关键所在。不要直接告诉它该做什么，而是设定成功标准，然后静观其变。先让它编写测试，然后让它通过测试。将它与浏览器 MCP（多级控制点）连接起来。先编写一个很可能正确的简单算法，然后让它在保持正确性的前提下进行优化。将你的方法从命令式转变为声明式，让智能体循环执行更长时间，从而获得杠杆效应。

Fun. I didn't anticipate that with agents programming feels more fun because a lot of the fill in the blanks drudgery is removed and what remains is the creative part. I also feel less blocked/stuck (which is not fun) and I experience a lot more courage because there's almost always a way to work hand in hand with it to make some positive progress. I have seen the opposite sentiment from other people too; LLM coding will split up engineers based on those who primarily liked coding and those who primarily liked building.

真有趣。我没想到使用智能体编程会更有趣，因为很多填空式的繁琐工作都被省去了，剩下的就是创造性的部分了。我也感觉自己不再那么容易卡壳（卡壳可不好玩），而且更有勇气，因为几乎总能找到办法克服困难，取得一些积极的进展。我也看到其他人有相反的感受；LLM 编程会把工程师分成两类：一类是更喜欢编程的，另一类是更喜欢构建的。

Atrophy. I've already noticed that I am slowly starting to atrophy my ability to write code manually. Generation (writing code) and discrimination (reading code) are different capabilities in the brain. Largely due to all the little mostly syntactic details involved in programming, you can review code just fine even if you struggle to write it.

能力衰退。我已经注意到，我手动编写代码的能力正在逐渐衰退。大脑的生成（编写代码）和辨别（阅读代码）是两种不同的能力。很大程度上是因为编程涉及许多细小的语法细节，即使编写代码很吃力，你仍然可以很好地审查代码。

Slopacolypse. I am bracing for 2026 as the year of the slopacolypse across all of github, substack, arxiv, X/instagram, and generally all digital media. We're also going to see a lot more AI hype productivity theater (is that even possible?), on the side of actual, real improvements.

垃圾末日。我预感 2026 年将是垃圾末日，GitHub、Substack、arXiv、X/instagram 以及所有数字媒体都将遭受重创。我们还会看到更多人工智能带来的生产力提升噱头（这真的可能吗？），而真正意义上的改进却寥寥无几。

Questions. A few of the questions on my mind:

- What happens to the "10X engineer" - the ratio of productivity between the mean and the max engineer? It's quite possible that this grows *a lot*.

- Armed with LLMs, do generalists increasingly outperform specialists? LLMs are a lot better at fill in the blanks (the micro) than grand strategy (the macro).

- What does LLM coding feel like in the future? Is it like playing StarCraft? Playing Factorio? Playing music?

- How much of society is bottlenecked by digital knowledge work?

问题。我脑海中有几个问题：

“10倍工程师”（即平均工程师与最高工程师的生产力比率）会发生什么变化？这个比率很可能会大幅增长。

- 拥有法学硕士学位后，通才的表现是否越来越优于专才？法学硕士更擅长填补空白（微观层面），而不是制定宏观战略。

- 未来 LLM 编程会是什么感觉？像玩星际争霸？玩异星工厂？还是演奏音乐？

- 社会中有多少环节受到数字知识工作的制约？

TLDR Where does this leave us? LLM agent capabilities (Claude & Codex especially) have crossed some kind of threshold of coherence around December 2025 and caused a phase shift in software engineering and closely related. The intelligence part suddenly feels quite a bit ahead of all the rest of it - integrations (tools, knowledge), the necessity for new organizational workflows, processes, diffusion more generally. 2026 is going to be a high energy year as the industry metabolizes the new capability.

简而言之，这意味着什么？LLM 代理能力（尤其是 Claude 和 Codex）在 2025 年 12 月左右跨越了某种一致性阈值，引发了软件工程及相关领域的阶段性转变。智能部分突然感觉遥遥领先于其他所有方面——集成（工具、知识）、对新的组织工作流程、流程以及更广泛的扩散的必要性。2026 年将是充满活力的一年，因为整个行业都在消化吸收这项新技术。


