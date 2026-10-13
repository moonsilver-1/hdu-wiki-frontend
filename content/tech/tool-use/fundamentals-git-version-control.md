---
title: "Git 版本控制"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "想象你在写一篇论文。你存了”论文v1.docx”，继续修改，又存了”论文v2.docx”。改着改着觉得某段改得不好，想回到之前的版本。后来你和朋友一起写，他也在编辑文档，你们产生了冲突：他删了某个段落，你在那个段落里加了新内容。现在有两个版本的”论文最终版.docx”，谁也不知道该用谁的。"
tags: ["洛洛", "转载"]
---

## 为什么需要版本控制？

想象你在写一篇论文。你存了"论文v1.docx"，继续修改，又存了"论文v2.docx"。改着改着觉得某段改得不好，想回到之前的版本。后来你和朋友一起写，他也在编辑文档，你们产生了冲突：他删了某个段落，你在那个段落里加了新内容。现在有两个版本的"论文最终版.docx"，谁也不知道该用谁的。

**版本控制就是为了解决这些混乱**。它是一个记录文件变化历史的工具，能让你：

* **保留完整历史**：每一次修改都被记录，可以回溯到任何时间点
* **追踪变化**：知道何时、由谁、改了什么
* **恢复误操作**：删了重要代码？一键恢复
* **协同工作**：多人编辑同一项目，系统智能合并
* **审视问题**：什么时候引入了 bug？检查历史就能找到

程序员的代码就像那篇论文——但改动频繁得多。没有版本控制，你会在 `main_final.js` `main_final_v2.js` `main_REAL_final_backup.js` 这样的文件名中溺水。

***

## 什么是 Git？

**Git** 是目前最流行的版本控制系统，由 Linux 之父 Linus Torvalds 在 2005 年创建。

它的核心特点是**分布式**——每个开发者的电脑上都有完整的项目历史，不依赖单一的中央服务器。即使 GitHub 挂了，你本地的仓库仍然有所有历史。

### Git vs GitHub

这两个经常被混淆：

* **Git**：一个软件工具，装在你的电脑上，负责追踪文件变化
* **GitHub**：一个网站/平台，用来托管 Git 仓库，提供协作功能（PR、Issue 等）

类比：Git 是"日记本"（记录你的笔记），GitHub 是"图书馆"（把日记本存放在那里，让别人也能看）。

***

## 仓库（Repository）

**仓库**（简称 Repo）就是一个被 Git 追踪的项目文件夹。当你在文件夹里运行 `git init` 时，Git 在里面创建了一个隐藏的 `.git` 目录，开始追踪所有变化。

* **没有 Git 的项目**：一个普通文件夹
* **有 Git 的项目**：一个配备了"监控摄像头"的文件夹，每一个改动都被记录

### 本地仓库 vs 远程仓库

* **本地仓库**：你电脑上的 `.git` 目录及其追踪的文件
* **远程仓库**：GitHub/GitLab 上的副本，用于备份和协作

### Claude Code 为什么一上来就看 Git 状态？

因为它需要知道：

* 当前项目是什么状态？
* 有哪些未保存的改动？
* 在哪个分支上工作？

这样它才能安全地修改代码，不会搞乱你的工作。

***

## Commit（提交）

**Commit 是一个"版本快照"**——记录了某一刻项目的完整状态和改动描述。

每个 commit 包含：

```
Commit: abc123def
作者: Alice <alice@example.com>
时间: 2026-04-08 15:30:00
描述: "修复登录页面的 session 验证 bug"

改动的文件:
  修改: src/auth.ts (+5 行, -2 行)
  修改: src/middleware.ts (+3 行, -1 行)
```

### 好的 commit 是什么样的？

一个 commit 应该代表**一个完整的、有意义的改动**：

* ✅ "修复用户登录时密码校验的 bug"
* ✅ "添加搜索功能的前端组件"
* ❌ "改了一些东西"
* ❌ "wip"（work in progress，半成品）

### 为什么 Claude Code 不自动 commit？

这涉及几个原则：

1. **Commit 是有意义的单位**。Claude 可能做了 10 步修改来完成你的任务，但你可能想把它们组织为 2-3 个有意义的 commit。机器自动划分太武断。

2. **Commit 是你的名字背书**。Git 会记录作者是你。commit 意味着"我审查了这些改动，我对它们负责"。如果 Claude 自动 commit，就模糊了"谁真正审查过"。

3. **控制权**。commit 是永久的历史记录——一旦推送到远程仓库，很难完全删除。所以 Claude Code 改完代码后会等你确认。

