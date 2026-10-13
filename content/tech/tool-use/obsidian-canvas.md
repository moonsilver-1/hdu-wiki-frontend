---
title: "Canvas 白板"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "1. 右键文件列表 → New canvas"
tags: ["洛洛", "转载"]
---

**Canvas** 是 Obsidian 内置的无限画布功能，可以在一个可视化空间中自由摆放笔记、图片、文本和链接。

## 创建 Canvas

1. 右键文件列表 → New canvas
2. 或命令面板 → "Canvas: Create new canvas"

Canvas 文件以 `.canvas` 格式保存（JSON），和笔记一样存在 Vault 文件夹中。

## 五种元素

### 1. 笔记卡片

拖入已有的 `.md` 笔记，内容实时同步。双击进入编辑。

### 2. 文本卡片

直接在画布上写文字，不需要创建笔记文件。适合临时想法。

### 3. 图片

拖入图片文件或粘贴剪贴板图片。

### 4. 网页

输入 URL 嵌入网页内容。

### 5. 分组框

用矩形框把相关的元素分组，可设置标题和颜色。

## 核心操作

| 操作   | 方法            |
| ---- | ------------- |
| 添加卡片 | 双击空白处         |
| 连线   | 从卡片边缘拖出箭头     |
| 着色   | 右键卡片 → 选择颜色   |
| 缩放   | 滚轮 / 两指缩放     |
| 嵌入笔记 | 拖拽文件列表中的笔记到画布 |
| 自由移动 | 拖拽空白区域平移      |

## 使用场景

### 1. 头脑风暴

把所有想法快速写成文本卡片，然后拖拽分组、连线、排序。

### 2. 项目规划

把项目相关的笔记拖到画布上，用连线表示依赖关系，用分组框区分阶段。

### 3. 知识地图

类似 MOC 的可视化版本。把主题相关的笔记铺开，用连线和分组展示关系。

### 4. 写作大纲

写长文章前，把各个论点的笔记卡片拖到画布上，排列成文章的逻辑顺序。

### 5. 课程/演讲准备

把讲义中的各个章节用卡片表示，安排顺序，添加补充材料。

### 6. 对比分析

两列卡片对比不同方案的优缺点。

## 进阶技巧

### 连线标签

连线上可以添加文字标签，说明关系：

```
[概念A] --"导致"--> [概念B]
[方案X] --"优于"--> [方案Y]
```

### 嵌入 Canvas 到笔记

```markdown
![[my-canvas.canvas]]
```

### Advanced Canvas 插件

安装后可获得更多功能：

* 节点形状（圆形、菱形等）
* 边框样式
* 更多连线类型
* 演示模式（像 PPT 一样逐个展示）

## 参考来源

* Canvas 核心插件：[https://obsidian.md/help/plugins/canvas](https://obsidian.md/help/plugins/canvas) （查阅日期 2026-09-14）
* JSON Canvas 格式：[https://jsoncanvas.org/](https://jsoncanvas.org/) （查阅日期 2026-09-14）
* Advanced Canvas：[https://github.com/Developer-Mike/obsidian-advanced-canvas](https://github.com/Developer-Mike/obsidian-advanced-canvas) （查阅日期 2026-09-14）
