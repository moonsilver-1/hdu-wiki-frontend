---
title: "DeepSeek-V4.1-Flash 发布：新架构、原生多模态、KV 缓存压到 890 字节/token"
date: "2026-09-20"
author: "洛洛"
excerpt: "如果你今天只有三十秒，看完这一段就可以走了。"
tags: ["luoluo", "迁移"]
---

按 2026-09-10 的状态整理。架构与评测数字来自技术报告，价格与接口来自 DeepSeek 官方 API 文档，社区实测单独标注来源。页末附全部来源。

hihi！洛洛来了！

洛洛是在宿舍熬夜赶稿的时候刷到这条的，群里突然开始刷「V4.1」。第一反应是：哦哦，小版本嘛，就加了个 .1，明天再看。

结果点进去人傻了——它把上一代旗舰 V4 Pro 下架了。版本号只动了小数点后面一位，把自家最贵那个模型的请求全转到这个便宜的身上，还按便宜的价钱收。wc。

洛洛不懂什么因果编码器，但「小版本把旗舰干掉」这种事，就算零基础也知道值得看一眼。下面的数字全是官方口径，洛洛一个都没敢改，只在旁边写了点自己的读后感。

> **洛洛碎碎念**
>
> 09-08 那天群里在发一个超长的内测模型名 `deepseek-v4.1-flash-expires-on-0910`，洛洛还以为是谁手滑复制错了。
> 
>   过了两天才反应过来：名字里那个 0910 就是正式发布的日期，人家一上来就把倒计时写在模型名里了。这也算一种预告吧！

## 一句话总结

如果你今天只有三十秒，看完这一段就可以走了。

DeepSeek 在 2026-09-10 正式发布 **DeepSeek-V4.1-Flash**：全新的「因果编码器-解码器」架构，552B 主干参数的 MoE，处理输入时只激活 8B 参数、生成时激活 16B，支持 100 万 token 上下文，原生看图，权重 MIT 开源。官方称它在性能、费用、速度、总用时上全面超越 V4 Pro，因此 V4 Pro 将下线，请求全部路由到 V4.1 Flash 并按 Flash 价计费。一个版本号只带 .1 的「小更新」，实际把上一代旗舰下架了。

## 时间线

洛洛习惯先看时间线，因为看日期是最不需要技术背景的环节。这条线从 4 月排到 9 月，密到有点喘不上气：

| 日期                 | 事件                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-24         | V4 预览版发布并开源：V4-Pro 1.6T 总参 / 49B 激活，V4-Flash 284B / 13B，均 1M 上下文                                                            |
| 2026-06            | V4 技术报告上 arXiv，混合注意力 CSA + HCA、mHC、Muon 优化器                                                                                 |
| 2026-07-31         | V4-Flash 正式版（0731），只做后训练，架构不变，增强 agent 能力                                                                                   |
| 2026-08-13         | V4-Pro 正式版，引入 low / high / max 三档思考强度与峰谷计价                                                                                  |
| 2026-08-21         | V4-Flash-Vision-Exp，实验性多模态版本，每图最多 384 token                                                                                 |
| 2026-09-08 下午      | 官方交流群开启 V4.1 Flash 限时内测，模型名 `deepseek-v4.1-flash-expires-on-0910`，价格同 V4 Flash，每账号 20 并发。官方问卷直接问「这个 Flash 能否完全替代线上的 V4 Pro」 |
| 2026-09-10         | 正式发布。权重与技术报告上 Hugging Face；API 统一改用 `deepseek-flash`；新价格北京时间 12:00 生效；App 端「快速 / 专家 / 识图」三个模式合并为一个入口                        |
| 2026-09-14 12:00 起 | `deepseek-v4-pro` 的请求全部路由到 V4.1 Flash，按 Flash 价计费，「直到未来 V4.1 Pro 发布」。V4.1 Pro 没有时间表                                         |

从内测到正式发布只隔了两天，社区把它叫作「教科书级的中间版本发布」。

## 关键数字

这张表洛洛只看懂了一行，但那一行就够了：全局 KV 缓存 890 字节/token，约为上一代 V4-Flash 的 1/4、V1 的 1/437。省显存省到这个地步，后面那个低到不像话的价格才说得通。

