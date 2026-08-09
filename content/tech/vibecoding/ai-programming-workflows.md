---
title: "AI 编程工作流：Spec、Rules、GSD、TDD 与持续执行"
date: "2026-08-09"
author: "TNHTH"
section: "vibecoding"
excerpt: "整理规范驱动、Rules、GSD、TDD、Loop Engineering、截图转界面和 Codex Review 等可复用工作流。"
tags: ["AI编程", "工作流", "Spec", "TDD", "GSD"]
---

> 本文把不同工具都能使用的工作流合并成一篇，历史教程中的排名和模型结论只作背景，不当作当前推荐。
>
> 原始知识库入口：[AI编程快乐屋](https://my.feishu.cn/wiki/V5slwCIkUimnjKkyJuEcJiW0nuc)。

## AI编程2025总结 1️⃣：一起聊聊这十个问题

### 1. 过去一年里，AI 编程 发生了哪些变化？

- Cursor 不再一家独大，Claude Code 引领 AI 编程工具新潮流，下半年各种 AI 编程工具相继推出，给AI 编程带来更多选择

- Claude Sonnet 系列大模型仍然是 AI 编程的第一选择，OpenAI的 Gpt -5-codex 和谷歌的 Gemini 3 Pro 对

Claude Sonnet 造成比较大的影响，你可以根据模型的能力来灵活选择使用。

- AI 编程告别简单提示词直接出代码的流程，各家编程工具纷纷推出 todoList, Plan, spec 各种功能方便用户输出更好的代码结果

### 2. AI 编程是在增强程序员，还是在重新定义程序员？

最近行业里有个很典型的新闻：
国内有些公司把一批前端工程师整体转去做后端，直接向“全栈方向”靠拢。

AI 编程让每个程序员都变成了六边形战士，岗位在模糊，边界也在模糊

### 3. 哪些场景下我们越来越依赖 AI编程？哪些场景下仍然更信任自己？

依赖 AI 的典型场景：

- 模式化逻辑（CRUD、表单、API）

- 重复劳动（转文件、改格式、写注释）

- 补全知识盲区（例如某个 SDK 的用法）

但有两个场景，我们仍然只能依赖自己：

##### 1）需要长期记忆的任务

AI 的上下文窗口再大，也无法替代你对业务的“深度理解”。

##### 2） 存在风险后果的决策

比如：

- 应该选哪种架构？

- 哪个方案能支撑未来 2 年？

- 性能瓶颈在哪里？

AI 可以给你信息，但 判断一定是人来做的。

如果你现在的工作 60% 是重复劳动，AI 会帮你释放；

如果你 60% 是深度判断，那 AI 只是你的助理。

##### 3）规划、设计

### 4. 第一次用 AI 写代码的人最大的困惑是什么？

##### 困惑 1：以为 AI 会一次给出完美答案

但 AI 编程其实是：
你负责方向，AI 负责探索。

第一次写代码的 AI，就像第一次做菜的人：

你不引导，它不可能端出好东西。

##### 困惑 2：不知道怎么让 AI “理解项目”

AI 要写可靠代码，最重要的不是 Prompt，而是 上下文质量。

比如：

- 要让它读文档

- 要把项目结构告诉它

- 要让它看配置文件

- 要明确你要解决的问题边界

##### 困惑 3：不知道 AI 的极限在哪里

真正成熟的开发者用 AI 的方式是：

让 AI 做它擅长的，让自己做它不擅长的。

真正的门槛不是“会不会问”，
 而是 知道哪些事不该问它。

### 5. 国内模型和国外模型在编程能力上差距大吗？

国内模型在稳步发展，经过我的实战测试，目前国内几个重要的大模型：

Kimi,GLM4.6,Minimax,Qwen 在编码上仍然是弱于 claude sonnet 系列，

最高水平能到 4.0 左右，跟国外最好的模型仍然差 6 个月 左右的时间

### 6. 使用 AI 编程会不会“废掉”自己的代码能力？

这个问题其实本质是：

AI 会不会让我们“停止思考”？

答案取决于使用方式。

##### 会废掉你的是：

- 你只关注成果，没有去好好设计

- 完全不做代码审查

- 盲信 AI 的“看似正确的答案”

##### 不会废掉你的是：

- 用 AI 提升思维速度

- 让 AI 帮你快速验证想法

- 偶尔让它写你不熟悉的模块，通过结果反向学习

AI 有一个非常宝贵的作用：

它会暴露你以前从没意识到的知识盲区。

如果你用它“逃避思考”，你会变弱；

如果你用它“加强理解”，你会变强。

### 7. AI 时代，程序员真正“核心竞争力”是什么？

我认为核心能力正在转向三个方向：

- 表达意图的能力（Prompt 的底层逻辑）

越复杂的系统，越依赖“怎么说明白你的需求”。

- 判断能力（特别是架构方向的判断）

AI 能给 10 种方案，但哪一种能支撑你后续三年的可维护性？

这是人类必做的。

- 整合能力（把 AI、经验、业务串起来）

未来最强的人一定是：

能用 AI，把自己的经验杠杆放大的那一类人。

### 8. 常用的 AI 编程工具有哪些？

IDE
Cursor、Kiro、Antigravity、Trae、Qoder

CLI
Claude Code, Codex,Droid

API

Roocode,Cline

### 9. 你觉得 AI 会不会改变程序员的职业路径？（比如学习方式、成长节奏）

会，而且已经在改变。

##### 变化 1：学习曲线变短了

新手可以在 3 个月做到过去需要 1–2 年的熟练度。

##### 变化 2：成长瓶颈变高了

因为 AI 可以代替基础能力，

所以真正的差距会出现在：

- 逻辑深度

- 业务理解

- 系统思维

##### 变化 3：通才变得更有优势

能写前后端的不再稀缺，

能把前后端 + 产品 + 业务理解结合起来的人，会变得更吃香。

### 10. 未来一年 AI 编程真正要解决的核心问题是什么？

我的观点有三个关键词：

##### ① 代码可靠性

AI 会写，但要写得稳定、可维护，这是关键。

##### ② 长上下文的“真正理解能力”

AI 未来必须能够稳定理解复杂项目，不只是“读得进去”。

##### ③ 多智能体协作

真正的生产力提升会来自：
多个 AI 之间的分工协作，而不是一个AI单打独斗。

## AI编程 2025 总结2️⃣：Cursor 常用十个技巧

### 一、Agent 与 Editor 界面模式

- Editor 关注代码的细节

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

- Agent 关注代码的变化，更加沉浸式的编程

### 二、Cursor 官方Composer1 模型

Composer1 比 sonnet 系列模型要便宜很多

如果你有详细的技术设计文档，可以使用 composer1 来实现，适合做苦力，简单的代码编写

### 三、自定义模型

一般自定义模型都会提供专用于 cursor 的 http 地址， 和 Claude code 不一样，这个一定要主要。需要以下基础条件
1、必须是 Cursor pro+会员

2、模型的 Http 地址适配 Cursor 的要求

目前 GLM，Minimax 都可以使用

注意：使用了自定义模型，就不能使用其他模型

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 四、Agent/Plan/Debug/Ask 四种模式

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 五、浏览器（Browser）

- 实时调整页面元素

- 未来可能会发展成类似于 Figma 一样的 AI 设计工具

### 六、Rules及上下文

- Rules 正在被弱化，明年估计很少会用 rules

- Agent 的自动上下文记忆能力会增强

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 七、 mcp

- 可以让 cursor 帮你安装

- 复制粘贴 mcp 的 json 串

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

明年 MCP 也会逐渐被 Skills 代替

### 八、WorkTree

workTree=多 Agent 同时工作

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 九、多模型

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

类似于赛马机制，AI 会判断哪个模型跑出的效果更好，默认需要打开 worktree

### 十、Commands

Commands = 函数

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 总结

Cursor 仍然是最好用的 IDE，其推出的一些特性也成为了行业的标准。

## AI 编程 2025 总结 3️⃣：如何从 0 到 1 做一个产品

### 1、想法

##### 目的

将想法具体化，得到一个基本的 PRD 文档

##### 提示词

> 提示词如下：
我现在需要做一个点咖啡的小程序，包含的页面有首页，商品列表页，个人中心页面。，核心功能是用户浏览小程序，选择咖啡进行下单，在后台系统能查看订单进行订单状态变更操作。请你帮我生成一份**格式统一、结构完整的标准 PRD Markdown 文档**，

> 遵循以下章节结构：

> 项目名称

> 一、产品定位与目标

> 二、目标用户

> 三、核心功能需求

> 四、信息架构与页面结构

> 五、页面说明（逐页说明）

> 六、UI 配色与视觉规范

> 七、交互与状态设计

> 八、可扩展功能建议

> 📋 生成规范：

> 1. 输出必须是 Markdown 格式；

> 1. 不包含任何 AI 提示词或解释；

> 1. 每个章节都要完整；

> 1. 对于 UI 配色和页面结构，请使用你最合理的推断；

举例

> 项目名称

> 「BrewBar」咖啡点单小程序

> 一、产品定位与目标

> 面向城市上班族与咖啡爱好者的轻量点单小程序，主打「快捷下单 + 门店自提/外送」。

> 目标：减少排队时间、提升复购；为后台提供实时订单状态管理与履约跟踪。

> 二、目标用户

> 高频咖啡消费人群：通勤、办公、学习场景。

> 门店店员/管理员：查看并处理订单状态，管理库存与上架。

> 三、核心功能需求

> 用户侧：浏览商品、选择规格/温度/糖度/加料、加入购物车、下单支付、查看订单状态、个人中心（优惠券/发票抬头/地址）。

> 订单履约：支持自提/外送选择，实时状态流转（待支付/制作中/待取餐/已完成/已取消）。

> 后台：订单列表、状态更新、基础商品管理（上架/下架/库存编辑）。

> 通知与提醒：下单成功、状态变更、取餐码展示。

> 四、信息架构与页面结构

> 小程序端

> 首页：展示开屏界面。

> 商品列表页：分类切换（咖啡/茶饮/小食）、商品卡、筛选与排序、搜索。

> 商品详情弹层（列表内浮层或独立页）：规格选择、口味选项、加料、多件加购、加入购物车。

> 购物车/确认下单：商品清单、价格明细、支付。

> 订单列表：按状态分组，近期订单。

> 订单详情：取餐码/二维码、进度条、商品明细、支付/退款入口（待支付/已支付）。

> 个人中心：会员信息、客服与常见问题。

> 后台（admin）

> 订单管理：列表（状态筛选）、订单详情、状态更新（制作中/待取餐/已完成/取消）。

> 商品管理（简版）：上/下架，价格与库存调整，主推标签。

> 五、页面说明（逐页说明）

> 首页

> 模块：顶部 Banner + 今日特惠卡；快捷入口（热门、优惠券、自提优先）；推荐商品横滑。

> 关键交互：点商品卡→弹出规格选择/详情；点“查看全部”→商品列表页。

> 商品列表页

> 模块：分类 Tab、搜索框、排序（热度/价格）、商品卡（图/名/价/标签）。

> 交互：点击商品卡→规格弹层；加入购物车浮动反馈。

> 商品详情弹层/页

> 模块：图、描述、口味/温度/糖度/加料选项、数量步进器、价格动态计算。

> 交互：选项变更实时更新价格；加入购物车、直接下单。

> 购物车/确认下单

> 模块：商品清单，可编辑数量/删除；配送方式；门店选择或地址选择；优惠券选择；费用明细；支付按钮。

> 交互：切换自提/外送动态切换表单；优惠券叠加校验；提交后进入支付。

> 订单列表

> 模块：状态筛选（全部/待支付/制作中/待取餐/已完成/已取消）；列表卡片含取餐码/状态。

> 交互：点击进入订单详情；待支付支持“继续支付”。

> 订单详情

> 模块：取餐码/二维码、状态进度条、预计完成时间、商品明细、支付信息、操作（继续支付/申请取消）。

> 交互：状态实时刷新；复制取餐码。

> 个人中心

> 模块：会员信息、积分/等级（可选）、优惠券入口、地址管理、发票抬头、客服与帮助。

> 交互：跳转二级页管理地址/发票，联系客服。

> 后台订单管理（admin）

> 模块：订单表格（状态、支付方式、金额、门店、自提码/地址）、筛选（状态、时间、门店）；详情侧滑；状态更新按钮。

> 交互：更新状态需二次确认；支持按状态批量过滤。

> 六、UI 配色与视觉规范

> 主色：#3B2F2F 深咖；背景：#F4E9DB 拿铁米白；高亮：#D26B2C 焦糖；辅色：#0F3D3E 墨绿；点缀：#C7A75D 金属光泽。

> 字体：标题 "DM Serif Display"，正文字体 "Source Sans Pro"。

> 图标：使用专业库（FontAwesome/Heroicons），避免表情符号。

> 组件形态：圆角 12–16px，卡片带轻微浮动阴影与分层遮罩；按钮主色深咖，悬停/按下切换焦糖高亮；标签使用墨绿描边或金属质感描边。

> 布局：非对称分栏，顶部斜切背景，推荐卡片错位叠放，强调层次。

> 七、交互与状态设计

> 订单状态：待支付 → 制作中 → 待取餐/配送中 → 已完成；用户侧可取消（待支付/制作中早期），后台可标记异常/取消。

> 支付：微信支付；失败提示重试；成功后自动跳转订单详情。

> 购物车操作：数量步进即时更新价格；删除需二次确认（轻提示）。

> 自提/外送：切换即触发表单变化；自提展示门店与取餐码；外送校验地址与配送费。

> Loading/Empty/Error：列表空态给入口引导（去逛逛），错误提供重试按钮。

> 通知：状态更新触发服务通知/订阅消息（视资质）；取餐码在订单详情置顶。

> 八、可扩展功能建议

> 会员与积分：基于订单金额累积积分，兑换券包。

> 拼单/团购：同事拼单合并配送，自提减少等待。

> 营销：限时秒杀、满减、N+1 组合；新人礼券。

> 门店能力：定位最近门店，实时库存/估时；高峰期排队预估。

> 数据面板：后台仪表盘（销售额、客单价、爆品榜、时段分析）。

> 客服与评价：订单完成后引导评价，差评触发客服跟进。

##### 推荐工具

- ChatGPT

- Gemini

- Kimi

- DeepSeek

### 2、设计

##### 目的

将想法变成界面，这一步是具象化的操作，一定要提前弄好，这一部分做好了，产品定就定型了

##### 提示词

在上面这个 PRD 文档中，一般会给出页面和设计规范，你可以直接使用，也可以自己在单独写一个，最重要是包含具体的页面

> 我现在需要做一个小程序的商城，专门给门店使用，主要功能如下：

> 1、首页，显示一些分类的 icon, 比如蔬菜，水果之类的，显示 banner 图，然后推荐商品，一栏两个

> 2、商品页，显示分类和商品，可以根据分类筛选商品，需要有一个购物车

> 3、搜索页，输入关键词进行搜索，展示商品列表

> 4、购物车界面，展示购物的商品信息，可以删除编辑操作

> 5、下单结算界面，选择地址，选择优惠券，余额积分之类的，点击结算，进入下单成功页

> 6、个人中心，展示用的基本信息和二级页面的导航，包括订单列表，售后信息，个人信息等

> 7、订单列表，根据状态筛选，需要有订单详情

##### 推荐工具

- Figma

- V0

- lovable

- stiche

- sketch

- Google ai-studio

### 3、界面

到这一步就需要根据产品的类型，比如是 APP、小程序、网站 或者其他的载体，来决定下一步怎么将设计转换成界面

##### 使用MCP工具进行转换

可以安装 Figma mcp 工具，或者 使用 trae/codebuddy 内置的 figma 工具进行转换，这种还原度最高

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

注意：使用这些工具进行转换时，一定要写一个通用的转换文档，不然很容易出现转换错误，比如 我转换成小程序

> 当你在转换 figma 代码时，需要将转换后的代码放到 miniprogram 目录，并将代码转换成微信小程序的原生代码，以下是目录结构

> - images 目录，存放 图片文件，底部图标等

> - utils 工具类

> 使用模拟数据完成页面的展示，图片可以使用Unsplash图片

> ### 注意

> - 你必须完全按照 figma 的设计方案来进行转化，不要参考任何文档的设计元素

> - 你必须使用 小程序自带的底部导航功能，不要使用任何第三方的底部导航组件,并且从 figma 中导入正确的底部导航 icon 图标，仅支持 png 格式

> - 任何页面都必须注册到 app.json 中的 pages 数组中

> - 使用组件化开发的方式，将页面拆分成多个组件，每个组件负责自己的功能，最后在页面中引入组件，组件统一放到 components 中

> - 每个页面为了保证跟 figma 头部一样，请使用自定义的方式，在 小程序页面的 json 配置中，custom=true

##### 使用图片转换方式

如果没有 MCP 插件，就是用图片转代码，模型最好选择 gemini-3-pro，这个模型的识别图片能力和前端能力是最强的

> 请仔细查看这个图片，将图片切成 react h5 网页，保证结构，元素，内容不变

##### 源码转源码的方式

如果设计工具提供了源码下载，可以使用源代码转换成  方式，但效果不会太好

> 将 “XXX代码目录”中的所有的代码，图片 1:1 转换成APP原生代码，放到XXX目录中，使用模拟数据完成交互

##### 设计规范总结

记得对转换后的界面进行规范总结，这样做的目的是，在后面发现缺少页面，可以让 AI 编程工具根据设计规范设计一个新的页面

> 深入分析所附截图的设计，在本项目中创建一个 design.json 文件，用来描述设计系统中所需的每一个 UI 组件的风格和设计（以创意总监的高层视角）。请捕捉关于整体结构、间距、字体、颜色、设计风格以及设计原则的高层设计规范，这样我就可以将这个文件作为我应用的设计指南。这个文件的目标是用于指导 AI，使其能够在本项目中轻松复刻这种视觉风格。

##### 推荐工具

- Trae

- Codebuddy

- Cursor

### 4、数据库

完成上面的界面后，前端任务就完成了，因为大部分前端项目的框架，展示层和数据层都是分离的，所以后面的阶段最重要就是把页面中的模拟数据换成真实数据，这个时候就需要根据产品的功能设计一个数据库。

- 数据库选型

传统重模式： mysql/sqlserver

现代流行: supbase/cloudbase/PostgreSQL

如果你没有任何的编程经验，你可以让 AI 帮你设计

> 请阅读 @prd.md  文档和 wechat/miniprogram 下所有的页面中的模拟数据，帮我设计一份数据库设计，数据库采用XXX设计完成后需要将数据库设计文档存放到根目录，每个字段需要有中文注释

设计完成后，在 Agents.md 或者通用 rules 加上一句引用，让 AI 有任何的数据库变动和查询都读取这个文档

> 如果需要使用和数据库，请参考 database-design.md, 如果是新增表和字段，请同步更新到database-design.md

### 5、后端逻辑替换

数据库设计完成后，就是每个页面中的数据交互进行替换了

- 使用了 supbase/cloudbase 这种云数据库，前端本身就可以直接调用数据功能的，就直接使用下面的提示词逐个页面进行替换

> 将XX目录下所有页面的模拟数据替换为从 supbase/cloudbase 数据库获取真实数据，确保保持原有界面的数据结构不变。具体要求如下：

> 1. 基于提供的数据库设计文档 @database-design.md 进行对接

> 2. 仅需修改数据获取方式，将原有模拟数据替换为 supbase/cloudbase 数据库查询

> 3. 保持所有页面组件和视图层的数据结构完全一致

> 4. 确保数据获取逻辑变更不会影响现有UI渲染和业务逻辑

> 5. 实现时需考虑网络请求的异步处理和错误捕获机制

- 前后端分离的项目，需要按下面的步骤

> 我现在需要一份接口文档，你需要扫描每个页面,按照以下流程来获取页面中的接口信息

> - 从页面中获取调用的接口，并找到接口调用的真实地址,如果没有你可以自己生成真实的接口地址

> - 从页面中获取调用接口的入参和返参，并放到下面的格式中返回

> - 出参和入参的格式定义需要符合接口的统一规则 api.mdc

> - 接口需要标出是否需要登陆才能访问

> 最后生成md文档保存起来

> 格式如下：

> 接口名称

> - 接口核心功能描述，不超过200字

> - 接口地址: /print/assembly/{id}/export-pdf

> - 方法: GET

> - 需要登录: 是

> - 请求参数: 无

> - 响应类型: blob

> - 返回值：{}

> 记得把 接口规则文档放到上下文中

在后端项目中，根据接口文档逐一把接口实现

### 6、上线

如果想一键上线，可以使用 trae/codebuddy 的 depoly 功能

如果自己动手弄，可以使用 docker 或者宝塔/1panel 这种快捷的面板工具

## AI编程2025总结4️⃣：AI编程工具实战排名

### 排名打分项

- 创新能力

- 代码搜索（代码索引）

- 上下文组装、压缩、保存

- AI调用的流程（工具调用）

- 交互便捷性

### 排名原则

- 以下参与排名的工具是本人使用过，未参与排名的其他工具不代表没有名次，没有使用经验，不敢妄加排名

- 本次排名参考期限（2025/12/30），AI 编程工具在日新月异的发展，无法预料变化

- 萝卜青菜，各有所爱，适合自己的才是最重要的

### 具体排名

| S |  |  |
| --- | --- | --- |
| S- |  |  |
| A+ |  |  |
| A |  |  |

### AI编程工具链接

| 工具 | 官网 | 工具 | 官网 |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

## 2026春节复工必看：大模型+AI编程核心信息一网打尽

### 模型发布新版本

- 智谱 发布 GLM-5.0

- Minimax 发布 M2.5

- Claude 发布 Claude Sonnet 4.6 模型，价格跟 sonnet 4.5 一样

- 阿里发布 Qwen3.5-plus

- 谷歌发布 Gemini-3.1-pro

### 编程工具更新

- Cursor 发布新的版本2.5，支持插件 系统，追随 Claude Code

- Claude Code 已经更新到 2.1.50， 支持通过命令直接启动 worktree 一系列功能。但我目前发现以下问题

1）Claude Code 会被强制退出，需要通过 Claude 登录才能使用。（就算配置了includeCoAuthoredBy 也没用）

2）使用 CC-switch 切换 GLM 模型会报错

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

通过设置 default 模型来解决这个问题

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 国内模型编程套餐

阿里终于推出 coding 套餐

[Coding Plan](https://help.aliyun.com/zh/model-studio/coding-plan)

Coding Plan 是阿里云百炼推出的 AI 编码套餐，采用固定月费，提供月度请求额度，支持在 Qwen Code、Claude Code、Cline、OpenClaw（原Moltbot、Clawdbot）等 AI 工具中使用。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

| 提供商 | 模型选择 | 定价/使用量（5 小时） | 使用量刷新机制 | 官网 |
| --- | --- | --- | --- | --- |
| 智谱（GLM） | GLM-5 | Lite:  49/月  最多约 80 次 prompts&lt;br&gt;Pro：149/月  最多约 400 次 prompts&lt;br&gt;Max：469/月  最多约 1600 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://www.bigmodel.cn/glm-coding?ic=AZBGEFIQ7E |
| MiniMax | MiniMax M2.5 | Starter:：29/月  最多约 40 次 prompts&lt;br&gt;Plus：49/月  最多约 100 次 prompts&lt;br&gt;Max：119/月  最多约 300 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://platform.minimaxi.com/subscribe/coding-plan?code=IDu7n2PqTR&source=link |
| 豆包 | Doubao-seed-2.0-code&lt;br&gt;GLM-4.7&lt;br&gt;Kimi-K2.5 | Lite:  40/月  最多约 60 次 prompts&lt;br&gt;Pro：200/月  最多约 300 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://www.volcengine.com/docs/82379/1925114?lang=zh |
| 阿里 | qwen3.5-plus、qwen3-max-2026-01-23、qwen3-coder-next、qwen3-coder-plus、glm-4.7、kimi-k2.5 | Lite:  40/月  最多约 60 次 prompts&lt;br&gt;Pro：200/月  最多约 300 次 prompts | 每 5 小时限额&lt;br&gt;（动态刷新，额度在请求消耗 5 小时后刷新重置） | https://help.aliyun.com/zh/model-studio/coding-plan |

## AI编程必学1️⃣，规范驱动(Spec)入门与实战

视频地址：

[链接](https://www.bilibili.com/video/BV1AfsMzGEcb/)

### 什么是 规范(Spec)驱动开发?

从 Kiro 的例子中，我们可以知道规范驱动开发的流程

### 为什么要用 Spec?

### 怎么用？OpenSpec

[github.com](https://github.com/Fission-AI/OpenSpec)

#### 介绍

它为 AI 编程工具（Claude Code、Cursor、Codex、OpenCode、windsurf 等）提供一种标准化的方式：

- 让 AI 生成、跟踪、验证、归档 功能变更；

- 把“功能需求 → 任务分解 → 实现 → 验收” 全流程结构化；

- 实现 AI 与人协同开发 的一致性。

🧠 核心理念：

“让 AI 先写清楚规范（spec）再写代码”
 而不是盲目凭 prompt 去写。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 安装

Prerequisites  先决条件

Node.js >= 20.19.0

步骤 1：全局安装 CLI

npm install -g @fission-ai/openspec@latest

验证安装：

openspec --version

步骤 2：在项目中初始化 OpenSpec

导航到您的项目目录：

cd my-project

openspec init

初始化过程中会发生：
系统会让你选择所用的 AI 工具（Claude Code / Cursor / OpenCode / Codex）；
自动在项目中创建 openspec/ 目录；
生成托管文件 AGENTS.md，用于不同 AI 工具共享说明；
为所选 AI 工具自动配置 /openspec 的斜杠命令（slash commands）。

my-project/
├── openspec/
│   ├── specs/           # 当前系统的真实规格（living specs）
│   ├── changes/         # 所有进行中的变更提案
│   ├── archive/         # 已完成并归档的变更
│   └── AGENTS.md        # AI 助手共用说明文件

#### 使用

- 主动方式

使用 AI 编程工具的 自定义命令，比如 cursor,windsurf, auggie 等

```text
/openspec:proposal  创建需求
/openspec:apply  执行需求
/openspec:archive 归档需求
```

- 被动方式

使用关键词，比如 spec, proposal 等触发创建规格文件

#### 实战

##### Cursor 功能迭代实战

### 什么时候该使用Spec？

##  AI 编程必学2️⃣：Openspec 原理及实战

### 入门与安装

请参考上期视频

本视频地址：

[www.bilibili.com](https://www.bilibili.com/video/BV1SFCqBcEBS/?spm_id_from=333.1387.homepage.video_card.click&vd_source=c88da172142c155b29a2145e5184aa75)

### Openspec 规范驱动的原理是什么？

#### 怎么触发的

执行完 openspec init 之后 会生成几个重要的文件(命令/工作流)

Agents.md

openspec-apply.md
openspec-proposal

#### 怎么使用

- 使用关键词触发，比如 proposal,spec 之类的

- 使用 slash command(需要 AI 编程工具支持）指定触发， claude code 比较特殊，“/”命令后，收入输入，不要直接 enter 键

- 引用文件到对话框中，主要针对不支持 Agents.md 、Claude.md以及 slash command的工具

#### 生成格式

- 执行 openspec init 命令后，会生成如下的目录结构

```text
openspec/
├── project.md              # 项目约定
├── specs/                  # 当前真实情况 - 已构建的内容
│   └── [capability]/       # 单一聚焦能力
│       ├── spec.md         # 需求和场景
│       └── design.md       # 技术模式
├── changes/                # 提案 - 应该变更的内容
│   ├── [change-name]/
│   │   ├── proposal.md     # 为什么、什么、影响
│   │   ├── tasks.md        # 实施检查清单
│   │   ├── design.md       # 技术决策（可选；见标准）
│   │   └── specs/          # 增量变更
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 已完成的变更
```

- proposal.md：

```text
## Why（为什么）
[关于问题/机会的 1-2 句话]

## What Changes（变更内容）
- [变更项目列表]
- [用 **BREAKING** 标记破坏性变更]

## Impact（影响）
- 受影响的规范：[列出能力]
- 受影响的代码：[关键文件/系统]
```

- spec.md

```text
## ADDED Requirements（新增需求）
### Requirement: 新功能
系统应当提供...

#### Scenario: 成功案例
- **WHEN** 用户执行操作
- **THEN** 预期结果

## MODIFIED Requirements（修改需求）
### Requirement: 现有功能
[完整的修改后需求]

## REMOVED Requirements（移除需求）
### Requirement: 旧功能
**Reason（原因）**: [为什么移除]
**Migration（迁移）**: [如何处理]
```

如果影响多个能力，在 changes/[change-id]/specs/&lt;capability&gt;/spec.md 下创建多个增量文件 - 每个能力一个。

tasks.md：

```text
## 1. 实施
- [ ] 1.1 创建数据库模式
- [ ] 1.2 实现 API 端点
- [ ] 1.3 添加前端组件
- [ ] 1.4 编写测试
```

在需要时创建 design.md：

如果满足以下任何条件，则创建 design.md；否则省略：

- 跨领域变更（多个服务/模块）或新的架构模式

- 新的外部依赖或重大数据模型变更

- 安全、性能或迁移复杂性

- 在编码前需要技术决策的歧义

最小 design.md 骨架：

```text
## Context（背景）
[背景、约束、利益相关者]

## Goals / Non-Goals（目标/非目标）
- Goals（目标）：[...]
- Non-Goals（非目标）：[...]

## Decisions（决策）
- Decision（决策）：[什么和为什么]
- Alternatives considered（考虑的替代方案）：[选项 + 理由]

## Risks / Trade-offs（风险/权衡）
- [风险] → 缓解

## Migration Plan（迁移计划）
[步骤、回滚]

## Open Questions（开放问题）
- [...]
```

#### 执行完命令，你应该看什么

着重看 proposal.md 和 spec.md 文档

### Spec规范驱动的误区

- 不是什么功能编写都要用 Spec 驱动

- Spec 驱动不是帮你解决 ”业务/逻辑/算法" 难题

它不是解决难题，是建立规范，产生文档，记录变更

- 有了 Spec文档，rules 还有用吗？

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

- 有了 spec 之后 token 消费增加了，还值得吗？

- 如果你自己能很好的编写技术流程文档，那可以不用

-  简单任务可以不需要使用

- 调高准确率，降低反复对话，相对而言是降低成本

### Openspec 实战

## AI编程核心概念梳理：Rules/Commands/Subagent/Mcp/Skills/Modes/Hooks 的区别是什么？

### 什么是上下文及外部连接

上下文=大模型跟你交流产生的记忆。

上下文在快接近上限是会被自动压缩

### 区别

跟 AI 交流的路径抽象为：

提示词加载方式+触发方式+连接外部的能力

| 功能 | 一句话解释 | 提示词加载方式 | 触发方式 | 连接外部的能力 | 示例 |
| --- | --- | --- | --- | --- | --- |
| Rules | 规范 | 一次性全部加载 全局规则&lt;br&gt;按照文件后缀加载特定规则 | 全局 或者 按文件后缀匹配 | 无 | java.md&lt;br&gt;doc.md&lt;br&gt;git.md |
| Commands | 快捷键 | 指定运行时加载 | 手动指定 | 无 | /commit&lt;br&gt;/bug-fix |
| MCP | 开门钥匙 | 一次性加载所有 MCP 方法描述 | 按描述匹配 | 无 |  |
| SubAgents | 异步调用 | 独立上下文 | 根据描述/名称触发 | 无 |  |
| Hooks | 生命周期 | 无 | 根据配置的生命周期必定触发 | 无 |  |
| Skills | 封装 | 按需加载 | 通过名称描述匹配&lt;br&gt;或者手动指定 | 有 |  |
| Modes | 跟 AI交流模式 | 内置 | 切换或者/ | 不确定 |  |

### 脚手架配置

https://github.com/notedit/happy-coding-agent

https://github.com/affaan-m/everything-claude-code

## Trae增加 Spec 模式，应该如何区分和使用 AI 编程中的 Plan 和 Spec 模式

### 为什么要有 spec或者 plan 模式？

- 仅使用提示词的方式开发有两个问题，特别是需求复杂后

1）你并不了解 AI 会怎么实现你的需求，很有可能会带来反复的修改

2）你提的需求也许你自己也考虑不全面

- spec 或者 plan 就是通过文档来与你对齐需求,让 AI 按照文档驱动开发，保证准确度

### 实践

在 Trae  的 Solo 模式中 使用 /plan、/spec 开启两种模式

### Spec和Plan两种模式的区别

- Spec 重流程，需求大纲(spec.md)->任务列表(task.md)-> 验收清单(checkList.md)

- Plan 重计划，偏粗粒度，最大的作用是帮你把需求和实现对明白

- Spec 的能力 包括了 Plan,也就是 Spec 可以代替 Plan

| 场景 | Spec模式 | Plan模式 | 普通模式 | 原因 |
| --- | --- | --- | --- | --- |
| 新系统 / 新模块 0→1 搭建 | ✅ | ❌ | ❌ | 新模块启动一般都需要一个比较好的系统化的设计，这一步非常重要，spec 能输出非常详细的方案和任务 |
| 极小范围的修改 | ❌ | ❌ | ✅ | 不需要流程 |
| 老项目重构 | ✅ | ❌ | ❌ | 老项目每个功能的迭代都需要慎重，需要有详细的文档和方案 |
| 高质量/高稳定性项目的开发 | ✅ | ❌ | ❌ | 需要详尽的验收清单来确保每个环节达标。 |
| 正常功能开发或者需求不清楚 | ✅ | ✅ | ❌ |  |

## Loop Engineering 没那么复杂，简单易懂保姆级讲解(含38页PDF Loop Engineering课件）

### Loop Engineering  是什么？

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### Loop Engineering  常见问题

#### Loop Engineering 是一个新框架吗？

不是，它是Agent发展到现在，对一套工作流或者一套工程的定义的一个名词。可以叫这个名字，也可以叫别的名字。我更偏向于把它定义为是一种思想，一种Agent设计模式。你可能在平时使用AI Agent的时候，用到了其中的某些零件，比如说验证、记录日志这一类。

#### 跟/Goal模式的区别是什么？

Goal模式刚好使用了循环的5个零件里的其中4个。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

加上触发器的goal，它就是一个循环过程。可以认为它本身就是循环过程，只是人为触发而已。

#### 什么时候该用循环？

1、Token预算是否充足？

2、是否有明确的执行任务？

3、是否能准确验证任务执行的结果？

4、任务是否是真重复？

5、项目基建是否完善？Agent 工作流、测试等

### 创建循环的步骤

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### Loop-library

网上开源的，已经有现成的Loop库。

[Loop Library: Repeatable AI Agent Workflows | Forward Future](https://signals.forwardfuture.com/loop-library/#library)

Repeatable AI agent prompts with practical checks, proof, and stopping conditions.

npx skills add Forward-Future/loop-library --skill loopy -g

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### Loop 工程的安全与伦理边界

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 38页PDF Loop Engineering课件

以下是我整理出来的学习资料。

下周也会在星球分享一些Loop Engineering 实践的经验、技巧。有需要的可以关注一下。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

附件：Loop-Engineering.pdf

## AI编程技巧1️⃣：截图变网页，AI编程UI小妙招

### 先生成规范

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 深入分析所附截图的设计，在本项目中创建一个 design.json 文件，用来描述设计系统中所需的每一个 UI 组件的风格和设计（以创意总监的高层视角）。请捕捉关于整体结构、间距、字体、颜色、设计风格以及设计原则的高层设计规范，这样我就可以将这个文件作为我应用的设计指南。这个文件的目标是用于指导 AI，使其能够在本项目中轻松复刻这种视觉风格。

规范的好处是，让 AI 的上下文很纯粹，让 AI 知道你需要的 UI 是什么样子的。

更多的图片参考会有更好的效果。

请注意：这里一定要使用图片识别较好的模型，比如 gemini-3-pro 或者 flash

Claude 4.5

### 基于Design.json 创建自己的页面

> 请按照这个 design.json 设计方案，设计一个电商网站，主营是儿童玩具，商品的可以先使用开源图片，技术栈使用 vue

### 使用Visbug 精确调整

这一步的目的是，让设计规范更加详细

[chromewebstore.google.com](https://chromewebstore.google.com/detail/visbug/cdockenadnadldjbbgcallicgledbeoc)

## AI 写代码越写越烂？GSD 帮你解决｜AI编程最佳工作流GSD 完全指南

### 常用工作流

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### GSD 地址

[github.com](https://github.com/gsd-build/get-shit-done)

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 文字版

```text
## AI 写代码越聊越烂？根本原因找到了

你有没有遇到过这种情况——

打开 Claude，兴致勃勃地开始描述需求，前几轮回复质量很好，代码写得挺像样。

然后聊着聊着，越来越长，AI 开始走捷径、忘记早期约束、产生幻觉……

最后代码一团糟，`/clear` 重来，所有进度丢失。

**这不是 Claude 不够好。是你的使用方式有问题。**

这个问题有个名字：**Context Rot（上下文腐化）**。

---

## 什么是 Context Rot？

随着对话越来越长，Claude 的上下文窗口被逐渐填满，输出质量**不可逆地下降**。

这是所有 AI 编程工具的本质局限，不是 bug，是架构限制。

大多数人的应对方式是：更详细地描述需求，或者反复 `/clear` 重来。

这治标不治本。

---

## GSD：解决 Context Rot 的系统级方案

**GSD（Get Shit Done）** 是一套专为 Claude Code 设计的元提示 + 上下文工程 + 规格驱动开发系统。

一条命令安装：

```bash
npx get-shit-done-cc@latest
```

它的核心思路很简单：**复杂度在系统里，不在你的工作流里。**

> "如果你清楚地知道自己想要什么，这套系统就会帮你做出来。没有废话。"
> — 亚马逊、谷歌、Shopify 工程师用后评价

---

## 传统 Vibe Coding vs GSD：5 个核心差异

| 痛点 | 没有 GSD | 用了 GSD |
|------|----------|----------|
| 🧠 Context Rot | 一个超长对话，上下文满了质量崩塌 | 每个计划在独立 200K 新鲜上下文中执行，主会话保持 30-40% |
| 🌫️ 需求散乱 | 需求藏在聊天里，不知道做完没有 | `REQUIREMENTS.md` 带 ID 可追踪，自动映射测试命令 |
| 🔀 全部串行 | 所有任务挤在一条对话，只能一件件做 | Wave 并行执行，无依赖的计划同时跑 |
| 🔄 跨会话失忆 | 每次新开会话要重新解释所有背景 | `STATE.md` 持久化，一条命令恢复完整上下文 |
| 🐛 手动调试 | 出 bug 自己定位、分析、修复 | Debug Agent 自动诊断根因，生成修复计划直接执行 |

---

## GSD 的完整工作流：5 步循环

每个功能阶段都是这 5 步的循环：

### Step 1 — `/gsd:new-project`：初始化项目

系统深度问询直到完全理解你的想法，然后自动完成：

1. **问询** — 持续提问，覆盖目标、约束、技术偏好、边缘情况
2. **研究** — 4 个并行 Agent 同时调查领域知识
3. **需求** — 提取 v1 必须有 / v2 以后做 / 超出范围三档
4. **路线图** — 创建映射到需求的阶段划分，你来批准

**输出：** `PROJECT.md`、`REQUIREMENTS.md`、`ROADMAP.md`、`STATE.md`

---

### Step 2 — `/gsd:discuss-phase N`：锁定实现偏好

路线图上每个阶段只有一两句描述，这不足以按照**你设想的方式**去构建。

这一步在研究和规划之前，捕获你的偏好：

- 视觉特性 → 布局、密度、交互、空状态
- API/CLI → 响应格式、错误处理、详细程度
- 内容系统 → 结构、语气、深度

**不要跳过这一步。** 跳过 → 系统做合理假设 → 你得到一个还行的实现。用它 → 系统锁定你的决策 → 你得到你真正想要的东西。

**输出：** `{phase}-CONTEXT.md`

---

### Step 3 — `/gsd:plan-phase N`：多 Agent 规划

系统先用 4 个并行 Agent 深度调研领域：

- **Stack** — 技术栈、依赖、版本兼容性
- **Features** — 功能模式、最佳实践
- **Architecture** — 架构选择、设计模式
- **Pitfalls** — 常见陷阱、已知问题

然后 Planner 创建 2-3 个原子任务计划（XML 结构），Plan Checker 从 8 个维度验证，不通过最多循环 3 次。

**输出：** `{phase}-RESEARCH.md`、`{phase}-{N}-PLAN.md`

---

### Step 4 — `/gsd:execute-phase N`：并行 Wave 执行

按依赖关系将计划分组为多个 Wave：

```
WAVE 1（并行）          WAVE 2（并行）          WAVE 3
┌─────────┐ ┌─────────┐  ┌─────────┐ ┌─────────┐  ┌─────────┐
│ Plan 01 │ │ Plan 02 │→ │ Plan 03 │ │ Plan 04 │→ │ Plan 05 │
│User Model│ │Prod Model│  │Orders API│ │Cart API │  │Checkout │
└─────────┘ └─────────┘  └─────────┘ └─────────┘  └─────────┘
```

- Wave 内并行，Wave 间顺序
- 每个计划在独立的 200K 上下文中执行
- 完成后立即原子提交

```bash
abc123f feat(08-02): implement password hashing
def456g feat(08-02): add email confirmation flow
hij789k docs(08-02): complete user registration plan
```

每个任务独立可回滚，git bisect 精准定位问题。

**输出：** `{phase}-SUMMARY.md`、`{phase}-VERIFICATION.md`

---

### Step 5 — `/gsd:verify-work N`：验收与修复

系统逐一引导你测试每个可交付成果："能用邮箱登录吗？"

- ✅ 通过 → 继续下一条
- ✗ 失败 → Debug Agent 自动诊断根因 → 生成修复计划 → 再次执行

**你不需要手动调试。系统知道出了什么问题。**

---

## 里程碑管理

全部阶段完成后：

```bash
/gsd:audit-milestone    # 检查是否达成里程碑定义
/gsd:complete-milestone # 归档 + 打 Git Tag
/gsd:new-milestone      # 开始下一版本
```

中途可以随时调整路线图：

```bash
/gsd:add-phase          # 追加新阶段
/gsd:insert-phase 3     # 在第 3 阶段后插入紧急工作
/gsd:remove-phase 7     # 移除阶段并自动重新编号
```

---

## 不适合 GSD 的场景（说实话）

GSD 也有明显的代价，用之前要心里有数：

**💸 Token 消耗显著更高**
多 Agent 并行，一个完整阶段的消耗可能是普通对话的 5-10 倍。应对：用 `budget` 档位，或关闭不必要的 Agent。

**⏳ 不适合小任务**
一个简单脚本用 `new-project` 明显过重。小任务直接用 `/gsd:quick`。

**🔭 不适合模糊探索期**
GSD 的前提是"你知道自己想要什么"。如果还在早期试错阶段，自由 Vibe Coding 验证方向之后再引入 GSD。

**🎯 计划质量取决于你的输入**
回答含糊 → 结构化的垃圾输出。认真回答系统的问题，用 `discuss-phase` 锁定细节。

**📚 有一定学习曲线**
~30 个命令、多个 Agent 角色、Wave 依赖关系，前几个项目可能比直接聊慢。建议先掌握核心五步流程再深入。

---

## 记住这 5 件事

1. **Context Rot 是真实问题**，GSD 通过子 Agent + 新鲜上下文解决，不是绕过它
2. **`discuss-phase` 最关键**，在这里决定实现方式，不要跳过
3. **垂直切片比水平分层并行效率更高**，Plan 01: 完整用户特性 > Plan 01: 所有 Model
4. **出问题不手调**，让 verify-work + debugger 自动诊断并规划修复
5. **按需调优**，原型期用 `budget+yolo`，生产发布用 `quality+interactive`

---

## 完整命令序列

```bash
## 安装
npx get-shit-done-cc@latest

## 启动（已有代码库先跑 map-codebase）
/gsd:map-codebase
/gsd:new-project
/clear

## 每个阶段循环
/gsd:discuss-phase N
/gsd:plan-phase N
/gsd:execute-phase N
/gsd:verify-work N
/clear

## 发布
/gsd:audit-milestone
/gsd:complete-milestone
```

---

GSD 最适合这类场景：**目标明确、需要持续迭代、项目复杂度中等以上、独立开发者或小团队**。

如果你在构建需要长期维护的产品，GSD 的前期投入会在第 2、3 个里程碑时开始大量回报。

**Claude Code is powerful. GSD makes it reliable.**

→ GitHub：[github.com/glittercowboy/get-shit-done](https://github.com/glittercowboy/get-shit-done)
→ 社区：[discord.gg/gsd](https://discord.gg/gsd)
```

### 网页版(下载直接用浏览器打开）

附件：courseware_gsd.html

## MiniMax Token Plan 实战：从 0 制作专业营销落地页

### 前提准备

- MiniMax Token Plan 套餐

- MiniMax frontend-dev技能

https://github.com/MiniMax-AI/skills/blob/main/skills/frontend-dev/SKILL.md

### Frontend-dev 技能介绍

```text
技能描述：
全栈前端开发，融合高端UI设计、电影级动画、AI生成的媒体资源、有说服力的文案写作和视觉艺术。构建完整、视觉冲击力强的网页，包含真实媒体、高级动态和引人入胜的文案。使用场景：构建着陆页、营销网站、产品页面、仪表盘，生成媒体资源（图片/视频/音频/音乐），撰写转化文案，创建生成艺术，或实现电影级滚动动画。
```

### 什么是MiniMax Token Plan

| 套餐 | 文本生成能力 | 图片生成 | 图片识别（依赖模型） | 音频生成 | 视频生成 |
| --- | --- | --- | --- | --- | --- |
| Token Plan | ✅ | ✅ | ✅ | ✅ | ✅ |
| Coding Plan | ✅ | ❌ | ✅ | ❌ | ❌ |
|  |  |  |  |  |  |

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 技能安装

```text
claude plugin marketplace add https://github.com/MiniMax-AI/skills
claude plugin install minimax-skills
```

### 技能使用

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

## 技能解析：tdd-workflow

##### 🌟 技能一句话简介

这是一个帮助你在开发中严格遵守测试驱动开发 (TDD) 原则的技能，它要求你“先写测试，再写代码”，并强制保证测试覆盖率必须达到 80% 以上。

##### 🎯 触发场景

- 当你要开发新功能、API 接口或新组件时。

- 当你需要修复项目中的 Bug 或缺陷时。

- 当你需要重构（优化）现有代码，以确保你的修改不会破坏原有逻辑时。

##### 🛠️ 依赖的 Agent 与工具

- 可能联动的 Agent: tdd-guide (测试驱动开发引导专家)

- 使用的测试工具:

- 单元与集成测试：Jest, Vitest

- 端到端（E2E）UI测试：Playwright

- 高频命令行: npm test (运行测试), npm run test:coverage (检查代码覆盖率)

##### 🗺️ 核心流程图

##### 👣 流程步骤详解

1. 构思用户旅程 (User Journeys)：在写任何代码前，先用大白话梳理出用户会怎么使用这个功能。比如：“作为一个购物者，我希望点击搜索框能搜到商品”。明确了需求再动手。

1. 编写测试用例 (Generate Test Cases)：根据刚才梳理的功能，直接开始写测试代码。这时候你其实还没有写任何实际的功能代码，所以这些测试只是在定义“成功”的标准。

1. 运行测试，看着它失败 (Run Tests)：在终端运行 npm test。这一步必须报错（爆红）。因为功能还没写，如果测试居然通过了，说明你的测试写得有问题。这证明了你的测试确确实实能拦住错误。

1. 编写实现代码 (Implement Code)：开始写真正的业务代码。这时候你的目标只有一个：用最简单、最少的代码，让刚才报错的测试通过就好，先别管代码好不好看。

1. 再次运行测试，看着它通过 (Run Tests Again)：再次执行测试。如果所有测试都变绿了，恭喜你，你的功能逻辑已经走通了！如果没过，就回去继续修 Bug。

1. 重构代码 (Refactor)：现在你有了一张“安全网”（全部通过的测试），你可以放心大胆地去优化代码的命名、去掉重复代码、提升性能。不管你怎么改，只要测试还是绿的，就说明功能没坏。

1. 验证覆盖率 (Verify Coverage)：最后执行覆盖率检查命令（如 npm run test:coverage）。AI 会确保你写的测试不仅覆盖了正常的顺风局，连各种报错、空数据等边缘情况也覆盖到了，整体达标率至少是 80%。

## Codex 要验 Claude Code牌？在 Claude Code 中使用 Codex 插件 进行 Review，OpenAI 官方出品

### 这个插件解决了什么问题？

你如果在用 Claude Code，有时候会不会想，找另外一个“高手”来帮我 review 下 Claude 代码、方案是否有问题？

这个插件就是解决下面这几个问题：

- 我想让 Codex 再帮我做一轮 review

- 我想看 Codex 对某个设计方案会不会提出不同意见

以前得双开 Claude Code+Codex 才能达到这个效果，而且还有可能上下文没办法共享。

有了这个插件，就是把 Codex 的部分能力整合到 Claude Code 了

### 安装Codex-Plugin-CC

打开 Claude Code。

前提是需要 Codex 能正常使用

```text
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
然后运行
/codex:setup
```

### 常用命令

##### /codex:review

这个是最基础的，只读 review。

适合：

- 看当前未提交改动有没有问题

- 看当前分支相对 main 的改动有没有问题

它不会改代码，只负责审查。
 文档里还特别说了，多文件改动时 review 可能比较久，更建议后台跑。

你可以理解成：

“让 Codex 作为第二审稿人，再看一遍我现在这份代码。”

常见用法：

- /codex:review

- /codex:review --base main

- /codex:review --background

详细阅读：

##### /codex:adversarial-review

这个比普通 review 更“挑刺”。

普通 review 更像：

- 有没有 bug

- 有没有明显风险

- 有没有代码质量问题

而 adversarial-review 更像：

- 你这个方向是不是一开始就选错了？

- 这个缓存设计是不是不合理？

- 这个重试策略是不是有隐患？

- 有没有更简单、更稳的实现方式？

文档里说得很清楚，它是用来挑战实现方案和设计决策的，适合在发版前做压力测试，重点盯设计选择、权衡、隐藏假设、竞态、回滚、可靠性这些问题。

所以你可以把它理解成：

普通 review 看“代码写得对不对”，
 adversarial-review 看“这条路走得对不对”。

详细阅读：

##### /codex:rescue

这个是最有意思的。
 它不是只读 review，而是把一个任务委派给 Codex。

适合：

- 调查 bug

- 尝试修复

- 接着上一次任务继续做

- 用更小模型快速跑一遍

比如：

- /codex:rescue investigate why the tests started failing

- /codex:rescue fix the failing test with the smallest safe patch

- /codex:rescue --resume apply the top fix from the last run

它支持 --background、--wait、--resume、--fresh，而且如果你没指定 model 或 effort，Codex 会自己选默认值。

这个命令最像你说的那种：

“把这个活外包给 Codex 先去跑，我这边继续干别的。”

##### /codex:status

看后台任务状态。

也就是看看 Codex 现在在跑什么、跑完没有。

适合：

- 查后台任务进度

- 看最近完成的 job

- 确认任务是不是还活着

##### /codex:result

看任务最终结果。
 如果有 session ID，还可以直接用 codex resume &lt;session-id&gt; 去 Codex 里恢复那个会话继续干。

也就是说，Claude Code 里发起，Codex 里继续接管，这条链路是打通的。

##### /codex:cancel

取消后台任务。

这个很好理解，就是停掉正在跑的 Codex job。

##### /codex:setup

这个是环境检查命令。

它会检查：

- Codex 有没有安装

- 有没有登录

- 能不能正常使用

如果没装 Codex 且本机有 npm，它还能提示帮你安装。
 如果没登录，会提示你执行 !codex login。

### 两个 Review 对比

重点：两个Review都只有 read 权限，不会修改代码

| 特性 | /codex:review | /codex:adversarial-review |
| --- | --- | --- |
| 审查风格 | 标准代码审查 | 挑战设计决策与假设 |
| 自定义重点 | ❌ 不支持 | ✅ 支持 focus text |
| 审查目标 | 工作区/分支 | 工作区/分支 |
| 运行模式 | 前台/后台 | 前台/后台 |
| 审查深度 | 找缺陷 | 证伪方案（你是不是从一开始就选错了实现方向） |
| 适用场景 | 代码的常规检查&lt;br&gt;写完一个功能，提交前扫一遍&lt;br&gt;AI 一次改了很多文件，先做常规验收&lt;br&gt;分支准备提 PR，对比 main 做一轮 review | 关键变更上线前的深度审视&lt;br&gt;发版前，怀疑方向不是最优&lt;br&gt;改了缓存、重试、并发、状态流转等复杂逻辑&lt;br&gt;做鉴权、支付、数据一致性这种高风险模块时，想专门拷打方案 |

#### 💡 使用建议

- 日常小改动：用 /codex:review 就够了

- 核心逻辑变更（数据库迁移、并发处理、权限变更）：用 /codex:adversarial-review

- 想聚焦特定问题：/codex:adversarial-review 重点审查这次的并发锁逻辑

- 大规模重构：/codex:adversarial-review --background --base main 审查重构后的架构风险

## 技能全景解析：Codex Adversarial Review (对抗性代码审查)

#### 🌟 技能全景简介

这个技能是 Codex 对抗性代码审查命令——它不是普通的代码审查，而是一个"找茬专家"。它会像最苛刻的技术架构师一样，主动挑战你的设计决策、质疑你的假设、试图证明你的代码不应该上线。它不只是找 Bug，而是从根本上审视"这个方案到底对不对"。

#### 🎯 触发场景

当你执行了 /codex:adversarial-review 命令时就会触发。与普通 review 相比，它有以下特点：

- 支持 --wait（前台等待）、--background（后台运行）

- 支持 --base <分支名> 指定基准分支

- 支持 --scope auto|working-tree|branch 指定审查范围

- 支持自定义 focus text（如"重点审查这次的并发处理逻辑"）

- 纯审查模式：只读不修改代码

#### 🗺️ 全局核心流程图

#### 👣 主线流程步骤详解

##### 1. 参数原样传递

命令启动时，会先把用户输入的参数原封不动地打包起来。与普通 review 不同，adversarial-review 允许在参数后面追加自定义的审查重点（focus text）。

##### 2. 智能决定前台还是后台运行

- 如果用户明确指定了 --wait（前台）或 --background（后台），直接照办

- 如果用户没指定，它会通过 Git 命令（status 和 diff）估算改动规模

- 1-2 个小文件 → 推荐前台等待

- 大规模改动或不确定 → 推荐后台运行

- 拿不准的时候，宁可运行审查也不跳过

##### 3. 前台运行：原汁原味的搬运工

调用底层脚本 codex-companion.mjs adversarial-review。审查完成后，它会一字不落地把结果原样返回，绝对不会"贴心"地去帮你修 Bug 或用自己的话总结。

##### 4. 后台运行：静默守护者

通过 Claude Code 的后台机制启动任务，并友好提醒："Codex adversarial review started in the background. Check /codex:status for progress."

##### 5. 核心约束

- 只读不修改：不修复问题、不应用补丁

- 保持对抗性：不弱化对抗性审查的锋芒，不篡改用户的 focus text

- 不支持 --scope staged 或 --scope unstaged

- 与普通 review 使用相同的审查目标选择逻辑（工作区/分支）

#### 🧩 核心子组件深度拆解

##### 1. ⚙️ 核心引擎 codex-companion.mjs

角色设定：大管家与包工头

对抗性审查专属流程：

- handleReviewCommand() 以 reviewName: "Adversarial Review" 调用

- executeReviewRun() 识别到 reviewName 不是普通 "Review" 时，走对抗性审查分支：

1. collectReviewContext() 收集仓库上下文（分支、变更摘要等）

1. buildAdversarialReviewPrompt() 加载提示词模板并注入变量

1. runAppServerTurn() 调用 Codex 执行（使用 read-only 沙箱）

1. parseStructuredOutput() 解析 Codex 返回的结构化 JSON

1. renderReviewResult() 渲染结果

关键区别：

- 普通 review → 调用 runAppServerReview（内置审查器）

- 对抗性 review → 调用 runAppServerTurn + 自定义提示词 + 结构化输出解析

##### 2. 🔥 对抗性审查提示词 adversarial-review.md

角色设定：找茬灵魂指导

核心立场：

- 默认怀疑：假设变更会在微妙、高成本或用户可见的方式中失败，直到证据表明否则

- 不领情：不为好意图、部分修复或可能的后续工作给分

- 快乐路径 = 弱点：如果某东西只在理想情况下工作，就把它当作真正的弱点

7 大攻击面优先级：

1. 🔐 认证、权限、租户隔离、信任边界

1. 💾 数据丢失、损坏、重复、不可逆状态变更

1. 🔄 回滚安全、重试、部分失败、幂等性缺口

1. ⚡ 竞态条件、排序假设、过期状态、重入问题

1. 🕳️ 空状态、null、超时、降级依赖行为

1. 📦 版本倾斜、模式漂移、迁移危害、兼容性回归

1. 👁️ 可观测性缺口（隐藏故障或增加恢复难度）

审查方法：

- 主动尝试证伪这个变更

- 寻找被破坏的不变量、缺失的守卫、未处理的失败路径

- 追踪坏输入、重试、并发操作或部分完成的操作如何在代码中流转

- 如果用户提供了 focus area，重点审查，但仍报告其他实质性问题

发现标准：

- 只报告实质性发现

- 不包含风格反馈、命名反馈、低价值清理或没有证据的推测性担忧

- 每个发现必须回答：

1. 什么会出错？

1. 为什么这个代码路径有漏洞？

1. 可能的影响是什么？

1. 什么具体变更可以降低风险？

输出契约：

- 返回符合 JSON Schema 的结构化输出

- needs-attention：存在值得阻塞发布的实质性风险

- approve：只有当你无法从提供的上下文中找到任何实质性对抗发现时才使用

- 每个发现必须包含：受影响文件、line_start 和 line_end、0-1 的置信度、具体建议

- 摘要写成简洁的 ship/no-ship 评估，不是中立的复述

校准规则：

- 宁要一个强发现，不要几个弱发现

- 不要用填充物稀释严重问题

- 如果变更看起来安全，直接说安全，不返回发现

最终检查清单：

- 每个发现是对抗性的而非风格性的

- 绑定到具体的代码位置

- 在真实故障场景下合理

- 对修复的工程师可执行

#### 📊 普通 Review vs 对抗性 Review 对比

| 特性 | /codex:review | /codex:adversarial-review |
| --- | --- | --- |
| 审查风格 | 标准代码审查 | 挑战设计决策与假设 |
| 自定义重点 | ❌ 不支持 | ✅ 支持 focus text |
| 审查目标 | 工作区/分支 | 工作区/分支 |
| 运行模式 | 前台/后台 | 前台/后台 |
| 底层执行器 | runAppServerReview（内置审查器） | runAppServerTurn + 自定义提示词 |
| 输出格式 | 自由文本 | 结构化 JSON（含置信度/行号） |
| 审查深度 | 找缺陷 | 证伪方案 |
| 适用场景 | 日常代码审查 | 关键变更上线前的深度审视 |

#### 💡 使用建议

- 日常小改动：用 /codex:review 就够了

- 核心逻辑变更（数据库迁移、并发处理、权限变更）：用 /codex:adversarial-review

- 想聚焦特定问题：/codex:adversarial-review 重点审查这次的并发锁逻辑

- 大规模重构：/codex:adversarial-review --background --base main 审查重构后的架构风险

## 技能全景解析：Codex Review (代码审查)

#### 🌟 技能全景简介

这个技能是 Codex 代码审查命令——它能够自动调用 OpenAI Codex 对你当前 Git 工作区或特定分支的代码进行审查。它是一个"只读"的老实人，只会原样告诉你审查意见，绝不会擅自修改你的代码。

#### 🎯 触发场景

当你执行了 /codex:review 命令时就会触发。你可以带上各种参数来控制它：

- --wait：立马在前台看到结果

- --background：让它在后台慢慢看，不阻塞当前对话

- --base <分支名>：审查与指定基准分支的差异

- --scope auto|working-tree|branch：指定审查范围

#### 🗺️ 全局核心流程图

#### 👣 主线流程步骤详解

##### 1. 参数原样传递

命令启动时，会先把用户输入的参数原封不动地打包起来，绝不擅自增加戏份或自作主张。

##### 2. 聪明地决定是在前台还是后台运行

- 如果用户明确指定了 --wait（前台）或 --background（后台），直接照办

- 如果用户没指定，它会通过 Git 命令（status 和 diff）偷偷瞄一眼改动有多大

- 如果只是 1-2 个文件的微小改动，它会推荐用户"等一下马上好"；如果是大规模改动，它会推荐用户"放后台跑吧"

- 拿不准的时候，宁可运行审查也不跳过

##### 3. 前台运行：原汁原味的搬运工

如果是前台运行，它会调用底层脚本 codex-companion.mjs。等 Codex 审查完毕后，它会一字不落地把结果吐给你，绝对不会"贴心"地去帮你修 Bug 或用自己的话总结一番。

##### 4. 后台运行：静默守护者

如果是后台运行，它会通过 Claude Code 的后台机制启动任务，并友好地提醒你："审查已经在后台跑啦，想看进度随时敲 /codex:status 哦！"

##### 5. 核心约束

- 只读不修改：不修复问题、不应用补丁

- 原生 /codex:review 不支持自定义 focus text（需用 /codex:adversarial-review）

- 不支持 staged-only 或 unstaged-only 审查

#### 🧩 核心子组件深度拆解

##### 1. ⚙️ 核心引擎 codex-companion.mjs

角色设定：大管家与包工头

核心职责：

- 解析命令行参数，路由到不同子命令（review、adversarial-review、task、status、cancel 等）

- 校验运行环境（有没有装 Codex CLI、有没有登录）

- 管理 Git 仓库状态和审查目标解析（工作区变更 or 分支对比）

- 与 Codex CLI 服务器通信（runAppServerReview / runAppServerTurn）

- 作业状态追踪（后台任务的队列、运行、完成、取消）

- 结果渲染（JSON 或人类可读格式）

关键函数：

- handleReview() → 处理 /codex:review

- handleReviewCommand() → 通用审查处理（review 和 adversarial-review 共用）

- executeReviewRun() → 实际执行审查的核心逻辑

- validateNativeReviewRequest() → 验证原生审查请求合法性

##### 2. 🔥 进阶大招 adversarial-review (对抗性审查命令)

角色设定：吹毛求求疵的高级架构师

与普通 review 的区别：

- 不是找代码缺陷，而是挑战设计决策和假设

- 支持额外的 focus text 参数（如 "重点审查数据库迁移"）

- 使用相同的脚本入口（codex-companion.mjs adversarial-review）

触发方式：当普通的 /codex:review 无法满足你（比如你想带上自定义的审查重点时），系统会强制你使用它。

##### 3. 🧠 找茬灵魂 adversarial-review.md (提示词模板)

角色设定：对抗性审查的 AI 灵魂指导

核心立场：

- 极度怀疑：默认怀疑你的代码会在极端情况下崩溃，不会因为"理想情况"下能跑就放过你

- 专攻硬伤：不关心代码风格，只盯着致命问题——数据丢失、并发竞争、权限越界、回滚失效、版本兼容、可观测性缺口

攻击面优先级：

1. 认证、权限、租户隔离、信任边界

1. 数据丢失、损坏、重复、不可逆状态变更

1. 回滚安全、重试、部分失败、幂等性缺口

1. 竞态条件、排序假设、过期状态、重入问题

1. 空状态、null、超时、降级依赖行为

1. 版本倾斜、模式漂移、迁移危害、兼容性回归

1. 可观测性缺口（隐藏故障或增加恢复难度）

严苛的输出标准：

- 只报告实质性发现，不包含风格/命名反馈

- 每个发现必须包含：受影响文件、行号范围、置信度(0-1)、具体建议

- needs-attention：存在值得阻塞发布的实质性风险

- approve：无法从上下文中找到实质性对抗发现时才使用

#### 📊 总结

这是一个设计精良的代码审查命令系统，通过三层架构实现了灵活的前台/后台审查能力：

```text
review.md (命令定义)
    ↓
codex-companion.mjs (运行时引擎)
    ↓
Codex 内置审查器 / 对抗性提示词 (AI 审查核心)
```

| 特性 | /codex:review | /codex:adversarial-review |
| --- | --- | --- |
| 审查风格 | 标准代码审查 | 挑战设计决策 |
| 自定义重点 | ❌ 不支持 | ✅ 支持 focus text |
| 审查目标 | 工作区/分支 | 工作区/分支 |
| 运行模式 | 前台/后台 | 前台/后台 |

## AI 编程工作流1️⃣：什么是AI编程工作流？

### 什么 AI 编程工作流

会用 AI 编程，

只是入门。

想用得更稳、更快、更好，

就必须有工作流。

掌握工作流的好处：

- 使用工作流之后，AI 编程的结果更加确定，极少存在不稳定性

- 工作流可以被不同项目，模块，不同的人复用，降低个人能力依赖

- 工作流可以拆解复杂任务

- 工作流可以不断进化

### AI编程工作流的流程

我查看了十几个目前比较火的 AI 编程工作流程，总结下工作流的主流流程

### 工作流组成部分

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

- Skills(技能）

- Agents(子代理）

- Hooks (钩子）

- Commands(命令）

### 下一章节：

AI 编程工作流2️⃣：什么是规范驱动？为什么规范驱动会成为 AI 编程的最有效的方式

## 别再一步步指挥 AI 了：4 种让 AI 持续干活的方法

### 如何让AI编程持续运行？

正常的对话中，模型会根据提示词、任务难度、上下文、工具调用以及模型自己判断，主动退出结束当前对话

### 1、脚本控制

开源代表

[github.com](https://github.com/snarktank/ralph/tree/main)

### 2、Hooks 控制

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

Hooks核心：通过hooks不让 Claude Code 停止

[claude-plugins-official/plugins/ralph-loop at main · anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-loop)

Official, Anthropic-managed directory of high quality Claude Code Plugins. - anthropics/claude-plugins-official

### 3、控制AI编程工具（harness模式）

将AI编程工具（Codex, Claude Code) 包裹在自定义的工作流中，用户不再使用原工具的命令启动

[GitHub - Yeachan-Heo/oh-my-codex: OmX - Oh My codeX: Your codex is not alone. Add hooks, agent teams](https://github.com/Yeachan-Heo/oh-my-codex/tree/main)

OmX - Oh My codeX: Your codex is not alone. Add hooks, agent teams, HUDs, and so much more. - Yeachan-Heo/oh-my-codex

### 4、Goal

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

注：英文原图来自youtube @Chase AI

#### 如何配置 Goal

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

#### 如何写好持续运行的提示词

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

- 定义 Goal 的关键信息

目标 + 约束 + 验证  = 好的 /goal

目标：要完成什么

范围：哪些要做，哪些不要动

约束：技术栈、风格、兼容性

验证：怎么证明它真的完成了

根据这个信息结构，spec（规格） 文档 比较适配，所以可以下面的工具来基于模糊的目标生成具体的 spec 文档

- Openspec

[GitHub - michaelpersonal/goal-forge: Codex skill: turn a rough coding idea into a SPEC.md, GOAL.md,](https://github.com/michaelpersonal/goal-forge)

Codex skill: turn a rough coding idea into a SPEC.md, GOAL.md, and /goal-ready contract. - michaelpersonal/goal-forge

```text
git clone https://github.com/michaelpersonal/goal-forge.git ~/.codex/skills/goal-forge
```

- 内置的Plan模式

### 5、适合使用循环的场景

前提是Token充足

1）目标明确、验收标准清楚的任务

比如：

```text
做一个简单记账本
做一个 Todo App
做一个后台管理 Demo
做一个浏览器插件
```

但这里有个前提：最好先做好 PRD、原型、页面结构或验收标准。

否则你直接说：

```text
帮我做一个网站
```

AI 会自己设计、自己发挥、自己判断完成，很容易跑偏。

###### 2）测试、修复、覆盖率提升类任务

这是最适合循环的。

比如：

```text
修复所有失败测试
把测试覆盖率从 40% 提升到 75%
修复 npm run build 报错
修复 lint / typecheck 问题
根据 CI 失败日志持续修复
```

因为这类任务有天然反馈：

```text
测试通过 / 不通过
构建成功 / 失败
覆盖率达标 / 不达标
```

AI 每一轮都能根据结果继续修。

3）大量代码迁移 / 转换类任务

```text
JavaScript 迁移 TypeScript
Python 转 Java
旧组件迁移到新组件库
Vue2 迁移 Vue3
接口调用方式统一改造
```

但前提是要有验证方式：

```text
构建通过
测试通过
页面视觉不变
接口行为不变
关键路径可用
```

否则 AI 可能只是“看起来改完了”。

### 6、不适合使用循环的场景

##### 1）没有清晰完成标准的任务

比如：

```text
帮我优化一下项目
帮我把网站做高级一点
帮我提升用户体验
帮我把代码写得更好
```

这种不适合直接循环。

因为 AI 不知道什么时候算完成，要么过早停止，要么越改越乱。

##### 2）依赖不确定外部系统的任务

比如：

```text
调用第三方支付
对接微信开放平台
对接地图 API
对接不稳定的外部服务
依赖某个没验证过的 MCP / API
```

这种要先验证外部能力，再进入循环。

否则 AI 可能在一个根本不可用的外部接口上反复尝试，浪费很多时间。

##### 4）很短的任务

比如 5 到 10 分钟能交互完成的事情，不值得上循环。

```text
改一个按钮文案
修一个简单样式
加一个字段
改一个配置
修一个明确的小 bug
```

这种直接对话效率更高。

循环适合的是：

```text
你不想一直盯着它
它需要多轮验证和修复
任务本身有一定工作量
```

##### 5）强审美类前端美化

```text
让页面更高级
让首页更有设计感
优化视觉层次
调整品牌风格
```

这些不适合完全自动循环，因为审美判断很主观。

##### 6）长期经营类任务

```text
SEO 增长
账号涨粉
广告投放优化
产品增长
内容策略
转化率优化
```

这些任务的反馈周期是天、周、月，不是一次代码循环能验证的。

它们更适合“周期性任务 / mission”，不适合单次 /goal 或 Ralph Loop。

### 7、总结适合循环的公式：

```text
适合循环 =目标明确+ 可以自动验证+ 可以分步推进+ 出错可回滚+ 风险可控
```

### 8、写到最后

虽然上面说了很多场景可以用循环，但是其实现在很多模型都在支持原生的长任务执行，所以在开发中循环可能都不需要特意去调用，正常使用模型开发就完全可以了。


