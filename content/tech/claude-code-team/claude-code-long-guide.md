---
title: "Claude Code 长篇参考：大型代码库与团队落地"
date: "2026-08-09"
author: "TNHTH"
section: "claude-code-team"
excerpt: "整理大型代码库、团队推广、治理、权限和长期维护方面的长篇参考内容。"
tags: ["Claude Code", "大型项目", "团队协作", "治理"]
---

> 本文保留长篇原始教程的工程实践内容，并将其中明显过时的价格、版本和服务承诺视为历史资料。
>
> 原始知识库入口：[AI编程快乐屋](https://my.feishu.cn/wiki/V5slwCIkUimnjKkyJuEcJiW0nuc)。

## 克劳德代码全攻略长篇指南 

### The Longform Guide to Everything Claude Code
克劳德代码全攻略长篇指南

In "The Shorthand Guide to Everything Claude Code", I covered the foundational setup: skills and commands, hooks, subagents, MCPs, plugins, and the configuration patterns that form the backbone of an effective Claude Code workflow. Its a setup guide and the base infrastructure.

在《Claude Code 速成指南》中，我介绍了基础设置：技能和命令、钩子、子代理、MCP、插件以及构成高效 Claude Code 工作流程核心的配置模式。这是一份设置指南和基础架构。

cogsec

@affaanmustafa

·

Jan 17

文章

The Shorthand Guide to Everything Claude Code
克劳德代码速记指南

Here's my complete setup after 10 months of daily use: skills, hooks, subagents, MCPs, plugins, and what actually works.

Been an avid Claude Code user since the experimental rollout in Feb, and won...

这是我经过 10 个月的日常使用后的完整设置：技能、钩子、子代理、MCP、插件以及实际有效的功能。

自二月份 Claude Code 实验性推出以来，我一直是它的忠实用户，并且赢得了……

250万

This longform guide goes the techniques that separate productive sessions from wasteful ones. If you haven't read the

Shorthand Guide

, go back and set up your configs first. What follows assumes you have skills, agents, hooks, and MCPs already configured and working.
这篇长篇指南探讨了如何将高效会议与低效会议区分开来。如果您还没有阅读过……

速记指南

请先返回并设置您的配置。以下内容假设您已经配置并运行了技能、代理、钩子和 MCP。

The themes here: token economics, memory persistence, verification patterns, parallelization strategies, and the compound effects of building reusable workflows. These are the patterns I've refined over 10+ months of daily use that make the difference between being plagued by context rot within the first hour, versus maintaining productive sessions for hours.

本文探讨的主题包括：代币经济、内存持久化、验证模式、并行化策略以及构建可重用工作流的复合效应。这些模式是我在十多个月的日常使用中不断完善的，它们决定了你是会在第一个小时内就被上下文信息混乱所困扰，还是能够保持数小时的高效会话。

Everything covered in the shorthand and longform articles are available on github here: 
简写版和长篇版文章中涵盖的所有内容都可以在 GitHub 上找到：

克劳德代码

everything-claude-code

#### Context & Memory Management
上下文和内存管理

For sharing memory across sessions, a skill or command that summarizes and checks in on progress then saves to a .tmp file in your .claude folder and appends to it until the end of your session is the best bet. The next day it can use that as context and pick up where you left off, create a new file for each session so you don't pollute old context into new work. Eventually you'll have a big folder of these session logs - just back it up somewhere meaningful or prune the session conversations you don't need.

为了在不同会话之间共享记忆，最佳方案是使用一个技能或命令，它可以总结并检查进度，然后将记录保存到 .claude 文件夹中的 .tmp 文件中，并在会话结束时追加更新。这样，第二天就可以利用这些记录作为上下文，从上次中断的地方继续工作。建议每次会话都创建一个新文件，避免将旧上下文污染到新的工作中。最终，你会得到一个包含大量会话日志的文件夹——只需将其备份到合适的位置，或者删除不需要的会话对话即可。

Claude creates a file summarizing current state. Review it, ask for edits if needed, then start fresh. For the new conversation, just provide the file path. Particularly useful when you're hitting context limits and need to continue complex work. These files should contain - what approaches worked (verifiably with evidence), which approaches that were attempted did not work, which approaches have not been attempted and what's left to do.

克劳德会创建一个文件来总结当前状态。审阅该文件，如有需要，请提出修改意见，然后重新开始。在新对话中，只需提供文件路径即可。当您遇到上下文限制，需要继续进行复杂工作时，这种方法尤其有用。这些文件应包含以下内容：哪些方法有效（需提供证据验证）、哪些尝试过但无效、哪些方法尚未尝试以及剩余待办事项。

Example of session storage ->

https://github.com/affaan-m/everything-claude-code/tree/main/examples/sessions

会话存储示例 ->

https://github.com/affaan-m/everything-claude-code/tree/main/examples/sessions

Clearing Context Strategically:
策略性地厘清背景：

Once you have your plan set and context cleared (default option in plan mode in claude code now), you can work from the plan. This is useful when you've accumulated a lot of exploration context that's no longer relevant to execution. For strategic compacting, disable auto compact. Manually compact at logical intervals or create a skill that does so for you or suggests upon some defined criteria.

一旦你制定好计划并清除上下文（现在在 Claude 代码的计划模式下这是默认选项），你就可以按照计划执行任务了。当你积累了大量与当前任务无关的探索信息时，这非常有用。为了进行策略性压缩，请禁用自动压缩功能。你可以手动按逻辑间隔进行压缩，或者创建一个技能来自动执行压缩，或者根据某些预设条件给出建议。

Strategic Compact Skill

(Direct Link):

(Embedded for quick reference)

（嵌入以便快速查阅）

bash

狂欢

```text
#!/bin/bash
## Strategic Compact Suggester
## Runs on PreToolUse to suggest manual compaction at logical intervals
#
## Why manual over auto-compact:
## - Auto-compact happens at arbitrary points, often mid-task
## - Strategic compacting preserves context through logical phases
## - Compact after exploration, before execution
## - Compact after completing a milestone, before starting next
COUNTER_FILE="/tmp/claude-tool-count-$$"
THRESHOLD=${COMPACT_THRESHOLD:-50}
## Initialize or increment counter
if [ -f "$COUNTER_FILE" ]; then
  count=$(cat "$COUNTER_FILE")
  count=$((count + 1))
  echo "$count" > "$COUNTER_FILE"
else
  echo "1" > "$COUNTER_FILE"
  count=1
fi
## Suggest compact after threshold tool calls
if [ "$count" -eq "$THRESHOLD" ]; then
  echo "[StrategicCompact] $THRESHOLD tool calls reached - consider /compact if transitioning phases" >&2
fi
```

Hook it to PreToolUse on Edit/Write operations - it'll nudge you when you've accumulated enough context that compacting might help.

将其连接到编辑/写入操作的 PreToolUse 事件 - 当您积累了足够的上下文信息，压缩操作可能有所帮助时，它会提醒您。

Advanced: Dynamic System Prompt Injection
高级：动态系统提示注入

One pattern I picked up and am trial running is: instead of solely putting everything in

CLAUDE.md

(user scope) or .claude/rules/ (project scope) which loads every session, use CLI flags to inject context dynamically.

我总结出一种模式，并且正在试行：而不是仅仅把所有东西都放在一起

CLAUDE.md

（用户范围）或 .claude/rules/（项目范围），它会在每个会话中加载，使用 CLI 标志动态注入上下文。

bash

狂欢

```text
claude --system-prompt "$(cat memory.md)"
```

This lets you be more surgical about what context loads when. You can inject different context per session based on what you're working on.

这样一来，您可以更精确地控制何时加载哪些上下文。您可以根据当前工作内容，在每个会话中注入不同的上下文。

Why this matters vs @ file references: 
为什么这与@文件引用不同：

When you use `

@memory

.mdor put something in.claude/rules/, Claude reads it via the Read tool during the conversation - it comes in as tool output. When you use --system-prompt`, the content gets injected into the actual system prompt before the conversation starts.

当你使用`

@记忆

将内容写入 .md 文件或放入 .claude/rules/ 目录，Claude 会在对话过程中通过读取工具读取这些内容——它们会作为工具输出显示。使用 --system-prompt 参数时，内容会在对话开始前直接注入到系统提示符中。

The difference is instruction hierarchy. System prompt content has higher authority than user messages, which have higher authority than tool results. For most day-to-day work this is marginal. But for things like strict behavioral rules, project-specific constraints, or context you absolutely need Claude to prioritize - system prompt injection ensures it's weighted appropriately.

区别在于指令层级。系统提示内容的权限高于用户消息，用户消息的权限又高于工具结果。对于大多数日常工作而言，这种差异微乎其微。但对于严格的行为规则、项目特定约束或上下文等情况，您绝对需要 Claude 来判断优先级——系统提示注入确保了其权重得到恰当的体现。

Practical setup:
实际设置：

A valid way to do this is to utilize .claude/rules/ for your baseline project rules, then have CLI aliases for scenario-specific context you can switch between:

一种有效的方法是使用 .claude/rules/ 文件来存放项目基线规则，然后为特定场景的上下文创建 CLI 别名，以便在这些别名之间切换：

bash

狂欢

```text
## Daily development
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'
## PR review mode
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'
## Research/exploration mode
alias claude-research='claude --system-prompt "$(cat ~/.claude/contexts/research.md)"'
```

System Prompt Context Example Files

(Direct Link):

- dev.md

- focuses on implementation

- review.md

- on code quality/security

- research.md

- on exploration before acting

Again, for most things the difference between using .claude/rules/context1.md and directly appending `

context1.md

` to your system prompt is marginal. The CLI approach is faster (no tool call), more reliable (system-level authority), and slightly more token efficient. But it's a minor optimization and for many its more overhead than its worth.

再次强调，对于大多数情况来说，使用 .claude/rules/context1.md 和直接附加 ` 之间的区别在于

context1.md

在系统提示符下使用 ` 参数意义不大。命令行界面 (CLI) 方法速度更快（无需调用工具）、更可靠（系统级权限），并且令牌效率略高。但这只是微小的优化，对许多用户来说，其带来的额外开销远大于其带来的益处。

Advanced: Memory Persistence Hooks
高级：内存持久化钩子

There are hooks most people don't know about or do but just don't really utilize that help with memory:

有一些记忆技巧大多数人并不知道，或者知道但却没有真正加以利用：

plaintext

纯文本

```text
SESSION 1                              SESSION 2
─────────                              ─────────

[Start]                                [Start]
   │                                      │
   ▼                                      ▼
┌──────────────┐                    ┌──────────────┐
│ SessionStart │ ◄─── reads ─────── │ SessionStart │◄── loads previous
│    Hook      │     nothing yet    │    Hook      │    context
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       ▼                                   ▼
   [Working]                           [Working]
       │                               (informed)
       ▼                                   │
┌──────────────┐                           ▼
│  PreCompact  │──► saves state       [Continue...]
│    Hook      │    before summary
└──────┬───────┘
       │
       ▼
   [Compacted]
       │
       ▼
┌──────────────┐
│  Stop Hook   │──► persists to ──────────►
│ (session-end)│    ~/.claude/sessions/
└──────────────┘
```

- PreCompact Hook: Before context compaction happens, save important state to a file
PreCompact 钩子： 在上下文压缩发生之前，将重要状态保存到文件中。

- SessionComplete Hook: On session end, persist learnings to a file
会话完成钩子： 会话结束时，将学习内容保存到文件中

- SessionStart Hook: On new session, load previous context automatically
会话启动钩子： 在新会话开始时，自动加载之前的上下文

Memory Persistant Hooks

(Direct Link):

(Embedded for quick reference)

（嵌入以便快速查阅）

json

```text
{
  "hooks": {
    "PreCompact": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/memory-persistence/pre-compact.sh"
      }]
    }],
    "SessionStart": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/memory-persistence/session-start.sh"
      }]
    }],
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/memory-persistence/session-end.sh"
      }]
    }]
  }
}
```

What these do:

这些功能的作用：

- pre-compact.sh

- : Logs compaction events, updates active session file with compaction timestamp

- session-start.sh

- : Checks for recent session files (last 7 days), notifies of available context and learned skills

- session-end.sh

- : Creates/updates daily session file with template, tracks start/end times

Chain these together for continuous memory across sessions without manual intervention. This builds on the hook types from Article 1 (PreToolUse, PostToolUse, Stop) but targets the session lifecycle specifically.

将这些功能串联起来，即可在无需手动干预的情况下跨会话持续记忆。此功能基于文章 1 中的钩子类型（PreToolUse、PostToolUse、Stop），但专门针对会话生命周期。

#### Continuous Learning / Memory
持续学习/记忆

We talked about continuous memory updating in the form of updating codemaps, but this applies to other things too such as learning from mistakes. If you've had to repeat a prompt multiple times and Claude ran into the same problem or gave you a response you've heard before this is applicable to you.

我们讨论过以更新代码映射形式体现的持续内存更新，但这同样适用于其他方面，例如从错误中学习。如果你多次重复某个提示，而 Claude 遇到了同样的问题，或者给出了你以前听过的答案，那么这同样适用于你。

Most likely you needed to fire a second prompt to "resteer" and calibrate Claude's compass. This is applicable to any such scenario - those patterns must be appended to skills.

很可能你需要发出第二个提示来“重新转向”并校准克劳德的罗盘。这适用于任何类似情况——这些模式必须添加到技能中。

Now you can automatically do this by simply telling Claude to remember it or add it to your rules, or you can have a skill that does exactly that.

现在，你可以直接告诉克劳德记住它，或者把它添加到你的规则中，或者你可以拥有一个专门用来做这件事的技能。

The Problem: Wasted tokens, wasted context, wasted time, your cortisol spikes as you frustratingly yell at claude to not do something that you already had told it not to do in a previous session.
问题： 浪费代币、浪费上下文、浪费时间，当你沮丧地对着 Claude 大喊不要做你在之前的会话中已经告诉过它不要做的事情时，你的皮质醇飙升。

The Solution: When Claude Code discovers something that isn't trivial- a debugging technique, a workaround, some project-specific pattern - it saves that knowledge as a new skill. Next time a similar problem comes up, the skill gets loaded automatically.
解决方案： 当 Claude Code 发现一些非同寻常的知识——例如调试技巧、变通方法或项目特定的模式——它会将这些知识保存为一项新技能。下次遇到类似问题时，该技能会自动加载。

Continuous Learning Skill (Direct Link):
持续学习技能（直接链接）：

Why did I use a Stop hook instead of UserPromptSubmit? UserPromptSubmit runs on every single message you send - that's a lot of overhead, adds latency to every prompt, and frankly overkill for this purpose. Stop runs once at session end - lightweight, doesn't slow you down during the session, and evaluates the complete session rather than piecemeal.
为什么我使用 Stop 钩子而不是 UserPromptSubmit ？ UserPromptSubmit 会在你发送的每条消息上都运行一次——这会带来很大的开销，增加每次提示的延迟，坦白说，对于这个目的来说有点杀鸡用牛刀了。Stop 钩子只在会话结束时运行一次——轻量级，不会在会话期间拖慢你的速度，而且会评估整个会话，而不是零散地评估。

Installation:
安装：

bash

狂欢

```text
## Clone to skills folder
git clone https://github.com/affaan-m/everything-claude-code.git ~/.claude/skills/everything-claude-code
## Or just grab the continuous-learning skill
mkdir -p ~/.claude/skills/continuous-learning
curl -sL https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/continuous-learning/evaluate-session.sh > ~/.claude/skills/continuous-learning/evaluate-session.sh
chmod +x ~/.claude/skills/continuous-learning/evaluate-session.sh
```

Hook Configuration

(Direct Link):

json

```text
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
          }
        ]
      }
    ]
  }
}
```

This uses the Stop hook to run an activator script on every prompt, evaluating the session for knowledge worth extracting. The skill can also activate via semantic matching, but the hook ensures consistent evaluation.
此功能利用停止钩子在每次提示时运行激活脚本，评估会话中是否存在值得提取的知识。该技能也可以通过语义匹配激活，但钩子确保了评估的一致性。

The Stop hook triggers when your session ends - the script analyzes the session for patterns worth extracting (error resolutions, debugging techniques, workarounds, project-specific patterns etc.) and saves them as reusable skills in `~/.claude/skills/learned/`.
当会话结束时， 停止钩子会触发 - 该脚本会分析会话中值得提取的模式（错误解决方法、调试技巧、变通方法、项目特定模式等），并将它们作为可重用的技能保存在 `~/.claude/skills/learned/` 中。

Manual Extraction with /learn:
使用 /learn 进行手动提取：

You don't have to wait for session end. The repo also includes a /learn command you can run mid-session when you've just solved something non-trivial. It prompts you to extract the pattern right then, drafts a skill file, and asks for confirmation before saving. See

here

.

您无需等到会话结束。该仓库还包含一个 /learn 命令，您可以在会话期间，刚刚解决一个比较复杂的问题时运行该命令。它会提示您立即提取模式，生成一个技能文件，并在保存前要求您确认。参见

这里

。

Session Log Pattern:
会话日志模式：

The skill expects session logs in .tmp files. The pattern is: ~/.claude/sessions/YYYY-MM-DD-topic.tmp - one file per session with current state, completed items, blockers, key decisions, and context for next session. Example session files are in the repo at

examples/sessions/

.

该技能需要将会话日志保存在 .tmp 文件中。格式为：~/.claude/sessions/YYYY-MM-DD-topic.tmp，每个会话对应一个文件，包含当前状态、已完成事项、阻塞事项、关键决策以及下次会话的上下文信息。示例会话文件位于仓库中。

示例/会话/

。

Other Self-Improving Memory Patterns:
其他自我提升记忆力的方法：

One approach from

@RLanceMartin

involves reflecting over session logs to distill user preferences - essentially building a "diary" of what works and what doesn't. After each session, a reflection agent extracts what went well, what failed, what corrections you made. These learnings update a memory file that loads in subsequent sessions.

一种方法来自

@RLanceMartin

它通过回顾会话日志来提炼用户偏好——本质上是构建一个记录哪些有效、哪些无效的“日志”。每次会话结束后，反思代理会提取哪些方面做得好、哪些方面做得不好以及你做了哪些修正。这些经验会更新一个记忆文件，并在后续会话中加载。

Another approach from

@alexhillman

has the system proactively suggest improvements every 15 minutes rather than waiting for you to notice patterns. The agent reviews recent interactions, proposes memory updates, you approve or reject. Over time it learns from your approval patterns.

另一种方法

@alexhillman

该系统会主动每隔 15 分钟提出改进建议，而不是被动地等待您发现规律。智能体会回顾最近的交互，提出内存更新建议，您可以选择批准或拒绝。随着时间的推移，它会从您的批准模式中学习。

#### Token Optimization
代币优化

I've gotten a lot of questions from price-elastic consumers, or those who run into limit issues frequently as power users. When it comes to token optimization there's a few tricks you can do.

我收到很多来自价格敏感型消费者或经常遇到限额问题的重度用户的提问。关于代币优化，有一些技巧可以尝试。

Primary Strategy: Subagent Architecture
主要策略：子代理架构

Primarily in optimizing the tools you use and subagent architecture designed to delegate the cheapest possible model that is sufficient for the task to reduce waste. You have a few options here - you could try trial and error and adapt as you go. Once you learn what is what, you can delegate to Haiku versus what you can delegate to Sonnet versus what you can delegate to Opus.

主要在于优化你使用的工具和子代理架构，旨在委派成本最低且足以完成任务的模型，从而减少浪费。你有几种选择——你可以尝试反复试验，并根据实际情况进行调整。一旦你了解了每种模型的功能，你就可以决定哪些任务可以委派给 Haiku，哪些任务可以委派给 Sonnet，哪些任务可以委派给 Opus。

Benchmarking Approach (More Involved):
基准测试方法（更深入）：

Another way that's a little more involved is that you can get Claude to set up a benchmark where you have a repo with well-defined goals and tasks and a well-defined plan. In each git worktree, have all subagents be of one model. Log as tasks are completed - ideally in your plan and in your tasks. You will have to use each subagent at least once.

另一种稍微复杂一些的方法是，您可以让 Claude 设置一个基准测试环境，其中包含一个定义明确的目标、任务和计划的仓库。在每个 Git 工作树中，所有子代理都使用同一个模型。任务完成后要进行日志记录——理想情况下，应该在计划和任务中都记录。每个子代理至少需要使用一次。

Once you've completed a full pass and tasks have been checked off your Claude plan, stop and audit the progress. You can do this by comparing diffs, creating unit and integration and E2E tests that are uniform across all worktrees. That will give you a numerical benchmark based on cases passed versus cases failed. If everything passes on all, you'll need to add more test edge cases or increase the complexity of the tests. This may or may not be worth it, depending on how much this really even matters to you.

当你完成整个测试流程，并且所有任务都已从 Claude 计划中勾选后，请停下来审核进度。你可以通过比较差异、创建在所有工作树中统一的单元测试、集成测试和端到端测试来实现这一点。这将为你提供一个基于通过测试用例与失败测试用例数量的数值基准。如果所有测试用例都通过，则需要添加更多测试边界用例或增加测试的复杂度。这样做是否值得，取决于你对这个目标的重视程度。

Model Selection Quick Reference:
型号选择快速参考指南：

Hypothetical setup of subagents on various common tasks and reasoning behind the choices

假设子智能体在各种常见任务上进行部署，并解释其选择背后的原因

Default to Sonnet for 90% of coding tasks. Upgrade to Opus when first attempt failed, task spans 5+ files, architectural decisions, or security-critical code. Downgrade to Haiku when task is repetitive, instructions are very clear, or using as a "worker" in multi-agent setup. Frankly Sonnet 4.5 currently sits in a weird spot at $3 per million input tokens and $15 per million output tokens, the cost savings are ~ 66.7% over Opus, absolutely speaking thats a good saving but relatively its more or less insignificant to most people. Haiku and Opus combo makes the most sense as Haiku vs Opus is a 5x cost difference, compared to a 1.67x price difference against Sonnet.

90% 的编码任务默认使用 Sonnet。如果首次尝试失败、任务涉及 5 个以上文件、涉及架构决策或包含安全关键代码，则升级到 Opus。如果任务重复、指令非常清晰，或者在多代理设置中用作“工作节点”，则降级到 Haiku。坦白说，Sonnet 4.5 目前的价格有点尴尬，每百万个输入令牌 3 美元，每百万个输出令牌 15 美元，虽然比 Opus 节省了约 66.7% 的成本，但严格来说，这确实是一笔可观的节省，不过对大多数人而言，相对而言意义不大。Haiku 和 Opus 的组合才是最合理的选择，因为 Haiku 和 Opus 的价格相差 5 倍，而与 Sonnet 的价格相差仅为 1.67 倍。

Source:

https://platform.claude.com/docs/en/about-claude/pricing

来源：

https://platform.claude.com/docs/en/about-claude/pricing

In your agent definitions, specify model:

在代理定义中，指定模型：

yaml

```text
---
name: quick-search
description: Fast file search
tools: Glob, Grep
model: haiku # Cheap and fast
---
```

Tool-Specific Optimizations:
工具特定优化：

Think about the tools that Claude calls the most frequently. For example, replace grep with mgrep - that on various tasks has an effective token reduction on average of around half compared to traditional grep or ripgrep, which is what Claude uses by default.

想想克劳德最常调用的工具。例如，用 mgrep 替换 grep——在各种任务中，mgrep 的有效标记减少量平均比传统的 grep 或 ripgrep（克劳德默认使用的工具）减少一半左右。

Source:

https://github.com/mixedbread-ai/mgrep/blob/main/README.md

来源：

https://github.com/mixedbread-ai/mgrep/blob/main/README.md

Background Processes:
背景过程：

When applicable, run background processes outside Claude if you don't need Claude to process the entire output and be streaming live directly. This can be achieved easily with tmux (see

Shorthand Guide

and

Tmux Commands Reference (Direct Link)

. Take the terminal output and either summarize it or copy the part you need only. This will save on a lot of input tokens, which is where the majority of cost comes from - $5 per million tokens for Opus 4.5 and output is $25 per million tokens.

如果不需要 Claude 处理所有输出并直接进行实时流传输，则可以在适用情况下在 Claude 之外运行后台进程。这可以通过 tmux 轻松实现（参见）。

速记指南

和

Tmux 命令参考（直接链接）

获取终端输出，然后进行汇总或仅复制所需部分。这将节省大量输入令牌，而输入令牌正是成本的主要来源——Opus 4.5 的输入令牌成本为每百万令牌 5 美元，输出令牌成本为每百万令牌 25 美元。

Modular Codebase Benefits:
模块化代码库的优势：

Having a more modular codebase with reusable utilities, functions, hooks and more - with main files being in the hundreds of lines instead of thousands of lines - helps both in token optimization costs and getting a task done right on the first try, which correlate. If you have to prompt Claude multiple times you're burning through tokens, especially as it reads over and over on very long files. You'll notice it has to make a lot of tool calls to finish reading the file. Intermediary, it lets you know that the file is very long and it will continue reading. Somewhere along this process, Claude may lose some information. Also, stopping and rereading costs extra tokens. This can be avoided by having a more modular codebase. Example below ->

拥有一个模块化程度更高的代码库，其中包含可重用的实用程序、函数、钩子等等——主文件只有几百行而不是几千行——有助于降低令牌优化成本，并确保任务一次性成功完成，这两者是相互关联的。如果需要多次提示 Claude，就会消耗大量的令牌，尤其是在它反复读取非常长的文件时。你会注意到，它需要调用很多工具才能完成文件读取。在此过程中，它会提示你文件很长，并会继续读取。在这个过程中，Claude 可能会丢失一些信息。此外，停止并重新读取也会消耗额外的令牌。而使用模块化程度更高的代码库可以避免这种情况。示例如下 ->

plaintext

纯文本

```text
root/
├── docs/                   # Global documentation
├── scripts/                # CI/CD and build scripts
├── src/
│   ├── apps/               # Entry points (API, CLI, Workers)
│   │   ├── api-gateway/    # Routes requests to modules
│   │   └── cron-jobs/      
│   │
│   ├── modules/            # The core of the system
│   │   ├── ordering/       # Self-contained "Ordering" module
│   │   │   ├── api/        # Public interface for other modules
│   │   │   ├── domain/     # Business logic & Entities (Pure)
│   │   │   ├── infrastructure/ # DB, External Clients, Repositories
│   │   │   ├── use-cases/  # Application logic (Orchestration)
│   │   │   └── tests/      # Unit and integration tests
│   │   │
│   │   ├── catalog/        # Self-contained "Catalog" module
│   │   │   ├── domain/
│   │   │   └── ...
│   │   │
│   │   └── identity/       # Self-contained "Auth/User" module
│   │       ├── domain/
│   │       └── ...
│   │
│   ├── shared/             # Code used by EVERY module
│   │   ├── kernel/         # Base classes (Entity, ValueObject)
│   │   ├── events/         # Global Event Bus definitions
│   │   └── utils/          # Deeply generic helpers
│   │
│   └── main.ts             # Application bootstrap
├── tests/                  # End-to-End (E2E) global tests
├── package.json
└── README.md
```

Lean Codebase = Cheaper Tokens:
精简的代码库 = 更低的代币成本：

This may be obvious, but the leaner your codebase is, the cheaper your token cost will be. It's crucial to identify dead code by using skills to continuously clean the codebase by refactoring using skills and commands. Also at certain points, I like to go through and skim the whole codebase looking for things that stand out to me or look repetitive, manually piece together that context, and then feed that into Claude alongside the refactor skill and dead code skill.

这或许显而易见，但代码库越精简，代币成本就越低。识别死代码至关重要，这需要运用技能和命令，通过重构来持续清理代码库。此外，我有时会浏览整个代码库，寻找那些引人注目或重复的代码，手动拼凑出上下文，然后将其与重构技能和死代码技能一起输入到 Claude 中。

System Prompt Slimming (Advanced):
系统提示瘦身（高级）：

For the truly cost-conscious: Claude Code's system prompt takes ~18k tokens (~9% of 200k context). This can be reduced to ~10k tokens with patches, saving ~7,300 tokens (41% of static overhead). See YK's

system-prompt-patches

if you want to go this route, personally I don't do this.
对于真正注重成本的用户：Claude Code 的系统提示符需要约 18k 个令牌（约占 200k 个上下文的 9%）。通过补丁程序，这可以减少到约 10k 个令牌，从而节省约 7,300 个令牌（静态开销的 41%）。参见 YK 的

系统提示补丁

如果你想走这条路，我个人不建议这样做。

#### Verification Loops and Evals
验证循环和求值

Evaluations and harness tuning - depending on the project, you'll want to use some form of observability and standardization.

评估和工具调优——根据项目的不同，您需要使用某种形式的可观测性和标准化。

Observability Methods:
可观测性方法：

One way to do this is to have tmux processes hooked to tracing the thinking stream and output whenever a skill is triggered. Another way is to have a PostToolUse hook that logs what Claude specifically enacted and what the exact change and output was.

一种方法是让 tmux 进程挂钩，以便在技能触发时跟踪思维流和输出。另一种方法是使用 PostToolUse 钩子，记录 Claude 具体执行了哪些操作，以及具体的更改和输出是什么。

Benchmarking Workflow:
基准测试工作流程：

Compare that to asking for the same thing without the skill and checking the output difference to benchmark relative performance:

相比之下，如果要求别人做同样的事情，但对方不具备相应的技能，那么通过比较结果差异来衡量相对表现就容易得多：

plaintext

纯文本

```text
[Same Task]
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
    ┌───────────────┐         ┌───────────────┐
    │  Worktree A   │         │  Worktree B   │
    │  WITH skill   │         │ WITHOUT skill │
    └───────┬───────┘         └───────┬───────┘
            │                         │
            ▼                         ▼
       [Output A]                [Output B]
            │                         │
            └──────────┬──────────────┘
                       ▼
                  [git diff]
                       │
                       ▼
              ┌────────────────┐
              │ Compare logs,  │
              │ token usage,   │
              │ output quality │
              └────────────────┘
