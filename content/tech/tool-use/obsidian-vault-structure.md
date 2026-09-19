---
title: "Vault 目录结构设计"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "├── 1-Projects/      → 有截止日期的项目"
tags: ["洛洛", "转载"]
---

## 常见结构方案

### 方案一：PARA 结构

```
Vault/
├── 1-Projects/      → 有截止日期的项目
├── 2-Areas/         → 持续关注的领域
├── 3-Resources/     → 感兴趣的主题
├── 4-Archive/       → 已完成/不活跃
├── Inbox/           → 未处理的笔记
├── Templates/       → 模板
└── Attachments/     → 图片等附件
```

### 方案二：Zettelkasten 结构

```
Vault/
├── Fleeting/        → 闪念笔记
├── Literature/      → 文献笔记
├── Permanent/       → 永久笔记
├── MOCs/            → 内容地图
├── Daily/           → 日记
├── Templates/       → 模板
└── Attachments/     → 附件
```

### 方案三：混合结构（推荐）

```
Vault/
├── 00-Inbox/        → 未处理的一切
├── 01-Daily/        → 日记和周回顾
├── 10-Projects/     → 活跃项目
├── 20-Areas/        → 持续领域
├── 30-Cards/        → 原子知识卡片（永久笔记）
├── 40-Resources/    → 参考资料、文献笔记
├── 50-MOCs/         → 内容地图
├── 90-Archive/      → 归档
├── Templates/       → 模板
└── Attachments/     → 附件
```

数字前缀保证文件夹排序一致。

## 设计原则

1. **少文件夹多链接** — 文件夹不超过 10 个
2. **不纠结分类** — 不确定放哪就放 Inbox
3. **附件统一管理** — 设置 → 文件与链接 → 附件存放位置 → 指定文件夹
4. **模板独立** — Templates 文件夹不要和笔记混在一起
5. **渐进式演化** — 从最简单的开始，有需要再加

## 文件命名规范

| 策略    | 示例                   | 适用    |
| ----- | -------------------- | ----- |
| 断言式标题 | `教别人是最有效的学习方式.md`    | 永久笔记  |
| 日期前缀  | `2026-04-03 会议纪要.md` | 日记/会议 |
| 主题前缀  | `Python - 列表推导式.md`  | 学习笔记  |
| 无前缀   | `费曼学习法.md`           | 概念类笔记 |

**建议永久笔记用断言式标题**，其他笔记按习惯来。

## 参考来源

* Obsidian 官方帮助：[https://obsidian.md/help/](https://obsidian.md/help/) （查阅日期 2026-09-14）
* Tiago Forte《The PARA Method》，2023-02-24：[https://fortelabs.com/blog/para/](https://fortelabs.com/blog/para/) （查阅日期 2026-09-14）