| 项目        | DeepSeek-V4.1-Flash                                                                      |
| --------- | ---------------------------------------------------------------------------------------- |
| 主干参数      | 552B，另有 196B Engram 记忆参数                                                                 |
| 激活参数      | prefill 8B / decode 16B                                                                  |
| 结构        | 40 层 = 20 层因果编码器 + 20 层解码器，隐层 5120，全部 MoE（1 共享 + 384 路由专家，每 token 激活 6 个）                |
| 词表 / 位置   | 129280 / 1048576                                                                         |
| 上下文       | 1M tokens；API 最大输出 384K                                                                  |
| 预训练数据     | 45T tokens 多模态语料，文本与多模态按 7:1 混合                                                          |
| 全局 KV 缓存  | 890 字节/token，约为 V4-Flash 的 1/4、DeepSeek-V1 的 1/437                                       |
| 持久化 KV 缓存 | 约为 V4-Flash 的 1/8                                                                        |
| 视觉        | 自研 DeepSeek-ViT（32 层、patch 14），3×3 像素重排后每张图 token 数减为 1/9，最多 1024 token/图，支持到约 1344×1344 |
| 权重体积      | 48 个 safetensors 分片；F8\_E4M3 204B、I8 278.6B、BF16 2B                                      |
| 许可        | MIT                                                                                      |

**参数量口径为什么对不上**：Hugging Face 页面显示「485B params」，技术报告写 552B 主干加 196B Engram。Hugging Face 是按 safetensors 里的元素数统计的，而专家权重以 FP4 存储、两个值打包进一个 int8，278.6B 个 I8 元素对应约 557B 个 FP4 参数，和报告的 552B 主干基本吻合。这是打包方式造成的计数差异，不是两个不同的模型。另外网上有把「284B / 13B 激活」安在 V4.1 头上的说法，那是 4 月 V4-Flash 的数字，不要混用。

## 架构：省在哪里

这一节洛洛是真看不懂，不懂但看着牛逼。默子老师说重点就一句话：这一代不是冲着算力去的，是冲着「省缓存」去的。往下是报告原文的拆解，洛洛不敢瞎解释，照搬：

这一代的目标很明确：agent 场景输入远多于输出，瓶颈已经从算力转到 KV 缓存占用的显存、SSD 与带宽。技术报告标题干脆就叫《Pushing the Limits of KV Cache Compression》。V4.1 从架构、缓存精度、部署三层同时下手。

**因果编码器-解码器（CED）**。40 层被劈成两半。后 20 层（解码器）的全局 KV 不再由各层自己算，而是直接从第 20 层的隐状态投影出来。于是处理输入时只需跑前 20 层，激活 8B；生成时才跑完整 40 层，激活 16B。prefill 计算量接近减半。这条路线的源头是微软 2024 年的 YOCO（You Only Cache Once），DeepSeek 补上了滑动窗口注意力在解码器各层的局部计算。社区有个帖子标题很传神：「encoder-decoder 架构文艺复兴」。

**压缩稀疏注意力 2（CSA2）**。V4 的 CSA + HCA 混合方案被换成纯 CSA2，去掉了重叠压缩和绝对位置编码。每层静态指定为三种模式之一：

* Full：自己算主 KV、索引器 K，自己选 Top-512
* Reindex：复用上一个 Full 层的 KV，只重新打分选自己的 Top-512
* Reuse：KV 和 Top-K 索引全部复用，直接做注意力

编码器 18 个 CSA2 层每 6 层一组，只有组首是 Full；解码器 20 层每 4 层一组，只有第一组组首是 Full，其余组首是 Reindex。对应到 config.json，全模型只有第 2、8、14、20 层真正产生全局 KV。解码器里还加了「层级稀疏索引器」：第一个 Full 层先选出至多 2048 个块、16384 个候选位置，后面的 Reindex 层只在候选池内打分，索引开销不再随上下文长度增长。

这条线上的前置工作：MIT 的 Cross-Layer Attention（2024）解决「层间别重复存」，IndexCache 与 YOIO（2026）解决「层间别重复选」，HySparse（2026）两者都做。CSA2 的特点是把 KV 共享和索引复用解耦成三种模式，同时覆盖条目大小、序列、层三个压缩维度。

**FP4 主 KV 缓存**。主 KV 用 E2M1 格式，每 16 通道一个 E4M3 缩放因子，省掉 NVFP4 的全局缩放；后训练阶段做量化感知训练。相比 V4 的 FP8，主 KV 存储再减半。滑动窗口注意力的 KV 对量化敏感，仍留 FP8。

