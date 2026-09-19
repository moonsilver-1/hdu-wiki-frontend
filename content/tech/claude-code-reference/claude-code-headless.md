---
title: "Headless 与 CI/CD"
date: "2026-09-20"
author: "洛洛"
excerpt: "先从最小的那一步开始：让 Claude Code 不进交互界面，直接吐个结果就走。"
tags: ["luoluo", "迁移"]
---

洛洛第一次往默子老师的仓库里提 PR，点完提交页面还没刷完，底下就冒出来一条代码审查评论，说得有理有据，还指出了我一个变量名写错。

我当时真的傻了。周末啊！谁在盯着我？

默子老师后来才告诉我：那不是人，那是 Claude Code 在 CI 里跑的。

哦哦哦哦。原来它还能不开终端、不需要人守着，自己把活干完再把结果贴出来。

这篇就是讲这个。洛洛先说实话：下面的 YAML 我大概看懂三成。所以每一节洛洛都会先说清楚这段东西能干嘛，代码你原样复制就行，一个字都不用改——本来也不该改。

## 基本用法

先从最小的那一步开始：让 Claude Code 不进交互界面，直接吐个结果就走。

Headless 模式适合把 Claude Code 放进脚本、CI 或批处理任务里运行。核心入口是 `-p` / `--print`：传入提示词，执行完成后输出结果并退出。

### 单次执行

```bash
claude -p "检查代码中的安全风险"
```

洛洛看懂的部分是：平时敲 `claude` 会进那个会话界面，加了 `-p` 就变成"问一句、答一句、结束"。像自动售货机，不聊天。

### JSON 输出

```bash
claude -p "分析项目依赖的安全性" --output-format json
```

JSON 适合被 CI、脚本或 GitHub Actions 解析。

也就是说，输出不是给人看的漂亮段落，是给别的程序吃的。这个洛洛能理解——机器和机器说话，讲人话反而麻烦。

### 流式 JSON

```bash
claude -p "修复所有 lint 错误" --output-format stream-json
```

长任务可以用流式输出记录进度。

## 权限控制

上面几条命令跑起来是很爽，但爽的东西通常都有代价，这一节就是代价。

自动化环境里不要默认放开所有权限。先写清楚允许的工具：

```bash
claude -p "跑测试并解释失败原因" \
  --permission-mode dontAsk \
  --allowedTools "Read,Glob,Grep,Bash(pnpm test)"
```

`dontAsk` 会拒绝未预先允许的工具，适合需要确定性的 CI。

洛洛看懂的部分是：`--allowedTools` 里那串东西就是"白名单"，写了的能用，没写的一律不许。因为 CI 里没人在旁边点"同意"，它只能自己按规矩来。

### 跳过权限检查

```bash
claude -p "修复 lint 错误" --dangerously-skip-permissions
```

这个选项只适合一次性容器、临时 worktree 或 VM。不要在日常开发主机上使用，也不要和真实生产凭证放在一起。

> **洛洛碎碎念**
>
> 这个参数名字里带 `dangerously`，洛洛第一次看到就没敢碰。
> 
>   默子老师的说法是："你要用它，就得先保证那台机器坏了你也不心疼。"
> 
>   洛洛的笔记本坏了我会哭的，所以这条我这辈子都不会在自己电脑上敲。

## GitHub Actions

来了，这就是那条把洛洛吓到的评论是怎么来的。

官方也提供现成的 `anthropics/claude-code-action`，在 Claude Code 里跑 `/install-github-app` 可以一键装好；下面是自己用 `claude -p` 拼的写法。

### 自动代码审查

```yaml
name: AI Code Review

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash
          echo "$HOME/.local/bin" >> "$GITHUB_PATH"

      - name: Review PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "审查这个 PR 的代码变更，关注安全性、性能和回归风险。" \
            --permission-mode dontAsk \
            --allowedTools "Read,Glob,Grep,Bash(git diff *)" \
            --output-format json > review.json

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('node:fs');
            const review = JSON.parse(fs.readFileSync('review.json', 'utf8'));
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: review.result || 'Claude Code did not return a review body.'
            });
```

这么长一坨，洛洛看懂的只有一条主线：有人提 PR → 装一下 Claude Code → 让它读 diff 写审查 → 把结果发成评论。中间那些 `uses:` 和 `steps:` 是 GitHub 自己的规矩，照抄就好。

