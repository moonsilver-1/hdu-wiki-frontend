---
title: "FlClash 全平台指南"
date: "2026-09-20"
author: "洛洛"
excerpt: "从 GitHub Releases 下载 APK："
tags: ["luoluo", "迁移"]
---

**FlClash** 是一款基于 Flutter 开发的全平台代理客户端，内核使用 mihomo（Clash Meta）。一套代码覆盖 Android、Windows、macOS、Linux，安卓手机和电脑可以用同一个应用。截至 2026-09-14，官方 README 与 Releases 只提供这四个平台，最新版本是 v0.8.98（2026-09-14 发布）。

GitHub: `github.com/chen08209/FlClash`

## 为什么选 FlClash？

| 优势                    | 说明                     |
| --------------------- | ---------------------- |
| **多平台统一**             | 安卓手机和电脑用同一个应用，体验一致     |
| **Flutter 原生**        | 编译为原生代码，比 Electron 更轻量 |
| **Material Design 3** | 界面现代美观，支持动态取色          |
| **mihomo 内核**         | 支持所有主流协议               |
| **开源免费**              | GPL-3.0，无广告            |

### FlClash vs Clash Verge Rev

| 维度    | FlClash           | Clash Verge Rev    |
| ----- | ----------------- | ------------------ |
| 技术栈   | Flutter (Dart)    | Tauri (Rust + Web) |
| 平台    | **Android + 桌面**  | 仅桌面                |
| 内核    | mihomo            | mihomo             |
| UI 风格 | Material Design 3 | 传统桌面风              |
| 脚本增强  | 基础覆写              | JavaScript 脚本      |
| 适合    | 需要全平台统一的用户        | 桌面端深度定制用户          |

## 安装

### Android

从 GitHub Releases 下载 APK：

* `arm64-v8a` — 绝大多数现代手机
* `armeabi-v7a` — 旧设备
* `x86_64` — 模拟器

安装后可能需要开启"允许安装未知来源应用"。

### iOS

截至 2026-09-14，FlClash 官方没有 iOS 版本：README 列出的平台是 Android、Windows、macOS、Linux，Releases 里也没有 IPA 安装包。网上自称「FlClash iOS」的安装包不是官方发布，iPhone 用户可以看 [Shadowrocket](/tech/tool-use/network-shadowrocket) 或 [sing-box](/tech/tool-use/network-sing-box) 的官方客户端。

### Windows

两种方式：

* **ZIP 便携版** — 解压即用，免安装
* **安装版**（`-setup.exe`）— 双击安装，集成到系统

x64 和 ARM64 电脑各有一份，按电脑架构选。

> 建议以管理员权限运行以启用 TUN 模式。

### macOS

下载 `.dmg` 文件：

* **arm64** — Apple Silicon (M1/M2/M3/M4)
* **amd64** — Intel Mac

首次打开需要在"系统设置 → 隐私与安全性"中允许。

```bash
## 如果提示无法打开
sudo xattr -r -d com.apple.quarantine /Applications/FlClash.app
```

也可以用官方 README 给出的 Homebrew 方式安装：

```bash
brew tap chen08209/tap
brew install --cask flclash
```

### Linux

* `.deb` — Debian / Ubuntu
* `.rpm` — Fedora / RHEL
* `.AppImage` — 通用

以上三种格式都有 amd64 和 arm64 两种架构。

* AUR: `yay -S flclash-bin`

## 基础使用

### 第一步：导入订阅

1. 打开 FlClash → 进入「配置」页面
2. 点击右下角 `+` 按钮
3. 选择「URL」方式
4. 粘贴机场提供的订阅链接
5. 输入备注名称 → 确认
6. 下载完成后，点击该配置使其激活

### 第二步：选择节点

1. 切换到「代理」页面
2. 点击⚡测速按钮，批量测试延迟
3. 在策略组中选择延迟最低的节点
4. 支持按延迟排序

### 第三步：启动代理

1. 回到主页，点击开关启动
2. Android/iOS 会弹出 VPN 权限请求 → 允许
3. 桌面端默认使用系统代理

