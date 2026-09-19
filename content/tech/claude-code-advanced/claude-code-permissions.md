---
title: "权限模型"
date: "2026-09-20"
author: "洛洛"
excerpt: "先说最实在的一层：把”什么能干、什么得先问我、什么想都别想”写成配置。"
tags: ["luoluo", "迁移"]
---

洛洛要先讲一个让我后背发凉的晚上。

那天赶设计稿的配套页面，弹窗一直在问我"要不要允许"，我烦了，一路狂点同意。然后它开始很勤快地帮我"清理无用文件"。

它清得很对，逻辑上完全没问题。问题是里面有我改了一整晚、还没提交的东西。

那一刻洛洛终于懂了默子老师的话：**它不是不听你的，它是太听你的了。**

所以这篇不是讲怎么关掉弹窗，是讲怎么让弹窗只在真正该响的时候响。

Claude Code 在调用工具前会经过权限系统。理解这套机制，重点不是背某个版本的弹窗文案，而是知道三件事：

* **工具权限**：哪些工具能用，哪些命令或路径必须先问你
* **权限模式**：默认模式、计划模式、自动模式等会改变审批策略
* **安全边界**：显式拒绝规则、受保护路径、沙盒和企业策略会继续生效

## 权限规则

先说最实在的一层：把"什么能干、什么得先问我、什么想都别想"写成配置。

在 `settings.json` 中可以用 `permissions.allow`、`permissions.ask`、`permissions.deny` 精细控制工具权限。

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(pnpm test)",
      "Bash(pnpm build)"
    ],
    "ask": ["Bash(git push *)"],
    "deny": ["Read(.env)", "Bash(rm -rf *)"]
  }
}
```

规则按安全优先级处理：`deny` 高于 `ask`，`ask` 高于 `allow`。也就是说，一个宽泛的拒绝规则不会被更窄的允许规则绕过。

这条洛洛觉得设计得特别贴心。意思就是：你写下的"禁止"，不会被你后来手快写的"允许"偷偷抵消掉。souga，原来安全就得这么排序。

### 规则语法

* `"Bash(pnpm test)"`：只匹配这个命令
* `"Bash(pnpm *)"`：匹配 `pnpm` 前缀命令
* `"Read(.env)"`：阻止读取当前目录及子目录里的 `.env`
* `"Edit(/src/**/*.ts)"`：匹配项目根目录下的 TypeScript 文件
* `"mcp__github__*"`：匹配某个 MCP server 暴露的工具

Bash 规则会理解常见的 shell 分隔符和子命令。比如只允许 `Bash(git status)`，并不等于允许 `git status && git push`。

**这一句请读两遍！！！** 洛洛本来以为放开一个命令就是放开"以它开头的一整串"，还挺得意地觉得自己找到了偷懒办法。结果它比洛洛严谨得多，把分号、`&&` 后面藏的东西都当成另一件事来看。

## 权限模式

规则是你一条条写死的，模式是整体气氛——你今天想让它多大胆。

| 模式                  | 行为                  | 适用场景         |
| ------------------- | ------------------- | ------------ |
| `default`           | 标准模式，首次使用需要审批的工具会询问 | 入门使用、敏感项目    |
| `acceptEdits`       | 自动接受文件编辑和常见工作区文件操作  | 日常编码迭代       |
| `plan`              | 读取文件和运行只读命令，不编辑源码   | 代码探索、重构规划    |
| `auto`              | 在后台安全检查下自动批准更多工具调用  | 长时间任务、减少频繁确认 |
| `dontAsk`           | 未预先允许的工具自动拒绝        | CI、脚本化、确定性流程 |
| `bypassPermissions` | 跳过大多数权限提示           | 仅限隔离容器或 VM   |

截至 2026-09-14：`default` 在 CLI 界面里显示为 Manual（配置里也接受 `manual` 别名）；Pro、Max、Team 套餐新开交互会话的内置起始模式已经是 `auto`，`claude -p` 仍从 Manual 起步。

`auto` 仍是偏激进的模式，适合你已经能接受自动化执行风险的环境。`bypassPermissions` 更进一步，不适合日常开发主机；如果要用，最好放在一次性容器、临时 worktree 或 VM 里。

洛洛自己的用法很没出息但很安全：看不懂的项目先用 `plan`，让它只看不动；自己写的小页面用 `acceptEdits`，省点点击。最后那个 `bypassPermissions`，洛洛这辈子还没在自己电脑上开过。

> **洛洛碎碎念**
>
> 那晚被清掉的文件，最后是靠默子老师捞回来一部分的。
> 
>   他没骂我，只说了一句："权限弹窗是给你思考的时间，不是给你点的。"
> 
>   害怕之。现在洛洛每次看到弹窗都会先把那行命令读完，读完再点。多花两秒，比重写一晚划算太多。

## 切换权限模式

知道有哪几档之后，接下来是怎么换档。三种换法，按你多懒来挑。

### 快捷键

在交互模式中按 `Shift+Tab` 可以在常用模式之间切换。具体循环顺序会随版本和配置变化，以终端底部显示为准。

如果你想让 `bypassPermissions` 出现在快捷键循环里，需要显式允许。

洛洛觉得这个设计很懂人性：最危险的那一档，默认藏起来不给你手滑。

### 启动时指定

```bash
claude --permission-mode acceptEdits
```

也可以在 CI 或脚本里使用更严格的 `dontAsk`：

```bash
claude -p "检查这次 diff 是否有安全问题" \
  --permission-mode dontAsk \
  --allowedTools "Read,Grep,Glob,Bash(git diff *)"