```

Fork the conversation, initiate a new worktree in one of them without the skill, pull up a diff at the end, see what was logged. This ties in with the Continuous Learning and Memory section.
创建一个新的对话分支，在其中一个分支中创建一个不包含相应技能的新工作树，最后查看差异，看看记录了什么。这与“持续学习和记忆”部分相关。

Eval Pattern Types:
评估模式类型：

More advanced eval and loop protocols enter here. The split is between checkpoint-based evals and RL task-based continuous evals.

更高级的评估和循环协议在此引入。区别在于基于检查点的评估和基于强化学习任务的连续评估。

plaintext

纯文本

```text
CHECKPOINT-BASED                         CONTINUOUS
─────────────────                        ──────────

  [Task 1]                                 [Work]
     │                                        │
     ▼                                        ▼
  ┌─────────┐                            ┌─────────┐
  │Checkpoint│◄── verify                 │ Timer/  │
  │   #1    │    criteria                │ Change  │
  └────┬────┘                            └────┬────┘
       │ pass?                                │
   ┌───┴───┐                                  ▼
   │       │                            ┌──────────┐
  yes     no ──► fix ──┐                │Run Tests │
   │              │    │                │  + Lint  │
   ▼              └────┘                └────┬─────┘
  [Task 2]                                   │
     │                                  ┌────┴────┐
     ▼                                  │         │
  ┌─────────┐                          pass     fail
  │Checkpoint│                          │         │
  │   #2    │                           ▼         ▼
  └────┬────┘                        [Continue] [Stop & Fix]
       │                                          │
      ...                                    └────┘

