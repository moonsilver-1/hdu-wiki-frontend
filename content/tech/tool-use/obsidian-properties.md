---
title: "Properties 元数据"
date: "2026-09-20"
author: "洛洛"
excerpt: "author: Daniel Kahneman"
tags: ["luoluo", "迁移"]
---

**Properties**（原 Frontmatter）是笔记开头的 YAML 元数据块，给笔记添加标签、日期、状态等结构化信息。

## 基本语法

```markdown
---
tags:
  - 读书笔记
  - 认知科学
created: 2026-04-03
author: Daniel Kahneman
status: done
rating: 5
---

## 笔记正文从这里开始
```

## 内置属性

| 属性           | 说明             |
| ------------ | -------------- |
| `tags`       | 标签列表           |
| `aliases`    | 笔记别名（搜索和链接时可用） |
| `cssclasses` | 自定义 CSS 类名     |

### aliases 示例

```yaml
---
aliases:
  - PKM
  - 个人知识管理
---

## Personal Knowledge Management
```

搜索「PKM」或「个人知识管理」都能找到这条笔记，链接时也能用别名。

## 常用自定义属性

```yaml
---
tags: [永久笔记]
created: 2026-04-03
modified: 2026-04-03
source: "《思考，快与慢》"
author: Daniel Kahneman
status: draft       # draft / in-progress / done
type: literature    # fleeting / literature / permanent
rating: 4           # 1-5
summarized: L2      # L1-L5（渐进式总结层级）
project: "v2.0发布"
---
```

## 可视化编辑

Obsidian 提供 Properties 的可视化编辑界面：

1. 点击笔记顶部的 Properties 区域
2. 直接编辑字段值
3. 支持日期选择器、标签自动补全

## 配合 Dataview 查询

Properties 的真正威力在于配合 [Dataview](/tech/tool-use/obsidian-dataview) 做结构化查询：

````markdown
## 未完成的读书笔记

```dataview
TABLE author, rating, status
FROM #读书笔记
WHERE status != "done"
SORT rating DESC
```
````

````markdown
## 本月创建的笔记

```dataview
LIST
WHERE created >= date("2026-04-01")
SORT created DESC
```
````

## Properties 规范建议

1. **统一格式** — 日期统一用 `YYYY-MM-DD`，状态统一用英文
2. **不要太多** — 3-5 个核心属性足够，太多反而是负担
3. **用模板保证一致** — 配合 [Templater](/tech/tool-use/obsidian-templater) 自动填充
4. **定义属性类型** — 在设置中预定义属性类型，避免拼写不一致

## 参考来源

* Properties：[https://obsidian.md/help/properties](https://obsidian.md/help/properties) （查阅日期 2026-09-14）
* Dataview 隐式字段：[https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/](https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/) （查阅日期 2026-09-14）
