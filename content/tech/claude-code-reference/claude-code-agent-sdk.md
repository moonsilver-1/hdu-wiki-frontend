---
title: "Agent SDK"
date: "2026-09-20"
author: "洛洛"
excerpt: "Claude Agent SDK 把 Claude Code 的 agent loop、内置工具（Read / Edit / Bash 等）和上下文管理打包成一个可嵌入的库。底层会启动 Claude Code 子进程，SDK 自带 CLI 二进制，无需单独安装 Claude Code。"
tags: ["luoluo", "迁移"]
---

洛洛得先坦白：这一篇是本目录里我最看不懂的一篇。

起因是有天默子老师给我看他做的一个小工具，界面很朴素，但你在里面打一句话，它就自己去读项目、改文件、给你结果。我说这不就是 Claude Code 吗，你把终端塞进网页里了？

他说不是，是把 Claude Code 当成零件装进去的。

天哪。原来那个东西是可以被当成零件的。

所以下面这篇，洛洛的角色是导游不是老师：每一节我会说清楚"这段是拿来干什么的"，代码、参数名、表格全部原样保留，你要抄就抄那些，别抄洛洛的理解。

## 概述

**Claude Agent SDK** 把 Claude Code 的 agent loop、内置工具（Read / Edit / Bash 等）和上下文管理打包成一个可嵌入的库。底层会启动 Claude Code 子进程，SDK 自带 CLI 二进制，无需单独安装 Claude Code。

简单说就是——你在终端里用 Claude Code 能做的事，现在可以用几行代码在自己的应用里做了。

"自带 CLI 二进制，无需单独安装"这句洛洛看懂了，而且很感动。想想[安装那一篇](/tech/claude-code-getting-started/claude-code-install)洛洛混装两个版本折腾了一整晚，这里居然直接免了这一步。

### 它和其他东西有什么区别？

名字都长得差不多，洛洛一开始全搞混了，这张表救了我：

|                                     | 定位          | 一句话总结                                          |
| ----------------------------------- | ----------- | ---------------------------------------------- |
| **Claude Code CLI**                 | 终端交互工具      | 在命令行里直接和 Claude 对话写代码                          |
| **Agent SDK**                       | 嵌入式 Agent 库 | 把 Claude Code 的全部能力封装成 Python / TypeScript API |
| **Client SDK**（`@anthropic-ai/sdk`） | API 客户端     | 直接调 Messages API，tool loop 要自己实现               |
| **Managed Agents**                  | 云端托管服务      | Anthropic 托管的 Agent，2026-04 公测                 |

洛洛的记法：CLI 是你自己用，Agent SDK 是让你的程序用，Client SDK 是啥都要自己搭，Managed Agents 是连机器都不用管。

## 安装

看懂之后就到装东西这一步了，两种语言选一个。

### Python

```bash
pip install claude-agent-sdk
```

需要 Python 3.10+。

### TypeScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

需要 Node.js 18+。

### 认证

SDK 通过环境变量读取 API 密钥：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

也支持 Amazon Bedrock、Google Cloud Agent Platform（原 Vertex AI）和 Microsoft Foundry 等替代认证方式。

> **洛洛碎碎念**
>
> 又是 API Key！又是环境变量！
> 
>   默子老师那句话洛洛已经会背了：不要发群里，不要截图，不要贴到任何公开的地方。
> 
>   尤其是写代码的时候不要图省事直接写在文件里，然后一个 push 上了 GitHub——洛洛听过太多这种惨案了，害怕之。

## 快速开始

好了，这就是那个"几行代码"的真身。

核心入口是 `query()` 函数。它返回一个**异步迭代器**，需要用 `async for` / `for await` 逐条消费消息。

### Python

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock

async for message in query(
    prompt="查找所有 TODO 并修复",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
):
    if isinstance(message, AssistantMessage):
        for block in message.content:
            if isinstance(block, TextBlock):
                print(block.text)
```

### TypeScript

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

for await (const message of query({
  prompt: '查找所有 TODO 并修复',
  options: { allowedTools: ['Read', 'Edit', 'Bash'] }
})) {
  if (message.type === 'assistant') {
    console.log(message.message.content);
  }
}
```

