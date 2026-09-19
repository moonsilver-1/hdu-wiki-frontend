---
title: "查重与 AI 检测"
date: "2026-09-20"
author: "洛洛"
excerpt: "把这两件事混为一谈，是学生和辅导者最常见的误解，也是很多冤案的起点。"
tags: ["luoluo", "迁移"]
---

接学术辅导类单子的人几乎必然会被客户问到查重和 AI 检测。写自己论文的学生更需要看懂这些报告。

这一页讲检测器在测什么、报告怎么读、误判有多严重。不提供规避检测的方法——「降重」「降 AI 率」的产业确实存在，这里只描述它的存在与后果。

工具版本、价格和高校政策变化很快，用之前按页末来源重新核对。

## 先分清两件完全不同的事

|           | 相似度查重          | AI 检测              |
| --------- | -------------- | ------------------ |
| 测什么       | 你的文字和已存在的文字有多像 | 一个统计模型认为这段话像不像机器写的 |
| 证据形态      | 可指认的原文，能点开看来源  | 概率判断，没有来源可点        |
| 可复核性      | 高，是字符串证据       | 低，是黑箱输出            |
| 在纪律程序里的分量 | 重              | 轻                  |

把这两件事混为一谈，是学生和辅导者最常见的误解，也是很多冤案的起点。

## 查重工具

### 国际主流

| 名称                   | 官网                                | 面向      | 关键特点                           | 备注                        |
| -------------------- | --------------------------------- | ------- | ------------------------------ | ------------------------- |
| Turnitin Similarity  | turnitin.com                      | 高校（机构版） | 学生论文库 + 互联网 + 出版物三重比对          | 全球高校事实标准，不对个人售卖           |
| iThenticate          | ithenticate.com                   | 研究者、期刊  | 与 Turnitin 同源同库，但不含学生作业库       | 期刊投稿查重主力，硕博自查的合法个人渠道      |
| Turnitin Draft Coach | —                                 | 学生本人    | 在 Word Web / Google Docs 里边写边查 | 最干净的自查路径：不生成教师可见报告，不入学生库  |
| Turnitin Clarity     | —                                 | 教师      | 记录写作过程：粘贴内容、输入时长、草稿历史，可回放      | 2025-03 发布，2025 Q3 起可加购   |
| Copyleaks            | copyleaks.com                     | 教育、企业   | 查重 + AI 检测一体，多语种               | 中国大陆访问不稳定                 |
| Grammarly Plagiarism | grammarly.com                     | 写作者     | 与语法检查捆绑                        | 库深度远不及 Turnitin，不能当学位论文终检 |
| Quetext              | quetext.com                       | 学生      | 有免费档                           | 摸底级别                      |
| Scribbr              | scribbr.com                       | 学生      | 底层用 Turnitin 的库（官方合作）          | 学生能买到的、最接近学校那套库的渠道        |
| MOSS                 | theory.stanford.edu/\~aiken/moss/ | 编程课教师   | 源代码相似度，winnowing 算法            | 免费，需申请                    |
| JPlag                | github.com/jplag/JPlag            | 编程课教师   | 解析成 AST 后做贪心串块匹配               | 开源                        |

已经停用的三个别再推荐：PlagScan（2026-01-01 到生命周期终点）、Ouriginal（Turnitin 宣布 2026-06-30 关闭）、Unicheck（已停运，迁至 Turnitin）。

### 中国大陆

| 名称                       | 入口                       | 面向     | 关键特点                        |
| ------------------------ | ------------------------ | ------ | --------------------------- |
| 知网个人查重                   | cx.cnki.net              | 学生、投稿人 | 2022-06-12 起向个人开放，1.5 元/千字符 |
| 知网 VIP / TMLC            | 机构渠道                     | 研究生院   | 最严格档，含学术论文联合比对库             |
| 知网 PMLC                  | 机构渠道                     | 教务处    | 含大学生论文联合比对库                 |
| 知网 AMLC / SMLC           | 机构渠道                     | 期刊编辑部  | 查抄袭剽窃、一稿多投                  |
| 万方                       | check.wanfangdata.com.cn | 学生、期刊  | 约 30 元/万字                   |
| 维普                       | vpcs.fanyu.com           | 学生、期刊  | 查重 3.5 元/千字符                |
| 格子达                      | gocheck.cn               | 高校、学生  | 查重 3 元/千字符                  |
| PaperPass / PaperYY / 笔杆 | —                        | 学生初稿   | 库含大量互联网来源，初稿摸底用             |