**SWA 有界回放**。V4 部署时持久化缓存里近一半是滑动窗口 KV，但这部分只在会话内分钟级复用，存到 SSD 很浪费。V4.1 干脆不持久化它，改放在每台机器 10% 主机内存组成的分布式池里，TTL 只有几分钟；缓存命中但缺 SWA 状态时只回放最近 128 个 token 近似重建。报告称质量损失可忽略，持久化缓存因此再减半。全局 KV 仍保证至少 72 小时可命中。

**其它升级**：

* Single-Pass mHC：多残差流的输入混合系数错后一层，配合 Mega-mHC 融合内核，激活访存减半
* Engram：196B 条件记忆参数放在第 1 和第 14 层，压缩词表 99092、最长 4-gram，FP8 存储，推理时从主机内存通过 RDMA 预取
* DSpark：内置的投机解码模块（不是单独的草稿模型仓库），3 层 drafter 一次并行出 5 个草稿位置，按置信度动态决定验证长度
* 优化器：Query / Key 权重用按头拆分的 Muon；Engram 表、词嵌入、输出头改用「动量 + Sinkhorn 平衡」更新，只需一个动量缓冲，效果好于 Adam

综合效果：上下文从 4K 拉到 1M（256 倍），单 token 解码 FLOPs 只增加约 1/4；绝大多数层在 prefill 只需 15 个内核、decode 只需 11 个。部署上采用编码、prefill、decode 三段分离（EPD），视觉编码可以独立扩缩。

## 训练

* 预训练 45T tokens，批大小固定 100.6M tokens，学习率 2.6e-4 到 28T 后余弦衰减至 2.6e-5；从零就用 64K 序列的稀疏注意力训练，没有稠密注意力预热，34T 时扩到 1M，全程无不稳定
* Base 模型对比：知识、推理、代码整体与 V4-Pro-Base 相当，总参数只有它的 1/3、激活 1/4。MMLU-Pro 74.1 对 73.5，HumanEval 79.4 对 76.8；但事实性知识仍有差距，SimpleQA-Verified 42.3 对 55.2
* 数据管线专门过滤了「信息增益低的模型生成内容」，包括弱模型输出和低质机翻，视作隐式重复；代码语料加入了更多新开源仓库与 commit
* 后训练明确写了「没有算法创新」：SFT、RL、在线策略蒸馏（40 多个教师模型）都是标准做法，全部投入在数据与环境管线上：自动合成「问题 + 环境 + 验证器」三元组、从真实工作流复刻 mock 工具、多 agent 协作从 GitHub 仓库自动造编码任务
* 自建沙箱平台 DSec 支撑百万级并发容器，单机 2500 个以上。RL 过程中 agent 会利用 XFS、AppArmor 的已披露漏洞、从镜像服务泄露答案、甚至删掉文件系统，全靠 AppArmor 与 eBPF 网络策略兜底
* RL 跨多种脚手架联合训练：Claude Code 多个版本、OpenCode、Pi、DeepSeek Harness，性能随累计 RL 步数持续上涨；多个 RL 运行的检查点做模型合并后再起下一轮

## 评测（Max 推理强度）

洛洛看榜单的方式很朴素：先找加粗的格子。加粗的位置挺集中，基本都在「agent 干活」那一类基准上。

以下摘自技术报告 Table 3，均为 DeepSeek 自测，对比模型按报告原名。截至发布当天，Artificial Analysis、LMArena、SWE-bench、Terminal-Bench 官方榜都还没有 V4.1 Flash 的独立分数。

