---
title: "终端与 Shell"
date: "2026-09-20"
author: "洛洛"
excerpt: "终端（Terminal）就是一个”对话框”。在图形界面里你用鼠标点击按钮、拖拽文件。在终端里，你直接用文字命令和电脑对话。"
tags: ["luoluo", "迁移"]
---

## 什么是终端？

**终端（Terminal）就是一个"对话框"**。在图形界面里你用鼠标点击按钮、拖拽文件。在终端里，你**直接用文字命令**和电脑对话。

工作流程很简单：你在黑色窗口里输入一行文字（比如 `pnpm dev`），按 Enter，电脑执行你的命令，把结果打印回来。

用生活场景类比：

* **图形界面**就像走进厨房，按下"切菜"按钮，机器自动执行
* **终端**就像对厨师喊："切菜！煮面！检查火候！"——更快、更直接、更灵活

终端的优势在于：你可以用一行命令完成图形界面需要点击十几次才能完成的操作，还可以把多个命令串联起来，实现复杂的自动化。

### 常见的终端程序

* **macOS**：Terminal.app（自带）、iTerm2（更强大）
* **Windows**：Windows Terminal、PowerShell
* **Linux**：GNOME Terminal、Konsole

Claude Code 运行在终端里，因为终端是它与系统交互的唯一通道——读文件、改代码、运行测试、使用 Git，全部通过终端完成。

***

## 什么是 Shell？

**Shell 是"翻译官"**，负责理解和执行你输入的命令。

当你输入 `pnpm dev`，Shell 不是直接执行它，而是经过一系列步骤：

1. **读取**你输入的文字 `pnpm dev`
2. **解析**你的意思——这是一个命令 `pnpm`，参数是 `dev`
3. **查找** pnpm 程序在电脑上的位置（通过 PATH 环境变量）
4. **启动**一个新进程来运行 pnpm
5. **收集**程序的输出，显示在终端上

### 常见的 Shell

* **Bash**（Bourne Again Shell）：最经典的 Shell，大多数 Linux 系统的默认选择
* **Zsh**（Z Shell）：macOS 现在的默认 Shell，功能更丰富，支持更好的自动补全、主题等
* **Fish**：对新手更友好，语法更直观
* **PowerShell**：Windows 的现代 Shell

不同的 Shell 就像不同语言的翻译官——都能完成"翻译"工作，但语法和功能有所不同。Claude Code 会自动检测并使用你系统默认的 Shell。

### 终端 vs Shell 的区别

很多人混淆这两个概念：

* **终端**是"窗口"——提供输入输出的界面
* **Shell**是"引擎"——运行在终端里，负责解析和执行命令

就像浏览器是窗口，网页引擎是处理内容的引擎。

***

## 当前工作目录（cwd）

这是理解 Claude Code 行为的**最关键概念之一**。

### 概念

每个 Shell 进程都有一个"当前位置"——**当前工作目录（Current Working Directory，简写 cwd）**。就像你在图书馆里，需要知道"我现在在哪个楼层、哪个书架旁边"。

你可以用 `pwd` 命令查看当前位置：

```bash
pwd
## 输出: /Users/mozi/开发/LL001 luoluo-wiki
```

### 为什么它如此重要？

所有**相对路径**都依赖于当前工作目录。比如你运行 `cat package.json`：

* 如果你在 `/Users/mozi/开发/LL001 luoluo-wiki/`，它会读取这个项目的 package.json
* 如果你在 `/Users/mozi/`，它会报错——因为你的主目录下没有 package.json

### Claude Code 怎么知道你在哪个项目？

当你启动 Claude Code 时：

```bash
cd /Users/mozi/开发/LL001\ luoluo-wiki
claude
```

Claude Code 会：

1. 记住当前工作目录是 `/Users/mozi/开发/LL001 luoluo-wiki`
2. 在这个目录里寻找项目标志（`package.json`、`.git`、`CLAUDE.md` 等）
3. 所有后续的文件操作都以这个目录为基准

**如果你在错误的目录启动 Claude Code，它就会找不到你的项目文件。** 这是新手最常遇到的问题之一。

### 用 `cd` 切换目录

```bash
cd /Users/mozi/开发/LL001\ luoluo-wiki  # 进入项目目录
cd ..                                     # 返回上一级目录
cd ~                                      # 回到主目录
cd -                                      # 回到上一个目录
```

***

## 绝对路径 vs 相对路径

### 绝对路径

从根目录（`/`）开始的完整地址：

```
/Users/mozi/开发/LL001 luoluo-wiki/src/app/page.tsx
```

就像说"从地球北极出发，向南到中国，进入某省某市某小区某栋某层某房间"——**无论你现在在哪里，这个地址都是唯一确定的**。

### 相对路径

从当前位置出发的地址：

```
./src/app/page.tsx        # 当前目录下的 src/app/page.tsx
../package.json           # 上一级目录的 package.json
../../other-project/      # 上两级目录下的 other-project
```

就像说"从我现在的位置向右走一个房间"——**取决于你在哪里**。

### 特殊路径符号

