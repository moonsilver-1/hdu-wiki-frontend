---
title: "多 Agent 并行"
date: "2026-09-20"
author: "洛洛"
excerpt: "├── 子 Agent A — 搜索所有 API 路由"
tags: ["luoluo", "迁移"]
---

洛洛有一次让 Claude Code 帮我看一个陌生项目，问它"这个项目的前端、后端、数据库分别是怎么组织的"。

我以为它会老老实实一个一个来，我正好去泡个泡面。

结果面还没泡开，屏幕上唰唰唰同时冒出来三个小任务，各自在读不同的文件，最后自己汇总成一段结论给我。

wc。它把自己分裂了。

Claude Code 支持多 Agent 并行架构：主 Agent 派生多个子 Agent（subagent），并行处理独立子任务。

洛洛不懂它内部是怎么调度的，但看着实在牛逼之。这一篇我尽量把"这玩意能干嘛"讲明白，配置和参数原样给你。

## 工作原理

先看图，这张图是全篇最好懂的部分：

```
主 Agent
├── 子 Agent A — 搜索所有 API 路由
├── 子 Agent B — 分析数据库模型
└── 子 Agent C — 检查测试覆盖率
         ↓
    汇总结果，生成报告
```

每个子 Agent 通常有自己的：

* **独立的上下文窗口**
* **独立的工具调用能力**
* 可以独立读取文件、搜索代码；是否能编辑文件取决于工具和权限配置
* 结果返回给主 Agent 汇总

洛洛看懂的部分是"独立的上下文窗口"这条。就是说小弟 A 读了一堆文件，不会把主 Agent 的脑子塞满——脏活在它自己那边干完，只把结论交上来。

这个设计洛洛真的服气。相当于组长派活，组员各自加班，组长只看汇报。

## 内置 Subagent 类型

不用自己造，官方已经准备好三种：

| Agent               | 模型                           | 能力                 | 适用场景      |
| ------------------- | ---------------------------- | ------------------ | --------- |
| **Explore**         | 继承主模型（v2.1.198 起，之前固定 Haiku） | 只读，禁止 Write / Edit | 快速搜索、代码定位 |
| **Plan**            | 继承主模型                        | 只读 + 深度分析          | 架构研究、方案规划 |
| **General-purpose** | 继承主模型                        | 完整工具               | 复杂多步任务    |

洛洛的土办法记法：Explore 是跑腿的，Plan 是出主意的，General-purpose 是啥都能干的那个。

## 自动并行

回到洛洛泡面那次——我当时压根没提"并行"这两个字。

你不需要手动告诉 Claude 使用 subagent。当 Claude 判断有多个独立的子任务时，它会**自动**并行启动子 Agent。

例如，你说：

```
帮我分析这个项目的前端架构、后端 API 设计和数据库 schema
```

Claude 可能会同时启动 3 个 Explore subagent，分别去搜索前端组件、API 路由和数据库模型文件。

对，就是这句，一模一样的句式。所以那天不是它突然聪明了，是它一看这三件事互不相干，就自己分头去办了。

## 手动并行

当然你也可以直接点名，明确要求它并行处理：

```
并行做以下事情：
1. 给 src/utils/ 下所有函数添加 JSDoc
2. 修复 src/components/ 下的所有 TypeScript 类型错误
3. 更新 README 的 API 文档
```

Claude 会启动多个 agent 同时工作。

## Worktree 隔离

前面都是"读"，读不会打架。但如果几个小弟同时要动手改文件呢？

当多个 subagent 需要**同时写文件**时，推荐用 Git worktree 做隔离，避免多个 agent 改同一份工作区：

```
主 Worktree (main)
├── Worktree A (agent/feature-a) — Agent A 在这里工作
├── Worktree B (agent/fix-b)    — Agent B 在这里工作
└── Worktree C (agent/docs-c)   — Agent C 在这里工作
```

每个 worktree：

* 独立的分支和工作目录
* 独立的暂存区
* 修改互不干扰
* 共享 `.git` 对象数据库，磁盘开销小

完成后，再由主 Agent 或人工把各个 worktree 的变更合并回来。

洛洛的理解：给每个人发一份自己的稿子改，别都在同一张纸上涂。最后再拼起来。

> **洛洛碎碎念**
>
> 洛洛第一次听到 worktree 这个词，脑子里出现的是一棵树。
> 
>   然后我很认真地问默子老师："所以这个树是长在哪里的？"
> 
>   他沉默了大概五秒，说："洛洛，它是文件夹。"
> 
>   好吧。是文件夹。哈哈哈哈哈哈。

## 自定义 Subagent

三个内置的不够用，就自己写一个。这一段的格式洛洛一个字都没改，你照着填：

在 `.claude/agents/` 目录下创建专门的 agent：

```markdown
---
name: security-checker
description: 检查代码安全漏洞
model: sonnet
tools:
  - Read
  - Glob
  - Grep
permissionMode: plan
skills:
  - security-audit
maxTurns: 15
---

你是一个安全审计专家。扫描代码时重点检查：
1. SQL 注入
2. XSS 攻击
3. 硬编码密钥
4. 不安全的依赖
5. 权限控制缺陷

输出格式：
- 严重程度（高/中/低）
- 文件路径和行号
- 问题描述
- 修复建议
```

然后在对话中使用：

```
用 security-checker agent 扫描整个项目
```

上面那个横线里的部分是"这个员工是谁、能用什么工具"，横线下面的正文是"给他的岗位说明书"。洛洛看到这里就 souga 了——原来定义一个 AI 员工，跟写一份实习生入职文档结构上是一样的。

## 后台 Agent

有些活不需要你盯着，让它自己在后面待着就行：

设置 `background: true` 让 agent 在后台运行：

```markdown
---
name: test-watcher
description: 后台持续运行测试
background: true
---

每当有文件变更时，运行相关的测试用例并报告结果。
```

## 最佳实践

这四条洛洛都是吃过瘪之后才认同的：

1. **独立性** — 确保子任务之间真正独立，否则串行更好
2. **粒度适中** — 太细增加开销，太粗无法并行
3. **结果验证** — 子 Agent 完成后，主 Agent 应验证结果的一致性
4. **合理选型** — 简单搜索用 Explore（只读，结论干净），复杂任务用 General-purpose

第一条尤其重要。洛洛试过让两个 agent 并行改同一个组件，结果它们互相把对方的改动覆盖了，我看着那个文件像被打劫过一样。

## 洛洛的总结

一个人做项目最惨的不是不会写代码，是同一时间只能干一件事。

多 Agent 这套东西，说白了就是让你一个人也拥有一支肯加班、不抱怨、还不用发工资的团队。洛洛虽然大部分参数都看不明白，但这个感觉我懂——终于有人帮我分担 ddl 了。

想让这些小弟记住你的偏好，接着看[记忆系统](/tech/claude-code-advanced/claude-code-memory)；想给它们装点专门技能，看[Skills](/tech/claude-code-advanced/claude-code-skills)。

洛洛先去睡了，让它们并行加班，我不参与。

## 参考来源

查阅日期 2026-09-14。

* 自定义 Subagents：[https://code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)
* 并行运行 Agent：[https://code.claude.com/docs/en/agents](https://code.claude.com/docs/en/agents)
* Worktree 并行会话：[https://code.claude.com/docs/en/worktrees](https://code.claude.com/docs/en/worktrees)