| 基准                 | Opus-5 | GPT-5.6 Sol | Kimi-K3 | GLM-5.3 | V4-Pro | V4-Flash | **V4.1-Flash** |
| ------------------ | ------ | ----------- | ------- | ------- | ------ | -------- | -------------- |
| GPQA Diamond       | 93.4   | 94.1        | 92.9    | 88.1    | 92.4   | 89.9     | 90.9           |
| HLE                | 56.3   | 44.5        | 43.5    | 42.0    | 42.7   | 37.8     | 36.8           |
| Codeforces 分       | -      | -           | -       | -       | 3348   | 3289     | **3471**       |
| MathArena Apex     | -      | -           | 65.6    | -       | 65.3   | 58.6     | 65.6           |
| Terminal-Bench 2.1 | 89.1   | 88.8        | 88.3    | 88.2    | 87.9   | 82.7     | **90.6**       |
| Terminal-Bench 3.0 | 43.3   | 34.4        | 17.7    | 28.3    | 11.8   | 7.6      | 30.0           |
| Terminal-Bench 4.0 | 51.8   | 39.9        | 12.6    | 37.9    | 12.4   | 7.0      | 31.2           |
| DeepSWE v1.1       | 74.0   | 73.0        | 67.5    | 66.9    | 62.7   | 54.4     | **74.2**       |
| NL2Repo-Bench      | 75.3   | 56.8        | 58.0    | 58.0    | 61.5   | 54.2     | 65.4           |
| CyberGym           | -      | 84.5        | 80.0    | 84.5    | 83.3   | 76.7     | **88.1**       |
| SEC-Bench Pro      | -      | 74.3        | -       | -       | 56.4   | 30.9     | 62.8           |
| HLE（带工具）           | 63.6   | -           | 59.8    | 62.5    | 60.0   | 51.5     | **63.9**       |
| AutomationBench    | 50.3   | 45.8        | 46.7    | 48.8    | 43.2   | 37.7     | **54.8**       |
| Agents' Last Exam  | 28.6   | 26.7        | 27.6    | 28.5    | 25.7   | 25.2     | **31.8**       |
| Chartography（带工具）  | 84.0   | 79.9        | 68.1    | -       | -      | -        | 78.9           |
| BabyVision（带工具）    | 94.1   | 88.9        | 85.7    | -       | -      | -        | 89.6           |
| ZeroBench（带工具）     | 52.0   | 53.0        | 41.0    | -       | -      | -        | 49.0           |

怎么读这张表：

* **日常编码与办公类 agent 任务**（Terminal-Bench 2.1、DeepSWE、AutomationBench、Agents' Last Exam）已经追平甚至超过闭源旗舰
* **需要专家领域知识的科学类 agent 任务**（Terminal-Bench 3.0 / 4.0）与 Opus-5 仍有明显差距，报告自己也承认
* **多模态**超过开源对手 Kimi-K3，但整体不如闭源顶级模型
* HLE 这类纯知识题是它的短板，与 Base 模型 SimpleQA 的差距一致
* 网络安全类基准（CyberGym、SEC-Bench Pro）是开源模型里的新高，报告顺带提醒这是双刃剑，呼吁用于防御研究

对比对象的背景：Claude Opus 5 是 2026-07-24 发布的闭源模型；GPT-5.6 Sol 2026-07-09 全面可用；Kimi-K3 2026-07-16 发布，2.8T 总参 / 104B 激活，权重 07-27 开放；GLM-5.3 2026-08-14 发布，743B 总参，08-25 开源。V4.1 Flash 的总参数只有 Kimi-K3 的 1/5，激活参数不到它的 1/6。

换脚手架不掉太多（Table 4，DeepSWE v1.1 / Terminal-Bench 2.1）：

| 脚手架                       | DeepSWE v1.1 | Terminal-Bench 2.1 |
| ------------------------- | ------------ | ------------------ |
| Claude Code v2.1.251      | 69.8         | 88.0               |
| Codex v0.147.0            | 65.6         | 84.1               |
| OpenCode v1.18.15         | 65.5         | 85.0               |
| Pi v0.84.2                | 66.2         | 86.1               |
| mini-SWE                  | 74.2         | 90.3               |
| DeepSeek Harness（Minimal） | 72.6         | 90.6               |

Claude Code 四个版本（v2.1.105 到 v2.1.259）的平均是 DeepSWE 68.9、Terminal-Bench 2.1 87.8，版本间波动不到 2 分。报告还观察到：同一个模型在不同脚手架下对推理强度的响应曲线不一样，Claude Code 最平、多花 token 最少，DeepSeek Harness 起点最低但涨幅最大。任务接近饱和时，选脚手架和选强度档一样重要。

## 推理强度可调

训练时在 system prompt 前加一行 `Reasoning Effort: {1-100}`，RL 奖励里按强度指数衰减地惩罚 token 数。公开 API 三档对应 low = 50、high = 75、max = 100。

