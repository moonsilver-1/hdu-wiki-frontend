---
title: "对话与记忆管理"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "这是很多新手感到困惑的第一件事：”为什么我换了个文件夹就找不到之前的对话了？”"
tags: ["洛洛", "转载"]
---

## 对话隔离：每个目录有独立的会话

这是很多新手感到困惑的第一件事：**"为什么我换了个文件夹就找不到之前的对话了？"**

### 工作原理

Claude Code 的对话是按**目录（项目路径）** 隔离的：

* 在 `/Users/mozi/开发/project-A` 启动 → 会话属于 project-A
* 在 `/Users/mozi/开发/project-B` 启动 → 全新的独立会话
* 同一目录内的多个会话被分组在一起

两个不同目录的对话**完全不互通**——就像两个独立的聊天窗口。

### 对话存储在哪里？

所有对话历史存储在本地磁盘：

```
~/.claude/projects/
└── <项目路径编码>/
    └── <会话ID>.jsonl   # 完整对话记录
```

项目路径会被编码（比如 `/Users/mozi/开发/LL001 luoluo-wiki` → `-Users-mozi----LL001-luoluo-wiki`），所以不同项目的对话存在不同的子目录。

### 对话完全在本地

你的对话**不会同步到云端**（除非你用了云执行模式）。但本地记录不是永久保留的：Claude Code 会清理超过 `cleanupPeriodDays` 天的旧会话记录，截至 2026-09-14 官方默认是 30 天，想留久一点可以在 settings.json 里调大。

***

## 上下文窗口管理

### 会话开始时加载什么？

每次新对话开始，Claude Code 会自动加载：

```
┌─ 系统提示（约 4,000 Token）
├─ CLAUDE.md（项目级 + 用户级合并）
├─ Auto Memory（MEMORY.md 的前 200 行或前 25KB，先到为准）
├─ Git 状态信息（当前分支、未提交改动）
└─ 剩余空间留给对话
```

这些"预加载"内容会始终占据上下文的一部分空间。

### 对话进行中

随着对话进行，上下文逐渐填充：

```
系统提示        █████  8%
CLAUDE.md       ███  5%
Memory          ██  3%
对话历史        ████████████████████  55%
文件内容        ██████  15%
工具定义        ███  5%
空闲空间        ████  9%
```

当空闲空间不足时，Claude Code 会自动开始压缩。

### 什么会消耗大量上下文？

| 操作            | 大约消耗        | 说明          |
| ------------- | ----------- | ----------- |
| 读取一个大文件       | 数千 Token    | 文件内容全部进入上下文 |
| 运行命令的输出       | 几百到数千 Token | 输出越长消耗越多    |
| 多轮来回讨论        | 累积增长        | 每轮都叠加       |
| 让 Claude 搜索代码 | 几千 Token    | 搜索结果进入上下文   |

***

## 会话恢复

关闭终端后，对话不会丢失。你有多种方式恢复：

### `claude --continue`

恢复**当前目录最近的那个会话**：

```bash
cd /Users/mozi/开发/LL001\ luoluo-wiki
claude --continue
```

整个对话历史恢复，你可以继续提问，就像从没离开过。

### `claude --resume`

打开**交互式选择器**，列出当前目录的所有历史会话：

```bash
claude --resume
```

你会看到每个会话的：

* 创建时间
* 最后活动时间
* 消息数量
* 简短描述（如果你给它起过名字）

选择一个按 Enter 恢复。

### `claude --resume 会话名`

如果你用 `/rename` 命令给会话起过名字（比如 `/rename auth-refactor`），可以直接恢复：

```bash
claude --resume auth-refactor
```

### `--fork-session`（分叉会话）

想保持原对话不动，从某个点分出一个新分支试验不同方向：

```bash
claude --continue --fork-session
```

效果：

* 原始会话保持不变
* 新会话继承所有历史
* 后续改动只在新会话里

类比：就像 Git 的分支——原始对话是 `main`，新会话是 `feature-branch`。

***

## CLAUDE.md：你手写的项目宪法

### 什么是 CLAUDE.md？

CLAUDE.md 是一个你创建并维护的 Markdown 文件，它的内容会**在每次会话开始时自动加载**到上下文中。

就像给 Claude 一本"项目手册"——不管什么时候开始新对话，Claude 都先读这本手册，知道你的项目规则。

### 应该写什么？

```markdown
## CLAUDE.md

## 项目概述
这是一个基于 Next.js 的知识百科站...

## 常用命令
- pnpm dev — 启动开发服务器
- pnpm build — 生产构建
- pnpm lint — 代码检查

## 代码规范
- 使用 2 空格缩进
- 使用 Biome 格式化
- TypeScript 严格模式

## 架构
- MDX 文档位于 content/docs/
- AI 聊天 API 在 src/app/api/chat/
```

### 不应该写什么？

* ❌ 太长的内容（200 行以内，否则占太多上下文）
* ❌ 模糊的指示（"写好代码"——无法执行）
* ❌ 代码里能看到的信息（Claude 可以自己读代码）
* ❌ 不断变化的状态（用 Memory 或 Task 来记录）

### 多层 CLAUDE.md

CLAUDE.md 可以存在多个位置，Claude 会全部加载并合并：

| 位置                     | 作用域    | 共享性             |
| ---------------------- | ------ | --------------- |
| `~/.claude/CLAUDE.md`  | 所有项目通用 | 仅你个人            |
| `./CLAUDE.md`          | 当前项目   | 团队共享（提交 Git）    |
| `./.claude/rules/*.md` | 细分规则   | 团队共享            |
| `./CLAUDE.local.md`    | 当前项目   | 仅你个人（gitignore） |

