---
title: "斜杠命令"
date: "2026-09-20"
author: "洛洛"
excerpt: "下面这张表洛洛存了很久，但请你把它当”目录”看，不要当”圣经”背——它更新得比洛洛写文档快。"
tags: ["luoluo", "迁移"]
---

洛洛第一次按到 `/` 是手滑。

真的是手滑，本来想打别的，结果屏幕上唰地弹出来一长条命令列表。当时我的反应是"wc 这是什么"，然后一个一个点着看，看到 `/cost` 的时候人一下子清醒了——原来还能看花了多少钱。

从那天起洛洛就养成了一个习惯：**没事就按一下 `/`。**

在 Claude Code 交互模式中，输入 `/` 可以查看当前版本支持的命令。内置命令会随版本更新，所以实际列表以终端里的自动补全为准。

## 常见内置命令

下面这张表洛洛存了很久，但请你把它当"目录"看，不要当"圣经"背——它更新得比洛洛写文档快。

| 命令                          | 说明                                                               |
| --------------------------- | ---------------------------------------------------------------- |
| `/help`                     | 查看帮助                                                             |
| `/clear`                    | 清空当前对话上下文                                                        |
| `/compact`                  | 压缩对话历史，释放上下文                                                     |
| `/cost`                     | 查看用量和费用（现为 `/usage` 的别名）                                         |
| `/config`                   | 打开配置界面，修改主题、模型等简单设置                                              |
| `/model`                    | 查看或切换模型                                                          |
| `/fast`                     | 切换快速模式，更快输出，不降级模型                                                |
| `/doctor`                   | 检查安装、登录和配置状态                                                     |
| `/init`                     | 在当前项目生成 `CLAUDE.md`                                              |
| `/login`                    | 登录或切换账号                                                          |
| `/logout`                   | 退出登录                                                             |
| `/memory`                   | 查看或编辑记忆                                                          |
| `/mcp`                      | 查看 MCP server 和工具状态                                              |
| `/hooks`                    | 查看 Hooks 配置（只读，改配置要编辑 settings）                                  |
| `/agents`                   | v2.1.198 起只提示你让 Claude 写，或直接编辑 `.claude/agents/`                 |
| `/run`                      | 启动并运行当前项目的应用，确认改动在真实环境生效                                         |
| `/review`                   | `/code-review` 的别名                                               |
| `/code-review`              | 代码审查，支持 `low` / `medium` / `high` / `xhigh` / `max` / `ultra` 级别 |
| `/simplify`                 | 审查改动代码的复用、简化和效率，自动应用修复                                           |
| `/security-review`          | 对当前分支的待提交改动进行安全审查                                                |
| `/loop`                     | 按间隔循环执行 prompt 或命令，如 `/loop 5m /code-review`                     |
| `/schedule`                 | 创建和管理定时云端 Agent，支持 cron 和一次性定时执行                                 |
| `/fewer-permission-prompts` | 扫描历史对话记录，自动生成权限白名单减少弹窗                                           |

不同安装渠道和账号权限会影响可用命令。遇到不确定的命令，先输入 `/` 看当前提示，不要照抄过期列表。

> **洛洛碎碎念**
>
> 洛洛想特别夸一下 `/doctor`。
> 
>   当年我配不好环境的时候是这样解决问题的：重装、再重装、怀疑电脑、怀疑水逆、去戳默子老师。
> 
>   默子老师回了两个字："`/doctor`。"
> 
>   它自己就会告诉你安装、登录、配置哪一环坏了。洛洛那一晚的眼泪，本来一个命令就能省下来。菜之。

### 几个值得展开说的命令

表里有几个不看说明真的猜不出来它有多能干，洛洛挑三个说说。

**`/code-review`**：代码审查（`/review` 现在是它的别名）。可以指定审查力度——`low` 和 `medium` 只报高置信度问题，`high`、`xhigh` 到 `max` 覆盖更广但可能包含不确定的发现，`ultra` 级别会在云端启动多个 Agent 并行深度审查。加 `--fix` 可以直接把审查结果应用到工作区，加 `--comment` 可以把发现贴到 PR 评论里。

一堆 Agent 在云端一起看你的代码，画面感太强了。牛逼之。

**`/loop`**：让某个命令按固定间隔反复执行，适合轮询部署状态、持续监控之类的场景。省略间隔参数时，模型会自己决定节奏。

**`/schedule`**：在云端创建定时任务，相当于给 Claude Code 配了个 cron。可以设置重复执行的计划任务，也可以安排一次性的定时运行（比如"明天下午三点跑一次"）。

洛洛这种拖延症看到定时任务是有点心虚的，因为它比我准时得多。

## 自定义项目命令

内置的用顺手了，你就会开始惦记：那我自己那套流程能不能也塞进一个 `/` 里？能。

项目级命令放在 `.claude/commands/`：

```text
.claude/commands/deploy-check.md
```

```markdown
---
description: 运行发布前检查，不执行真实发布
argument-hint: [target]
allowed-tools: Bash(pnpm test), Bash(pnpm build), Bash(git status)
---

请按顺序完成：

1. 查看当前分支和未提交改动
2. 运行 pnpm test
3. 运行 pnpm build
4. 根据 $ARGUMENTS 判断目标环境
5. 汇总结果和风险

不要提交、不要推送、不要执行真实发布。
```

使用方式：

```text
/deploy-check staging
```

截至 2026-09-14 官方文档已改为：自定义命令已并入 Skills，直接用文件名调用，不再加 `project:` / `user:` 前缀；`.claude/commands/` 旧写法仍然可用。

souga，原来自定义命令就是一个写着待办清单的 markdown 文件。洛洛一开始以为要编程，看完只有一个感想：这我也会写！

## 个人命令

项目命令是给团队的，那些只有你自己会用的私货，放另一个地方。

个人命令放在 `~/.claude/commands/`，所有项目都能用：

```text
~/.claude/commands/daily.md
```

使用方式：

```text
/daily
```

个人命令适合自己的日报、总结、检查清单；团队流程应该放进项目级命令并提交到仓库。

> **洛洛碎碎念**
>
> 这条边界别搞混！！！
> 
>   洛洛干过一件蠢事：把团队要用的发布检查写在了 `~/.claude/commands/` 里，在自己电脑上跑得美滋滋，然后跟别人说"你也 `/user:deploy-check` 一下"。
> 
>   人家当然没有这个命令，因为它躺在我一个人的家目录里。
> 
>   团队要用的，就得进仓库。

## 与 Skills 的区别

最后解决一个洛洛纠结了很久的问题：这玩意儿跟 Skills 到底差在哪。

Slash command 是你主动输入的命令，适合固定流程。Skill 是 Claude 根据描述按需加载的能力包，适合领域知识、脚本、模板和参考资料。

如果你想"一句话触发部署检查"，用 slash command。如果你想"每次做 API 开发都自动加载接口规范"，用 Skill。

洛洛的土办法是问自己一句：这事儿是我想起来才要做，还是它该自己想起来？前者 `/`，后者 Skill。

## 收工

会按 `/`，会看 `/doctor`，会把自己的流程写成一个 md 文件，你已经比洛洛去年强多了。

不过命令能干的事越多，一个问题就越绕不开：它到底被允许动你电脑上的哪些东西？那就该看[权限模型](/tech/claude-code-advanced/claude-code-permissions)了。

洛洛先去睡了，明早还要早八，救命！

## 参考来源

查阅日期 2026-09-14。

* 命令参考：[https://code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands)
* Skills（含自定义命令）：[https://code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
* Code Review：[https://code.claude.com/docs/en/code-review](https://code.claude.com/docs/en/code-review)