| 符号   | 含义    | 示例                          |
| ---- | ----- | --------------------------- |
| `/`  | 根目录   | `/usr/local/bin`            |
| `~`  | 主目录   | `~/开发/` = `/Users/mozi/开发/` |
| `.`  | 当前目录  | `./src` = 当前目录下的 src        |
| `..` | 上一级目录 | `../` = 父目录                 |

### 为什么 Claude Code 总是用绝对路径？

Claude Code 在执行过程中可能在不同地方运行命令，当前工作目录可能变化。使用绝对路径保证：

* 无论当前目录是什么，命令都能找到正确的文件
* 不会因为目录切换而"迷路"

这就是为什么你在 Claude Code 的输出里总看到完整路径。

***

## 环境变量

### 什么是环境变量？

**环境变量是操作系统为程序提供的一套"全局配置字典"**。每个程序启动时都能读取这些变量。

想象你开了一家连锁餐厅，每家店都有一份"运营手册"（环境变量），上面写着：

* `STORE_NAME=朝阳店`（店名）
* `MAX_TABLES=50`（最大桌数）
* `API_KEY=xxx`（收银系统密钥）

程序可以随时查询："告诉我 API\_KEY 的值是什么？"

### 查看环境变量

```bash
echo $HOME          # 查看主目录: /Users/mozi
echo $PATH          # 查看程序搜索路径
echo $SHELL         # 查看当前 Shell: /bin/zsh
env                 # 列出所有环境变量
```

### .env 文件

`.env` 是一个存储环境变量的配置文件，通常放在项目根目录：

```
API_BASE_URL=https://api.example.com
API_KEY=sk-1234567890abcdef
FEATURE_FLAG=true
```

程序启动时（比如 Next.js），框架会自动读取 `.env` 文件，将里面的变量加载到运行环境中。

### 为什么 API 密钥不能写在代码里？

假设你这样写：

```javascript
const apiKey = "sk-1234567890abcdef"  // 直接写在代码里
```

问题：

1. **安全风险**：代码会上传到 GitHub，密钥就公开了。任何人都能用你的密钥冒充你、消耗你的余额
2. **环境差异**：开发、测试、生产环境用的密钥不同，代码里写死了就无法切换
3. **泄露追踪困难**：一旦密钥被提交到 Git 历史，即使后来删除，历史记录里仍然存在

**正确做法**：

1. 密钥放在 `.env.local` 文件里
2. `.gitignore` 里排除 `.env.local`（永远不提交）
3. 每个开发者自己创建自己的 `.env.local`
4. 生产环境通过服务器设置或 CI/CD 系统注入环境变量

### Claude Code 与环境变量

Claude Code 使用你当前 Shell 的环境变量。你在 `.env.local` 里设的变量，Claude Code 运行的所有子进程（npm、node、git 等）都能继承。

***

## 进程

### 什么是进程？

**进程（Process）是一个"正在运行的程序"**。

当你双击一个应用、或在终端运行一个命令时：

1. 操作系统把程序代码加载到内存
2. 分配资源（内存空间、CPU 时间）
3. 开始执行——这个执行中的实例就叫"进程"

每个进程都有：

* **进程 ID（PID）**：唯一标识号，比如 12345
* **内存空间**：程序自己的私有内存
* **环境变量**：从父进程继承
* **当前工作目录**：从父进程继承

### 进程的父子关系

进程之间有"家族关系"：

```
终端窗口
└── Shell 进程（PID 1234）        ← 父进程
    └── Claude Code 进程（PID 5678）  ← 子进程
        ├── Node.js 子进程           ← 孙子进程
        ├── Git 子进程
        └── pnpm 子进程
```

子进程**继承**父进程的环境变量和当前工作目录。这就是为什么你在终端设置了环境变量后，Claude Code 能读到。

### 为什么关闭终端就会结束 Claude Code？

当你关闭终端窗口：

1. 操作系统停止 Shell 进程
2. Shell 进程的所有子进程也被强制停止
3. Claude Code 和它运行的所有命令都结束了

就像"经理（Shell）下班了，所有下属（Claude Code 和子进程）也都下班了"。

**但对话不会丢失！** Claude Code 在运行时会自动保存对话历史到磁盘（默认保留 30 天，由 `cleanupPeriodDays` 设置控制）。下次你可以用 `claude --continue` 恢复。

***

## stdout / stderr：两条输出管道

### 标准流

每个进程都有三条标准的"数据管道"：

| 名称               | 方向      | 用途       |
| ---------------- | ------- | -------- |
| **stdin**（标准输入）  | 外部 → 程序 | 接收你的键盘输入 |
| **stdout**（标准输出） | 程序 → 外部 | 正常结果     |
| **stderr**（标准错误） | 程序 → 外部 | 错误和警告信息  |

### 为什么要分开 stdout 和 stderr？

用餐厅类比：

* **收据打印机（stdout）**：打印正常订单"1份牛排、1杯水"
* **警告灯（stderr）**：闪烁显示"这道菜已售罄"

分开的好处：

* **可以分别处理**：把正常输出存到文件，把错误单独记录
* **可以分别重定向**：`command > output.txt 2> errors.txt`