***

## Branch（分支）

### 核心概念

想象一棵树。主干（`main`）是项目的正式版本。当你想尝试新功能但不想搞乱主干，就从上面长出一根枝条（branch）。在枝条上自由试验，完成后再并回主干。

```
main:          ●——●——●——●——●——●  （正式版，应该是稳定的）
                    ╲          ╱
feature/login:      ●——●——●——●  （新功能，可以随意试验）
```

### 为什么需要分支？

1. **隔离工作**：多个人可以同时在不同分支上工作，互不干扰
2. **实验安全**：想尝试激进的重构？在分支上做，不影响正式版
3. **代码审查**：改完后通过 PR（Pull Request）让人审查，确认无误再合并

### 常用的分支命令

```bash
git branch                  # 查看所有分支
git branch feature/login    # 创建新分支
git checkout feature/login  # 切换到某个分支
git checkout -b feature/login  # 创建并切换（常用快捷方式）
git merge feature/login     # 把分支合并回当前分支
```

### Claude Code 为什么关注分支？

1. 确保改动在正确的分支上——不应该直接改 `main`
2. 知道当前分支才能正确地创建 PR
3. 不同分支可能有不同的代码状态

***

## Staged / Unstaged（暂存 / 未暂存）

这是初学者最容易混淆的概念。Git 有**三个"区域"**：

### 三个区域

```
工作目录              暂存区              仓库
(Working Directory)  (Staging Area)     (Repository)

你在编辑器里改代码    git add 后进入这里    git commit 后永久保存
   ↓                    ↓                   ↓
 文件.ts ✏️ ──git add──> [文件.ts] ──git commit──> 💾 历史记录
```

1. **工作目录**：你的文件夹里真实存在的文件，你在编辑器里改的就是这里
2. **暂存区**（Staging Area）：一个中间站。`git add` 把文件从工作目录放到暂存区
3. **仓库**：`git commit` 把暂存区的文件永久保存到历史

### 为什么需要暂存区？

假设你改了 10 个文件，但只想把其中 3 个放进这次 commit（其他 7 个还在试验）：

```bash
git add auth.ts middleware.ts config.ts   # 只暂存这 3 个
git commit -m "修复认证逻辑"
## 其他 7 个文件仍在工作目录，不在这次 commit 里
```

暂存区让你精确控制"这次提交包含哪些改动"，而不是一股脑全提交。

### 查看状态

```bash
git status
```

输出示例：

```
Changes to be committed:        # 已暂存，准备 commit 的
  modified: src/auth.ts

Changes not staged for commit:  # 修改了但还没暂存的
  modified: src/utils.ts

Untracked files:                # 全新的文件，Git 还不知道它
  src/new-feature.ts
```

***

## .gitignore

### 为什么有些文件不该被追踪？

你的项目有些文件不应该出现在 Git 历史中：

* **密钥文件**（`.env`）：包含密码和 API 密钥
* **依赖包**（`node_modules/`）：几万个文件，可以通过 lock 文件重新安装
* **构建产物**（`.next/`、`dist/`）：从源代码生成的，不需要追踪
* **系统文件**（`.DS_Store`）：macOS 自动生成的垃圾文件

### .gitignore 文件

`.gitignore` 放在项目根目录，告诉 Git 哪些文件要忽略：

```bash
## 依赖
node_modules/

## 环境变量（包含密钥）
.env
.env.local
.env*.local

## 构建产物
.next/
dist/
build/

## 系统文件
.DS_Store
*.log

## 生成的文件
.source/
```

**Git 会完全无视这些文件**——不追踪、不显示在 `git status` 里、不会被 commit。

Claude Code 也会尊重 `.gitignore`，不会提交被忽略的文件。

***

## Push 和 Pull

### 本地 vs 远程

你的电脑上有本地仓库，GitHub 上有远程仓库。它们需要同步：

```
你的电脑                    GitHub 服务器
(本地仓库)                  (远程仓库)
  ●—●—●—●               ←── git pull ──  ●—●—●
  本地改动  ── git push ──→              远程版本
```

### git pull（拉取）

从远程仓库下载最新改动到你的电脑。当同事上传了新代码到 GitHub，你想要他的改动就 pull：

```bash
git pull origin main  # 从远程的 main 分支拉取最新代码
```

### git push（推送）

上传你的 commit 到远程仓库：

```bash
git push origin main  # 把本地的 main 分支推送到远程
```

