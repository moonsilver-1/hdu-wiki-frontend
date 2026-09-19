---
title: "订阅、用量与价格"
date: "2026-09-20"
author: "洛洛"
excerpt: "团队采购的注意事项：新的 Business 计划已经买不到 Codex 席位，团队场景请评估 Enterprise / Edu，或者直接用 API key。"
tags: ["luoluo", "迁移"]
---

Codex **没有独立订阅**，全部挂在 ChatGPT 计划下；也可以用 API key 按 token 付费。本页数字按 2026-08-18 整理，具体额度以你账号里的显示为准——OpenAI 在 2026 年多次调整过用量策略。

## 各计划

| 计划               | 价格           | Codex                                                 |
| ---------------- | ------------ | ----------------------------------------------------- |
| Free             | $0           | 基础能力，适合快速小任务                                          |
| Go               | $8/月         | 轻量本地任务                                                |
| Plus             | $20/月        | 常规编码，含 GPT-5.6 全系                                     |
| Pro              | 起 $100/月     | 速率上限为 Plus 的 5 倍或 20 倍                                |
| Business         | $20/用户/月（年付） | **2026-06-24 起新 Business 工作区不能再购买 Codex 席位**，之前已开的可继续 |
| Enterprise / Edu | 联系销售         | 弹性                                                    |
| API key          | 按 token      | 不受 ChatGPT 额度限制                                       |

团队采购的注意事项：新的 Business 计划已经买不到 Codex 席位，团队场景请评估 Enterprise / Edu，或者直接用 API key。

## 用量怎么算

* **双窗口**：5 小时滚动窗口 + 周窗口。本地会话与云端任务**共用同一个 5 小时额度**
* 2026-04-02 起计费单位从"按消息"改为**按 token 折算 credits**，1 credit = $0.04；GPT-5.6 平均每条消息消耗 5 到 40 credits
* 2026-07-12 OpenAI 曾临时取消 Plus / Pro / Business 的 5 小时限制（周限保留），之后官方文档又列出了 5 小时窗口——所以别把窗口数字写死在团队规范里
* 用完计划内额度可以买 credits 续用（Free 与 Go 不能买，只能等窗口重置）
* Fast 模式按更高倍率扣 credits（GPT-5.6 / 5.5 约 2.5 倍）
* OpenAI 有"每涨一批用户就全员重置一次额度"的运营习惯，2026-08 用户过 1500 万时刚重置过一轮

交互界面里 `/usage` 看当前用量。

## API 价格（美元 / 百万 token）

| 模型            | 输入    | 输出     | 备注                |
| ------------- | ----- | ------ | ----------------- |
| GPT-5.6 Sol   | $5.00 | $30.00 | 旗舰                |
| GPT-5.6 Terra | $2.00 | $12.00 | 2026-07-30 降价 20% |
| GPT-5.6 Luna  | $0.20 | $1.20  | 2026-07-30 降价 80% |

credits 口径：Sol 125 / 750，Terra 50 / 300，Luna 5 / 30（输入 / 输出 credits 每百万 token），乘 $0.04 正好对上。

## 当前模型

模型命名在 2026-07 彻底换了：不再有 `gpt-5-codex`、`gpt-5.1-codex` 这类带 `-codex` 后缀的名字，Codex 直接用通用的 GPT-5.6 三档。

| 模型 ID                 | 定位                       | CLI  | Cloud |
| --------------------- | ------------------------ | ---- | ----- |
| `gpt-5.6-sol`         | 旗舰，复杂编码、Computer Use、研究  | ✅ 默认 | ✅     |
| `gpt-5.6-terra`       | 均衡日常主力，性能对标 GPT-5.5 但更便宜 | ✅    | ❌     |
| `gpt-5.6-luna`        | 快且便宜，窄任务                 | ✅    | ❌     |
| `gpt-5.3-codex-spark` | 近实时迭代的小模型，研究预览，仅 Pro     | ✅    | ❌     |
| `gpt-5.5`             | 上代旗舰                     | ✅    | —     |

默认是 `gpt-5.6-sol` + medium 推理。配置里可以写不带后缀的 `model = "gpt-5.6"`。

退役时间表：`gpt-5.4` 与 `gpt-5.4-mini` 于 **2026-08-31** 从 ChatGPT 登录的 Codex 下线（换成 Terra / Luna，API key 用户不受影响）；`gpt-5.2`、`gpt-5.3-codex` 已弃用。

## 推理强度

```toml
model_reasoning_effort = "medium"    # minimal | low | medium | high | xhigh
```

* 桌面 / IDE 里叫 Light / Medium / High / Extra High，CLI 里 Light 叫 Low
* `xhigh` 是否可用取决于模型
* **Max**：给单个任务更多推理时间；**Ultra**：自动拆给子代理并行。两者都在模型选择器里，是档位不是模型
* 官方提醒：GPT-5.5 和 GPT-5.6 的推理档位没有精确对应关系，不要照搬旧经验

## 怎么省

* 日常用 Terra，只在架构 / 大重构时切 Sol；探索类子代理用 Luna
* 一个会话一个目标，及时 `/new`；上下文越长每轮越贵
* 用 `/plan` 先出计划再执行，减少返工
* 只读任务（审查、解释）走 `read-only`，避免它顺手跑测试烧 token
* 团队规范里写"用当前推荐的默认模型"，不要写死模型名

## 中国大陆用户

OpenAI 不向中国大陆提供服务，注册、支付、登录都有区域限制，2026 年 5 到 6 月还出现过强制手机验证与账号风控收紧。本教程不提供绕过方式，请遵守 OpenAI 服务条款与当地法规。

## 参考来源

* 定价与功能矩阵：[https://learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing)
* 模型：[https://learn.chatgpt.com/docs/models](https://learn.chatgpt.com/docs/models)
* 速度与 Fast 模式：[https://learn.chatgpt.com/docs/agent-configuration/speed](https://learn.chatgpt.com/docs/agent-configuration/speed)
* GPT-5.6 发布：[https://openai.com/index/gpt-5-6/](https://openai.com/index/gpt-5-6/) （2026-07-09）
* 更新日志（GPT-5.4 退役公告 2026-07-31）：[https://learn.chatgpt.com/docs/changelog](https://learn.chatgpt.com/docs/changelog)
* Business 计划 Codex 席位变更：[https://help.openai.com](https://help.openai.com) （2026-06-24 起生效）
