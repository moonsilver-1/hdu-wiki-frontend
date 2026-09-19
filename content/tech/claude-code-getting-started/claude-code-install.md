---
title: "安装配置"
date: "2026-09-20"
author: "洛洛"
excerpt: "* macOS、Linux 或 Windows（原生 Windows 或 WSL 都行）"
tags: ["luoluo", "迁移"]
---

hihi！洛洛来了！

这篇讲怎么把 Claude Code 装到你电脑上。听起来很简单对吧？洛洛当时也这么以为。

结果是凌晨三点，一个人对着终端，命令找不到，重装，还是找不到，再重装，终端开始骂我。最后厚着脸皮去戳默子老师，他就回了一句："你 npm 和官方安装器混着装了。"

菜之。

所以下面每一步都是洛洛用眼泪换来的，你照着做，十分钟搞定，不用通宵。真的。

## 前提条件

先检查一下自己有没有这三样东西：

* macOS、Linux 或 Windows（原生 Windows 或 WSL 都行）
* 一个 **Anthropic API Key**（Console 账号），或 Claude Pro / Max / Team / Enterprise 订阅（免费版不含 Claude Code）
* 如果走 npm 安装，需要 **Node.js 22+**（官方从 v2.1.198 起的要求）

> **洛洛碎碎念**
>
> Windows 的朋友！！！是 WSL！！！不是直接在 PowerShell 里跑！！！
> 
>   洛洛室友在这里卡了一整晚，第二天顶着黑眼圈问我为什么。怪微软。

截至 2026-09-14 官方文档已改为：Windows 10 1809+ 也可以原生安装，在 PowerShell 里跑 `irm https://claude.ai/install.ps1 | iex`；WSL 仍然支持，需要沙盒功能的话选 WSL 2。

## 安装

官方现在推荐的是 native installer，一行命令，连 Node 都不用先装，洛洛这种零基础选手看到都感动了：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

跑完之后把终端关了重开（或者按它提示的刷新 shell），然后敲：

```bash
claude
```

能跳出来东西就成了！天哪！这么快！

### npm 安装（可选）

如果你本来就是 Node 玩家，环境已经配好了，那走 npm 也行：

```bash
npm install -g @anthropic-ai/claude-code
```

**但是！！！二选一！！！不要两个都装！！！**

洛洛就是两个都装了，两个版本在电脑里打架，命令时灵时不灵，我还以为是电脑坏了。如果你也手快装了两遍，先看看现在这个 `claude` 到底是哪来的：

```bash
which claude
```

搞清楚之后把另一个删掉，世界就清净了。

## 登录方式

装好了只是让它住进你电脑，接下来得让它认识你是谁。两种方式，洛洛用的是第一种，因为第二种要碰 API Key，洛洛怕。

### 方式一：Claude 订阅（推荐）

有 Claude Pro 或 Max 订阅的，直接敲 `claude`，它会弹浏览器让你点一下授权，完事。不用碰任何 Key。

```bash
claude
## 首次运行会弹出浏览器让你授权
```

美丽之。

### 方式二：API Key

没订阅但有 API Key 的，把 Key 塞进环境变量：

```bash
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
claude
```

嫌每次都要 export 麻烦的话，写进 `~/.zshrc` 或 `~/.bashrc` 里，以后开终端自动带上。

> **洛洛碎碎念**
>
> API Key 不要发群里！不要截图！不要贴到任何公开的地方！
> 
>   洛洛不懂后端，但这条默子老师强调了三遍。默子老师强调三遍的东西，那肯定是会出大事的东西。

## 验证安装

```bash
claude --version
```

看到一串版本号，就说明它真的活了。洛洛第一次看到那串数字的时候，差点在宿舍喊出声。

## 更新

Claude Code 更新特别勤快，隔几天就一个新版本，洛洛都跟不上。native installer 装的会在后台自动更新，想马上更新就一句话：

```bash
claude update
```

npm 装的就用 npm 更新（对，还是不要混）：

```bash
npm install -g @anthropic-ai/claude-code@latest
```

## CLAUDE.md 配置文件

到这里其实已经能用了！你可以先关掉这篇去玩一会儿。

但是玩一会儿你就会发现一个问题：每次打开它都得重新解释一遍"这个项目是干嘛的、用什么包管理器、代码放哪"，烦死了。

解决办法就是在项目根目录放一个 `CLAUDE.md`，把这些话一次性写进去：

```markdown
## 项目说明
- 这是一个 Next.js 项目
- 使用 pnpm 作为包管理器
- 测试用 vitest 运行

## 规范
- 使用中文注释
- 组件放在 src/components/ 目录下
```

之后它每次启动都会自己先读一遍这个文件，souga，原来它是这样记住项目的。

## 搞定！

洛洛折腾了一整晚的事，你现在应该已经做完了。牛逼之。

接下来去看[基础用法](/tech/claude-code-getting-started/claude-code-basic-usage)，那才是真正好玩的部分。安装只是开门，门后面才是默子老师说的"vibe coding"。

洛洛先去睡了，这个宿舍需要睡眠。

## 参考来源

查阅日期 2026-09-14。

* 安装与系统要求：[https://code.claude.com/docs/en/setup](https://code.claude.com/docs/en/setup)
* 登录与认证：[https://code.claude.com/docs/en/authentication](https://code.claude.com/docs/en/authentication)
* 安装与登录排障：[https://code.claude.com/docs/en/troubleshoot-install](https://code.claude.com/docs/en/troubleshoot-install)