### 为什么 push 是"危险操作"？

1. **不可逆**：push 后代码在服务器上了，别人可能已经看到、合并、部署到生产环境
2. **影响他人**：如果你 push 了有 bug 的代码到 main 分支，整个团队的构建可能崩溃
3. **强制推送更危险**：`git push --force` 会覆盖远程历史，可能丢失别人的工作

**这就是为什么 Claude Code 永远不会自动 push**——这是你和远程之间的事，容不得自作主张。

***

## Pull Request（PR）

### 什么是 PR？

你在 `feature/login` 分支上做了改动，想合并回 `main`。但不想直接合并——你想让队友先看一遍。

**Pull Request 就是一个"合并申请"**：

> "我在 feature/login 分支做了这些改动，想合并到 main。请大家审查一下。"

PR 的生命周期：

1. 你创建 PR，描述改了什么、为什么改
2. 队友逐行审查代码，留下评论
3. 自动化测试运行
4. 讨论、修改、迭代
5. 获批后合并到 main

### 为什么 Claude Code 能创建 PR？

Claude Code 可以：

1. 创建新分支
2. Commit 改动
3. 通过 GitHub API 打开 PR，写好描述
4. 等你审查并决定是否合并

但它**不会自动合并 PR**——最终决定权在你手里。

***

## 合并冲突（Merge Conflict）

### 什么时候会发生？

两个人同时修改了同一个文件的同一行代码：

```
原始版本:
  const name = "User"

你的修改（feature-a 分支）:
  const name = "Customer"

同事的修改（feature-b 分支）:
  const name = "Client"
```

Git 尝试合并时发现：同一行代码有两个不同的改动，它无法自动判断该用哪个。

### 冲突标记

Git 会在文件中插入特殊标记：

```javascript
<<<<<<< HEAD (你的版本)
const name = "Customer"
=======
const name = "Client"
>>>>>>> feature-b (对方的版本)
```

### 如何解决？

1. 打开冲突文件
2. 手动选择保留哪个版本（或者两个都保留、或写一个新的）
3. 删除 Git 的冲突标记（`<<<<<<<`、`=======`、`>>>>>>>` 那几行）
4. `git add` 标记冲突已解决
5. `git commit` 完成合并

Claude Code 遇到冲突时会提醒你，展示冲突位置，帮你决定怎么解决。

***

## Git Diff

### 什么是 diff？

**Diff（差异）** 显示两个版本之间的具体改动。

```diff
文件: src/auth.ts

- const token = getToken();
+ const token = getToken() || refreshToken();

  if (!token) {
-   return null;
+   throw new Error("No valid token");
  }
```

* 以 `-` 开头的行（红色）= 被删除的内容
* 以 `+` 开头的行（绿色）= 新增的内容
* 没有前缀的行 = 未改动的上下文

### 常用的 diff 命令

```bash
git diff                 # 查看未暂存的改动
git diff --staged        # 查看已暂存的改动（将要 commit 的）
git diff main..feature   # 比较两个分支的差异
git diff HEAD~3          # 和 3 个 commit 之前对比
```

### Claude Code 为什么经常用 diff？

1. **验证改动**：修改代码后用 diff 确认改了什么
2. **生成提交信息**：看 diff 理解改动内容，写出准确的 commit message
3. **和你沟通**：展示 diff 说"看，我就改了这些地方，你确认一下"

***

## Claude Code 与 Git 的关系总结

| Claude Code 的行为        | 背后的原因              |
| ---------------------- | ------------------ |
| 启动时显示当前分支              | 确保你知道改动会发生在哪个分支    |
| 显示 uncommitted changes | 提醒你有未保存的改动         |
| 不自动 commit             | commit 是你名字背书的正式记录 |
| 不自动 push               | push 影响他人，是不可逆操作   |
| 经常运行 git diff          | 验证改动、生成描述、与你沟通     |
| 尊重 .gitignore          | 不会提交被忽略的文件         |
| 可以创建 PR                | 帮你走正规的代码审查流程       |

## 参考来源

* Pro Git 中文版：[https://git-scm.com/book/zh/v2（查阅于](https://git-scm.com/book/zh/v2（查阅于) 2026-09-14）
* Git 官方命令参考：[https://git-scm.com/docs（查阅于](https://git-scm.com/docs（查阅于) 2026-09-14）
* GitHub 文档：关于拉取请求：[https://docs.github.com/zh/pull-requests（查阅于](https://docs.github.com/zh/pull-requests（查阅于) 2026-09-14）
