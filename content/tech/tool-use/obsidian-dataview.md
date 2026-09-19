---
title: "Dataview 数据查询"
date: "2026-09-20"
author: "洛洛"
excerpt: "社区插件搜索 ”Dataview” → 安装 → 启用。"
tags: ["luoluo", "迁移"]
---

**Dataview** 是 Obsidian 最强大的插件之一，让你用类似 SQL 的语法查询笔记，生成动态列表和表格。

## 安装

社区插件搜索 "Dataview" → 安装 → 启用。

> 截至 2026-09-14，Dataview 最近一次发布是 0.5.70（2025-04-07），之后仓库没有新提交；Obsidian 1.9 起内置的 Bases 核心插件可以替代一部分表格查询，以官方为准。

## 四种查询类型

### LIST — 列表

````markdown
```dataview
LIST
FROM #读书笔记
WHERE status = "done"
SORT rating DESC
```
````

### TABLE — 表格

````markdown
```dataview
TABLE author, rating, created
FROM #读书笔记
SORT created DESC
```
````

### TASK — 任务

````markdown
```dataview
TASK
FROM #项目
WHERE !completed
```
````

### CALENDAR — 日历

````markdown
```dataview
CALENDAR created
FROM "日记"
```
````

## DQL 查询语法

完整结构：

```
[查询类型] [字段]
FROM [来源]
WHERE [条件]
SORT [排序]
GROUP BY [分组]
FLATTEN [展开]
LIMIT [限制数量]
```

除 `FROM` 外，其余数据命令可以重复使用、顺序任意；`FROM` 最多一个，且必须紧跟查询类型。

### FROM 来源

```sql
FROM #标签              -- 按标签
FROM "文件夹路径"       -- 按文件夹
FROM [[某条笔记]]       -- 链接到某条笔记的所有笔记
FROM outgoing([[笔记]]) -- 某条笔记链接出去的笔记
```

### WHERE 条件

```sql
WHERE status = "done"
WHERE rating >= 4
WHERE created >= date("2026-04-01")
WHERE contains(tags, "认知科学")
WHERE file.name = "日记"
WHERE !completed          -- 未完成的任务
```

### SORT 排序

```sql
SORT created DESC         -- 按创建日期降序
SORT rating ASC           -- 按评分升序
SORT file.name            -- 按文件名
```

### GROUP BY 分组

````markdown
```dataview
TABLE rows.file.link
FROM #读书笔记
GROUP BY author
```
````

## 隐式字段

每条笔记自动拥有的字段：

| 字段              | 说明         |
| --------------- | ---------- |
| `file.name`     | 文件名（不含扩展名） |
| `file.path`     | 完整路径       |
| `file.folder`   | 所在文件夹      |
| `file.size`     | 文件大小       |
| `file.ctime`    | 创建时间       |
| `file.mtime`    | 修改时间       |
| `file.tags`     | 所有标签       |
| `file.inlinks`  | 链入的笔记      |
| `file.outlinks` | 链出的笔记      |
| `file.link`     | 可点击的链接     |

## 内联查询

在正文中嵌入单个值：

```markdown
今天是 `= date(today)`

这个 Vault 有 `= length(filter(file.tasks, (t) => !t.completed))` 个未完成任务。

这条笔记创建于 `= this.created`
```

## 实战示例

### 最近修改的笔记

````markdown
```dataview
TABLE file.mtime as "修改时间"
SORT file.mtime DESC
LIMIT 10
```
````

### 项目看板

````markdown
```dataview
TABLE status, due
FROM #项目
WHERE status != "archive"
SORT due ASC
```
````

### 孤立笔记

````markdown
```dataview
LIST
WHERE length(file.inlinks) = 0
  AND length(file.outlinks) = 0
  AND !contains(file.path, "Templates")
```
````

### 每日任务汇总

````markdown
```dataview
TASK
WHERE !completed
  AND due <= date(today)
SORT due ASC
```
````

## 参考来源

* Dataview 查询结构：[https://blacksmithgu.github.io/obsidian-dataview/queries/structure/](https://blacksmithgu.github.io/obsidian-dataview/queries/structure/) （查阅日期 2026-09-14）
* Dataview 隐式字段：[https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/](https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/) （查阅日期 2026-09-14）
* Dataview 发布记录：[https://github.com/blacksmithgu/obsidian-dataview/releases](https://github.com/blacksmithgu/obsidian-dataview/releases) （查阅日期 2026-09-14）
* Obsidian Bases：[https://obsidian.md/help/bases](https://obsidian.md/help/bases) （查阅日期 2026-09-14）