Best for: Linear workflows              Best for: Long sessions
with clear milestones                   exploratory refactoring
```

Checkpoint-Based Evals:
基于检查点的评估：

- Set explicit checkpoints in your workflow
在工作流程中设置明确的检查点

- Verify against defined criteria at each checkpoint
在每个检查点根据既定标准进行验证

- If verification fails, Claude must fix before proceeding
如果验证失败，克劳德必须先修复才能继续。

- Good for linear workflows with clear milestones
适用于具有明确里程碑的线性工作流程

Continuous Evals:
持续评估：

- Run every N minutes or after major changes
每隔 N 分钟运行一次，或在重大更改后运行

- Full test suite, build status, lint
完整测试套件、构建状态、代码检查

- Report regressions immediately
立即报告回归情况。

- Stop and fix before continuing
停止并修复后再继续

- Good for long-running sessions
适合长时间会话

The deciding factor is the nature of your work. Checkpoint-based works for feature implementation with clear stages. Continuous works for exploratory refactoring or maintenance where you don't have clear milestones.

决定性因素在于你的工作性质。基于检查点的工作方式适用于功能实现，步骤清晰明确。而持续性工作方式则适用于探索性重构或维护，这类工作没有明确的里程碑。

I would say with some intervention, the verification approach is enough to avoid most tech debt. Having Claude validate after it completes tasks by running the skills and PostToolUse hooks aids in that. Having the continuous codemap updating also helps because it keeps a log of changes and how the codemap evolves over time, serving as a source of truth outside just the repo itself. With strict rules, Claude will avoid creating random .md files cluttering everything as well as duplicate files for similar code and leaving a wasteland of dead code.

我认为，只要稍加干预，验证机制就足以避免大部分技术债务。Claude 在完成任务后运行技能和 PostToolUse 钩子进行验证，有助于实现这一点。持续更新代码映射也至关重要，因为它会记录变更以及代码映射随时间演变的过程，从而成为代码库之外的真实数据源。通过严格的规则，Claude 可以避免创建杂乱无章的 .md 文件，以及为类似代码创建重复文件，最终导致大量无用代码堆积。

Grader Types (From Anthropic - Direct Link):
分级器类型（来自 Anthropic - 直接链接）：

Code-Based Graders: String match, binary tests, static analysis, outcome verification. Fast, cheap, objective, but brittle to valid variations.
基于代码的评分器： 字符串匹配、二进制测试、静态分析、结果验证。速度快、成本低、客观，但对有效的变体不敏感。

Model-Based Graders:  Rubric scoring, natural language assertions, pairwise comparison. Flexible and handles nuance, but non-deterministic and more expensive.
基于模型的评分器： 采用评分标准、自然语言断言和成对比较。灵活且能处理细微差别，但结果不确定且成本更高。

Human Graders: SME review, crowdsourced judgment, spot-check sampling. Gold standard quality, but expensive and slow.
人工评分： 专家评审、众包判断、抽样检查。质量达到黄金标准，但成本高昂且耗时。

Key Metrics:
关键指标：

plaintext

纯文本

```text
pass@k: At least ONE of k attempts succeeds
        ┌─────────────────────────────────────┐
        │  k=1: 70%  k=3: 91%  k=5: 97%      │
        │  Higher k = higher odds of success  │
        └─────────────────────────────────────┘