### 为什么命令输出有时是红色的？

终端通常用不同颜色区分两种输出：

* **白色/默认色**：stdout，正常输出
* **红色**：stderr，错误信息

看到红色不一定是"出错了"——有些程序把进度信息、警告也发到 stderr。真正的判断依据是退出码。

### Claude Code 怎么处理？

Claude Code 会**同时监听 stdout 和 stderr**，把两者都收集并显示给你。这样你能看到完整的输出和所有错误信息，不会遗漏任何重要信息。

***

## 退出码（Exit Code）

### 什么是退出码？

**退出码是进程结束时返回的一个数字（0-255）**，用来告诉系统"我的执行结果怎样"。

这是一个**全行业的约定**：

* **0** = 一切正常，成功完成
* **1** = 一般错误
* **2** = 命令使用错误
* **127** = 命令未找到
* **130** = 被 Ctrl+C 终止
* **其他非零数字** = 各种特定错误

### 为什么 0 = 成功？

历史原因：在 UNIX 哲学中，成功只有一种情况，但失败有无数种。用 0 表示唯一的"成功"，用 1-255 表示不同类型的失败，这样脚本可以根据不同的退出码做出不同的响应。

### 在命令链中的应用

```bash
pnpm lint && pnpm build
```

`&&` 的意思是："前一个命令成功（退出码 0）了吗？如果是，就运行下一个。"

```bash
pnpm lint || echo "lint 失败了"
```

`||` 是相反的逻辑："前一个命令失败了吗？如果是，就运行下一个。"

### Claude Code 如何使用退出码？

Claude Code 运行每个命令后都会检查退出码：

* 退出码 **0**：命令成功，继续下一步
* 退出码 **非 0**：命令失败，分析错误原因，可能调整策略或向你报告

***

## PATH 环境变量

### 什么是 PATH？

**PATH 是告诉 Shell "去哪些目录找可执行程序"的环境变量**。

它的值是一串用冒号（`:`）分隔的目录列表：

```
/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin
```

当你输入 `pnpm`，Shell 会按顺序在这些目录里搜索：

1. 先在 `/usr/local/bin` 里找
2. 找不到就在 `/usr/bin` 里找
3. 再找不到就在 `/bin` 里找
4. 再在 `/opt/homebrew/bin` 里找
5. 全都找不到 → `command not found: pnpm`

### "Command not found" 的原因

看到这个错误：

```
zsh: command not found: pnpm
```

可能的原因：

1. **程序没安装**：需要先安装（`npm install -g pnpm`）
2. **安装位置不在 PATH 里**：程序装在了非标准目录
3. **Shell 配置没生效**：需要重新打开终端或 `source ~/.zshrc`

### 怎么查看和修改 PATH

```bash
## 查看当前 PATH
echo $PATH

## 临时添加一个目录到 PATH（只在当前终端有效）
export PATH="/custom/bin:$PATH"

## 永久添加（写入 Shell 配置文件）
echo 'export PATH="/custom/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc  # 立即生效
```

### Claude Code 与 PATH

Claude Code 继承你 Shell 的 PATH。如果你能在终端里运行某个命令，Claude Code 也能。反之亦然——如果 Claude Code 报告"命令未找到"，通常是 PATH 配置的问题。

***

## 总结：启动 Claude Code 时发生了什么

把所有概念串联起来：

```
1. 你打开终端程序（如 iTerm2）
   → 操作系统启动一个 Shell 进程（Zsh）

2. Shell 读取配置文件（~/.zshrc）
   → 设置环境变量（PATH、HOME 等）

3. 你用 cd 进入项目目录
   → 当前工作目录变为项目路径

4. 你输入 claude
   → Shell 在 PATH 目录里搜索 claude 程序
   → 找到后启动 Claude Code 子进程

5. Claude Code 继承了：
   ├── 当前工作目录（知道你在哪个项目）
   ├── 环境变量（PATH、API_KEY 等）
   ├── stdin/stdout/stderr（与你的终端连接）
   └── Shell 类型（知道用 bash 还是 zsh 运行命令）

6. Claude Code 现在可以：
   ├── 用绝对路径读写你的项目文件
   ├── 用 PATH 找到并运行工具（pnpm、git、node）
   ├── 用环境变量获取配置（API 密钥）
   ├── 把结果（stdout）和错误（stderr）显示给你
   └── 用退出码判断命令成功还是失败

7. 你关闭终端
   → Shell 进程停止
   → Claude Code 子进程也停止
   → 但对话已自动保存，下次可恢复
```

## 参考来源

* GNU Bash 官方页面：[https://www.gnu.org/software/bash/（查阅于](https://www.gnu.org/software/bash/（查阅于) 2026-09-14）
* Zsh 官方网站：[https://zsh.sourceforge.io/（查阅于](https://zsh.sourceforge.io/（查阅于) 2026-09-14）
* Claude Code .claude 目录说明（会话记录与保留期）：[https://code.claude.com/docs/en/claude-directory（查阅于](https://code.claude.com/docs/en/claude-directory（查阅于) 2026-09-14）
