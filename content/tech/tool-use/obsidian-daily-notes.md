---
title: "日记与周回顾"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "开启：设置 → 核心插件 → 日记 → 启用"
tags: ["洛洛", "转载"]
---

日记是知识管理的**入口**——大量想法从这里诞生，然后流向永久笔记和项目。

## 核心插件：日记

开启：设置 → 核心插件 → 日记 → 启用

### 配置

| 设置    | 推荐值          |
| ----- | ------------ |
| 日期格式  | `YYYY-MM-DD` |
| 新文件位置 | `日记/` 文件夹    |
| 模板    | 指向你的日记模板     |

### 快捷操作

* 点击左侧日历图标 → 创建/打开今日日记
* 安装 Calendar 插件 → 日历视图，点击日期创建

## 日记模板

配合 [Templater](/tech/tool-use/obsidian-templater) 使用：

```markdown
---
tags: [日记]
created: <% tp.date.now("YYYY-MM-DD") %>
---

## <% tp.date.now("YYYY年MM月DD日 dddd") %>

## 今日最重要的 3 件事
1. [ ] 
2. [ ] 
3. [ ] 

## 捕获
> 随手记下想法、灵感、发现

<% tp.file.cursor() %>

## 学到了什么

## 感恩
- 
```

## 日记的工作流

### 早上（2 分钟）

1. 打开今日日记
2. 写下今天最重要的 3 件事
3. 看一眼昨天的日记，有没有未完成的

### 白天（随时）

遇到值得记录的 → 写进日记的「捕获」区域：

* 一个新想法
* 读到的一句好话
* 工作中的发现
* 和同事讨论的结论

### 晚上（10 分钟）

1. 回顾今日捕获的内容
2. 值得发展的想法 → 创建新的永久笔记 + 链接
3. 填写"学到了什么"
4. 标记完成的任务

## 周回顾

每周日花 30 分钟做一次回顾。

### 周回顾模板

```markdown
---
tags: [周回顾]
week: <% tp.date.now("YYYY-[W]ww") %>
---

## 第 <% tp.date.now("ww") %> 周回顾（<% tp.date.weekday("MM/DD", 0) %> - <% tp.date.weekday("MM/DD", 6) %>）

## 本周成就
- 

## 本周创建的笔记
> 自动聚合

## 本周完成的任务

## 本周学到的最重要的 3 件事
1. 
2. 
3. 

## 下周聚焦
- 

## 需要调整的
- 
```

### 用 Dataview 自动聚合

在周回顾模板中嵌入 Dataview 查询，自动列出本周的笔记和任务：

````markdown
### 本周新建笔记

```dataview
LIST
WHERE file.ctime >= date("<% tp.date.weekday('YYYY-MM-DD', 0) %>")
  AND file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")
  AND !contains(file.path, "Templates")
SORT file.ctime ASC
```
````

## 月度回顾

每月底花 1 小时：

1. 浏览本月所有周回顾
2. 提炼月度主题和收获
3. 清理 Inbox，处理积压笔记
4. 更新 MOC，整理知识结构
5. 反思知识管理系统是否需要调整

## 节奏感

```
每天 → 日记（捕获 + 简单整理）
每周 → 周回顾（回顾 + 链接 + 规划）
每月 → 月度回顾（清理 + 结构优化）
每季 → 系统审视（方法论调整）
```

**坚持比完美重要。** 即使只写一句话的日记，也比不写好。

## 参考来源

* 日记核心插件：[https://obsidian.md/help/plugins/daily-notes](https://obsidian.md/help/plugins/daily-notes) （查阅日期 2026-09-14）
* Templater tp.date 模块：[https://silentvoid13.github.io/Templater/internal-functions/internal-modules/date-module.html](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/date-module.html) （查阅日期 2026-09-14）
* Dataview 隐式字段：[https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/](https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/) （查阅日期 2026-09-14）
