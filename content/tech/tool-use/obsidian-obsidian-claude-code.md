---
title: "Obsidian × Claude Code"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "在 Vault 目录下启动 Claude Code："
tags: ["洛洛", "转载"]
---

Obsidian Vault 本质上就是一个本地 Markdown 文件夹。而 Claude Code 天然具备读写本地文件的能力。**它们是天生的搭档。**

## 为什么 Claude Code + Obsidian？

| Claude Code 的能力 | 在 Obsidian 中的应用   |
| --------------- | ----------------- |
| 读取文件            | 搜索和阅读任何笔记         |
| 写入文件            | 创建新笔记、修改现有笔记      |
| 搜索代码            | 全文搜索 Vault，找到相关笔记 |
| 批量操作            | 同时处理数百条笔记         |
| 理解上下文           | 分析笔记之间的链接关系       |

## 快速开始

在 Vault 目录下启动 Claude Code：

```bash
cd /path/to/your/obsidian-vault
claude
```

然后直接用自然语言操作：

```
帮我创建一条关于"费曼学习法"的永久笔记，链接到已有的学习方法相关笔记
```

Claude 会自动：

1. 搜索 Vault 中已有的学习方法笔记
2. 按你的笔记风格创建新笔记
3. 添加 frontmatter 和双向链接
4. Obsidian 自动检测到文件变化并刷新

## 实用场景

### 1. 批量创建笔记

```
读一下 reading-list.md，为里面提到的每本书创建一个读书笔记模板，
放在 Literature/ 文件夹下，使用统一的 frontmatter 格式
```

### 2. 孤立笔记检测

```
扫描整个 Vault，找出没有被任何笔记链接到的孤立笔记，
列出来并建议它们可以链接到哪些笔记
```

### 3. 自动生成 MOC

```
扫描所有带 #认知科学 标签的笔记，生成一个 MOC 索引页，
按主题分组排列，放在 MOCs/ 文件夹下
```

### 4. Frontmatter 标准化

```
检查所有笔记的 frontmatter，找出缺少 created 字段的笔记，
用文件创建时间补上
```

### 5. 标签清理

```
列出所有标签的使用频率，找出只用过一次的标签，
以及意思相近但拼写不同的标签（如 #ai 和 #AI）
```

### 6. 知识缺口分析

```
分析我关于"机器学习"的所有笔记，指出哪些核心概念
我还没有写过笔记，建议我下一步应该补充什么
```

### 7. 笔记质量审查

```
检查 Permanent/ 文件夹下的永久笔记，找出：
1. 没有链接到其他笔记的
2. 标题不是断言式的
3. 内容超过 500 字的（可能不够"原子"）
```

### 8. 周回顾辅助

```
帮我生成本周的周回顾，包括：
1. 本周新建的笔记列表
2. 修改最多的笔记
3. 新建链接最多的笔记
4. 建议我回顾的旧笔记
```

## CLAUDE.md 配置

在 Vault 根目录创建 `CLAUDE.md`，教 Claude 理解你的 Vault 规范：

```markdown
## Obsidian Vault 规范

## 笔记类型
- 永久笔记放在 Cards/ 文件夹，使用断言式标题
- 文献笔记放在 Literature/ 文件夹
- 日记放在 Daily/ 文件夹

## Frontmatter 格式
所有笔记必须包含：
- tags: 标签列表
- created: YYYY-MM-DD 格式

## 链接规范
- 使用 [[wiki link]] 格式
- 永久笔记至少链接 1 条相关笔记
- 链接后用括号说明关系

## 注意事项
- 不要修改 Templates/ 下的模板文件
- 不要删除任何笔记，只能归档到 Archive/
- 保持 Obsidian 的 [[双向链接]] 语法
```

## MCP 方案

如果你需要更结构化的访问，可以在项目根目录的 `.mcp.json` 中配置 Obsidian MCP Server（下面以社区项目 `obsidian-mcp` 为例，参数以其 README 为准）：

```json
{
  "mcpServers": {
    "obsidian": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "obsidian-mcp", "serve", "--vault", "vault=/path/to/vault"]
    }
  }
}
```

这样 Claude Code 就能通过 MCP 协议感知 Obsidian 的元数据（frontmatter、标签、链接图谱等）。

## 注意事项

1. **先保存** — 操作前确保 Obsidian 中正在编辑的文件已保存
2. **Git 备份** — 批量操作前先提交一次 Git，方便回滚
3. **双向链接语法** — 在 CLAUDE.md 中说明使用 `[[]]` 语法
4. **渐进式使用** — 先从只读操作开始（搜索、分析），熟悉后再做写入操作

## 参考来源

* Claude Code 记忆与 CLAUDE.md：[https://code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory) （查阅日期 2026-09-14）
* Claude Code MCP：[https://code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp) （查阅日期 2026-09-14）
* obsidian-mcp：[https://github.com/StevenStavrakis/obsidian-mcp](https://github.com/StevenStavrakis/obsidian-mcp) （查阅日期 2026-09-14）
