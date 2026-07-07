---
title: "claudecode基础上手指南"
date: "2026-07-07"
author: "moonsilver"
excerpt: "cc基础使用方式教学"
tags: ["claudecode", "ccswitch", "vibecoding"]
---

本站焚决千千万，cc入门不一般。

# 1. 安装 Claude Code

## Windows PowerShell

打开 PowerShell，执行：

```powershell
irm https://claude.ai/install.ps1 | iex
```

检查是否安装成功：

```powershell
claude --version
```

也可以使用 WinGet 安装：

```powershell
winget install Anthropic.ClaudeCode
```

## Windows CMD

打开 CMD，执行：

```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

## macOS、Linux、WSL

打开终端，执行：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

检查是否安装成功：

```bash
claude --version
```

## macOS Homebrew

```bash
brew install --cask claude-code
```

## 启动 Claude Code

进入项目目录：

```bash
cd 项目路径
```

启动：

```bash
claude
```

第一次启动时，按照终端和浏览器中的提示完成登录。

---

# 2. 安装 CC Switch

CC Switch 官方地址：

- 官网：<https://ccswitch.io>
- GitHub：<https://github.com/farion1231/cc-switch>
- Releases：<https://github.com/farion1231/cc-switch/releases>

## Windows

进入 Releases 页面，下载：

```text
CC-Switch-v版本号-Windows.msi
```

双击安装。

免安装版本下载：

```text
CC-Switch-v版本号-Windows-Portable.zip
```

解压后运行：

```text
CC-Switch.exe
```

## macOS

使用 Homebrew：

```bash
brew install --cask cc-switch
```

或者从 Releases 页面下载：

```text
CC-Switch-v版本号-macOS.dmg
```

打开安装包，将 CC Switch 拖入应用程序目录。

## Debian、Ubuntu

从 Releases 页面下载对应的 `.deb` 文件，然后执行：

```bash
sudo dpkg -i CC-Switch-v版本号-Linux-*.deb
```

出现依赖问题时执行：

```bash
sudo apt-get install -f
```

## Linux AppImage

下载对应的 AppImage 文件，然后执行：

```bash
chmod +x CC-Switch-v版本号-Linux-*.AppImage
./CC-Switch-v版本号-Linux-*.AppImage
```

---

# 3. 使用 CC Switch 换源

## 添加服务商

1. 打开 CC Switch。
2. 在顶部选择 `Claude Code`。
3. 点击右上角的 `+`。
4. 选择 `应用专属供应商`。
5. 从预设中选择服务商，或者选择 `自定义`。
6. 填写 API Key。
7. 检查接口地址和模型名称。
8. 点击添加。

预设服务商一般只需要填写 API Key。

## 添加自定义服务商

选择 `自定义` 后，填写类似下面的配置：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "你的API Key",
    "ANTHROPIC_BASE_URL": "https://你的接口地址"
  }
}
```

部分服务商使用 Token 认证时，可以填写：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的Token",
    "ANTHROPIC_BASE_URL": "https://你的接口地址"
  }
}
```

模型名称按照服务商提供的模型 ID 填写。

## 切换服务商

在服务商列表中找到目标服务商，点击：

```text
启用
```

卡片显示 `当前启用` 后，换源完成。

Claude Code 会自动读取新的配置，无需重新安装。CC Switch 会修改：

```text
~/.claude/settings.json
```

切换完成后，在项目目录中启动：

```bash
claude
```

切回官方服务时，在 CC Switch 中启用 `Claude 官方`，然后在 Claude Code 中执行：

```text
/login
```

---

# 4. Claude Code 常用指令

## 终端指令

| 指令 | 作用 |
|---|---|
| `claude` | 启动 Claude Code |
| `claude --version` | 查看版本 |
| `claude --help` | 查看终端帮助 |
| `claude doctor` | 检查安装和配置状态 |

## 会话内指令

进入 Claude Code 后输入 `/`，可以查看当前版本支持的全部指令。

| 指令 | 作用 |
|---|---|
| `/help` | 查看帮助 |
| `/init` | 在当前项目生成 `CLAUDE.md` |
| `/plan` | 进入规划模式，只分析和制定修改方案 |
| `/model` | 查看或切换模型 |
| `/effort` | 设置模型推理强度 |
| `/permissions` | 管理文件和命令执行权限 |
| `/context` | 查看上下文占用 |
| `/compact` | 压缩当前会话内容 |
| `/clear` | 清空当前会话并开始新会话 |
| `/resume` | 恢复之前的会话 |
| `/diff` | 查看当前代码改动 |
| `/code-review` | 检查当前代码改动 |
| `/security-review` | 检查当前改动中的安全问题 |
| `/doctor` | 检查 Claude Code 安装和配置 |
| `/status` | 查看版本、模型、账号和连接状态 |
| `/login` | 登录或切换账号 |
| `/exit` | 退出 Claude Code |
