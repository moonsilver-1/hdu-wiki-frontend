---
title: "配置与个性化"
date: "2026-09-20"
author: "洛洛"
excerpt: "Claude Code 的配置像一栋楼，按官方文档分为五层。每层有特定用途，层级越高优先级越高（上面覆盖下面）："
tags: ["luoluo", "迁移"]
---

## 配置的分层架构

Claude Code 的配置像一栋楼，按官方文档分为五层。每层有特定用途，层级越高优先级越高（上面覆盖下面）：

```
第 1 层（最高）：企业托管配置（managed-settings.json 等，IT 管理员控制）
    ↓
第 2 层：命令行参数（claude --settings，只对本次会话）
    ↓
第 3 层：项目本机配置（.claude/settings.local.json，只对你，不提交）
    ↓
第 4 层：项目共享配置（.claude/settings.json，团队共享）
    ↓
第 5 层（最低）：用户级配置（~/.claude/settings.json，个人全局）
```

**实际含义**：如果项目配置说"禁止读 .env"，你的个人配置说"允许读 .env"，以项目配置为准（优先级更高）。如果有企业配置，所有人都无法覆盖。

***

## \~/.claude/ 目录：你的个人设置库

这是 Claude Code 在你主目录下的配置中心：

```
~/.claude/
├── settings.json           # 全局设置（适用于所有项目）
├── CLAUDE.md               # 全局项目指南（每次对话都加载）
├── keybindings.json        # 快捷键自定义
├── rules/                  # 全局规则
│   └── preferences.md      # 个人编码偏好
├── themes/                 # 自定义主题（在 /theme 里新建）
├── projects/               # 按项目组织的数据
│   └── <项目路径编码>/
│       └── memory/         # Auto Memory
└── telemetry/              # 使用数据（不用管）
```

### settings.json（全局设置）

控制你在所有项目中的默认行为：

```json
{
  "model": "sonnet",
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(pnpm *)"
    ],
    "deny": [
      "Bash(rm -rf *)"
    ]
  },
  "env": {
    "EDITOR": "code"
  }
}
```

### CLAUDE.md（全局指南）

写给 Claude 的个人指示，所有项目都会加载：

```markdown
- 总是中文回复
- 使用 2 空格缩进
- 优先用 TypeScript 而不是 JavaScript
- 不要自动 commit
```

***

## 项目级配置：.claude/ 目录

项目根目录下的 `.claude/` 文件夹存储团队共享的配置：

```
项目根目录/.claude/
├── settings.json          # 项目级设置（提交到 Git）
├── settings.local.json    # 本机私密设置（不提交）
├── CLAUDE.md              # 项目指南（或放在项目根目录）
└── rules/                 # 细分规则
    ├── frontend.md        # 前端代码规范
    └── testing.md         # 测试规范
```

### 什么该放项目配置？

* ✅ 团队统一的权限规则
* ✅ 项目特定的 Hook（如"编辑后自动格式化"）
* ✅ MCP 服务器配置

### 什么不该放？

* ❌ 个人偏好（放 `~/.claude/settings.json`）
* ❌ API 密钥等敏感信息（放 `settings.local.json` 并 gitignore）

***

## CLAUDE.md 的多层加载

Claude Code 会从多个位置加载 CLAUDE.md，**全部合并**：

| 加载顺序 | 位置                     | 共享性  |
| ---- | ---------------------- | ---- |
| 1    | `~/.claude/CLAUDE.md`  | 仅个人  |
| 2    | `./CLAUDE.md`（项目根）     | 团队共享 |
| 3    | `./.claude/rules/*.md` | 团队共享 |
| 4    | `./CLAUDE.local.md`    | 仅个人  |

**后加载的内容优先级更高。** 如果全局说"用 4 空格"，项目说"用 2 空格"，以项目为准。

### rules/ 目录的特殊能力

`.claude/rules/` 里的规则文件可以带路径匹配条件——只在特定目录下生效：

