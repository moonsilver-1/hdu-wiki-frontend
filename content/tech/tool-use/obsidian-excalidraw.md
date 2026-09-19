---
title: "Excalidraw 手绘"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "社区插件搜索 ”Excalidraw” → 安装 → 启用。"
tags: ["洛洛", "转载"]
---

**Excalidraw** 插件让你在 Obsidian 中创建手绘风格的图表和白板，并与笔记双向链接。

## 安装

社区插件搜索 "Excalidraw" → 安装 → 启用。

## 创建绘图

* 命令面板 → "Excalidraw: Create new drawing"
* 或在文件列表右键 → 新建 Excalidraw 绘图

## 核心功能

### 绘图工具

* 矩形、圆形、菱形
* 箭头和连线
* 手写文字
* 自由画笔
* 图标库

### 嵌入笔记

在 Excalidraw 画布中嵌入 Obsidian 笔记：

1. 拖拽文件列表中的笔记到画布
2. 或使用 `[[链接]]` 语法

笔记内容实时渲染在画布上，点击可跳转。

### 在笔记中嵌入绘图

```markdown
![[my-drawing.excalidraw]]
```

绘图会以图片形式嵌入到笔记中。

## 使用场景

| 场景   | 说明             |
| ---- | -------------- |
| 概念图  | 可视化概念之间的关系     |
| 架构图  | 软件系统架构         |
| 流程图  | 工作流程可视化        |
| 笔记导图 | 把笔记链接可视化       |
| 手写注释 | 给截图/PDF 添加手写标注 |
| 演示   | 简单的可视化演示       |

## 和 Canvas 的区别

| 维度   | Excalidraw | Canvas    |
| ---- | ---------- | --------- |
| 风格   | 手绘风格       | 结构化卡片     |
| 自由度  | 完全自由       | 卡片+连线     |
| 绘图能力 | 丰富（形状、画笔）  | 基础（卡片、分组） |
| 笔记集成 | 嵌入+链接      | 嵌入笔记卡片    |
| 适合   | 图表、草图、创意   | 知识组织、项目规划 |

## 技巧

1. **用图标库** — 内置大量图标，搜索关键词即可使用
2. **锁定元素** — 画好的元素可以锁定防止误移
3. **分组** — 选中多个元素 → `Cmd/Ctrl + G` 分组
4. **导出** — 支持导出为 PNG、SVG
5. **暗色模式** — 在设置中切换背景色

## 参考来源

* Excalidraw 插件仓库：[https://github.com/zsviczian/obsidian-excalidraw-plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin) （查阅日期 2026-09-14）
* 嵌入文件：[https://obsidian.md/help/embeds](https://obsidian.md/help/embeds) （查阅日期 2026-09-14）