知网个人查重的唯一官方入口是 [https://cx.cnki.net](https://cx.cnki.net) 。所有声称提供「知网检测服务」的第三方机构，知网方面均定性为违规假冒，其账号多来自盗用或内部倒卖。

### 「个人版查了 12%，学校查出来 18%」

这是辅导场景里最高频的客诉，原因有三条，都要能对客户讲明白。

**比对库不同。** 知网个人版没有学术论文联合比对库（历届研究生学位论文），学校用的 VIP 和 PMLC 是含的。你在个人版查不出的重复，可能正好压在师兄师姐的学位论文上。国外同理：iThenticate 与 Turnitin 同源，但不含学生作业库，所以投稿查重干净、交到学校却可能命中同学的作业。

**待检文稿是否被收录。** Turnitin 的作业设置有四种归档选项：标准学生库、机构库、不入库、让学生自选。如果第一次提交入了库，第二次提交同一篇就会 100% 命中自己——很多「重复率突然爆表」的乌龙就是这么来的。国内的第三方查重站同理。

**算法阈值与排除规则不同。** 各系统的连续重合字数阈值、引文识别能力、参考文献是否排除都不一样。同一篇论文在不同系统之间波动 5 到 10 个百分点是常态，不是谁查错了。

正确的工作流是：便宜平台做初稿摸底，按报告改稿，学校指定系统做终检。绝不能拿初稿平台的数字向客户或导师承诺终检结果。

### 别往不安全的站点传稿子

这条造成的损失不可逆。

免费或低价站点普遍把上传的稿件纳入自建库，后果是正式检测时命中自己，而且删不掉。部分站点还存在把稿件转手的商业动机。

更新的一种骗法是假报告。2026-03 中国江苏网「紫牛调查」报道，二手平台上以「低于官网价」「送 AI 检测」「官方授权」为噱头的卖家，通过非官方公众号收稿，用 AI 生成格式看似正规的虚假查重报告，实际没做任何数据库比对；部分卖家同时收集稿件，存在泄露倒卖风险。

Vanderbilt 在停用 Turnitin AI 检测的声明里，也把「把学生作业提交给隐私和数据使用政策不明的第三方检测器」单独列为风险项。

## 查重的原理

### 指纹与 shingling

主流系统不做全文两两比对（代价爆炸），流程是这样：

先规范化——去格式、去多余空白，统一大小写全半角，中文再做分词或按字符切。然后切 n-gram，把文本切成长度 k 的重叠片段，每个片段算一个哈希值。接着选指纹（winnowing）：在长度 w 的滑动窗口里只保留最小哈希值——这样既压缩了索引，又能在数学上保证只要两份文档有足够长的公共子串，就一定至少共享一个指纹。最后拿待检文档的指纹去倒排索引里找命中，把命中片段拼回连续段落，算出重合字数与比例。

MOSS 用的就是 winnowing（Stanford，1994 年起）。商业系统思路同源，差别在库的规模、分词质量和拼接规则。

坊间常说的知网「连续 13 个字符相同即标红」是经验总结，知网没有公开确认过算法细节。

### 库才是核心竞争力

算法是公开知识，库不是。同一个算法配不同的库，结果天差地别。

Turnitin 强在英文学生作业库（跨校）、出版物、网页快照；知网强在中文期刊、学位论文，以及独有的两个联合比对库；Grammarly、Quetext 之流只有网页加部分学术库，查学位论文形同摸底。

### 引用能不能排除

系统一般提供三类过滤：排除引文、排除参考文献、排除小于 N 词的匹配。有三点要清楚。

排除是有条件的。引号加规范引注的直接引语通常能被识别排除，格式不规范的（缺引号、引注写错、脚注非标准）就排不掉。

报告里「排除后」和「原始」是两个数，教师看到哪个取决于学校设置。向客户解释报告时必须说清是哪一个。

排除引文不改变学术判断。一篇 30% 全是规范引用的论文，学术上仍然可能有「引用过度、没有自己观点」的问题。

### 跨语言

Turnitin 有 Translated Matching：把非英文提交翻译成英文后再比对英文库，官方列出支持 50 余种语言，属付费附加功能，是否开启取决于学校采购。

含义很直接：把英文文献翻译成中文写进论文，属于可被检出的范围，尤其当来源文献本身就在 Turnitin 库里的时候。

### 百分比不等于抄袭

这是要反复强调的第一原则。

相似度分数统计的是文字重合，不是学术不端。参考文献列表、专业术语、法条原文、标准方法描述、量表条目、机构名称、常见句式都会计入。

Turnitin 报告的颜色带只是视觉分档，不是评分标准：蓝色无匹配，绿色 1 到 24%，黄色 25 到 49%，橙色 50 到 74%，红色 75% 以上。注意 Turnitin Similarity 与 Feedback Studio 两套界面里蓝绿的定义是相反的，看报告前先确认是哪套。

反过来，低分也不等于清白。洗稿、代写、翻译、观点剽窃（照搬论证结构但换词）都可能得到很低的相似度。

所以判断权始终在人手上：教师要点开报告看匹配落在哪里。落在参考文献是无害的，落在结论段的核心论证是危险的。同一个 20%，性质可以完全不同。

### 代码查重

| 工具             | 方法                                 | 抗改写能力                |
| -------------- | ---------------------------------- | -------------------- |
| MOSS           | 归一化去注释空白 → k-gram → 哈希 → winnowing | 对改名、改格式、删注释、插入无关代码稳健 |
| JPlag          | 解析成抽象语法树，再做贪心串块匹配                  | 对重命名、重排格式、中等程度循环重排稳健 |
| Turnitin 代码相似度 | 商业功能，算法未公开                         | —                    |

共同点是先把表面装饰剥掉再比对——学生最先改的变量名、缩进、注释，在 token 化阶段就消失了。共同上限也一样：都无法证明意图，也都对 LLM 现场生成的全新代码无能为力。

## AI 检测工具

### 国际

| 名称                            | 官网             | 原理声明                          | 厂商宣称            | 独立评测                                              |
| ----------------------------- | -------------- | ----------------------------- | --------------- | ------------------------------------------------- |
| Turnitin AI writing detection | 随 Turnitin     | 未公开细节                         | 发布时称文档级假阳性低于 1% | 后来自认句子级假阳性约 4%，多所高校停用                             |
| GPTZero                       | gptzero.me     | 早期用困惑度 + 突发性，2023 秋起改为深度学习分类器 | 99% 准确          | Booth 研究：假阳性低于 1%，假阴性约 0–2%                       |
| Pangram Labs                  | pangram.com    | 神经网络分类器，明确宣称不用 perplexity 类指标 | 99.98% 准确       | 目前独立证据最强：Booth 研究中假阳性多数阈值下基本为 0，假阴性 2–4%          |
| Originality.ai                | originality.ai | 分类器                           | 多语种模型 97.8%     | Booth 研究：假阳性低于 1%，但假阴性高达 10–40%                   |
| Copyleaks AI Detector         | copyleaks.com  | 分类器，多语种                       | 约 99%           | 没有可靠的独立评测，只有自报数据                                  |
| Winston AI                    | gowinston.ai   | 分类器                           | 99.98%          | 同上，网上流传的实测值追不到可靠出处                                |
| Sapling                       | sapling.ai     | 分类器                           | —               | Weber-Wulff 2023 中表现相对靠前                          |
| ZeroGPT                       | zerogpt.com    | 未公开                           | —               | 多项学术评测中表现差、假阳性突出，别用它做任何有后果的判断                     |
| QuillBot AI Detector          | quillbot.com   | 分类器                           | —               | 与改写器同一家公司，立场特殊                                    |
| ~~OpenAI AI Text Classifier~~ | 已下线            | 分类器                           | —               | 自报仅能识别 26% 的 AI 文本、把 9% 人类文本误判，2023-07-20 下线，无替代品 |

### 中文场景

| 名称          | 入口                       | 关键点                       | 价格         |
| ----------- | ------------------------ | ------------------------- | ---------- |
| 知网 AIGC 检测  | cx.cnki.net 或机构入口        | 基于知网文献大数据 + 预训练大模型        | 2 元/千字符    |
| 维普 AIGC 检测  | vpcs.fanyu.com           | 多所高校直接集成进论文系统             | 38 元/篇不限字数 |
| 万方 AIGC 检测  | check.wanfangdata.com.cn | 部分高校指定                    | 公开信息比知网维普少 |
| 格子达 AIGC 检测 | gocheck.cn               | 2026-04 升级，新增论文图片 AI 生成检测 | 2 元/千字符    |

知网 AIGC 服务自己的免责声明很有用，值得原样引用给客户或导师看：该服务是辅助工具，只提示可能由 AI 生成，结果自动生成、仅供参考，AIGC 值与论文质量无关，且因 AI 模型差异可能出错。

## AI 检测靠不靠得住

### 三条技术路线

**统计特征：困惑度加突发性。** perplexity 是拿语言模型去预测这段文字，预测得越容易、perplexity 越低、越「像模型写的」；burstiness 则是因为人类写作的句长、复杂度、可预测性起伏大，模型输出更均匀。

这条路线的缺陷直接写在定义里：任何用词平实、句式规整、可预测性高的人类写作都会得到低 perplexity——第二语言写作者、风格朴素的人、按模板写作的理工科学生，全部中枪。GPTZero 自 2023 年秋已经不再以此为主。

**微调分类器。** 拿海量「人写 vs 机器写」样本训练判别模型，目前商业产品主流走这条路。准确率明显高于 perplexity 法，但代价是黑箱、无法给出可验证证据、对新模型的泛化能力未知，而且对「人机混写」这种最常见的真实场景最不稳。

**水印。** Google DeepMind 的 SynthID-Text 是目前唯一大规模生产部署的文本水印，论文发在 Nature（2024-10），已在 Gemini 上线，代码开源。但对学术场景基本无用：只覆盖 Google 自家模型；苏黎世联邦理工的探测研究称在 Gemini API 上找不到可靠水印证据；改写、翻译、复制粘贴之后信号会衰减。

### 独立评测

**Weber-Wulff 等（2023）**，*International Journal for Educational Integrity* 19:26。测试 14 个检测工具，结论的原文口径是「可用的检测工具既不准确也不可靠」，而且系统性偏向把内容判为「人写」；机器翻译和内容混淆会显著削弱检测能力。这是被引最多、各校政策文件最常引用的一篇。

**Perkins 等（2024）**，arXiv:2403.19148。7 个检测器共 805 次检测，未经改动时准确率仅 39.5%，经对抗性改动后掉到 17.4%。注意这是 2023 年秋的模型与工具水平——今天的检测器已经明显进步（见下一条），拿这个数字说「AI 检测全是瞎猜」并不成立。

**Jabarian & Imas（2025-09）**，Chicago Booth / NBER w34223。这是目前对「新一代检测器到底行不行」最硬的独立证据：假阳性方面，Pangram 在多数阈值下基本为 0，GPTZero 和 Originality.ai 低于 1%；假阴性方面，GPTZero 约 0 到 2%，Pangram 约 2 到 4%，而 Originality.ai 高达 10 到 40%。所有商业工具在不足 50 词的短文本上准确率都会下降。

结论比 2023 年那批研究乐观得多，但同时说明工具之间差距巨大，不能一概而论。

### 对非英语母语者的系统性偏见

这是最重要的一项，接英文论文辅导的人必须提前向客户交代。

Liang 等（2023）发在 *Patterns* 4(7):100779 的研究，测了 7 个商业 GPT 检测器，用两个对照的人写语料：美国八年级学生作文和非母语者的 TOEFL 作文。

结果是美国八年级作文正确识别为人写超过 90%，而 TOEFL 作文超过一半被误判为 AI 生成，其中一个检测器把近 98% 的 TOEFL 作文判成了 AI。

机制解释得通：非母语写作用词和句式更可预测，perplexity 更低，恰好落在检测器判「AI」的那一侧。

论文里还有个讽刺的反证——把 TOEFL 作文交给 AI「用更复杂的词汇润色」，检测器反而判成人写。这说明检测器测的其实是文本复杂度，不是谁写的。

对神经多样性写作者（写作风格高度规整、句式重复）的误判机制同源，已被多所高校在政策文件中列为关切，但缺少大样本量化研究，别编数字。

### Turnitin 自己承认的假阳性

2023-04 发布时宣称文档级假阳性率低于 1%。

2023-06-01 Inside Higher Ed 报道，首席产品官承认句子级假阳性率约 4%，并且没有披露修订后的文档级假阳性率。

同时承认的还有两点：AI 检测分在 20% 以下时假阳性明显更高，所以在 0 到 20% 区间的分数旁加星号提示可靠性下降；以及被误判的人写句子中有 54% 紧挨着 AI 生成句子——也就是说人机混写是误判高发区，而这恰恰是真实学生写作最常见的形态。

### 高校停用与公开纠纷

Vanderbilt University 在 2023-08-16 正式关闭 Turnitin AI 检测，理由写得很完整：算法不透明；按 1% 假阳性率推算，其 2022 年 75,000 份提交会有约 750 份被误标；对非母语者有偏见；第三方检测器隐私政策不明。

同一份声明给教师的替代建议是：提前讲清 AI 使用边界、要求声明 AI 使用、重设作业形式（课堂写作、结合课程情境的题目、时事题）、对比学生既往写作、检查事实错误与伪造文献，以及直接和学生谈。

「50 多所大学已停用 Turnitin AI 检测」这类说法只见于 SEO 站，没有权威统计源。可以确证的是 Vanderbilt 这一例及其公开理由。

几个公开案例值得知道：

Texas A\&M University-Commerce，2023-05，教师把学生论文粘进 ChatGPT，问「这是不是你写的」，ChatGPT 回答「是」，据此给全班判不及格。这是彻底的方法错误——ChatGPT 不是检测器，它对这类问题的回答毫无证据价值。多名学生用 Google Docs 时间戳与版本历史自证，至少一人获得道歉。

UC Davis，2022 到 2023 年，两名学生分别被 AI 检测结果指控，后来均获澄清，自证材料同样是写作过程记录。

University of Minnesota 的 Haishan Yang 案，博士生远程参加 8 小时资格考被指控用 AI，被开除、学生签证被撤销。2025-10-31 联邦法院驳回其民权诉讼，认定校方给予了充分的程序性正当程序保护；法院认可的校方证据是「作答与 ChatGPT 输出近乎相同的措辞与例子」。

Yang 案的启示最重要：法院真正看重的是程序（有没有明确的指控通知、能不能申辩、能不能申诉）和多重实证证据（逐句雷同比对），而不是检测器给了多少分。

反过来说也成立——单靠一个百分比很难在正式程序里站住，但「检测分 + 逐句雷同比对 + 听证程序」的组合是站得住的。

### 中文系统之间对不齐

澎湃新闻 2025-04-04 做过一次调查：把同一篇完全由 AI 生成的论文投给四个高校常用的 AIGC 检测系统，AI 占比结果最大相差 32 个百分点。

另有学生案例：同一篇论文 PaperYY 报 50%、PaperPass 报 30%、知网报 25%，而且学生反映被标红的「疑似 AI 文字」实际是自己写的。

这是向中国客户解释 AIGC 率最有力的一条事实：这个数字不具备跨系统可比性，只有学校指定的那个系统的那一次结果才算数。

## 教授那边实际怎么用

### 教师看到的是什么

Turnitin 通过 LTI 集成到 Canvas、Blackboard、Moodle、D2L。Canvas 里教师在 SpeedGrader 直接看到一个百分比，点开进完整的 Similarity Report。

报告里有总相似度百分比和颜色带、按来源排序的匹配清单（每条来源贡献几个百分点）、原文左右对照高亮、排除引文与参考文献的开关。教师能看到每一处匹配的具体来源和原文——这是可复核的硬证据。

AI writing indicator 作为报告的一部分呈现，给出「模型预测由 AI 生成的文字占全文的百分比」。几个细节值得知道：只有教师能看到，学生看不到；0 到 20% 区间带星号提示可靠性下降；需要 300 到 30000 词的合格正文才出报告；官方明确写明该指标不是学术不端的证明，不能替代教师判断。

最关键的一点：AI 检测报告里没有「来源」可点。这正是它跟相似度报告的根本区别。

### 判断链条

分数只是线索。真实的判断通常是这样走的：

先看写作风格有没有突变——跟该生平时作业、课堂随笔、讨论区发言的用词水平、句式、错误模式对不对得上。这是教师最常提到的第一信号。

再看跟课堂表现是否相符——论文里的观点、术语、方法，学生在课堂上答不答得上来。

然后看内容硬伤——事实错误、伪造的参考文献、DOI 打不开、引用了不存在的论文。伪造文献是目前最可靠的 AI 痕迹，因为它可以被独立核实，不是概率判断而是可指认的错误。

再往下是提交元数据（Word 文档属性里的作者字段、总编辑时长、创建修改时间，一篇论文显示总编辑 12 分钟很难解释）、版本历史（Google Docs 和 Word 的编辑轨迹可回放），以及口头抽查——让学生当面讲方法论、解释某段为什么这么写。viva 这个手段在 2025 到 2026 年被很多学校重新普及，因为它绕开了检测器的可靠性问题。

有个趋势值得注意：2023 年行业重心在「检测成品」，2025 到 2026 年转向了「记录过程」。Turnitin Clarity 和 Grammarly Authorship 都在做同一件事——记录并回放写作过程，把文本分类为手打、粘贴、AI 生成、AI 修改。

对辅导者和学生来说，这个转向的含义是：过程证据的重要性正在超过成品分数。

### 各校政策的三档

| 档位     | 典型规定                     | 例子                                                                                                                                                           |
| ------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 完全禁止   | 核心环节一律不得用 AI             | 复旦大学《关于在本科毕业论文中使用 AI 工具的规定（试行）》（2024-11）的「六个禁止」：禁止用 AI 做研究方案设计、算法模型框架搭建、论文结构设计、选题、数据分析、结果讨论、结论总结；禁止生成或改动原始数据、原创性图片；禁止直接生成正文致谢；禁止用 AI 做语言润色和翻译；涉密内容禁用任何 AI 工具 |
| 允许但要声明 | 可用于辅助，但必须披露用了什么、用在哪、如何核验 | 多数欧美高校 2025 到 2026 年的默认做法                                                                                                                                    |
| 课程自定   | 校级只给框架，具体由每门课的教学大纲写明     | 美国高校主流，同一所学校不同课程规则可能完全相反                                                                                                                                     |

国内高校的量化阈值（都是该校当届规定，每年会改）：

| 学校            | 规定                                                       |
| ------------- | -------------------------------------------------------- |
| 中国民航大学        | 硕士论文重复率单章 25% 以内、全文 20% 以内；AIGC 超过 30% 需警示修改复检           |
| 南京晓庄学院        | 本科论文疑似 AIGC 占比需低于 30%，给学生 2 次免费检测                        |
| 上海海事大学        | 2025 届本科用 AI 智评加 AIGC 检测加格式检查三合一，结果分 A/B/C/D 四级，首次免费再检自费 |
| 华东师范大学、北京师范大学 | AI 生成内容不超过全文 20%                                         |
| 天津科技大学        | AIGC 检测超过 40% 收到警示                                       |
| 四川省社会科学院      | 一般超过 10% 即被认为较高                                          |

这里有个结论必须说清楚：**不存在全国统一的 AIGC 率红线**。20%、30%、40% 都有学校在用，同一所学校本科和硕士也可能不同，而且每年都在改。

任何「AIGC 率低于 X% 就安全」的说法都是错的。唯一有效的口径是你学校今年的那份通知，加上你学校指定的那个系统。

法规层面，《学位法》2024-04-26 通过、2025-01-01 起施行，规定学位论文被认定存在代写、剽窃、伪造等学术不端的，经学位评定委员会决议，不授予学位或撤销学位。AI 代写在实践中被各校归入「代写」范畴处理。

## 正当自查怎么做

### 相似度

优先用学校给的免费额度——这是唯一与终检口径一致的检测，研究生通常有知网免费次数（2022 年后人均 3 次）。

用不入库的通道。Turnitin 体系里用 Draft Coach，不产生教师可见记录、不入学生库。

初稿摸底和终检分开。便宜平台只用来定位哪几段重了，不用来定生死。

不要把完整稿件传给来路不明的站点，宁可分段查、宁可少查一次。

最后，看报告不看分数。重点是匹配落在哪里——该加引号的加引号、该规范引注的规范引注，比追一个数字有意义得多。

### AIGC 率

先确认学校用哪个系统、今年的阈值是多少，跨系统的数字没有参考价值。然后用学校系统给的免费次数（多数学校给 1 到 2 次）。

如果检测结果高，先自查是不是真的过度依赖了生成工具；如果确实是自己写的却被标红，见 [被指控之后怎么办](/campus/life-experience/xianyu-misconduct-appeal)。

### 保留写作过程证据

这是被指控时最有力的辩护。AI 检测器给出的是概率，没有可指认的来源；而写作过程证据是可复核的事实。

Texas A\&M 那批学生靠 Google Docs 时间戳自证，UC Davis 的学生同样如此。反过来看 Yang 案，他败诉的关键不是检测分，而是他拿不出反证、校方却拿出了逐句雷同的比对。证据的对抗是事实对事实，不是概率对概率。

| 证据类型   | 具体做法                                                       | 强度                    |
| ------ | ---------------------------------------------------------- | --------------------- |
| 版本历史   | 全程在 Google Docs 或 OneDrive/Word Online 里写，不要写完再粘贴进去        | 最强，可回放且时间戳不可伪造        |
| 写作过程工具 | 学校有 Turnitin Clarity 就用；个人可用 Grammarly Authorship          | 强，但依赖第三方服务            |
| 大纲与笔记  | 手写笔记拍照、思维导图、逐次修改的大纲，都带日期                                   | 强，能证明思路是自己的           |
| 文献管理记录 | Zotero / EndNote / NoteExpress 的条目添加时间、标注、笔记，每条参考文献都要能打开原文 | 强，能直接反驳「伪造文献」这条最致命的指控 |
| 与导师往来  | 邮件、聊天记录、批注版本                                               | 强，且有第三方佐证             |
| 中间稿归档  | 每个里程碑另存带日期的文件，别覆盖                                          | 中等，本地时间戳可被修改          |
| 数据与代码  | 原始数据、分析脚本、运行日志、Git 提交历史                                    | 理工科最强，Git 时间线尤其有力     |

最省事的一条建议：从第一个字就在云端文档里写。这一个习惯几乎覆盖上面所有需求，成本为零。

反过来，不要在本地写完再粘贴上去——粘贴会在版本历史里留下「一次性出现 8000 字」的记录，那正是最难解释的形态。

## 给做学术辅导的三条底线

**只承诺自己能控制的事。** 可以承诺「用学校指定系统查一次并给出报告解读」，不能承诺「保证重复率低于 X%」或「保证 AIGC 率低于 Y%」——跨系统结果不可比是有据可查的客观事实，这个你承诺不了。

**报价与口径写清楚。** 用的是哪个系统、是不是终检口径、是否入库、免费次数从哪来。这几件事说不清，后面必然吵架。

**客户的稿件是客户的资产。** 不上传到不明站点、不留存、不复用。前面说的稿件泄露与倒卖不是假想风险，是 2026 年仍在被媒体报道的现实。

## 参考来源

工具官网：

* Turnitin — [https://www.turnitin.com/](https://www.turnitin.com/) ；Draft Coach — [https://www.turnitin.com/products/features/draft-coach/](https://www.turnitin.com/products/features/draft-coach/) ；Clarity — [https://www.turnitin.com/products/feedback-studio/clarity](https://www.turnitin.com/products/feedback-studio/clarity)
* Turnitin 相似度分数说明 — [https://guides.turnitin.com/hc/en-us/articles/23435833938701-Understanding-the-similarity-score](https://guides.turnitin.com/hc/en-us/articles/23435833938701-Understanding-the-similarity-score)
* Turnitin AI writing detection model — [https://guides.turnitin.com/hc/en-us/articles/28294949544717-AI-writing-detection-model](https://guides.turnitin.com/hc/en-us/articles/28294949544717-AI-writing-detection-model)
* iThenticate — [https://www.ithenticate.com/](https://www.ithenticate.com/)
* 知网个人查重官方入口 — [https://cx.cnki.net](https://cx.cnki.net)
* 万方 — [https://check.wanfangdata.com.cn/](https://check.wanfangdata.com.cn/) ；维普 — [https://vpcs.fanyu.com/](https://vpcs.fanyu.com/) ；格子达 — [https://www.gocheck.cn/](https://www.gocheck.cn/)
* GPTZero — [https://gptzero.me/](https://gptzero.me/) ；Pangram — [https://www.pangram.com/](https://www.pangram.com/) ；Originality.ai — [https://originality.ai/](https://originality.ai/) ；Copyleaks — [https://copyleaks.com/ai-content-detector](https://copyleaks.com/ai-content-detector)
* MOSS — [https://theory.stanford.edu/\~aiken/moss/](https://theory.stanford.edu/~aiken/moss/) ；JPlag — [https://github.com/jplag/JPlag](https://github.com/jplag/JPlag)
* Grammarly Authorship — [https://www.grammarly.com/authorship](https://www.grammarly.com/authorship)

学术研究与独立评测：

* Liang W. et al., "GPT detectors are biased against non-native English writers", *Patterns* 4(7):100779, 2023-07-10 — [https://www.cell.com/patterns/fulltext/S2666-3899(23)00130-7](https://www.cell.com/patterns/fulltext/S2666-3899\(23\)00130-7)
* Weber-Wulff D. et al., "Testing of detection tools for AI-generated text", *IJEI* 19:26, 2023 — [https://eprints.whiterose.ac.uk/id/eprint/207396/1/s40979-023-00146-z.pdf](https://eprints.whiterose.ac.uk/id/eprint/207396/1/s40979-023-00146-z.pdf)
* Perkins M. et al., arXiv:2403.19148（2024-03）— [https://arxiv.org/abs/2403.19148](https://arxiv.org/abs/2403.19148)
* Jabarian B. & Imas A., "Artificial Writing and Automated Detection", NBER w34223（2025-09）— [https://www.nber.org/papers/w34223](https://www.nber.org/papers/w34223)
* Dathathri S. et al., SynthID-Text, *Nature*（2024-10）— [https://www.nature.com/articles/s41586-024-08025-4](https://www.nature.com/articles/s41586-024-08025-4)

高校政策与案例：

* Vanderbilt 关闭 Turnitin AI 检测的说明（2023-08-16）— [https://www.vanderbilt.edu/brightspace/2023/08/16/guidance-on-ai-detection-and-why-were-disabling-turnitins-ai-detector/](https://www.vanderbilt.edu/brightspace/2023/08/16/guidance-on-ai-detection-and-why-were-disabling-turnitins-ai-detector/)
* Inside Higher Ed：Turnitin 承认假阳性高于预期（2023-06-01）— [https://www.insidehighered.com/news/quick-takes/2023/06/01/turnitins-ai-detector-higher-expected-false-positives](https://www.insidehighered.com/news/quick-takes/2023/06/01/turnitins-ai-detector-higher-expected-false-positives)
* Washington Post：Texas A\&M 教授误判全班（2023-05-18）— [https://www.washingtonpost.com/technology/2023/05/18/texas-professor-threatened-fail-class-chatgpt-cheating/](https://www.washingtonpost.com/technology/2023/05/18/texas-professor-threatened-fail-class-chatgpt-cheating/)
* LCW 法律简报：Haishan Yang v. Neprash 联邦法院驳回（2025-10-31）— [https://www.lcwlegal.com/news/federal-court-upholds-universitys-disciplinary-process-in-ai-misconduct-case/](https://www.lcwlegal.com/news/federal-court-upholds-universitys-disciplinary-process-in-ai-misconduct-case/)
* 澎湃新闻：毕业论文双重查重，AIGC 率让毕业生痛苦（2025-04-04）— [https://m.thepaper.cn/newsDetail\_forward\_30573507](https://m.thepaper.cn/newsDetail_forward_30573507)
* 复旦大学关于本科毕业论文使用 AI 工具的规定（试行）— [http://edu.people.com.cn/n1/2024/1201/c1006-40372717.html](http://edu.people.com.cn/n1/2024/1201/c1006-40372717.html)
* 中国民航大学 2025 届硕士学位论文检测通知（2024-12-16）— [https://grad.cidp.edu.cn/info/1109/5511.htm](https://grad.cidp.edu.cn/info/1109/5511.htm)
* 南京晓庄学院 2025 届本科毕业论文 AI 工具通知（2025-03-27）— [https://jwc.njxzc.edu.cn/05/79/c9179a132473/pagem.htm](https://jwc.njxzc.edu.cn/05/79/c9179a132473/pagem.htm)
* 紫牛调查：二手平台低价论文查重陷阱（2026-03-25）— [https://wz.jschina.com.cn/jrgc/202603/t20260325\_s69c347cde4b045d3a5e79fed.shtml](https://wz.jschina.com.cn/jrgc/202603/t20260325_s69c347cde4b045d3a5e79fed.shtml)