```markdown
---
paths:
  - "src/components/**/*.tsx"
---
## 组件开发规范
- 所有组件使用 forwardRef
- Props 类型必须导出
```

这个规则只在 Claude 处理 `src/components/` 下的 TSX 文件时才生效。

***

## 模型选择

### 可用模型

Claude Code 的模型别名会随官方可用模型更新，不要把团队规范绑定到某个短期版本号。更稳的理解是：

| 别名       | 模型               | 特点                  |
| -------- | ---------------- | ------------------- |
| `opus`   | 当前 Opus 系列       | 深度推理，适合复杂架构和高风险改动   |
| `sonnet` | 当前 Sonnet 系列     | 日常开发的平衡选择           |
| `haiku`  | 当前 Haiku 系列      | 快速、低成本，适合简单任务       |
| `fable`  | 当前 Fable 系列（可用时） | 最高能力或最新能力入口，具体权限看账号 |

### 切换方式

**1. 在会话中切换**

```
/model opus
```

**2. 启动时指定**

```bash
claude --model haiku
```

**3. 全局设置**

```json
// ~/.claude/settings.json
{
  "model": "sonnet"
}
```

**4. 环境变量**

```bash
export ANTHROPIC_MODEL=opus
```

### 什么时候用什么模型？

| 场景       | 推荐           |
| -------- | ------------ |
| 修复简单 bug | Haiku（快且便宜）  |
| 日常功能开发   | Sonnet（平衡）   |
| 复杂架构设计   | Opus（最强推理）   |
| 大型重构     | Opus（需要深度理解） |
| 快速问答     | Haiku        |

***

## Fast Mode

### 什么是 Fast Mode？

Fast Mode **不是简单切换到更弱的模型**。它更像是把当前可用强模型调到更快的响应配置。具体速度、成本和支持模型会随官方版本变化。

### 切换方式

```
/fast    # 开启/关闭 Fast Mode
```

### 什么时候用？

* ✅ 快速迭代时（频繁修改、测试）
* ✅ 交互式调试时（需要即时响应）
* ❌ 长时间后台任务（成本更高）
* ❌ 成本敏感或需要最稳妥推理的场景

***

## Effort Level（思考深度）

控制 Claude 在每个回复上花多少"脑力"：

| 级别       | 行为                  | 适合场景      |
| -------- | ------------------- | --------- |
| `low`    | 快速思考，简短回答           | 简单问答、格式化  |
| `medium` | 平衡思考                | 日常编程      |
| `high`   | 深度思考，详细回答（多数模型的默认档） | 复杂分析、架构设计 |
| `xhigh`  | 比 high 更深           | 难度较高的长任务  |
| `max`    | 最深思考                | 最复杂的推理任务  |

截至 2026-09-14，Fable 5.x、Opus 5、Sonnet 5 支持全部五档，较早的 Opus 4.6 / Sonnet 4.6 没有 `xhigh`，具体以 `/effort` 里显示的为准。

切换方式：

```
/effort high
```

### Effort vs Fast 的区别

* **Fast Mode**：同一思考深度，但输出更快（成本更高）
* **低 Effort**：更浅的思考，输出自然更快（成本更低）

***

## 主题与外观

### Claude Code 的主题

Claude Code 不会改终端本身的配色，但可以选自己的主题：

```
/theme
```

（也可以在 `/config` 里找主题选项。）内置主题：

* `dark` / `light` — 深色 / 浅色
* `dark-daltonized` / `light-daltonized` — 色弱友好版
* `dark-ansi` / `light-ansi` — 只用终端 ANSI 颜色
* 自动 — 跟随终端的深浅色背景

还可以在 `/theme` 里新建自定义主题，文件存在 `~/.claude/themes/`。

### 状态栏配置

官方的做法是在 settings.json 里配置 `statusLine`，用一个脚本输出底部状态栏要显示的模型、目录、Git 分支等信息（见官方 statusline 文档）。下面这份 `~/.claude/ccline/config.toml` 是第三方状态栏工具 ccline 的配置，不是 Claude Code 自带的：