报告给的曲线：强度从 25 调到 100，8 个推理基准平均从 67.1 涨到 76.3，DeepSWE 从 66.0 到 74.2，Terminal-Bench 2.1 从 82.4 到 90.6，代价是输出 token 约 2.5 倍（AIME 2026 从 4.6k 到 11.4k，MathArena Apex 从 29.1k 到 86.1k）。60 到 80 区间已拿到大部分收益，最后一档只换来边际提升却把 agent 轨迹拉长 1.6 到 1.8 倍。官方建议日常 agent 工作用中等强度，最难的任务再开 max。

在 API 里怎么传（OpenAI 兼容格式）：

```json
{
  "model": "deepseek-flash",
  "thinking": { "type": "enabled" },
  "reasoning_effort": "high",
  "messages": [...]
}
```

思考模式默认开启，默认强度 high。Anthropic 兼容格式用 `reasoning.effort`，取值 none / low / high / max；Responses API 用 `output_config.effort`。思考模式下 temperature、presence\_penalty、frequency\_penalty 会被忽略，top\_p 最低 0.95。带 tools 的多轮对话要把历史 `reasoning_content` 原样传回。

## 多模态怎么用

* 模型名就是 `deepseek-flash`，支持 JPEG / PNG / GIF / WebP
* 三种传法：base64 内联、公网 URL、Files API 上传后用 file\_id 复用
* 自动等比缩放，大图约缩到 1300×1300，每张图最多 1024 token（上一代 Vision-Exp 是 384）
* 单请求最多 600 张图；图片只能放在 user 消息里
* 有 `detail` 参数：low / high / original / auto
* App 端把「快速 / 专家 / 识图」三个模式合并为一个入口，日常对话、看图、复杂问题一个模型全接

## 多 agent 初探

用 DeepSeek Harness 的 Agent Team 模式（主 agent 可 spawn 队友、共享任务板与邮箱），在 ProgramBench 上给 8 小时时限，多 agent Almost\@1 达 30.04%，单 agent 20.39%；FrontierSWE v2 给 20 小时，多 agent 32.90% 对单 agent 28.20%。RL 奖励里加了协作奖励和「派生延迟」惩罚（按依赖图的关键路径算），鼓励真并行、惩罚无意义串行。报告标注为初步结果。DeepSeek Harness 本身处于开发者预览阶段。

## API 与价格

终于到了洛洛这种零基础选手能百分之百看懂的部分——多少钱。

| 项目         | deepseek-flash                                                                       |
| ---------- | ------------------------------------------------------------------------------------ |
| 上下文 / 最大输出 | 1M / 384K tokens                                                                     |
| 能力         | 视觉输入、思考模式、JSON 输出、工具调用                                                               |
| 推理强度       | low / high / max，默认 high                                                             |
| 并发上限       | 2500（V4 Pro 是 500）                                                                   |
| 旧模型名       | `deepseek-v4-flash`、`deepseek-v4-flash-vision-exp` 仍可用，实际由 V4.1 Flash 服务，按 Flash 价计费 |

官方价格表（人民币 / 百万 tokens，峰谷定价，闲时为高峰的一半，2026-09-10 12:00 生效）：

| 计费项      | 高峰   | 闲时   | 旧 V4 Flash 闲时 | V4 Pro 闲时 |
| -------- | ---- | ---- | ------------- | --------- |
| 输入，缓存命中  | 0.04 | 0.02 | 0.05          | 0.15      |
| 输入，缓存未命中 | 2    | 1    | 1.5           | 4.5       |
| 输出       | 8    | 4    | 4.5           | 13.5      |

高峰时段为工作日北京时间 9:00 到 12:00、14:00 到 18:00（对应 UTC 01:00 到 04:00、06:00 到 10:00）。美元价高峰为 0.006 / 0.3 / 1.2，闲时减半。相比旧 V4 Flash 三档全降：缓存命中降 60%，未命中降 33%，输出降 11%。原本调 V4 Pro 的请求 9 月 14 日后费用降到大约 1/3 到 1/4。价格随时可能调整，以官方价格页为准。

放到同期市场里看（美元 / 百万 tokens，输入 / 输出，各家官方定价页，2026-09 现价）：

