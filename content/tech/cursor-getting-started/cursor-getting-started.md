---
title: "Cursor 从零开始：安装、规则、模式与项目协作"
date: "2026-08-09"
author: "TNHTH"
section: "cursor-getting-started"
excerpt: "从安装、规则、Ask/Manual/Agent 模式到前后端项目协作，整理 Cursor 的新手路径。"
tags: ["Cursor", "AI编程", "Rules", "Agent"]
---

> 本文根据公开飞书教程整理，并将相同主题合并为一篇可连续阅读的指南。版本、价格和功能名称可能变化，操作前请以产品官方文档和当前界面为准。
>
> 原始知识库入口：[AI编程快乐屋](https://my.feishu.cn/wiki/V5slwCIkUimnjKkyJuEcJiW0nuc)。

## 原教程：Cursor知识

> 如果你是在使用手机端浏览，请点击左上角有个“ 三条杠” 图标，点击后就能展开左侧的菜单了

> 本视频合集地址：

> https://space.bilibili.com/481246113/lists/4740080?type=season

## 原教程：Cursor到底在取代谁？我们如何与Cursor协作

> 本视频观看地址：
https://www.bilibili.com/video/BV1Hfo1YJEpp/

### 一、Cursor取代产品经理？

产品经理的核心能力：

1、需求挖掘

2、战略决策

3、业务闭环

### 二、Cursor取代程序员？

1）cursor等大模型生成的代码仍然有问题，需要人工来测试

2）一个系统的发展会经历多个阶段，每个阶段对应的程序员能力要求不一样，cursor 还无法做到替换每个阶段程序员的作用，比如架构师。

3）cursor 无法独立完成一个复杂系统的设计研发，这里涉及到很多沟通和拆分。cursor等AI编程工具对话的上下文有长度限制，超过之后会降智的表现

AI生成的代码本质是“草稿”，需程序员通过单元测试、集成测试和代码审查把关质量

Cursor替换的是基础编程。如果程序员还停留在增删改查的思想，被替换的风险很大。

### 三、20分钟做个小程序/APP/网站？

一个正常的小程序或者APP需要以下能力支撑

1、前端展示系统（小程序端或者IOS、安卓等）

2、后端服务（提供给小程序，APP的逻辑处理能力）

这里还有数据库、图片存储等

3、运营/后台管理系统（管理所有展示的内容、用户等）

单独拿出来一个，都很难在20分钟做出来

20分钟可能的东西

1、工具类，比如计算器，功能单一，不需要流程

2、它只是一个原型或者没有逻辑的静态网页

### 四、AI解决“怎么做”，人类决定“做什么”

让AI成为你高效的助手，而你则负责提供创意、方向和整体架构。这才是AI编程时代的最佳工作模式

### 五、预告

从0到1用cursor 实战 微信小程序，全流程不写一行代码。

## 原教程：Cursor新手必问10大问题

> 本视频观看地址：

> https://www.bilibili.com/video/BV16LXjYHETR/

### 一、免费和收费的区别

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### 免费的限制

- 50次慢速请求完全不够用

- 只能使用 claude 3.5 sonet, 无法体验最新最强的模型

- 限制会越来越多

可使用国产 Trae

### 二、只用cursor就能开发了吗？

| 项目 | 代码工具 | 运行工具 |
| --- | --- | --- |
| 小程序 | cursor | 微信开发者工具 |
| IOS | cursor | xcode |
| 安卓 | cursor | Android studio |
| web | cursor | cursor |

### 三、如何汉化以及插件的使用

### 四、Rules

更多rules参考：

[github.com](https://github.com/xiaoweidotnet/awesome-cursor-rules-mdc/tree/main/rules-mdc)

### 五、如何解决程序错误

你能看见错误的地方：

- cursor编辑器报的错误

- 小程序、浏览器等运行工具报的错误

直接复制到对话框，发给AI

### 六、claude -3.7- sonet 以及 claude -3.7- sonet-thinking 如何选择

### 七、Ask<Edit<Agent

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 八、代码回滚

### 九、cursor 降智

可能降智的表现：

- 生成的代码文件乱放

- 给出的代码并没有按照自己的意思

- 感觉AI的回答又回到最开始，突然失忆

解决办法：

- 使用past-chats

- 提示词要描述准确，特别是你如果要改变某个页面的代码，请使用 @符号选中

- 完善的Rule规则

### 十、生成UI

- 初始情况的UI

使用标准的提示词，根据产品功能生成大部分页面的UI交互图

指定前端框架，比如element-ui 等

- 根据页面功能再进行细调

使用一些UI的词语来进行描述，比如: 居中，对齐，商务风格等

- 传入参考图

| 阶段 | 方法 |
| --- | --- |
| 初始情况的UI | 使用标准的提示词，根据产品功能生成大部分页面的UI交互图 |
|  | 指定前端框架，比如element-ui 等 |
| 局部调整或者新增页面 | 使用一些UI的词语来进行描述，比如: 居中，对齐，商务风格等 |
|  | 传入参考图，让AI模仿参考的样式和元素 |

## 原教程：Cursor 新手教程③： Cursor rules 让 AI 更懂你

> 本视频地址：
https://www.bilibili.com/video/BV1p5ZbYuEzd/

### 一、什么是cursor rules

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> ### cursor rules 中的规则文件就是你的 AI 编码助手的一份指南，它告诉 AI 如何来为你的项目编写代码，包括你使用的工具以及他们之间上如何进行组织的，这有助于 Cursor 创建更好、更准确的代码。

如果不用cursor rules , 会怎么样

> 比如你在写后端代码，返回值统一定义为这种结构

> {

> "error" : 0,

> "message: '',

> "data": {}
}

> Cursor rules 本质是减少沟通次数，用配置来规范沟通

### 二、配置cursor rules

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

- Always:  通用规则，类似公司规章制度

- Auto Attached: 自动匹配规则，通过自己配置规则，如果生成文件是否这个规则，就会被触发

- Agent Requested: Agent模式使用的时候会检测这个规则，它自己判断是否使用这个规则

- Manual: 需要自己手动指定，使用@符号发起对话的时候添加

### 三、通用Rules和自定义Rules

通用Rules，更聚焦在框架

[github.com](https://github.com/sanjeed5/awesome-cursor-rules-mdc/tree/main)

自定义Rules，更聚焦在Team自己的开发规范

比如 你是负责 用户服务的，那你可以给自己组制定对应的rules

### 四、cursor rules 生成项目

> 请按照  @flask.mdc 初始化一个项目

## 原教程：Cursor新手教程④：五分钟搞懂Ask/Manual/Agent三种模式

> 本视频地址：
https://www.bilibili.com/video/BV1EbdEYwEuL/

### 一、cursor 对代码管理的能力/工具

| 能力维度 |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| search(搜索） | codebase(代码库索引，代码库上下文搜索） | web(联网搜索） | grep(代码片段搜索） | directory（文件目录、跨文件搜素） | Search files&lt;br&gt;（搜索文件） | Read file&lt;br&gt;（读取文件） | Rules&lt;br&gt;（将规则添加到上下文） |
| Edit（编辑） | edit(编辑，reapply) | delete(删除文件） |  |  |  |  |  |
| Run(自动执行命令行） | 终端命令行 | Auto Run&lt;br&gt;(自动执行终端命令，自动合并文件） |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

| ASK模式 |
| --- |
| codebase(代码库索引，代码库上下文搜索） |
| web(联网搜索） |
| grep(代码片段搜索） |
| Read file&lt;br&gt;（读取文件） |
|  |

| Manual模式 |
| --- |
| codebase(代码库索引，代码库上下文搜索） |
| web(联网搜索） |
| grep(代码片段搜索） |
| Read file&lt;br&gt;（读取文件） |
| Rules&lt;br&gt;（将规则添加到上下文） |
|  |
| edit(编辑，reapply) |
| delete(删除文件） |

| Agent模式 |
| --- |
| 所有的search能力 |
| 所有edit能力 |
| 所有run能力 |

### 二、三种模式的配置（基于0.48.x）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 三、三种模式同一个问题的对话结果

##### Ask模式（未开启 codebase搜索）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### Ask模式（开启codebase搜索)

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### Manual模式

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### Agent模式：

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 四、三种模式使用场景总结

| Ask模式 | Manual模式 | Agent模式（所有人推荐） |
| --- | --- | --- |
| 解释代码 | 单文件代码调整，问题修复 | 1、初始化项目、生成文档、理解需求等&lt;br&gt;2、完整流程功能（前端某个接口->后端生成controller->生成逻辑->创建表&lt;br&gt;3、关联比较多&lt;br&gt;一次对话，可以多提几个问题 |
| 当codebase使用 | 精细化的问题处理，需要手动确认合并代码&lt;br&gt;【懂开发的一般自己动手了】 | 无所不能。&lt;br&gt;任务规划&lt;br&gt;批量文件修改&lt;br&gt;MCP调用&lt;br&gt;执行终端能力 |
|  |  |  |
|  |  |  |

## 原教程：Cursor新手教程⑤：Cursor降智真相+解决办法

> 本视频地址：
https://www.bilibili.com/video/BV1zbduYgEBH/

### 一、进一步退两步

你是不是经常碰到这种情况：

- 你试图修复一个小错误

- 人工智能给出一个看似合理的更改建议

- 这个修复导致其他地方出错

- 你要求人工智能修复新出现的问题

- 这又产生了另外两个问题

- 如此反复

### 二、cursor对话流程

### 三、拆解可能降智的因素

##### 1）你选择的大模型

大模型可以说是版本越大越强，需要区分的是

- Claude-3.7-sonnet 能解决大部分问题，优先使用

- Claude-3.7-sonnet-thinking  解决复杂问题，复杂的定义可以根据项目功能来定，相当于说它的能力是覆盖 非thinking模式

- 其他模型可以按需使用，简单的问题效果差不多

##### 2）你的对话模式

cursor对话模式分为三种，Ask、Manual、Agent，可以简单区分他们的场景用途

- Ask 用于咨询，代码解读

- Manual 用于修复单个文件某个细节问题

- Agent 用于处理各种复杂问题和调用MCP等

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

具体可参考我的新手教程④课程

B站

[Cursor新手教程④：五分钟搞懂Ask/Manual/Agent三种模式_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1EbdEYwEuL/)

全面了解ASK、Manual、Agent三种对话模式, 视频播放量 805、弹幕量 0、点赞数 21、投硬币枚数 9、收藏人数 39、转发人数 8, 视频作者 AI随风随风, 作者简介 分享Cursor等AI编程工具用法，分享Cursor项目实战，相关视频:[课程4] 用Cursor开发数据库真的很简单 | Agent应用 | 用Codebase解决跨文件错误，Cursor无限调用Gemini2.

[Cursor新手五分钟搞懂AskManualAgent - 小红书](https://www.xiaohongshu.com/discovery/item/67f45287000000001d0061bd?source=webshare&xhsshare=pc_web&xsec_token=YBCcin-LQoyDG9c44LfWwNLrpmqfeXpumLPsjbEkD0R0g=&xsec_source=pc_share)

3 亿人的生活经验，都在小红书

文档：

##### 3）你的账号身份，是普通还是Pro

可能商业上的考虑，会限制普通身份的使用，免费次数用完了

##### 4）cursor的软件版本

0.45-------> 0.48

软件版本代表了 cursor在优化你的对话内容不同能力。比如

| 软件版本 | 你输入的内容 | 软件本地优化后内容 |
| --- | --- | --- |
| 0.45 | 做一个修改密码功能 | 使用方法1优化内容 |
| 0.46 |  | 使用方法1，方法2 优化内容 |
| 0.47 |  | 使用方法1，方法2，方法3 优化内容 |

软件版本越大就越好吗？

不一定

##### 5）对话上下文长度

所谓的一次对话是指一个chat窗口。如果你的对话内容过长，可能会导致cursor记忆混乱 从而导致降智。

解决办法

- 每个chat 只完成一个模块的内容，比如你现在在做用户这个模块，用户模块做完之后，新开一个chat窗口，

记得用 @PastChats 进行对话汇总

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

- 主动根据cursor的提示，打开新的对话（0.48版本）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### 6）最最重要的是你的对话内容

排除以上 ”静态“ 的设置，唯一不同人不同水平就是对话内容

把对话内容分成两部分：

- 我们对cursor 定的规则，cursor rules

Cursor rules 是保证cursor返回的结果符合一定的规范，可以理解为让它不要犯原则性的问题

可参考我之前的新手课程。

B站：

[Cursor 新手教程： Cursor rules 让 AI 更懂你_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1p5ZbYuEzd/)

Cursor 新手教程: Cursor rules 让 AI 更懂你1、 什么是cursor rules2、配置cursor rules3、通用cursor rules 和自定义rules, 视频播放量 2543、弹幕量 0、点赞数 62、投硬币枚数 29、收藏人数 193、转发人数 17, 视频作者 AI随风随风, 作者简介 分享Cursor等AI编程工具用法，分享Cursor项目实战，相关视频

小红书

[Cursor 新手教程Cursor rules 让 AI 更懂你 - 小红书](https://www.xiaohongshu.com/discovery/item/67eba9bf000000001c00f00d?source=webshare&xhsshare=pc_web&xsec_token=YBmDFXWFPqyuvp_EjAGYFf_JLtnOajeLU43vs6IFdKCoE=&xsec_source=pc_share)

3 亿人的生活经验，都在小红书

文档

- 我们发送的内容

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

总结 就是 你多用流程式的话来跟cursor对话，尽量不要过于简单，让cursor就猜测你真正的需求。

多用1,2,3 这种方式。

## 原教程：Cursor Plan模式、Qoder Quest模式实战，谁是最强Plan模式？

### 声明

专业选手Kiro不参与此次比赛

### Plan模式介绍

[Planning | Cursor Docs](https://cursor.com/docs/agent/planning#agent-to-dos)

Enable Agent to create detailed implementation plans before writing code.

[Quest Mode - Qoder](https://docs.qoder.com/user-guide/quest-mode)

Quest Mode is an AI-assisted programming feature designed for complex, long-running development tasks. By describing your requirements in natural language, you can delegate tasks such as feature devel

### 特点

- 问题澄清

- 搜索代码及上下文

- 生成详细的前后端技术实现思路md文档，可编辑

- 生成TodoList

- 一次对话完成任务

### 能力

- 代码库理解搜索

- 上下文整合

- 问题澄清

### 两者一次对话产生的代码变更

#### cursor

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### Qoder

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

开始

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

Quest完成

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

错误修复了部分

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 对比

| 维度 | Cursor | Qoder |
| --- | --- | --- |
| plan文档完整度（含需求\技术\接口) | 中 | 高 |
| plan文档可读性 | 优 | 一般 |
| 问题澄清 | 有 | 无 |
| plan文档是否可编辑 | 可以 | 可以 |
| 是否生成todoList | 生成 | 生成 |
| 代码搜索及上下文组合 | 忽略了部分cursor rules，学习能力强，业务实现没有偏差 | 遵守rules，但是业务实现弱 |
| 代码生成错误数量 | 3个后端错误，前端一遍过 | 错误太多 |
| 代码生成符合业务完成度 | 高 | 中 |
| 是否完整实现Plan功能 | 完整实现 | 部分实现 |
| 总评 | 优秀 | 一般 |

## 原教程：Cursor新手系列

> 本合集视频地址：
https://space.bilibili.com/481246113/lists/5518903?type=season

## 原教程：Cursor新手看过来，Cursor如何开发前后端分离项目

> 本视频地址：

> https://www.bilibili.com/video/BV1YojdzzE77/?spm_id_from=333.1387.collection.video_card.click

### 本期视频主题

零代码使用cursor完成一个前后端分离的小项目

前端: vue3

后端: java springboot

#### 关联知识点：

### 一、前后端开发的两种模式

##### 把前端项目、后端项目放到同一个文件夹中，然后用cursor 打开这个文件夹

-project-name

-front-end

-back-end

优点：

一次agent对话能同时修改前端和后端项目

适合小的项目，或者你自己能很好的管理上下文，能及时切换新的对话

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

缺点：

1）项目大了不好管理rules文件

2）很容易挤爆上下文，经常要 “新开对话”

##### 把前端项目、后端项目放到不同文件夹中，然后用不同的cursor 打开对应的项目

Front-end

Back-end

### 二、项目初始化

前后端项目采用vue3+springboot的方式

将vue3的框架rules放到前端项目中

Spring boot 可以从https://start.spring.io/ 下载安装包，同时也把rules文件放到项目中

> 在当前目录下，根据 @vue3.mdc 初始化一个前端项目，使用yarn来管理包结构，需要支持本地API测试环境联调

> 根据 @springboot.mdc 完善项目结构信息，添加mybatis-plus

### 三、前后端的协作流程

### 四、文档阶段

如果你有需求文档和原型图，可以参考我这期视频：

这次我直接采用需求文档直接生成界面的方式，所以暂时不考虑UI精美的问题

> 我现在需要做一个移动端H5商城，产品的功能只有这几个：

> 1、用户查看商品列表页面

> 2、用户点击加减号进行购物车操作

> 3、用户浏览购物车

> 根据以上内容，帮我完成一个产品需求文档，需要包含页面设计、UI元素，技术栈。不要包含任何代码

### 五、拆分前后端任务

注： 跟cursor对话一定是任务越小越细，返回的代码质量就会越高，反之，cursor大概率会返回有问题的代码。

拆分任务的好处是我们能知道cursor会以什么样的方式来完成

#### 前端开发

> 你是具有丰富开发经验的前端开发工程师，请你阅读@xuqu.md 这个产品及UI文档，你需要完成这个产品的前端页面开发，这是一个移动端的H5页面，需要适配手机访问，请你按照你丰富的前端开发经验，拆解出详细的前端开发任务，按照以下格式保存到 doc目录中。

> - 根据开发顺序创建TASK001这样的任务编号；

> - 每个任务包含名称,任务描述、版本、状态（计划中、测试单元编写中、开发中、完成等）。

> 每个TASK都有验收标准清单和注意事项（提现用户或将来的AI助手需要注意的详细内容）

##### 启动测试

> Yarn install
Yarn dev

##### 接口统一

> @mock @api @CartView.vue @ProductListView.vue 所有的模拟接口必须写到api中，方便后面替换成真实的接口，使用mock变量来控制，是否开启mock数据，api下接口的规范如下

> /**

> * 接口名称

> * 功能描述

> * 入参

> * 返回参数

> * url地址

> * 请求方式

> **/

使用rules来约束接口的的规范

##### 安装stagewise

在插件市场，搜索stagewise，进行安装

https://github.com/stagewise-io/stagewise

安装完成后，使用快捷键：CMD + Shift + P  打开命令，搜索statewise, 按下enter键可以了

#### 后端开发

##### 先生成前端已经对接的API文档

这一步如果事先有API文档可以不用管

> @api 根据当前文件下所有的API文件生成接口文档，放到doc目录中，遵循以下格式：

> - 接口名称

> - 功能描述: 详细描述接口的功能和用途

> - 入参: 参数类型和说明

> - param1: type - 参数1说明

> - param2: type - 参数2说明

> - 返回参数: 返回值类型和说明

> - field1: type - 字段1说明

> - field2: type - 字段2说明

> - url地址: /api/endpoint

> - 请求方式: GET/POST/PUT/DELETE

会生成对应的接口文档，将接口文档和需求文档拷贝到后端项目中，开始拆分后端的开发任务

对于后端来说，数据库的设计非常重要，如果你会的话，可以自己设计，然后形成文档

##### 拆分后端任务

> 你是具有丰富开发经验的后端开发工程师，请阅读下的需求和API文档，你需要完成这个产品的后端开发，请你按照你丰富的后端开发经验，拆解出详细的后端开发任务，按照以下格式保存到 doc目录中的任务md文件中。

> 格式如下：

> - 根据开发顺序创建TASK001这样的任务编号；

> - 每个任务包含名称,任务描述、版本、状态（计划中、测试单元编写中、开发中、完成等）。

> 每个TASK都有验收标准清单和注意事项（提现用户或将来的AI助手需要注意的详细内容）

> 任务描述中不需要返回任何代码示例

> @后端开发任务.md 现在你开始执行任务，每次只能执行一个任务，执行任务完成后需要更新任务状态以及验收清单。功能和接口规范需要跟 @doc 下文档保持一致。 必须是我回复后才能继续下一项任务

### 六、启动前后端测试

告诉前端后端的服务IP地址，并更改mock未false

## 原教程：Cursor新手如何从零开始开发一个前端项目

> 本视频地址：

> https://www.bilibili.com/video/BV16p7hzSEsN/?spm_id_from=333.1387.collection.video_card.click

### 本次项目内容

一个用于生鲜订货的B2B商城，核心功能门店主可以在商城看到不同供应商发布的商品，进行下单购买，

供应商收到订单后进行发货，门店收货结束整个订单流程

### 开发流程

##### 第一步：完成通用rules和框架rules编写

- 通用rules: 对所有cursor对话都适用，核心思想 是你希望cursor每次在对话中将什么信息放到上下文中，希望它每次对话都要记住你的要求是什么

1）技术栈：告诉cursor不要偏离你定的技术栈

2）开发规范：限制cursor不要瞎想
      3）全局事件：告诉cursor每次chat必须要做的事情

4）限制： 不希望cursor做的事情

```text
---
description: 
globs: 
alwaysApply: true
---
## 项目通用规范

## 技术栈
- 使用vue3+vant框架，使用原生的js语言，不需要使用typeScript
- 尽量使用vant现有的组件
- 使用Pinia管理用户登录态、购物车数据
- 所有调用后端服务都必须使用API，目录在src/api
- 页面的组件嵌套不要超过三层
- 你在进行页面开发时，可以扫描 @README.md 的项目结构，看下是否有可用的组件或者工具方法
- 使用真实的 UI 图片，而非占位符图片（可从 Unsplash、Pexels、Apple 官方 UI 资源中选择）
## 全局事件
每次更新完文件都需要更新项目结构目录，信息在 @README.md中
你完成了一项功能开发后，需要进行git commit 操作
## 全局限制
- 没有我的允许不要使用npm run dev 启动项目
- 不要在vue页面中定义测试数据，所有的数据必须来自后端服务或者mock接口
- 不要创建测试文档
## 项目结构规则
- **分层组织**：按功能或领域划分目录，遵循"关注点分离"原则
- **命名一致**：使用一致且描述性的目录和文件命名，反映其用途和内容
- **模块化**：相关功能放在同一模块，减少跨模块依赖
- **适当嵌套**：避免过深的目录嵌套，一般不超过3-4层
- **资源分类**：区分代码、资源、配置和测试文件
- **依赖管理**：集中管理依赖，避免多处声明
- **约定优先**：遵循语言或框架的标准项目结构约定
## 通用开发原则
- **可测试性**：编写可测试的代码，组件应保持单一职责，没有我的允许不能创建测试用例
- **DRY 原则**：避免重复代码，提取共用逻辑到单独的函数或类
- **代码简洁**：保持代码简洁明了，遵循 KISS 原则（保持简单直接），每个方法行数不超过300行
- **命名规范**：使用描述性的变量、函数和类名，反映其用途和含义
- **注释文档**：为复杂逻辑添加注释，编写清晰的文档说明功能和用法
- **风格一致**：遵循项目或语言的官方风格指南和代码约定
- **利用生态**：优先使用成熟的库和工具，避免不必要的自定义实现
- **架构设计**：考虑代码的可维护性、可扩展性和性能需求
- **版本控制**：编写有意义的提交信息，保持逻辑相关的更改在同一提交中
- **异常处理**：正确处理边缘情况和错误，提供有用的错误信息 
## 响应语言
- 始终使用中文回复用户
```

- 框架rules

[awesome-cursor-rules-mdc/rules-mdc at main · sanjeed5/awesome-cursor-rules-mdc](https://github.com/sanjeed5/awesome-cursor-rules-mdc/tree/main/rules-mdc)

Curated list of awesome Cursor Rules .mdc files. Contribute to sanjeed5/awesome-cursor-rules-mdc development by creating an account on GitHub.

这里面非常多框架类的rules可以使用

##### 第二步：初始化项目及创建git,.gitigore

- Git 是用来做版本管理，能很方便的进行代码回滚和查看差异性

仍然使用非常简单的对话完成项目的初始化

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 初始化一个适用于移动端的vue项目，你可以使用vant框架

这里面的vant框架，是在做之前你就要定好，使用框架可以省很多功夫

[介绍 - Vant 4](https://vant-ui.github.io/vant/#/zh-CN/home)

A lightweight, customizable Vue UI library for mobile web apps.

如果你不知道什么是vant用什么技术框架, 你可以问Deepseek

使用了第三方框架，为了保持框架信息的实时性，你可以装一个context7 的mcp

[Context7 - Up-to-date documentation for LLMs and AI code editors](https://context7.com/)

Generate context with up-to-date documentation for LLMs and AI code editors

##### 第三步：开发页面

- 大的原则

一个页面一个页面进行开发

先整体后局部调整

按模块后者页面进行New Chat

有截图用截图，没截图用文字描述

一个页面如果很复杂，可以让cursor 先拆解页面，细分任务，这里推荐一个神奇的rule

来自：

[I created an AMAZING MODE called "RIPER-5 Mode" Fixes Claude 3.7 Drastically! - Showcase - Cursor -](https://forum.cursor.com/t/i-created-an-amazing-mode-called-riper-5-mode-fixes-claude-3-7-drastically/65516)

This has fixed just about EVERY SINGLE problem for me with Claude 3.7 in Cursor - It has turned my development into a CRACKED BEAST - I code about 12 hours a day, and I work on about 2 different Curso

中文：

[RIPER-5/RIPER-5-CN.md at main · NeekChaw/RIPER-5](https://github.com/NeekChaw/RIPER-5/blob/main/RIPER-5-CN.md)

神级Cursor Rule. Contribute to NeekChaw/RIPER-5 development by creating an account on GitHub.

```text
## RIPER-5

### 背景介绍 

你是Claude 4.0，集成在Cursor IDE中，Cursor是基于AI的VS Code分支。由于你的高级功能，你往往过于急切，经常在没有明确请求的情况下实施更改，通过假设你比用户更了解情况而破坏现有逻辑。这会导致对代码的不可接受的灾难性影响。在处理代码库时——无论是Web应用程序、数据管道、嵌入式系统还是任何其他软件项目——未经授权的修改可能会引入微妙的错误并破坏关键功能。为防止这种情况，你必须遵循这个严格的协议。

语言设置：除非用户另有指示，所有常规交互响应都应该使用中文。然而，模式声明（例如\[MODE: RESEARCH\]）和特定格式化输出（例如代码块、清单等）应保持英文，以确保格式一致性。

### 元指令：模式声明要求 

你必须在每个响应的开头用方括号声明你当前的模式。没有例外。  
格式：\[MODE: MODE\_NAME\]

未能声明你的模式是对协议的严重违反。

初始默认模式：除非另有指示，你应该在每次新对话开始时处于RESEARCH模式。

### 核心思维原则 

在所有模式中，这些基本思维原则指导你的操作：

 *  系统思维：从整体架构到具体实现进行分析
 *  辩证思维：评估多种解决方案及其利弊
 *  创新思维：打破常规模式，寻求创造性解决方案
 *  批判性思维：从多个角度验证和优化解决方案

在所有回应中平衡这些方面：

 *  分析与直觉
 *  细节检查与全局视角
 *  理论理解与实际应用
 *  深度思考与前进动力
 *  复杂性与清晰度

### 增强型RIPER-5模式与代理执行协议 

#### 模式1：研究 

\[MODE: RESEARCH\]

目的：信息收集和深入理解

核心思维应用：

 *  系统地分解技术组件
 *  清晰地映射已知/未知元素
 *  考虑更广泛的架构影响
 *  识别关键技术约束和要求

允许：

 *  阅读文件
 *  提出澄清问题
 *  理解代码结构
 *  分析系统架构
 *  识别技术债务或约束
 *  创建任务文件（参见下面的任务文件模板）
 *  创建功能分支

禁止：

 *  建议
 *  实施
 *  规划
 *  任何行动或解决方案的暗示

研究协议步骤：

1.  创建功能分支（如需要）：
    
    ```java
    git checkout -b task/[TASK_IDENTIFIER]_[TASK_DATE_AND_NUMBER]
    ```
2.  创建任务文件（如需要）：
    
    ```java
    mkdir -p .tasks && touch ".tasks/${TASK_FILE_NAME}_[TASK_IDENTIFIER].md"
    ```
3.  分析与任务相关的代码：
    
     *  识别核心文件/功能
     *  追踪代码流程
     *  记录发现以供以后使用

思考过程：

```java
嗯... [具有系统思维方法的推理过程]
```

输出格式：  
以\[MODE: RESEARCH\]开始，然后只有观察和问题。  
使用markdown语法格式化答案。  
除非明确要求，否则避免使用项目符号。

持续时间：直到明确信号转移到下一个模式

#### 模式2：创新 

\[MODE: INNOVATE\]

目的：头脑风暴潜在方法

核心思维应用：

 *  运用辩证思维探索多种解决路径
 *  应用创新思维打破常规模式
 *  平衡理论优雅与实际实现
 *  考虑技术可行性、可维护性和可扩展性

允许：

 *  讨论多种解决方案想法
 *  评估优势/劣势
 *  寻求方法反馈
 *  探索架构替代方案
 *  在"提议的解决方案"部分记录发现

禁止：

 *  具体规划
 *  实施细节
 *  任何代码编写
 *  承诺特定解决方案

创新协议步骤：

1.  基于研究分析创建计划：
    
     *  研究依赖关系
     *  考虑多种实施方法
     *  评估每种方法的优缺点
     *  添加到任务文件的"提议的解决方案"部分
2.  尚未进行代码更改

思考过程：

```java
嗯... [具有创造性、辩证方法的推理过程]
```

输出格式：  
以\[MODE: INNOVATE\]开始，然后只有可能性和考虑因素。  
以自然流畅的段落呈现想法。  
保持不同解决方案元素之间的有机联系。

持续时间：直到明确信号转移到下一个模式

#### 模式3：规划 

\[MODE: PLAN\]

目的：创建详尽的技术规范

核心思维应用：

 *  应用系统思维确保全面的解决方案架构
 *  使用批判性思维评估和优化计划
 *  制定全面的技术规范
 *  确保目标聚焦，将所有规划与原始需求相连接

允许：

 *  带有精确文件路径的详细计划
 *  精确的函数名称和签名
 *  具体的更改规范
 *  完整的架构概述

禁止：

 *  任何实施或代码编写
 *  甚至可能被实施的"示例代码"
 *  跳过或缩略规范

规划协议步骤：

1.  查看"任务进度"历史（如果存在）
2.  详细规划下一步更改
3.  提交批准，附带明确理由：
    
    ```java
    [更改计划]
    - 文件：[已更改文件]
    - 理由：[解释]
    ```

必需的规划元素：

 *  文件路径和组件关系
 *  函数/类修改及签名
 *  数据结构更改
 *  错误处理策略
 *  完整的依赖管理
 *  测试方法

强制性最终步骤：  
将整个计划转换为编号的、顺序的清单，每个原子操作作为单独的项目

清单格式：

```java
实施清单：
1. [具体行动1]
2. [具体行动2]
...
n. [最终行动]
```

输出格式：  
以\[MODE: PLAN\]开始，然后只有规范和实施细节。  
使用markdown语法格式化答案。

持续时间：直到计划被明确批准并信号转移到下一个模式

#### 模式4：执行 

\[MODE: EXECUTE\]

目的：准确实施模式3中规划的内容

核心思维应用：

 *  专注于规范的准确实施
 *  在实施过程中应用系统验证
 *  保持对计划的精确遵循
 *  实施完整功能，具备适当的错误处理

允许：

 *  只实施已批准计划中明确详述的内容
 *  完全按照编号清单进行
 *  标记已完成的清单项目
 *  实施后更新"任务进度"部分（这是执行过程的标准部分，被视为计划的内置步骤）

禁止：

 *  任何偏离计划的行为
 *  计划中未指定的改进
 *  创造性添加或"更好的想法"
 *  跳过或缩略代码部分

执行协议步骤：

1.  完全按照计划实施更改
2.  每次实施后追加到"任务进度"（作为计划执行的标准步骤）：
    
    ```java
    [日期时间]
    - 已修改：[文件和代码更改列表]
    - 更改：[更改的摘要]
    - 原因：[更改的原因]
    - 阻碍因素：[阻止此更新成功的阻碍因素列表]
    - 状态：[未确认|成功|不成功]
    ```
3.  要求用户确认：“状态：成功/不成功？”
4.  如果不成功：返回PLAN模式
5.  如果成功且需要更多更改：继续下一项
6.  如果所有实施完成：移至REVIEW模式

代码质量标准：

 *  始终显示完整代码上下文
 *  在代码块中指定语言和路径
 *  适当的错误处理
 *  标准化命名约定
 *  清晰简洁的注释
 *  格式：\`\`\`language:file\_path

偏差处理：  
如果发现任何需要偏离的问题，立即返回PLAN模式

输出格式：  
以\[MODE: EXECUTE\]开始，然后只有与计划匹配的实施。  
包括正在完成的清单项目。

进入要求：只有在明确的"ENTER EXECUTE MODE"命令后才能进入

#### 模式5：审查 

\[MODE: REVIEW\]

目的：无情地验证实施与计划的符合程度

核心思维应用：

 *  应用批判性思维验证实施准确性
 *  使用系统思维评估整个系统影响
 *  检查意外后果
 *  验证技术正确性和完整性

允许：

 *  逐行比较计划和实施
 *  已实施代码的技术验证
 *  检查错误、缺陷或意外行为
 *  针对原始需求的验证
 *  最终提交准备

必需：

 *  明确标记任何偏差，无论多么微小
 *  验证所有清单项目是否正确完成
 *  检查安全影响
 *  确认代码可维护性

审查协议步骤：

1.  根据计划验证所有实施
2.  如果成功完成：  
    a. 暂存更改（排除任务文件）：
    
    ```java
    git add --all :!.tasks/*
    ```
    
    b. 提交消息：
    
    ```java
    git commit -m "[提交消息]"
    ```
3.  完成任务文件中的"最终审查"部分

偏差格式：  
`检测到偏差：[偏差的确切描述]`

报告：  
必须报告实施是否与计划完全一致

结论格式：  
`实施与计划完全匹配` 或 `实施偏离计划`

输出格式：  
以\[MODE: REVIEW\]开始，然后是系统比较和明确判断。  
使用markdown语法格式化。

### 关键协议指南 

 *  未经明确许可，你不能在模式之间转换
 *  你必须在每个响应的开头声明你当前的模式
 *  在EXECUTE模式中，你必须100%忠实地遵循计划
 *  在REVIEW模式中，你必须标记即使是最小的偏差
 *  在你声明的模式之外，你没有独立决策的权限
 *  你必须将分析深度与问题重要性相匹配
 *  你必须与原始需求保持清晰联系
 *  除非特别要求，否则你必须禁用表情符号输出
 *  如果没有明确的模式转换信号，请保持在当前模式

### 代码处理指南 

代码块结构：  
根据不同编程语言的注释语法选择适当的格式：

C风格语言（C、C++、Java、JavaScript等）：

```java
// ... existing code ...
{
  
    
    { modifications }}
// ... existing code ...
```

Python：

```java
## ... existing code ...
{
  
    
    { modifications }}
## ... existing code ...
```

HTML/XML：

```java
&lt;!-- ... existing code ... --&gt;
{
  
    
    { modifications }}
&lt;!-- ... existing code ... --&gt;
```

如果语言类型不确定，使用通用格式：

```java
[... existing code ...]
{
  
    
    { modifications }}
[... existing code ...]
```

编辑指南：

 *  只显示必要的修改
 *  包括文件路径和语言标识符
 *  提供上下文注释
 *  考虑对代码库的影响
 *  验证与请求的相关性
 *  保持范围合规性
 *  避免不必要的更改

禁止行为：

 *  使用未经验证的依赖项
 *  留下不完整的功能
 *  包含未测试的代码
 *  使用过时的解决方案
 *  在未明确要求时使用项目符号
 *  跳过或缩略代码部分
 *  修改不相关的代码
 *  使用代码占位符

### 模式转换信号 

只有在明确信号时才能转换模式：

 *  “ENTER RESEARCH MODE”
 *  “ENTER INNOVATE MODE”
 *  “ENTER PLAN MODE”
 *  “ENTER EXECUTE MODE”
 *  “ENTER REVIEW MODE”

没有这些确切信号，请保持在当前模式。

默认模式规则：

 *  除非明确指示，否则默认在每次对话开始时处于RESEARCH模式
 *  如果EXECUTE模式发现需要偏离计划，自动回到PLAN模式
 *  完成所有实施，且用户确认成功后，可以从EXECUTE模式转到REVIEW模式

### 任务文件模板 

```java
## 背景
文件名：[TASK_FILE_NAME]
创建于：[DATETIME]
创建者：[USER_NAME]
主分支：[MAIN_BRANCH]
任务分支：[TASK_BRANCH]
Yolo模式：[YOLO_MODE]

## 任务描述
[用户的完整任务描述]

## 项目概览
[用户输入的项目详情]

⚠️ 警告：永远不要修改此部分 ⚠️
[此部分应包含核心RIPER-5协议规则的摘要，确保它们可以在整个执行过程中被引用]
⚠️ 警告：永远不要修改此部分 ⚠️

## 分析
[代码调查结果]

## 提议的解决方案
[行动计划]

## 当前执行步骤："[步骤编号和名称]"
- 例如："2. 创建任务文件"

## 任务进度
[带时间戳的变更历史]

## 最终审查
[完成后的总结]
```

### 占位符定义 

 *  \[TASK\]：用户的任务描述（例如"修复缓存错误"）
 *  \[TASK\_IDENTIFIER\]：来自\[TASK\]的短语（例如"fix-cache-bug"）
 *  \[TASK\_DATE\_AND\_NUMBER\]：日期+序列（例如2025-01-14\_1）
 *  \[TASK\_FILE\_NAME\]：任务文件名，格式为YYYY-MM-DD\_n（其中n是当天的任务编号）
 *  \[MAIN\_BRANCH\]：默认"main"
 *  \[TASK\_FILE\]：.tasks/\[TASK\_FILE\_NAME\]\_\[TASK\_IDENTIFIER\].md
 *  \[DATETIME\]：当前日期和时间，格式为YYYY-MM-DD\_HH:MM:SS
 *  \[DATE\]：当前日期，格式为YYYY-MM-DD
 *  \[TIME\]：当前时间，格式为HH:MM:SS
 *  \[USER\_NAME\]：当前系统用户名
 *  \[COMMIT\_MESSAGE\]：任务进度摘要
 *  \[SHORT\_COMMIT\_MESSAGE\]：缩写的提交消息
 *  \[CHANGED\_FILES\]：修改文件的空格分隔列表
 *  \[YOLO\_MODE\]：Yolo模式状态（Ask|On|Off），控制是否需要用户确认每个执行步骤
    
     *  Ask：在每个步骤之前询问用户是否需要确认
     *  On：不需要用户确认，自动执行所有步骤（高风险模式）
     *  Off：默认模式，要求每个重要步骤的用户确认

### 跨平台兼容性注意事项 

 *  上面的shell命令示例主要基于Unix/Linux环境
 *  在Windows环境中，你可能需要使用PowerShell或CMD等效命令
 *  在任何环境中，你都应该首先确认命令的可行性，并根据操作系统进行相应调整

### 性能期望 

 *  响应延迟应尽量减少，理想情况下≤30000ms
 *  最大化计算能力和令牌限制
 *  寻求关键洞见而非表面列举
 *  追求创新思维而非习惯性重复
 *  突破认知限制，调动所有计算资源
```

##### rules文件

附件：rules.zip

## 原教程：GIT新手使用指南

下面是为新手准备的 **Windows 和 macOS 双平台 Git 安装与入门使用教程**，内容简洁易懂，附带操作示意图和常见场景示例。

##### 一、安装 Git

###### Windows 系统

1. 下载安装包访问官网：https://git-scm.com/download/win→ 点击下载自动适配的安装程序（如 Git-2.xx.x-64-bit.exe）。

1. 安装步骤

- 双击安装包，一路点击 **Next**（以下关键步骤需注意）：

- 选择组件：勾选 Git Bash Here 和 Git GUI Here（右键菜单增强）。

- 选择默认编辑器：推荐选 VS Code 或 Nano（新手避免选 Vim）。

- 调整 PATH 环境：选 **Git from the command line and also from 3rd-party software**（允许全局使用 git 命令）。

- 行尾转换：选 **Checkout Windows-style, commit Unix-style line endings**（兼容性最佳）。

- 终端模拟器：选 **Use MinTTY**（更好看的终端）。

- 最后点击 Install 完成安装。

1. 验证安装打开 命令提示符 或 Git Bash，输入：

```text
git --version
```

显示版本号（如 git version 2.40.1）即成功。

###### macOS 系统

1. 方法一（推荐）：使用 Homebrew打开终端输入：

```text
brew install git
```

1. 方法二：官方安装包下载地址：https://git-scm.com/download/mac→ 双击 .dmg 文件安装。

1. 验证安装终端输入：

```text
git --version
```

##### 二、配置 Git（Windows/macOS 通用）

首次使用需设置用户名和邮箱（提交代码时显示身份）：

```text
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱@example.com"
```

📌 提示：

配置保存在 ~/.gitconfig 文件（可通过 git config --list 查看）。

##### 三、Git 基础使用流程

###### 场景 1：本地创建仓库并提交代码

1. 初始化仓库打开终端，进入项目文件夹：

```text
cd ~/projects/my-app  # 切换到你的项目目录
git init               # 初始化 Git 仓库
```

1. 添加文件到暂存区创建文件（如 README.md），然后执行：

```text
git add README.md      # 添加单个文件
## 或添加所有修改的文件
git add .              # 注意末尾的“.”
```

1. 提交更改

```text
git commit -m "第一次提交：添加 README 文件"
```

###### 场景 2：连接远程仓库（以 GitHub 为例）

1. 创建远程仓库登录 GitHub → 点击 New repository → 输入仓库名（如 my-app）→ 点击 **Create**。

1. 本地关联远程仓库复制仓库 HTTPS 地址（如 https://github.com/你的用户名/my-app.git），在终端执行：

```text
git remote add origin https://github.com/你的用户名/my-app.git
```

1. 推送代码到 GitHub

```text
git push -u origin main   # 首次推送需加 `-u`
```

输入 GitHub 账号密码（或 Personal Access Token）完成推送。

###### 场景 3：克隆远程仓库

```text
git clone https://github.com/用户名/仓库名.git
cd 仓库名  # 进入项目目录
```

##### 四、常用命令速查表

| 命令 | 作用 |
| --- | --- |
| git status | 查看仓库状态（红字未暂存/绿字已暂存） |
| git diff | 查看文件具体修改内容 |
| git log | 查看提交历史 |
| git pull | 拉取远程更新（多人协作必备） |
| git branch | 查看分支（-a 查看所有分支） |
| git checkout -b 新分支名 | 创建并切换分支 |
| git reset HEAD~1 | 撤销最近一次提交 |

##### 五、图形化工具推荐（可选）

- VS Code 内置 Git：支持可视化提交/推送/拉取（新手友好）。

- GitHub Desktop：https://desktop.github.com（跨平台图形客户端）。

- Sourcetree：https://www.sourcetreeapp.com（高级功能更全）。

##### 六、避坑指南

1. 提交报错邮箱不匹配检查 git config --global user.email 是否与 GitHub 注册邮箱一致。

1. git push** 失败提示无权限**

- 确认远程地址是否正确：git remote -v

- 使用 SSH 替代 HTTPS（更安全）：→ 生成 SSH 密钥：ssh-keygen -t ed25519→ 将公钥（~/.ssh/id_ed25519.pub）添加到 GitHub。

1. 文件未跟踪（Untracked）新文件需先执行 git add 再提交。

##### 总结

- 安装：按步骤选择关键配置项（尤其 Windows 的 PATH 设置）。

- 使用：记住核心流程 add → commit → push。

- 协作：开始前先 git pull 避免冲突。

通过以上步骤，你已掌握 Git 的基础操作！后续可深入学习分支管理、合并冲突解决等进阶内容。

## 原教程：【Cursor保姆级教程】零基础小白从安装到实战，手把手教你玩转AI编程神器！

### 一、什么是AI编程？

以前的编程是靠专业技术人员+学习至少一门擅长的编程语言去写程序

现在是通过对话聊天+AI大模型写程序

对话+AI大模型=AI编程

所有的模型对话上下文都有长度限制，这也是目前AI编程一个短板所在

### 二、Cursor免费和收费的区别，怎么充值？

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

| 模式 | 特点 |
| --- | --- |
| 免费 | 只能使用差的模型，没法使用最强的编程模型&lt;br&gt;每个月只能使用50次请求&lt;br&gt;可能还会有更多限制&lt;br&gt;cursor免费用户的限制随着时间一直在增加 |
| 月度会员Pro | 无限次tab使用&lt;br&gt;500次高速请求&lt;br&gt;可使用各种最好的编程模型&lt;br&gt;可以使用MAX模式 |

### 三、市面上流行的AI编程IDE区别和对比

| IDE名称 | 收费方式 | 支持的模型 | 推荐 | 网址 |
| --- | --- | --- | --- | --- |
| Cursor | 免费受限&lt;br&gt;月付费20美金&lt;br&gt;支持年付费 | Claude 系列&lt;br&gt;Google 系列&lt;br&gt;OpenAPI系列&lt;br&gt;DeepSeek系列 | 第一选择&lt;br&gt;最强AI编程IDE&lt;br&gt;最强编程模型&lt;br&gt;接入新模型的速度非常快&lt;br&gt;适合专业开发 | https://www.cursor.com/pricing |
| Windsurf | 免费受限&lt;br&gt;月付费15美金 | Claude 系列【最近被claude禁止使用】&lt;br&gt;Google 系列&lt;br&gt;OpenAPI系列&lt;br&gt;DeepSeek系列 | 第二选择&lt;br&gt;目前claude公司已经禁止向windurf提供模型服务，这是一个隐患 | https://windsurf.com/pricing |
| 字节Trae国际版 | 免费受限&lt;br&gt;月付费10美金 | Claude 系列&lt;br&gt;Google 系列&lt;br&gt;OpenAPI系列&lt;br&gt;DeepSeek系列 | 第三选择，还在成长阶段&lt;br&gt;首充3美元，可以试试 | https://www.trae.ai/ |
| 字节Trae国内版 | 完全免费 | 豆包系列&lt;br&gt;DeepSeek系列 | 做些小东西可以，适合入门 | https://www.trae.com.cn/ |
| 阿里灵码 | 完全免费 | Qwen系列&lt;br&gt;DeepSeek系列 | 做些小东西可以，适合入门 | https://lingma.aliyun.com/ |

### 四、Cursor界面介绍及插件安装

1、优先安装中文插件，重启后生效

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

2、安装一些常用插件，格式化，vue这些

3、界面介绍

### 五、Cursor 应该选择什么样的模型?

| 主要使用的编程模型 | 使用场景推荐 |
| --- | --- |
| claude-4-sonnet | 能应付90%的需求，适合细节调整 |
| claude-4-sonnet-thinking | 适合规划，大的模块第一次设计，后面调整使用claude-4-sonnet |
| claude-3.7-sonnet 系列 | 上面效果不好，可以试试 |
| Gemini-pro-0506 以上 | 上面效果不好，可以试试 |
| MAX | 暂时不推荐，除非你能清楚大概会花费的请求次数 |

### 六、Cursor 对话模式和@操作符

| 对话模式 | 使用场景 |
| --- | --- |
| Agent | 最强模式，啥都能干，能调用MCP，但有时候也会过于”聪明“，推荐使用 |
| Manual | 调单个页面，或者细节。有编程经验的人可以使用 |
| Ask | 咨询，答疑，不会改你的代码 |

| @常用命令符 | 使用场景 |
| --- | --- |
| file | 将指定文件放入到上下文中 |
| folder | 指定文件夹放入到上下文中 |

### 七、Cursor是怎么计费的？

- 不打开MAX模式就叫普通模式

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

- 打开了MAX模式，只能用支持MAX模式的大模型

这里以按月付费为例子

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

假设你是6月1号购买月度会员，那么6月1号到7月1号，你会有500次的高速请求次数。

6.1-----7.1  时间到了，你没用完次数，则会清零，7.1开始就是普通会员。

6.1-----7.1  时间段内，你用完了次数，可以继续使用无限制慢速请求（需要排队才会出结果），使用MAX模式需要额外付费

6.1-----7.1  时间段内，你还有次粗，则可以使用普通模式和MAX模式，这两种模式都会消耗次数，不需要额外付钱,但MAX模式消耗的次数是根据token数计算，是动态的

例子：使用Max消耗 25个请求，产生11个文件

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

使用普通thinking模式，消耗2个请求，产生10个文件

| 模式 | 模型 | 对话次数 | 页面数 | 预计消耗请求次数 |
| --- | --- | --- | --- | --- |
| 普通模式 | claude-4-sonnet | 一次 | 7 | 1（固定次数） |
|  | claude-4-sonnet-thinking | 一次 | 10 | 2（固定次数） |
| Max模式 | claude-4-sonnet MAX | 一次 | 11 | 25（不固定，看复杂度） |

### 八、Cursor Rules的使用

详细了解：

举个例子，你在做后台管理系统：

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

你可以设置一个全局的rules

```text
所有的el-table表格宽度必须是100%
```

| RuleType类型 | 用法 |
| --- | --- |
| always | 每次都会把内容加入到上下文中 |
| manual | 需要你手动@ 进去 |
| agent | 让cursor根据你的描述自己判断是否加入到上下文中 |
| Auto attached | 根据文件后缀匹配是否要加入到上下文中 |

### 九、高效率对话技巧及开发方式

```text
你的目标是做个什么功能
功能描述：
1、.....
2、.....
3、.....
具体要求
1、.....
2、.....
3、.....
禁止要求
1、.....
2、.....
3、.....
```

### 十、总结

### 十一、实战

## 原教程：最好用的AI编程工具，Cursor保姆级入门与实战

### 回顾：

#### Trae

[AI编程工具Trae,保姆级入门与实战_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ezewzPEPt/)

Trae是字节海外团队出品，Trae 分为国际版和国内版，我们这里讲的是国际版。下载之后进行安装，账号登陆和注册需要开魔法，平时使用不用开界面介绍Rules与MCP安装上下文浏览器SOLO模式整体评价00:00 介绍与计费02:23 界面06:11 上下文15:40 rule与MCP19:02 Agent22:37 实战28:54 总结便宜、简单、大模型齐全Todolist, Memory 这些都

#### Windsurf

[最坎坷AI编程工具Windsurf，保姆级入门与实战_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1gLYozLEqq/)

Windsurf 是一款由 Codeium 打造的革命性 AI 编程工具，被誉为“下一代智能代码编辑器”。它不仅是一个代码补全工具，更是一个能与开发者协同工作的智能伙伴!通过其独有的 Cascade 技术，Windsurf 能够深入理解你的代码库，自动化生成代码、调试错误、管理多文件编辑，甚至直接运行终端命令，极大地提升开发效率。套餐界面对话RulesMemoriesMemories和Rules的

#### Augmentcode

[超越Cursor,AugmentCode保姆级入门与实战_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ZseCz9EKU/)

AugmentCode 是一款超越Cursor的AI编程工具，能胜任大中小任何项目，它就像一个技术深厚、低调又严谨的高级工程师，能稳定的处理各种项目需求与问题解决。我跟它的工作方式，往往是发一个需求，然后就去做别的事情，过一会儿再过来，它一定准确又高效的完成了这个功能。, 视频播放量 2370、弹幕量 2、点赞数 43、投硬币枚数 24、收藏人数 80、转发人数 5, 视频作者 AI随风随风, 作

### 安装

[Cursor - The AI Code Editor](https://cursor.com/)

Built to make you extraordinarily productive, Cursor is the best way to code with AI.

安装完成后，第一步先完成中文化

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 套餐

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

简单的任务用claude-4-sonnet

复杂的任务可以考虑用thinking

尽量自己拆解流程，减少AI的思考

### 界面及操作介绍

- 三栏结构

- 模式：Agent/Ask 自定义

- 模型的选择: claude、gpt-5、gemini

- 设置

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### Tab tab

### 上下文

- @符号 添加上下文

- 截图

上下文长度，自动压缩

### Rules

### MCP

### Memories

### 多AGENT

### Cursor CLI

### 实战

> #任务

> 我想做一个PC页面，主要的功能是将用户在网页上通过鼠标画的草图转换成好看的卡通图片

> #流程

> 页面的左侧是绘画区域，通过鼠标可以进行绘画，中间是一个按钮，点击按钮调用大模型的API 进行图片转换。重复点击按钮可以重复生成图画.

> 你需要帮我生成一段提示词，用于接口调用

> #接口

> 调用的API接口来自openrouter

> 接口示例

> const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {

> method: "POST",

> headers: {

> "Authorization": "Bearer sk-REDACTED",

> "HTTP-Referer": window.location.origin,

> "X-Title": "Sketch to Cartoon Tool",

> "Content-Type": "application/json"

> },

> body: JSON.stringify({

> "model": "google/gemini-2.5-flash-image-preview",

> "messages": [

> {

> "role": "user",

> "content": [

> {

> "type": "text",

> "text": "请将这个手绘草图转换成精美的卡通风格图片。要求：1) 保持原始草图的基本轮廓和构图；2) 使用明亮、鲜艳的卡通色彩；3) 添加可爱的卡通化细节；4) 背景要简洁美观；5) 整体风格要温馨可爱。请直接生成转换后的卡通图片，不要添加文字解释。"

> },

> {

> "type": "image_url",

> "image_url": {

> "url": data:image/png;base64,${base64Image}

> }

> }

> ]

> }

> ],

> "modalities": ["image", "text"],

> "max_tokens": 1000

> })

> });

> 我的ApiKey是:

> sk-REDACTED

> #注意

> 注意调用大模型的接口的参数和返回参数的解析，要使用base64的方式来传递和接收图片

### 总结

Cursor虽然经历了定价风波后，很多开发者陆续离开，选择了其他平台，但综合各种因素，它仍然是最好用的AI编程工具

| AI编程工具 | 推荐指数 | 定价 | 模型 | 新手入门难度 | 是否生成TodoList | 上下文能力 | 项目选择 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Trae | ⭐️⭐️⭐️ | 10美元/月 | 所有主流模型。一次对话一次请求 | 极低 | 部分生成 | 较弱 | 纯前端或者纯后端，小项目，MVP |
| Windsurf | ⭐️⭐️⭐️⭐️ | 15美元/月 | 所有主流模型，Claude模型双倍请求 | 极低 | 完全生成 | 一般 | 中小型项目都能胜任 |
| AugmentCode | ⭐️⭐️⭐️⭐️⭐️ | 50美女/月 | Claude sonnet 4/GPT 5 | 极低 | 完全生成 | 超强 | 任何项目 |
| Cursor | ⭐️⭐️⭐️⭐️⭐️ | 按token计算 | 所有主流模型，Claude模型 | 极低 | 完全生成 | 超强 | 任何项目 |
| RooCode |  |  |  |  |  |  |  |
| CodeBuddy |  |  |  |  |  |  |  |
| Copilt |  |  |  |  |  |  |  |

## 官方核验与版本边界

安装和首次设置请看 [Cursor 官方安装文档](https://docs.cursor.com/get-started/installation)，基础操作可对照 [Cursor Quickstart](https://docs.cursor.com/en/get-started/quickstart)。Agent、规则、@Docs/@Web 和 CLI 的具体名称会随版本调整，当前行为以 [Cursor 官方文档](https://docs.cursor.com/get-started) 为准。

