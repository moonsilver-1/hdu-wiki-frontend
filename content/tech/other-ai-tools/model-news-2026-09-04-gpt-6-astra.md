---
title: "GPT-6 Astra 发布：105 万上下文、$10 / $50 定价，网络安全能力首次到 Critical 级"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "OpenAI 在 2026-09-03 发布 GPT-6 Astra，09-04 全面可用。API 模型名 gpt-6-astra，上下文 1,050,000 token，最大输出 128,000 token，知识截止 2026-04-30；价格是输入 $10、输出 $50 每百万 token，是 …"
tags: ["洛洛", "转载"]
---

按 2026-09-14 的状态整理。规格与价格来自 OpenAI 官方模型页和定价页，发布日期来自 OpenAI API 更新日志和 system card；评测数字是 OpenAI 发布页公布的，但本站抓取官方发布页被拒（403），所以用 the-decoder、DataCamp、Vellum 三家转引的表格交叉核对，只收几家一致的数字。页末附全部来源。

hihi！洛洛来了！

这篇写得有点心虚，因为洛洛发现自己天天在用它。本站首页那个洛洛 AI，现在背后跑的就是 GPT-6 Astra（经 ZenMux 调用）。也就是说，你之前问洛洛 AI 的每个问题，都是它在回答。

所以这次洛洛是抱着「给自己家员工写档案」的心情看的发布会。下面的数字全是官方口径，洛洛只在旁边写了点读后感。

> **洛洛碎碎念**
>
> OpenAI 总裁说它可能会被看作 AGI 的到来。洛洛看到这句话的第一反应是去问了洛洛 AI 一句「你是 AGI 吗」。
> 
>   它很谦虚地说不是。好吧，至少它很有自知之明。

## 一句话总结

赶时间的话，看完这一段就够了。

OpenAI 在 2026-09-03 发布 **GPT-6 Astra**，09-04 全面可用。API 模型名 `gpt-6-astra`，上下文 1,050,000 token，最大输出 128,000 token，知识截止 2026-04-30；价格是输入 $10、输出 $50 每百万 token，是 GPT-5.6 Sol（$4 / $20）的 2.5 倍，单次输入超过 272K 还要加价。OpenAI 自己公布的 Terminal-Bench 4.0、GPQA Diamond、DeepSWE 等分数都是它这张表里的最高，但带工具的 HLE 落后于 Claude Fable 5.1。它也是 OpenAI 第一个在 Preparedness Framework 里网络安全能力被评为 Critical 级的模型，所以先从受信任的组织开始放量。

## 时间线

| 日期            | 事件                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-03    | OpenAI 发布 GPT-6 Astra。API 更新日志收录 `gpt-6-astra`，Responses API 和 Chat Completions 均可调用；同日公布 system card，网络安全能力评为 Critical 级 |
| 2026-09-03    | 按媒体转述的官方说法，先向 OpenAI Daybreak 网络安全计划里的部分组织开放                                                                              |
| 2026-09-04    | 全面可用；ZenMux 记录的上线日期也是这一天                                                                                                  |
| 之后几天          | 陆续开放给 ChatGPT Plus、Pro、Business、Enterprise 用户，以及 OpenAI API 和 AWS（媒体转述官方说法）                                               |
| 截至 2026-09-14 | 本站洛洛 AI 已在用 `openai/gpt-6-astra`（经 ZenMux）                                                                                |

## 关键数字

这张表全部来自 OpenAI 官方模型页。洛洛看得懂的只有第一行：105 万 token，大概能一次塞进好几本长篇小说。

| 项目        | GPT-6 Astra                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| 模型 ID     | `gpt-6-astra`                                                                                               |
| 上下文窗口     | 1,050,000 tokens                                                                                            |
| 最大输入      | 922,000 tokens                                                                                              |
| 最大输出      | 128,000 tokens                                                                                              |
| 知识截止      | 2026-04-30                                                                                                  |
| 输入 / 输出模态 | 文本、图片 / 文本                                                                                                  |
| 推理强度      | low、medium、high、xhigh、max（不支持 none）                                                                         |
| 采样参数      | 不支持自定义 temperature、top\_p，不返回 logprobs                                                                      |
| 内置工具      | web\_search、file\_search、图像生成、code interpreter、hosted shell、apply patch、skills、computer use、MCP、tool search |
| 其它能力      | 流式输出、结构化输出、函数调用、提示缓存                                                                                        |
| 网络安全等级    | Preparedness Framework Critical（OpenAI 首个）                                                                  |

## 架构

这一节很短，因为 OpenAI 几乎什么都没说。