> **注意**：`query()` 不是 `await` 一次拿到完整结果，而是流式返回 `AsyncIterator[Message]`。TypeScript 里每条 message 用 `type` 字段区分，Python 里用 `isinstance` 判断消息类（如 `AssistantMessage`）。

洛洛看懂的部分是：`prompt` 里那句"查找所有 TODO 并修复"，跟你在终端里打给它的话完全没区别；`allowedTools` 就是那个白名单，允许它读、改、跑命令。

至于"异步迭代器"——洛洛的理解是它不会憋到最后一次性给你，而是像发弹幕一样一条一条飘出来，所以要用 `async for` 一条一条接。不严谨，但洛洛就先这么记着了。

## 多轮对话

上面那种是问一句就散场。想让它记住前面聊过什么，得换个入口：

如果需要在同一个会话里连续提问（保持上下文），用 `ClaudeSDKClient`：

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async with ClaudeSDKClient(options=ClaudeAgentOptions(...)) as client:
    # async with 会自动连接和断开
    await client.query("这个项目用了什么框架？")
    async for message in client.receive_response():
        print(message)

    # 继续追问，上下文自动保留
    await client.query("帮我找到所有 API 路由")
    async for message in client.receive_response():
        print(message)
```

看那行注释——"上下文自动保留"。所以第二个问题不用再解释一遍项目是啥，跟人聊天一样。这段代码洛洛虽然写不出来，但读起来居然有点顺：连上、问、收、再问、收、断开。

## 自定义工具

到这里开始有意思了：前面都是用它自带的能力，这一节是给它加你自己的能力。

### 用 @tool 注册工具

`@tool` 装饰器需要三个参数：**工具名称**、**描述**和 **input\_schema**（JSON Schema 格式）：

```python
from claude_agent_sdk import tool

@tool("get_weather", "获取天气信息", {
    "type": "object",
    "properties": {"city": {"type": "string", "description": "城市名"}},
    "required": ["city"]
})
async def get_weather(args):
    return {"content": [{"type": "text", "text": f"{args['city']}: 晴天 25°C"}]}
```

> **注意**：不能写裸的 `@tool`——name、description、input\_schema 三个参数缺一不可。被装饰的函数要写成 `async`，接收一个 `args` 字典，返回 `{"content": [...]}` 结构。

souga，原来"给 AI 加一个新技能"就是这个样子：告诉它这技能叫什么、干什么用的、要你给它什么信息。那个 `description` 洛洛觉得最关键——AI 是靠读这句话来判断该不该用这个工具的，写得含糊它就不知道什么时候该掏出来。

### 用 create\_sdk\_mcp\_server 暴露工具

把注册好的工具打包成 MCP 服务器，SDK 会自动管理进程通信：

```python
from claude_agent_sdk import create_sdk_mcp_server

server = create_sdk_mcp_server(
    name="my-tools",
    version="1.0.0",
    tools=[get_weather]
)
```

这种方式比手动跑外部 MCP 服务器更轻量——无需单独管理子进程，单进程内完成一切。洛洛读到"单进程内完成一切"就放心了：不用再多开一个东西守着，能少一件要维护的就少一件。

## 自定义 Subagents

Subagents 是运行在独立上下文中的专门化 AI 助手。

这个洛洛熟！[多 Agent 并行](/tech/claude-code-advanced/claude-code-multi-agent)那篇讲过，就是那些帮主 Agent 干活的小弟。在 SDK 里也一样能自己造。

### 方式一：Markdown 文件

在 `.claude/agents/` 下创建 `.md` 文件：

```markdown
---
name: code-reviewer
description: 专门审查代码质量和安全性的 Agent
model: sonnet
tools:
  - Read
  - Glob
  - Grep
maxTurns: 10
permissionMode: plan
---