**优先级**：越靠后、越具体的内容优先级越高。如果全局 CLAUDE.md 说"用 4 空格缩进"，项目 CLAUDE.md 说"用 2 空格缩进"，以项目的为准。

***

## Auto Memory：Claude 自己学习的笔记

### 什么是 Auto Memory？

除了你手写的 CLAUDE.md，Claude Code 还有一个**自动记忆系统**——Claude 会在工作过程中自动记录：

* 你纠正过的错误（"这里应该用 async"）
* 你的偏好（"你总是要求在 commit 前运行测试"）
* 项目模式（"所有 API 路由都用 /api/ 前缀"）
* 重要的上下文（"我们正在从 REST 迁移到 GraphQL"）

### 存储位置

```
~/.claude/projects/<项目ID>/memory/
├── MEMORY.md           # 索引文件（前 200 行或 25KB 每次都加载）
├── user_preferences.md # 用户偏好
├── project_context.md  # 项目上下文
└── ...                 # 其他记忆文件
```

### CLAUDE.md vs Auto Memory

| 特性   | CLAUDE.md  | Auto Memory              |
| ---- | ---------- | ------------------------ |
| 谁写   | 你手动编写      | Claude 自动记录              |
| 加载时机 | 每次会话开始     | 每次会话开始（前 200 行或 25KB）    |
| 内容类型 | 项目规则、架构、命令 | 学到的模式、偏好、上下文             |
| 是否共享 | 可以团队共享     | 仅本地机器                    |
| 修改方式 | 手动编辑文件     | Claude 自动更新 or `/memory` |
| 持久性  | 永久（直到你改或删） | 自动维护，可能被更新或替换            |

### 主动让 Claude 记住

你可以明确告诉 Claude 记住某些信息：

```
请记住：这个项目的部署流程是先推到 staging，
通过 QA 后再合并到 main 触发生产部署。
```

Claude 会创建一条 Memory 记录，下次对话自动加载。

### 让 Claude 忘记

```
请忘记之前关于部署流程的记忆，流程已经变了。
```

Claude 会找到并删除相关的 Memory 条目。

***

## 多实例运行

### 能同时开多个 Claude Code 吗？

**可以**，但要注意方式。

### 不同目录：完全没问题

```bash
## 终端 1：在项目 A 工作
cd /project-a && claude

## 终端 2：在项目 B 工作
cd /project-b && claude
```

两个完全独立的会话，互不干扰。

### 同一目录，不同会话：没问题

```bash
## 终端 1
cd /my-project && claude

## 终端 2（新会话）
cd /my-project && claude
```

各自是独立的新会话。

### 同一个会话的多个实例：危险

```bash
## 终端 1
claude --continue

## 终端 2（恢复同一个会话）
claude --continue
```

**不要这样做！** 两个终端会往同一个对话文件写数据，导致内容交错混乱。

### 正确的并行工作方式

使用 **Git worktree**：

```bash
## 终端 1：在 main 分支工作
cd /my-project && claude

## 终端 2：在独立的工作副本中
claude --worktree feature-new
```

`--worktree` 创建一个**独立的项目副本**和**独立的会话**，两个 Claude 实例完全隔离。

***

## 实用技巧

### 1. 定期 /compact

长对话中定期压缩，释放空间：

```
/compact
```

### 2. 任务切换时 /clear

切换到不相关的任务时，清空对话重新开始，而不是在同一个对话里混杂：

```
/clear
```

### 3. 重要信息写入 CLAUDE.md

不要依赖 Claude "记住"你说过的话。重要的规则、架构决定、项目约定，都写进 CLAUDE.md。

### 4. 给会话起名字

完成一轮有意义的工作后：

```
/rename auth-refactor
```

以后可以快速恢复：`claude --resume auth-refactor`

### 5. 检查上下文使用

```
/context
```

看看上下文被什么占满了，判断是否需要压缩或清空。想看 Token 消耗和费用用 `/usage`（`/cost` 是它的别名）。

***

## 一张全景图

```
┌─ 会话开始
│  ├─ 自动加载：系统提示
│  ├─ 自动加载：CLAUDE.md（全局 + 项目 + 本地合并）
│  ├─ 自动加载：Auto Memory（MEMORY.md 前 200 行或 25KB）
│  └─ 上下文窗口初始化
│
├─ 对话进行中
│  ├─ 你的每个提问进入上下文（消耗 Token）
│  ├─ Claude 的回答进入上下文
│  ├─ 文件内容、命令输出也进入上下文
│  └─ 上下文逐渐填满...
│
├─ 上下文快满时
│  ├─ 自动清除旧的工具输出
│  ├─ 自动压缩冗长的对话历史
│  └─ 或你主动 /compact 或 /clear
│
├─ 对话保存（自动）
│  ├─ 每条消息实时保存到磁盘
│  ├─ Claude 学到的东西更新到 Memory
│  └─ 关闭终端不影响保存
│
└─ 恢复
   ├─ --continue  恢复最近会话
   ├─ --resume    选择历史会话
   └─ --fork-session  分叉新会话
```

## 参考来源

* Claude Code 记忆机制（CLAUDE.md 与 Auto Memory）：[https://code.claude.com/docs/en/memory（查阅于](https://code.claude.com/docs/en/memory（查阅于) 2026-09-14）
* Claude Code .claude 目录说明（会话记录位置与保留期）：[https://code.claude.com/docs/en/claude-directory（查阅于](https://code.claude.com/docs/en/claude-directory（查阅于) 2026-09-14）
* Claude Code 命令参考：[https://code.claude.com/docs/en/commands（查阅于](https://code.claude.com/docs/en/commands（查阅于) 2026-09-14）