```toml
theme = "gruvbox"

[style]
mode = "nerd_font"    # 使用 Nerd Font 图标

[[segments]]
id = "model"          # 显示当前模型
enabled = true

[[segments]]
id = "cost"           # 显示消费
enabled = true
```

***

## 快捷键自定义

配置文件：`~/.claude/keybindings.json`

### 查看和编辑

```
/keybindings
```

### 自定义示例

```json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor",
        "ctrl+u": null,
        "shift+enter": "chat:newline"
      }
    }
  ]
}
```

* `"ctrl+e": "chat:externalEditor"` — 按 Ctrl+E 在外部编辑器打开
* `"ctrl+u": null` — 禁用 Ctrl+U 的默认行为
* `"shift+enter": "chat:newline"` — Shift+Enter 换行

### 不可自定义的快捷键

这些快捷键是硬编码的：

* `Ctrl+C` — 中断/取消
* `Ctrl+D` — 退出 Claude Code

***

## 企业级配置

如果你在公司使用 Claude Code，IT 管理员可能部署了**托管配置（Managed Settings）**：

### 特点

* **最高优先级**：覆盖所有个人和项目配置
* **不可修改**：普通用户无法更改
* **强制执行**：权限限制、MCP 服务器、Hook 等

### 配置位置

| 平台      | 路径                                         |
| ------- | ------------------------------------------ |
| macOS   | `/Library/Application Support/ClaudeCode/` |
| Linux   | `/etc/claude-code/`                        |
| Windows | `C:\Program Files\ClaudeCode\`             |

***

## 环境变量配置

Claude Code 也可以通过环境变量配置：

| 变量                              | 作用                            |
| ------------------------------- | ----------------------------- |
| `ANTHROPIC_MODEL`               | 默认模型                          |
| `ANTHROPIC_API_KEY`             | API 密钥                        |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 大多数请求的最大输出 Token（默认值和上限因模型而异） |

设置方式（以 Zsh 为例）：

```bash
## 临时（当前终端有效）
export ANTHROPIC_MODEL=opus

## 永久（写入配置文件）
echo 'export ANTHROPIC_MODEL=opus' >> ~/.zshrc
source ~/.zshrc
```

***

## 配置流程总结

### 第一次使用

1. 安装 Claude Code 后，`~/.claude/` 目录自动创建
2. 运行 `/config` 选择主题、模型等基本设置
3. （可选）编辑 `~/.claude/settings.json` 设置全局偏好
4. （可选）编辑 `~/.claude/CLAUDE.md` 写入个人编码指南

### 开始新项目

1. 运行 `/init` 自动生成 `./CLAUDE.md`
2. （可选）创建 `.claude/settings.json` 设置项目规则
3. （可选）创建 `.claude/rules/` 添加细分规范

### 日常使用

* CLAUDE.md 和 Memory **每次自动加载**，不需要手动操作
* `/model`、`/effort`、`/fast` 随时按需调整
* `/config` 修改持久化设置
* Auto Memory 在后台自动积累学习笔记

### 配置优先级速查

```
企业托管（不可覆盖）
  > 命令行参数 --settings
    > 本机私密 .claude/settings.local.json
      > 项目级 .claude/settings.json
        > 用户级 ~/.claude/settings.json
```

## 参考来源

* Claude Code 设置文件与优先级：[https://code.claude.com/docs/en/settings（查阅于](https://code.claude.com/docs/en/settings（查阅于) 2026-09-14）
* Claude Code 记忆与 .claude/rules：[https://code.claude.com/docs/en/memory（查阅于](https://code.claude.com/docs/en/memory（查阅于) 2026-09-14）
* Claude Code 模型与 Effort 配置：[https://code.claude.com/docs/en/model-config（查阅于](https://code.claude.com/docs/en/model-config（查阅于) 2026-09-14）
* Claude Code 终端配置与主题：[https://code.claude.com/docs/en/terminal-config（查阅于](https://code.claude.com/docs/en/terminal-config（查阅于) 2026-09-14）
