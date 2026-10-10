---
title: "实用技巧"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "CLAUDE.md 是你和 Claude 的”约定书”。写清楚项目规范，Claude 就会严格遵守："
tags: ["洛洛", "转载"]
---

这是 Claude Code 这个板块的最后一篇。

洛洛想把它写成那种"你都学完了，来，这些是散落在各处的糖"的感觉。前面十几篇每篇都在讲一个大块头，这篇不讲大块头，就十条小东西，每条看两眼就能用上。

有几条洛洛现在还在天天用，有几条是默子老师随口提过一次然后我偷偷记下来的。走。

## 1. 用好 CLAUDE.md

第一条也是最有用的一条，没有之一。

`CLAUDE.md` 是你和 Claude 的"约定书"。写清楚项目规范，Claude 就会严格遵守：

```markdown
- 总是用中文回复
- 使用 pnpm 不要用 npm
- 代码风格遵循 Biome 规范
- 不要自动提交 git
```

四行，就四行，能省掉你以后每次开场重复解释的那一大段。洛洛第一次写完这个文件之后，感觉像给它办了张工牌，它终于知道自己在哪家公司上班了。

## 2. 善用 /compact

上下文窗口是有限的。当对话变长后，用 `/compact` 压缩历史，Claude 会保留关键信息并释放空间。

聊太久它会变迟钝这件事洛洛太熟了。以前我的做法是关掉重开，然后从头解释一遍，蠢之。现在知道有这一招，早知道能省我多少口水。

## 3. 并行 Agent

Claude Code 可以启动子 Agent（subagent）并行处理任务。比如同时搜索多个文件、同时执行多个独立操作。

你不需要手动操作，Claude 会自动判断哪些任务可以并行。

"你不需要手动操作"——洛洛最爱这种句子。想看它到底怎么分裂的，[多 Agent 并行](/tech/claude-code-advanced/claude-code-multi-agent)那篇有全套。

## 4. 权限控制

这条不是技巧，是保命符。

Claude 执行命令前会请求你的许可。你可以设置自动允许：

* **全部允许**：适合信任的项目
* **逐个确认**：默认模式，推荐新手使用
* **只读模式**（Plan 模式）：Claude 只能读不能写

洛洛的建议：新手就老老实实用逐个确认，烦是烦，但每次弹窗都是一次"等一下，它要干啥"的机会。

## 5. Headless 模式

适合 CI/CD 或批量任务：

```bash
claude -p "检查所有 TODO 注释并生成报告" --output-format json
```

一行搞定，不用进会话界面。要玩大的看[Headless 与 CI/CD](/tech/claude-code-reference/claude-code-headless)。

## 6. 多模型切换

这条洛洛用得最勤，因为洛洛没有耐心。

Claude Code 的默认模型会随账号、订阅和官方版本变化。进入会话后可以用 `/model` 查看或切换当前模型。如果觉得输出太慢，用 `/fast` 开启快速模式——依然使用 Opus 模型，质量不变，只是生成更快、单价更高（订阅用户走 usage credits）。再输一次 `/fast` 就切回正常模式。

洛洛的分工是：改文案、调样式这种小事开 `/fast`，秒回，爽；真要它想清楚一个方案的时候就切回来，让它慢慢想。急事急办，大事慎办。

## 7. 图片理解

Claude Code 可以读取截图和图片：

```
看一下 screenshot.png，告诉我这个 UI 有什么问题
```

这条是设计选手的福音。洛洛经常反过来用：先画好稿，截图丢给它，让它照着实现。比洛洛用文字描述"这里再往左一点点"要靠谱一万倍。

## 8. Hooks

这条稍微硬一点，但收益超大：

在 `.claude/settings.json` 里配置 Hooks，让 Claude 在特定操作前后自动执行脚本。比如每次写完文件后自动格式化：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx biome format --write"
          }
        ]
      }
    ]
  }
}
```

被写入的文件路径要从 stdin 的 JSON 里取（`tool_input.file_path`），官方没有 `$CLAUDE_FILE_PATHS` 这种环境变量。

常用的事件还有 `PreToolUse`（工具调用前）、`Notification`（通知时）等，`matcher` 用来匹配具体的工具名。

洛洛看懂的部分是那个 `PostToolUse`：它写完文件之后自动帮你格式化一遍，你什么都不用管。想深入看[Hooks](/tech/claude-code-advanced/claude-code-hooks)那篇。

## 9. 记忆系统

Claude Code 有持久化记忆，跨对话记住你的偏好和项目信息：

* 自动记住你纠正过的行为
* 记住项目背景和目标
* 用 `/memory` 手动管理记忆

"自动记住你纠正过的行为"这句洛洛看了三遍。意思是同一个错你只需要骂它一次？souga，那洛洛以后骂人前得想清楚了，说出去的话它是真会记住的。

## 10. 快捷键

最后是记不住也没关系、但记住了会显得很熟练的一批：

| 快捷键         | 功能                     |
| ----------- | ---------------------- |
| `Ctrl+C`    | 中断当前操作；没在跑时清空输入，连按两次退出 |
| `Ctrl+D`    | 退出 Claude Code         |
| `Esc`       | 打断 Claude 当前回复，或关闭弹窗   |
| `↑`         | 回溯历史输入                 |
| `Shift+Tab` | 切换权限模式                 |

想自定义快捷键？编辑 `~/.claude/keybindings.json` 就可以绑定你喜欢的键位。

> **洛洛碎碎念**
>
> 这十条里洛洛用得最多的其实是 `Esc`。
> 
>   因为洛洛经常打了一半才发现自己想问的根本不是这个，或者发现它已经开始往错的方向狂奔了。这时候 `Esc` 就是急刹车。
> 
>   第二多的是 `↑`。上一条命令重跑一遍，比重新打一遍快多了。ddl 战士的时间都是抠出来的。

## 洛洛的总结

到这里 Claude Code 这一整个板块就走完了。

从[安装](/tech/claude-code-getting-started/claude-code-install)那晚的通宵，到现在能写出十条心得，洛洛自己都有点意外。中间那些参数、YAML、SDK 我到现在也没全搞懂，但有一件事我很确定：这东西不需要你先变成程序员才能用。它需要的是你愿意把想干的事说清楚。

如果你也是零基础翻到这里的，恭喜，你已经比洛洛当时强多了。剩下的就是去折腾了——反正大部分坑洛洛都替你先踩过一遍。

洛洛先去睡了，这个宿舍需要睡眠。

## 参考来源

查阅日期 2026-09-14。

* 交互模式与快捷键：[https://code.claude.com/docs/en/interactive-mode](https://code.claude.com/docs/en/interactive-mode)
* Fast 模式：[https://code.claude.com/docs/en/fast-mode](https://code.claude.com/docs/en/fast-mode)
* Hooks 入门指南：[https://code.claude.com/docs/en/hooks-guide](https://code.claude.com/docs/en/hooks-guide)
* 权限模式：[https://code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes)