### 第四步：选择代理模式

| 模式              | 说明              |
| --------------- | --------------- |
| **规则 (Rule)**   | 按规则自动分流（推荐日常使用） |
| **全局 (Global)** | 所有流量走代理         |
| **直连 (Direct)** | 所有流量直连          |

## TUN 模式

TUN 模式在系统层面接管**所有流量**，包括不走系统代理的应用。

### 开启方式

1. 进入「设置」→ 找到「TUN」
2. 开启 TUN 模式
3. 桌面端首次启用会请求管理员/root 权限

### TUN vs 系统代理

| 维度   | 系统代理            | TUN    |
| ---- | --------------- | ------ |
| 覆盖范围 | 仅 HTTP/SOCKS 应用 | 所有应用   |
| 终端命令 | 需要手动配环境变量       | 自动接管   |
| 游戏   | 不支持 UDP         | 支持 UDP |
| 性能   | 更轻量             | 略高开销   |

**推荐日常使用 TUN 模式**，省去配置终端代理的麻烦。

## 分流规则

FlClash 完整支持 mihomo 的规则体系：

### 规则类型

| 规则               | 示例           | 说明       |
| ---------------- | ------------ | -------- |
| `DOMAIN-SUFFIX`  | `google.com` | 匹配域名后缀   |
| `DOMAIN-KEYWORD` | `openai`     | 匹配域名关键词  |
| `IP-CIDR`        | `8.8.8.0/24` | 匹配 IP 段  |
| `GEOIP`          | `CN`         | 匹配国家/地区  |
| `GEOSITE`        | `google`     | 匹配域名集合   |
| `RULE-SET`       | 远程规则集        | 自动更新     |
| `PROCESS-NAME`   | `chrome.exe` | 匹配进程（桌面） |

### 常见分流策略

大多数订阅自带规则：

* 国内网站 → 直连
* Google / YouTube → 代理
* Netflix / Disney+ → 特定节点
* ChatGPT / Claude → 美国/日本节点
* 广告域名 → 拦截

## 进阶功能

### 订阅自动更新

在配置页面可设置自动更新间隔，确保节点列表始终最新。

### 应用分流（Android）

可指定哪些应用走代理、哪些直连：

1. 进入「设置」→「应用代理」
2. 选择需要走代理的应用
3. 其他应用默认直连

### 配置覆写

对订阅配置进行局部修改，不影响订阅更新：

* 添加自定义规则
* 修改 DNS 配置
* 调整策略组设置

### 日志查看

设置中开启日志，排查连接问题。可以看到每个请求的匹配规则和目标节点。

## 支持的协议

得益于 mihomo 内核，FlClash 支持：

* Shadowsocks (SS)
* ShadowsocksR (SSR)
* VMess
* VLESS（含 Reality）
* Trojan
* Hysteria / Hysteria2
* TUIC
* WireGuard

基本上你能遇到的所有协议都支持。

## 常见问题

### 连接后部分网站打不开？

1. 检查分流规则是否正确
2. 尝试切换节点
3. 清除浏览器 DNS 缓存

### Android TV 可以用吗？

可以。FlClash 适配了 Android TV 界面，遥控器即可操作。

### 和 Clash Verge Rev 能同时用吗？

不建议。两个代理客户端同时运行会冲突。在同一台设备上选择一个使用。

### 订阅更新失败？

1. 检查网络连接
2. 订阅链接是否过期
3. 尝试使用代理更新（先连上一个可用节点再更新）

## 参考来源

* FlClash GitHub README：[https://github.com/chen08209/FlClash（查阅于](https://github.com/chen08209/FlClash（查阅于) 2026-09-14）
* FlClash Releases（v0.8.98，2026-09-14）：[https://github.com/chen08209/FlClash/releases（查阅于](https://github.com/chen08209/FlClash/releases（查阅于) 2026-09-14）
* Clash Verge Rev 扩展脚本文档：[https://www.clashverge.dev/guide/script.html（查阅于](https://www.clashverge.dev/guide/script.html（查阅于) 2026-09-14）
