---
title: "AI 编程模型评测：版本与产品线历史样本（二）"
date: "2026-08-09"
author: "TNHTH"
section: "ai-model-evaluation"
excerpt: "整理飞书知识库中的 AI 编程模型评测，保留版本背景、使用体验与选型方法；具体能力请以官方最新文档和实测为准。"
tags: ["AI编程", "模型评测", "大模型", "历史资料"]
---

> 本文是公开知识库的模型评测资料整理，原始内容带有明显的版本时间线。模型名称、能力、上下文长度、可用平台和接口都会变化，本文只适合作为历史参考；实际选型请以模型厂商在 **2026-08-09** 发布的官方文档、控制台和服务条款为准。
>
> 合并规则：相同模型或相近结论已合并，重复的导流、价格和个人推广信息已去除；原文中无法由官方资料确认的体验判断保留为“作者实测/历史样本”，不当作当前承诺。

## GLM4.7 正式发布，编程能力大加强

> 本文根据公开飞书教程整理，原始页面：[GLM4.7 正式发布，编程能力大加强](https://my.feishu.cn/wiki/B8E5w7joviBUAJkwZvPcpE4Knth)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### 评分

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 做一个三人斗地主的 html游戏,使用 react 框架，要符合斗地主的规则。同时具备背景声音

> 需要包含以下音效：发牌声、玩家叫地主声、玩家抢地主声、玩家出牌声（包括单牌、对子、三张、顺子、连对、三带一、四带二、炸弹、春天等）、游戏胜利/失败提示音。另外，请提供至少三首不同风格的背景音乐，并允许玩家在游戏设置中选择是否开启背景音乐以及切换音乐。

> 请使用中文语音及中文界面

> 我是一家生产儿童玩具的厂商，我现在需要制作一个公司官网，请帮我用 nextjs 来实现，官网风格要充满童趣

### 后端测试

### 需求

- 初始需求

> 背景




> 任务

> 你现在需要完成两个功能的设计与开发，并给出接口文档。





> - 退款接口


> 比如付款10元，使用的是5元余额，5元微信。则退款需要退5元到余额，5元微信退款

> 数据库设计

> 根据上面的业务场景，进行数据库设计，数据库使用mysql

- 进阶需求


附件：java.md

#### 对话轮次

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

| 对话轮次 | GLM-4.7 | GLM-4.6 | GPT-5.2-codex | Claude opus 4.5 | Claude sonnet4.5 | Gpt-5.1-codex |
| --- | --- | --- | --- | --- | --- | --- |
| 第1 轮 | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;需求理解有差异，没有提供controller 接口&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;❌ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
| 需求升级 |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

### 总结

|  | 前端 UI展示 能力 | 前端逻辑能力 | 后端逻辑能力 |
| --- | --- | --- | --- |
| Claude opus-4.5 | S | S | S+ |
| Claude Sonnet-4.5 | S- | A+ | S |
| Gemini-3-pro | S+ | S- | A |
| gpt-5.1-codex-max | A | S- | S |
| GPT-5.2 | A | A | S |
| GPT-5.2-codex | A+ | A | S |
| GLM-4.7 | A+ | A | S- |

GLM-4.7 在前后端能力上都比 GLM-4.6 有不错的提升，特别是后端能力，在本次测试中，跟 GPT5.2， sonnet4.5 能力非常接近。

但 GLM-4.7在生成后端代码（java) 时，第一次生成总会有 很多语法错误，需要自检修复，而GPT5.2， sonnet4.5  第一次生成代码都非常准确

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

总之，国产模型在各方面都有很大的进步，可以成为编码的次主力

## MiniMax-2.1，前后端编程测试，编程综合能力大加强

