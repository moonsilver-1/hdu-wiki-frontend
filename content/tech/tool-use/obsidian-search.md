---
title: "搜索技巧"
date: "2026-09-20"
author: "洛洛"
excerpt: "Cmd/Ctrl + O — 按文件名模糊搜索，最快的找笔记方式。"
tags: ["luoluo", "迁移"]
---

## 快速打开

`Cmd/Ctrl + O` — 按文件名模糊搜索，最快的找笔记方式。

## 全局搜索

`Cmd/Ctrl + Shift + F` — 全文搜索，支持高级语法。

### 搜索语法

| 语法   | 示例                         | 说明          |
| ---- | -------------------------- | ----------- |
| 关键词  | `费曼`                       | 搜索包含"费曼"的笔记 |
| 精确匹配 | `"费曼学习法"`                  | 精确搜索整个短语    |
| 标签搜索 | `tag:#认知科学`                | 搜索带特定标签的笔记  |
| 路径筛选 | `path:Projects`            | 只搜索指定文件夹    |
| 文件名  | `file:日记`                  | 搜索文件名包含的笔记  |
| 排除   | `-tag:#archive`            | 排除归档笔记      |
| 或    | `费曼 OR 学习`                 | 包含任一关键词     |
| 组合   | `tag:#读书笔记 path:Resources` | 多条件组合       |

### 属性搜索

```
[status:draft]      — 搜索状态为 draft 的笔记
[rating:5]          — 搜索评分为 5 的笔记
[created:2026-04]   — 搜索 4 月创建的笔记
```

### 正则搜索

```
/\d{4}-\d{2}-\d{2}/  — 搜索日期格式的文本
```

## 搜索结果操作

* 点击结果跳转到对应笔记和位置
* 复制搜索结果列表
* 按修改时间/创建时间/文件名排序

## 搜索习惯建议

1. **先 Quick Open 再全局搜索** — 知道笔记名就用 `Cmd+O`，不知道再用全局搜索
2. **善用标签筛选** — `tag:#永久笔记 关键词` 缩小范围
3. **用 Dataview 替代复杂搜索** — 需要结构化查询时用 [Dataview](/tech/tool-use/obsidian-dataview)

## 参考来源

* 搜索核心插件：[https://obsidian.md/help/plugins/search](https://obsidian.md/help/plugins/search) （查阅日期 2026-09-14）
* 快速切换：[https://obsidian.md/help/plugins/quick-switcher](https://obsidian.md/help/plugins/quick-switcher) （查阅日期 2026-09-14）