```

洛洛看这段看了半天才反应过来：脚本里没有人守着点弹窗，所以这里的严格反而是必需的——没批准过的一律拒绝，宁可任务失败也不乱动东西。

### 设为默认

在 `~/.claude/settings.json` 或项目的 `.claude/settings.json` 中配置：

```json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  }
}
```

## Hooks 与权限

写死的规则管得住"稳定的事"，可是项目里总有些"看情况"的事。这时候上 Hook。

`PreToolUse` Hook 可以参与权限决策，比如拒绝危险命令、要求人工确认、给工具输入加额外校验。

权限规则适合表达稳定边界；Hook 适合表达项目里的动态逻辑，例如：

* 阻止向生产数据库执行写入 SQL
* 阻止编辑 `.env`、证书、私钥
* 在写文件后自动运行格式化，但失败时提醒你

洛洛的理解是：规则像门禁卡，Hook 像门口那个会拦下你问一句"你确定要拿这个进去吗"的保安。

## 受保护路径与沙盒

最后一层是它自带的保险，不用你配。

Claude Code 会对关键路径、凭证文件、配置文件和 destructive shell 命令施加额外保护。具体规则会随版本、企业管理策略和沙盒配置变化，但下面这些区域应该默认当成高风险：

* `.git/`
* `.claude/`
* `.ssh/`
* shell 启动文件，如 `.zshrc`、`.bashrc`
* IDE、hook、容器和包管理器配置目录
* 密钥、令牌、生产配置、数据库连接串

洛洛不懂这些目录里具体装了什么，但记住了一个笨办法：名字里带点、看着像系统自己的东西，一律不碰。

如果你需要让 Claude 在更大范围内操作，优先用沙盒、临时目录或独立 worktree 隔离风险，而不是简单把权限模式调到最宽。

## 说完了

这篇是洛洛写得最认真的一篇，因为它是唯一一篇"学不会真的会哭"的。

弹窗不是麻烦，是安全带。你可以把它调松，但请知道自己在调什么。

下一篇轻松一点——去看[CLAUDE.md 最佳实践](/tech/claude-code-advanced/claude-code-claude-md)，学会一次性把项目规矩讲清楚，以后少解释一百遍。

洛洛先去睡了，这个宿舍需要睡眠。

## 参考来源

查阅日期 2026-09-14。

* 权限配置：[https://code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions)
* 权限模式：[https://code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes)
* Bash 沙盒：[https://code.claude.com/docs/en/sandboxing](https://code.claude.com/docs/en/sandboxing)
