---
title: "OpenClaw 与 AI Agent：安装、飞书对接和日常自动化"
date: "2026-08-09"
author: "TNHTH"
section: "openclaw"
excerpt: "整理 OpenClaw、Moltbot、Hermes Agent 的安装、模型、身份文件、飞书与企业协作平台对接方法。"
tags: ["OpenClaw","Moltbot","Hermes Agent","飞书","AI Agent"]
---

> 本文保留公开教程中 AI Agent 的安装、配置和对接思路，但不会把第三方密钥、个人账号或旧版价格写进文章。涉及权限、机器人和自动化任务时，先在测试空间验证，并以项目官方文档为准。
>
> 原始知识库入口：[AI编程快乐屋](https://my.feishu.cn/wiki/V5slwCIkUimnjKkyJuEcJiW0nuc)。

## 最火AI私人助理Moltbot(Clawdbot)介绍、新手安装指南及飞书对接

### 什么是Moltbot?

Moltbot 是一个本地部署的 AI 智能体，可以操作电脑(目前能力有限），连接各类应用

Moltbot 三要素

- Channel : 发送信息到 Moltbot的通道，比如微信，飞书

- 宿主： 将Moltbot 安装到哪里，比如个人电脑，云服务器，云电脑等

- 大模型：Moltbot使用的模型，一切的文字理解和视觉理解都要靠大模型

### 前期准备

#### 宿主环境

- 使用个人电脑（一定要慎重，相当于 moltbot 能浏览你电脑上的所有文件），可以用其他不用的电脑来安装

- 使用云服务器

- 使用轻量服务器+Moltbot

https://cloud.tencent.com/developer/article/2624003
https://cn.aliyun.com/solution/tech-solution/clawdbot/3018681?from_alibabacloud=

https://cloud.tencent.com/developer/article/2624003

https://www.volcengine.com/docs/6396/2189942?lang=zh&utm_campaign=clawdbot&utm_content=ecs&utm_medium=Home-Page&utm_source=clawdbot&utm_term=sidebar

- 使用云电脑

https://swasnext.console.aliyun.com/buy#/

- 使用 githubcodespaces

#### 大模型

可以使用 GLM 编码套餐

或者其他大模型

使用 minimax 要切记更换 url, 详细可参考

https://platform.minimaxi.com/docs/solutions/moltbot

#### 系统要求

- Node >=22

- macOS, Linux, or Windows via WSL2

最好再装一个 python

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 安装

#### windows

管理员方式打开终端

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

```text
iwr -useb https://molt.bot/install.ps1| iex
```

#### mac/linux

```text
curl -fsSL https://molt.bot/install.sh | bash
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

空格键选择yes, 意思是告诉明白有风险， enter键下一项

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

输入模型的APIKey也可以不输，等会有界面的时候在输入

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

里面的都是国外的通信软件，咱们用不到，选择过滤

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

选择配置技能

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

可以选择过滤，或者有你想装的选中也行

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

没有这些Key的话，全部选择NO

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

这三个钩子最好都选中，用于记录日志记忆等

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

本地电脑选择带界面的控制平台

选择之后你就可以看到界面的clawdbot管理后台了

如果上面的配置有问题，你可以输入下面的命令重新进入配置

```text
clawdbot config
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 飞书对接

#### 创建飞书应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

https://open.feishu.cn/app?lang=zh-CN

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

可以根据自己情况，开通对应的权限,可以选择导入的方式

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击批量导入

```text
{
  "scopes": {
    "tenant": [
      "im:chat:read",
      "im:chat:update",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message.pins:read",
      "im:message.pins:write_only",
      "im:message.reactions:read",
      "im:message.reactions:write_only",
      "im:message:readonly",
      "im:message:recall",
      "im:message:send_as_bot",
      "im:message:send_multi_users",
      "im:message:send_sys_msg",
      "im:message:update",
      "im:resource"
    ],
    "user": [
      "contact:user.employee_id:readonly"
    ]
  }
}
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

Required Permissions  所需权限

Optional Permissions  可选权限

#### 安装飞书插件

让 AI 帮你 安装，打开http://127.0.0.1:18789/chat

输入下面的提示词

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

使用代码的方式安装

```text
clawdbot plugins install @m1heng-clawd/feishu
```

配置飞书应用

```text
clawdbot config set channels.feishu.appId "cli_xxxxx"
clawdbot config set channels.feishu.appSecret "your_app_secret"
clawdbot config set channels.feishu.enabled true
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 配置飞书应用

##### 配置事件

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### 配置回调

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

选择长链接，点击保存

#### 创建版本

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击发布就可以了

### 飞书聊天测试

打开飞书，搜索机器人名

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 优点

- 让 AI Agent 从人主动询问AI，转变到 AI 被动服务，AI 主动问人

- 建立了一个基石，下一步将有许多丰富的生态对接到这里

### 缺点

- 安装使用有门槛，风险极高，缺少安全屏障

- token 消费极高

- 自动化操作电脑能力还有限

### 最后

对世界永远保持好奇

## Windows 安装nodejs及 python

### 安装Python

##### 下载 Python

- 访问官网：https://www.python.org/downloads/

- 点击黄色的 Download Python 3.x.x 按钮

- 或者选择特定版本：https://www.python.org/downloads/windows/

##### 运行安装程序

1. 双击下载的 .exe 文件

1. 重要：勾选 "Add Python to PATH"（将 Python 添加到环境变量）

- 这样可以在任何位置使用 Python

1. 选择安装选项：

- Install Now：默认安装（推荐新手）

- Customize installation：自定义安装位置和功能

##### 验证安装

安装完成后，按 Win + R，输入 cmd 打开命令提示符，然后输入：

bash

python --version

或

bash

python --version

看到版本号说明安装成功。

### 安装NodeJs

##### 下载 Node.js

- 官网下载：https://nodejs.org/zh-cn/

- 你会看到两个版本：

- LTS 版本（长期支持版）：推荐生产环境使用 ✅

- Current 版本（最新版）：包含最新特性，适合尝鲜

##### 运行安装程序

1. 双击下载的 .msi 文件

1. 点击 Next 继续

1. 重要步骤：

- 接受许可协议

- 选择安装路径（默认即可）

- 勾选 "Automatically install the necessary tools"（会自动安装 Chocolatey 和必要的构建工具）

- 确保 "Add to PATH" 被选中

##### 验证安装

打开命令提示符（CMD）或 PowerShell，输入：

bash

node --versionnpm --version

看到版本号即表示安装成功。

## 最火AI 助理Moltbot（Clawdbot）使用场景实战

### 身份的转变

以 老板 的视角，把 Moltbot 当成你的助理，安排助理可以完成的事情

### Moltbot的能力组成

### 技能的能力

社区技能库，涵盖了工作生活方方面面

https://github.com/VoltAgent/awesome-moltbot-skills

## OpenClaw 保姆级打通飞书全功能，让你办公完全自动化，拥有自己的数字分身

### OpenClaw 可以操作飞书的 能力列表

| 类别 | 能力 |
| --- | --- |
| 💬 消息 | 消息读取（群聊/单聊历史、话题回复）、消息发送、消息回复、消息搜索、图片/文件下载 |
| 📄 文档 | 创建云文档、更新云文档、读取云文档内容 |
| 📊 多维表格 | 创建/管理多维表格、数据表、字段、记录（增删改查、批量操作、高级筛选）、视图 |
| 📅 日历日程 | 日历管理、日程管理（创建/查询/修改/删除/搜索）、参会人管理、忙闲查询 |
| ✅ 任务 | 任务管理（创建/查询/更新/完成）、清单管理、子任务、评论 |

### 保姆级安装步骤

#### 1、安装 OpenClaw

OpenClaw 版本限制：

- Linux/MacOS：openclaw 2026.2.26 及以上；

- Windows：openclaw 2026.3.2 及以上

```text
openclaw update
```

#### 2、创建飞书应用

1）登录飞书开放平台，单击“创建企业自建应用”按钮。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

2）创建应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

3）添加机器人能力

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

4）添加权限

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

在导入标签中，将下面这个直接复制

```text
{
  "scopes": {
    "tenant": [
      "contact:contact.base:readonly",
      "docx:document:readonly",
      "im:chat:read",
      "im:chat:update",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message.pins:read",
      "im:message.pins:write_only",
      "im:message.reactions:read",
      "im:message.reactions:write_only",
      "im:message:readonly",
      "im:message:recall",
      "im:message:send_as_bot",
      "im:message:send_multi_users",
      "im:message:send_sys_msg",
      "im:message:update",
      "im:resource",
      "application:application:self_manage",
      "cardkit:card:write",
      "cardkit:card:read"
    ],
    "user": [
      "contact:user.employee_id:readonly",
      "offline_access","base:app:copy",
      "base:field:create",
      "base:field:delete",
      "base:field:read",
      "base:field:update",
      "base:record:create",
      "base:record:delete",
      "base:record:retrieve",
      "base:record:update",
      "base:table:create",
      "base:table:delete",
      "base:table:read",
      "base:table:update",
      "base:view:read",
      "base:view:write_only",
      "base:app:create",
      "base:app:update",
      "base:app:read",
      "board:whiteboard:node:create",
      "board:whiteboard:node:read",
      "calendar:calendar:read",
      "calendar:calendar.event:create",
      "calendar:calendar.event:delete",
      "calendar:calendar.event:read",
      "calendar:calendar.event:reply",
      "calendar:calendar.event:update",
      "calendar:calendar.free_busy:read",
      "contact:contact.base:readonly",
      "contact:user.base:readonly",
      "contact:user:search",
      "docs:document.comment:create",
      "docs:document.comment:read",
      "docs:document.comment:update",
      "docs:document.media:download",
      "docs:document:copy",
      "docx:document:create",
      "docx:document:readonly",
      "docx:document:write_only",
      "drive:drive.metadata:readonly",
      "drive:file:download",
      "drive:file:upload",
      "im:chat.members:read",
      "im:chat:read",
      "im:message",
      "im:message.group_msg:get_as_user",
      "im:message.p2p_msg:get_as_user",
      "im:message.send_as_user",
      "im:message:readonly",
      "search:docs:read",
      "search:message",
      "space:document:delete",
      "space:document:move",
      "space:document:retrieve",
      "task:comment:read",
      "task:comment:write",
      "task:task:read",
      "task:task:write",
      "task:task:writeonly",
      "task:tasklist:read",
      "task:tasklist:write",
      "wiki:node:copy",
      "wiki:node:create",
      "wiki:node:move",
      "wiki:node:read",
      "wiki:node:retrieve",
      "wiki:space:read",
      "wiki:space:retrieve",
      "wiki:space:write_only"
    ]
  }
}
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

在弹窗中确认权限无误后，单击“申请开通”按钮，完成操作。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

5）发布应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

确认没问题后，点击保存

6）获取配置信息。

1. 在左侧目录树选择“基础信息 > 凭证与基础信息”。

1. 在“应用凭证”模块中，获取并记录App ID与App Secret信息。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、安装插件

依次在终端中执行以下命令：

Linux/MacOS

```text
npm config set registry https://registry.npmjs.org
```

```text
curl -o /tmp/feishu-openclaw-plugin-onboard-cli.tgz https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/4d184b1ba733bae2423a89e196a2ef8f_QATOjKH1WN.tgz
```

```text
npm install /tmp/feishu-openclaw-plugin-onboard-cli.tgz -g
```

```text
rm /tmp/feishu-openclaw-plugin-onboard-cli.tgz
```

Windows cmd

```text
npm config set registry https://registry.npmjs.org
```

```text
curl -o "%TEMP%\feishu.tgz" https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/c53145d7b9eb0e29f4e07bf051231230_XjCy46mAFI.tgz
```

```text
npm install -g "%TEMP%\feishu.tgz"
```

```text
del "%TEMP%\feishu.tgz"
```

然后执行后续指令：

```text
feishu-plugin-onboard install
```

#### 4、重新运行OpenClaw

```text
openclaw gateway run
```

#### 5、检测是否成功

运行 openclaw plugins list，ID为 feishu-openclaw-plugin 的 Status 为 loaded ，ID为 feishu 的 Status 为 disabled 则标明已成功启用飞书官方插件。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 6、订阅机器人长链接接收事件

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

添加接收消息事件

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

发布版本

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 7、飞书 配对

1. 在飞书中向机器人发送任意消息，系统会生成一个配对码（字母+数字组合）；如果历史已安装过飞书插件，可能没有该配对过程。

1. 配对码有效期为 5 分钟，超时需重新触发

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

1. 在服务器终端执行以下命令完成绑定：openclaw pairing approve feishu <配对码> --notify

#### 8、飞书授权

完成上面的配置后，飞书机器人会收到信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

## OpenClaw 新手必看 1️⃣：OpenClaw选什么模型？不同模型的区别是什么？

### OpenClaw的模型作用

模型就是 OpenClaw 的大脑，所以模型的能力决定了处理消息的结果质量。按照模型的接收和回复的作用，分为这几个类型：

| 大模型接收 | 文字 | 大模型回复 | 文字 |
| --- | --- | --- | --- |
|  | 图片 |  | 图片 |
|  | 视频 |  | 视频 |
|  | 音频 |  | 音频 |
|  | 其他 |  | 实时网页搜索 |
|  |  |  | 其他 |

OpenClaw 模型使用效果排行榜（截止 2026/03/09）

[PinchBench - Success Rate Leaderboard](https://pinchbench.com/)

Benchmarking LLM models as AI agents across standardized coding tasks

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 模型列表

|  | 文本能力 | 图片理解 | 音频理解 | 图片生成 | 音频生成 | 视频生成 | 网页搜索 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DeepSeek-v3.2 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |  |
| Qwen3.5-plus | ✅ | ✅ | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门图片模型） | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门视频模型） | 配置 MCP |
| Doubao-seed-2.0 | ✅ | ✅ | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门图片模型） | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门视频模型） | 单独开通 |
| MiniMax-M2.5/2.1 | ✅ | 配置 MCP | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门图片模型） | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门视频模型） | 配置 MCP |
| Kimi-K2.5 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |  |
| GLM-5.0 | ✅ | 配置 MCP | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门图片模型） | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门视频模型） | 配置 MCP |
| Claude-sonnet 4.6 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| GPT-5.4 | ✅ | ✅ | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门图片模型） | ❌&lt;br&gt;(有专门语音模型） | ❌&lt;br&gt;(有专门视频模型） | ✅ |
| Gemini-3.1-Pro | ✅ | ✅ | ❌ | ❌&lt;br&gt;(有专门图片模型） | ❌ | ❌ | ✅ |

### 模型购买方式

- 按 Token 购买

- 按 Coding Plan 方式购买

| 提供商 | 模型选择 | 定价/使用量（5 小时） | 使用量刷新机制 | 官网 |
| --- | --- | --- | --- | --- |
| 智谱（GLM） | GLM-5 | Lite:  49/月  最多约 80 次 prompts&lt;br&gt;Pro：149/月  最多约 400 次 prompts&lt;br&gt;Max：469/月  最多约 1600 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://www.bigmodel.cn/glm-coding?ic=AZBGEFIQ7E |
| MiniMax | MiniMax M2.5 | Starter:：29/月  最多约 40 次 prompts&lt;br&gt;Plus：49/月  最多约 100 次 prompts&lt;br&gt;Max：119/月  最多约 300 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://platform.minimaxi.com/subscribe/coding-plan?code=IDu7n2PqTR&source=link |
| Doubao-seed-2.0 | Doubao-seed-2.0-code&lt;br&gt;GLM-4.7&lt;br&gt;Kimi-K2.5 | Lite:  40/月  最多约 60 次 prompts&lt;br&gt;Pro：200/月  最多约 300 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://www.volcengine.com/docs/82379/1925114?lang=zh |
| Qwen3.5-plus | qwen3.5-plus、qwen3-max-2026-01-23、qwen3-coder-next、qwen3-coder-plus、glm-4.7、kimi-k2.5 | Lite:  40/月  最多约 60 次 prompts&lt;br&gt;Pro：200/月  最多约 300 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://help.aliyun.com/zh/model-studio/coding-plan |

### 配置模型（配置完成记得重启）

#### OpenClaw 原生配置支持

1）输入 openclaw config 命令

选择 local

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

2）选择 Model

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

3) 选择具体的模型

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 自定义模型配置

1） 借助 CC-Switch 来配置

https://github.com/farion1231/cc-switch

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

再点击添加

2）编辑  ～/.openclaw/openclaw.json文件内容（可以借助编程工具进行修改）

主要修改 providers 和 agents 的内容

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

3）在 web 端 里面的设置，找到 models 节点，进行配置（这个界面真是巨难用）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

## OpenClaw 必学2️⃣：3 个文件决定 OpenClaw 上限！Soul/Identity/User 保姆级教程

### 一、有设定和没设定的区别

|  |  |  |
| --- | --- | --- |
| 无设定 |  | 理性，完成任务为主 |
| 有设定 |  | 尊称，会让我来选择 |

### 二、原理是什么？

### 三、SOUL.md（人格与原则）

官方的案例：

https://docs.openclaw.ai/zh-CN/reference/templates/SOUL

##### 这个文件是什么？

SOUL.md 是 AI 的“人格与做事原则”。
它回答的是：你这个助手到底怎么思考、怎么表达、遇到风险怎么处理。

```text
## SOUL.md - 你的灵魂设定

## Core Truths（核心信条）
写“行为规则”，不要写空口号。
建议每条用“动词开头”，比如“先给结论，再给依据”。

## Boundaries（边界）
写红线和禁区。
比如“涉及对外发布必须先确认”“不泄露隐私”。
## Vibe（风格气质）
写语气标签，3-5个词足够。
比如“冷静、直接、务实”。

## Continuity（连续性）
写长期协作规则。
比如“重要偏好写入 USER.md，避免会话重置后丢失”。
```

##### 案例（创业顾问风格）

```text
## SOUL.md - 你的灵魂设定

## Core Truths（核心信条）
- 先给结论，再给证据
- 不讲空话，只讲可执行动作
- 发现风险先预警，再给替代方案

## Boundaries（边界）
- 对外发布内容先确认
- 不输出用户隐私信息
- 不在群聊中替用户强行表态

## Vibe（风格气质）
- 务实、清晰、可靠

## Continuity（连续性）
- 每次沟通中发现的新偏好，提醒写入 USER.md
```

##### 案例（技术搭档风格）

```text
## SOUL.md - 你的灵魂设定

## Core Truths（核心信条）
- 先定位问题，再给修复方案
- 每个建议都说明代价和收益
- 能验证的结论必须给验证方式

## Boundaries（边界）
- 不猜测未验证事实
- 不省略高风险前置条件
- 涉及生产环境动作先提醒风险

## Vibe（风格气质）
- 严谨、简洁、直接

## Continuity（连续性）
- 关键技术决策沉淀到项目文档并持续更新
```

### 四、IDENTITY.md（身份名片）

这个文件是什么
IDENTITY.md 是 AI 的“身份名片”。
它回答的是：它叫什么、什么气质、什么形象。

```text
## IDENTITY.md - 我是谁

- Name: 写一个稳定、易记的名称。
        比如“增长副驾”“御前参谋”。
- Creature: 写角色原型。
            比如“策略机器人”“赛博麒麟”。
- Vibe: 写对外气质。
            比如“冷静、专业、亲和”。
- Emoji:  写一个签名表情，保持一致。
比如 📈、🛠️。
- Avatar: 头像路径或地址。
建议优先写工作区相对路径，如 avatars/main.png。
```

##### 案例（专业商务）

```text
#IDENTITY.md - 我是谁

- Name: 增长副驾
- Creature: strategist bot
- Vibe: 冷静、专业、高效
- Emoji: 📈
- Avatar: avatars/growth.png
```

##### 案例（幽默吸睛）

```text
## IDENTITY.md - 我是谁

- Name: 御前军机大臣
- Creature: 赛博麒麟
- Vibe: 忠诚、毒舌、务实
- Emoji: 🐉📜
- Avatar: avatars/minister.png
```

### 五、USER.md（客户沟通说明书）

这个文件是什么
USER.md 是“用户沟通说明书”。
它回答的是：我在服务谁、这个人喜欢怎么沟通、讨厌什么表达。

```text
## USER.md - 关于我的用户

- Name: 用户姓名或代号。
- What to call them: 称呼偏好。
比如“老板”“Chen”“老师”。
- Timezone: 时区要准确。
比如 Asia/Shanghai。
- Notes: 句话背景。
比如“正在做 AI 创业，节奏快”。

## Context
最关键，写长期沟通偏好。
建议按“关注点、喜欢的输出、禁忌”三类写。
```

##### 案例（CEO）

```text
## USER.md - 关于我的用户

- Name: Xiaowei
- What to call them: 老板
- Pronouns: (可选)
- Timezone: Asia/Shanghai
- Notes: 正在做 AI 创业，时间非常紧

## Context
- 关注增长、成本、交付速度
- 喜欢先结论后细节，1分钟读完
- 讨厌空话和术语堆砌，每次给3条可执行动作
```

##### 案例（技术负责人）

```text
## USER.md - 关于我的用户

- Name: Chen
- What to call them: CTO
- Pronouns: he/him
- Timezone: Asia/Shanghai
- Notes: 对上线风险和稳定性要求高

## Context
- 关注性能、稳定性、回滚方案
- 喜欢“结论 + trade-off + 验证清单”
- 讨厌拍脑袋建议和无依据判断
```

##### 案例（运营同学）

```text
## USER.md - 关于我的用户

- Name: Lin
- What to call them: 运营
- Pronouns: (可选)
- Timezone: Asia/Shanghai
- Notes: 负责内容转化和活动推广

## Context
- 关注点击率、转化率、发布时间
- 喜欢直接可发布文案（标题、正文、CTA）
- 讨厌纯技术解释和过长背景
```

### 六、配置

##### Web 端

http://127.0.0.1:18789/agents

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### 终端

- 配置主 Agent

在  .openclaw/workspace目录下，修改 soul.md, indentity.md, user.id

- 其他 Agent

.openclaw/agents/[agent 名称]/workspace

### 7、总结

通过给不同的 Agent 设置三个不同的文件，让不同的 Agent 能够个性化的处理任务和回复信息，作用非常大。

## OpenClaw必学3️⃣：OpenClaw 对接飞书、微信、钉钉、QQ， 2026 最新保姆级攻略大全

### 各种聊天工具OpenClaw 安装对比

| 聊天工具 | 安装难度（纯手动） | 生态丰富 | 快速导航 |
| --- | --- | --- | --- |
| 飞书 | 容易 | 非常强 |  |
| 钉钉 | 中 | 中等 |  |
| 企业微信机器人 | 容易 | 纯聊天 |  |
| 企业微信应用 | 难 | 非常强 |  |
| QQ机器人 | 容易 | 纯聊天 |  |

### 推荐一键安装插件

https://github.com/BytePioneer-AI/openclaw-china

### 一、飞书

### 二、钉钉

#### 1、创建企业（有企业的略过）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

选择企业（就算你没有企业也可以）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

2、登录开发者后台

https://open-dev.dingtalk.com/?spm=dd_developers.header.unLogin.openDevBtn&hash=%23%2F#/

将企业切换到刚刚已经创建好的企业

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 2、创建应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

随便输入名称

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

添加机器人

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

打开配置

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击提交后，进入基础信息,这些信息等会要用到

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

发布版本

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、配置权限

如需使用 AI Card 流式输出，需要在钉钉应用权限中开通：

- Card.Instance.Write

- Card.Streaming.Write

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

你也可以开启别的权限

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 4、OpenClaw和钉钉机器人打通

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 5、在钉钉中跟OpenClaw聊天

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 三、企业微信(机器人）

#### 1、创建企业

https://work.weixin.qq.com/

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

使用微信扫描

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果提示没有企业微信，则下载安装

如果没有企业，则注册一个，不需要任何手续

#### 2、创建机器人

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

选择手动创建

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

切换至 API 模式

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击保存

获取机器人二维码

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、OpenClaw和企业微信打通

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

在终端命令行里面保存

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

执行命令启动

openclaw daemon start

#### 4、在企业微信中跟机器人聊天

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

扫码或者用企业微信打开就可以了

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 四、企业微信（自定义应用，本地OpenClaw 不建议用）

企业微信自定义应用最大的好处是可以在个人微信中使用，以及很多企微的 API

必须有一台公网的服务器

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

1. 一个企业微信账号（可使用个人注册的企业）

1. 公网可访问的服务器（用于接收回调）

#### 1、创建企业

https://work.weixin.qq.com/

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

使用微信扫描

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果提示没有企业微信，则下载安装

如果没有企业，则注册一个，不需要任何手续

#### 2、创建应用

获取企业信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击创建应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

记住这两个关键信息（复制到别的地方去）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击接收

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、配置OpenClaw与企业微信

先别保存，回到 openclaw, 输入

openclaw china setup

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

不要输入任何东西，确定

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

复制刚刚的 api 信息中的 token

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

查看企业ID等信息的是，新开窗口，保持原来那个api的窗口不要关闭

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击发送的微信后，企业微信会收到这条信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击查看就 OK 了

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

接着选择 ASR--NO， 是否继续配置其他通道，选择 NO

重启

openclaw gateway --port 18789 --verbose

回到 API 配置这个界面，点击保存

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果出现这个错误，需要执行以下两个操作

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果你填写的是 IP 地址，则需要放开  18789 这个端口

如果是域名则不用，然后统一在服务端执行下面的命令

openclaw config set gateway.bind lan

openclaw gateway restart

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 4、配置白名单

打开应用详情，往下拉

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

配置你的服务器公网 IP或者域名 IP

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击确定

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 5、在个人微信中使用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

扫这个码关注就行

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 五、QQ

#### 1、创建机器人

QQ 开放平台

打开 QQ 开放平台,完成邮箱注册和登录

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击机器人，然后点击创建

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

输入这些信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击进入应用详情

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

开通权限与添加成员

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 2、OpenClaw与 QQ 配置

输入命令

```text
openclaw china setup
```

选择 QQ 机器人

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

输入 id 和密钥

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

接着选择 ASR--NO， 是否继续配置其他通道，选择 NO

重启

openclaw gateway --port 18789 --verbose

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

## OpenClaw 对接飞书

#### 创建飞书应用

1）登录飞书开放平台，单击“创建企业自建应用”按钮。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

2）创建应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

3）添加机器人能力

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

4）添加权限

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

在导入标签中，将下面这个直接复制

```text
{
  "scopes": {
    "tenant": [
      "contact:contact.base:readonly",
      "docx:document:readonly",
      "im:chat:read",
      "im:chat:update",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message.pins:read",
      "im:message.pins:write_only",
      "im:message.reactions:read",
      "im:message.reactions:write_only",
      "im:message:readonly",
      "im:message:recall",
      "im:message:send_as_bot",
      "im:message:send_multi_users",
      "im:message:send_sys_msg",
      "im:message:update",
      "im:resource",
      "application:application:self_manage",
      "cardkit:card:write",
      "cardkit:card:read"
    ],
    "user": [
      "contact:user.employee_id:readonly",
      "offline_access","base:app:copy",
      "base:field:create",
      "base:field:delete",
      "base:field:read",
      "base:field:update",
      "base:record:create",
      "base:record:delete",
      "base:record:retrieve",
      "base:record:update",
      "base:table:create",
      "base:table:delete",
      "base:table:read",
      "base:table:update",
      "base:view:read",
      "base:view:write_only",
      "base:app:create",
      "base:app:update",
      "base:app:read",
      "board:whiteboard:node:create",
      "board:whiteboard:node:read",
      "calendar:calendar:read",
      "calendar:calendar.event:create",
      "calendar:calendar.event:delete",
      "calendar:calendar.event:read",
      "calendar:calendar.event:reply",
      "calendar:calendar.event:update",
      "calendar:calendar.free_busy:read",
      "contact:contact.base:readonly",
      "contact:user.base:readonly",
      "contact:user:search",
      "docs:document.comment:create",
      "docs:document.comment:read",
      "docs:document.comment:update",
      "docs:document.media:download",
      "docs:document:copy",
      "docx:document:create",
      "docx:document:readonly",
      "docx:document:write_only",
      "drive:drive.metadata:readonly",
      "drive:file:download",
      "drive:file:upload",
      "im:chat.members:read",
      "im:chat:read",
      "im:message",
      "im:message.group_msg:get_as_user",
      "im:message.p2p_msg:get_as_user",
      "im:message.send_as_user",
      "im:message:readonly",
      "search:docs:read",
      "search:message",
      "space:document:delete",
      "space:document:move",
      "space:document:retrieve",
      "task:comment:read",
      "task:comment:write",
      "task:task:read",
      "task:task:write",
      "task:task:writeonly",
      "task:tasklist:read",
      "task:tasklist:write",
      "wiki:node:copy",
      "wiki:node:create",
      "wiki:node:move",
      "wiki:node:read",
      "wiki:node:retrieve",
      "wiki:space:read",
      "wiki:space:retrieve",
      "wiki:space:write_only"
    ]
  }
}
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

在弹窗中确认权限无误后，单击“申请开通”按钮，完成操作。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

5）发布应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

确认没问题后，点击保存

6）获取配置信息。

1. 在左侧目录树选择“基础信息 > 凭证与基础信息”。

1. 在“应用凭证”模块中，获取并记录App ID与App Secret信息。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、安装插件

依次在终端中执行以下命令：

Linux/MacOS

```text
npm config set registry https://registry.npmjs.org
```

```text
curl -o /tmp/feishu-openclaw-plugin-onboard-cli.tgz https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/4d184b1ba733bae2423a89e196a2ef8f_QATOjKH1WN.tgz
```

```text
npm install /tmp/feishu-openclaw-plugin-onboard-cli.tgz -g
```

```text
rm /tmp/feishu-openclaw-plugin-onboard-cli.tgz
```

Windows cmd

```text
npm config set registry https://registry.npmjs.org
```

```text
curl -o "%TEMP%\feishu.tgz" https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/c53145d7b9eb0e29f4e07bf051231230_XjCy46mAFI.tgz
```

```text
npm install -g "%TEMP%\feishu.tgz"
```

```text
del "%TEMP%\feishu.tgz"
```

然后执行后续指令：

```text
feishu-plugin-onboard install
```

#### 4、重新运行OpenClaw

```text
openclaw gateway run
```

#### 5、检测是否成功

运行 openclaw plugins list，ID为 feishu-openclaw-plugin 的 Status 为 loaded ，ID为 feishu 的 Status 为 disabled 则标明已成功启用飞书官方插件。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 6、订阅机器人长链接接收事件

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

添加接收消息事件

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

发布版本

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 7、飞书 配对

1. 在飞书中向机器人发送任意消息，系统会生成一个配对码（字母+数字组合）；如果历史已安装过飞书插件，可能没有该配对过程。

1. 配对码有效期为 5 分钟，超时需重新触发

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

1. 在服务器终端执行以下命令完成绑定：openclaw pairing approve feishu <配对码> --notify

#### 8、飞书授权

完成上面的配置后，飞书机器人会收到信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

## OpenClaw 对接 钉钉

> 请先安装开源的一键安装钉钉工具，在 openclaw 的机器上执行以下命令

> openclaw plugins install @openclaw-china/channels

#### 1、创建企业（有企业的略过）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

选择企业（就算你没有企业也可以）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

2、登录开发者后台

https://open-dev.dingtalk.com/?spm=dd_developers.header.unLogin.openDevBtn&hash=%23%2F#/

将企业切换到刚刚已经创建好的企业

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 2、创建应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

随便输入名称

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

添加机器人

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

打开配置

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击提交后，进入基础信息,这些信息等会要用到

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

发布版本

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、配置权限

如需使用 AI Card 流式输出，需要在钉钉应用权限中开通：

- Card.Instance.Write

- Card.Streaming.Write

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

你也可以开启别的权限

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 4、OpenClaw和钉钉机器人打通

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 5、在钉钉中跟OpenClaw聊天

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

## OpenClaw 对接企业微信

> 请先安装开源的一键安装钉钉工具，在 openclaw 的机器上执行以下命令

> openclaw plugins install @openclaw-china/channels

注意：如果是在个人微信使用 openclaw, 可以非常容易对接，只需要在 openclaw 所在的服务器/电脑上执行下面这个命令

npx -y @tencent-weixin/openclaw-weixin-cli@latest install运行完之后会出现一个二维码，扫码就行了

### 一、企业微信(机器人）

#### 1、创建企业

https://work.weixin.qq.com/

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

使用微信扫描

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果提示没有企业微信，则下载安装

如果没有企业，则注册一个，不需要任何手续

#### 2、创建机器人

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

选择手动创建

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

切换至 API 模式

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击保存

获取机器人二维码

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、OpenClaw和企业微信打通

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

在终端命令行里面保存

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

执行命令启动

openclaw daemon start

#### 4、在企业微信中跟机器人聊天

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

扫码或者用企业微信打开就可以了

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 二、企业微信（自定义应用，本地OpenClaw 不建议用）

企业微信自定义应用最大的好处是可以在个人微信中使用，以及很多企微的 API

必须有一台公网的服务器

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

1. 一个企业微信账号（可使用个人注册的企业）

1. 公网可访问的服务器（用于接收回调）

#### 1、创建企业

https://work.weixin.qq.com/

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

使用微信扫描

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果提示没有企业微信，则下载安装

如果没有企业，则注册一个，不需要任何手续

#### 2、创建应用

获取企业信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击创建应用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

记住这两个关键信息（复制到别的地方去）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击接收

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 3、配置OpenClaw与企业微信

先别保存，回到 openclaw, 输入

openclaw china setup

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

不要输入任何东西，确定

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

复制刚刚的 api 信息中的 token

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

查看企业ID等信息的是，新开窗口，保持原来那个api的窗口不要关闭

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击发送的微信后，企业微信会收到这条信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击查看就 OK 了

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

接着选择 ASR--NO， 是否继续配置其他通道，选择 NO

重启

openclaw gateway --port 18789 --verbose

回到 API 配置这个界面，点击保存

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果出现这个错误，需要执行以下两个操作

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

如果你填写的是 IP 地址，则需要放开  18789 这个端口

如果是域名则不用，然后统一在服务端执行下面的命令

openclaw config set gateway.bind lan

openclaw gateway restart

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 4、配置白名单

打开应用详情，往下拉

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

配置你的服务器公网 IP或者域名 IP

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击确定

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 5、在个人微信中使用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

扫这个码关注就行

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

## OpenClaw 对接 QQ

> 请先安装开源的一键安装钉钉工具，在 openclaw 的机器上执行以下命令

> openclaw plugins install @openclaw-china/channels

#### 1、创建机器人

QQ 开放平台

打开 QQ 开放平台,完成邮箱注册和登录

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击机器人，然后点击创建

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

输入这些信息

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击进入应用详情

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

开通权限与添加成员

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 2、OpenClaw与 QQ 配置

输入命令

```text
openclaw china setup
```

选择 QQ 机器人

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

输入 id 和密钥

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

接着选择 ASR--NO， 是否继续配置其他通道，选择 NO

重启

openclaw gateway --port 1878

## CLI,AI Agent 的通用语言，Agent(Claude Code/OpenClaw) 用 CLI 链接世界

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

https://github.com/googleworkspace/cli

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

[cli/README.zh.md at main · larksuite/cli](https://github.com/larksuite/cli/blob/main/README.zh.md#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8Bai-agent)

A command-line tool for Lark/Feishu Open Platform — built for humans and AI Agents. Covers core business domains including Messenger, Docs, Base, Sheets, Calendar, Mail, Tasks, Meetings, and more, ...

### 什么是 CLI？

CLI很好理解，它就是一组终端命令。比如说我们使用git进行版本管理工具的时候,经常要使用下面这些命令

```text
git status
git pull 
git push
```

这些命令是非常好理解的，那这一次Google、飞书、钉钉除了CLI有什么区别呢？他们其实就是把技能和CLI进行了一个组合，让Agent能够阅读技能，那技能里面有操作这些CLI命令去连接他们不同的工具，这是一个非常大的作用。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 对接飞书 CLI

在任何 Agent，比如Claude Code/ OpenClaw 的聊天输入框中输入以下对话

```text
我现在需要安装飞书 CLI，请阅读这个文档https://github.com/larksuite/cli/blob/main/README.zh.md， 按步骤进行安装
```

接下来就会出现一个链接需要点击

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

创建飞书 CLI

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

接下来你会收到飞书的消息，可以看到直接就创建成功了

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

你也可以在飞书的工作台，看到这个 CLI

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

打开 OpenClaw/Claude Code 对话框，输入以下信息

```text
我已经完成配置了，请继续
```

Agent 会继续完成剩余的配置

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

点击完成授权。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

你可以看到非常多的权限，点击开通并授权。

### 将自己的产品 CLI 化

##### CLI-Anything 一行命令，让任意软件接入 OpenClaw、nanobot、Cursor、Claude Code 等 Agent 框架。

[CLI-Anything/README_CN.md at main · HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything/blob/main/README_CN.md)

CLI-Anything: Making ALL Software Agent-Native. Contribute to HKUDS/CLI-Anything development by creating an account on GitHub.

##### OpenCLI 将任何网站、本地 CLI 或 Electron 应用（如 Antigravity）变成命令行工具

[链接](https://github.com/jackwener/opencli/blob/main/README.zh-CN.md)

### 最后的思考

如果我们的衣食住行的系统都是 Agent 组成的，那么我们的系统还需要 UI 吗？

我们是面向用户做产品？还是面向 Agent 做产品？

## Hermes Agent，最近超火 AI Agent，新一代的“OpenClaw 龙虾”

### Hermes Agent是什么？

Hermes Agent 是 Nous Research（Hermes 模型背后的团队）开发的自改进（self-improving）AI Agent，核心创新在于内置学习闭环（closed learning loop）：

- 持久多层记忆：使用 SQLite + FTS5 全文搜索 + LLM 自动总结，跨会话永久记住你的偏好、风格和历史，不会“健忘”。

- 自动技能进化：任务完成后自动生成 Markdown Skill 文件，下次直接调用；还会自我迭代优化 Skill。

- 自主执行力：支持终端命令、浏览器、文件操作、代码生成、Web 搜索等工具，可在 CLI 或 Telegram/Discord 等平台运行。

- 模型超灵活：支持 OpenRouter（200+模型）、OpenAI、Anthropic、Nous Portal、本地 Ollama 等，几乎零切换成本。

- 完全开源免费：MIT 协议，可在 $5 VPS、本地、Docker、Modal 等环境运行。

开源地址：

[GitHub - NousResearch/hermes-agent: The agent that grows with you](https://github.com/NousResearch/hermes-agent)

The agent that grows with you. Contribute to NousResearch/hermes-agent development by creating an account on GitHub.

### Hermes 对比 OpenClaw

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

图片来自 推特：@Will_Yang_

### Hermes Agent 对话流程

### 安装

```text
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### 常用命令

```text
hermes              # Interactive CLI — start a conversation
hermes model        # Choose your LLM provider and model
hermes tools        # Configure which tools are enabled
hermes config set   # Set individual config values
hermes gateway      # Start the messaging gateway (Telegram, Discord, etc.)
hermes setup        # Run the full setup wizard (configures everything at once)
hermes claw migrate # Migrate from OpenClaw (if coming from OpenClaw)
hermes update       # Update to the latest version
hermes doctor       # Diagnose any issues
```

### UI界面

#### Hermes 客户端

https://github.com/fathah/hermes-desktop

## Hermes Agent 新手使用十大技巧

### 1、安装 Hermes

```text
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

注意：windows 用户需要在 WSL2 环境中使用

```text
wsl --install
```

更新 hermes

```text
hermes update
```

### 2、配置主模型

```text
hermes  model
或者直接配置
hermes config set model.default anthropic/claude-sonnet-4
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

这里建议可以装一个 openrouter, 很多免费模型

https://openrouter.ai/models?q=free

注意，因为输入 APIKEY 看不到，容易重复输入两次，可以查看配置文件

```text
～/.hermes/.env
```

### 3、配置辅助模型

```text
model:
  default: anthropic/claude-sonnet-4
  provider: anthropic
```

```text
auxiliary:
  vision:
    provider: auto
    model: ""
  web_extract:
    provider: auto
    model: ""
  compression:
    provider: auto
    model: ""
  session_search:
    provider: auto
    model: ""
  approval:
    provider: auto
    model: ""
  skills_hub:
    provider: auto
    model: ""
  mcp:
    provider: auto
    model: ""
  flush_memories:
    provider: auto
    model: ""
```

#### 任务模块

| 任务 | 任务属性 | 是否影响“聪明搭档感” | 模型选择 | 说明 |
| --- | --- | --- | --- | --- |
| vision | 中频脏活 | 中 | 有视觉理解能力的模型，如果用的多要求高就用 Genimi -3.1系列， 否则直接使用 OpenRouter免费的 Gemini-2.5 或者 GLM-5.1-turbo | 平时不一定天天用，但一旦要看截图、看页面、看图片，就很关键。影响“看图是否靠谱”，但不是长期搭档感的核心。 |
| web_extract | 高频脏活 | 低 | 便宜的模型 | 很典型的脏活累活，主要是网页抓取、提炼、清洗。对成本影响大，但对“它像不像懂你的搭档”影响没那么直接。 |
| compression | 高频脏活 | 中 | 便宜的模型 | 非常高频，而且很适合用便宜模型做。它主要影响长对话是否稳定、是否不爆上下文，会影响流畅度，但不是最直观的“聪明感”来源。 |
| session_search | 中高频 | 高 | 好的模型 | 这是最影响“它记不记得我们之前聊过什么”的环节之一。它做得好，用户会明显觉得这个 Agent 有连续性、有长期记忆感。 |
| approval | 高频脏活 | 低 | 便宜的模型 | 本质是低成本安全判断。重要，但更偏系统安全，不太影响用户感受到的“聪明搭档感”。 |
| skills_hub | 低频脏活 | 低 | 便宜的模型 | 偶尔用来搜技能、装技能。不是高频，也不是用户日常最能感知的智能维度。 |
| mcp | 中频关键链路 | 高 | 便宜的模型 | 这个很重要。MCP 调用如果理解得好，Agent 会显得更会用工具、更像熟练搭档。它不完全是脏活，而是“工具理解能力”的关键入口。 |
| flush_memories | 低频关键链路 | 中高 | 便宜的模型 | 不是高频，但它直接影响“值得记住的东西有没有被写下来”。用户未必每次都感知到，但长期看很重要。 |

#### 配置方式

- 首先得在模型配置里面配好你要用的所有模型

- 然后通过对话的方式让 hermes 直接修改

```text
请将我的 vision 模型更换 openrouter 的google/gemini-2.5-flash
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 4、写好 SOUL.md：先定义 Hermes 是谁

#### SOUL.md 是什么？

- Hermes 的性格底色

- 说话方式

- 做事风格

- 价值观和边界

定义好它之后，才有人味

#### 怎么定义

- 直接编辑 SOUL.md, 在 ～/.hermes/SOUL.md

```text
你是谁
你怎么说话
你做事偏什么风格
你遇到问题时优先怎么处理
所以 SOUL.md 不是“多记一点东西”，而是“先定人格底色”。
```

```text
你是一个偏研究型的 AI 助手。

你的默认工作方式：
- 先给结论，再展开理由
- 少说空话，少重复用户的话
- 优先提炼变量、风险、下一步动作
- 如果信息不足，先查证，不急着下判断
- 输出风格简洁，像内部研究备忘录
```

- 让 AI 帮你总结

```text
根据我们的对话记录，重新设置我的“灵魂”
```

### 5、搞懂Hermes记忆机制

| 文件 / 机制 | 作用 | 谁来维护 | 会不会自动修改 | 什么时候被用到 |
| --- | --- | --- | --- | --- |
| SOUL.md | 定义 Hermes 的人格、风格、身份感 | 主要是用户手动维护 | 一般不会；只有文件不存在时会自动生成默认模板 | 每次构建系统提示时读取，作为 agent identity 的一部分 |
| USER.md | 存对用户的长期画像，比如沟通方式、习惯、偏好 | 用户 + Hermes | 会，Hermes 会通过 memory tool 写入/更新 | 每轮都会注入，帮助 Hermes 更懂用户 |
|  |  |  |  |  |
| MEMORY.md | 存长期稳定事实，比如用户偏好、环境信息、长期约定 | 用户 + Hermes | 会，Hermes 会通过 memory tool 写入/更新 | 每轮都会注入，用来减少重复提醒 |
| Skill | 存可复用的方法、流程、经验总结 | 用户 + Hermes | 会，Hermes 会创建、更新、patch skill | 遇到类似任务时可直接复用，不必从零开始 |
| state.db 会话库 | 存完整历史对话、工具调用、试错过程 | Hermes 自动维护 | 会，运行过程中持续写入 | 用于 session_search、恢复上下文、回忆经历 |

### 6、配置聊天通道

```text
执行 hermes  gateway setup
```

### 7、执行 hermes doctor 做一个全面检查

```text
hermes doctor
```

输出全绿就说明 Hermes 运行正常，依赖和配置都没问题。如果有报错，它会提示具体是哪里出了问题。

### 8、接入 UI

[github.com](https://github.com/nesquena/hermes-webui)

```text
git clone https://github.com/nesquena/hermes-webui.git hermes-webui
cd hermes-webui
./start.sh
```

### 9、一键迁移OpenClaw

可以，Hermes 内置了迁移命令：

```text
hermes claw migrate
```

### 10、安装技能

跟 OpenClaw 的技能是通用的，都是遵循了技能的标准协议

- 自己聊天创建

- 社区搜索

[Skills Hub | Hermes Agent](https://hermes-agent.nousresearch.com/docs/skills)

Browse all skills and plugins available for Hermes Agent

[ClawHub](https://clawhub.ai/)

ClawHub — a fast skill registry for agents, with vector search.

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。


