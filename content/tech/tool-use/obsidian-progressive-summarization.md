---
title: "渐进式总结"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "原封不动地保存原始内容。可以是文章摘录、会议记录、读书笔记。"
tags: ["洛洛", "转载"]
---

**渐进式总结（Progressive Summarization）** 是 Tiago Forte 提出的笔记提炼方法。核心思想：不要一次性把笔记整理完美，而是**每次使用时逐步提炼**。

## 五个层次

### Layer 1：原始笔记

原封不动地保存原始内容。可以是文章摘录、会议记录、读书笔记。

```markdown
这是你一开始写下或收集的原始内容。
可能很长，可能很杂，没关系。
先捕获再说。
```

### Layer 2：加粗关键句

重读笔记时，把**最有价值的句子加粗**。

```markdown
这是你一开始写下或收集的原始内容。
**可能很长，可能很杂，没关系。**
**先捕获再说。**
```

### Layer 3：高亮核心

在加粗的基础上，==高亮最最关键的部分==。

```markdown
这是你一开始写下或收集的原始内容。
**可能很长，可能很杂，没关系。**
**==先捕获再说。==**
```

### Layer 4：写自己的摘要

在笔记顶部，用自己的话写一段总结。

```markdown
> 💡 核心要点：笔记整理的首要原则是先捕获，不要追求完美。

这是你一开始写下或收集的原始内容...
```

### Layer 5：重混输出

用这张笔记的内容创造新的东西——文章、演讲、项目方案。

## 为什么"渐进"？

传统做法是读完一本书后花几小时整理笔记。问题：

* 整理完就再也不看了
* 花太多时间在"整理"而不是"使用"
* 不知道哪些内容将来有用

渐进式总结的逻辑：

1. **Layer 1** — 收集时完成（1 分钟）
2. **Layer 2** — 第一次重读时完成（2 分钟）
3. **Layer 3** — 第二次重读时完成（1 分钟）
4. **Layer 4** — 需要引用时完成（3 分钟）
5. **Layer 5** — 创作时完成

**大多数笔记永远不会到 Layer 5，这没关系。** 你只提炼真正用得上的笔记。

## 在 Obsidian 中实践

### 用格式区分层次

```markdown
---
tags: [读书笔记]
summarized: L3
---

> 💡 **摘要：** 先捕获再整理，不要追求完美的笔记系统。

原始笔记正文...

**这句话很重要。**

**==这句话是核心。==**

普通的原始内容...
```

### 用 Dataview 追踪总结进度

````markdown
## 待总结的笔记

```dataview
TABLE summarized as "当前层级"
FROM #读书笔记
WHERE summarized != "L4" AND summarized != "L5"
SORT summarized ASC
```
````

## 和 Zettelkasten 的关系

| 渐进式总结          | Zettelkasten   |
| -------------- | -------------- |
| 从原始内容**提炼**出核心 | 从阅读中**生成**新的想法 |
| 关注"减法"（删除冗余）   | 关注"加法"（建立连接）   |
| 适合整理已有材料       | 适合发展原创思考       |

**最佳实践：** 用渐进式总结处理输入（文献笔记），用 Zettelkasten 生成输出（永久笔记）。

## 参考来源

* Tiago Forte《Progressive Summarization》，2017-12-27：[https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/) （查阅日期 2026-09-14）
* Obsidian 格式语法：[https://obsidian.md/help/syntax](https://obsidian.md/help/syntax) （查阅日期 2026-09-14）