> 本文根据公开飞书教程整理，原始页面：[MiniMax-2.1，前后端编程测试，编程综合能力大加强](https://my.feishu.cn/wiki/Q5QkwPvb8i8ez9kfQ8Vc8E9Onqh)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### 评分

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

[MiniMax M2.1: 大幅提升多语言编程，为真实世界复杂任务而生 - MiniMax News](https://minimaxi.com/news/minimax-m21)

研究 文本 MiniMax M2.1 NEW MiniMax M2 语音 MiniMax Speech 2.6 NEW MiniMax Speech 02 视频 MiniMax Hailuo 2.3 / 2.3 Fast NEW 音乐 MiniMax Music 2.0 NEW 产品 AI原生应用 Agent NEW 海螺视频 语音 星野 开放平台 即刻接入AI能力 文档中心 Coding Pla

### 测试工具

ClaudeCode+thingking 默认打开

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 前端测试

#### UI美观能力测试

> 我是一家生产儿童玩具的厂商，我现在需要制作一个公司官网，请帮我用 nextjs 来实现，官网风格要充满童趣

#### CSS与动效

> 请使用 React 和 CSS 实现一个具有 3D 翻转动效的信用卡输入组件。

> 视觉要求：

> 屏幕上有一个看起来很真实的信用卡 UI（正面包含卡号、姓名、有效期；背面包含磁条和 CVC）。

> 下方是对应的输入表单。

> 交互核心：

> 当用户点击表单里的“CVC 安全码”输入框时，上方的信用卡需要平滑地进行 180度 3D 翻转，展示卡片背面。

> 当用户点击其他输入框（如卡号）时，卡片要翻转回正面。

> 输入卡号时，卡片上的数字要实时同步更新，并自动按 4 位空格格式化。

#### 前端逻辑能力测试

> 请帮我用 React 开发一个三人斗地主的小游戏。

> 核心要求：

> 1. 规则：符合中国标准的斗地主规则（包括炸弹、顺子、飞机、王炸等牌型判断）。

> 1. 流程：要有洗牌、发牌、叫地主/抢地主、出牌、结算这几个完整阶段。

> 1. 体验：

- 界面要看着像个正经游戏，不要太丑。

- 必须要有音效（背景音乐 + 出牌语音）。

- 需要有简单的 AI 跟我对打，不然一个人没法玩。

> 请使用中文语音及中文界面

#### 图片转网页能力测试

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 请仔细查看这个图片，使用 minimax mcp 插件将图片切成 react h5 网页，保证结构，元素，内容不变，图片你可以使用开源图片

注意：上面图片转网页需要安装 minimax 的图片识别MCP 插件，详细内容：

[Coding Plan MCP使用指南 - MiniMax 开放平台文档中心](https://platform.minimaxi.com/docs/guides/coding-plan-mcp-guide)

本文档介绍 Coding Plan 专属的 MCP 工具，包括网络搜索和图片理解功能，帮助开发者在 AI 编码场景中快速集成这些能力。

#### Canvans 测试

> 我需要一段炫酷的 HTML5 Canvas 代码，实现鼠标点击触发粒子爆炸的效果。

> 具体要求：

> 1. 全屏黑色背景。

> 1. 交互：当我在画布任意位置点击鼠标时，在点击点生成 50-100 个彩色小粒子。

> 1. 物理动效：

- 粒子生成时，向四面八方随机炸开（拥有不同的初速度和方向）。

- 随后，粒子受到重力影响开始下落。

- 粒子在移动过程中逐渐变小并消失（透明度降低）。

> 1. 性能：必须使用 requestAnimationFrame 实现流畅的动画循环，并且要记得清理屏幕外的粒子以防止内存泄漏。

#### 0 到 1 APP 开发能力

> 请使用 IOS 原生 实现一个“精品咖啡店点单 App”的主界面和购物车逻辑。

> 功能需求：


> 1. 分类筛选：顶部有一个横向滚动的分类栏（如：拿铁、美式、手冲、甜点），点击可过滤下方列表。

> 1. 购物车悬浮条：屏幕底部固定一个悬浮条。

- 左侧显示已选商品的总数量和总金额。

- 右侧是“去结算”按钮。

> 1. 逻辑核心：点击商品的“+”号，购物车数量和金额必须正确累加。如果数量大于 0，商品卡片上应显示减号和当前选择数量。

> 1. 设计风格：采用棕色/米色调的各种咖啡配色。

> 注意：

> 完成功能代码编写，请执行编译，编译没任何问题才算完成任务

#### 前端测试结果总结

| MiniMax-M2.1 | UI美观能力测试 | S |
| --- | --- | --- |
|  | CSS与动效 | S |
|  | 前端逻辑能力测试 | A |
|  | 图片转网页能力测试 | A |
|  | Canvans 测试 | S |
|  | 0 到 1 APP 开发能力 | S- |

### 后端测试

#### 从0到1开发能力

后端测试分两部分：

第 2 部分是，在这个项目基础上进行功能升级，测试模型在经历了上面的大量代码生成之后是否还能理解需求的含义，进行架构的升级

- 初始需求

> 角色背景
你现在是一名 Java 后端开发。我们的技术栈是 Spring Boot 3 + Java 17 + MyBatis Plus + MySQL。

> 业务背景




> 任务

> 你现在需要完成两个功能的设计与开发，并给出接口文档。





> - 退款接口


> 比如付款10元，使用的是5元余额，5元微信。则退款需要退5元到余额，5元微信退款

> 数据库设计

> 根据上面的业务场景，进行数据库设计，数据库使用mysql

#### 架构升级能力


附件：java.md

##### 对话轮次

| 对话轮次 | Minimax-M2.1 | Minimax-m2 | Claude opus 4.5 | Gemini-3-pro | Claude sonnet4.5 | Gpt-5-codex |
| --- | --- | --- | --- | --- | --- | --- |
| 第1 轮 | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;生成的代码不完整，有接口没实现&lt;br&gt;mapper 文件有语法错误&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;❌ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ | 1️⃣框架搭建&lt;br&gt;提示词：&lt;br&gt; 需求文档，&lt;br&gt;java 开发规范文档&lt;br&gt;✅ |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
| 需求升级 |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

#### 代码BUG查找及修复能力

```text
刚才的代码写得不错。在继续开发之前，我需要你帮我 Review 一段隔壁组同事写的代码。这是一个简单的余额扣减功能，但在昨天的压力测试中出现了严重的**数据不一致（超扣）**问题。
有问题的代码片段：
Java
public void deductBalance(Long userId, BigDecimal amount) {
    // 1. 查询用户钱包
    UserWallet wallet = walletMapper.selectById(userId);
    // 2. 检查余额if (wallet.getBalance().compareTo(amount) >= 0) {
        // 3. 计算新余额
        wallet.setBalance(wallet.getBalance().subtract(amount));
        // 4. 更新数据库
        walletMapper.updateById(wallet);
    } else {
        throw new RuntimeException("余额不足");
    }
}
请回答：
请准确指出这段代码在高并发场景下为什么会出 Bug？请用具体的执行时序来解释。
请给出 3 种不同维度 的解决方案，并写出其中最优方案的具体代码实现。
```

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 后端测试结果总结

| MiniMax-2.1 | 从0到1框架开发能力 | S- |
| --- | --- | --- |
|  | 架构升级能力 | S |
|  | 代码BUG查找及修复能力 | S |

### 结论

|  | 前端 UI展示 能力 | 前端逻辑能力 | 后端逻辑能力 |
| --- | --- | --- | --- |
| Claude opus-4.5 | S | S | S+ |
| Claude Sonnet-4.5 | S- | A+ | S |
| Gemini-3-pro | S+ | S- | A |
| gpt-5.1-codex-max | A | S- | S |
| GPT-5.2 | A | A | S |
| GPT-5.2-codex | A+ | A | S |
| GLM-4.7 | A+ | A | S- |
| MiniMax-2.1 | S | A | S- |

Minimax-2.1 在 UI 能力上进步非常大，一些测试场景跟 Gemini-3-pro 不相上下，但是前端逻辑能力以及从 0 到 1 完整项目的生成能力上不如Gemini-3-pro和 sonnet4.5。

Minimax-2.1 在后端代码的生成上，比 2.0 版本进步巨大，但也存在一些包丢失需要自我编译修复的问题

总的来看，Minimax-2.1 和 GLM-4.7 跟 Gemini-3-pro 以及Claude Sonnet-4.5 都还有一些差距，不过这些差距在逐步减少，值得期待！

## MiniMax 2.5 发布，全栈工程师来了

> 本文根据公开飞书教程整理，原始页面：[MiniMax 2.5 发布，全栈工程师来了](https://my.feishu.cn/wiki/X1RFw68OHi5Vm7kYUXYcKq9Ynhc)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### MiniMax 2.5 特点

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 测试案例

注意：

本次测试客户端安排如下：

- MiniMax-2.5  Claude Code

- Claude Opus-4.6 Windsurf

- GPT-5.3-codex CodexApp

所有的案例都会先通过 /plan 模式拿到最详细的开发需求

部分例子会开启 agent teams，查看 minimax 在 teams 下的运行效果

#### 纯前端测试

##### 1、前端逻辑+UI

> 请帮我用 React 开发一个三人斗地主的小游戏。

> 核心要求：

> 1. 规则：符合中国标准的斗地主规则（包括炸弹、顺子、飞机、王炸等牌型判断）。

> 1. 流程：要有洗牌、发牌、叫地主/抢地主、出牌、结算这几个完整阶段。

> 1. 体验：

- 界面要看着像个正经游戏，不要太丑。

- 必须要有音效（背景音乐 + 出牌语音）。

- 需要有简单的 AI 跟我对打，不然一个人没法玩。

> 请使用中文语音及中文界面

##### 2、前端效果

> “请扮演一位获得过 Awwwards 奖项的前端设计师，帮我创建一个纯前端的现代音乐播放器界面。

> 设计风格要求 (重中之重)：

> 1. 风格定调： 深色模式下的‘毛玻璃拟态 (Dark Glassmorphism)’风格。界面要有一种深邃、高级、沉浸的感觉。

> 1. 背景： 页面背景不是纯色，而是一个缓慢流动的、深蓝到深紫色的极光渐变背景（可以使用 CSS Animation 实现背景位置移动）。

> 1. 核心卡片： 播放器主体是一个悬浮在背景上的半透明磨砂玻璃卡片。要求使用 backdrop-filter: blur() 实现真实的背景模糊效果，并带有极细微的白色半透明边框和柔和的光晕阴影，体现通透感。

> 功能区块与布局要求：

> 1. 专辑封面： 卡片上方是一个大的正方形专辑封面（用占位图），需要有轻微的圆角和它自己颜色的弥散投影（Glow Effect），让它看起来像是发光的。

> 1. 信息区： 封面下方是歌曲标题（大号粗体）和歌手名（小号灰色）。

> 1. 进度条： 一个自定义样式的进度条。轨道是深灰色半透明，已播放部分是亮色渐变，拖动滑块要有一个发光的光晕效果。

> 1. 控制区： 底部一排按钮（上一首、播放/暂停、下一首）。播放按钮要是最大的，且带有最明显的磨砂和悬浮光感。所有按钮在 Hover 时都要有平滑的亮度提升和上浮动画。

> 技术要求：

> - 单文件交付： HTML/CSS/JS 全部写在一个 index.html 中。

> - 零依赖： 不使用任何 CSS 框架或图标库（图标可以用简单的 SVG 或 Emoji 代替，重点是样式）。”

#### APP全栈测试

##### 1、IOS+后端

> 做一个“运动打卡”App：

> - 我每天可以打卡：运动类型（跑步/力量/瑜伽）、时长、消耗卡路里、备注

> - 首页展示：本周打卡天数、连续打卡天数、热量趋势图

> - 支持编辑/删除某天打卡

> - 后端保存数据并提供统计接口（比如周/月汇总）

> - UI 要舒服：卡片、动画、空状态、加载状态

> 技术栈选择 ios,后端使用 python+mysql, mysql 连接信息：

> 链接:localhost:3306

> 账号密码: root/xy@123456

> 请帮我完成前后端核心代码，确保功能完整正常。 请开启agent teams完成这个任务

##### 2、Flutter+后端

> 帮我做一个“外卖点单”手机 App：

> - 我打开 App：可以注册/登录（短信用验证码模拟也行）


> - 购物车能加减数量、算总价、满减活动（例如满 50 减 8）

> - 下单后生成订单，订单有状态：已下单 → 配送中 → 已完成

> - 我能在“我的订单”里查看历史订单和状态变化

> - 后端提供 API + 数据库保存

> - 顺便做一个“网络慢/失败”的处理：loading、重试、空状态页面

> 技术栈选择 flutter,后端使用 python+mysql,

> mysql 连接信息：

> 链接:localhost:3306
账号密码: root/xy@123456

#### 后端能力测试(java)

##### 1、优惠券与结算引擎（规则多、容易出错）

> 用 Java 写一个“结算与优惠券引擎”，给我可运行的项目结构（建议 Maven/Gradle）。需求：

> - 商品有：id、名称、单价、数量、类目

> - 支持多种优惠：

1、满减：满 100 减 20（可叠加/不可叠加要配置）

2、折扣券：全场 9 折（部分品类不可用）

3、第二件半价（同商品）

3、运费规则：满 49 包邮，否则 8 元运费（部分地区运费不同）

> - 需要输出：原价、优惠明细列表、最终应付、运费、每个优惠的命中原因

> - 要考虑边界：优惠冲突、顺序问题、四舍五入、数量为 0、异常输入

> - 写单元测试覆盖关键用例，并给几个示例输入输出

##### 3、会议室预订系统（并发 + 冲突检测）

> 用 Java 写一个“会议室预订”后端核心逻辑（不需要写前端）：

> - 会议室有容量、设备（投影/白板）

> - 预订包含：日期、开始时间、结束时间、人数、设备需求、预订人

> - 规则：不能与已有预订时间重叠；允许相邻不算冲突（10:00-11:00 和 11:00-12:00 不冲突）

> - 支持查询：给定时间段和需求，返回可用会议室列表（按最合适排序：容量最接近、设备匹配度最高）

> - 需要考虑并发：两个用户同时抢同一时间段时，不能都成功（给出你处理方式）

> - 写单元测试，包含冲突、边界、并发场景

### 测试总结（仅限于本视频场景）

| 模型 | 纯前端逻辑 | 纯前端UI | IOS全栈 | Flutter全栈 | 复杂 Java 后端 |
| --- | --- | --- | --- | --- | --- |
| Claude-opus-4.6 | S- | S | A- | S+ | A+ |
| GPT-5.3-codex（high） | A+ | A | A | A+ | S+ |
| MiniMax-2.5 | S- | S | A+ | S | A+ |

MiniMax-2.5 在 UI 展现上表现非常出色, 在两个全栈 APP 项目中，IOS 表现一般，有部分模块功能没有对接好 API 接口，但是 Agent Teams 表现不错。在 Flutter 跨端 APP全栈表现不错，两次对话就完成了 APP 的开发。

在复杂的 JAVA 后端代码中，第一个促销模块的表现非常不错，基本符合了要求，完成了促销重叠的计算方式

在会议室预占项目中表现一般，使用单实例锁没有解决分布环境下的问题

## 年轻人的第一款大模型?小米 MiMo-V2-Pro编程评测

> 本文根据公开飞书教程整理，原始页面：[年轻人的第一款大模型?小米 MiMo-V2-Pro编程评测](https://my.feishu.cn/wiki/EIIewGab9inPd2kpTDXcd2Xdnog)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### MiMo-V2-Pro 特点

- 总参数 1T，激活 42B，上下文1M

- OpenClaw 的 Claw eval 测试接近 sonnet 4.6

- 编程方面的分数超过 sonnet4.6 接近 opus

### 测试案例

注意：

本次测试客户端安排如下：

Mimo 使用 Cline 客户端，模型使用是 Openrouter上的Mimo模型（目前免费）

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 纯前端测试

##### 1、前端逻辑+UI

> 请帮我用 React 开发一个三人斗地主的小游戏。

> 核心要求：

> 1. 规则：符合中国标准的斗地主规则（包括炸弹、顺子、飞机、王炸等牌型判断）。

> 1. 流程：要有洗牌、发牌、叫地主/抢地主、出牌、结算这几个完整阶段。

> 1. 体验：

- 界面要看着像个正经游戏，不要太丑。

- 必须要有音效（背景音乐 + 出牌语音）。

- 需要有简单的 AI 跟我对打，不然一个人没法玩。

> 请使用中文语音及中文界面

##### 2、前端效果

> “请扮演一位获得过 Awwwards 奖项的前端设计师，帮我创建一个纯前端的现代音乐播放器界面。

> 设计风格要求 (重中之重)：

> 1. 风格定调： 深色模式下的‘毛玻璃拟态 (Dark Glassmorphism)’风格。界面要有一种深邃、高级、沉浸的感觉。

> 1. 背景： 页面背景不是纯色，而是一个缓慢流动的、深蓝到深紫色的极光渐变背景（可以使用 CSS Animation 实现背景位置移动）。

> 1. 核心卡片： 播放器主体是一个悬浮在背景上的半透明磨砂玻璃卡片。要求使用 backdrop-filter: blur() 实现真实的背景模糊效果，并带有极细微的白色半透明边框和柔和的光晕阴影，体现通透感。

> 功能区块与布局要求：

> 1. 专辑封面： 卡片上方是一个大的正方形专辑封面（用占位图），需要有轻微的圆角和它自己颜色的弥散投影（Glow Effect），让它看起来像是发光的。

> 1. 信息区： 封面下方是歌曲标题（大号粗体）和歌手名（小号灰色）。

> 1. 进度条： 一个自定义样式的进度条。轨道是深灰色半透明，已播放部分是亮色渐变，拖动滑块要有一个发光的光晕效果。

> 1. 控制区： 底部一排按钮（上一首、播放/暂停、下一首）。播放按钮要是最大的，且带有最明显的磨砂和悬浮光感。所有按钮在 Hover 时都要有平滑的亮度提升和上浮动画。

> 技术要求：

> - 单文件交付： HTML/CSS/JS 全部写在一个 index.html 中。

> - 零依赖： 不使用任何 CSS 框架或图标库（图标可以用简单的 SVG 或 Emoji 代替，重点是样式）。”

#### APP全栈测试

> 帮我做一个“外卖点单”手机 App：

> - 我打开 App：可以注册/登录（短信用验证码模拟也行）


> - 购物车能加减数量、算总价、满减活动（例如满 50 减 8）

> - 下单后生成订单，订单有状态：已下单 → 配送中 → 已完成

> - 我能在“我的订单”里查看历史订单和状态变化

> - 后端提供 API + 数据库保存

> - 顺便做一个“网络慢/失败”的处理：loading、重试、空状态页面

> 技术栈选择 flutter,后端使用 python+mysql,

> mysql 连接信息：

> 链接:localhost:3306
账号密码: root/xy@123456

#### 后端能力测试(java)

##### 1、优惠券与结算引擎（规则多、容易出错）

> 用 Java 写一个“结算与优惠券引擎”，给我可运行的项目结构（建议 Maven/Gradle）。需求：

> - 商品有：id、名称、单价、数量、类目

> - 支持多种优惠：

1、满减：满 100 减 20（可叠加/不可叠加要配置）

2、折扣券：全场 9 折（部分品类不可用）

3、第二件半价（同商品）

3、运费规则：满 49 包邮，否则 8 元运费（部分地区运费不同）

> - 需要输出：原价、优惠明细列表、最终应付、运费、每个优惠的命中原因

> - 要考虑边界：优惠冲突、顺序问题、四舍五入、数量为 0、异常输入

> - 写单元测试覆盖关键用例，并给几个示例输入输出

### 测试总结（仅限于本视频场景）

| 模型 | 纯前端逻辑 | 纯前端UI | IOS全栈 | Flutter全栈 | 复杂 Java 后端 |
| --- | --- | --- | --- | --- | --- |
| Claude-opus-4.6 | S- | S | A- | S+ | A+ |
| GPT-5.3-codex（high） | A+ | A | A | A+ | S+ |
| MiniMax-2.5 | S- | S | A+ | S | A+ |
| MiMo-V2-Pro | S+ | S | - | A- | A |

##### 优点

1、1M 的上下文非常爽

2、MiMo-V2-Pro 在 UI 展现上表现非常出色, 在斗地主这款游戏的完成度上是所有模型中表现最好的，非常出人意料

3、在复杂的 JAVA 后端代码中，基本完成了关于促销的计算场景，单元测试都通过了，但场景不全

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

##### 缺点

1、修复 BUG 的能力欠缺，容易兜兜转转，除非人为干预，给出解决方向

2、偶尔会出现代码写完但编译不通过，需要不断修复错误，这个跟 claude 或者 gpt 一次完成还是有些差距

总的来说是一款非常不错的模型，远超预期，比 1.0版本有非常大的进步，编码能力我认为 不如 sonnet4.5，弱于 GLM5.0，MiniMax M2.7

## 编程能力大加强，Qwen-3.6-plus 前后端编程测试

> 本文根据公开飞书教程整理，原始页面：[编程能力大加强，Qwen-3.6-plus 前后端编程测试](https://my.feishu.cn/wiki/EeCXw6NFji0rDTk6dwMcX2XtnOe)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### Qwen-3.6-plus 特点

- 默认支持100万上下文窗口

- 显著提升的智能体编程能力

- 更出色的多模态感知与推理能力

### 测试案例

注意：

本次测试客户端阿里开发工具 Qoder 进行测试，已经内置 Qwen-3.6-plus 模型

测试流程仍然是按照先 plan->执行， 一个需求对话不超过 5 轮

#### 纯前端测试

##### 1、前端逻辑+UI

> 请帮我用 React 开发一个三人斗地主的小游戏。

> 核心要求：

> 1. 规则：符合中国标准的斗地主规则（包括炸弹、顺子、飞机、王炸等牌型判断）。

> 1. 流程：要有洗牌、发牌、叫地主/抢地主、出牌、结算这几个完整阶段。

> 1. 体验：

- 界面要看着像个正经游戏，不要太丑。

- 必须要有音效（背景音乐 + 出牌语音）。

- 需要有简单的 AI 跟我对打，不然一个人没法玩。

> 请使用中文语音及中文界面

##### 2、桌面软件

> 请帮我开发一个桌面AI编程软件，该软件需要具备以下核心功能：

**AI模型集成：**
- 集成Codex和Claude Code等AI编程助手
- 支持切换不同的AI模型进行代码生成和辅助

**项目管理功能：**
- 支持打开本地文件夹作为项目
- 可以同时打开多个项目窗口（每个项目窗口独立）
- 每个项目支持多标签页（tab）管理不同文件

**代码编辑与执行：**
- 提供代码编辑器界面
- 支持选择使用Claude Code模式或Codex模式的启动选项
- 能够执行Claude Code的启动命令，通过终端命令行方式进行AI交互

**Git版本控制：**
- 集成完整的Git管理功能
- 能够实时查看Git文件变更状态
- 显示修改、新增、删除等文件状态

**界面要求：**
- 界面布局需要参考我提供的设计图样例
- 实现直观的用户交互体验
- 支持项目导航、文件树浏览等功能

请提供详细的实现方案和技术架构建议。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### APP全栈测试

> 帮我做一个“外卖点单”手机 App：

> - 我打开 App：可以注册/登录（短信用验证码模拟也行）


> - 购物车能加减数量、算总价、满减活动（例如满 50 减 8）

> - 下单后生成订单，订单有状态：已下单 → 配送中 → 已完成

> - 我能在“我的订单”里查看历史订单和状态变化

> - 后端提供 API + 数据库保存

> - 顺便做一个“网络慢/失败”的处理：loading、重试、空状态页面

> 技术栈选择 flutter,后端使用 python+mysql,

> mysql 连接信息：

> 链接:localhost:3306
账号密码: root/xy@123456

#### 后端能力测试(java)

##### 1、优惠券与结算引擎（规则多、容易出错）

> 用 Java 写一个“结算与优惠券引擎”，给我可运行的项目结构（建议 Maven/Gradle）。需求：

> - 商品有：id、名称、单价、数量、类目

> - 支持多种优惠：

1、满减：满 100 减 20（可叠加/不可叠加要配置）

2、折扣券：全场 9 折（部分品类不可用）

3、第二件半价（同商品）

3、运费规则：满 49 包邮，否则 8 元运费（部分地区运费不同）

> - 需要输出：原价、优惠明细列表、最终应付、运费、每个优惠的命中原因

> - 要考虑边界：优惠冲突、顺序问题、四舍五入、数量为 0、异常输入

> - 写单元测试覆盖关键用例，并给几个示例输入输出

### 测试总结（仅限于本视频场景）

| 模型 | 纯前端逻辑 | 纯前端UI | IOS全栈 | Flutter全栈 | 复杂 Java 后端 |
| --- | --- | --- | --- | --- | --- |
| Claude-opus-4.6 | S- | S | A- | S+ | A+ |
| GPT-5.3-codex（high） | A+ | A | A | A+ | S+ |
| MiniMax-2.5 | S- | S | A+ | S | A+ |
| MiMo-V2-Pro | S+ | S | - | A- | A |
| Qwen-3.6-plus | A+ | S | - | A- | S |

##### 优点

1、 1M 的上下文非常爽,但是 Qoder 提供的是 200K 上下文

2、在复杂的 JAVA 后端代码中，基本完成了关于促销的计算场景，单元测试都通过了， 场景考虑的比较全面

##### 缺点

1、修复 BUG 的能力欠缺，容易兜兜转转，除非人为干预，给出解决方向

2、前端设计的能力欠缺，页面美观度不如国内其他模型

总的来说是一款非常不错的模型，整体编码能力我认为 不如  opus-4.5，弱于 GLM5.0，MiniMax M2.7

## Kimi K2.6 对比 GLM 5.1 ， 长任务开发谁最优秀

> 本文根据公开飞书教程整理，原始页面：[Kimi K2.6 对比 GLM 5.1 ， 长任务开发谁最优秀](https://my.feishu.cn/wiki/IEyHwVqitiqho9kByqEcbnHpn3M)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### 模型版本介绍

[Kimi K2.6 Tech Blog: Advancing Open-Source Coding](https://www.kimi.com/blog/kimi-k2-6)

Kimi K2.6 advances open-source coding, featuring long-horizon coding, coding-driven design, agent swarms, proactive agents, and the Claw Groups research preview.

[GLM-5.1: Towards Long-Horizon Tasks](https://z.ai/blog/glm-5.1)

2026-04-07 · Research GLM-5.1: Towards Long-Horizon Tasks Call it at Z.ai Z.ai Coding Plan GitHub HuggingFace GLM-5.1 is our next-generation flagship model for agentic engineering, with significantly

### 测试

本次测试是一个稍微复杂的企业官网 CMS 系统，包含企业官网预览以及企业官网的后台管理系统

#### PRD文档

附件：prd.md

功能模块数量：10 个

使用 Agent-skills 工作流程拆分 任务数量 33 个

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

附件：todo.md

#### 目标

总共 1 到 2 小时，开发+调试，最终完成度在 70% 以上的系统

#### 测试工具

Kimi K2.6 使用 KIMI CLI

GLM-5.1 使用 Claude Code

两个工具都是用 Agent-skills 工作流程，完成 spec 到 开发实施的全部流程

[GitHub - addyosmani/agent-skills: Production-grade engineering skills for AI coding agents.](https://github.com/addyosmani/agent-skills)

Production-grade engineering skills for AI coding agents. - addyosmani/agent-skills

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 测试结果

|  | 模块完成度 | 前端 UI&lt;br&gt;没有使用任何前端技能 | 第一版完成时间 | 总 BUG 数 | 迭代功能完成度 | 总完成时间 |
| --- | --- | --- | --- | --- | --- | --- |
| KIMI-K2.6 | 98% | 一般 | 33 分钟 | 约 7 个 | 100% | 1 小时 30 分 |
| GLM-5.1 | 100% | 一般 | 1  小时 15 分（经常中断） | 约 5个 | 100% | 2 小时 15 分 |

这两个模型的能力非常接近，对于长任务的执行完成度也比较高，都是非常值得推荐的模型

KIMI CLI 出乎意料的好用，速度非常快

## DeepSeek V4、Kimi K2.6、GLM5.1 编程对比测试

> 本文根据公开飞书教程整理，原始页面：[DeepSeek V4、Kimi K2.6、GLM5.1 编程对比测试](https://my.feishu.cn/wiki/Rznwwz58UiCl3GkfuqxcGVXHnXd)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

问题：

### 模型版本介绍

[mp.weixin.qq.com](https://mp.weixin.qq.com/s/8bxXqS2R8Fx5-1TLDBiEDg?scene=1)

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

[Kimi K2.6 Tech Blog: Advancing Open-Source Coding](https://www.kimi.com/blog/kimi-k2-6)

Kimi K2.6 advances open-source coding, featuring long-horizon coding, coding-driven design, agent swarms, proactive agents, and the Claw Groups research preview.

[GLM-5.1: Towards Long-Horizon Tasks](https://z.ai/blog/glm-5.1)

2026-04-07 · Research GLM-5.1: Towards Long-Horizon Tasks Call it at Z.ai Z.ai Coding Plan GitHub HuggingFace GLM-5.1 is our next-generation flagship model for agentic engineering, with significantly

### 测试

本次测试是一个稍微复杂的企业官网 CMS 系统，包含企业官网预览以及企业官网的后台管理系统

#### PRD文档

附件：prd.md

功能模块数量：10 个

#### 目标

总共 1 到 2 小时，开发+调试，最终完成度在 70% 以上的系统

#### 测试工具

DeepSeek V4-Pro 使用 Claude Code

Kimi K2.6 使用 KIMI CLI

GLM-5.1 使用 Claude Code

两个工具都是用 Agent-skills 工作流程，完成 spec 到 开发实施的全部流程

[GitHub - addyosmani/agent-skills: Production-grade engineering skills for AI coding agents.](https://github.com/addyosmani/agent-skills)

Production-grade engineering skills for AI coding agents. - addyosmani/agent-skills

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 测试结果&总结

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

|  | 总任务数 | 模块完成度 | 前端 UI&lt;br&gt;没有使用任何前端技能 | 第一版完成时间 | 总 BUG 数 | 迭代功能完成度 | 总完成时间 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DeepSeek-V4 | 17 个 | 100% | 比一般强一点 | 1 小时30 分左右（自动化E2E 测试花时间较长） | 约 7个 | / | 两小时 左右 |
| KIMI-K2.6 | 33个 | 98% | 一般 | 33 分钟 | 约 7 个 | 100% | 1 小时 30 分 |
| GLM-5.1 | 33个 | 100% | 一般 | 1  小时 15 分（经常中断） | 约 5个 | 100% | 2 小时 15 分 |

从结果上看，DeepSeek-V4 用较小的任务数完成了其他两款模型一样的效果，整个页面交互和完成度也非常不错。

DeepSeek-V4的表现介于GLM -5.1和Kimi-K2.6 中间，差距不会太大。

但 DeepSeek-V4 目前没有看到图片（多模态）识别的能力，

而且DeepSeek-V4调用成本过高，跟同类国产模型对比暂时没有优势，需等下半年换昇腾后会大幅降价。

DeepSeek 引入外部投资及商业化转型后，预计 DeepSeek会加快模型的发版速度

## 国产模型大比拼，谁是最佳AI编程模型？MiniMax-M3、Qwen-3.7-Max、Kimi-K2.6、GLM-5.1、MiMo-2.5-Pro、DeepSeek-V4-Pro

> 本文根据公开飞书教程整理，原始页面：[国产模型大比拼，谁是最佳AI编程模型？MiniMax-M3、Qwen-3.7-Max、Kimi-K2.6、GLM-5.1、MiMo-2.5-Pro、DeepSeek-V4-Pro](https://my.feishu.cn/wiki/Pvp2wedxWimIzNkY7Zhcmh9mnEg)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### 声明

本测试纯属个人测试，不代表权威，测试结果如有雷同，纯属巧合，如有不同意见，请自行测试。

### 测试内容

本轮测试是完成一个商城功能，包含了前台系统、后台运营系统以及Java服务。

核心功能如下：

- 系统包含前台用户端和后台管理端。


- 后台管理员可以登录后台，管理商品分类、商品、SKU、库存、订单、优惠券、秒杀活动和用户。

我会给每个模型都提供五个文档：

- Prd 文档，描述系统的具体功能

- Design 文档，描述商城前台的设计规范

- Tech 文档，技术栈相关

- Spec 文档，基于Prd文档生成的 spec明细任务

- Claude.md 文档，前后端项目的开发规范

### 测试流程

#### 测试模型及工具

- MiniMax-M3: Claude Code

- Qwen-3.7-Max: Qoder

- DeepSeek-V4-Pro : Claude Code

- Kimi-K2.6  : Claude Code

- GLM-5.1  : Claude Code

- Mimo-V2.5-Pro : Claude Code

#### 测试流程

1、将以上文档发给AI编程工具，不需要再进行任何的计划处理，现有的文档已经提供了足够的上下文

2、模型完成第一轮之后，基本框架已经搭建，人为启动测试，会给模型三到五次的问题修复，记录最后一次问题修复时间

3、评比分为：

- 前端UI展示、交互、流程是否能走完。后台系统功能是否齐整，增删改查处理是否正确

- 后端java代码是否遵守开发规范，功能开发是否齐全，登录验证是否正确

- 完成任务总耗时

### 测试结果

| 模型 | 总耗时 | 完成度 | 总文件数量 | 前端 | 后端 | 整体 | 问题 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MiniMax-M3 | 80分钟 | 85% | 156 | 8 | 7 | 7.5 | 表字段和接口层的实现对不上，缺字段 |
| Qwen-3.7-Max | 75分钟 | 90% | 145 | 9 | 9 | 9【第一版实现了优惠券的完整逻辑】 | 前后端字段对不上自己发现修复 |
| DeepSeek-V4-Pro | 70分钟 | 85% | 147 | 8 | 8 | 8 | 前后台功能缺失 |
| Kimi-K2.6 | 80分钟 | 60% | 157 | 7 | 6 | 6.5 | 前端缺少比较多功能 |
| GLM-5.1 | 60分钟 | 70% | 149 | 7 | 7 | 7 | 前后端都缺少功能。 |
| Mimo-V2.5-Pro | 60分钟 | 50% | 141 | 4 | 6 | 5.5 | 前端语法错误&lt;br&gt;后台功能缺失 |

### 总结

排名如下：

1、Qwen-3.7-Max

2、DeepSeek-V4-Pro

3、MiniMax-M3

4、GLM-5.1

5、Kimi-K2.6

6、Mimo-V2.5-Pro

整个任务的完成，其实模型之间的差距不会太大，而且都能持续运行至少一个小时以上。特别是最新的这几个模型，上下文长度达到了1M，体验过程是非常顺畅的。

模型之间的差距就在于对需求内容的理解，以及在这个长任务过程中会不会丢失一些内容，从而导致最终出来的结果可能会缺少功能。

无论是哪款模型，只要在第一轮任务完成之后，进行细致的调整，都能完成最终的功能。

### 测试相关文档

附件：测试相关文档.zip

## GLM 5.2 VS Kimi 2.7 Code , 两款最新国产模型AI编程对比测试

> 本文根据公开飞书教程整理，原始页面：[GLM 5.2 VS Kimi 2.7 Code , 两款最新国产模型AI编程对比测试](https://my.feishu.cn/wiki/UdZ4wJFTDiXiVxkIqxTcDGoxnux)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### GLM 5.2 VS Kimi 2.7 Code 基本参数对比

| 模型 | 上下文 | effort |
| --- | --- | --- |
| GLM 5.2 | 1M | 支持high、max |
| Kimi 2.7 code | 256K | 未知 |

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 前端测试

Create a single HTML file with a canvas animation of a handwritten letter burning. Show an aged, slightly yellowed sheet of paper with visible handwritten cursive text (procedurally drawn lines are fine) resting on a dark wooden desk. After 2 seconds, a flame ignites at the bottom-right corner and spreads organically across the page — the burn front should advance with an irregular, noisy edge, never a straight line. Just ahead of the flames, the paper should darken and brown (scorching), then char black, then disappear entirely, revealing the desk beneath. Render the fire with layered particles: a bright white-yellow core, orange mid-flame, and translucent red tips that flicker and lick upward. Glowing embers should detach from the burn edge and drift upward on turbulent air currents, fading from orange to gray. Add wisps of semi-transparent smoke rising and dispersing above the flames, and a warm flickering light that the fire casts onto the surrounding desk. The entire page should be consumed in roughly 15 seconds, leaving only a few glowing ash fragments that slowly dim. 60fps, no external libraries.

创建一个单独的 HTML 文件，用 canvas 实现一段“手写信被燃烧”的动画。

画面中展示一张泛黄、略显陈旧的纸张，纸上有明显的手写草书文字（可以用程序生成的线条模拟），纸张放在一张深色木质书桌上。

动画开始 2 秒后，火焰从纸张右下角点燃，并以自然、有机的方式向整张纸蔓延。燃烧边缘要呈现不规则、带噪声的形状，不能是笔直的线条。

在火焰前方，纸张应先逐渐变暗、变褐，表现出被烘烤和焦化的效果；随后变成黑色炭化状态，最后完全消失，露出下方的桌面。

火焰需要使用多层粒子渲染：明亮的白黄色核心、橙色的中层火焰，以及半透明的红色火焰尖端，这些火焰应不断闪烁并向上跳动。

燃烧边缘还应不断脱落发光的余烬，余烬随着紊乱的热空气向上漂移，并从橙色逐渐变成灰色后消失。

在火焰上方添加半透明的烟雾细流，让烟雾向上升起并逐渐扩散。

火焰还应在周围的木桌上投射出温暖、闪烁的光照效果。

整张纸应在大约 15 秒内被完全烧尽，最后只剩下少量发光的灰烬碎片，并且这些灰烬会慢慢变暗。

要求：60fps，不使用任何外部库。

本次前端案例来自 twitter,非本人原创

### 前端总结

| 排名 | 前端测试1 |  |
| --- | --- | --- |
| 1 | GPT-5.5 |  |
| 2 | Kimi 2.7 code |  |
| 3 | Opus 4.8 |  |
| 4 | GLM 5.2 |  |

### 后端测试

#### 测试内容

本轮测试是完成一个商城功能，包含了前台系统、后台运营系统以及Java服务。

核心功能如下：

- 系统包含前台用户端和后台管理端。


- 后台管理员可以登录后台，管理商品分类、商品、SKU、库存、订单、优惠券、秒杀活动和用户。

我会给每个模型都提供五个文档：

- Prd 文档，描述系统的具体功能

- Design 文档，描述商城前台的设计规范

- Tech 文档，技术栈相关

- Spec 文档，基于Prd文档生成的 spec明细任务

- Claude.md 文档，前后端项目的开发规范

##### 测试结果

商城前端

商城后台管理系统

商城java 服务

#### 测试模型及工具

- GLM 5.2 Claude Code

- Kimi 2.7 code Claude code

- MiniMax-M3: Claude Code

- Qwen-3.7-Max: Qoder

- DeepSeek-V4-Pro : Claude Code

- Mimo-V2.5-Pro : Claude Code

#### 测试流程

1、将以上文档发给AI编程工具，不需要再进行任何的计划处理，现有的文档已经提供了足够的上下文

2、模型完成第一轮之后，基本框架已经搭建，人为启动测试，会给模型三到五次的问题修复，记录最后一次问题修复时间

3、评比分为：

- 前端UI展示、交互、流程是否能走完。后台系统功能是否齐整，增删改查处理是否正确

- 后端java代码是否遵守开发规范，功能开发是否齐全，登录验证是否正确

- 完成任务总耗时

### 测试结果

| 模型 | 总耗时 | 完成度 | 纯前端 | 前后端 | 整体排名 |
| --- | --- | --- | --- | --- | --- |
| Kimi 2.7 code | 70分钟 | 85% | 1 | 4 | 2 |
| GLM 5.2 | 70分钟 | 90% | 2 | 2 | 1 |
| MiniMax-M3 | 80分钟 | 85% | 4 | 4 | 2 |
| Qwen-3.7-Max | 75分钟 | 90% | 3 | 1 | 1 |
| DeepSeek-V4-Pro | 70分钟 | 85% | 6 | 3 | 3 |
| Mimo-V2.5-Pro | 60分钟 | 50% | 5 | 6 | 4 |

### 总结

Qwen-3.7-Max，GLM 5.2

这两款模型排国内第一梯队

Kimi 2.7 code、 MiniMax-M3、DeepSeek-V4-Pro 这三款模型能力都差不多。

当在多轮对话长度增加的情况下，有1M上下文的表现的会更好。

整个任务的完成，其实模型之间的差距不会太大，而且都能持续运行至少一个小时以上。特别是最新的这几个模型，上下文长度达到了1M，体验过程是非常顺畅的。

模型之间的差距就在于对需求内容的理解，以及在这个长任务过程中会不会丢失一些内容，从而导致最终出来的结果可能会缺少功能。

无论是哪款模型，只要在第一轮任务完成之后，进行细致的调整，都能完成最终的功能。

### 测试相关文档

附件：测试相关文档.zip

## GPT-5.6正式发布，Codex APP 编码+work 合二为一

> 本文根据公开飞书教程整理，原始页面：[GPT-5.6正式发布，Codex APP 编码+work 合二为一](https://my.feishu.cn/wiki/VGu3wjGV9iouoWk5c03cx6U0nrh)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### GPT-5.6三种级别

- GPT-5.6-Sol : 主打复杂推理和长时间自主工作。

- GPT-5.6-Terra : 性价比高，比GPT-5.5厉害但便宜

- GPT-5.6-Luna: 轻量款，跑得快、便宜

GPT-5.6-Sol 做详细计划，GPT-5.6-Terra 执行

### 编程测试

```text
---                                                                                                              
    name: CS1.6 网页原型
    overview: 用 Vite + TypeScript + Three.js 从零搭建可玩的 CS1.6 风格 FPS 原型，重点做出接近原作的武器手感与射击视
    听效果，并跑通买枪、对战 Bot、回合闭环。
    todos:
      - id: scaffold
        content: 初始化 Vite+TS+Three.js，全屏场景与 Pointer Lock 第一人称相机
        status: completed
      - id: movement
        content: 实现玩家移动、跳跃、蹲下与 AABB 地图碰撞                                                            
        status: completed                                                                                            
      - id: weapons-feel                                                                                             
        content: 武器数据表 + 真实手感：后坐扩散、准星、换弹、第一人称枪模动画                                       
        status: completed                                                                                            
      - id: shoot-fx                                                                                                 
        content: 射击特效：枪口闪光、弹道曳光、弹孔、击中火花/血迹、弹壳抛出                                         
        status: completed                                                                                            
      - id: weapon-audio                                                                                             
        content: 分枪种枪声、换弹、击中、脚步等 Web Audio / 音效资源                                                 
        status: completed                                                                                            
      - id: map                                                                                                      
        content: 搭建对称竞技场地图与 T/CT 出生点                                                                    
        status: completed                                                                                            
      - id: economy                                                                                                  
        content: 金钱系统与 B 键买枪菜单                                                                             
        status: completed                                                                                            
      - id: bots                                                                                                     
        content: 简易 Bot：巡逻、视线开火、受击死亡                                                                  
        status: completed                                                                                            
      - id: rounds-hud                                                                                               
        content: 回合状态机 + HUD（血甲弹药金钱击杀）                                                                
        status: completed                                                                                            
      - id: polish                                                                                                   
        content: 受击反馈、击杀确认、手感微调并验收三回合闭环                                                        
        status: completed                                                                                            
    isProject: false
    ---

    # 网页版 CS1.6 可玩原型

    ## 目标

    在浏览器中交付一个**可玩的 CS 风格 FPS 原型**，核心卖点是**真实的武器效果与射击效果**：后坐、扩散、枪口焰、曳光、
    弹孔、分枪种音效、第一人称枪模抖动，再配合买枪、简易 Dust 风地图、对战 Bot，跑通「进局 → 买枪 → 交火 → 回合结算」
    闭环。

    不做：真实联机、完整武器表、精确命中箱、反作弊、匹配大厅。

    ## 技术栈

    - **Vite + TypeScript**：项目脚手架与热更新
    - **Three.js**：渲染、相机、场景、枪模与粒子特效
    - **自研逻辑**：输入、移动、射击、伤害、经济、Bot、回合
    - **无物理引擎**：用 AABB / 射线检测做碰撞与命中（轻量可控）
    - **Web Audio**：分枪种枪声与击中反馈（短采样或程序合成）

    ## 核心玩法范围（MVP）
                                                                                                                     
    - **移动**：WASD、跳跃、蹲下、地面碰撞                                                                           
    - **视角**：Pointer Lock 鼠标视角                                                                                
    - **武器**：刀、Glock、USP、AK-47、M4A1、AWP（各有独立手感参数）                                                 
    - **射击手感（重点）**：后坐力、精准度扩散、移动惩罚、蹲下加成、准星动态开合                                     
    - **射击视效（重点）**：枪口闪光、曳光弹道、墙面弹孔、击中火花/血迹、弹壳抛出、枪模后坐动画                      
    - **射击听感（重点）**：分枪种枪声、换弹、空仓、击中肉体/金属、脚步                                              
    - **地图**：一张简化竞技场（双出生点 + 中路掩体，Dust 配色）                                                     
    - **对手**：3–5 个简易 Bot（巡逻、看见就开枪）                                                                   
    - **模式**：回合制死亡竞赛：一方全灭或时间到 → 结算 → 下一回合                                                   
    - **HUD**：血量、护甲、弹药、金钱、击杀提示、动态准星                                                            
                                                                                                                     
    ## 武器与射击效果（本原型重点）                                                                                  
                                                                                                                     
    每把枪用独立数据驱动，避免「所有枪一个手感」：                                                                   
                                                                                                                     
                                                                                                                     
    | 枪           | 手感特征                       |                                                                
    | ----------- | -------------------------- |                                                                     
    | Glock / USP | 半自动、后坐小、射速中等、手枪枪声短促        |                                                  
    | AK-47       | 高伤害、垂直后坐大、水平摆动、枪声厚重        |                                                  
    | M4A1        | 射速快、后坐更可控、枪声偏脆             |                                                       
    | AWP         | 一击重伤/爆头秒杀、开镜（简化右键）、强后坐与长换弹 |                                            
    | 刀           | 近战挥砍判定、无弹道特效               |                                                        
                                                                                                                     
                                                                                                                     
    ### 手感系统                                                                                                     
                                                                                                                     
    - **后坐力**：开火抬升 pitch + 轻微 yaw 抖动，按武器曲线衰减回中                                                 
    - **精准度**：静止 / 移动 / 跳跃 / 蹲下四档扩散；连发时扩散累积，停火后回收                                      
    - **准星**：根据当前扩散实时开合（CS 风格十字准星）                                                              
    - **换弹**：弹药归零或按 R；播放枪模下移/上弹动画与音效                                                          
    - **第一人称枪模**：低模枪体挂在相机下；开火 kick、换弹、切枪过渡                                                
                                                                                                                     
    ### 视效系统                                                                                                     
                                                                                                                     
    - **枪口闪光**：短寿命点光 + 平面 sprite，随射速闪烁                                                             
    - **曳光**：hitscan 同时画一条短暂线段（步枪/狙击更明显）                                                        
    - **弹孔**：命中墙体贴 decal，数量上限循环复用                                                                   
    - **击中反馈**：打中 Bot 出血迹 sprite；打中金属/墙出火花粒子                                                    
    - **弹壳**：从枪侧抛出短寿命 mesh，带简单重力后消失                                                              
    - **受击**：屏幕边缘闪红、轻微视角震动                                                                           
                                                                                                                     
    ### 听感系统                                                                                                     
                                                                                                                     
    - 每把枪独立开火音；换弹、空仓咔哒、击中肉体、击中墙面、脚步分轨                                                 
    - 用 Web Audio 控制音量与轻微随机 pitch，避免机械重复                                                            
                                                                                                                     
    ## 架构                                                                                                          
                                                                                                                     
    ```mermaid                                                                                                       
    flowchart TB                                                                                                     
      subgraph client [Browser Client]                                                                               
        Input[InputSystem]                                                                                           
        Game[GameLoop]                                                                                               
        World[WorldScene]                                                                                            
        Combat[CombatSystem]                                                                                         
        WeaponFX[WeaponFX]                                                                                           
        Audio[AudioSystem]                                                                                           
        Economy[BuyEconomy]                                                                                          
        Bots[BotAI]                                                                                                  
        HUD[HUDOverlay]                                                                                              
      end                                                                                                            
      Input --> Game                                                                                                 
      Game --> World                                                                                                 
      Game --> Combat                                                                                                
      Combat --> WeaponFX                                                                                            
      Combat --> Audio                                                                                               
      Game --> Economy                                                                                               
      Game --> Bots                                                                                                  
      Game --> HUD                                                                                                   
      Combat --> World                                                                                               
      Bots --> Combat                                                                                                
    ```                                                                                                              
                                                                                                                     
                                                                                                                     
                                                                                                                     
    建议目录：                                                                                                       
                                                                                                                     
    ```                                                                                                              
    src/                                                                                                             
      main.ts                                                                                                        
      game/Game.ts                                                                                                   
      core/Input.ts                                                                                                  
      core/Math.ts                                                                                                   
      world/Map.ts                                                                                                   
      world/Collision.ts                                                                                             
      player/Player.ts                                                                                               
      weapons/                                                                                                       
        WeaponController.ts                                                                                          
        ViewModel.ts       # 第一人称枪模与动画                                                                      
      combat/                                                                                                        
        Hitscan.ts                                                                                                   
        Effects.ts         # 枪口焰、曳光、弹孔、火花、弹壳                                                          
      audio/Audio.ts                                                                                                 
      bots/BotController.ts                                                                                          
      ui/HUD.ts                                                                                                      
      ui/BuyMenu.ts                                                                                                  
      style.css                                                                                                      
    ```                                                                                                              
                                                                                                                     
    ## 实现顺序

    ### 1. 工程骨架

    - 初始化 Vite + TS + Three.js
    - 全屏 canvas、基础场景、Pointer Lock 与第一人称相机

    ### 2. 移动与碰撞

    - AABB 玩家体、重力、跳跃、蹲下
    - 地图用 `BoxGeometry` 拼墙体与掩体

    ### 3. 武器手感（优先做真）

    - 武器数据表 + Hitscan
    - 后坐、扩散、移动惩罚、准星开合
    - 第一人称低模枪模 + 开火 kick / 换弹动画

    ### 4. 射击视效与听感（优先做真）

    - 枪口闪光、曳光、弹孔、火花/血迹、弹壳
    - 分枪种音效与击中反馈
    - 受击闪红与视角震动

    ### 5. 地图与出生                                                                                                
                                                                                                                     
    - 对称竞技场、T/CT 出生点、回合重置                                                                              
                                                                                                                     
    ### 6. 经济与买枪                                                                                                
                                                                                                                     
    - 金钱、击杀/回合奖励、`B` 买枪菜单                                                                              
                                                                                                                     
    ### 7. Bot AI                                                                                                    
                                                                                                                     
    - 巡逻 → 发现玩家射击 → 死亡等下回合                                                                             
    - Bot 开火同样走同一套特效与音效管线                                                                             
                                                                                                                     
    ### 8. 回合与 HUD                                                                                                

    - `Warmup → BuyTime → Live → RoundEnd`
    - HUD：血甲、弹药、金钱、击杀 feed、动态准星

    ### 9. 验收打磨

    - 对比各枪手感差异是否明显；三回合闭环可玩

    ## 验收标准

    - 打开页面即可 Pointer Lock 进入游戏
    - **AK / M4 / AWP / 手枪手感与视听效果可明显区分**
    - 开火可见枪口焰、曳光、弹孔；击中 Bot 有血迹与击中音
    - 能买枪、击杀 Bot、被击杀，打完至少 3 个回合并看到金钱变化
    - 桌面 Chrome/Edge 目标 ~60fps

    ## 明确不做（避免膨胀）

    - WebSocket 多人联机
    - 真实 CS 地图导入 / BSP
    - 完整 30+ 武器与皮肤工坊
    - 真实体积烟雾弹 / 闪光致盲全屏物理
    - 移动端触控适配（可后续加）
    - 高精度骨骼枪模与原版 1:1 弹道（用低模 + 数据驱动逼近手感）
```

参与测试模型：

GPT-5.6-SOL

Fable-5

Grok-4.5

GLM-5.2

### 测试结果

Fable-5>GPT-5.6-SOL>GLM5.2>Grok-4.5

## 官方核验与使用建议

国产模型的版本、上下文、接口和开放范围以各模型厂商的官方文档为准。本文只保留公开评测作为历史样本，不对当前模型排名、价格或可用性作承诺。