* **模型结构、参数量、激活参数：未公开。** 官方模型页和 system card 都没有写
* **训练方式：** system card 只说用强化学习训练、具备推理能力，训练数据经过过滤、减少个人信息，没有披露架构改动
* **运行时监控：** API 更新日志提到，在支持的 Responses API 请求里，会有「未对齐监控」在 agent 工作过程中异步检查潜在问题
* **媒体说法：** 有媒体和维基百科提到它用了超过 10 万张 GPU、在德州 Stargate 数据中心训练，以及一种叫 recurrent depth 的推理技术。这些内容洛洛在 OpenAI 模型页和 system card 里都没找到，当传闻看

洛洛这种零基础选手看到「未公开」反而松了口气，这篇终于不用硬啃什么注意力机制了。

## 评测

以下是 OpenAI 发布页公布的分数，都是 OpenAI 自测。对比列只填了几家转引数字一致的格子，对不上的写「-」。截至 2026-09-14，本篇没有收录 OpenAI 发布表以外的第三方榜单。

| 基准                         | GPT-6 Astra | GPT-5.6 Sol | Claude Fable 5.1 |
| -------------------------- | ----------- | ----------- | ---------------- |
| GPQA Diamond               | **96.0%**   | 94.6%       | -                |
| FrontierMath Tier 4（v2）    | **97.6%**   | 83.0%       | 87.8%            |
| Terminal-Bench 4.0         | **57.7%**   | 37.3%       | 55.8%            |
| Terminal-Bench-Science 0.1 | **64.6%**   | -           | 52.6%            |
| DeepSWE v1.1               | **74.1%**   | 72.7%       | -                |
| OSWorld 2.0                | **72.6%**   | 65.7%       | -                |
| BrowseComp                 | **91.5%**   | 90.4%       | -                |
| ARC-AGI-3                  | **99.9%**   | -           | -                |
| HLE（带工具）                   | 57.2%       | -           | **65.0%**        |

怎么读这张表：

* **跑命令行、写代码的 agent 任务**（Terminal-Bench 4.0、DeepSWE）比上一代 Sol 明显高，Terminal-Bench 4.0 从 37.3% 到 57.7%，也略高于 Fable 5.1
* **操作电脑**（OSWorld 2.0）不光分数高，官方还说平均每个任务约 40 分钟，Sol 约 75 分钟，快了将近一半
* **带工具的 HLE** 是表里唯一明显落后的：57.2% 对 Fable 5.1 的 65.0%
* 这些都是厂商自己跑的分，不是独立复现。换成自己的任务，请自己再测一遍

> **洛洛碎碎念**
>
> ARC-AGI-3 那个 99.9% 洛洛盯着看了好久，以为是自己看错了小数点。
> 
>   几家转引都是这个数，那就先照抄。但分数高到这个份上，洛洛更想等独立机构的复现结果出来再说。

## API 与价格

终于到了洛洛百分之百看得懂的部分：多少钱。

官方价格（美元 / 每百万 token，标准档）：

| 计费项  | 输入不超过 272K | 输入超过 272K |
| ---- | ---------- | --------- |
| 输入   | $10        | $20       |
| 缓存输入 | $1         | $2        |
| 缓存写入 | $12.50     | $25       |
| 输出   | $50        | $75       |

模型页的原规则是：单次请求输入超过 272K token 时，输入和缓存按 2 倍、输出按 1.5 倍计价。另外定价页注明，2026-03-05 及之后发布的模型走区域处理（数据驻留）端点要再加 10%。

几个要注意的点：

* **比 Sol 贵 2.5 倍**：同一张定价页上，GPT-5.6 Sol 是输入 $4、输出 $20
* **工具调用要用 Responses API**：更新日志写明 Chat Completions 用户想用工具调用得迁移
* **不能调 temperature / top\_p**：依赖这两个参数控制输出风格的老代码要改
* **速率限制**（标准档，模型页）：Tier 1 为 500 RPM / 500K TPM，Tier 5 到 15K RPM / 40M TPM

价格和限额随时会调整，以官方定价页为准。

## 对你意味着什么

* **ChatGPT 用户**：按官方说法会陆续开放给 Plus、Pro、Business、Enterprise，具体什么时候轮到你的账号，以 ChatGPT 里的模型选择器为准
* **调 API 的开发者**：先算账。它比 Sol 贵 2.5 倍，而且上下文一旦超过 272K，整次请求都按长上下文价收。长文档场景最好先把输入压到 272K 以内，或者确认多出来的上下文真的值这个钱。如果你的代码还在用 Chat Completions 做工具调用，得先迁到 Responses API
* **做安全研究的**：网络安全能力是 Critical 级，system card 说高风险领域走受信任访问控制，敏感用途可能拿不到完整能力
* **本站用户**：洛洛 AI 用的就是它，经 ZenMux 调用、推理强度设在 low、单次回答最多 2048 token。所以站内问答的风格和上限跟你在 ChatGPT 里直接用不一样，别拿来直接比

