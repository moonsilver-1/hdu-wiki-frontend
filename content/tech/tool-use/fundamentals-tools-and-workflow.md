---
title: "工具与工作流"
date: "2026-09-20"
author: "洛洛"
excerpt: "Claude Code 不只是聊天——它能通过工具（Tools） 直接操作你的电脑：读文件、改代码、运行命令、搜索内容。"
tags: ["luoluo", "迁移"]
---

## 工具系统：Claude Code 的"手"

Claude Code 不只是聊天——它能通过**工具（Tools）** 直接操作你的电脑：读文件、改代码、运行命令、搜索内容。

### 为什么不全用 Bash？

理论上，Bash 能做一切。但 Claude Code 设计了专门的工具，有五个关键优势：

**1. 精细的权限控制**

```
✅ 允许 Read（读文件）但 ❌ 拒绝 Bash
✅ 允许 Bash(pnpm test) 但 ❌ 拒绝 Bash(rm -rf)
```

如果只有 Bash 一个工具，你只能选择"全部允许"或"全部禁止"。

**2. Hook 触发**

专门的工具能触发自动化流程。比如：

* 每次用 `Edit` 工具修改代码后，自动运行格式化
* 每次用 `Write` 创建文件后，自动检查语法

如果用 `Bash` 做一切，系统无法区分"这次是在编辑代码"还是"在运行测试"。

**3. 结构化数据**

`Grep` 工具返回的搜索结果带有文件名、行号等结构化信息，Claude 能更好地理解。而 `bash grep ...` 只是纯文本。

**4. 安全审计**

每个工具调用都有明确的类型和参数，方便回溯"Claude 做了什么"。

**5. 用户体验**

工具调用在界面上有清晰的展示——你能看到 Claude 正在读哪个文件、编辑哪一行、运行什么命令。

***

## 核心工具详解

### Read（读取文件）

```
Read: /Users/mozi/开发/project/src/auth.ts
```

* **作用**：读取文件内容，显示带行号的文本
* **权限**：不需要确认（读操作安全）
* **可以读取**：文本文件、图片（多模态）、PDF、Jupyter Notebook
* **限制**：默认读前 2000 行；大文件可以指定行范围

### Write（写入文件）

```
Write: /path/to/new-file.ts
Content: (完整的文件内容)
```

* **作用**：创建新文件，或完全覆盖已有文件
* **权限**：需要确认
* **注意**：会覆盖整个文件！如果只是改几行，应该用 Edit

### Edit（编辑文件）

```
Edit: /path/to/auth.ts
  旧内容: const token = getToken();
  新内容: const token = getToken() || refreshToken();
```

* **作用**：精确替换文件中的特定内容
* **权限**：需要确认
* **优势**：只改需要改的部分，保留其他内容不动。Claude 优先使用 Edit 而非 Write

### Bash（运行命令）

```
Bash: pnpm build
```

* **作用**：在 Shell 中执行命令
* **权限**：需要确认
* **范围极广**：编译、测试、Git 操作、安装包、运行脚本……

### Grep（搜索内容）

```
Grep: pattern="getToken" path="src/"
```

* **作用**：在文件内容中搜索匹配正则表达式的文本
* **权限**：不需要确认
* **输出模式**：只显示文件名 / 显示匹配行 / 显示匹配计数

### Glob（搜索文件名）

```
Glob: pattern="src/**/*.tsx"
```

* **作用**：按文件名模式查找文件
* **权限**：不需要确认
* **常用模式**：`**/*.ts`（所有 TS 文件）、`src/components/*.tsx`（某目录下的组件）

### WebFetch（抓取网页）

```
WebFetch: url="https://docs.example.com/api"
```

* **作用**：获取指定 URL 的内容
* **权限**：需要确认
* **用途**：查文档、获取 API 响应

### WebSearch（网络搜索）

```
WebSearch: query="Next.js 16 new features"
```

* **作用**：在互联网上搜索信息
* **权限**：需要确认
* **用途**：查找最新文档、解决未知错误

***

## 斜杠命令

在 Claude Code 中输入 `/` 开头的命令可以快速执行系统操作。这些命令由 Claude Code 的 CLI 直接处理，**不消耗 Token**（或消耗极少）。

### 信息查看

| 命令                   | 作用                      |
| -------------------- | ----------------------- |
| `/help`              | 显示帮助和所有可用命令             |
| `/usage`（别名 `/cost`） | 查看 Token 消耗和费用          |
| `/context`           | 可视化上下文窗口使用情况            |
| `/status`            | 显示当前配置状态                |
| `/doctor`            | 诊断 Claude Code 的安装和配置问题 |

### 对话管理

