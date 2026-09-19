---
title: "项目结构与包管理"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "一个项目就是一个完整的、可独立运行的软件单元，所有代码、配置、资源都组织在一个文件夹里。"
tags: ["洛洛", "转载"]
---

## 什么是"项目"？

一个**项目**就是一个完整的、可独立运行的软件单元，所有代码、配置、资源都组织在一个文件夹里。

为什么要放在一个文件夹里？

* **边界清晰**：一个文件夹 = 一个项目 = 一个 Git 仓库
* **依赖隔离**：每个项目有自己的依赖列表，不会和其他项目冲突
* **构建独立**：运行 `pnpm build` 时只构建这个项目的代码
* **环境隔离**：`.env.local` 只作用于这个项目

想象建筑工地：每个项目就像一栋楼的施工区域被栅栏围起来，材料、工人、图纸都分开存放。

***

## package.json

`package.json` 是 JavaScript/TypeScript 项目的**核心配置文件**，几乎每个 JS 项目都有它。它有三个主要作用：

### 1. 项目身份证

```json
{
  "name": "ll001",
  "version": "0.0.0",
  "private": true
}
```

* `name`：项目名
* `version`：版本号
* `private: true`：标记为私有项目，防止意外发布到 npm 公共仓库

### 2. 命令快捷方式（scripts）

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "biome check",
    "format": "biome format --write",
    "types:check": "fumadocs-mdx && next typegen && tsc --noEmit",
    "postinstall": "fumadocs-mdx"
  }
}
```

你运行 `pnpm dev` 时，实际执行的是 `next dev`。好处：

* **简化命令**：不用记住底层工具的完整命令
* **团队一致**：所有人用同样的命令
* **可维护**：以后换工具只改 package.json 一处

特殊的 script 名称：

* `postinstall`：每次 `pnpm install` 后自动运行（这里用来生成 `.source/` 目录）

### 3. 依赖列表

```json
{
  "dependencies": {
    "next": "16.2.2",
    "react": "^19.2.4",
    "ai": "^6.0.140",
    "flexsearch": "^0.8.212"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.9",
    "typescript": "^6.0.2",
    "@types/react": "^19.2.14"
  }
}
```

> 上面是本站 2026-04 时的 package.json 片段。截至 2026-09-14，本站已改用 bun 管理依赖、站内搜索换成了 Orama，依赖版本也都升级过，但这里讲的概念不变。

***

## dependencies vs devDependencies

这是个关键区分：

### dependencies（运行时依赖）

你的应用**跑起来必须有**的包。没有它们，网站就崩溃了。

比如：

* `next` — Web 框架，没它页面渲染不了
* `react` — UI 库，没它组件显示不出来
* `ai` — AI SDK，没它聊天功能不能用
* `flexsearch` — 搜索引擎，没它搜索功能不能用

### devDependencies（开发依赖）

只在**开发和构建时**需要的工具。上线后不需要。

比如：

* `typescript` — 类型检查工具，代码写完编译后就不需要了
* `@biomejs/biome` — 代码格式化和检查工具
* `@types/react` — 类型定义文件，只有写代码时 IDE 需要

### 怎么判断一个包是哪种？

问自己：**如果去掉这个包，网站还能正常运行吗？**

* 能 → devDependency
* 不能 → dependency

### 为什么要分开？

部署时运行 `pnpm install --production` 只装 dependencies，跳过 devDependencies。这样生产环境的包更小、更安全。

***

## 版本号语义

```json
"next": "16.2.2",
"react": "^19.2.4",
"typescript": "~6.0.2"
```

### 语义化版本号（SemVer）

版本号格式：`主版本.次版本.补丁版本`（Major.Minor.Patch）

* **主版本**（16）：有破坏性改动，升级可能导致你的代码出错
* **次版本**（2）：新增功能，但向下兼容
* **补丁版本**（2）：只有 bug 修复

### 前缀符号

| 符号  | 含义    | 示例        | 允许的范围           |
| --- | ----- | --------- | --------------- |
| 无   | 精确版本  | `16.2.2`  | 只能是 16.2.2      |
| `^` | 兼容主版本 | `^19.2.4` | 19.2.4 到 19.x.x |
| `~` | 兼容次版本 | `~6.0.2`  | 6.0.2 到 6.0.x   |

为什么不全用精确版本？因为补丁和小版本通常包含 bug 修复和安全更新，你希望自动获取。

***

## node\_modules

### 什么是 node\_modules？

运行 `pnpm install` 后，系统会把 package.json 里列出的所有依赖（以及它们的依赖、依赖的依赖……）下载到 `node_modules/` 文件夹。

### 为什么它那么大？

你的 package.json 列了约 20 个包，但 node\_modules 可能有几百甚至上千个包。这是因为**依赖树**：

```
你的项目
├── next (框架)
│   ├── react (UI 库)
│   │   └── scheduler (调度器)
│   ├── postcss (CSS 处理)
│   │   └── nanoid (ID 生成器)
│   └── webpack (打包工具)
│       ├── tapable
│       ├── enhanced-resolve
│       └── ...（几十个依赖）
├── ai (AI SDK)
│   └── zod (数据验证)
└── ...
```

每一层都可能有自己的依赖，最终 node\_modules 会达到 1-2GB。

### 为什么不提交到 Git？

1. **太大了**：1-2GB 的文件上传到 Git 仓库，克隆会非常慢
2. **可重现**：`pnpm-lock.yaml` 记录了完整的依赖信息，运行 `pnpm install` 就能完全复原
3. **跨平台问题**：有些包包含平台相关的二进制文件，Mac 装的和 Linux 装的不同

***

## 包管理器：pnpm / npm / yarn

### 什么是包管理器？

包管理器负责：

* **下载**：从 npm 仓库（全球最大的 JS 包库）下载代码包
* **安装**：放到 node\_modules
* **版本管理**：跟踪每个包的版本
* **依赖解析**：自动处理依赖的依赖

### 三大包管理器

| 管理器      | 特点          | 优势          |
| -------- | ----------- | ----------- |
| **npm**  | Node.js 自带  | 无需额外安装      |
| **yarn** | Facebook 开发 | 比 npm 快一些   |
| **pnpm** | 最新方案        | 最快、最省空间、最安全 |

### pnpm 为什么更好？

1. **最快**：利用全局缓存，已下载过的包不重复下载
2. **最省空间**：用硬链接（hardlink）复用包，不在每个项目里复制一份
3. **最安全**：严格的依赖结构，你只能 import 在 package.json 里声明了的包

### `pnpm install` 在做什么？

```bash
pnpm install
```

执行步骤：

1. 读取 `package.json`（你需要什么包）
2. 读取 `pnpm-lock.yaml`（每个包的确切版本）
3. 从 npm 仓库下载包到全局缓存（已有则跳过）
4. 用硬链接把包放到 `node_modules`
5. 运行 `postinstall` 脚本（这个项目里是 `fumadocs-mdx`，生成 `.source/` 目录）

***

## Lock 文件（pnpm-lock.yaml）

### 为什么需要 Lock 文件？

package.json 写的是版本**范围**（`^19.2.4` 表示 19.2.4 到 19.x.x 都行），但 lock 文件记录了**精确版本**。

**没有 lock 文件的场景**：

```
小王今天装：react@19.2.4
小李一个月后装：react@19.2.5（这一个月出了新版本）
→ 两人环境不一致，小王的代码可能在小李那里出 bug
```

**有 lock 文件的场景**：

```
小王装时生成 lock：react@19.2.4
小李根据 lock 装：react@19.2.4（和小王完全一样）
→ 两人环境完全一致
```

### 为什么 lock 文件那么长？

因为它记录了**整棵依赖树**的每个包、每个版本、每个校验码。一个中型项目的 lock 文件可能有几千行。

### 重要规则

* ✅ **提交到 Git**：让团队共享相同的依赖版本
* ❌ **不要手动编辑**：由包管理器自动维护
* ⚠️ **改了 package.json 后运行 `pnpm install`**：lock 文件会自动更新

***

## 配置文件

现代项目根目录下会有很多配置文件，每个控制不同的工具：

### tsconfig.json — TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"],
      "collections/*": ["./.source/*"]
    }
  }
}
```

