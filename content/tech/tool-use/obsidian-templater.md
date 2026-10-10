---
title: "Templater 模板引擎"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "1. 社区插件搜索 ”Templater” → 安装 → 启用"
tags: ["洛洛", "转载"]
---

**Templater** 是 Obsidian 最强大的模板插件，支持 JavaScript 脚本、日期函数、文件操作等高级功能。

## 安装与配置

1. 社区插件搜索 "Templater" → 安装 → 启用
2. 设置 → Templater → Template folder location → 设为 `Templates`
3. 开启 "Trigger Templater on new file creation"

## 基础语法

### 日期

```markdown
创建日期：<% tp.date.now("YYYY-MM-DD") %>
昨天：<% tp.date.now("YYYY-MM-DD", -1) %>
明天：<% tp.date.now("YYYY-MM-DD", 1) %>
本周第一天（周一还是周日取决于区域设置）：<% tp.date.weekday("YYYY-MM-DD", 0) %>
```

### 文件信息

```markdown
文件名：<% tp.file.title %>
文件夹：<% tp.file.folder() %>
创建时间：<% tp.file.creation_date("YYYY-MM-DD HH:mm") %>
```

### 用户输入

```markdown
<% tp.system.prompt("请输入书名") %>
<% tp.system.suggester(["fiction","non-fiction","tech"], ["小说","非虚构","技术"]) %>
```

### 光标定位

```markdown
<% tp.file.cursor() %>
```

模板应用后，光标自动定位到这个位置。

## 实用模板

### 日记模板

```markdown
---
tags: [日记]
created: <% tp.date.now("YYYY-MM-DD") %>
---

## <% tp.date.now("YYYY年MM月DD日 dddd") %>

## 今日计划
- [ ] 

## 记录
<% tp.file.cursor() %>

## 感悟

## 明日计划
- [ ] 
```

### 读书笔记模板

```markdown
---
tags: [读书笔记]
created: <% tp.date.now("YYYY-MM-DD") %>
author: <% tp.system.prompt("作者") %>
status: reading
rating: 
summarized: L1
---

## <% tp.file.title %>

## 核心观点

<% tp.file.cursor() %>

## 摘录

## 我的思考

## 相关链接
```

### 永久笔记模板

```markdown
---
tags: [永久笔记]
created: <% tp.date.now("YYYY-MM-DD") %>
source: <% tp.system.prompt("来源（可选）", "") %>
---

## <% tp.file.title %>

<% tp.file.cursor() %>

---

相关：
- 
```

### 周回顾模板

```markdown
---
tags: [周回顾]
week: <% tp.date.now("YYYY-[W]ww") %>
created: <% tp.date.now("YYYY-MM-DD") %>
---

## 第 <% tp.date.now("ww") %> 周回顾

## 本周完成
- 

## 本周学到
- 

## 下周计划
- 

## 反思
```

## 高级用法

### JavaScript 脚本

```markdown
<%*
const files = app.vault.getMarkdownFiles();
const count = files.length;
tR += `当前 Vault 共有 ${count} 条笔记。`;
%>
```

### 自动移动文件

```markdown
<%* await tp.file.move("1-Projects/" + tp.file.title) %>
```

### 自动重命名

```markdown
<%* await tp.file.rename(tp.date.now("YYYY-MM-DD") + " " + tp.file.title) %>
```

## 快捷触发

设置热键绑定特定模板，比如：

* `Alt+D` → 创建日记
* `Alt+N` → 创建永久笔记
* `Alt+B` → 创建读书笔记

## 参考来源

* Templater 文档：[https://silentvoid13.github.io/Templater/](https://silentvoid13.github.io/Templater/) （查阅日期 2026-09-14）
* Templater tp.date 模块：[https://silentvoid13.github.io/Templater/internal-functions/internal-modules/date-module.html](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/date-module.html) （查阅日期 2026-09-14）
* Templater tp.file 模块：[https://silentvoid13.github.io/Templater/internal-functions/internal-modules/file-module.html](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/file-module.html) （查阅日期 2026-09-14）
