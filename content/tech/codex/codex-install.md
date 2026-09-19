---
title: "安装与登录"
date: "2026-09-20"
author: "洛洛"
excerpt: "* macOS、Linux 或 Windows（Windows 已支持原生运行，不再强制 WSL2）"
tags: ["luoluo", "迁移"]
---

## 前提条件

* macOS、Linux 或 Windows（Windows 已支持原生运行，不再强制 WSL2）
* 一个 **ChatGPT 账号**（Free / Go / Plus / Pro / Business / Enterprise / Edu 都能用 Codex，额度不同）或一个 **OpenAI API key**
* Linux / WSL2 需要先装 `bubblewrap`（沙箱依赖）
* 如果走 npm 安装，需要 Node.js

## 安装

### 官方安装脚本（推荐）

安装和更新用的是同一条命令：

```bash
## macOS / Linux
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

```powershell
## Windows PowerShell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

默认安装到 `~/.local/bin`（Windows 是 `%LOCALAPPDATA%\Programs\OpenAI\Codex\bin`），可用环境变量 `CODEX_INSTALL_DIR` 改位置，`CODEX_NON_INTERACTIVE=1` 跳过交互。

### npm

```bash
npm install -g @openai/codex
```

更新也是同一条命令。

### Homebrew（macOS）

Codex 在 Homebrew 里是 **cask**，不是 formula：

```bash
brew install --cask codex
brew upgrade --cask codex
```

### 直接下载二进制

GitHub Releases 提供 macOS / Linux / Windows 各平台的 `.tar.gz` / `.zip` / `.dmg` / `.exe`，附 sigstore 签名，另有 DotSlash 文件可提交进仓库锁定团队统一版本：[https://github.com/openai/codex/releases](https://github.com/openai/codex/releases)

### Linux / WSL2 额外步骤

```bash
sudo apt install bubblewrap     # Debian / Ubuntu
sudo dnf install bubblewrap     # Fedora
```

Ubuntu 24.04 可能还需要加载 `bwrap-userns-restrict` AppArmor 配置；25.04 之后随 `apparmor` 包自带。WSL1 自 Codex 0.115 起不再支持。

## 验证安装

```bash
codex --version
codex doctor        # 一键诊断安装、配置、登录、Git、终端环境
```

## 登录

### 方式一：ChatGPT 账号（推荐）

```bash
codex login
```

会打开浏览器走 OAuth。CLI 与 IDE 扩展**共享同一份登录态**，一端登出另一端也要重登。

```bash
codex login status   # 查看当前登录方式
codex logout         # 清除凭据
```

### 方式二：API key

注意写法已经变了，旧的 `codex login --api-key sk-...` 会直接退出并提示改用管道：

```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```

用 API key 登录走的是按 token 计费的 API 路径，不消耗 ChatGPT 订阅额度；反过来说，ChatGPT 登录的用量限制也不适用于它。

### 无头机器 / 远程服务器

优先用**设备码登录**（需先在 ChatGPT 安全设置或工作区权限里启用）：

```bash
codex login --device-auth
```

回退方案二选一：

* 在有浏览器的机器上登录后，把 `~/.codex/auth.json` 复制到远程机器
* SSH 端口转发 OAuth 回调：`ssh -L 1455:localhost:1455 user@remote`，然后在该会话里跑 `codex login`

### 凭据存放位置

默认在 `~/.codex/auth.json`，明文含访问令牌，当密码对待。可以改成系统钥匙串：

```toml
## ~/.codex/config.toml
cli_auth_credentials_store = "keyring"   # file | keyring | auto
```

## 更新

```bash
codex update                     # 安装脚本安装的版本自更新
npm install -g @openai/codex     # npm 安装的
brew upgrade --cask codex        # Homebrew 安装的
```

不要混用多个安装来源。如果装过不止一种，先用 `which codex` 看当前命令来自哪里。

## 首次启动

进入任意 Git 仓库运行：

```bash
codex
```

第一次会询问是否信任这个目录。信任后默认进入 **Auto** 模式（工作区可写 + 需要时才问你）；不信任或目录不在 Git 管理下则停在只读。这套沙箱与审批逻辑在 [沙箱与审批](/tech/codex/codex-sandbox-approvals) 里详细讲。

## 常见问题

**Windows 一定要 WSL 吗？** 不用了。PowerShell 下直接跑，Codex 会用原生 Windows 沙箱；WSL2 也支持，但 WSL1 不行。

**公司有 TLS 代理怎么办？** 设置 `CODEX_CA_CERTIFICATE` 指向 PEM 证书包，它优先于 `SSL_CERT_FILE`。

**在中国大陆能用吗？** OpenAI 不向中国大陆正式提供服务，注册和支付有区域限制，2026 年还多次出现风控收紧。这里只提醒风险，具体访问方式请遵守当地法规与 OpenAI 服务条款。

## 参考来源

* Codex CLI 总览与安装：[https://learn.chatgpt.com/docs/codex/cli](https://learn.chatgpt.com/docs/codex/cli)
* 认证：[https://learn.chatgpt.com/docs/auth](https://learn.chatgpt.com/docs/auth)
* 环境变量：[https://learn.chatgpt.com/docs/config-file/environment-variables](https://learn.chatgpt.com/docs/config-file/environment-variables)
* Windows 沙箱与 WSL：[https://learn.chatgpt.com/docs/windows/windows-sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox) 、[https://learn.chatgpt.com/docs/windows/wsl](https://learn.chatgpt.com/docs/windows/wsl)
* GitHub Releases：[https://github.com/openai/codex/releases](https://github.com/openai/codex/releases) （0.147.0 发布于 2026-08-07）