pass^k: ALL k attempts must succeed
        ┌─────────────────────────────────────┐
        │  k=1: 70%  k=3: 34%  k=5: 17%      │
        │  Higher k = harder (consistency)    │
        └─────────────────────────────────────┘
```

Use pass@k when you just need it to work and any verifying feedback is enough. Use pass^k when consistency is essential and you need near deterministic output consistency (in terms of results/quality/style).
当您只需要它能正常运行，并且任何验证反馈都足够时， 请使用 pass@k 。 当一致性至关重要，并且您需要近乎确定性的输出一致性（在结果/质量/风格方面）时， 请使用 pass^k 。

Building an Eval Roadmap (from the same Anthropic guide):
制定评估路线图（摘自 Anthropic 指南）：

1. Start early - 20-50 simple tasks from real failures
尽早开始——从真实失败中总结 20-50 个简单任务

1. Convert user-reported failures into test cases
将用户报告的故障转换为测试用例

1. Write unambiguous tasks - two experts should reach same verdict
任务描述要清晰明确——两位专家应该得出相同的结论。

1. Build balanced problem sets - test when behavior should AND shouldn't occur
构建平衡的问题集——测试行为何时应该发生以及何时不应该发生。

1. Build robust harness - each trial starts from clean environment
构建稳健的试验装置——每次试验都从清洁的环境开始

1. Grade what agent produced, not the path it took
评价的是代理人产出的结果，而不是他采取的路径。

1. Read transcripts from many trials
阅读多场审判的笔录

1. Monitor for saturation - 100% pass rate means add more tests
监控测试饱和度——100% 通过率意味着需要增加测试次数。

#### Parallelization
并行化

When forking conversations in a multi-Claude terminal setup, make sure the scope is well-defined for the actions in the fork and the original conversation. Aim for minimal overlap when it comes to code changes. Choose tasks that are orthogonal to each other to prevent the possibility of interference.

在多 Claude 终端环境下创建对话分支时，务必明确定义分支对话和原始对话中操作的范围。代码修改时，尽量减少重叠。选择彼此正交的任务，以避免相互干扰。

My Preferred Pattern:
我喜欢的模式：

Personally, I prefer the main chat to be working on code changes and the forks I do are for questions I have about the codebase and its current state, or to do research on external services such as pulling in documentation, searching GitHub for an applicable open source repo that would help in the task, or other general research that would be helpful.

就我个人而言，我更喜欢在主聊天室里讨论代码更改，而我创建的分支则用于提出关于代码库及其当前状态的问题，或者研究外部服务，例如拉取文档、在 GitHub 上搜索有助于完成任务的适用开源仓库，或其他有用的常规研究。

On Arbitrary Terminal Counts:
关于任意终止计数：

Boris

@bcherny

(the legend who created claude code) has some tips on parallelization that I agree and disagree with. He's suggested things like running 5 Claude instances locally and 5 upstream. I advise against setting arbitrary terminal amounts like this. The addition of a terminal and the addition of an instance should be out of true necessity and purpose. If you can take care of that task using a script, use a script. If you can stay in the main chat and get Claude to spin up an instance in tmux and stream it in a separate terminal that way, do that.

鲍里斯

@bcherny

（创建 Claude Code 的那位传奇人物）提出了一些关于并行化的建议，我既赞同也不赞同。他建议在本地运行 5 个 Claude 实例，同时在上游运行 5 个实例。我不建议随意设置终端数量。添加终端和实例应该出于真正的必要性和目的。如果可以用脚本完成这项任务，那就用脚本。如果可以留在主聊天室，让 Claude 在 tmux 中启动一个实例，然后通过这种方式在另一个终端中传输数据，那就这样做。

Boris Cherny

@bcherny

·

Jan 3

Replying to

@bcherny

回复

@bcherny

1/ I run 5 Claudes in parallel in my terminal. I number my tabs 1-5, and use system notifications to know when a Claude needs input https://code.claude.com/docs/en/terminal-config#iterm-2-system-notifications
1/ 我在终端中并行运行 5 个 Claude 进程。我将标签页编号为 1-5，并使用系统通知来了解何时某个 Claude 进程需要输入  https://code.claude.com/docs/en/terminal-config#iterm-2-system-notifications

100万

Your goal really should be: how much can you get done with the minimum viable amount of parallelization.

你的目标应该是：用最少的并行化手段完成多少工作。

For most newcomers, I'd even stay away from parallelization until you get the hang of just running a single instance and managing everything within that. I'm not advocating to handicap yourself - I'm saying just be careful. Most of the time, even I only use 4 terminals or so total. I find I'm able to do most things with just 2 or 3 instances of Claude open usually.

对于大多数新手来说，我建议你先别碰并行化，等熟练掌握如何运行单个实例并管理所有操作后再说。我不是鼓励你给自己设限，只是提醒你谨慎一些。大多数时候，即使是我也只用到 4 个左右的终端。我发现通常只需要打开 2 到 3 个 Claude 实例就能完成大部分工作。

When Scaling Instances:
扩展实例时：

IF you are to begin scaling your instances AND you have multiple instances of Claude working on code that overlaps with one another, it's imperative you use git worktrees and have a very well-defined plan for each. Furthermore, to not get confused or lost when resuming sessions as to which git worktree is for what (beyond the names of the trees), use /rename &lt;name here&gt; to name all your chats.

如果您要开始扩展实例，并且有多个 Claude 实例正在处理彼此重叠的代码，那么您必须使用 Git 工作树，并为每个工作树制定非常明确的计划。此外，为了避免在恢复会话时混淆或迷失在哪个 Git 工作树负责什么任务（除了树的名称之外），请使用 /rename 命令。&lt;name here&gt; ` 来命名你所有的聊天记录。

