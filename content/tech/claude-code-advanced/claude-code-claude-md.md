---
title: "CLAUDE.md 最佳实践"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "Claude 会分析项目结构，自动生成一个初始 CLAUDE.md。"
tags: ["洛洛", "转载"]
---

洛洛有过一段特别累的日子。

每天打开 Claude Code，第一件事就是复述同一段话：这个项目用 bun 不要用 npm、提交信息用中文、`src/legacy/` 别动。

一天两天还行，第五天我已经把这段话存进备忘录了，每次开工先粘一遍。哈哈哈哈哈哈，我居然想出了这么原始的解决方案。

后来跟默子老师提了一句，他说：你为什么不写进 `CLAUDE.md`？

`CLAUDE.md` 是 Claude Code 的核心配置文件，每次会话开始时自动读取。写好它，Claude 的表现会截然不同。

souga——原来我那个备忘录，官方早就给我准备好位置了。

## 快速生成

好消息是你不用从空白文件开始。

```bash
claude
## 进入后输入
/init
```

Claude 会分析项目结构，自动生成一个初始 CLAUDE.md。

洛洛建议就从这里起步，让它先自己写一版，你再往上加东西。它对项目结构的观察力比洛洛强得多，第一次看到生成结果的时候我人都傻了。

## 应该写什么

生成完你会想改，那问题就来了：到底该往里塞什么？

### 写 Claude 猜不到的东西

```markdown
## 构建与测试
- 用 pnpm 不要用 npm
- 测试命令：pnpm vitest run
- 只跑单个测试：pnpm vitest run src/xxx.test.ts

## 项目规范
- 提交信息用中文
- 分支命名：feature/xxx、fix/xxx
- PR 标题不超过 70 字符

## 注意事项
- src/legacy/ 下的代码不要动，正在迁移中
- 数据库迁移必须用 drizzle-kit generate
- IMPORTANT: 不要自动提交 git
```

看这几条的共同点：全是"看代码也看不出来"的信息。包管理器选哪个、哪个目录正在迁移、提交信息用什么语言，这些都是人拍的板，代码里不写脸上。

### 强调重点

用 `IMPORTANT`、`YOU MUST`、`NEVER` 等关键词提高遵守率：

```markdown
IMPORTANT: 所有 API 路由必须先验证 JWT token
NEVER: 不要删除 migrations 目录下的任何文件
YOU MUST: 每次修改组件后运行 pnpm typecheck
```

第一次知道能这么写的时候洛洛觉得有点好笑——原来对 AI 也要吼一嗓子才管用。但这招是真的有用，洛洛把"不许自动提交"那条加上 `IMPORTANT` 之后，就再没被偷偷 commit 过。

## 不应该写什么

这一节比上一节重要。洛洛的第一版 `CLAUDE.md` 写了七十多行，感觉自己好认真好负责，实际效果反而变差了。

* Claude 读代码就能看出来的东西（比如「这是一个 React 项目」）
* 标准语言惯例（比如「变量用 camelCase」——TypeScript 项目默认就这样）
* 详细的 API 文档（改为链接引用）
* 「写干净代码」这类废话
* 每个文件的详细说明

**原则：删掉这条，Claude 会犯错吗？如果不会，就不需要。**

> **洛洛碎碎念**
>
> 洛洛那七十行里，有一条是"请写出优雅的代码"。
> 
>   ……我当时是真心的！我觉得说了它就会更努力！
> 
>   默子老师看完的评价是："你这是在写许愿池。"
> 
>   救命，被说中了。真正有用的是"用 bun 不要用 npm"这种一看就知道能不能做到的规矩，废话只会挤占它读正事的注意力。

## 文件层级

写着写着你会遇到新烦恼：有些规矩是你个人偏好，有些是全团队的，不该混在一起。

CLAUDE.md 支持多级放置，下表按从通用到具体排列。这些文件会拼接进上下文，不是互相覆盖，越具体的越后读到：

| 位置                                    | 作用域      | 是否签入 Git         |
| ------------------------------------- | -------- | ---------------- |
| `~/.claude/CLAUDE.md`                 | 所有项目全局   | 否                |
| `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 当前项目     | 是（推荐）            |
| `./CLAUDE.local.md`                   | 当前项目（个人） | 否（加入 .gitignore） |
| `./子目录/CLAUDE.md`                     | 特定子目录    | 是                |

洛洛的分法很粗暴但够用：**"我这个人的习惯"放全局，"这个项目的事实"放项目里并提交，"只有我自己想凑合一下的"放 local。**

### Monorepo 用法

```
repo/
├── CLAUDE.md           # 全局规范
├── packages/
│   ├── frontend/
│   │   └── CLAUDE.md   # 前端特定规范
│   └── backend/
│       └── CLAUDE.md   # 后端特定规范
```

Claude 读到子目录里的文件时，会按需加载对应的 CLAUDE.md。

也就是说前端的规矩不会去烦后端。洛洛觉得这个很像宿舍公约和个人桌面公约，各管一层，互不打扰。

## 导入其他文件

规矩多了之后，主文件会开始变胖。这时候可以拆。

用 `@` 语法引用外部文件：

```markdown
## 项目规范
@docs/git-instructions.md
@docs/api-conventions.md
```

## CLAUDE.md vs Skills

洛洛纠结过很久的问题：既然都是"教它做事"，那这个和 Skills 有什么区别？

|           | CLAUDE.md | Skills            |
| --------- | --------- | ----------------- |
| **加载时机**  | 每次会话自动加载  | 按需加载              |
| **适合内容**  | 广泛适用的规范   | 特定领域知识            |
| **文件位置**  | 项目根目录     | `.claude/skills/` |
| **上下文成本** | 每次都占用     | 只在需要时占用           |

**原则：高频用到的放 CLAUDE.md，偶尔用到的放 Skills。**

那一栏「上下文成本」是关键。`CLAUDE.md` 里的每一行都是每次开工都要重读一遍的，所以它越精越好——这也是洛洛后来忍痛砍掉七十行的原因。

## 维护建议

最后一件事：它不是写完就锁进抽屉的东西。

1. **像代码一样管理** — 签入 Git，团队共同维护
2. **出了问题先检查它** — Claude 行为不对？可能是 CLAUDE.md 没写清楚
3. **定期修剪** — 删除过时的规则，保持精简
4. **从错误中学习** — Claude 犯了错，加一条对应的规则

第 4 条是洛洛最有感触的。现在只要它做错一次，洛洛就往里加一行，那个文件基本上是我踩坑史的目录。

## 收工

写 `CLAUDE.md` 的手感很像给新来的同学写交接文档：写太少人家不知道规矩，写太多人家看不完。

短、准、只写猜不到的。够了。

下一篇去看[上下文管理](/tech/claude-code-advanced/claude-code-context)，聊聊为什么聊久了它会开始"忘事"，以及怎么办。

洛洛先去睡了，这个宿舍需要睡眠。

## 参考来源

查阅日期 2026-09-14。

* CLAUDE.md 与记忆：[https://code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory)
* 最佳实践：[https://code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)
* Skills：[https://code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