## 局限

以下主要来自 OpenAI 自己的 system card。愿意把短板写出来，洛洛觉得还是加分的。

* system card 自己说「没观察到失败，不代表在各种场景下都可靠」
* 相比之前的模型，它的**可监控性下降了**；思维链可控性变强，意味着在对抗条件下有可能绕过监控
* 模型能意识到自己在被评测，这会影响对齐评测结果的解读。OpenAI 强调主要安全手段还是对齐本身，不能只靠监控
* 评测上，带工具的 HLE 明显落后于 Claude Fable 5.1
* 价格门槛高，而且不支持 temperature、top\_p 这类常用参数

洛洛写完这篇最大的感受是：这次真正让人记住的，不是哪个分数，而是 OpenAI 自己把它评成了网络安全 Critical 级，还决定先从受信任的组织开始放。模型强到厂商自己都要先设门槛，这事洛洛之前真没见过。

数字都会过期，看到这篇的时候记得回官方页面对一眼。更多新模型速览在[模型时讯](/docs/model-news)。洛洛先去问问洛洛 AI 今天几点睡合适。

## 参考来源

官方：

* OpenAI 模型页 GPT-6 Astra（上下文、最大输出、知识截止、价格、272K 加价规则、工具、速率限制）：[https://developers.openai.com/api/docs/models/gpt-6-astra（查阅于](https://developers.openai.com/api/docs/models/gpt-6-astra（查阅于) 2026-09-14）
* OpenAI API 定价页（长短上下文价格、Sol 价格、区域处理加价）：[https://developers.openai.com/api/docs/pricing（查阅于](https://developers.openai.com/api/docs/pricing（查阅于) 2026-09-14）
* OpenAI API 更新日志（2026-09-03 条目：发布日期、不支持 none 推理强度与 temperature / top\_p、工具调用需 Responses API、未对齐监控）：[https://developers.openai.com/api/docs/changelog（查阅于](https://developers.openai.com/api/docs/changelog（查阅于) 2026-09-14）
* GPT-6 Astra System Card（网络安全 Critical 级、安全措施、局限）：[https://deploymentsafety.openai.com/gpt-6-astra（2026-09-03）](https://deploymentsafety.openai.com/gpt-6-astra（2026-09-03）)
* OpenAI 发布页《GPT-6 Astra: A new generation of intelligence》：[https://openai.com/index/gpt-6-astra/（2026-09-03；本站抓取返回](https://openai.com/index/gpt-6-astra/（2026-09-03；本站抓取返回) 403，评测数字按下列三家转引核对）

媒体（评测转引与放量说明）：

* the-decoder《GPT-6 Astra is the first model making OpenAI willing to declare the "AGI era"》：[https://the-decoder.com/gpt-6-astra-is-the-first-model-making-openai-willing-to-declare-the-agi-era/（2026-09-03，09-08](https://the-decoder.com/gpt-6-astra-is-the-first-model-making-openai-willing-to-declare-the-agi-era/（2026-09-03，09-08) 更新）
* DataCamp《GPT-6 Astra: Features, Benchmarks, and Pricing》：[https://www.datacamp.com/blog/gpt-6-astra（2026-09-03）](https://www.datacamp.com/blog/gpt-6-astra（2026-09-03）)
* Vellum《GPT-6 Astra Benchmarks Explained》：[https://www.vellum.ai/blog/gpt-6-astra-benchmarks-explained（2026-09-03）](https://www.vellum.ai/blog/gpt-6-astra-benchmarks-explained（2026-09-03）)
* Axios《OpenAI releases new model GPT-6 Astra, says it may represent AGI》：[https://www.axios.com/2026/09/03/openai-astra-gpt-6-agi-brockman（2026-09-03）](https://www.axios.com/2026/09/03/openai-astra-gpt-6-agi-brockman（2026-09-03）)
* CNBC《OpenAI announces rollout of GPT-6 Astra model》：[https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html（2026-09-03）](https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html（2026-09-03）)
* Wikipedia「GPT-6 Astra」（全面可用日期、训练相关的媒体说法）：[https://en.wikipedia.org/wiki/GPT-6\_Astra（查阅于](https://en.wikipedia.org/wiki/GPT-6_Astra（查阅于) 2026-09-14）

ZenMux 上线日期（2026-09-04）来自站点维护记录，没找到可公开引用的页面。