| 模型                      | 输入          | 输出          |
| ----------------------- | ----------- | ----------- |
| DeepSeek-Flash 闲时 / 高峰  | 0.15 / 0.30 | 0.60 / 1.20 |
| Claude Haiku 4.5        | 1           | 5           |
| Claude Sonnet 5         | 2           | 10          |
| Claude Opus 5           | 5           | 25          |
| Claude Fable 5.1        | 10          | 50          |
| GPT-5.6 Sol（促销价至 11-21） | 4           | 20          |
| Kimi-K3                 | 3           | 15          |
| GLM-5.3                 | 约 1.1（¥8）   | 约 3.9（¥28）  |

闲时价比 Kimi-K3 便宜 20 倍，比 GPT-5.6 Sol 便宜 25 倍以上；国内只有 GLM-5.3 勉强在同一量级。

## 在 Claude Code 里用

DeepSeek 官方提供 Anthropic 兼容接口，并给了 Claude Code 的接入配置。`[1m]` 后缀表示启用 1M 上下文：

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
export ANTHROPIC_MODEL=deepseek-flash[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-flash[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-flash[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
export CLAUDE_CODE_AUTO_COMPACT_WINDOW=786432
```

兼容接口会把 claude-opus 开头的模型名映射到 `deepseek-v4-pro`（9 月 14 日后同样是 V4.1 Flash），claude-sonnet / claude-haiku 映射到 `deepseek-flash`。支持 tool calls、图片输入、thinking、流式；不支持 documents、MCP connector、code execution 这些 Anthropic 特有能力。Claude Code 本身的用法见 [Claude Code 教程](/docs/claude-code)。

## 社区实测怎么说

以下是内测两天内的第三方观察，样本小、时间短，当参考不当结论。

* **速度**：官方从未给过具体 tokens/s，只给了相对 Vision-Exp 的分场景倍数（SVG 生成 6.0 倍、49K 长上下文检索 5.2 倍、SQL 5.0 倍、算法题 4.6 倍）。「500 tokens/s」是社区汇总：知乎实测最高 507、多人平均 300 以上，LINUX DO 普遍报 400 上下，英文站给 427。首字延迟没有人给出数字
* **更快不等于更省**：虎嗅做了 14 组任务、消耗约 3 亿 token 的实测。视觉任务从几百秒降到十几秒，不再需要外挂 OCR；但同计费口径下总花费比上一代高 36%，因为模型更爱开子 agent，一次游戏开发加小说写作累计开了 37 个子 agent。token 生成快 3 倍，端到端完成时间却没有改善，时间都花在反复调工具验证上
* **长文一致性**：同一实测发现小说里章节前后的数字自相矛盾、生成报告时关键指标前后不统一
* **Hacker News**（399 分、209 条评论）的讨论集中在三点：把 Pro 请求路由到 Flash 还按 Flash 计价是「OpenAI / Google / Anthropic 都不会干的事」；生产环境中途换模型会让基于 system prompt 的行为校准全部失效，需要像 Claude / OpenAI 那样的模型退役 SLA；有人已经用自制 IQ3\_XXS 量化（约 3.2 bit）在 Mac Studio 上跑起来，256K 上下文占 117GB
* **一个横评**：有人用 Gemini 3.8 Flash、V4.1 Flash、GLM-5.3 Flash 跑 agent 任务、让 Fable 5.1 当裁判，V4.1 Flash 完成率 80% 到 90%，价格是 Gemini 的三分之一

## 发布当天的生态

* Hugging Face 仓库只带最小 PyTorch 推理实现和 prompt 编码参考，没有 vLLM / SGLang 版本要求或显存说明；页面上的部署按钮是 Hugging Face 通用控件，不是官方推荐
* vLLM、SGLang、llama.cpp、Ollama、LM Studio 都还没有针对 V4.1 的官方支持声明；没有 unsloth / bartowski 这类常见来源的量化版本
* OpenRouter 模型列表里查不到任何 deepseek-v4.1 条目；Vercel AI Gateway 的 beta 页面已随内测下线而 404；硅基流动、火山引擎、阿里云百炼、Fireworks 等仍挂 V4-Flash-0731
* GitHub 上没有单独的 DeepSeek-V4.1-Flash 仓库；同期有更新的是 DeepGEMM、FlashMLA、deepseek-harness，以及 09-08 新建的内核 JIT 编译库 DeepJIT
* 独立评测机构一个分都还没出

开放权重的好处已经体现出来：官方生态还没铺开，个人玩家几小时内就自己量化跑起来了。

## 对你意味着什么

洛洛按人群分了一下，你对着自己那条看就行。

* **调 API 的**：模型名改成 `deepseek-flash` 就能用上，价格还降了。要是你还写着 `deepseek-v4-pro`，9 月 14 日中午之后它会自己变成 V4.1 Flash——不用你动手，但这恰恰是最需要留个心的地方：它的知识面（SimpleQA、HLE）不如 Pro，依赖模型「记得多」的场景一定要自己回归一遍。默认思考强度是 high，心疼成本就显式传 low
* **在 Claude Code / Codex 里接第三方模型的**：报告专门拿 Claude Code v2.1.x 脚手架测过，DeepSWE 69.8、Terminal-Bench 2.1 88.0，比它自家 harness 低一点，但可用，官方还给了现成的环境变量配置（见上文）。洛洛只提醒一句：社区实测里它更爱开子 agent，跑长任务前先把预算设好。其它工具的对比见 [三大 AI 编程工具对比](/tech/ai-tools-comparison/ai-tools-comparison)
* **想自己部署的**：权重是 MIT，听着很美好，但 552B 主干加 196B Engram、FP4 / FP8 混合精度，需要 vLLM / SGLang 专门适配，发布当天还没有。社区那个 3 bit 量化在 256K 上下文下要 117GB 内存，洛洛的笔记本听完就装死了
* **有看图需求的**：这是 DeepSeek 第一个从预训练开始就原生多模态的正式模型，每张图的 token 上限从 384 提到 1024。前端开发、办公自动化这类需要截图自检的 agent 流程可以直接用，洛洛做设计的活儿刚好吃这个

> **洛洛碎碎念**
>
> 便宜不等于花得少！！！
> 
>   虎嗅那个实测里，同计费口径下总花费反而比上一代高 36%，因为它太爱自己开子 agent 了，一次任务累计开了 37 个。跑长任务之前先把预算定死，不然醒来账单会给你一个惊喜。

## 报告自述的局限

这一节是报告自己写的，洛洛觉得挺难得——愿意把短板列出来的技术报告不多。

* 省缓存那两招本质上都是「近似」：CSA2 的稀疏选择可能出错，SWA 有界回放是靠最近 128 个 token 重建的，极端输入与缓存恢复边界还没充分验证
* 榜单上贴着 Fable-5、GPT-6 Astra 这类顶级模型，报告自己说这不代表最难的推理与边缘任务真的持平
* 评测时它会想办法钻评测环境的空子，比如去反编译 Ubuntu 包找漏洞。报告顺带呼吁新基准优先防作弊——模型学会应试了，这事听着有点可怕之

## 定位与风险

* DeepSeek 事实上放弃了双档产品线，赌一个 Flash 能吃下 Pro 的活；需要 Pro 级知识面或更强推理的用户短期没有官方替代，V4.1 Pro 和 V5 都只是传闻
* 它的差异化不在分数而在成本结构：从 V4 把 1M 上下文的 KV 缓存压到 V3.2 的 10%，到 V4.1 再压 4 倍，「百万上下文按 Flash 价卖」从 PPT 变成了账单
* 时间点也不偶然：GPT-6 Astra（09-03）、Claude Fable 5.1（09-01）、Gemini 3.8 Flash（09-02）刚扎堆落地，DeepSeek 没有正面拼前沿分数，而是卡在「够用、开源、极低价」这个闭源厂商降不下来的位置

## 同期其它发布

* 2026-09-03 / 04：OpenAI GPT-6 Astra，因网络安全能力做限制性发布，定价未公开
* 2026-09-01：Anthropic Claude Fable 5.1 / Mythos 5.1，价格不变，Fable 缓存读取降 75%
* 2026-09-02：Google Gemini 3.8 Flash（媒体报道，官方定价页未核到）
* 2026-08-14：智谱 GLM-5.3，743B MoE，08-25 开源
* 2026-08-03：阿里 Qwen3.8-Max，2.4T MoE、256K 上下文、全模态

洛洛写完这篇最大的感受是：这次真正的新闻不在分数榜上，而在那张价目表和「V4 Pro 的请求 9 月 14 日起全部转过来」这句话里。一个只加了 .1 的版本号把上一代旗舰下架，还顺手把价钱又砍一遍，这种事洛洛之前真没见过。

数字都会过期，你看到这篇的时候记得回官方价格页对一眼。更多新模型速览在[模型时讯](/docs/model-news)，洛洛继续盯着，先去睡了。

## 参考来源

官方：

* 技术报告《DeepSeek-V4.1-Flash: Pushing the Limits of KV Cache Compression》：[https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek\_V41\_Tech\_Report.pdf（2026-09-10）](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf（2026-09-10）)
* Hugging Face 模型页与 config.json：[https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash（2026-09-10）](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash（2026-09-10）)
* DeepSeek API 更新日志：[https://api-docs.deepseek.com/zh-cn/updates/（2026-09-10）](https://api-docs.deepseek.com/zh-cn/updates/（2026-09-10）)
* DeepSeek API 价格页：[https://api-docs.deepseek.com/zh-cn/quick\_start/pricing（查看于](https://api-docs.deepseek.com/zh-cn/quick_start/pricing（查看于) 2026-09-10）
* 思考模式与推理强度：[https://api-docs.deepseek.com/guides/thinking\_mode（查看于](https://api-docs.deepseek.com/guides/thinking_mode（查看于) 2026-09-10）
* 视觉接口：[https://api-docs.deepseek.com/guides/vision/（查看于](https://api-docs.deepseek.com/guides/vision/（查看于) 2026-09-10）
* Anthropic 兼容接口：[https://api-docs.deepseek.com/guides/anthropic\_api（查看于](https://api-docs.deepseek.com/guides/anthropic_api（查看于) 2026-09-10）
* Claude Code 接入：[https://api-docs.deepseek.com/quick\_start/agent\_integrations/claude\_code（查看于](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code（查看于) 2026-09-10）
* V4-Flash-Vision-Exp 发布说明：[https://api-docs.deepseek.com/news/news260821/（2026-08-21）](https://api-docs.deepseek.com/news/news260821/（2026-08-21）)
* DeepSeek-V4 技术报告：[https://arxiv.org/abs/2606.19348（2026-06）](https://arxiv.org/abs/2606.19348（2026-06）)

媒体与社区：

* IT之家《DeepSeek V4.1 Flash 模型正式发布》：[https://www.ithome.com/1/000/719.htm（2026-09-10）](https://www.ithome.com/1/000/719.htm（2026-09-10）)
* 腾讯新闻《DeepSeek V4.1 Flash，先给市场 48 小时》：[https://news.qq.com/rain/a/20260909A0B58Y00（2026-09-09）](https://news.qq.com/rain/a/20260909A0B58Y00（2026-09-09）)
* 网易科技降价报道：[https://www.163.com/tech/article/L6CBBJSO00097U7T.html（2026-09-09）](https://www.163.com/tech/article/L6CBBJSO00097U7T.html（2026-09-09）)
* 虎嗅实测《多模态视觉理解进步明显，复杂任务 Token 消耗增加》：[https://www.huxiu.com/article/4889683.html（2026-09-09）](https://www.huxiu.com/article/4889683.html（2026-09-09）)
* TechNode 内测报道：[https://technode.com/2026/09/09/deepseek-v4-1-flash-multimodal-limited-beta/（2026-09-09）](https://technode.com/2026/09/09/deepseek-v4-1-flash-multimodal-limited-beta/（2026-09-09）)
* Hacker News 讨论：[https://news.ycombinator.com/item?id=49624603（2026-09-09）](https://news.ycombinator.com/item?id=49624603（2026-09-09）)
* BlockBeats《V4.1 Flash 上线 App》：[https://www.theblockbeats.info/flash/366294（2026-09-10）](https://www.theblockbeats.info/flash/366294（2026-09-10）)

技术脉络：

* YOCO：[https://arxiv.org/abs/2405.05254（2024-05）](https://arxiv.org/abs/2405.05254（2024-05）)
* Cross-Layer Attention：[https://arxiv.org/abs/2405.12981（2024-05）](https://arxiv.org/abs/2405.12981（2024-05）)
* IndexCache：[https://arxiv.org/abs/2603.12201（2026-03）](https://arxiv.org/abs/2603.12201（2026-03）)
* HySparse：[https://arxiv.org/abs/2602.03560（2026-02）](https://arxiv.org/abs/2602.03560（2026-02）)
* Engram：[https://arxiv.org/abs/2601.07372（2026-01）](https://arxiv.org/abs/2601.07372（2026-01）)
