---
title: "Skills 与 Plugins"
date: "2026-09-20"
author: "洛洛"
excerpt: "SKILL.md            # 必需"
tags: ["luoluo", "迁移"]
---

**Skill** 是一份带说明的可复用工作流：一个目录，里面一份 `SKILL.md`，加上可选的脚本和参考资料。Codex 会根据描述自动挑选合适的 Skill，你也可以用 `$` 显式点名。

**Plugin** 是分发单元：把 Skills、MCP server、Hooks、连接器、定时任务模板打成一个包安装。一句话：Skills 是创作格式，Plugins 是安装格式。

## Skill 长什么样

```
my-skill/
  SKILL.md            # 必需
  scripts/            # 可选
  references/         # 可选
  assets/             # 可选
  agents/openai.yaml  # 可选：显示名、图标、调用策略、依赖
```

最小的 `SKILL.md`：

```md
---
name: release-notes
description: 根据 git log 生成中文发布说明。用户提到"发布说明""changelog""版本更新"时触发；不要用于 commit message。
---

1. 运行 `git log <上个 tag>..HEAD --oneline`
2. 按 功能 / 修复 / 破坏性变更 分组
3. 输出 Markdown，每条一句话，面向用户而不是开发者
```

`description` 是触发的关键：写清楚**什么时候用、什么时候不用**。

## 放在哪里

| 范围  | 路径                                                         |
| --- | ---------------------------------------------------------- |
| 仓库  | `/.agents/skills/`（当前目录及各级父目录的 `.agents/skills` 也会扫） |
| 个人  | `~/.agents/skills/`                                        |
| 管理员 | `/etc/codex/skills/`                                       |
| 内置  | Codex 自带（`skill-creator`、`plan` 等）                         |

注意路径是 **`.agents/skills`**，不是很多旧教程写的 `~/.codex/skills`——旧路径仍兼容但已标记废弃。

## 怎么触发

* 显式：输入 `$release-notes ...`，或 `/skills` 打开列表选
* 隐式：Codex 根据 `description` 自动匹配
* 关闭某个 Skill 的自动触发：在 `agents/openai.yaml` 里 `policy.allow_implicit_invocation: false`

Skill 清单最多占模型上下文的 2%（未知时按 8000 字符算），超了先压缩描述、再省略部分技能。所以 `description` 要短而准。

## 单独开关

```toml
[[skills.config]]
path = "/Users/me/.agents/skills/noisy-skill/SKILL.md"
enabled = false
```

## 创建与安装

Codex 内置了两个"元技能"：

```
$skill-creator 帮我把刚才这套发布流程做成 skill
$skill-installer linear
```

还有 **Record & Replay**（2026-06 起）：你演示一遍操作，Codex 自动生成 Skill。

官方技能仓库：[https://github.com/openai/skills](https://github.com/openai/skills) ；跨工具规范：[https://agentskills.io](https://agentskills.io)

## `agents/openai.yaml`

```yaml
interface:
  display_name: "发布说明"
  short_description: "从 git log 生成 changelog"
  default_prompt: "生成上个版本以来的发布说明"
policy:
  allow_implicit_invocation: true
dependencies:
  tools:
    - type: "mcp"
      value: "github"
      transport: "streamable_http"
      url: "https://api.githubcopilot.com/mcp/"
```

## Skill 写作原则

* 一个 Skill 只做一件事，输入输出说清楚
* 先手工把流程跑稳，再固化成 Skill
* 脚本放 `scripts/`，`SKILL.md` 只写决策与步骤，别贴长代码
* Skill 定义"怎么做"，定时任务定义"何时做"，两者分开

## 自定义 prompt 已废弃

旧的 `~/.codex/prompts/*.md`（用 `/prompts:name` 调用）已经标记废弃，官方要求迁到 Skills。迁移很简单：把 prompt 正文放进 `SKILL.md`，把触发条件写进 `description`。

## Plugins

```bash
codex plugin add 
codex plugin list
codex plugin remove 
codex plugin marketplace add owner/repo        # 添加插件市场
codex plugin marketplace list | upgrade | remove
```

交互界面里 `/plugins` 打开浏览器，空格键切换启用。安装后需要**新开会话**才生效。

2026-03 起 OpenAI 上线了 Slack、Figma、Notion、Gmail、Google Drive 等 20 多个官方插件，到 2026-04 已经有 90 多个。插件在 CLI、桌面 App、ChatGPT 网页/手机端通用，但 **IDE 扩展目前不支持插件**。

企业可以在 `requirements.toml` 里用 `[marketplaces]` 白名单锁定允许的插件来源。

## 参考来源

* 构建 Skills：[https://learn.chatgpt.com/docs/build-skills](https://learn.chatgpt.com/docs/build-skills)
* 定制总览：[https://learn.chatgpt.com/docs/customization/overview](https://learn.chatgpt.com/docs/customization/overview)
* 自定义 prompt（已废弃）：[https://learn.chatgpt.com/docs/custom-prompts](https://learn.chatgpt.com/docs/custom-prompts)
* Plugins：[https://learn.chatgpt.com/docs/plugins](https://learn.chatgpt.com/docs/plugins)
* Record & Replay：[https://learn.chatgpt.com/docs/extend/record-and-replay](https://learn.chatgpt.com/docs/extend/record-and-replay)
* Skill 路径源码：[https://github.com/openai/codex/blob/main/codex-rs/ext/skills/src/host\_roots.rs](https://github.com/openai/codex/blob/main/codex-rs/ext/skills/src/host_roots.rs)