你是一个代码审查专家。审查代码时关注：
1. 安全漏洞（SQL 注入、XSS 等）
2. 性能问题
3. 代码规范
```

### 方式二：交互式创建

在 Claude Code 中输入 `/agents`，通过引导式设置创建。

截至 2026-09-14 官方文档已改为：v2.1.198 起 `/agents` 不再有引导向导，只会提醒你让 Claude 帮你写 agent 文件，或直接编辑 `.claude/agents/`、`~/.claude/agents/`。

有现成的引导为什么还要自己手写 YAML？洛洛当然选这个。

### Subagent 配置字段

这张表洛洛认识的不到一半，但放这儿方便你查：

| 字段                | 说明                                                    |
| ----------------- | ----------------------------------------------------- |
| `name`            | Agent 名称（必需）                                          |
| `description`     | Agent 描述（必需）                                          |
| `model`           | 模型别名：sonnet / opus / haiku / fable / inherit，或完整模型 ID |
| `tools`           | 可用工具列表                                                |
| `disallowedTools` | 禁用工具列表                                                |
| `maxTurns`        | 最大交互轮次                                                |
| `permissionMode`  | 权限模式                                                  |
| `mcpServers`      | MCP 服务器配置                                             |
| `hooks`           | 生命周期钩子                                                |
| `skills`          | 启动时预加载的 Skills                                        |
| `memory`          | 持久记忆（user/project/local）                              |
| `effort`          | 推理 effort 级别                                          |
| `background`      | 是否后台运行                                                |
| `isolation`       | worktree 隔离                                           |
| `color`           | 在 UI 中显示的颜色                                           |
| `initialPrompt`   | 作为主会话 agent 运行时的初始提示                                  |

洛洛唯一有强烈感受的是 `color`——居然能给每个小弟分配颜色。设计选手表示这个功能非常有必要，谢谢。

### 内置 Subagents

| Agent               | 模型                        | 用途        |
| ------------------- | ------------------------- | --------- |
| **Explore**         | 继承（v2.1.198 起，之前固定 Haiku） | 只读，快速代码搜索 |
| **Plan**            | 继承                        | 计划模式研究    |
| **General-purpose** | 继承                        | 完整工具，复杂任务 |

## 相关概念

最后两个名字，纯粹是为了你以后看到别搞混。

### Tool Runner

Client SDK（`@anthropic-ai/sdk`）提供的 beta 功能 `client.beta.messages.tool_runner`，可以自动执行 agentic loop——你定义好工具，它帮你跑完整个"调用工具 → 拿结果 → 再推理"的循环。

和 Agent SDK 的区别：Tool Runner 基于 Messages API，工具定义和执行逻辑都在你这边；Agent SDK 则直接复用 Claude Code 的内置工具和 agent loop，开箱即用。

### Managed Agents

2026 年 4 月公测的云端托管 Agent 服务。你不需要跑任何本地进程，Anthropic 在云端为你管理 Agent 的生命周期和执行环境。适合不想维护基础设施、只想调用 API 拿结果的场景。

## 洛洛的总结

写完这篇洛洛还是不会用 Agent SDK，这个我认。

但我至少搞清楚了一件事：Claude Code 不是一个只能在黑框框里用的工具，它是一堆能被拆出来装进别的东西里的能力。默子老师那个朴素小工具的秘密就在这儿。

所以如果你是会写代码的那种人，这篇是给你的；如果你和洛洛一样是"不懂但看着牛逼"派，那你只要记住它存在就够了——哪天你有想法了，知道有这么条路可以走。

顺便，[MCP](/tech/claude-code-reference/claude-code-mcp) 那篇会讲上面提到的 MCP 服务器是怎么一回事，比这篇友好得多。

洛洛先去睡了，这篇看得脑子有点热。

## 参考来源

查阅日期 2026-09-14。

* Agent SDK 概览：[https://code.claude.com/docs/en/agent-sdk/overview](https://code.claude.com/docs/en/agent-sdk/overview)
* Python SDK 参考：[https://code.claude.com/docs/en/agent-sdk/python](https://code.claude.com/docs/en/agent-sdk/python)
* TypeScript SDK 参考：[https://code.claude.com/docs/en/agent-sdk/typescript](https://code.claude.com/docs/en/agent-sdk/typescript)
* Subagents：[https://code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)