Git Worktrees for Parallel Instances:
并行实例的 Git 工作树：

bash

狂欢

```text
## Create worktrees for parallel work
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
git worktree add ../project-refactor refactor-branch
## Each worktree gets its own Claude instance
cd ../project-feature-a && claude
```

Benefits:
好处：

- No git conflicts between instances
实例之间不存在 Git 冲突

- Each has clean working directory
每个目录都是干净的。

- Easy to compare outputs
易于比较输出结果

- Can benchmark same task across different approaches
可以对不同方法下的同一任务进行基准测试

The Cascade Method:
级联法：

When running multiple Claude Code instances, organize with a "cascade" pattern:

运行多个 Claude Code 实例时，请使用“级联”模式进行组织：

- Open new tasks in new tabs to the right
在右侧的新标签页中打开新任务

- Sweep left to right, oldest to newest
从左到右，从旧到新浏览

- Maintain consistent direction flow
保持稳定的流向

- Check on specific tasks as needed
根据需要检查具体任务。

- Focus on at most 3-4 tasks at a time - more than that and mental overhead increases faster than productivity
一次最多专注于 3-4 项任务——超过这个数量，精神负担的增长速度就会超过效率的提升速度。

#### Groundwork
基础工作

When starting fresh, the actual foundation matters a lot. This should be obvious but as complexity and size of codebase increases, tech debt also increases. Managing it is incredibly important and not as difficult if you follow a few rules. Besides setting up your Claude effectively for the project at hand (see the shorthand guide).