关键配置项：

* `strict: true`：开启严格类型检查（更安全，更多错误会被提前发现）
* `paths`：路径别名。写 `@/components/Button` 等于 `./src/components/Button`

**路径别名的好处**：

```typescript
// 没有别名：冗长、难维护
import { Button } from '../../../components/Button'

// 有别名：简洁、清晰
import { Button } from '@/components/Button'
```

### biome.json — 代码质量配置

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "rules": { "recommended": true }
  }
}
```

Biome 做两件事：

1. **格式化**（Formatter）：统一代码风格（缩进、空格、换行）
2. **检查**（Linter）：发现潜在问题（未使用的变量、可能的 bug）

**为什么需要？**

* 团队代码风格统一，不用在 code review 时争论格式
* 自动发现常见错误

### next.config.ts — 框架配置

Next.js 框架的配置文件，控制：

* 代码编译方式
* 图片、字体优化
* 环境变量传入
* 路由规则

***

## 编译与构建

### 为什么源代码不能直接运行？

你写的 TypeScript + JSX 代码：

```tsx
const greeting: string = "Hello"
return  alert(greeting)}>Click
```

浏览器看不懂这些：

1. **TypeScript 语法**：浏览器只认 JavaScript，不认 `: string` 这样的类型标注
2. **JSX 语法**：`` 不是合法的 JavaScript
3. **路径别名**：浏览器不知道 `@/components` 是什么

### 编译做了什么？

运行 `pnpm build` 时：

**1. TypeScript → JavaScript**

```typescript
// 输入
const x: number = 5
// 输出
const x = 5      // 类型标注被删除
```

**2. JSX → 函数调用**

```tsx
// 输入
Click me
// 输出
React.createElement(Button, null, "Click me")
```

**3. 路径别名 → 真实路径**

```typescript
// 输入
import { Button } from '@/components/Button'
// 输出
import { Button } from '../components/Button'
```

**4. 代码优化**

* 删除未使用的代码（tree-shaking）
* 压缩变量名（`buttonClickHandler` → `a`）
* 合并小文件
* 生成更小、更快的代码

### 开发环境 vs 生产环境

| 特性   | `pnpm dev`（开发） | `pnpm build`（生产） |
| ---- | -------------- | ---------------- |
| 编译速度 | 快（增量编译）        | 慢（全量编译）          |
| 代码体积 | 大（保留调试信息）      | 小（激进压缩）          |
| 错误信息 | 详细（方便调试）       | 简洁（对用户友好）        |
| 热更新  | 有（改代码自动刷新）     | 无                |
| 适合场景 | 开发时使用          | 部署到服务器           |

***

## src/ 目录惯例

### 标准项目结构

```
项目根目录/
├── src/                   # 源代码（你写的代码）
│   ├── app/              # 页面和路由
│   ├── components/       # 可复用的 UI 组件
│   └── lib/              # 工具函数和共享逻辑
├── content/              # 内容文件（MDX 文档）
├── public/               # 静态资源（图片、字体、favicon）
├── scripts/              # 辅助脚本
├── node_modules/         # 依赖包（不提交 Git）
├── .next/                # 构建产物（不提交 Git）
├── .source/              # 生成的中间文件（不提交 Git）
├── package.json          # 依赖和命令（提交 Git）
├── pnpm-lock.yaml        # 依赖锁定（提交 Git）
├── tsconfig.json         # TypeScript 配置（提交 Git）
├── biome.json            # 代码质量配置（提交 Git）
├── .gitignore            # Git 忽略规则（提交 Git）
├── .env.local            # 本地环境变量（不提交 Git）
└── CLAUDE.md             # 项目指南（提交 Git）
```

### 为什么代码放在 src/ 里？

* **清晰分类**：源代码和配置文件在不同位置，一目了然
* **构建工具友好**：工具知道只需处理 `src/` 里的文件
* **Git 管理方便**：根目录的配置文件和 `src/` 里的源代码有明确的角色区分

***

## 隐藏文件（以 `.` 开头的文件）

### 为什么默认看不到？

在 Unix/Linux/macOS 系统中，以 `.` 开头的文件和目录默认是**隐藏的**。这是一个历史约定——配置文件和系统文件用点号开头，避免在日常浏览时干扰你。

在 Finder 中看不到，但在终端和 Claude Code 中能看到。macOS 中按 `Cmd+Shift+.` 可以在 Finder 里显示隐藏文件。

### 常见的隐藏文件

| 文件/目录        | 用途                 |
| ------------ | ------------------ |
| `.git/`      | Git 仓库数据（整个版本历史）   |
| `.gitignore` | 告诉 Git 哪些文件不追踪     |
| `.env.local` | 本地环境变量（密钥等）        |
| `.next/`     | Next.js 构建缓存       |
| `.source/`   | fumadocs-mdx 生成的文件 |
| `.claude/`   | Claude Code 项目配置   |
| `.DS_Store`  | macOS 自动生成的文件夹信息   |
| `.vscode/`   | VS Code 编辑器设置      |

***

## 完整的开发工作流

把所有概念串起来：

```bash
## 1. 克隆项目（获取源代码）
git clone https://github.com/user/luoluo-wiki.git
cd luoluo-wiki