souga，原来那条评论就是这么长出来的。

### 修复 Lint 并输出 diff

```yaml
name: AI Lint Assist

on:
  workflow_dispatch:

jobs:
  fix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash
          echo "$HOME/.local/bin" >> "$GITHUB_PATH"

      - name: Fix lint errors
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "运行 lint 检查，修复可自动修复的问题，最后输出 git diff 摘要。不要提交，不要推送。" \
            --allowedTools "Read,Glob,Grep,Edit,Write,Bash(pnpm lint),Bash(pnpm format),Bash(git diff *)" \
            --output-format json > result.json

      - name: Show diff
        run: git diff --stat && git diff --check
```

这种流程适合人工检查后再决定是否提交。自动 commit、自动 push、自动发布应该单独加审批门禁。

注意提示词里那句"不要提交，不要推送"。它改完只是给你看改了啥，最后按不按那个按钮还是人说了算。洛洛觉得这个安排很安心。

### 生成 Changelog

```yaml
- name: Generate Changelog Draft
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    claude -p "基于最近 20 个 commit 生成 CHANGELOG 草稿。" \
      --permission-mode dontAsk \
      --allowedTools "Read,Bash(git log *)" \
      --output-format json > changelog.json
```

## 批量处理

前面都是"有人推代码它就动"，这一节反过来——你手里有一大堆文件要处理，不想一个一个来。

### 多文件处理

```bash
for file in src/components/*.tsx; do
  claude -p "给 $file 补充必要的可访问性属性，并保持现有设计风格" \
    --allowedTools "Read,Edit,Write"
done
```

### 多项目分析

```bash
for dir in packages/*/; do
  claude -p "分析 $dir 的测试覆盖和主要风险，输出简短结论" \
    --permission-mode dontAsk \
    --allowedTools "Read,Glob,Grep,Bash(pnpm test *)" \
    --output-format json
done
```

`for` 洛洛认识！就是"每个都来一遍"。这个我真的看懂了，牛逼之。

## 与其他工具组合

### 管道输入

```bash
git diff HEAD~5 | claude -p "总结这些代码变更"
```

中间那根竖线是把前面那个命令的输出直接喂给后面。洛洛觉得这个设计很浪漫，前一个的结果就是后一个的粮食。

### 预提交检查

```bash
claude -p "检查暂存区代码是否有明显安全问题" \
  --permission-mode dontAsk \
  --allowedTools "Read,Bash(git diff --cached *)" \
  --output-format json
```

## 注意事项

这几条洛洛全看不懂原理，但每一条都能翻译成一句"别作死"，所以原样抄给你：

* CI 只注入当前任务必需的 secret
* 脚本和 CI 里官方推荐加 `--bare`，跳过本机 hooks、skills、MCP 和 CLAUDE.md 的自动加载（bare 模式不读订阅登录，要用 `ANTHROPIC_API_KEY`）
* `--allowedTools` 越窄越好
* 写入类任务优先输出 diff，不要直接发布
* 需要网络或外部系统时，把工具封装成 MCP 并单独授权
* 高风险任务放进隔离环境，不要复用日常开发目录

## 洛洛的总结

这一篇是洛洛写得最没底气的一篇，因为我到现在也不会自己搭一条 CI。

但那条深夜自动出现的审查评论我一直记得。它的意思是：这东西不一定要有人陪着才干活，你睡觉的时候它也可以在跑。对一个通宵成瘾的选手来说，这个诱惑太大了。

接下来那篇[多 Agent 并行](/tech/claude-code-advanced/claude-code-multi-agent)更夸张——它不只是自己干活，还能把自己复制成好几个一起干。

洛洛先去睡了，让流水线替我熬夜。

## 参考来源

查阅日期 2026-09-14。

* 以编程方式运行 Claude Code：[https://code.claude.com/docs/en/headless](https://code.claude.com/docs/en/headless)
* CLI 参数参考：[https://code.claude.com/docs/en/cli-reference](https://code.claude.com/docs/en/cli-reference)
* GitHub Actions：[https://code.claude.com/docs/en/github-actions](https://code.claude.com/docs/en/github-actions)