从零开始时，基础架构至关重要。这一点显而易见，但随着代码库复杂性和规模的增加，技术债务也会随之增加。管理技术债务极其重要，但只要遵循一些规则，管理起来并不难。此外，还需要针对当前项目有效地配置 Claude（参见简写指南）。

The Two-Instance Kickoff Pattern:
双实例启动模式：

For my own workflow management (not necessary but helpful), I like to start an empty repo with 2 open Claude instances.

为了我自己的工作流程管理（虽然不是必须的，但很有帮助），我喜欢创建一个空的仓库，并打开 2 个 Claude 实例。

Instance 1: Scaffolding Agent
实例 1：脚手架代理

- Going to lay down the scaffold and groundwork
准备搭建脚手架和进行地基工程

- Creates project structure
创建项目结构

- Sets up configs (

- CLAUDE.md

- , rules, agents - everything from the shorthand guide)
设置配置（

- CLAUDE.md

- （规则、代理——速记指南中的所有内容）

- Establishes conventions
制定惯例

- Gets the skeleton in place
把骨架固定好

Instance 2: Deep Research Agent
实例 2：深度研究代理

- Connects to all your services, web search, etc.
连接到您的所有服务、网络搜索等。

- Creates the detailed PRD
创建详细的产品需求文档 (PRD)。

