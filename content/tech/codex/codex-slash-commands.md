---
title: "斜杠命令与快捷键"
date: "2026-09-20"
author: "洛洛"
excerpt: "/theme、/statusline、/title、/keymap、/vim、/raw、/ide、/pets。"
tags: ["luoluo", "迁移"]
---

交互界面里以 `/` 开头的是斜杠命令。任务运行中输入斜杠命令后按 `Tab` 可以排队到下一轮。

## 会话与上下文

| 命令                                 | 作用                                 |
| ---------------------------------- | ---------------------------------- |
| `/new`                             | 在当前窗口开新会话（不清屏）                     |
| `/clear`                           | 清屏并开新会话，可带名字：`/clear release prep` |
| `/resume`                          | 恢复历史会话                             |
| `/fork`                            | 把当前会话分叉成新会话                        |
| `/side`（别名 `/btw`）                 | 开一个临时侧聊，不污染主线上下文                   |
| `/rename` / `/archive` / `/delete` | 会话改名、归档、删除                         |
| `/compact`                         | 手动压缩历史，释放上下文                       |
| `/status`                          | 当前模型、审批策略、可写目录、剩余上下文               |
| `/usage`                           | 用量与额度                              |
| `/diff`                            | 查看本会话的改动                           |
| `/copy`                            | 复制最近一条回复                           |
| `/mention`                         | 引用文件到 prompt                       |
| `/init`                            | 生成 `AGENTS.md` 脚手架                 |
| `/quit` / `/exit`                  | 退出                                 |

## 模型与行为

| 命令             | 作用                                                    |
| -------------- | ----------------------------------------------------- |
| `/model`       | 选择模型与推理强度                                             |
| `/fast`        | 切换 Fast 服务档（模型不支持时不显示）                                |
| `/plan`        | 进入计划模式，可带 prompt：`/plan 重构鉴权模块`                       |
| `/goal`        | 设置持久目标：`/goal set/edit/pause/resume/clear`，上限 4000 字符 |
| `/personality` | `friendly` / `pragmatic` / `none`                     |
| `/memories`    | 管理记忆（实验特性）                                            |
| `/skills`      | 浏览与调用 Skills                                          |
| `/review`      | 代码审查（见 [代码审查](/tech/codex/codex-review)）                    |

## 权限与安全

| 命令              | 作用                                                                   |
| --------------- | -------------------------------------------------------------------- |
| `/permissions`  | 切换 Read Only / Ask for approval / Full Access（旧的 `/approvals` 已被它取代） |
| `/approve`      | 重试一次被自动审查拒绝的动作                                                       |
| `/hooks`        | 查看、信任 Hooks                                                          |
| `/experimental` | 开关实验特性                                                               |

## 扩展

| 命令                        | 作用                                            |
| ------------------------- | --------------------------------------------- |
| `/mcp`                    | 查看已连接的 MCP server，`/mcp verbose` 看诊断          |
| `/apps`                   | 连接器（Apps），插入为 `$app-slug`                     |
| `/plugins`                | 浏览与启用插件                                       |
| `/agent`（别名 `/subagents`） | 子代理面板                                         |
| `/import`                 | 从 Claude Code / Cursor 导入配置与会话（近 30 天最多 50 个） |

## 终端与外观

`/theme`、`/statusline`、`/title`、`/keymap`、`/vim`、`/raw`、`/ide`、`/pets`。

## 进程与调试

`/ps`（后台进程）、`/stop`（别名 `/clean`）、`/debug-config`、`/feedback`、`/logout`。

Windows 专属：`/setup-default-sandbox`（降级沙箱时引导管理员配置）、`/sandbox-add-read-dir <绝对路径>`。

## 键盘快捷键

| 按键                  | 动作                            |
| ------------------- | ----------------------------- |
| `Esc`               | 中断当前回合；空输入框连按两次 = 编辑上一条并从那里分叉 |
| `Enter`             | 发送                            |
| `Tab`               | 运行中排队下一轮的输入                   |
| `?`                 | 展开/收起快捷键提示                    |
| `Ctrl+T`            | 打开完整记录（transcript）            |
| `Ctrl+G`            | 用 `$EDITOR` 写长 prompt         |
| `Ctrl+O`            | 复制最近一条回复                      |
| `Ctrl+L`            | 只清屏，不动会话                      |
| `Ctrl+/`            | 切换侧聊                          |
| `Ctrl+R` / `Ctrl+S` | 搜索 prompt 历史                  |
| `Alt+A`             | 打开子代理面板                       |
| `Alt+,` / `Alt+.`   | 降低 / 提高推理强度                   |
| `Alt+R`             | 切换原始滚动输出                      |
| `↑` / `↓`           | 恢复草稿历史                        |
| `Ctrl+C`            | 退出                            |

输入前缀：`@` 搜索文件、`!` 直接跑 shell、`$` 提及 Skill 或 App。

键位可以用 `/keymap` 改，会持久化到 `config.toml` 的 `[tui.keymap]`。

## 命令行子命令速查

```bash
codex                  # 交互模式
codex exec / codex e   # 非交互
codex resume / fork    # 会话
codex review           # 非交互代码审查
codex login / logout   # 认证
codex mcp ...          # MCP server 管理
codex mcp-server       # 把 Codex 暴露为 MCP server
codex plugin ...       # 插件与市场
codex cloud            # 云端任务（实验）
codex apply <TASK_ID>  # 把云端任务的 diff 打回本地
codex sandbox      # 用 Codex 的沙箱策略跑任意命令
codex features         # 特性开关
codex doctor           # 诊断
codex update           # 自更新
codex completion zsh   # shell 补全
```

## 已经不存在的命令

* `codex --full-auto`（交互模式）：已移除，默认 Auto 就是它原来的语义
* `--approval-mode suggest/auto-edit/full-auto`：Node 版时代的参数，早已删除
* `/approvals`：改为 `/permissions`
* `/prompts:xxx` 自定义 prompt：整个机制已废弃，改用 Skills

## 参考来源

* 命令与斜杠命令参考：[https://learn.chatgpt.com/docs/developer-commands?surface=cli](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
* CLI 定制（主题、状态栏、键位）：[https://learn.chatgpt.com/docs/cli-customization](https://learn.chatgpt.com/docs/cli-customization)
* 默认键位源码：[https://github.com/openai/codex/blob/main/codex-rs/tui/src/keymap.rs](https://github.com/openai/codex/blob/main/codex-rs/tui/src/keymap.rs)