## 2. 安装依赖（pnpm-lock.yaml 保证版本一致）
pnpm install
## → 下载包到 node_modules
## → 运行 postinstall 生成 .source/

## 3. 配置环境变量
cp .env.example .env.local
## → 编辑 .env.local，填入你的 API 密钥

## 4. 启动开发服务器
pnpm dev
## → 自动编译 src/ 里的 TypeScript + JSX
## → 浏览器打开 http://localhost:3000
## → 改一行代码，浏览器自动刷新

## 5. 检查代码质量
pnpm lint     # 检查是否有问题
pnpm format   # 自动修复格式

## 6. 生产构建
pnpm build
## → 编译、优化、压缩整个项目
## → 输出到 .next/ 目录
```

## 参考来源

* npm 官方文档 package.json：[https://docs.npmjs.com/cli/configuring-npm/package-json（查阅于](https://docs.npmjs.com/cli/configuring-npm/package-json（查阅于) 2026-09-14）
* 语义化版本 2.0.0：[https://semver.org/lang/zh-CN/（查阅于](https://semver.org/lang/zh-CN/（查阅于) 2026-09-14）
* pnpm 官方文档：[https://pnpm.io/zh/motivation（查阅于](https://pnpm.io/zh/motivation（查阅于) 2026-09-14）