- Creates architecture mermaid diagrams
创建建筑美人鱼图

- Compiles the references with actual clips from actual documentation
将参考资料与实际文档中的实际片段汇编在一起

Starting Setup: Left Terminal for Coding, Right Terminal for Questions - use /rename and /fork.

初始设置：左侧终端用于编码，右侧终端用于提问 - 使用 /rename 和 /fork 命令。

What you need minimally to start is fine - it's quicker that way over Context7 every time or feeding in links for it to scrape or using Firecrawl MCP sites. All those work when you are already knee deep in something and Claude is clearly getting syntax wrong or using dated functions or endpoints.

只需满足最低限度的需求即可——这样比每次都用 Context7、手动输入链接让它抓取或者使用 Firecrawl MCP 网站要快得多。所有这些方法都适用于你已经深陷其中，而 Claude 明显语法错误或使用了过时的函数或接口的情况。

llms.txt Pattern:
llms.txt 模式：

If available, you can find an llms.txt on many documentation references by doing /llms.txt on them once you reach their docs page. Here's an example:

如果文档中包含 llms.txt 文件，您可以在文档页面找到它，只需在文档中添加 /llms.txt 即可。例如：

https://www.helius.dev/docs/llms.txt

https://www.helius.dev/docs/llms.txt

This gives you a clean, LLM-optimized version of the documentation that you can feed directly to Claude.

这样您就可以得到一个干净的、针对 LLM 优化的文档版本，您可以将其直接提供给 Claude。

Philosophy: Build Reusable Patterns
理念：构建可复用的模式

One insight from

@omarsar0

that I fully endorse: "Early on, I spent time building reusable workflows/patterns. Tedious to build, but this had a wild compounding effect as models and agent harnesses improved."

一个来自

@omarsar0

我完全赞同：“早期，我花了很多时间构建可重用的工作流程/模式。构建过程虽然繁琐，但随着模型和代理工具的改进，这产生了巨大的累积效应。”

What to invest in:
投资方向：

- Subagents (the shorthand guide)
次级代理人（简明指南）

- Skills (the shorthand guide)
技能（速记指南）

- Commands (the shorthand guide)
命令（速记指南）

- Planning patterns
规划模式

- MCP tools (the shorthand guide)
MCP 工具（速记指南）

- Context engineering patterns
上下文工程模式

Why it compounds (

@omarsar0

): "The best part is that all these workflows are transferable to other agents like Codex." Once built, they work across model upgrades. Investment in patterns > investment in specific model tricks.
为什么它会复合（

@omarsar0

“ 最棒的是，所有这些工作流程都可以迁移到其他代理，例如 Codex。”一旦构建完成，它们就能在模型升级后继续运行。投资于模式和投资于特定的模型技巧。

#### Best Practices for Agents & Sub-Agents
代理人和次级代理人的最佳实践

In the shorthand guide, I listed the subagent structure - planner, architect, tdd-guide, code-reviewer, etc. In this part we focus on the orchestration and execution layer.

在简明指南中，我列出了子代理结构——规划器、架构师、TDD 指导者、代码审查员等。在本部分，我们将重点关注编排和执行层。

The Sub-Agent Context Problem:
子代理上下文问题：

Sub-agents exist to save context by returning summaries instead of dumping everything. But the orchestrator has semantic context the sub-agent lacks. The sub-agent only knows the literal query, not the PURPOSE/REASONING behind the request. Summaries often miss key details.

子代理的存在是为了节省上下文信息，它返回的是摘要而不是全部输出。但是，协调器拥有子代理所缺乏的语义上下文。子代理只知道字面意义上的查询，而不知道请求背后的目的/原因。摘要通常会遗漏关键细节。

The analogy from

@PerceptualPeak

: "Your boss sends you to a meeting and asks for a summary. You come back and give him the rundown. Nine times out of ten, he's going to have follow-up questions. Your summary won't include everything he needs because you don't have the implicit context he has."

类比来自

@PerceptualPeak

“你的老板派你去开会，然后让你做个总结。你回来后给他做了简要汇报。十有八九，他还会追问一些问题。你的总结不会包含他需要的所有信息，因为你缺乏他所掌握的那些背景信息。”

Iterative Retrieval Pattern:
迭代检索模式：

plaintext

纯文本

```text
┌─────────────────┐
│  ORCHESTRATOR   │
│  (has context)  │
└────────┬────────┘
         │ dispatch with query + objective
         ▼
┌─────────────────┐
│   SUB-AGENT     │
│ (lacks context) │
└────────┬────────┘
         │ returns summary
         ▼
┌─────────────────┐      ┌─────────────┐
│   EVALUATE      │─no──►│  FOLLOW-UP  │
│   Sufficient?   │      │  QUESTIONS  │
└────────┬────────┘      └──────┬──────┘
         │ yes                  │
         ▼                      │ sub-agent
    [ACCEPT]              fetches answers
                                │
         ◄──────────────────────┘
              (max 3 cycles)
```

To fix this, make the orchestrator:

要解决这个问题，请将编排器设置为：

- Evaluate every sub-agent return
评估每个子代理的回报

- Ask follow-up questions before accepting it
接受之前要问一些后续问题。

- Sub-agent goes back to source, gets answers, returns
次级代理人返回源头，获得答案，然后返回

- Loop until sufficient (max 3 cycles to prevent infinite loops)
循环直到次数足够（最多 3 次循环，以防止无限循环）

Pass objective context, not just the query. When dispatching a subagent, include both the specific query AND the broader objective. This helps the subagent prioritize what to include in its summary.
传递目标上下文，而不仅仅是查询语句。 在调度子代理时，请同时包含具体查询语句和更广泛的目标。这有助于子代理确定摘要中应包含哪些内容。

Pattern: Orchestrator with Sequential Phases
模式：具有顺序阶段的编排器

markdown

标记化

```text
Phase 1: RESEARCH (use Explore agent)
- Gather context
- Identify patterns
- Output: research-summary.md

Phase 2: PLAN (use planner agent)

- Read research-summary.md
- Create implementation plan
- Output: plan.md

Phase 3: IMPLEMENT (use tdd-guide agent)

- Read plan.md
- Write tests first
- Implement code
- Output: code changes

Phase 4: REVIEW (use code-reviewer agent)

- Review all changes
- Output: review-comments.md

Phase 5: VERIFY (use build-error-resolver if needed)

- Run tests
- Fix issues
- Output: done or loop back
```

Key rules:
关键规则：

1. Each agent gets ONE clear input and produces ONE clear output
每个代理接收一个明确的输入并产生一个明确的输出。

1. Outputs become inputs for next phase
输出成为下一阶段的输入

1. Never skip phases - each adds value
切勿跳过任何阶段——每个阶段都会增加价值。

1. Use /clear between agents to keep context fresh
在代理之间使用 `/clear` 来保持上下文新鲜