| 命令              | 作用             |
| --------------- | -------------- |
| `/clear`        | 清空对话历史，释放所有上下文 |
| `/compact [重点]` | 压缩对话，可指定保留重点   |
| `/resume [名字]`  | 恢复之前的会话        |
| `/rename 新名字`   | 给当前会话起名字       |

### 模型与模式

| 命令             | 作用                                                |
| -------------- | ------------------------------------------------- |
| `/model [名称]`  | 切换 LLM 模型（opus/sonnet/haiku）                      |
| `/effort [级别]` | 调整思考深度（low / medium / high / xhigh / max，可用档位看模型） |
| `/fast`        | 切换 Fast Mode（同模型，更快输出）                            |
| `/plan`        | 进入 Plan 模式（只读）                                    |

### 配置与管理

| 命令             | 作用                            |
| -------------- | ----------------------------- |
| `/memory`      | 查看和编辑 CLAUDE.md 与 Auto Memory |
| `/permissions` | 管理工具权限规则                      |
| `/hooks`       | 浏览配置的 Hook                    |
| `/config`      | 打开设置界面                        |
| `/mcp`         | 管理 MCP 服务器连接                  |

### 代码审查

| 命令        | 作用                    |
| --------- | --------------------- |
| `/diff`   | 打开交互式 diff 查看器，审视所有改动 |
| `/rewind` | 回退到之前的状态（撤销改动）        |

***

## Plan 模式

### 什么是 Plan 模式？

Plan 模式切换到**只读权限**——Claude 可以读文件、运行只读命令、搜索代码，但**不能编辑任何文件**。

它的工作是：理解代码 → 分析问题 → 制定方案 → 等你审批。

### 三种进入方式

1. **快捷键**：按 `Shift+Tab` 切换到 Plan 模式
2. **斜杠命令**：`/plan 修复认证 bug`
3. **启动参数**：`claude --permission-mode plan`

### 典型工作流

```
1. 进入 Plan 模式
   → Claude 读代码、运行测试、探索结构

2. Claude 提出方案
   → "我建议修改 auth.ts 第 42 行，添加 token 刷新逻辑"

3. 你审批
   → "同意，开始执行"
   → Claude 切换到执行模式，开始编辑

4. 执行完成
   → Claude 展示 diff，等你确认
```

### 什么时候用 Plan 模式？

| 场景              | 是否需要 Plan      |
| --------------- | -------------- |
| 大型重构（改 10+ 个文件） | ✅ 先规划再动手       |
| 不确定方向的复杂问题      | ✅ 先让 Claude 分析 |
| 简单的小 bug 修复     | ❌ 直接修          |
| 明确的需求（"添加一个按钮"） | ❌ 直接做          |

***

## 子代理（Subagent）

### 什么是子代理？

子代理是一个**独立的 Claude 实例**，有自己的：

* 上下文窗口（不与主会话共享）
* 工具集合（可以限制）
* 系统提示

就像雇一个专门的"助手"去做某个特定任务。

### 为什么需要子代理？

**问题**：如果你让 Claude 做一个复杂的搜索（比如"在整个代码库里找出所有和认证相关的文件"），搜索结果可能有几万个 Token，直接塞进主对话会占满上下文。

**解决方案**：派一个子代理去搜索。子代理有自己的上下文，完成后只返回一个简短的摘要给主对话。

### 子代理 vs 主对话

| 特性  | 子代理       | 主对话    |
| --- | --------- | ------ |
| 上下文 | 独立的，用完即释放 | 累积增长   |
| 任务  | 专门的、明确的   | 开放式、长期 |
| 结果  | 返回简短摘要    | 完整保留   |
| 成本  | 取决于任务大小   | 随对话增长  |

### 自动触发

Claude Code 会在需要时自动启动子代理——比如需要深入搜索代码库时。你不需要手动管理。

***

## Hooks：自动化引擎

### 什么是 Hook？

Hook 是在特定**事件**发生时自动运行的脚本。它是 Claude Code 中最强大的自动化机制。

### 两类 Hook

**PreToolUse（工具执行前）**：

在 Claude 使用工具之前触发，可以：

* **允许**：让操作继续（exit 0）
* **拒绝**：阻止操作（exit 2）
* **审计**：检查工具名、输入参数和当前上下文

示例：阻止删除数据库的危险命令

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/check-bash-command.py"
          }
        ]
      }
    ]
  }
}
```

**PostToolUse（工具执行后）**：

在 Claude 完成工具调用之后触发，用于：

* 自动格式化刚编辑的文件
* 运行代码检查
* 发送通知

示例：每次编辑后自动格式化

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "python3 .claude/hooks/format-written-file.py"
      }]
    }]
  }
}
```

