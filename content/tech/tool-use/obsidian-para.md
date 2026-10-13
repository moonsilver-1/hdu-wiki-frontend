---
title: "PARA 组织法"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "你需要持续维护的责任领域，没有截止日期。"
tags: ["洛洛", "转载"]
---

**PARA** 是 Tiago Forte 提出的数字信息组织方法，把所有信息分为四类：

* **P**rojects — 项目
* **A**reas — 领域
* **R**esources — 资源
* **A**rchives — 归档

## 四个分类

### Projects（项目）

有**明确目标**和**截止日期**的事情。

* 完成 v2.0 发布
* 写一篇博客文章
* 准备下周的演讲

### Areas（领域）

你需要**持续维护**的责任领域，没有截止日期。

* 健康
* 财务
* 职业发展
* 人际关系

### Resources（资源）

你感兴趣的**主题**，将来可能用到。

* 机器学习
* 设计灵感
* 投资理财
* 烹饪食谱

### Archives（归档）

以上三类中已经**完成或不再活跃**的内容。

## 在 Obsidian 中的目录结构

```
Vault/
├── 1-Projects/
│   ├── 2026-04 产品发布/
│   └── 2026-Q2 技术博客/
├── 2-Areas/
│   ├── 健康/
│   ├── 职业发展/
│   └── 财务/
├── 3-Resources/
│   ├── AI/
│   ├── 设计/
│   └── 编程/
├── 4-Archive/
│   └── 2025-已完成项目/
└── Templates/
```

## PARA 的关键洞察

### 按可执行性排序

```
Projects > Areas > Resources > Archive
         ↑                           ↑
     最可执行的                  最不可执行的
```

* **Projects** 是现在要做的事 → 每天看
* **Areas** 是持续关注的 → 每周看
* **Resources** 是感兴趣的 → 偶尔看
* **Archive** 是用完的 → 需要时搜索

### 笔记的流动

笔记会在四类之间**流动**：

```
Resource（学到一个新框架）
    → Project（用这个框架做项目）
        → Archive（项目完成）

Area（职业发展）
    → Project（考一个证书）
        → Archive（证书到手）
```

### PARA + Zettelkasten

| PARA     | Zettelkasten |
| -------- | ------------ |
| 组织**行动** | 组织**知识**     |
| 按项目/领域分类 | 按链接网络组织      |
| 关注"该做什么" | 关注"该想什么"     |

两者不冲突：

* 用 PARA 管理项目和待办
* 用 Zettelkasten 管理知识和想法
* Projects/Areas 用文件夹，知识笔记用双向链接

## 常见误区

1. **不要在分类上纠结** — 不确定放哪？先放 Resources
2. **不要创建空文件夹** — 有内容了再建文件夹
3. **定期清理** — 完成的项目移到 Archive，每月做一次
4. **PARA 不是唯一方案** — 如果你的笔记都是知识类的，纯 Zettelkasten 可能更合适

## 参考来源

* Tiago Forte《The PARA Method》，2023-02-24：[https://fortelabs.com/blog/para/](https://fortelabs.com/blog/para/) （查阅日期 2026-09-14）