1. Store intermediate outputs in files (not just memory)
将中间输出存储在文件中（而不仅仅是内存中）

Agent Abstraction Tierlist (from

@menhguin

):
代理抽象层列表（来自

@menhguin

）：

Tier 1: Direct Buffs (Easy to Use)
第一层：直接增益（易于使用）

- Subagents - Direct buff for preventing context rot and ad-hoc specialization. Half as useful as multi-agent but MUCH less complexity
子智能体 ——直接增强防止上下文腐化和临时特化的能力。虽然其效用只有多智能体的一半，但复杂度却低得多。

- Metaprompting - "I take 3 minutes to prompt a 20-minute task." Direct buff - improves stability and sanity-checks assumptions
元提示 ——“我花 3 分钟提示一个 20 分钟的任务。” 直接增益——提高稳定性并验证假设的合理性

- Asking user more at the beginning - Generally a buff, though you have to answer questions in plan mode
一开始就向用户询问更多问题 ——通常来说是个优势，不过你需要在计划模式下回答问题。

Tier 2: High Skill Floor (Harder to Use Well)
第二层级：上手难度高（更难精通）

- Long-running agents - Need to understand shape and tradeoff of 15 min task vs 1.5 hour vs 4 hour task. Takes some tweaking and is obviously very long trial-and-error
长时间运行的智能体 ——需要了解 15 分钟任务、1.5 小时任务和 4 小时任务的结构和权衡。这需要一些调整，而且显然需要非常漫长的反复试验。

- Parallel multi-agent - Very high variance, only useful on highly complex OR well-segmented tasks. "If 2 tasks take 10 minutes and you spend an arbitrary amount of time prompting or god forbid, merge changes, it's counterproductive"
并行多智能体 ——方差极大，仅适用于高度复杂或细分明确的任务。“如果两个任务耗时 10 分钟，而你却花费大量时间进行提示，或者更糟糕的是，合并更改，那只会适得其反。”

- Role-based multi-agent - "Models evolve too fast for hard-coded heuristics unless arbitrage is very high." Hard to test
基于角色的多智能体 ——“除非套利机会非常高，否则模型演化速度太快，无法使用硬编码的启发式算法。” 难以测试

- Computer use agents - Very early paradigm, requires wrangling. "You're getting models to do something they were definitely not even meant to do a year ago"
计算机应用代理 ——非常早期的范式，需要不断调整。“你让模型去做一些它们一年前绝对不可能做的事情。”

The takeaway: Start with Tier 1 patterns. Only graduate to Tier 2 when you've mastered the basics and have a genuine need.

要点：先从一级模式开始。只有当你掌握了基础知识并且真正有需要时，才能进阶到二级模式。

#### Tips and Tricks
技巧和窍门

Some MCPs are Replaceable and Will Free Up Your Context Window
某些 MCP 是可替换的，这将释放您的上下文窗口空间。

Here's how.

方法如下。

For MCPs such as version control (GitHub), databases (Supabase), deployment (Vercel, Railway) etc. - most of these platforms already have robust CLIs that the MCP is essentially just wrapping. The MCP is a nice wrapper but it comes at a cost.

对于版本控制（GitHub）、数据库（Supabase）、部署（Vercel、Railway）等多平台集成方案（MCP），大多数平台本身就拥有强大的命令行界面（CLI），MCP 本质上只是对这些 CLI 进行封装。MCP 的确是一个不错的封装，但它也需要付出一定的代价。

To have the CLI function more like an MCP without actually using the MCP (and the decreased context window that comes with it), consider bundling the functionality into skills and commands. Strip out the tools the MCP exposes that make things easy and turn those into commands.

为了让 CLI 的功能更接近 MCP，但又无需实际使用 MCP（以及随之而来的较小的上下文窗口），可以考虑将功能打包成技能和命令。剥离 MCP 提供的那些简化操作的工具，并将它们转换为命令。

Example: instead of having the GitHub MCP loaded at all times, create a /gh-pr command that wraps gh pr create with your preferred options. Instead of the Supabase MCP eating context, create skills that use the Supabase CLI directly. The functionality is the same, the convenience is similar, but your context window is freed up for actual work.

例如：与其始终加载 GitHub MCP，不如创建一个 /gh-pr 命令，该命令使用您偏好的选项包装 gh pr create 命令。与其让 Supabase MCP 占用上下文，不如创建直接使用 Supabase CLI 的技能。功能相同，使用起来也类似，但您的上下文窗口可以释放出来用于实际工作。

This ties in with some of the other questions I've been getting. Over the past few days since I posted the original article, Boris and the Claude Code team has made a lot of progress in memory management and optimization, primarily with lazy loading of MCPs so that they don't eat your window from the start anymore. Previously I would've recommended converting MCPs into skills where you can, offloading the functionality to enact an MCP in one of two ways: by enabling it at that time (less ideal since you need to leave and resume session) or by having skills that use the CLI analogues to the MCP (if they exist) and having the skill be the wrapper around it - essentially having it act as a pseudo-MCP.

这与我收到的其他一些问题有关。自从我发布原文以来，在过去的几天里，Boris 和 Claude Code 团队在内存管理和优化方面取得了很大进展，主要是在 MCP 的延迟加载方面，这样它们就不会从一开始就占用大量窗口空间了。之前我会建议尽可能将 MCP 转换为技能，并通过以下两种方式之一来卸载执行 MCP 的功能：在执行时启用（不太理想，因为需要退出并重新进入会话），或者使用与 MCP 类似的 CLI 命令（如果存在），并让技能作为其包装器——本质上是让它充当伪 MCP 的角色。

With lazy loading, the context window issue is mostly solved. But token usage and cost is not solved in the same way. The CLI + skills approach is still a token optimization method that may have results on par or near the effectiveness of using an MCP. Furthermore you can run MCP operations via CLI instead of in-context which reduces token usage significantly, especially useful for heavy MCP operations like database queries or deployments.
通过延迟加载 ，上下文窗口问题基本得到解决。但令牌的使用和成本问题并未得到同等解决。CLI + 技术方法仍然是一种令牌优化方法，其效果可能与使用 MCP 相当甚至接近。此外，您可以通过 CLI 而不是在上下文中运行 MCP 操作，从而显著降低令牌使用量，这对于数据库查询或部署等耗费资源的 MCP 操作尤其有用。

#### VIDEO?
视频？

As you suggested I'm thinking this paired with some of the other questions warrants a video to go alongside this article which covers these things.

正如你所建议的，我认为这个问题结合其他一些问题，值得制作一个视频来配合这篇文章，视频内容将涵盖这些方面。

Cover an END-TO-END PROJECT utilizing tactics from both articles:
运用两篇文章中的策略，完成一个端到端的项目报道：

- Full project setup with configs from the shorthand guide
完整的项目设置，配置参考速查指南

- Advanced techniques from this longform guide in action
本长篇指南中的高级技巧实战演示

- Real-time token optimization
实时代币优化

- Verification loops in practice
实践中的验证循环

- Memory management across sessions
跨会话的内存管理

- The two-instance kickoff pattern
两次开球模式

- Parallel workflows with git worktrees
使用 Git 工作树的并行工作流

- Screenshots and recordings of actual workflow
实际工作流程的屏幕截图和录像

I'll see what I can do.

我看看我能做些什么。


