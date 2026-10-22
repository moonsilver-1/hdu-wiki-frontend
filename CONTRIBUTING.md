# 为 HDU Wiki 贡献内容

## Front Matter

正文文件放在 `content/<category>/<section>/<slug>.md`，使用标准 Markdown Front Matter：

```yaml
---
title: "2–80 字符的标题"
date: "2026-08-08"
author: "作者"
excerpt: "20–160 字符的摘要"
tags: ["标签"]
---
```

`date` 必须是有效的 `YYYY-MM-DD` 日期；标签最多 8 个。课程精排 section（例如深度学习、算法）由维护者管理，不接受网页投稿。

## 正文规范

- 页面模板已经提供 H1，正文从 H2 开始，标题不要跳级。
- 正文 20–60,000 字符；不使用 raw HTML、Obsidian callout 或 wikilink。
- 图片使用 Markdown 语法，可由网页编辑器上传，也可使用站内绝对路径或 HTTPS 链接；填写有意义的替代文字。不要提交本机文件路径。
- 代码放在带语言标记的围栏代码块中；公式使用 KaTeX 支持的 Markdown 数学语法。
- 行内公式使用 `$...$`；多行公式的 `$$` 起止标记各占一行。价格中的美元符号写作 `\$`，避免被当成公式。
- 展示包含三个反引号的 Markdown 示例时，外层使用四个反引号。代码里的 HTML 和数学示例会按代码原样展示。
- 时间敏感信息写明适用年级、原始日期和来源等级。官方规则优先于经验贴。
- AI 可以用于整理、校对和生成初稿，但作者必须核对事实、承担授权和署名责任，不提交个人隐私、密钥或未公开资料。

## Pull Request 流程

1. 修改内容并运行 `pnpm check`。
2. 在 PR 描述中说明来源、时间敏感信息、作者授权和是否涉及安全边界。
3. 维护者审核事实、链接、Markdown AST 和隐私后合并。

网页投稿与手工 Markdown 使用同一套字段、长度、标题、图片和 raw HTML 校验规则。

`pnpm validate:content` 检查正文规范并报告所在行；`pnpm validate:rendering` 实际渲染正文与作者简介，检查公式和渲染错误。历史内容中的非阻断警告应逐步清理，新投稿应按提示修正。
