---
title: "MCP 服务器"
date: "2026-09-20"
author: "洛洛"
excerpt: "先别急着配，先看看你到底需不需要。洛洛前两次翻车，多少也有”根本不需要还硬要配”的成分。"
tags: ["luoluo", "迁移"]
---

好，这篇是洛洛的老大难。

洛洛的 Claude Code 装好很久了，基础用法也摸熟了，唯独 MCP 这一块，从去年拖到今年，配了三次，三次都没配好。

第一次卡在命令找不到，第二次跑起来了但工具一个都不显示，第三次终于连上了，结果第二天重开电脑又断了。

后来去问默子老师，他看了两眼说："你的 server 命令自己在终端里都启动不了，Claude Code 怎么帮你启动。"

……哦哦。

所以这篇洛洛会把每个坑标出来，你别走洛洛的老路。

**MCP（Model Context Protocol）** 是让 Claude Code 连接外部工具和数据源的协议。它可以把数据库、浏览器、GitHub、内部系统或本地脚本暴露成 Claude 可调用的工具。

## 什么时候需要 MCP

先别急着配，先看看你到底需不需要。洛洛前两次翻车，多少也有"根本不需要还硬要配"的成分。

适合 MCP 的场景：

* 查询数据库、日志、监控系统
* 操作 GitHub Issue、PR、项目面板
* 读取设计稿、浏览器页面、内部 API
* 连接团队已有的自动化脚本
* 给 Claude 提供受控的业务工具，而不是放开整台机器

不适合 MCP 的场景：

* 一次性 shell 命令
* 简单读写项目文件
* 只需要固定上下文的项目规范

这些更适合用 Bash、Hooks 或 `CLAUDE.md`。

洛洛的白话版：MCP 是给 Claude 开一扇通向外部系统的门。你只是想让它读读本地文件、记住项目规范，那不用开门，它本来就在屋里。

## 添加 MCP Server

确认真的需要了，开始配。

推荐用 Claude Code 自带命令添加，而不是手写配置文件。MCP 配置不在 `settings.json` 里，而是存在 `~/.claude.json`（local / user 作用域）或项目根目录的 `.mcp.json`（project 作用域）。

这句话洛洛要划重点。洛洛第二次翻车就是手写的，字段名拼错了自己还看不出来，界面上什么报错都没有，工具就是不出现。用命令加，它至少会当场骂你。

### Stdio server

```bash
claude mcp add --transport stdio filesystem -- \
  npx -y @modelcontextprotocol/server-filesystem /path/to/dir
```

这类 server 在本地以子进程运行，适合文件系统、SQLite、本地脚本等工具。

"以子进程运行"洛洛去查了一下，意思是这个 server 是 Claude Code 自己在你电脑上拉起来的一个小程序，它俩通过管道说话。souga，那它要是自己都启动不了，当然就连不上。

### JSON 配置

如果 server 文档给的是 JSON，可以用 `add-json`：

```bash
claude mcp add-json local-tools '{
  "type": "stdio",
  "command": "node",
  "args": ["./scripts/mcp-server.js"],
  "env": {
    "INTERNAL_API_TOKEN": "${INTERNAL_API_TOKEN}"
  }
}'
```

不要把真实 token 写进 JSON。配置里只引用环境变量，值在本机、CI 或部署平台的 secret manager 里提供。

> **洛洛碎碎念**
>
> 看到 `${INTERNAL_API_TOKEN}` 这种写法了吗！它是一个占位符！不是让你把真 token 填进去！
> 
>   洛洛不懂后端，但这条默子老师强调过：配置文件是会被提交、被截图、被贴进群里的，真钥匙一次都不能进去。
> 
>   照抄这段的时候，`${...}` 原样保留就对了，值另外放环境变量里。

### 团队共享

项目级 MCP 建议放在仓库根目录的 `.mcp.json`（`claude mcp add --scope project` 会自动写进去），方便团队共享 server 定义：

```json
{
  "mcpServers": {
    "local-tools": {
      "type": "stdio",
      "command": "node",
      "args": ["./scripts/mcp-server.js"],
      "env": {
        "INTERNAL_API_TOKEN": "${INTERNAL_API_TOKEN}"
      }
    }
  }
}
```

`.mcp.json` 可以提交，但真实密钥、个人路径和本机专属配置不要提交。

"个人路径"这条洛洛替你踩过：洛洛把自己电脑上那种带用户名的绝对路径写进去，结果同学拉下来跑不了，一脸问号来问洛洛。菜之。

## 查看连接状态

配完了怎么知道成没成？这一步千万别跳，洛洛第三次就是靠它才发现连接已经断了。

在 Claude Code 中运行：

```text
/mcp
```

这里可以查看已连接的 server、可用工具和认证状态。遇到连接失败时，先确认：

* server 命令能否在终端里独立启动
* 依赖是否安装
* 环境变量是否存在
* 当前工作目录是否正确
* Claude Code 是否能访问该路径或网络地址

这五条就是默子老师那句话的展开版。**第一条最重要！！！先把 server 命令原样复制到终端里手动跑一遍！！！** 能跑起来再回来接 Claude Code。洛洛前两次全是跳过这一步，直接对着 Claude Code 干瞪眼，白熬两个通宵。

## 权限控制

连上之后还有一件事：这些新工具能干什么，得由你说了算。

MCP 工具也进入 Claude Code 的权限系统。可以用工具名做 allow/deny：

```json
{
  "permissions": {
    "allow": ["mcp__github__get_issue"],
    "ask": ["mcp__github__create_pull_request"],
    "deny": ["mcp__github__delete_repository"]
  }
}
```

命名通常形如 `mcp__serverName__toolName`。真实名字以 `/mcp` 展示和权限弹窗为准。

看这三行洛洛就懂了：查 issue 随便查，开 PR 先问一下，删仓库想都别想。这个分级洛洛觉得非常合理，删仓库那条洛洛想把它刻在墙上。

## 实战建议

* 先用只读工具接入，确认输出稳定后再开放写入工具
* 给写入工具加更窄的权限规则或 `PreToolUse` Hook
* 不在配置文件里提交 token、cookie、数据库密码
* 团队共享 `.mcp.json`，个人 secret 放环境变量
* 对生产系统默认 `ask`，不要默认 `allow`

MCP 的价值不是"让 Claude 什么都能做"，而是把外部能力包装成可审计、可授权、可回滚的工具。

## 洛洛终于配好了

写这篇的时候洛洛第四次配，一次过。

秘诀真的就是那句"先在终端里手动跑一遍"。洛洛之前拖了半年配不好，不是因为 MCP 难，是因为洛洛一直在错误的地方找原因。

想更深入折腾自己的工具，往下就是[Agent SDK](/tech/claude-code-reference/claude-code-agent-sdk)，那个是给真正会写代码的人玩的，洛洛围观就好。

洛洛先去截图发朋友圈，配好 MCP 这件事值得炫耀一下。

## 参考来源

查阅日期 2026-09-14。

* 通过 MCP 连接工具：[https://code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)
* MCP 快速上手：[https://code.claude.com/docs/en/mcp-quickstart](https://code.claude.com/docs/en/mcp-quickstart)
* 权限配置：[https://code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions)
