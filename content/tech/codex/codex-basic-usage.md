---
title: "基础用法"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "进入交互界面（TUI）后，直接用自然语言描述任务。也可以把第一条指令带在命令行上："
tags: ["洛洛", "转载"]
---

## 启动

在项目目录下运行：

```bash
codex
```

进入交互界面（TUI）后，直接用自然语言描述任务。也可以把第一条指令带在命令行上：

```bash
codex "把 src/utils 里的重复代码抽成公共函数，并补上单元测试"
```

## 常见用法

### 写代码

```
帮我写一个用户登录的 API，用 Express + JWT，测试用 Vitest
```

Codex 会读项目、创建文件、跑测试。改动在工作区内不需要逐条批准，越界操作（联网、写工作区外的文件）才会问你。

### 改 Bug

```
跑一下 pnpm test，把挂掉的用例修好，改动尽量小
```

### 理解代码

```
解释一下 src/lib/search.ts 是怎么和 /api/chat 共享索引的
```

### 重构

```
把 src/components 下所有 class 组件改成函数组件，保持行为不变
```

### 执行命令

```
看看 git log 最近 10 条，总结一下这周做了什么
```

## 引用文件与运行 shell

* 输入 `@` 会弹出工作区文件搜索，选中后把路径插入 prompt。CLI 不像 IDE 扩展那样自动带上"当前打开的文件"，所以要主动 `@` 或写全路径
* 以 `!` 开头的输入会在当前沙箱和审批策略下直接执行 shell 命令，比如 `!git status`
* 任务运行中输入新指令后按 `Tab`，会排队到下一轮执行；直接 `Enter` 则立即插入
* `Esc` 中断当前回合；空输入框连按两次 `Esc` 可以回去编辑上一条消息并从那里分叉

## 图片输入

```bash
codex -i screenshot.png "解释这个报错并给出最小修复"
codex --image before.png,after.png "对比这两张截图，列出回归"
```

在交互界面里也可以直接粘贴图片。

## 单次任务模式

不进入交互界面，跑完就退出：

```bash
codex exec "总结这个仓库的目录结构，列出 5 个最有风险的模块"
```

`codex exec` 默认是**只读沙箱**，要让它改文件必须显式加 `--sandbox workspace-write`。它把进度写到 stderr、只把最终回答写到 stdout，天然适合管道：

```bash
pnpm test 2>&1 | codex exec "总结失败的测试并给出最小修复方案"
```

更多用法见 [非交互模式与 CI](/tech/codex/codex-exec-ci)。

## 继续上次对话

```bash
codex resume            # 弹出会话选择器（默认只列当前目录的）
codex resume --last     # 直接续最近一个
codex resume --all      # 跨目录列出
codex fork --last       # 从上次会话分叉出新会话，原记录不动
```

交互界面里对应 `/resume`、`/fork`、`/new`。

## 切换模型与推理强度

```bash
codex -m gpt-5.6-terra
```

交互界面里用 `/model` 选择模型和推理强度（reasoning effort），`Alt+,` / `Alt+.` 直接降/升一档。当前默认是 `gpt-5.6-sol` + medium。模型细节见 [订阅、用量与价格](/tech/codex/codex-plans-pricing)。

## 联网搜索

默认不联网。需要查文档、查最新报错时：

```bash
codex --search "查一下 Next.js 16 的 proxy.ts 怎么替代 middleware.ts"
```

或在 `config.toml` 里设 `web_search = "live"`。

## 一次好的任务描述长什么样

官方最佳实践把 prompt 拆成四要素：**目标、上下文、约束、完成标准**。

```
目标：给 /api/chat 加上请求限流
上下文：Next.js 16，路由在 src/app/api/chat/route.ts，部署在 Vercel
约束：不要引入 Redis，只用内存计数；不要改动前端
完成标准：pnpm lint 和 pnpm types:check 通过，并写一段说明限制策略的注释
```

写清完成标准比写长篇背景更有用，因为 Codex 会自己去读代码补上下文。

## 参考来源

* CLI 总览：[https://learn.chatgpt.com/docs/codex/cli](https://learn.chatgpt.com/docs/codex/cli)
* 命令与快捷键参考：[https://learn.chatgpt.com/docs/developer-commands?surface=cli](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
* 图片输入：[https://learn.chatgpt.com/docs/image-inputs?surface=cli](https://learn.chatgpt.com/docs/image-inputs?surface=cli)
* Prompt 写法：[https://learn.chatgpt.com/docs/prompting](https://learn.chatgpt.com/docs/prompting)