### Hook 配置位置

| 位置                            | 作用域        |
| ----------------------------- | ---------- |
| `~/.claude/settings.json`     | 所有项目       |
| `.claude/settings.json`       | 当前项目（团队共享） |
| `.claude/settings.local.json` | 当前项目（仅个人）  |

### Hook vs 权限的区别

* **权限**：决定"能不能做"
* **Hook**：决定"做了之后还要做什么"（或"做之前先检查什么"）

两者互补：权限是粗粒度的"是/否"，Hook 是细粒度的自动化逻辑。

***

## MCP（Model Context Protocol）

### 什么是 MCP？

MCP 是一个标准化协议，让 Claude Code 安全地连接**外部工具和服务**。

### 常见的 MCP 服务器

| 名称             | 功能                            |
| -------------- | ----------------------------- |
| mcp-github     | 操作 GitHub（搜索仓库、创建 PR、读 Issue） |
| mcp-postgres   | 查询数据库                         |
| mcp-slack      | 发送消息、读频道                      |
| mcp-filesystem | 受控的文件操作                       |

### 为什么不直接用 CLI？

你可以用 `bash gh pr list` 操作 GitHub，但 MCP 的优势是：

* **结构化数据**：返回 JSON，Claude 能更好理解
* **持久连接**：一次认证，多次使用
* **权限隔离**：MCP 工具可以单独配置权限

### 管理 MCP

```
/mcp
```

打开交互式菜单，添加、删除、配置 MCP 服务器。

也可以用 CLI 添加：

```bash
claude mcp add --transport stdio filesystem -- \
  npx -y @modelcontextprotocol/server-filesystem /path/to/dir
```

***

## 快捷键

### 最常用的快捷键

| 快捷键           | 作用                   |
| ------------- | -------------------- |
| **Enter**     | 提交消息                 |
| **Shift+Tab** | 切换权限模式，具体顺序以当前版本为准   |
| **Ctrl+C**    | 中断当前生成               |
| **Esc × 2**   | 清空输入草稿，或打开回退（rewind） |
| **Ctrl+L**    | 重绘或清空屏幕（保留对话）        |

### 模式与模型

| 快捷键                      | 作用                      |
| ------------------------ | ----------------------- |
| **Option+P** / **Alt+P** | 切换模型                    |
| **Ctrl+O**               | 打开或关闭对话记录查看器（能看到每次工具调用） |

### 快速执行

在输入框中以 `!` 开头可以直接运行 shell 命令（不经过 Claude）：

```
! pnpm test
! git log --oneline -5
```

### 多行输入

* `Shift+Enter`：换行而不提交
* `Option+Enter`：macOS 上的换行（需要先在终端里开启 Option as Meta）
* `Ctrl+J`，或输入 `\` 再按 Enter：所有终端都能用的换行

***

## 完整的工作流示例

### 场景：修复一个复杂的认证 bug

```
步骤 1：Plan 模式探索
  Shift+Tab × 2（进入 plan 模式）
  "帮我分析 src/auth.ts 里的 token 刷新逻辑，
   为什么有时候 session 会过早失效？"
  → Claude 读代码、搜索相关文件、运行测试
  → Claude 提出修复方案

步骤 2：审批并切换到执行模式
  "方案看起来合理，开始修复。"
  批准方案时选「自动接受编辑」（批准后会直接切到对应的权限模式）
  → Claude 开始编辑文件

步骤 3：每次编辑后审查
  → Claude 编辑 auth.ts（你看 diff，确认）
  → Claude 编辑 middleware.ts（你看 diff，确认）

步骤 4：运行测试
  → Claude 运行 pnpm test（需要你确认执行 Bash）
  → 测试通过

步骤 5：检查成本
  /cost → $1.85

步骤 6：提交
  "帮我 commit 这些改动"
  → Claude 生成 commit message，创建 commit
```

## 参考来源

* Claude Code 交互模式与快捷键：[https://code.claude.com/docs/en/interactive-mode（查阅于](https://code.claude.com/docs/en/interactive-mode（查阅于) 2026-09-14）
* Claude Code 命令参考：[https://code.claude.com/docs/en/commands（查阅于](https://code.claude.com/docs/en/commands（查阅于) 2026-09-14）
* Claude Code 权限模式：[https://code.claude.com/docs/en/permission-modes（查阅于](https://code.claude.com/docs/en/permission-modes（查阅于) 2026-09-14）
* Claude Code Hooks 参考：[https://code.claude.com/docs/en/hooks（查阅于](https://code.claude.com/docs/en/hooks（查阅于) 2026-09-14）
