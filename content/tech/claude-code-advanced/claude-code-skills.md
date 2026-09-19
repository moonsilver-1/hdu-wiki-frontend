---
title: "Skills 与自定义命令"
date: "2026-09-20"
author: "洛洛"
excerpt: "先说简单的那个，因为它本质上就是一段写好的话。"
tags: ["luoluo", "迁移"]
---

hihi！这篇讲的是洛洛觉得最像"给自己造小工具"的部分。

起因是洛洛做小红书运营的时候，每天要重复一模一样的流程：整理素材、对一遍格式、检查有没有踩敏感词。洛洛把这套流程用嘴对 Claude Code 说了两周，说到自己都烦了。

后来发现完全不用每天说，可以打包好，一句话调出来。

但是！！！打包的方式有两种！！！洛洛一开始把它们当同一个东西，配了个四不像，什么都没触发。

Claude Code 里有两种容易混淆的复用机制：

* **Slash commands**：你显式输入 `/deploy`、`/daily` 触发
* **Skills**：Claude 根据描述按需加载，适合封装领域知识、脚本和资源

两者可以一起用，但不是同一个东西。

洛洛的分辨方法：slash command 是你按门铃叫它，Skill 是它自己判断该不该来。前者你说了才动，后者你都没提它就到了。

## Slash commands

先说简单的那个，因为它本质上就是一段写好的话。

Slash command 本质是一段可复用提示词，适合明确、可命名、由用户主动触发的流程。

### 项目级命令

项目级命令放在 `.claude/commands/`：

```text
.claude/commands/deploy.md
```

```markdown
---
description: 运行项目发布前检查
argument-hint: [environment]
allowed-tools: Bash(pnpm test), Bash(pnpm build), Bash(git status)
---

请按顺序完成发布前检查：

1. 确认当前分支和未提交改动
2. 运行 pnpm test
3. 运行 pnpm build
4. 根据 $ARGUMENTS 判断目标环境
5. 汇总检查结果，不要自动发布
```

使用方式：

```text
/deploy staging
```

截至 2026-09-14 官方文档已改为：自定义命令已并入 Skills，`.claude/commands/deploy.md` 和 `.claude/skills/deploy/SKILL.md` 都会生成 `/deploy`，调用时不再加 `project:` / `user:` 前缀，旧的 `.claude/commands/` 写法仍然可用。

看懂了吗！洛洛看懂了！下半部分就是大白话，你平时怎么交代就怎么写。上面那几行 frontmatter 是交代身份的：叫什么、要什么参数、允许它动哪些命令。

`allowed-tools` 那行洛洛要专门夸一下：它只写了 test、build、git status 三个，也就是说这个命令再怎么样也不会去 push 去删东西。放心之。

`$ARGUMENTS` 是占位符，你敲 `/deploy staging`，`staging` 就跑到那个位置去了。souga，原来参数是这么传的。

### 个人全局命令

个人命令放在 `~/.claude/commands/`：

```text
~/.claude/commands/daily.md
```

使用方式：

```text
/daily
```

全局命令适合个人习惯，不适合提交到团队仓库。

## Skills

好，现在是复杂一点的那个。Skill 不只是一段话，它是一整个文件夹。

Skill 是一个带元数据的能力包，可以包含：

* `SKILL.md`：入口说明和触发描述
* `scripts/`：可执行脚本
* `references/`：长文档、规范、模板
* `assets/`：图片、样例、静态资源

典型结构：

```text
.claude/
└── skills/
    └── api-generator/
        ├── SKILL.md
        ├── scripts/
        │   └── scaffold-api.ts
        └── references/
            └── api-style.md
```

洛洛看这个目录树的第一反应是：欸，这不就是一个作品集文件夹吗。`SKILL.md` 是封面和自我介绍，`scripts/` 是能直接开工的工具，`references/` 是压箱底的规范文档，`assets/` 是配图。

洛洛做设计交接稿的时候就是这么分文件夹的，所以这个结构洛洛一秒就接受了。

`SKILL.md` 示例：

```markdown
---
name: api-generator
description: 当用户要求创建 REST API、路由、控制器或接口测试时使用
---

你负责根据项目现有架构生成 API 代码。

工作规则：
1. 先读取现有路由、控制器、模型和测试
2. 优先复用项目已有 helper 和错误处理方式
3. 需要批量生成文件时，优先调用 scripts/scaffold-api.ts
4. 生成后运行相关测试，不要跳过类型检查
```

Claude 会根据 `description` 判断何时加载这个 Skill。`description` 要写触发场景，不要只写"很好用的 API 工具"。

> **洛洛碎碎念**
>
> `description` 这条洛洛翻过车，血泪教训！！！
> 
>   洛洛第一个 Skill 的描述写的是"洛洛超好用的小红书排版神器"，写得特别自豪，结果一次都没被触发过。因为 Claude 是靠这句话判断"现在该不该用它"的，你夸它有多好用没有任何用。
> 
>   改成"当用户要整理小红书图文、检查排版或校对敏感词时使用"之后，立刻就通了。
> 
>   写触发场景，不要写广告词。洛洛做运营的职业病在这里彻底害了洛洛一次。

## 怎么选

两种都会写了，那到底用哪个。这张表洛洛现在直接当决策器用：

| 需求                      | 选择                     |
| ----------------------- | ---------------------- |
| 我想输入一个命令触发固定流程          | Slash command          |
| 我想让 Claude 遇到某类任务自动加载规范 | Skill                  |
| 只是全项目通用约束               | `CLAUDE.md`            |
| 需要确定性执行脚本               | Hook 或 Skill 里的 script |
| 需要连接外部工具                | MCP                    |

最后两行洛洛想多说一句：Skill 里的脚本是"它决定要用的时候才跑"，Hook 是"到了那个节点必须跑"。要保证百分百执行的事情，别指望 Skill，那是 Hook 的活。

## 团队协作

自己爽完了，接下来是分享给别人的部分。

可以提交到 Git 的内容：

* `.claude/commands/*.md`
* `.claude/skills/*/SKILL.md`
* Skill 需要的脚本、模板、参考资料

不要提交：

* 个人 token
* 本机绝对路径
* 只适合一个人的 alias
* 自动发布、自动 push、自动删除资源的危险命令

最后那条洛洛看了两遍。洛洛给自己定的规矩是：能自动毁掉东西的操作，永远不要放进任何一个"一句话就能触发"的入口。想想也是，`/deploy` 打错成别的什么，那画面太可怕了。

一个稳妥的团队实践是：把高频工作流做成 slash command，把领域知识做成 Skill，把安全边界写进 `settings.json` 和 Hooks。

## 洛洛的总结

洛洛现在有三个自己写的 Skill，全是从"这件事洛洛已经说烦了"开始的。

判断标准很简单：同一段交代你说到第三遍，就该把它打包了。

配好了想让 Claude Code 直接住进编辑器里，下一篇是[IDE 集成](/tech/claude-code-reference/claude-code-ide)。

洛洛先去把小红书那个 Skill 再改改，描述又想到更好的写法了。

## 参考来源

查阅日期 2026-09-14。

* Skills（含自定义命令）：[https://code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
* 命令参考：[https://code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands)
