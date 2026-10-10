---
title: "AI 自动化管理 Vault"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "不需要写代码。直接在 Claude Code 中用自然语言描述任务，Claude 会用内置工具完成。"
tags: ["洛洛", "转载"]
---

当 Vault 笔记数量达到几百上千条时，手动管理变得不现实。Claude Code 可以帮你自动化这些重复性工作。

## 自动化脚本思路

不需要写代码。直接在 Claude Code 中用自然语言描述任务，Claude 会用内置工具完成。

## 常用自动化

### 1. 每日 Inbox 处理

```
看一下 00-Inbox/ 文件夹里的笔记，对每一条：
1. 分析内容判断类型（闪念/文献/永久）
2. 建议移动到哪个文件夹
3. 建议添加什么标签
4. 建议链接到哪些已有笔记
列出建议但不要直接移动，等我确认
```

### 2. 批量 Frontmatter 修复

```
扫描 Cards/ 文件夹下所有 .md 文件：
1. 没有 frontmatter 的 → 添加标准 frontmatter
2. 有 frontmatter 但缺少 created 字段的 → 用文件创建时间补上
3. tags 字段为空的 → 根据内容建议 2-3 个标签
执行修复
```

### 3. 链接健康检查

```
检查整个 Vault 的双向链接健康状况：
1. 找出所有断裂链接（[[链接到不存在的笔记]]）
2. 找出孤立笔记（零入链 + 零出链）
3. 找出"死胡同"笔记（有入链但零出链）
生成报告
```

### 4. 自动生成目录索引

```
为 Cards/ 文件夹按标签自动生成索引页：
1. 收集所有标签
2. 按标签分组列出笔记
3. 生成一个 Cards-Index.md 文件
```

### 5. 笔记去重

```
扫描所有笔记，找出标题或内容高度相似的笔记对，
列出来让我决定是否合并
```

### 6. 内容统计

```
生成 Vault 统计报告：
- 总笔记数
- 各文件夹笔记数
- 标签使用频率 Top 20
- 链接最多的 10 条笔记
- 本月新建笔记数
- 最长时间未修改的笔记
```

## 定时自动化

配合 Claude Code 的 [Headless 模式](/tech/claude-code-reference/claude-code-headless)，可以设置定时任务：

```bash
## crontab -e
## 每天早上 8 点自动生成 Vault 报告
0 8 * * * cd /path/to/vault && claude -p "生成今日 Vault 健康报告并保存到 Daily/$(date +\%Y-\%m-\%d)-report.md" --permission-mode dontAsk --allowedTools "Read,Glob,Grep,Write"
```

## 自定义 Slash Command

在 Vault 的 `.claude/commands/` 下创建常用命令：

### `.claude/commands/inbox.md`

```markdown
处理 00-Inbox/ 中的所有笔记：
1. 分析每条笔记的内容
2. 建议分类、标签、链接
3. 列出建议等我确认后再执行
```

使用：`/inbox`

### `.claude/commands/health.md`

```markdown
生成 Vault 健康报告，包括：
- 孤立笔记列表
- 断裂链接列表
- 标签使用统计
- 本周新建/修改笔记统计
保存到 Reports/ 文件夹
```

使用：`/health`

## 安全建议

1. **只读先行** — 新的自动化先用只读模式测试
2. **Git 保底** — 确保 Vault 有 Git 版本管理
3. **分批处理** — 大量修改时分批执行，每批确认后再继续
4. **保留原始** — 修改笔记时保留原始内容的备份

## 参考来源

* Claude Code Headless 模式：[https://code.claude.com/docs/en/headless](https://code.claude.com/docs/en/headless) （查阅日期 2026-09-14）
* Claude Code 自定义命令：[https://code.claude.com/docs/en/slash-commands](https://code.claude.com/docs/en/slash-commands) （查阅日期 2026-09-14）
* Claude Code 权限模式：[https://code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) （查阅日期 2026-09-14）
